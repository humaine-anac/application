const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

const processes = [];

const base_dir = path.join(
  (process.pkg) ? path.resolve('/snapshot', 'build') : __dirname,
  'modules'
);

for (let entry of fs.readdirSync(base_dir, {withFileTypes: true})) {
  if (entry.isDirectory()) {
    const package_file = path.join(base_dir, entry.name, 'package.json');
    if (!fs.existsSync(package_file)) {
      continue;
    }
    const entry_package = JSON.parse(fs.readFileSync(package_file, {encoding: 'utf8'}));
    if (!entry_package.main) {
      console.error(`> Could not find "main" for ${entry.name}`);
      continue;
    }

    const p = fork(path.join(base_dir, entry.name, entry_package.main), [], {stdio: 'pipe'});
    p.on('error', (data) => console.log(data));
    console.log(`Started ${entry.name}: ${p.pid}`);
    // the slice here is to strip an extra \n that gets appended to all data
    p.stdout.on('data', (data) => console.log(`${entry.name}: ${data.toString().slice(0, -1)}`));
    p.stderr.on('data', (data) => console.error(`${entry.name}: ${data.toString().slice(0, -1)}`));
  }
}

process.on('exit', () => {
  for (let p of processes) {
    p.kill();
  }
});
