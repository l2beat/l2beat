# Adding a new project to L2BEAT discovery

Goal: build the contracts and permissions map of a project.

How discovery works: you write a `config.jsonc` (the question) and the discovery engine calls public methods in the contracts, and if an address is returned it continues recursively, to ultimately build a graph through a BFS walk. Some values that do not have public getters might also be automatically discovered, like `$admin` or `$implementation`, usually prefixed with `$`. The output is saved in a `discovered.json`. The `.flat/` folder includes the discovered smart contract source codes, conveniently flattened.

Unless asked otherwise, a project discovery should include all but only addresses that are part of the project being studied. Addresses that are discovered but are external dependencies should be ignored using directives like `ignoreRelatives`. 

Steps:
1. start in config package.
2. `l2b init <name> <chain> 0x...seed contract... --max-addresses 50`. All supported chains can be found in `packages/shared-pure/src/types/ChainSpecificAddress.ts`.
3. run discovery: `l2b discover <name>`. Subsequent runs can use `--dev` flag to rediscover on the previous block which uses the cache and is therefore very fast.
4. learn how templates work. A template is applied when the bytecode of a contract exactly matches. Overrides that apply to all deployments with the same bytecode should be added to a template, if there is something exactly specific to this project that does not apply generally it should then be put in `config.jsonc`. It is way more likely than something goes in a template. Make sure that templates are created for the implementation address and never the proxy address. Learn how to use `l2b add-shape`. Templates live in `packages/config/src/projects/_templates/`.
5. Discover all addresses. Not all are discovered on first pass because not all have a simple public getter. Use `python3 ~/work/analyze/scripts/coverage_prototype.py ~/work/l2beat/packages/config/src/projects/<project>` to check whether we are discovering all contracts. Check if `https://github.com/l2beat/l2beat/pull/12088` has been merged, if not, reimplement `ignoreInCoverage` and use it. Adresses that are not automatically extracted need a handler to be extracted. Study how handler works and what are available. If an event handler should be used, try `l2analyze run storage-write-events <path-to-project>/.flat/<contract>.sol` to see all events emitted when writing a variable. Coverage should be 100%!
6. Ignore addresses that do not belong to the core project. An address that is ignored might still appear because it is references by another field. Use `l2b why` and `l2b inspect` to help you. Since projects with a lot of referenced addresses tend to explode quickly, use `l2b leaks`. Prefer ignoring relatives than ignoring discovery since it's more robust. If in doubt, read the smart contract source code in `.flat`. It is of utmost importance that we do not ignore relevant components.
7. Try to extract as much as possible and clean discovery from external dependencies as much as possible before increasing the max addresses in `config.jsonc`. Do it slowly otherwise discovery explodes. In the end, the max addresses should be greater than total contracts so that we have them all.
8. If a field errors, it should be resolved either by handling it correctly with a handler or more likely by ignoring it with `ignoreMethods`.

