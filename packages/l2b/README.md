`l2b` is a collection of commands that were found to be useful during the research process.
It takes inspiration from the `cast` command found in `foundry`, it works very similar to it.
To access a command you first run `l2b` followed by the subcommand you want to run.
Just as `cast`, `l2b` is self-explorable, allowing you to explore the available commands and their usage, all commands accept the `--help` flag.

# How to build or update

The easiest way to use `l2b` is to install it with `npm` globally on your system.
To do it run `npm install -g .` in this directory or run `pnpm l2bup`.
After that you can just run `l2b` as a regular binary in the shell.
If you want to update `l2b` to the latest version, run it's enough to run `pnpm build` in `l2b` or `pnpm build:dependencies`. You can also use `pnpm up` if you're using `l2b` globally.
