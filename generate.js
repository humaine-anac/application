const { execSync } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const rimraf = require('rimraf');
const modules = require('./build/modules');

const build_dir = join(__dirname, 'build');
const module_dir = join(build_dir, 'modules');
const dist_dir = join(__dirname, 'dist');

function getModule(key, package) {
  const this_module_dir = join(module_dir, key);
  console.log(`Dealing with ${key}:`);
  if (!fs.existsSync(this_module_dir)) {
    console.log(`-> Cloning`);
    execSync(`git clone ${package.url} ${this_module_dir}`, {stdio: 'ignore'});
  }

  console.log(`-> Checking out ${package.commit}`);
  execSync(`git checkout ${package.commit}`, {
    stdio: 'ignore',
    cwd: this_module_dir
  });

  console.log(`-> npm install`);
  // we delete the node modules folder as npm install will leave
  // old stuff behind
  rimraf.sync(join(this_module_dir, 'node_modules'));
  execSync(`npm install --production`, {
    stdio: 'ignore',
    cwd: this_module_dir
  });
  console.log();
}

if (!fs.existsSync(module_dir)) {
  fs.mkdirSync(module_dir);
}

for (let key in modules) {
  getModule(key, modules[key]);
}

const node_version = 'node12';

const targets = [
  'macos',
  'linux',
  'win'
].map((target) => node_version + '-' + target).join(',');

console.log(`building: ${targets}`);
execSync(`${join(__dirname, 'node_modules', '.bin', 'pkg')} --out-path ${dist_dir} --targets ${targets} build`);
