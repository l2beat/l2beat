# Owner Path Expression Reference

## Syntax

Every owner path expression follows the format: `<contractRef>.<valuePath>`

### Contract Reference (`<contractRef>`)

| Reference | Meaning | When to Use |
|-----------|---------|-------------|
| `$self` | The current contract being analyzed | Fields defined in this contract (most common) |
| `@fieldName` | Follow an address field to another contract | When access control is delegated to an external contract (e.g., `@accessControlManager`) |
| `eth:0xAddress` | Absolute contract address | Rarely needed — prefer `@fieldName` when a field points to the target |

### Value Path (`<valuePath>`)

JSONPath-like navigation through the contract's `fields[]` array in discovered.json (each field has `name` and `value`):

| Syntax | Example | Meaning |
|--------|---------|---------|
| `fieldName` | `owner` | Simple field lookup |
| `field.nested` | `accessControl.MINTER_ROLE` | Nested object navigation |
| `field[0]` | `signers[0]` | Array index access |
| `field.nested.members` | `accessControl.DEFAULT_ADMIN_ROLE.members` | Deep nested access |

### Special Case: `$self` alone

The path `$self` (without any value path) means the contract itself is the owner. Use this when a contract's functions are only callable by the contract itself (e.g., via `address(this)` check).

---

## Solidity Pattern to Path Expression Mapping

### Simple Owner Patterns

| Solidity Pattern | Path Expression |
|-----------------|-----------------|
| `modifier onlyOwner` / `require(msg.sender == owner())` | `$self.owner` |
| `modifier onlyAdmin` / `require(msg.sender == admin)` | `$self.admin` |
| `require(msg.sender == governance)` | `$self.governance` |
| `require(msg.sender == guardian)` | `$self.guardian` |
| `require(msg.sender == pendingOwner)` | `$self.pendingOwner` |

### Proxy Admin Patterns

| Solidity Pattern | Path Expression |
|-----------------|-----------------|
| `proxy__upgradeTo(address)` | `$self.$admin` |
| `proxy__changeAdmin(address)` | `$self.$admin` |
| `proxy__upgradeToAndCall(address,bytes)` | `$self.$admin` |
| `proxy__ossify()` | `$self.$admin` |
| Any function with `ifAdmin` modifier on a proxy | `$self.$admin` |

**Important**: Always use `$self.$admin` (with `$` prefix on admin) for proxy admin functions. The discovery system exposes the proxy admin as the special `$admin` field. Do NOT use `$self.admin` or `$self._admin` for proxy patterns.

### OpenZeppelin AccessControl Patterns

| Solidity Pattern | Path Expression |
|-----------------|-----------------|
| `onlyRole(DEFAULT_ADMIN_ROLE)` | `$self.accessControl.DEFAULT_ADMIN_ROLE.members` |
| `onlyRole(MINTER_ROLE)` | `$self.accessControl.MINTER_ROLE.members` |
| `onlyRole(PAUSER_ROLE)` | `$self.accessControl.PAUSER_ROLE.members` |
| `_checkRole(UPGRADER_ROLE)` | `$self.accessControl.UPGRADER_ROLE.members` |
| `hasRole(bytes32 role, msg.sender)` | `$self.accessControl.<ROLE_NAME>.members` |

**Note**: In discovered.json, role names are human-readable (e.g., `MINTER_ROLE`), not bytes32 hashes. The `accessControl` object has this structure:
```json
{
  "accessControl": {
    "DEFAULT_ADMIN_ROLE": {
      "adminRole": "DEFAULT_ADMIN_ROLE",
      "members": ["eth:0x1234..."]
    },
    "MINTER_ROLE": {
      "adminRole": "DEFAULT_ADMIN_ROLE",
      "members": ["eth:0x5678..."]
    }
  }
}
```

### External Access Control Patterns

When a contract delegates access control to an external contract:

| Solidity Pattern | Path Expression |
|-----------------|-----------------|
| `IAccessControl(aclManager).hasRole(ROLE, msg.sender)` | `@aclManager.accessControl.ROLE_NAME.members` |
| `require(msg.sender == IGovernor(governor).owner())` | `@governor.owner` |
| `require(accessController.canCall(msg.sender))` | `@accessController.<relevant-field>` |

**How `@fieldName` works**:
1. Look up `fieldName` in the current contract's `values` — it must be an address (e.g., `"eth:0x1234..."`)
2. Find that address as a separate contract in discovered.json
3. Navigate the remaining path in that contract's `fields[]`

### Multiple Owners

Some functions have multiple access control paths (OR logic). Provide all paths:

```json
{
  "ownerDefinitions": [
    {"path": "$self.accessControl.DEFAULT_ADMIN_ROLE.members"},
    {"path": "@governor.owner"}
  ]
}
```

This means the function can be called by DEFAULT_ADMIN_ROLE members OR by the governor's owner.

---

## Common Pitfalls

1. **Don't guess field names** — always verify the field exists in the contract's `fields[]` array
2. **Proxy admin**: Use `$self.$admin`, never `$self.admin` or `$self._admin`
3. **AccessControl `.members`**: Always append `.members` to get the actual addresses. `$self.accessControl.ROLE` alone returns the role object, not the member addresses
4. **Field name mismatches**: The Solidity getter name may differ from the discovered field name. Check what's actually in the contract's `fields[]`
5. **Implementation vs proxy**: Fields are stored on the proxy contract in discovered.json, not on implementation addresses. When resolving paths for functions on implementation addresses, the `$self` reference still navigates the proxy's fields
