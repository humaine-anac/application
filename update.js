const fs = require('fs');
const { join } = require('path');
const GitHub = require('github-api');
const modules = require('./build/modules');

const gh = new GitHub();

let dirty = false;
const promises = [];

for (let key in modules) {
  const module = modules[key];
  const matches = module.url.match(/https:\/\/github.com\/([a-z0-9_-]+)\/([a-z0-9_-]+)(?:.git)?/);
  if (!matches) {
    continue;
  }
  promises.push(new Promise((resolve) => {
    const project = gh.getRepo(matches[1], matches[2]);
    project.getRef('heads/master').then((res) => {
      if (module.commit !== res.data.object.sha) {
        console.log(`Updating ${key}: ${module.commit} -> ${res.data.object.sha}`);
        dirty = true;
        module.commit = res.data.object.sha;
      }
      resolve();
    });
  }));
}

Promise.all(promises).then(() => {
  if (dirty) {
    fs.writeFileSync(
      join(__dirname, 'build', 'modules.json'),
      JSON.stringify(modules, null, 4) + "\n"
    );
  }
});
