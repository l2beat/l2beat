# L2BEAT 💓

L2BEAT (Layer 2 Beat) is a website dedicated to providing research and statistics about the very exciting layer 2 technology on Ethereum.

You can visit the site yourself at https://www.l2beat.com/.

## Contributing

We welcome and encourage contributions. To learn about the project structure and contributions please read [`CONTRIBUTING.md`](https://github.com/l2beat/l2beat/blob/main/CONTRIBUTING.md).

🔍 Here is also a visual step-by-step guide for creating a Pull Request - [link](https://www.notion.so/l2beat/How-to-add-milestones-0e8684a83c3c48ce8bc7b605d9c9a1bf)

## License

We believe in knowledge sharing and open access. Our code is and will remain open source with the permissive MIT license.

## Versioning and publishing (tooling)

Some of the sub-packages are published to NPM. We use a tool called [changesets](https://github.com/changesets/changesets) to manage versioning, cross-dependency versioning and publishing new versions to NPM.  When you make a change, before merging to main:

- run `pnpm changeset` and mark the packages you wish to publish, select what kind of a change it is (major,minor,patch) and provide the summary of the changes

When you want to publish all previous changes to NPM:

- now run `pnpm changeset version`, this will change the generated `.changeset/file.md` into an entry into `CHANGELOG.md` and `package.json` in changed packages

After your PR with changed `CHANGELOG.md` and `package.json` is merged into `main`, a CI step will run which will try to publish all changes.
