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

- `"$schema": "../config.schema.json"`
- `name` - name of the project
- `initialAddresses: address[]` - array of addresses that discovery will start from. Discovery will download the contract ABI, read all the available values, and walk through all the contracts found there (`maxDepth` defaults to 7). By default, discovery checks only `view` or `constant` methods with no arguments or with exactly one argument of `uint256` (array). To check other functions you'll need to write custom handlers (see `overrides`). Sometimes the most central address is enough here, but in case of a more complex implementation, you will need to add more to cover all important contracts. Usually 3 addresses here is enough.
- `names: Record<address, string>` - (optional) key-value object, with addresses as keys. It will allow you to override the name of the contract in discovery (ex. `Bridge` instead of `Bridge_v1`)
- `overrides: Record<address, object>` - (optional) key-value object, with contracts as keys. It will allow you to ignore contracts in discovery (ex. token addresses or external contracts) or, override more complex fields and methods ([storage](#storage-handler) and [array](#array-handler) handlers).

**Example:**

```
{
  "$schema": "../config.schema.json"
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

The most powerful feature in the discovery. It will allow:

1. Adding handlers to longer arrays (`maxLength` defaults to 5).
2. Reading values directly from storage slot (eg. for `private` variables).
3. Skipping further discovery for selected contract. Very useful when there is for example `DAI` contract in discovery and we don't want to include all `MakerDAO` contracts in our discovery.
4. Skipping further discovery of methods values (see `ignoreRelative` in e.g. [array handler](#array-handler))

**Parameters:**

All of the parameters are optional:

- `proxyType` - manual proxy override. Most of the times, discovery is smart enough to detect proxyType, useful when that's not the case
- `ignoreDiscovery: boolean` - if set to `true`, discovery will not consider this contract as a `relative`, effectively skipping discovery of this contract
- `ignoreRelative: field[]` - discovery will not consider this contract as a `relative`. The difference between `ignoreDiscovery` and `ignoreRelative` is that `ignoreRelative` is configured per field, while `ignoreDiscovery` is configured per contract
- `ignoreMethods: field[]` - discovery will skip this method
- `ignoreInWatchMode: field[]` - if set to `true`, the `UpdateMonitor` will not notify change of this value
- `fields: Record<field, Handler>` - custom fields that represent more complex values of the contract: ex. arrays longer than 5 and private variables

**Example:**

```
{
  "proxyType": "proxy",
  "ignoreDiscovery": true,
  "ignoreMethods": ["method_a", "method_b"],
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

### Call handler

The call handler allows you to call view methods with arguments of your choosing. This is especially useful for methods that take 1 or more arguments, because we don't usually know what arguments to provide to call them automatically.

**Parameters:**

- `type` - always the literal: `"call"`
- `method` - (optional) the name or abi of the method to be called. If omitted the name of the field is used. The abi should be provided in the human readable abi format.
- `args` - an array of values that will be passed as arguments to the method call, e.g. `[1, "0x1234", false]`. It supports field references, e.g. `"{{ value }}"`.
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

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

### Array from one event handler

This handler allows you to collect values emitted by a smart contract through a single event type. It can either collect all values or use a flag to determine whether to add/remove a value.

**Parameters:**

- `type` - always the literal: `"arrayFromOneEvent"`
- `event` - the name or abi of the event to be queried. The abi should be provided in the human readable abi format
- `valueKey` - the key of the event member to collect. The event must actually have a member with this name
- `flagKey` - (optional) the key of the event member to use to decide whether to add or remove a given value. That member must be a `bool`, where `true` means add, `false` means remove
- `invert` - (optional) inverts the behavior of the flag, `false` means add, `true` means remove
- `ignoreRelative` - (optional) if set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.

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

## Cache

Are you tired of hitting `yarn discover <project>` and waiting for the output? We got you covered, caching is built into discovery scripts!

### env variable

Set the proper environmental variable to prevent script from fetching the same data multiple times:

`DISCOVERY_BLOCK_NUMBER`- overrides the block number used during local discovery

### proposed usage

`DISCOVERY_BLOCK_NUMBER=<block_number> y discover <project>`
