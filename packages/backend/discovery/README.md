# How to run discovery?

- `yarn discover [chain] [project]` run discovery for the project
- `yarn discover [chain] [project] --block-number=<block_number>` run discovery on a specific block number
- `yarn discover [chain] [project] --dry-run` check simulated update-monitor output
- `yarn discover [chain] [project] --dev` run discovery on the same block number as in discovered.json (useful for development)
- `yarn invert [chain] [project]` print addresses and their functions
- `yarn invert [chain] [project] --mermaid` builds a mermaid graph of the project
- `yarn discover:single [chain] [address]` run a discovery on the address (no config needed, useful for experimenting)

A list of currently supported chains is [here](https://github.com/l2beat/tools/blob/main/packages/discovery/src/config/chains.ts)

# Discovery documentation

NOTE: We use a pseudo-TS syntax to simplify parameter types here:

- `address` - string representing contract address
- `field` - string representing method/value name

## Adding new project

Create a new folder in `discovery` named after the project, with `config.jsonc` inside. Then run

```
yarn discover <project_name>
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
  - an array of the above values. In this case the values are hashed to produce a key corresponding to a mapping. Given a mapping of `address => boolean` at the storage location `5` to get the value for some specific address you should set the slot to: `[5, "0x6B175474E89094C44Da98b954EedeAC495271d0F"]`
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
  "indices": [2,3,5,7,11]
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
  "expectRevert": true,
}
```

### Events count handler

The call handler allows you to call amount of the emitted events from the contract with the specified topics.

**Case study: Arbitrum validators**

List of validators cannot be easily obtained from the contract, there is no getter. Additionally the method does not emit an event helpful enough to use `arrayFromOneEvent` handler. But it does emit an event that can be used to determine the amount of calls of the functions `setValidator`, when count changes our bot will notify us about the possible changes in the validator set. Later developer can manually update the hardcoded list of validators.

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

### Array from one event handler

This handler allows you to collect values emitted by a smart contract through a single event type. It can either collect all values or use a flag to determine whether to add/remove a value.

**Parameters:**

- `type` - always the literal: `"arrayFromOneEvent"`
- `event` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `valueKey` - the key of the event member to collect. The event must actually have a member with this name
- `flagKey` - (optional) the key of the event member to use to decide whether to add or remove a given value. That member must be a `bool`, where `true` means add, `false` means remove
- `flagTrueValues` - (optional) an array of either string, number of boolean that is going to be treated as a true value.
- `flagFalseValues` - (optional) an array of either string, number of boolean that is going to be treated as a false value.
- `invert` - (optional) inverts the behavior of the flag, `false` means add, `true` means remove
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.
- `topics` - array of topics to filter events by.

**Examples:**

Assumes there is an event `event OwnerChanged(address account, bool added)` in the abi. Collects the list of current owners:

```json
{
  "type": "arrayFromOneEvent",
  "event": "OwnerChanged",
  "valueKey": "account",
  "flagKey": "added"
}
```

Get a list of all high scorers:

```json
{
  "type": "arrayFromOneEvent",
  "event": "event HighScore(address winner, uint256 score)",
  "valueKey": "winner"
}
```

Use the invert option to handle a tricky case, where the flag means remove:

```json
{
  "type": "arrayFromOneEvent",
  "event": "event WeirdEvent(address person, bool removed)",
  "valueKey": "person",
  "flagKey": "removed",
  "invert": true
}
```

Gather only people that are 18 or 21

```json
{
  "type": "arrayFromOneEvent",
  "event": "event WeirdEvent(address person, uint256 number)",
  "valueKey": "person",
  "flagKey": "removed",
  "flagTrueValues: [18, 21],
}
```

### Array from one event with argument handler

This handler allows you to collect values emitted by a smart contract through a single event type.
It filters out events based on the argument and it's value.

**Parameters:**

- `type` - always the literal: `"arrayFromOneEventWithArg"`
- `event` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `valueKey` - the key of the event member to collect. The event must actually have a member with this name
- `flagKey` - (optional) the key of the event member to use to decide whether to add or remove a given value. That member must be a `bool`, where `true` means add, `false` means remove
- `invert` - (optional) inverts the behavior of the flag, `false` means add, `true` means remove
- `arg` - string name of the argument you want to query
- `argValue` - the value of the above argument that is treated as true
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Assume that there is an event emitted of type `Event(x,y,z)`.
You want to create an array of values `x` from that event only when `y` is equal to `1234`.

```json
{
  "fields": {
    "blockSubmitters": {
      "type": "arrayFromOneEventWithArg",
        "event": "Event",
        "valueKey": "x",
        "flagKey": "allowed",
        "arg": "y",
        "argValue": "1234"
    }
  }
}
```

### Array from two events handler

This handler allows you to collect values emitted by a smart contract through a pair of events. One event signifies the addition of a value and another the removal.

**Parameters:**

- `type` - always the literal: `"arrayFromTwoEvents"`
- `addEvent` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `addKey` - the key of the event member to collect in the add event. The event must actually have a member with this name
- `removeEvent` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `removeKey` - the key of the event member to collect in the remove event. The event must actually have a member with this name
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

**Examples:**

Assumes there are two events: `event MinterAdded(address minter)` and `event MinterRemoved(address minter)` in the abi. Collects the list of current minters:

```json
{
  "type": "arrayFromTwoEvents",
  "addEvent": "MinterAdded",
  "addKey": "minter",
  "removeEvent": "MinterRemoved",
  "removeKey": "minter"
}
```

Same example, but the abis are explicit:

```json
{
  "type": "arrayFromTwoEvents",
  "addEvent": "event MinterAdded(address minter)",
  "addKey": "minter",
  "removeEvent": "event MinterRemoved(address minter)",
  "removeKey": "minter"
}
```

### State from event handler

This handler allows you to collect values emitted by a smart contract through a single event type in a highly structured way, supporting multiple values per event and grouping by parameter values.

**Parameters:**

- `type` - the literal: `"stateFromEvent"`
- `event` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `returnParams` - array of strings that represent event keys that we want to save
- `groupBy` - (optional) when specified, must be a `returnParam`, the output will be grouped by the values of this param
- `onlyValue` - (optional, default: `false`) when `true`, the `groupBy` key is removed from the output record.
- `multipleInGroup` - (optional, default: `false`) when `true`, each grouping key will point to an array of values if more than one value exist.
- `ignoreRelative` - (optional, default: `false`) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.
- `topics` - array of topics to filter events by.

**Examples:**

Assumes there is `event AddInboundProofLibraryForChain(uint16 chainId, address lig)` in the abi. Collects the list of all `inboundProofLibraries` ever added for every `chainId`:

```json
{
  "type": "stateFromEvent",
  "event": "AddInboundProofLibraryForChain",
  "returnParams": ["chainId", "lib"],
  "groupBy": "chainId",
  "onlyValue": true,
  "multipleInGroup": true,
  "ignoreRelative": true
},
```

### State from event tuple handler

Similar to the handler above but works on tuples are event arguments.
Written specially for LayerZero v2 contracts, below is the logic of the handler:

Example event:
`event DefaultConfigsSet(tuple(uint32 eid, tuple(...) config)[] params)`

Logic:
1. Get all logs for the event
2. Group logs by returnParam[0] (it is always eid with current approach)
3. Expand tuple of values into named values dictionary if expandParam is provided
4. Keep only the latest log for each group

**Parameters:**

- `type` - the literal: `"stateFromEventTuple"`
- `event` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `returnParams` - array of strings that represent event keys that we want to save
- `expandParam` - (optional) name of the return parameter to expand into a dictionary
- `ignoreRelative` - (optional, default: `false`) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

### Constructor args handler

Creates a new field in the result with the value provioded.

**Parameters:**

- `type` - the literal: `"constructorArgs"`
- `nameArgs` - (optional) a boolean value, by default the result is an array of arguments - false state, if set to true the array will be decoded into a dictionary with names of the arguments and their values

**Examples:**

```json
{
  "fields": {
    "constructorArgs": {
      "type": "constructorArgs"
    }
  }
},
```

### Hardcoded handler

Creates a new field in the result with the value provioded.

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

Are you tired of hitting `yarn discover <project>` and waiting for the output? We got you covered, caching is built into discovery scripts!
