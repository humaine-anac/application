const { execSync } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const modules = require('./build/modules');

const build_dir = join(__dirname, 'build');
const module_dir = join(build_dir, 'modules');
const dist_dir = join(__dirname, 'dist');

function getModule(key, package) {
  console.log(`Dealing with ${key}:`);
  if (!fs.existsSync(join(module_dir, key))) {
    console.log(`-> Cloning`);
    execSync(`git clone ${package.url} ${join(module_dir, key)}`, {stdio: 'ignore'});
  }

  console.log(`-> Checking out ${package.commit}`);
  execSync(`git checkout ${package.commit}`, {
    stdio: 'ignore',
    cwd: join(module_dir, key)
  });

  console.log(`-> npm install`);
  execSync(`rm -rf node_modules`, {
    stdio: 'ignore',
    cwd: join(module_dir, key)
  });
  execSync(`npm install --production`, {
    stdio: 'ignore',
    cwd: join(module_dir, key)
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
execSync(`node_modules/.bin/pkg --out-path ${dist_dir} --targets ${targets} build`);
