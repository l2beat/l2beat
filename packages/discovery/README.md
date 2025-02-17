# What is discovery?

Discovery is a tool to explore contracts and their dependencies associated with a project.

To view the current state of discovery, see [https://update-monitor-prod.l2beat.com/status/discovery](https://update-monitor-prod.l2beat.com/status/discovery)

Discovery also includes a user interface. See below for instructions on how to run that locally.

# To run discovery

Running discovery will update the information for a given project.

To run discovery, first change to the repository root directory, then to the `packages/backend` directory.

You MUST install an environment file called `.env` in the `packages/backend` directory for discovery to work. See the *RPC configuration* section below for information about the environment file.

- `pnpm discover [chain] [project]` run discovery for the project (e.g., `pnpm discover ethereum optimism`)
- `pnpm discover --help` print out all the possible switches for discovery

A list of currently supported chains is [here](https://github.com/l2beat/tools/blob/main/packages/discovery/src/config/chains.ts)
If you misspell the chain name, a list of all possible chains is printed
In the case you have discovery of the same project on multiple chains, you can discover all of them for a single project running: `pnpm discover all [project]`.

# To run the discovery UI

To run the discovery UI locally:
- Navigate to the `l2beat/packages/l2b` directory
- `pnpm l2bup` # Will build the l2b command
- `l2b ui` # Will run the discovery UI on http://localhost:2021/ui

# RPC configuration

Discovery is based on two sources of information: the chain's RPC and it's explorer.
To run you will need to provide the RPC url to use: (`CHAIN_RPC_URL_FOR_DISCOVERY`).
Also in most cases you'll be using a chain with an Etherscan instance for which you'll need to provide the api key: (`CHAIN_ETHERSCAN_API_KEY_FOR_DISCOVERY`).
If your chain uses Blockscout you don't need to provide it.
Chain information is already precompiled in the file mentioned [above](https://github.com/l2beat/tools/blob/main/packages/discovery/src/config/chains.ts).
It stores information as the name, chain id, configuration of the multicall contract and the explorer instance.
Adding a new chain boils down to just adding a new entry to the array and filling out all the data.

Discovery can make use of additional environment variables such as:

- `CHAIN_EVENT_RPC_URL_FOR_DISCOVERY` - if you want to use a different RPC url for getting the logs. Useful because most RPCs limit their range of queried blocks to 10k. Discovery relies on the fact that your provided RPC can ask for the entire range, starting with the 0th block and up to the latest. Possible provides of such RPCs are Alchemy and Envio (optional if your base RPC already provides that).
- `CHAIN_BEACON_API_URL_FOR_DISCOVERY` - mostly used for Ethereum and if you need to query the blobs to get some value (optional).

Example .env file

```
# Always starting from Ethereum
ETHEREUM_RPC_URL_FOR_DISCOVERY=<RPC_URL>
ETHEREUM_ETHERSCAN_API_KEY=<API_KEY>
ETHEREUM_BEACON_API_URL_FOR_DISCOVERY=<BEACON_URL>                           # (optional)
ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY=<RPC_URL_THAT_SUPPORTS_UNLIMITED_RANGE> # (optional)

# But some of the handlers are going to switch to Arbitrum and fetch info from there 
ARBITRUM_RPC_URL_FOR_DISCOVERY=<RPC_URL>
ARBITRUM_ETHERSCAN_API_KEY=<API_KEY>
```

Tips:
- DO NOT commit your RPC keys to GitHub :)
- Please raise a ticket if you require assistance.

# Discovery documentation

NOTE: We use a pseudo-TS syntax to simplify parameter types here:

- `address` - string representing contract address
- `field` - string representing method/value name

## Adding new project

Create a new folder in `discovery` named after the project, with `config.jsonc` inside. Then run

```
pnpm discover <project_chain> <project_name>
```

A file `discovered.json` will appear in this folder, showing you this project's structure. Make sure to resolve all the errors by ignoring methods or adding specific field handlers.

**Parameters:**

- `"$schema": "https://raw.githubusercontent.com/l2beat/tools/main/schemas/config.schema.json"`
- `name` - name of the project
- `initialAddresses: address[]` - array of addresses that discovery will start from. Discovery will download the contract ABI, read all the available values, and walk through all the contracts found there (`maxDepth` defaults to 7). By default, discovery checks only `view` or `constant` methods with no arguments or with exactly one argument of `uint256` (array). To check other functions you'll need to write custom handlers (see `overrides`). Sometimes the most central address is enough here, but in case of a more complex implementation, you will need to add more to cover all important contracts. Usually 3 addresses here is enough.
- `names: Record<address, string>` - (optional) key-value object, with addresses as keys. It will allow you to override the name of the contract in discovery (ex. `Bridge` instead of `Bridge_v1`)
- `overrides: Record<address, object>` - (optional) key-value object, with contracts as keys. It will allow you to ignore contracts in discovery (ex. token addresses or external contracts) or, override more complex fields and methods ([storage](#storage-handler) and [array](#array-handler) handlers).

**Example:**

```
{
  "$schema": "https://raw.githubusercontent.com/l2beat/tools/main/schemas/config.schema.json"
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

You get: *A list of all values from matching events*  

**What happens**:  
Every matching event appends its value(s) to the result  .
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
    "where": ["=", "#chainId", 1]  // ChainID 1 = Ethereum
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

## Type casters

### Idea

Querying the existing state values and creating new state based on events are essential for understanding how the contract is currently configured.
Normally because these values are taken straight from chain using various RPC calls they might not be easily readable by a human.
Sometimes you want to assign some further knowledge you have about a value to it's representation.
The simplest example is a value returned from a function like `getDelay()`.
As human you understand that it returns the number of seconds representing the delay.
But since values on chain are oriented towards being computer friendly, instead of seeing `"24 hours"` you'll get `86400`.

Type casters are a feature of discovery aiming to allow you to overcome the problem of assigning meaning to computer friendly values.
The core idea behind type casters is that every public getter has an entry in the ABI.
Let's expand on the example provided above, in that case the ABI would be `function getDelay() view returns (uint256)`.
After the keyword `returns` the language requires you to define the structure of returned data.
We can change the mentioned type structure definition as long as the shape of the type is the same.

If we define a virtual type called `FormatSeconds` we can overwrite the ABI with it to run arbitrary computation on the returned type.
You can see how we can change the ABI to `function getDelay() view returns (FormatSeconds)` because we keep the shape of the return type the same.
You can also notice that everything before the `returns` keyword is not an important part of the change.
Because of that we can drop it leaving us with the following change `(uint256)` -> `(FormatSeconds)`.

This solution also has one nice advantage, it allows the user to assign structure to values without one.
Assume we have a function like this `function abc() view returns (uint256[])`.
We know that the array _always_ has two entries, the first entry is the delay in seconds and the second one is some offset.
With this knowledge we can assign additional structure like this `(uint256[])` -> `(uint256 delay, uint256 offset)`.
If the structure ever changes the discovery will throw an error during the type applying phase if the shape has a mismatch.
What this gives you is that the structure is represented in the resulting `discovered.json`.

Instead of:

```json
"abc": [120, 1000]
```

You'll see:


```json
{
  "abc": {
    "delay": 120,
    "offset": 1000,
  }
}
```

### User documentation

To overwrite the ABI, use the "returnType" field in the configuration for a specific field.
For example:

```json
"Contract": {
  "fields": {
    "abc": {
      "returnType": "(uint256 delay, uint256 offset)"
    }
  }
}
```

#### Undecimal new type

To create a new type, you need to define a predefined type caster and provide any necessary arguments.
Let’s create a new type that parses the totalSupply() function where decimals() is 9.
Using the Undecimal type caster, you can define it as follows:

```json
{
  "Undecimal9": {
    "typeCaster": "Undecimal",
    "arg": { "decimals": 9 }
  }
}
```

To use this new type, define the "returnType" as "(Undecimal9)".
The value retrieved from the blockchain will be passed through this type caster, which will divide it by 10^9 using the Undecimal type caster.

#### Mapping new type

Let’s look at another example with a different type caster.
Suppose a value on the blockchain is a 4-byte hash representing a unique configuration, such as a version number.
We query a function with the ABI function version() view returns (uint32).
Based on information from a third party, we know that 3622689 corresponds to version "v2.1" and 25526433 corresponds to version "v3.0".

To map these integer values to their string representations, you can use the Mapping type caster. Define the type as follows:

```json
{
  "VersionMapping": {
    "typeCaster": "Mapping",
    "arg": { 
      3622689: "v2.1",
      25526433: "v3.0"
    }
  }
}
```

You can then use this type caster in your configuration by setting the "returnType" to "(VersionMapping)".

#### Places for type definitions 

Types can be defined at three levels:

- Global Types: These are defined once and are available across all discoveries, eliminating the need for repeated definitions.
- Project Global Types: Defined within the configuration of an entire project, these types are available to all contracts within that project.
- Contract Local Types: These are defined for a specific contract and are only available to fields within that contract.

Shadowing Rules

The shadowing rules for types follow a hierarchy where more narrowly scoped types override those with broader scope.
The precedence order is as follows: Global < Project Global < Contract Local

How to Define Types

- Global Types: Define these in the file located at packages/backend/discovery/globalTypes.jsonc.
- Project Global Types: Define these within the configuration of a specific project in config.jsonc. Use the `"types"` key in the highest JSON scope.
- Contract Local Types: Define these within the configuration of a specific contract in config.jsonc. For an example, refer to the configuration for PolygonRollupManager in shared-polygon-cdk.

This structure allows for clear and organized management of type definitions, ensuring that your types are applied precisely where needed.
