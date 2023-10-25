## Versioning and publishing

All of the sub-packages in this repository follow the [semver](https://semver.org/) system.
We use a tool called [changesets](https://github.com/changesets/changesets) to manage versioning, cross-dependency versioning and publishing new versions to NPM.
When you make a change and you wish to publish that change to NPM you should commit all the changes and follow these steps:

- run `yarn changeset` and mark the packages you wish to publish, select what kind of a change it is (major,minor,patch) and provide the summary of the changes
- now run `yarn changeset versions`, this will change the generated `.changeset/file.md` into an entry into `CHANGELOG.md` and `package.json` in changed packages

After your PR with changed `CHANGELOG.md` and `package.json` is merged into `main`, a CI step will run which will try to publish all change changes.
