# application

Repository to hold releases of the HUMAINE environment, and necessary
scripts to generate it.

## Getting the application

For people looking to write their own agents for the environment, we
recommend going to https://github.com/humaine-anac/application/releases/latest
and downloading the binary that corresponds with your system.

## Generating application binary

If you wish to generate an application binary, just run the generate.js
script as follows:

```bash
node generate.js
```

As part of it, it handles getting all modules, checking them out to a specific
revision, and then running `npm install --production` to get their dependencies.
The modules, and their revisions, are defined in the
[build/modules.json](https://github.com/humaine-anac/application/blob/master/build/modules.json)
file. Usually, this should be the only file you need to touch in this repo.

## Releasing new version

This repository uses [GitHub Actions](https://github.com/features/actions) to handle
automatically generating new releases for any new commit on master. As part of the
workflow, it runs `generate.js`, and then uploads the artifacts to the release page.
