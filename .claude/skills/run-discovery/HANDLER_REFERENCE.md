# Handler Reference for Discovery Config

This document contains all handler patterns you can add to `config.jsonc` overrides. The user will tell you which handler to add and to which contract.

**Important**: After adding any handler to config.jsonc, you must re-run discovery (`l2b discover <project>` from `packages/config`) for the new fields to appear in discovered.json.

**Config structure**: Handlers go inside the `overrides` section of config.jsonc, under the contract's address:

```jsonc
{
  "overrides": {
    "eth:0xContractAddress": {
      "fields": {
        "fieldName": {
          "handler": { "type": "handlerType", /* ...params */ }
        }
      }
    }
  }
}
```

If the contract already has an override entry, merge your additions. If it already has `fields`, add to the existing `fields` object.

---

## AccessControl Handler

Analyzes contracts using OpenZeppelin's AccessControl pattern. Discovers all roles and their members.

**CRITICAL**: The field name **must** be `accessControl`. The system depends on this exact name.

```jsonc
"eth:0xContractAddress": {
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
}
```

With manual role name mapping (rarely needed — auto-detection usually works):

```jsonc
"eth:0xContractAddress": {
  "fields": {
    "accessControl": {
      "handler": {
        "type": "accessControl",
        "roleNames": {
          "0x3f3b3bf06419b25db8f1ac3dfb014d79b6fb633e65d1ca540c6a3c665e32e106": "CUSTOM_ROLE"
        }
      }
    }
  }
}
```

To prevent role member addresses from being discovered as new contracts:

```jsonc
"accessControl": {
  "handler": { "type": "accessControl", "ignoreRelative": true }
}
```

**When to use**: Contract source code imports `AccessControl` or `AccessControlUpgradeable`, has `onlyRole(...)` modifiers, `_checkRole(...)` calls, or `hasRole(...)` calls.

---

## Storage Handler

Reads values directly from contract storage slots. Essential for private variables that have no public getter.

**Basic usage** — read address at slot 0 (common for Ownable `_owner`):

```jsonc
"eth:0xContractAddress": {
  "fields": {
    "owner": {
      "handler": { "type": "storage", "slot": 0, "returnType": "address" }
    }
  }
}
```

**With offset** — read a specific field in a struct:

```jsonc
"pendingOwner": {
  "handler": { "type": "storage", "slot": 1, "offset": 0, "returnType": "address" }
}
```

**Mapping lookup** — read from a mapping (e.g., `mapping(address => bool)` at slot 5):

```jsonc
"isValidator": {
  "handler": {
    "type": "storage",
    "slot": [5, "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
    "returnType": "bytes"
  }
}
```

**With field reference** — use another discovered field's value as a mapping key:

```jsonc
"ownerBalance": {
  "handler": { "type": "storage", "slot": [2, "{{ owner }}"] }
}
```

**Prevent following the address** — when the result is an address but not a contract to discover:

```jsonc
"guardian": {
  "handler": { "type": "storage", "slot": 3, "returnType": "address", "ignoreRelative": true }
}
```

**Return types**: `"address"`, `"bytes"` (default), `"number"`

**Finding slot numbers**:
- Slot 0 is very common for `Ownable._owner`
- Check the source code for explicit slot assignments: `assembly { slot := N }`
- For OpenZeppelin upgradeable contracts, slots follow EIP-1967 patterns
- Slots are sequential for simple contracts: first `address` var = slot 0, second = slot 1, etc.
- For packed storage, you may need to use `offset`

---

## Array Handler

Reads arrays by repeatedly calling an indexed method. Discovery auto-calls array methods but limits to 5 entries. Use this handler for longer arrays.

**Basic** — just extend the max length:

```jsonc
"validators": {
  "handler": { "type": "array", "maxLength": 100 }
}
```

**With explicit method name**:

```jsonc
"validators": {
  "handler": { "type": "array", "method": "getValidator", "maxLength": 50 }
}
```

**With length from another field**:

```jsonc
"validators": {
  "handler": {
    "type": "array",
    "method": "validators",
    "length": "{{ validatorCount }}",
    "maxLength": 200
  }
}
```

**With specific indices**:

```jsonc
"selectedItems": {
  "handler": { "type": "array", "method": "items", "indices": [0, 1, 5, 10] }
}
```

**Prevent following discovered addresses**:

```jsonc
"tokenList": {
  "handler": { "type": "array", "method": "tokens", "maxLength": 50, "ignoreRelative": true }
}
```

---

## Dynamic Array Handler

Reads an entire dynamic array directly from storage by knowing the length slot.

```jsonc
"validators": {
  "handler": { "type": "dynamicArray", "slot": 54, "returnType": "address" }
}
```

With `ignoreRelative`:

```jsonc
"validators": {
  "handler": { "type": "dynamicArray", "slot": 54, "returnType": "address", "ignoreRelative": true }
}
```

---

## Call Handler

Calls view methods with specific arguments. Useful for methods that take parameters discovery can't guess.

**Basic call**:

```jsonc
"specificValue": {
  "handler": { "type": "call", "method": "getValue", "args": [1, 2] }
}
```

**With field references in arguments**:

```jsonc
"adminBalance": {
  "handler": {
    "type": "call",
    "method": "function balanceOf(address owner) view returns (uint256)",
    "args": ["{{ admin }}"]
  }
}
```

**Call that is expected to revert** (monitoring for future changes):

```jsonc
"pauseCheck": {
  "handler": { "type": "call", "method": "function revertIfNotPaused()", "expectRevert": true }
}
```

---

## Hardcoded Handler

Sets a fixed value for a field. Useful when a contract references an address that can't be auto-discovered (e.g., an ACL contract at a known address).

```jsonc
"acl": {
  "handler": { "type": "hardcoded", "value": "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb" }
}
```

This makes the address appear as a field in discovered.json, and discovery will follow it as a relative (discovering that contract too).

---

## Event Handler

Tracks state changes via blockchain events.

**Track added entries** (e.g., registered users):

```jsonc
"registeredUsers": {
  "handler": { "type": "event", "select": "user", "add": { "event": "Register" } }
}
```

**Track with add and remove**:

```jsonc
"activeOperators": {
  "handler": {
    "type": "event",
    "select": "operator",
    "add": { "event": "OperatorAdded" },
    "remove": { "event": "OperatorRemoved" }
  }
}
```

**With groupBy**:

```jsonc
"roleMembers": {
  "handler": {
    "type": "event",
    "select": "account",
    "groupBy": "role",
    "add": { "event": "RoleGranted" },
    "remove": { "event": "RoleRevoked" }
  }
}
```

---

## Lido ACL Handler

For Lido's Aragon-based ACL system. The field name should describe what it returns.

```jsonc
"permissions": {
  "handler": { "type": "lidoACL" }
}
```

With ignored relatives (to avoid discovering long lists of node operators):

```jsonc
"permissions": {
  "handler": {
    "type": "lidoACL",
    "ignoreRelatives": [
      {
        "app": "eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433",
        "role": "0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee"
      }
    ]
  }
}
```

---

## Contract-Level Overrides (Not Handlers)

These go directly on the contract override, not inside `fields`:

### ignoreDiscovery

Stop discovery entirely at this contract. The contract won't be walked:

```jsonc
"eth:0xExternalContract": {
  "ignoreDiscovery": true
}
```

### ignoreRelatives

Don't follow specific fields as relatives (more granular than ignoreDiscovery):

```jsonc
"eth:0xCoreContract": {
  "ignoreRelatives": ["oracleAddress", "externalTokenRef"]
}
```

### ignoreMethods

Skip specific methods during discovery (useful for methods that revert or return large data):

```jsonc
"eth:0xContract": {
  "ignoreMethods": ["getTransaction", "getHistoricalData"]
}
```

### ignoreInWatchMode

Include in discovery but don't monitor for changes (useful for frequently changing values):

```jsonc
"eth:0xContract": {
  "ignoreInWatchMode": ["currentBlock", "lastProcessedSlot", "totalSupply"]
}
```

### names

Override contract names (in the top-level `names` section, not in `overrides`):

```jsonc
{
  "names": {
    "eth:0x1234...": "MainVault"
  }
}
```

---

## Merging Rules

When adding to an existing override:

1. **Existing `fields`**: Add your new field alongside existing ones. Don't remove existing handlers.
2. **Existing `ignoreRelatives`**: Merge arrays — add new field names, keep existing ones.
3. **Existing `ignoreMethods`**: Merge arrays — add new method names, keep existing ones.
4. **Existing `ignoreInWatchMode`**: Merge arrays.
5. **Comments**: Preserve any existing JSONC comments.

Example merge — contract already has ignoreMethods, you're adding a handler:

```jsonc
// Before:
"eth:0x1234": {
  "ignoreMethods": ["oldMethod"]
}

// After (merged):
"eth:0x1234": {
  "ignoreMethods": ["oldMethod"],
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
}
```
