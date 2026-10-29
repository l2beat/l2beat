# What is discovery?

Discovery is a tool to explore contracts and their dependencies associated with a project.

To view the current state of discovery, see [https://um-prod.l2beat.com/status/discovery](https://um-prod.l2beat.com/status/discovery)

# To run discovery

Install `l2b` as described in [its README](../l2b/README.md).
Run discovery from the `packages/config` directory.
It needs a `.env` file there, see _RPC configuration_ below.

- `l2b discover <project>` discovers one project.
- `l2b discover <address>` discovers every project that contains the address. It's useful when a shared multisig changes. A chain-prefixed address (`eth:0x…`) matches only on that chain.
- `l2b discover --help` prints all the flags.

How to research a project with these commands, level by level, is in [`packages/config/src/projects/AGENTS.md`](../config/src/projects/AGENTS.md).

# To run the discovery UI

`l2b ui` runs the discovery UI on http://localhost:2021/ui.

# AI templatizer

`l2b discover … --ai` lets a language model write `template.jsonc` files for verified contracts that have none, and `--ai-revisit` lets it propose additions to templates that already match. It runs only locally, never in the backend. How it works, what it checks and deliberately does not check, and how it is benchmarked is specified in [docs/mdbook/specs/l2b_specs/ai_templatizer.md](../../docs/mdbook/specs/l2b_specs/ai_templatizer.md). Read that document before changing anything under `src/discovery/templatizer/`, and update it in the same change whenever the behaviour changes: it is the description of record.

# RPC configuration

Discovery reads from two sources: the chain's RPC and its explorer.
The supported chains, with their explorers, are in [src/config/chains.ts](./src/config/chains.ts).
Adding a chain means adding an entry there.

- `<CHAIN>_RPC_URL_FOR_DISCOVERY` - the RPC of the chain, e.g. `ETHEREUM_RPC_URL_FOR_DISCOVERY`.
- `ETHERSCAN_API_KEY_FOR_DISCOVERY` or `ETHERSCAN_API_KEY` - needed for chains that use Etherscan. Chains that use Blockscout need no key.
- `<CHAIN>_EVENT_RPC_URL_FOR_DISCOVERY` - (optional) a separate RPC for logs. Discovery asks for logs from block 0 to the discovered block in one request. It halves the range only when the RPC answers `Log response size exceeded` or asks for a smaller block range, so use an RPC without a block-range limit.
- `<CHAIN>_BEACON_API_URL_FOR_DISCOVERY` - (optional) a beacon API, for handlers that read blobs.

Example .env file

```
# Shared EtherScan API key
ETHERSCAN_API_KEY=<API_KEY>

# Always starting from Ethereum
ETHEREUM_RPC_URL_FOR_DISCOVERY=<RPC_URL>
ETHEREUM_BEACON_API_URL_FOR_DISCOVERY=<BEACON_URL>                           # (optional)
ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY=<RPC_URL_THAT_SUPPORTS_UNLIMITED_RANGE> # (optional)

# But some of the handlers are going to switch to Arbitrum and fetch info from there
ARBITRUM_RPC_URL_FOR_DISCOVERY=<RPC_URL>
```

Do not commit your RPC keys.

# Discovery documentation

## Project config

A project is a folder `packages/config/src/projects/<project>/` with a `config.jsonc`.
Discovery writes `discovered.json` and `diffHistory.md` next to it.
One project can span several chains.

- `$schema` - `"../../../../discovery/schemas/config.v2.schema.json"`
- `name` - the name of the project.
- `import` - config files merged into this one, usually `["../globalConfig.jsonc"]`.
- `initialAddresses` - the chain-prefixed addresses discovery starts from, e.g. `eth:0x…` or `arb1:0x…`. Discovery reads every value of these contracts and follows the addresses it finds.
- `maxDepth` - (optional) how many levels of addresses discovery follows. Unlimited by default.
- `maxAddresses` - (optional) how many addresses discovery analyzes, 100 by default. Discovery skips the rest and says so.
- `names` - (optional) names by address, e.g. `Bridge` instead of `Bridge_v1`.
- `overrides` - (optional) settings by address, see [Overrides](#overrides).
- `types` - (optional) formatting configurations, see [`format`](#format).

By default, discovery calls only view methods without arguments, and methods with one `uint256` argument at indices 0 to 4.
Everything else needs a [handler](#handlers).

**Example:**

```json
{
  "$schema": "../../../../discovery/schemas/config.v2.schema.json",
  "name": "project_a",
  "import": ["../globalConfig.jsonc"],
  "initialAddresses": ["eth:0x1234…", "arb1:0x5678…"],
  "names": {
    "eth:0x1234…": "Bridge"
  },
  "overrides": {
    "eth:0x1234…": {
      "fields": {
        "field_a": {
          "handler": { "type": "storage", "slot": 1 }
        }
      },
      "ignoreMethods": ["method_a"],
      "ignoreInWatchMode": ["method_c"]
    },
    "arb1:0x5678…": {
      "ignoreDiscovery": true
    }
  }
}
```

## Overrides

An override sets how discovery treats one address of this project.
A template takes the same keys and applies to every contract with its source.
Templates cannot set `ignoreDiscovery`.
The keys used most, all optional:

- `fields` - fields to add or change, by name. A field takes a `handler` or a `copy`, an optional `edit`, and its `description`, `severity` and `permissions`.
- `ignoreMethods` - methods discovery does not call.
- `ignoreRelatives` - fields whose addresses discovery does not follow, or `true` for all of them. A handler takes `ignoreRelative` (without the `s`) instead.
- `ignoreDiscovery` - if `true`, discovery does not analyze this contract.
- `ignoreInWatchMode` - fields whose changes the update monitor does not report.
- `proxyType` - the proxy type, when discovery does not detect it. One of the values in [the schema](./schemas/contract.v2.schema.json), e.g. `"immutable"`.

Every key is in [schemas/contract.v2.schema.json](./schemas/contract.v2.schema.json).

## Where discovery must stop

Discovery follows each address that it reads from a contract. Some of these addresses refer to contracts of a different project. An example is the Sky (Maker) contracts that hold `DAI`. If discovery follows them, `discovered.json` gets many contracts that are not part of your project.

There are three ways to stop discovery. Use the narrowest one that is sufficient.

### Do not follow one field

Add the field to `ignoreRelatives` in the override of the contract. Discovery keeps the value of the field. Discovery does not analyze the address in the field.

Use this when one contract has one pointer to an external contract.

### Do not analyze one contract

Add an override for the address with `ignoreDiscovery: true`. Discovery does not analyze the contract. There is no entry for the contract in `discovered.json`. The address stays only as a value in the contracts that refer to it.

Use this when more than one contract refers to the same external address. Each project that reaches the address must have this override.

### Make the contract a reference to a shared project

Make the external contracts the entrypoints of a shared project. Discovery then stops at them in every project. It writes a `Reference` entry with the name of the contract and `targetProject`. It does not analyze the contract or the contracts that it refers to.

Use this when:

- More than one project reaches the same contracts.
- You want the entry to show the project that the contract belongs to.

You do not need to discover the shared project fully. A shared project that is only a boundary has `maxDepth: 0`. Discovery then analyzes only the contracts in `initialAddresses`.

To make a shared project that is only a boundary:

1. Make the directory `packages/config/src/projects/shared-<name>`.
2. Make `config.jsonc` in that directory. Put `"maxDepth": 0` in it. Put the boundary contracts in `initialAddresses`.
3. Run `l2b discover shared-<name>`.
4. Remove the errors from `discovered.json` with `ignoreMethods`. Put the values that change often in `ignoreInWatchMode`. The update monitor discovers the shared project each day.
5. Run `l2b generate-entrypoints shared-<name>`. This writes `entrypoints.json` with all the contracts in `initialAddresses`.
6. Add `"../projects/shared-<name>/entrypoints.json"` to `packages/config/src/projects/globalEntrypoints.jsonc`.
7. Run discovery again for each project that reaches one of these contracts.

Note: The name must start with `shared-`. The config tests then do not look for a project page with that name.

Note: Discovery checks the entrypoints before it checks `maxDepth`. If a relative of a boundary contract is an entrypoint of a different project, the shared project gets a `Reference` to that project. To prevent this, add `"ignoreRelatives": true` to the override of the boundary contract.

## Handlers

A handler reads a field's value. It goes under `handler` in the field:

```json
{
  "fields": {
    "guardian": {
      "handler": { "type": "storage", "slot": 3, "returnType": "address" }
    }
  }
}
```

The examples below show only the handler.
These parameters mean the same in every handler that takes them:

- `type` - the handler type, given in each example.
- `method` - (optional) the name or the human-readable ABI of the method to call. Without it, the field name is used.
- `ignoreRelative` - (optional) if `true`, discovery keeps the value but does not analyze the addresses in it. Use it for addresses that are not part of the project.
- `returnType` - (optional) how to read a 32-byte word: `"address"`, `"bytes"` (default) or `"number"`. `storage` also takes `"uint8"`, which reads the last byte.
- A parameter that takes a reference accepts `"{{ name }}"`, the value of the field `name`.

### Storage handler

Reads values directly from storage, e.g. `private` variables.

**Parameters:**

- `slot` - one of:
  - a number, e.g. `1`
  - a hex string, e.g. `"0x1234"`
  - a reference, e.g. `"{{ value }}"`
  - an array of the above. The values are hashed into the slot of a mapping entry. For an `address => boolean` mapping at slot `5`, the slot of one address is `[5, "0x6B175474E89094C44Da98b954EedeAC495271d0F"]`. Mappings keyed by `bytes4` or `string` are not supported, as their slots are computed differently. Precompute such a slot with `cast index`.
- `offset` - (optional) added to the slot, e.g. to reach one field of a large struct.
- `returnType`, `ignoreRelative`

**Examples:**

Read the storage at slot `5`:

```json
{ "type": "storage", "slot": 5 }
```

Read the `[1][2]` value of a `mapping(uint => mapping(uint => uint))` at slot `10`:

```json
{ "type": "storage", "slot": [10, 1, 2] }
```

Read the 5-th array element at slot `4` (Note that the resulting slot is not `9`, but `hash(4) + 5`):

```json
{ "type": "storage", "slot": [4], "offset": 5 }
```

Read the value of a mapping at slot `2` for an address returned from another field, as an address:

```json
{ "type": "storage", "slot": [2, "{{ owner }}"], "returnType": "address" }
```

### Array handler

Calls an array method, a method that takes one `uint256`, once per index.

Discovery calls such methods by default, but only at indices 0 to 4. This handler removes the limit.

**Parameters**:

- `method`, `ignoreRelative`
- `indices` - (optional) the indices to read, e.g. `[1,3,5]`, or a reference to a field that holds them.
- `length` - (optional) the number of calls, a number or a reference. Without it, the method is called until it reverts.
- `maxLength` - (optional) a guard against infinite loops, `100` by default. Reaching it is an error, so raise it for longer arrays.
- `startIndex` - (optional) the index of the first element to read, `0` by default.

**Examples:**

Read the array of another method:

```json
{ "type": "array", "method": "owners" }
```

Read the array with a full method ABI:

```json
{ "type": "array", "method": "function owners(uint256 i) view returns (uint256)" }
```

Read the array until some specific length:

```json
{ "type": "array", "method": "owners", "length": "{{ ownersLength }}" }
```

Read only the first 5 prime elements from the array:

```json
{ "type": "array", "method": "owners", "indices": [2, 3, 5, 7, 11] }
```

### Dynamic array handler

Reads the entire dynamic array whose length is stored at `slot`.
The elements are stored at `hash(slot)`, see [the Solidity docs](https://docs.soliditylang.org/en/v0.8.24/internals/layout_in_storage.html#mappings-and-dynamic-arrays).

**Parameters**:

- `slot` - a number, a hex string or a reference.
- `returnType` - (optional) only `"address"`, the default. If the array is of a different type talk with devs to extend this.
- `ignoreRelative`

**Examples:**

Read an address array with its length at slot 54, without following the addresses:

```json
{ "type": "dynamicArray", "slot": 54, "returnType": "address", "ignoreRelative": true }
```

### Call handler

Calls a view method with arguments of your choosing.
Use it for methods that take arguments discovery cannot guess.

**Parameters:**

- `method`, `ignoreRelative`
- `args` - the arguments, numbers or strings, e.g. `[1, "0x1234"]`. Strings can be references, e.g. `"{{ value }}"`. Required, `[]` for none.
- `address` - (optional) a reference to a field that holds the address to call instead of this contract. Give `method` as a full ABI then, since only this contract's ABI is loaded.
- `expectRevert` - (optional) for a method that reverts now but might change. The field then holds `"EXPECT_REVERT"`.

**Examples:**

Call the method named like the field:

```json
{ "type": "call", "args": [1, 2] }
```

Call a method by its full ABI, with another field as the argument:

```json
{
  "type": "call",
  "method": "function balanceOf(address owner) view returns (uint256)",
  "args": ["{{ admin }}"]
}
```

Call a method that currently reverts:

```json
{ "type": "call", "method": "function revertIfNotPaused()", "args": [], "expectRevert": true }
```

### Events count handler

Counts the logs of this contract that match the topics.

Use it when no getter or event shows a value, but an event shows when it changes. Arbitrum's validators were tracked this way: the count of `setValidator` calls changes when the validator set might have changed.

**Parameters:**

- `topics` - the topics to match, `null` for any.

**Examples:**

Count `OwnerFunctionCalled(uint256 indexed id)` logs with `id = 6`:

```json
{
  "type": "eventCount",
  "topics": [
    "0xea8787f128d10b2cc0317b0c3960f9ad447f7f6c1ed189db1083ccffd20f456e",
    "0x0000000000000000000000000000000000000000000000000000000000000006"
  ]
}
```

### Access control handler

Reads the roles of a contract that uses OpenZeppelin's AccessControl pattern.

Name the field `accessControl`: `ProjectDiscovery.getAccessControlField` in `packages/config` reads it by that name.

**Parameters:**

- `roleNames` - (optional) names by role hash. Without them, names come from the ABI's `*_ROLE()` methods.
- `includeEmptyRoles` - (optional) if `true`, also lists the named roles that have no members.
- `pickRoleMembers` - (optional) a role name. The field then holds only that role's members.
- `ignoreRelative`

**Examples:**

```json
{ "type": "accessControl" }
```

```json
{
  "type": "accessControl",
  "roleNames": {
    "0x3f3b3bf06419b25db8f1ac3dfb014d79b6fb633e65d1ca540c6a3c665e32e106": "GOBLIN_ROLE"
  }
}
```

### Scroll access control handler

The access control handler for Scroll's modified AccessControl pattern.
It takes `roleNames` and `ignoreRelative` like the access control handler.

```json
{ "type": "scrollAccessControl" }
```

### Linea access control handler

The access control handler for a Zodiac GnosisSafe module with an extended AccessControl pattern.
At the time of writing, only Linea is known to use this module.
It takes `roleNames` and `ignoreRelative` like the access control handler.

```json
{ "type": "lineaRolesModule" }
```

### StarkWare named storage handler

Reads values stored with StarkWare's named storage pattern.
It supports only simple values, not mappings or other types.

**Parameters:**

- `tag` - the string tag of the named storage slot.
- `returnType`, `ignoreRelative`

**Examples:**

```json
{ "type": "starkWareNamedStorage", "tag": "EXAMPLE_TAG_NAME", "returnType": "address" }
```

### StarkWare Governance handler

Reads the addresses of `event LogNewGovernorAccepted(address acceptedGovernor)` and keeps those for which a method returns true.

**Parameters:**

- `filterBy` - the method that takes an address and returns whether it is a governor.

**Examples:**

Keep the addresses for which `function starknetIsGovernor(address user) view returns (bool)` returns true:

```json
{ "type": "starkWareGovernance", "filterBy": "starknetIsGovernor" }
```

### Event handler

Replays the logs of this contract, oldest first, to build a value.
It has three modes: `add` (a list), `add` + `remove` (a set that changes) and `set` (the latest value).

**Parameters:**

- `select` - event parameter(s) to extract. Accepts a single string or array of strings (e.g., `"user"` or `["batchIndex", "chainId"]`). Dot-notation reaches into nested values, e.g. `"config.chainSelector"` for a named field. Note that decoded struct/tuple parameters are positional arrays, so a nested struct field is addressed by its index, e.g. `"config.1"` for the second field of a `config` struct.
- `groupBy` - (optional) groups results by the specified event parameter. Returns an object with grouped keys when used. Supports the same dot-notation as `select`, e.g. `"config.1"` to group by a field nested inside a struct parameter.
- `ignoreRelative`
- `flatten` - (optional, add/remove only) expands array-valued selected fields into one row per element.
- `dedupBy` - (optional, add/remove only) field(s) that define row identity; later add/remove match on these while other selected fields stay in the output. Defaults to `select`.
- `add` - (optional) the events that add entries:
  - `event` - event name(s), a string or an array. Several events must share the selected parameters.
  - `where` - (optional) a filter in the [edit language](#edit), e.g. `["=", "#chainId", 1]`. `#name` reads an event parameter.
- `remove` - (optional) the events that remove entries, same structure as `add`.
- `set` - (optional) the events that set the value, same structure as `add`. The last matching log wins.

Use `add`, `add` + `remove` or `set`, these modes are mutually exclusive.
With `groupBy`, each group is processed on its own.

**Examples:**

All registered users. `Register(alice) → Register(bob) → Register(alice)` gives `["alice", "bob"]`:

```json
{ "type": "event", "select": "user", "add": { "event": "Register" } }
```

The users in a registry. `Add(alice) → Add(bob) → Remove(alice)` gives `["bob"]`:

```json
{
  "type": "event",
  "select": "user",
  "add": { "event": "Add" },
  "remove": { "event": "Remove" }
}
```

The latest batch index. `CurrentBatch(1) → CurrentBatch(2)` gives `2`:

```json
{ "type": "event", "select": ["batchIndex"], "set": { "event": "CurrentBatch" } }
```

The latest batch index per chain. `CurrentBatchMultichain(1, 10) → CurrentBatchMultichain(2, 20) → CurrentBatchMultichain(3, 10)` gives `{ 10: 3, 20: 2 }`:

```json
{
  "type": "event",
  "select": ["batchIndex"],
  "set": { "event": "CurrentBatchMultichain" },
  "groupBy": "chainId"
}
```

The latest batch index on chain 1 only:

```json
{
  "type": "event",
  "select": ["batchIndex"],
  "set": { "event": "CurrentBatchMultichain", "where": ["=", "#chainId", 1] }
}
```

The latest version from two upgrade events, which both have a `version` parameter:

```json
{
  "type": "event",
  "select": ["version"],
  "set": { "event": ["UpgradeV1", "UpgradeV2"] }
}
```

### Constructor args handler

Decodes the arguments the contract was deployed with, using the constructor in its ABI.
The field must be named `constructorArgs`.

**Parameters:**

- `nameArgs` - (optional, default: false) if true, the arguments are decoded into an object keyed by their names.

**Examples:**

```json
{ "type": "constructorArgs", "nameArgs": true }
```

### Hardcoded handler

Creates a new field in the result with the value provided.

**Parameters:**

- `value` - any value you want to have in the result

**Examples:**

```json
{ "type": "hardcoded", "value": 9 }
```

### Arbitrum actors handler

Extracts an array of actors from the Arbitrum stack. Both validators and batch posters are encoded the same way so using this handler you can extract either.

**Parameters:**

- `actorType` - one of two literals: `"validator"` or `"batchPoster"`

**Examples:**

```json
{ "type": "arbitrumActors", "actorType": "batchPoster" }
```

### Arbitrum DAC keyset handler

Extracts the DAC keyset from projects based on Orbit stack.

**Examples:**

```json
{ "type": "arbitrumDACKeyset" }
```

### Arbitrum Sequencer version handler

Extracts the sequencer version from data posted by projects based on Orbit stacks.
Using this value you can determine if the data is posted to L1 or to a DAC.

**Examples:**

```json
{ "type": "arbitrumSequencerVersion" }
```

### Optimism DA handler

Downloads at most the ten latest transactions the sequencer sent to L1 and compares their calldata length to see if it looks like the rollup is posting data to an external DA, like Celestia.

**Parameters:**

- `sequencerAddress` - the address of the sequencer

**Examples:**

```json
{ "type": "opStackDA", "sequencerAddress": "{{ batcherHash }}" }
```

### Optimism Sequencer inbox handler

Extracts the address the sequencer posts its calldata to.

**Parameters:**

- `sequencerAddress` - the address of the sequencer

**Examples:**

```json
{ "type": "opStackSequencerInbox", "sequencerAddress": "{{ batcherHash }}" }
```

### Event trace handler

Traces the calls to a function inside the transactions that emitted an event.

The handler works by:

1. Finding all transactions where a specified event was emitted from the contract
2. Getting the debug trace for each of those transactions
3. Traversing the trace to find calls to a specified function
4. Decoding and returning the call data for those function calls

**Parameters:**

- `event` - the name of the event to search for in transactions (must be a part of the ABI)
- `function` - the name of the function whose calls should be traced and decoded (must be a part of the ABI)

**Examples:**

The decoded `executeProposal` calls of every transaction that emitted `ProposalCreated`:

```json
{ "type": "eventTrace", "event": "ProposalCreated", "function": "executeProposal" }
```

## Cache

Discovery caches the responses of RPC and Etherscan calls, discovering on the same block is going to use the cache, thus speeding it up.
Cache is stored in `cache/discovery.sqlite`, if you're encountering some weird behaviour try to remove the cache and retry discovering.

## Flattener

Discovery downloads the sources of all contracts that it finds from the configured explorer.
These sources can be directly saved to disk by providing the `--save-sources` flag.
By default, this flag is disabled because the tool prioritizes saving flattened sources.

A flattened source consists of the source code that directly affects the published bytecode, concatenated into a single string.
This process is managed by a module called the flattener.
The flattener takes as input all files that make up a single contract, along with the remappings used during compilation.
The resulting flattened files are saved to the .flat directory in the project folder.

For contracts that have a proxy, the tool saves them as directories.
Inside these directories, you’ll find the flattened sources of both the proxy and its implementations.
Proxy files are given a .p.sol suffix, while implementation files, if there is more than one, are numbered with suffixes like .2.sol.

If a contract does not have a proxy, its source code is saved directly into the .flat directory without a containing folder.

You can configure the name of the output folder through the `--sources-folder` and `--flat-sources-folder`.

## Edit

### In what situation would I use edit?

Values returned from a handler are not always in the shape you want them to be.
That's problematic if you want to use a value in a description.
Say for example the project has a method to return the entire configuration of the system.
After calling it you get something like this:

```json
{
  "systemConfig": {
    "pauseDelay": 604800,
    "ethToPause": 1000000000000000000
  }
}
```

You want to describe the ability to pause the system if you have enough ETH.
A description can reference a field, but not a key inside it, so the following does not work:

```json
{
  "description": "To pause the system you need {{ systemConfig.ethToPause }} ETH."
}
```

The solution is to use the `edit` feature, it allows you to transform the value of a field similar to filter chaining in `jq`.
In this case, you want to `get` the `ethToPause` field from the `systemConfig` field and then type cast it with `Undecimal18`.

```json
{
  "fields": {
    "ETH_TO_PAUSE": {
      "copy": "systemConfig",
      "edit": ["pipe", ["get", "ethToPause"], ["format", "Undecimal18"]]
    }
  }
}
```

### What's the idea behind the edit language?

The edit language is called blip (Bracket LISP) and it takes inspiration from LISP and JQ as it's based on operations called filters.
Filters are defined with lists, the first element defines the filter and the rest of the elements are the arguments.
Just like in JQ, the dataflow is modelled with pipes, data output of the first filter is the input of the second filter.
All filters have the input value piped in, perform processing and produce an output value.
In the example above, `["get", "ethToPause"]` extracts a key of the copied value, and `["format", "Undecimal18"]` formats its input.
A string that starts with `#` reads that key of the input, e.g. `"#chainId"`.

### Filters

- `pipe`, chains multiple filters sequentially.
- `map`, applies a filter to each element in an array.
- `sort`, returns a new array sorted in ascending order, optionally by a computed key.
- `pick`, selects specific keys from an object.
- `get`, retrieves a value using a key or index path.
- `set`, updates a value at a specific key or index path.
- `filter`, creates a new array with all elements that pass the filter.
- `find`, returns the first element that passes the filter.
- `<`, less-than comparison of numbers or strings.
- `>`, greater-than comparison of numbers or strings.
- `=`, equality.
- `!=`, inequality.
- `not`, negation.
- `and`, true when every argument is.
- `env`, reads a value from the discovery environment.
- `format`, applies the selected type caster.
- `if`, conditional logic (if/then/else).
- `delete`, removes keys/indices from objects/arrays.
- `shape`, creates a new object from input values using specified keys.
- `to_entries`, converts an object to an array of key-value pairs.
- `length`, returns the number of elements in arrays, objects, or strings.
- `map_values`, applies a filter to each value of an object.
- `map_keys`, applies a filter to each key of an object.

#### `pipe`

Combines multiple filters into a single filter with pipes.
The input to the filter is immediately passed to the first filter in the chain.
Output of the first filter is passed to the second filter, and so on.
Last filter's output is the output of the pipe.
When no filters are specified, the input is passed through.

- Input: `{ a: 1 }`
- Program: `["pipe", ["get", "a"], ["=", 1]]`
- Output: `true`

#### `map`

Applies a filter to each element of an array producing a new array.
The input has to be an array.
The second argument must be a single filter expression that will be applied to each element.

- Input: `[1, 2, 3]`
- Program: `["map", ["=", 2]]`
- Output: `[false, true, false]`

#### `sort`

Returns a new array sorted in ascending order. The sort is stable and deterministic.
When called with no arguments the elements are compared directly.
When given a single filter argument, each element is sorted by the value that filter produces (its sort key).
Useful for normalizing set-like arrays (e.g. a list of addresses or DON nodes) so that a pure reordering produces no diff.

- Input: `[3, 1, 2]`
- Program: `["sort"]`
- Output: `[1, 2, 3]`

- Input: `[{ id: "b" }, { id: "a" }]`
- Program: `["sort", ["get", "id"]]`
- Output: `[{ id: "a" }, { id: "b" }]`

#### `pick`

Takes an object as input and returns a new object that contains only the keys specified in the arguments.
Multiple arguments are allowed.
Arguments can be other filters that result in a string value that indicates the key to pick.
If the key is not found in the input object, it is ignored.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["pick", "a", "c", "z"]`
- Output: `{ a: 1, c: 3 }`

- Input: `{ a: 1, b: 2, keyToPick: "a" }`
- Program: `["pick", ["get", "keyToPick"]]`
- Output: `{ a: 1 }`

### `get`

Accesses a property of an object or index of an array.
The access is specified as a string for objects and a number for arrays.
Types of accesses can be mixed.
During runtime the access is checked to make sure the type is correct.
Multiple arguments are allowed, they are applied from left to right.

- Input: `{ a: 1, b: { c: 2 } }`
- Program: `["get", "b", "c"]`
- Output: `2`

- Input: `[1, 2, 3]`
- Program: `["get", 1]`
- Output: `2`

- Input: `[{ a: 1 }, { a: 2 }, { a: 3 }]`
- Program: `["get", 1, "a"]`
- Output: `2`

### `set`

Accesses a property of an object or index of an array in the same fashion as `get`.
The found value is replaced with the value returned by the filter provided.
Path can be a string or a number or an array of strings or numbers, look at `get` for more details.
The third argument must be a literal value or a single filter expression.
If it's a filter, it receives the original value at the specified path as its input before computing the new value.

- Input: `{ a: 1, b: { c: 2 } }`
- Program: `["set", ["b", "c"], "BLIP"]`
- Output: `{ a: 1, b: { c: "BLIP" } }`

- Input: `{ count: 5 }`
- Program: `["set", "count", ["=", 1]]`
- Output: `{ count: false }`

### `filter`

Filters an array based on a predicate which itself is a filter.
An element is kept when the predicate returns true.
The second argument must be a single filter expression that will be applied to each element.

- Input: `[1, 2, 3, 4, 5]`
- Program: `["filter", ["=", 2]]`
- Output: `[2]`

### `find`

Works like `filter` but returns the first element that passes the filter.
If no element passes the filter the runtime throws an error.
The second argument must be a single filter expression that will be applied to each element.

- Input: `[{ a: 1, v: 42 }, { a: 2, v: 43 }, { a: 3, v: 43 }]`
- Program: `["find", ["pipe", ["get", "v"], ["=", 43]]]`
- Output: `{ a: 2, v: 43 }`

### `<`

Compares values, returning `true` when the first operand is less than every other operand.
Both operands of each comparison must be two numbers or two strings, otherwise the runtime throws.
With a single argument the input value is compared against it (`input < arg`).
With multiple arguments only the first operand is compared against each of the rest.
It does not compare adjacent pairs, so it is not a strict-ordering (ascending sequence) check.
For example `["<", 0, ["get", "n"], 10]` on `{ n: 100 }` is `true` because it checks `0 < 100` and `0 < 10`, even though the sequence `0, 100, 10` is not ascending.
Together with `=`, `!=` and `>` it forms the comparison operators.

- Input: `1`
- Program: `["<", 2]`
- Output: `true`

- Input: `{ n: 10 }`
- Program: `["pipe", ["get", "n"], ["<", 5]]`
- Output: `false`

- Input: `{ n: 100 }`
- Program: `["<", 0, ["get", "n"], 10]`
- Output: `true`

### `>`

Works like `<` but returns `true` when the first operand is greater than every other operand.
It compares the first operand against each of the rest, not adjacent pairs, so it is likewise not a strict-ordering check.

- Input: `3`
- Program: `[">", 2]`
- Output: `true`

### `=`

Strict equality.
With a single argument the input value is compared against it.
With multiple arguments the first is compared against each of the rest, and all must be equal.

- Input: `2`
- Program: `["=", 2]`
- Output: `true`

- Input: `{ a: 1, b: 1 }`
- Program: `["=", ["get", "a"], ["get", "b"]]`
- Output: `true`

### `!=`

Strict inequality.
With a single argument the input value is compared against it.
With multiple arguments it is `true` when the first differs from any of the rest.

- Input: `1`
- Program: `["!=", 2]`
- Output: `true`

### `not`

Negates its argument, or the input when there is none.

- Input: `{ paused: false }`
- Program: `["not", ["get", "paused"]]`
- Output: `true`

### `and`

Returns `true` when every argument is truthy.

- Input: `{ a: true, b: false }`
- Program: `["and", ["get", "a"], ["get", "b"]]`
- Output: `false`

### `format`

Formats a value with a type caster.
The single argument is the name of a built-in caster, e.g. `FormatSeconds`, or of a type defined under `types`.
The name must start with an uppercase letter.

- Input: `60`
- Program: `["format", "FormatSeconds"]`
- Output: `1m`

A type names a caster in `typeCaster` and gives its argument in `arg`:

```json
{
  "types": {
    "Undecimal9": { "typeCaster": "Undecimal", "arg": { "decimals": 9 } },
    "VersionMapping": {
      "typeCaster": "Mapping",
      "arg": { "3622689": "v2.1", "25526433": "v3.0" }
    }
  }
}
```

- `Undecimal` divides by 10 to the power of `decimals`. `globalConfig.jsonc` defines `Undecimal2`, `Undecimal6`, `Undecimal18` and `Undecimal24`.
- `Mapping` replaces a value with its entry in `arg`. The keys are strings, even for numbers. A value without an entry stays as it is.
- `FormatSeconds` turns seconds into a duration, e.g. `"2d"`. It takes no `arg`.
- The other casters are in [src/discovery/type-casters](./src/discovery/type-casters/index.ts).

`types` can be defined in `globalConfig.jsonc`, in a project's `config.jsonc`, and on a contract in an override or a template.
A contract's types shadow the project's, which include the global ones it imports.

To name the elements of an array, use `shape`, not `format`.
`["shape", ["delay", ["format", "FormatSeconds"]], "offset"]` turns `[120, 1000]` into `{ delay: "2m", offset: 1000 }`.

### `if`

Takes three filters, the first is the condition, the second is the value if the condition is true, and the third is the value if the condition is false.
The third filter can be left out, then the value stays as it is when the condition is false.
The condition has to be a boolean.
Filters producing the true and false values are lazily evaluated.
If the true condition value is only a valid program when the condition is true it won't be evaluated if the condition doesn't pass.

- Input: `{ hasA: true, a: 1 }`
- Program: `["if", ["get", "hasA"], ["pick", "a"], ["pick", "b"]]`
- Output: `{ a: 1 }`

- Input: `["a", "b"]`
- Program: `["map", ["if", ["=", "a"], "first"]]`
- Output: `["first", "b"]`

### `delete`

Deletes properties of an object or elements of an array.
Multiple arguments are allowed.
Values are removed from the top level of the object or from the array.
Indices refer to the original array, so a deletion does not shift the indices after it.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["delete", "a", "b"]`
- Output: `{ c: 3 }`

- Input: `[1, 2, 3, 4]`
- Program: `["delete", 1, 2]`
- Output: `[1, 4]`

### `shape`

It takes values from the input object (processed in key insertion order) or elements from the input array (processed by index) and assigns them to the new keys specified in the arguments.
Multiple arguments are allowed, the number of keys doesn't have to match the number of input values as long as it's shorter or equal.
An argument can be a string or a two element array with the first element being the key and the second being the filter to be applied to the value.
If an argument is a `[keyName, filter]` pair, the corresponding input value is passed through the filter before being assigned.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["shape", "NEWA", "b"]`
- Output: `{ NEWA: 1, b: 2 }`

- Input: `[1, 2, 3, 4]`
- Program: `["shape", "a", ["b", ["=", 2]]]`
- Output: `{ a: 1, b: true }`

### `to_entries`

Converts an object to an array of `[key, value]` pairs, in the object's key insertion order.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["to_entries"]`
- Output: `[[ "a", 1 ], [ "b", 2 ], [ "c", 3 ]]`

- Input: `[1, 23]`
- Program: `["to_entries"]`
- Output: `[[ "0", 1 ], [ "1", 23 ]]`

### `length`

Returns the number of elements in an array, the number of properties of an object, or the length of a string.

- Input: `[1, 2, 3]`
- Program: `["length"]`
- Output: `3`

- Input: `{ a: 1, b: 2 }`
- Program: `["length"]`
- Output: `2`

- Input: `"hello"`
- Program: `["length"]`
- Output: `5`

### `map_values`

Applies a filter to each value of an object producing a new object with the same keys.
The input must be an object.
The second argument is the filter to be applied to each value.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["map_values", ["=", 2]]`
- Output: `{ a: false, b: true, c: false }`

- Input: `{ x: { n: 1 }, y: { n: 2 } }`
- Program: `["map_values", ["get", "n"]]`
- Output: `{ x: 1, y: 2 }`

### `map_keys`

Applies a filter to each key of an object producing a new object with transformed keys and the original values.
The input must be an object.
The second argument is the filter to be applied to each key (which is a string).
The filter must return a string.

- Input: `{ a: 1, b: 2 }`
- Program: `["map_keys", ["if", ["=", "a"], "first", "second"]]`
- Output: `{ first: 1, second: 2 }`

### `env`

Reads a value from the discovery environment, ignoring the piped input value.
The single argument is the key to read and must be one of the keys listed below, otherwise config validation fails.
Reading a key whose value is unavailable in the current run (e.g. `timestamp` when no timestamp is set) throws an error.

- `blockNumber` - the block number the discovery is running on.
- `timestamp` - the UNIX timestamp (in seconds) of that block.
- `chainName` - the name of the chain being discovered (e.g. `ethereum`).
- `address` - the address of the contract the field belongs to.

Because environment access is an explicit filter, plain strings are never treated as environment references. A literal such as `"$admin"` stays a literal, so patterns like `["pick", "$admin"]` keep working.

- Input: `anything`
- Program: `["env", "chainName"]`
- Output: `"ethereum"`

For example, to derive a boolean `hasExpired` field that becomes `true` once a stored expiration timestamp is in the past, `copy` the timestamp field and compare it against the environment timestamp:

```json
{
  "hasExpired": {
    "copy": "referralExpirationTime",
    "edit": ["<", ["env", "timestamp"]]
  }
}
```

### Copy feature

Copy is a useful feature when you have a value and want to create multiple views into it.
You can define a field that will take its value from the value of another field.
The ability to use the `edit` feature is still available on such a field.
A field takes either a `handler` or a `copy`, not both.

Example configuration:

```json
{
  "accessControlTargets": {
    "copy": "accessControl",
    "edit": ["get", "targets"]
  }
}
```
