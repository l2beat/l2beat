# What is discovery?

Discovery is a tool to explore contracts and their dependencies associated with a project.

To view the current state of discovery, see [https://update-monitor-prod.l2beat.com/status/discovery](https://update-monitor-prod.l2beat.com/status/discovery)

Discovery also includes a user interface. See below for instructions on how to run that locally.

# To run discovery

To run discovery, first you need to have `l2b` installed, to do so:

- Navigate to the `l2beat/packages/l2b` directory
- `pnpm l2bup` # Will build the l2b command
- In the future, if you want to get the newest changes it is enough to run `pnpm build:dependencies`.

Running discovery requires you to be in the `l2beat/packages/config` directory.
You also MUST install an environment file called `.env` in the `packages/config` directory for discovery to work. See the _RPC configuration_ section below for information about the environment file.

- `l2b discover [chain] [project]` run discovery for the project (e.g., `pnpm discover ethereum optimism`)
- `l2b discover --help` print out all the possible switches for discovery

A list of currently supported chains is [here](https://github.com/l2beat/tools/blob/main/packages/discovery/src/config/chains.ts).
In the case you have discovery of the same project on multiple chains, you can discover all of them for a single project running: `l2b discover all [project]`.
It's possible to discover all projects that contain a given address by running `l2b discover (<chain> | all) [address]`, it's useful when a change to a shared multisig has occurred.

# To run the discovery UI

To run the discovery UI locally:

- Ensure you have `l2b` installed, check the installation instructions above if you don't have it installed.
- `l2b ui` # Will run the discovery UI on http://localhost:2021/ui

# RPC configuration

Discovery is based on two sources of information: the chain's RPC and it's explorer.
To run you will need to provide the RPC url to use: (`CHAIN_RPC_URL_FOR_DISCOVERY`).
Explorer is also required, most chains use Etherscan, for those that do use it, it's enough to configure only (`ETHERSCAN_API_KEY_FOR_DISCOVERY`).
If your chain uses Blockscout you don't need to provide it.
Chain information is already precompiled in the file mentioned [above](https://github.com/l2beat/tools/blob/main/packages/discovery/src/config/chains.ts).
It stores information as the name, chain id, configuration of the multicall contract and the explorer instance.
Adding a new chain boils down to just adding a new entry to the array and filling out all the data.

Discovery can make use of additional environment variables such as:

- `CHAIN_EVENT_RPC_URL_FOR_DISCOVERY` - if you want to use a different RPC url for getting the logs. Useful because most RPCs limit their range of queried blocks to 10k. Discovery relies on the fact that your provided RPC can ask for the entire range, starting with the 0th block and up to the latest. Possible provides of such RPCs are Alchemy and Envio (optional if your base RPC already provides that).
- `CHAIN_BEACON_API_URL_FOR_DISCOVERY` - mostly used for Ethereum and if you need to query the blobs to get some value (optional).

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

Tips:

- DO NOT commit your RPC keys to GitHub :)
- The tooling team is open to help you with any issues you encounter.

# Discovery documentation

NOTE: We use a pseudo-TS syntax to simplify parameter types here:

- `address` - string representing contract address
- `field` - string representing method/value name

## Adding new project

Create a new folder in `packages/config/src/projects/` named after the project, inside that create a folder named after the chain with `config.jsonc` inside. Then run
Example of how the folder structure should look like:

```
packages/config/src/projects/<project_name>
├─ <chain_name_1>
│  ├─ discovered.json (this will be generated)
│  └─ config.jsonc
└─ <chain_name_2>
   ├─ discovered.json (this will be generated)
   └─ config.jsonc
```

```
pnpm discover <project_chain> <project_name>
```

A file `discovered.json` will appear in this folder, showing you this project's structure. Make sure to resolve all the errors by ignoring methods or adding specific field handlers.

**Parameters:**

- `"$schema": "../../../../../discovery/schemas/config.v2.schema.json"`
- `name` - name of the project
- `chain` - chain of the project
- `initialAddresses: address[]` - array of addresses that discovery will start from. Discovery will download the contract ABI, read all the available values, and walk through all the contracts found there (`maxDepth` defaults to 7). By default, discovery checks only `view` or `constant` methods with no arguments or with exactly one argument of `uint256` (array). To check other functions you'll need to write custom handlers (see `overrides`). Sometimes the most central address is enough here, but in case of a more complex implementation, you will need to add more to cover all important contracts. Usually 3 addresses here is enough.
- `names: Record<address, string>` - (optional) key-value object, with addresses as keys. It will allow you to override the name of the contract in discovery (ex. `Bridge` instead of `Bridge_v1`)
- `overrides: Record<address, object>` - (optional) key-value object, with contracts as keys. It will allow you to ignore contracts in discovery (ex. token addresses or external contracts) or, override more complex fields and methods ([storage](#storage-handler) and [array](#array-handler) handlers).

**Example:**

```
{
  "$schema": "../../../../../discovery/schemas/config.v2.schema.json"
  chain: "ethereum",
  name: "project_a",
  initialAddresses: ["0x1234", "0x5678"],
  names: {
    "0x1234": "Bridge",
    "0x5678": "Rollup"
  },
  overrides: {
    "Bridge": {
      description: "This is a Bridge contract",
      fields: {
        field_a: {
          type: "storage",
          slot: 1
        }
      },
      ignoreMethods: ["method_a", "method_b"],
      ignoreInWatchMode: ["method_c"]
    },
    "Rollup": {
      ignoreDiscovery: true
    }
  },
}
```

## Overrides

Are the most powerful feature of discovery, they allow for:

1. Adding handlers to longer arrays (`maxLength` defaults to 5).
2. Reading values directly from storage slot (eg. for `private` variables).
3. Skipping further discovery for selected contract. Very useful when there is for example `DAI` contract in discovery and we don't want to include all `MakerDAO` contracts in our discovery.
4. Skipping further discovery of methods values (see `ignoreRelative` in e.g. [array handler](#array-handler))

**Parameters:**

All of the parameters are optional:

- `proxyType` - manual proxy override. Most of the times, discovery is smart enough to detect proxyType, useful when that's not the case
- `ignoreDiscovery: boolean` - if set to `true`, discovery will not consider this contract as a `relative`, effectively skipping discovery of this contract
- `ignoreRelatives: field[]` - discovery will not consider this contract as a `relative`. The difference between `ignoreDiscovery` and `ignoreRelatives` is that `ignoreRelatives` is configured per field, while `ignoreDiscovery` is configured per contract. Notice that `ignoreRelatives` is a field of a contract and `ignoreRelative` (without the `s`) is a field of a handler.
- `ignoreMethods: field[]` - discovery will skip this method
- `ignoreInWatchMode: field[]` - if set to `true`, the `UpdateMonitor` will not notify change of this value
- `fields: Record<field, Handler>` - custom fields that represent more complex values of the contract: ex. arrays longer than 5 and private variables

**Example:**

```
{
  "proxyType": "proxy",
  "ignoreDiscovery": true,
  "ignoreMethods": ["method_a", "method_b"],
  "ignoreRelatives": ["loopbackAddress"],
  "ignoreInWatchMode": ["method_c"],
  "fields": {
    "field_a": {
      "type": "storage",
      "slot": 1
    }
  }
}
```

## Handlers

### Storage handler

The storage handler allows you to read values directly from storage.

**Parameters:**

- `type` - always the literal: `"storage"`
- `slot` - can be one of the following:
  - a number, e.g. `1`
  - a hex string, e.g. `"0x1234"`
  - a reference to another field, e.g. `"{{ value }}"`
  - an array of the above values. In this case the values are hashed to produce a key corresponding to a mapping. Given a mapping of `address => boolean` at the storage location `5` to get the value for some specific address you should set the slot to: `[5, "0x6B175474E89094C44Da98b954EedeAC495271d0F"]`. Mappings with keys of `bytes4` (like `bytes4`) and `string` type are not supported since they use a different path for computing the slot. Quick solution to this problem is to precompute the slot using `cast index`.
- `offset` - (optional) value to be added to the slot. This is useful if whatever you are accessing is a large struct and you want to get a specific field.
- `returnType` - (optional) specifies how to interpret the resulting `bytes32` result. Possible options are `"address"`, `"bytes"` (default), `"number"`.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Read the storage at slot `5`:

```json
{
  "type": "storage",
  "slot": 5
}
```

Read the `[1][2]` value of a `mapping(uint => mapping(uint => uint))` at slot `10`:

```json
{
  "type": "storage",
  "slot": [10, 1, 2]
}
```

Read the 5-th array element at slot `4` (Note that the resulting slot is not `9`, but `hash(4) + 5`):

```json
{
  "type": "storage",
  "slot": [4],
  "offset": 5
}
```

Read the value of a mapping at slot `2` using an address returned from another field:

```json
{
  "type": "storage",
  "slot": [2, "{{ owner }}"]
}
```

Read the value of a slot and return it as address:

```json
{
  "type": "storage",
  "slot": 5,
  "returnType": "address"
}
```

### Array handler

The array handler allows you to read values by repeatedly calling an array method, that is a method that takes only one argument of type `uint256`.

Such methods are automatically called by default, but the results are limited to 5 entries. Using this handler removes this limitation.

**Parameters**:

- `type` - always the literal: `"array"`
- `method` - (optional) the name or abi of the method to be called. If omitted the name of the field is used. The abi should be provided in the human readable abi format.
- `indices` - (optional) an array of numbers, e.g. `[1,3,5]` a reference to another field, e.g. `{{ value }}` that will be used as indices to access a given array.
- `length` - (optional) a number, e.g. `3` or a reference to another field, e.g. `{{ value }}` that will be used to determine the number of calls. If this is not provided the method is called until it reverts.
- `maxLength` - (optional) a guard against infinite loops. Prevents the method to be called an excessive number of times. Defaults to `100`.
- `startIndex` - (optional) the index of the first element to be read. Defaults to `0`.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Just read the array using the field name as the method name:

```json
{
  "type": "array"
}
```

Read the array but use another method:

```json
{
  "type": "array",
  "method": "owners"
}
```

Read the array but specify full method abi:

```json
{
  "type": "array",
  "method": "function owners(uint256 i) view returns (uint256)"
}
```

Read the array until some specific length:

```json
{
  "type": "array",
  "method": "owners",
  "length": "{{ ownersLength }}"
}
```

Read a very large array:

```json
{
  "type": "array",
  "method": "owners",
  "maxLength": 1000
}
```

Read only the first 5 prime elements from the array

```json
{
  "type": "array",
  "method": "owners",
  "indices": [2, 3, 5, 7, 11]
}
```

### Dynamic array handler

Reads the entire dynamic array which length is stored at slot `x`.
To understand why you need to provide the length slot read [the Solidity docs](https://docs.soliditylang.org/en/v0.8.24/internals/layout_in_storage.html#mappings-and-dynamic-arrays).

**Parameters**:

- `type` - always the literal: `"dynamicArray"`
- `slot` - can be one of the following:
  - a number, e.g. `1`
  - a hex string, e.g. `"0x1234"`
  - a reference to another field, e.g. `"{{ value }}"`
- `returnType` - (optional) has to be address. If the array is of a different type talk with devs to extend this.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Read a dynamic array with length stored in slot 54 of type address, ignore addresses from rediscovery.

```json
{
  "fields": {
    "validators": {
      "type": "dynamicArray",
      "slot": 54,
      "returnType": "address",
      "ignoreRelative": true
    }
  }
}
```

### Call handler

The call handler allows you to call view methods with arguments of your choosing. This is especially useful for methods that take 1 or more arguments, because we don't usually know what arguments to provide to call them automatically.

**Parameters:**

- `type` - always the literal: `"call"`
- `method` - (optional) the name or abi of the method to be called. If omitted the name of the field is used. The abi should be provided in the human readable abi format.
- `args` - an array of values that will be passed as arguments to the method call, e.g. `[1, "0x1234", false]`. It supports field references, e.g. `"{{ value }}"`.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.
- `expectRevert` - a bool that specifies if the method is expected to revert. This is useful when the method currently reverts but is expected to be changed in the future.

**Examples:**

Call a method using the name of the field:

```json
{
  "type": "call",
  "args": [1, 2]
}
```

Call a method by specifying its name:

```json
{
  "type": "call",
  "method": "foo",
  "args": [false]
}
```

Call a method by providing a full abi:

```json
{
  "type": "call",
  "method": "function add(uint256 a, uint256 b) view returns (uint256)",
  "args": [3, 4]
}
```

Call a method and reference other fields in arguments:

```json
{
  "type": "call",
  "method": "function balanceOf(address owner) view returns (uint256)",
  "args": ["{{ admin }}"]
}
```

Call a method that you know currently reverts but might change it's behaviour in the future:

```json
{
  "type": "call",
  "method": "function revertIfNotPaused()",
  "expectRevert": true
}
```

### Events count handler

The call handler allows you to call amount of the emitted events from the contract with the specified topics.

**Case study: Arbitrum validators**

List of validators cannot be easily obtained from the contract, there is no getter. Additionally the method does not emit an event helpful enough to use `event` handler. But it does emit an event that can be used to determine the amount of calls of the functions `setValidator`, when count changes our bot will notify us about the possible changes in the validator set. Later developer can manually update the hardcoded list of validators.

**Parameters:**

- `type` - always the literal: `"eventCount"`
- `topics` - array of topics to filter events by.

**Examples:**

Count events with the specified topics:

```json
{
  "setValidatorCount": {
    "type": "eventCount",
    "topics": [
      // event OwnerFunctionCalled(uint256 indexed id);
      "0xea8787f128d10b2cc0317b0c3960f9ad447f7f6c1ed189db1083ccffd20f456e",
      // id == 6 is emitted inside setValidator()
      "0x0000000000000000000000000000000000000000000000000000000000000006"
    ]
  }
}
```

### Access control handler

This handler allows you to analyze a contract using OpenZeppelin's AccessControl pattern.

WARNING: Make sure that the name of this field is `accessControl`. The inversion logic depends on that.

**Parameters:**

- `type` - always the literal: `"accessControl"`
- `roleNames` - (optional) a record of bytes32 role hashes to predefined role names. Usually this handler is pretty good at guessing, so this is often unnecessary
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Analyze the contract:

```json
{
  "type": "accessControl"
}
```

Specify some names:

```json
{
  "type": "accessControl",
  "roleNames": {
    "0x3f3b3bf06419b25db8f1ac3dfb014d79b6fb633e65d1ca540c6a3c665e32e106": "GOBLIN_ROLE"
  }
}
```

### Scroll access control handler

This handler allows you to analyze a contract using Scroll's modified OpenZeppelin's AccessControl pattern.

WARNING: Make sure that the name of this field is `scrollAccessControl`. The inversion logic depends on that.

**Parameters:**

- `type` - always the literal: `"scrollAccessControl"`
- `roleNames` - (optional) a record of bytes32 role hashes to predefined role names. Usually this handler is pretty good at guessing, so this is often unnecessary
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Analyze the contract:

```json
{
  "type": "scrollAccessControl"
}
```

Specify some names:

```json
{
  "type": "scrollAccessControl",
  "roleNames": {
    "0x3f3b3bf06419b25db8f1ac3dfb014d79b6fb633e65d1ca540c6a3c665e32e106": "GOBLIN_ROLE"
  }
}
```

### Linea access control handler

This handler allows you to analyze a Zodiac GnosisSafe module that exhibits an
extended AccessControl pattern. At the time of writing this, only Linea is
known to use this module.

**Parameters:**

- `type` - always the literal: `"lineaRolesModule"`
- `roleNames` - (optional) a record of bytes32 role hashes to predefined role names. Usually this handler is pretty good at guessing, so this is often unnecessary
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Analyze the contract:

```json
{
  "type": "lineaRolesModule"
}
```

Specify some names:

```json
{
  "type": "lineaRolesModule",
  "roleNames": {
    "0x3f3b3bf06419b25db8f1ac3dfb014d79b6fb633e65d1ca540c6a3c665e32e106": "GOBLIN_ROLE"
  }
}
```

### StarkWare named storage handler

This handler allows you to read values from contracts using StarkWare's named storage pattern. This handler only supports simple values and does not support mappings and other possible types.

**Parameters:**

- `type` - always the literal: `"starkWareNamedStorage"`
- `tag` - the string tag of the named storage slot
- `returnType` - (optional) specifies how to interpret the resulting `bytes32` result. Possible options are `"address"`, `"bytes"` (default), `"number"`.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Read the stored value:

```json
{
  "type": "starkWareNamedStorage",
  "tag": "EXAMPLE_TAG_NAME"
}
```

Read the stored value and return it as address:

```json
{
  "type": "starkWareNamedStorage",
  "tag": "EXAMPLE_TAG_NAME",
  "returnType": "address"
}
```

### StarkWare Governance handler

Downloads events emitted (`event LogNewGovernorAccepted(address acceptedGovernor)`) and filters the address through a function, thus producing an array of addresses.

**Parameters:**

- `type` - always the literal: `"starkWareGovernance"`
- `filterBy` - the name of a function that will be used a filter to determine if the address from the event emitted is the governor we want

**Examples:**

Assumes there is a function `function starknetIsGovernor(address user) view returns (bool)` in the abi.
Collect all the events and check if the address emitted in each event when given as a argument to this function returns true.
If it does, add it to the result

```json
{
  "governors": {
    "type": "starkWareGovernance",
    "filterBy": "starknetIsGovernor"
  }
}
```

### Event handler

The event handler allows you to query and process blockchain events to track state changes, group data, and apply filters. It supports three modes: add + remove (for managing dynamic sets), direct fetch (for array like data), and set (for tracking latest values).

**Parameters:**

- `type` - the literal: `"event"`
- `select` - event parameter(s) to extract. Accepts a single string or array of strings (e.g., `"user"` or `["batchIndex", "chainId"]`)
- `groupBy` - (optional) groups results by the specified event parameter. Returns an object with grouped keys when used.
- `ignoreRelative` - (optional, default: `false`) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.
- `add` - (optional) configuration for events that add entries:
  - `event` - event name(s) to listen to (string or array).
  - `where` - (optional) conditional filter using a LISP like format `[OPERATOR, ...args]`.
    Supports #-prefixed event parameters (e.g., `"#chainId"`), literals like `42`, `"abc"` or `true`, and logical operators (`"not"`, `"="`, `"!="`, `"and"`, etc.).
- `remove` - (optional) configuration for events that remove entries (same structure as add).
- `set` - (optional) configuration for events that set/update values (same structure as add). Returns the latest value per group.

Behavior Rules:

Use either add or add + remove or set - these modes are mutually exclusive.
When using groupBy, the handler returns an object keyed by group values.
With set, the last event in block order determines the value(s).

**Examples:**

Your configuration directly determines how events are interpreted and what output you get. Here's a breakdown of common scenarios:

**If you use just add**

You get: _A list of all values from matching events_

**What happens**:
Every matching event appends its value(s) to the result .
Output preserves emission order (oldest → newest)

Example: Track all registered users:

```json
{
  "type": "event",
  "select": "user",
  "add": { "event": "Register" }
}
```

Sample Events: `Register(alice) → Register(bob) → Register(alice)`.
Output: `["alice", "bob"]`

**If you use add + remove**

You get: A dynamically updated list (like allowlists/blocklists)

What happens:
add events append values to the result.
remove events delete values from the result.
Final output = All added values minus removed ones

Example: Track users added/removed from a registry

```json
{
  "type": "event",
  "select": "user",
  "add": { "event": "Add" },
  "remove": { "event": "Remove" }
}
```

If events are: `Add(alice) → Add(bob) → Remove(alice)`.
Output becomes: `["bob"]`
(Alice added then removed, Bob stays added)

**If you use set**

You get: The latest value (like tracking a counter)

What happens:
Every matching event overwrites previous values.
Final `output = Value` from the last event in block order

Example: Track latest batch index

```
{
  "type": "event",
  "select": ["batchIndex"],
  "set": { "event": "CurrentBatch" }
}
```

If events are: `CurrentBatch(1) → CurrentBatch(2)`
Output becomes: `2`
(Last event wins)

**If you add groupBy**

You get: Values organized into subgroups

What happens:
Creates a dictionary keyed by your chosen parameter.
Each group operates independently (add/remove or set logic applies per group)

Example: Track latest batch per chain

```json
{
  "type": "event",
  "select": ["batchIndex"],
  "set": { "event": "CurrentBatchMultichain" },
  "groupBy": "chainId"
}
```

If events are:
`CurrentBatchMultichain(1, 10) → CurrentBatchMultichain(2, 20) → CurrentBatchMultichain(3, 10)`.
Output becomes:

```js
{
  10: 3,  // Chain 10's latest is batch 3
  20: 2   // Chain 20's latest remains batch 2
}
```

**If you use where filters**

You get: Only events matching your conditions

What happens:
Filters events before processing them.
Uses # to reference event parameters

Example: Track only EVM chains

```json
{
  "type": "event",
  "select": ["batchIndex"],
  "set": {
    "event": "CurrentBatchMultichain",
    "where": ["=", "#chainId", 1] // ChainID 1 = Ethereum
  }
}
```

Events: `CurrentBatchMultichain(batch=5, chain=1) → CurrentBatchMultichain(batch=6, chain=2)`.
Output: `5` (chain=2 event ignored)

**If you combine multiple events**

You get: Aggregated data from different sources

What happens:
Events must share identical parameter structure.
Treated as equivalent sources

Example: Track version from two upgrade events

```json
{
  "type": "event",
  "select": ["version"],
  "set": {
    "event": ["UpgradeV1", "UpgradeV2"]
  }
}
```

Works if both events have a version uint256 parameter

**KEEP IN MIND**

- Block Order Matters: Events are processed in blockchain order (oldest → newest). For set, newest overwrites old. For add/remove, sequence changes which operations cancel each other.
- Groups Are Independent: When using groupBy, each group acts like its own isolated handler. Removing a value in group A doesn't affect group B.
- Boolean Logic in where: Use `["and", [...], [...]]` for complex conditions.

### Constructor args handler

Creates a new field in the result with the value provided.

**Parameters:**

- `type` - the literal: `"constructorArgs"`
- `nameArgs` - (optional, default: false) a boolean value, if true the array of arguments will be decoded into a dictionary with names of the arguments and their values

**Examples:**

```json
{
  "fields": {
    "constructorArgs": {
      "type": "constructorArgs",
      "nameArgs": true
    }
  }
},
```

### Hardcoded handler

Creates a new field in the result with the value provided.

**Parameters:**

- `type` - the literal: `"hardcoded"`
- `value` - any value you want to have in the result

**Examples:**

```json
{
  "fields": {
    "securityCouncilThreshold": {
      "type": "hardcoded",
      "value": 9
    },
  }
},
```

### Arbitrum actors handler

Extracts an array of actors from the Arbitrum stack. Both validators and batch posters are encoded the same way so using this handler you can extract either.

**Parameters:**

- `type` - the literal: `"arbitrumActors"`
- `actorType` - one of two literals: `"validator"` or `"batchPoster"`

**Examples:**

```json
{
  "fields": {
    "batchPosters": {
      "type": "arbitrumActors",
      "actorType": "batchPoster"
    },
  }
},
```

### Arbitrum DAC keyset handler

Extracts the DAC keyset from projects based on Orbit stack.

**Parameters:**

- `type` - the literal: `"arbitrumDACKeyest"`

**Examples:**

```json
{
  "fields": {
    "dacKeyset": {
      "type": "arbitrumDACKeyset"
    },
  }
},
```

### Arbitrum Sequencer version handler

Extract the sequencer version from data posted by projects based on Orbit stacks.
Using this value you can determine if the data is posted an L1 or to a DAC.

**Parameters:**

- `type` - the literal: `"arbitrumSequencerVersion"`

**Examples:**

```json
{
  "fields": {
    "sequencerVersion": {
      "type": "arbitrumSequencerVersion"
    },
  }
},
```

### Optimism DA handler

Downloads the last ten transactions submitted to L1 by a sequencer and compares the calldata length to see if it looks like the rollup is posting data to an external DA, like Celestia.

**Parameters:**

- `type` - the literal: `"opStackDA"`
- `sequencerAddress` - the address of the sequencer

**Examples:**

```json
{
  "opStackDA": {
    "type": "opStackDA",
    "sequencerAddress": "{{ batcherHash }}"
  },
},
```

### Optimism Sequencer inbox handler

Extract the address of the place where the sequencer is going to be posting calldata.

**Parameters:**

- `type` - the literal: `"opStackSequencerInbox"`
- `sequencerAddress` - the address of the sequencer

**Examples:**

```json
{
  "sequencerInbox": {
    "type": "opStackSequencerInbox",
    "sequencerAddress": "{{ batcherHash }}"
  }
},
```

### Event trace handler

The event trace handler allows you to trace function calls that occur within transactions where specific events were emitted.

The handler works by:

1. Finding all transactions where a specified event was emitted from the contract
2. Getting the debug trace for each of those transactions
3. Traversing the trace to find calls to a specified function
4. Decoding and returning the call data for those function calls

**Parameters:**

- `type` - always the literal: `"eventTrace"`
- `event` - the name of the event to search for in transactions (must be a part of the ABI)
- `function` - the name of the function whose calls should be traced and decoded (must be a part of the ABI)

**Examples:**

Track function calls that occur in transactions where a specific event was emitted:

```json
{
  "tracedCalls": {
    "type": "eventTrace",
    "event": "ProposalCreated",
    "function": "executeProposal"
  }
}
```

This example would find all transactions where the `ProposalCreated` event was emitted, then extract and decode all calls to the `executeProposal` function within those transactions.

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
Since the value is right there in the output, you'd want to access it somehow, but the following is not supported:

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
That way the language achieves composability, allowing you to build up a chain of filters.
All filters have the input value piped in, perform processing and produce an output value.
Where the input values comes from and where the output values goes depends on the context in which the filter is used in.
In the first example, `["get", "systemConfig"]` is a filter that extracts the systemConfig object, and `["format", "Undecimal18"]` is a filter that formats its input.

### Filters

- `pipe`, chains multiple filters sequentially.
- `map`, applies a filter to each element in an array.
- `pick`, selects specific keys from an object.
- `get`, retrieves a value using a key or index path.
- `set`, updates a value at a specific key or index path.
- `filter`, creates a new array with all elements that pass the filter.
- `find`, returns the first element that passes the filter.
- `format`, applies the selected type caster.
- `if`, conditional logic (if/then/else).
- `delete`, deletes removes keys/indices from objects/arrays.
- `shape`, creates a new object from input values using specified keys.
- `to_entries`, converts an object to an array of key-value pairs.
- `length`, returns the number of elements in arrays, objects, or strings.

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
The input to the filter has to be an array, the produced value is always an array.
The second argument is the filter to be applied.
The second argument must be a single filter expression that will be applied to each element.

- Input: `[1, 2, 3]`
- Program: `["map", ["=", 2]]`
- Output: `[false, true, false]`

#### `pick`

Takes an object as input and returns a new object that contains only the keys specified in the arguments.
Requires an object as input.
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
Multiple arguments are allowed, the are applied from left to right.
The filter behaves as if you called `<arg1>.<arg2>.<arg3>...` on the input.

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
If the predicate returns true the element is included in the output.
If the predicate returns false the element is omitted from the output.
The second argument must be a single filter expression that will be applied to each element.
The result of the predicate has to be a boolean.

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

### `format`

Formats a value using a type caster.
The argument is the name of the type caster to use.
Only a single argument is allowed, it has to be a string.

- Input: `60`
- Program: `["format", "FormatSeconds"]`
- Output: `1 minute`

### `if`

Takes three filters, the first is the condition, the second is the value if the condition is true, and the third is the value if the condition is false.
The condition has to be a boolean.
Filters producing the true and false values are lazily evaluated.
If the true condition value is only a valid program when the condition is true it won't be evaluated if the condition doesn't pass.

- Input: `{ hasA: true, a: 1 }`
- Program: `["if", ["get", "hasA"], ["pick", "a"], ["pick", "b"]]`
- Output: `{ a: 1 }`

### `delete`

Deletes properties of an object or elements of an array.
Multiple arguments are allowed.
Values are removed from the top level of the object or from the array.
Removed indexes from an array are stable, meaning that the indices specified for deletion are resolved based on the original array state before any removals occur.
This ensures that deletions do not shift subsequent indices during the process

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

Converts an object to an array of key-value pairs.
Each pair is represented as an object with key and value properties.
The output is always an array.
The order of entries follows the object's key insertion order.

- Input: `{ a: 1, b: 2, c: 3 }`
- Program: `["to_entries"]`
- Output: `[[ "a", 1 ], [ "b", 2 ], [ "c", 3 ]]`

- Input: `[1, 23]`
- Program: `["to_entries"]`
- Output: `[[ "0", 1 ], [ "1", 23 ]]`

### `length`

Returns the number of elements in arrays, objects, or strings.
For arrays, returns the array length.
For objects, returns the number of properties.
For strings, returns the string length.

- Input: `[1, 2, 3]`
- Program: `["length"]`
- Output: `3`

- Input: `{ a: 1, b: 2 }`
- Program: `["length"]`
- Output: `2`

- Input: `"hello"`
- Program: `["length"]`
- Output: `5`

### Copy feature

Copy is a useful feature when you have a value and want to create multiple views into it.
You can define a field that will take it's value from the value of another field.
The ability to use the `edit` feature is still available on such a field.

Example configuration:

```json
"accessControlTargets": {
  "copy": "accessControl",
  "edit": ["get", "targets"]
}
```

## Formatting values

### Idea

Querying the existing state values and creating new state based on events are essential for understanding how the contract is currently configured.
Normally because these values are taken straight from chain using various RPC calls they might not be easily readable by a human.
Sometimes you want to assign some further knowledge you have about a value to it's representation.
The simplest example is a value returned from a function like `getDelay()`.
As human you understand that it returns the number of seconds representing the delay.
But since values on chain are oriented towards being computer friendly, instead of seeing `"24 hours"` you'll get `86400`.

Formatting values allows you to overcome the problem of assigning meaning to computer-friendly values.
This is achieved using the format BLIP function within the `edit` field.

### Using the format function

The `format` function takes a single argument: the name of a predefined formatting configuration.
This configuration specifies which built-in caster to use and any arguments required by that caster.

For example, to format a raw integer value representing ETH (with 18 decimals) into a human-readable string, you might use a configuration named `Undecimal18`:

```json
{
  "fields": {
    "ETH_AMOUNT": {
      "copy": "rawEthValue",
      "edit": ["format", "Undecimal18"]
    }
  }
}
```

(See the `edit` section for a more complex example using `pipe` and `get` before `format`)

### Defining Formatting Configurations

To use the `format` function with a custom behavior (like specifying the number of decimals for an Undecimal conversion or providing a mapping), you need to define a formatting configuration.
These configurations specify which built-in caster to use and provide its arguments.

The structure for defining a formatting configuration is:

```json
{
  "ConfigurationName": {
    "caster": "BuiltInCasterName",
    "arg": { ...arguments for the caster... }
  }
}
```

Let's look at examples using common built-in casters:

#### Undecimal Caster

The Undecimal caster is used to divide a large integer (like a token amount) by 10 raised to the power of a specified number of decimals.
To create a configuration that parses a value where decimals is 9:

```json
{
  "Undecimal9": {
    "caster": "Undecimal",
    "arg": { "decimals": 9 }
  }
}
```

You would then use this configuration in an edit field like `["format", "Undecimal9"]`.

#### Mapping Caster

The Mapping caster is used to map specific input values to predefined output values, typically strings.

Suppose a value on the blockchain is a 4-byte hash representing a unique configuration, such as a version number.
We query a function with the ABI `function version() view returns (uint32)`.
Based on information from a third party, we know that `3622689` corresponds to version `"v2.1"` and `25526433` corresponds to version `"v3.0"`.

To map these integer values to their string representations, you can use the Mapping caster. Define the configuration as follows:

```json
{
  "VersionMapping": {
    "caster": "Mapping",
    "arg": {
      "3622689": "v2.1",
      "25526433": "v3.0"
    }
  }
}
```

Note: Mapping keys must be strings in the configuration JSON, even if the input value is a number.

You can then use this configuration in your edit field by setting the format argument to "VersionMapping".

#### FormatSeconds Caster

The FormatSeconds caster is a built-in caster that formats a number representing seconds into a human-readable duration string (e.g., "1 minute", "2 days").
This caster does not require any arguments in its configuration.

You would use this with `["format", "FormatSeconds"]`.

### Assigning Structure

Note that the `format` function is primarily for transforming the value itself (e.g., number to string, number to formatted number).
If you need to assign names to elements within an array or object (like naming elements of a returned array `[120, 1000]` as `delay` and `offset`), this is done using the `shape` BLIP filter within the `edit` field, not the `format` filter.

For example, transforming `[120, 1000]` into `{ "delay": 120, "offset": 1000 }` would use `["shape", "delay", "offset"]` in the `edit` field.
You could combine `shape` and `format` in a `pipe` if needed, e.g., `["pipe", ["shape", "delay", "offset"], ["set", "delay", ["format", "FormatSeconds"]]]` to first structure the array and then format the `delay` field.
Or simpler still, you could `["shape", ["delay", ["format", "FormatSeconds"]], "offset"]` to structure the array and format the `delay` field in one step.

#### Places for Formatting Configuration Definitions

Formatting configurations can be defined at three levels:

- Global Configurations: These are defined once and are available across all discoveries, eliminating the need for repeated definitions.
- Project Global Configurations: Defined within the configuration of an entire project, these configurations are available to all contracts within that project.
- Contract Local Configurations: These are defined for a specific contract and are only available to fields within that contract.

Shadowing Rules

The shadowing rules for configurations follow a hierarchy where more narrowly scoped configurations override those with broader scope.
The precedence order is as follows: Global < Project Global < Contract Local

#### How to Define Configurations

- Global Configurations: Define these in the file located at `globalConfig.jsonc`.
- Project Global Configurations: Define these within the configuration of a specific project in `config.jsonc`.
- Contract Local Configurations: Define these within the configuration of a specific contract in `config.jsonc`. Use the `"formatConfigs"` key within the contract's configuration object.

This structure allows for clear and organized management of formatting definitions, ensuring that your values are formatted precisely where needed using the `format` BLIP function.
