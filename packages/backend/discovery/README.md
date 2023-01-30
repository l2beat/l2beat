# Discovery documentation

## Cache

Are you tired of hitting `yarn discover <project>` and waiting for the output? We got you covered, caching is built into discovery scripts!

### env variable

Set the proper environmental variable to prevent script from fetching the same data multiple times:

`DISCOVERY_BLOCK_NUMBER`- overrides the block number used during local discovery

### proposed usage

`DISCOVERY_BLOCK_NUMBER=<block_number> y discover <project>`

## Handlers

### Storage handler

The storage handler allows you to read values directly from storage.

**Parameters**:

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

### Access control handler

This handler allows you to analyze a contract using OpenZeppelin's AccessControl pattern.

**Parameters:**

- `type` - always the literal: `"accessControl"`
- `roleNames` - (optional) a record of bytes32 role hashes to predefined role names. Usually this handler is pretty good at guessing, so this is often unnecessary

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
