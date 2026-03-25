# Verification Guide: Resolving Paths Against Contract Data

## Data Access Strategy

**Never read full project data or discovered.json into context.** All data is saved to `/tmp/scan-project.json` in Step 0. Use `jq` to extract only the specific contract's fields when needed (see SKILL.md Step 1 for extraction commands).

## Contract Fields Structure

Each contract in the project response has a `fields[]` array. Each field has:
- `name` — the field name (e.g., `"owner"`, `"accessControl"`, `"$admin"`)
- `value` — a typed value object

Common value shapes:
```json
{"type": "address", "address": "eth:0x1234..."}
{"type": "number", "value": "42"}
{"type": "string", "value": "hello"}
{"type": "boolean", "value": true}
{"type": "array", "values": [...]}
{"type": "object", "values": [["key", value], ...]}
```

When verifying paths, you navigate this `fields[]` array by field name, then drill into the `value` object.

---

## Navigating `$self` Paths

To verify a path like `$self.owner`:

1. Extract the contract's fields using `jq` (see SKILL.md Step 1a)
2. Find the field with `name: "owner"` in the `fields[]` array
3. Confirm its `value` contains an address (type `"address"` with an `address` field)

Example extracted contract fields:
```json
{
  "address": "eth:0xABC123...",
  "name": "MyToken",
  "fields": [
    {"name": "owner", "value": {"type": "address", "address": "eth:0xDEF456..."}},
    {"name": "totalSupply", "value": {"type": "number", "value": "1000000"}},
    {"name": "paused", "value": {"type": "boolean", "value": false}}
  ]
}
```

For `$self.owner`: field `owner` has value type `"address"` = `"eth:0xDEF456..."` — valid.

---

## Navigating `$self.$admin` (Proxy Admin)

Proxy contracts have a special `$admin` field:

```json
{
  "fields": [
    {"name": "$admin", "value": {"type": "address", "address": "eth:0xAdminAddress..."}},
    {"name": "$implementations", "value": {"type": "array", "values": [{"type": "address", "address": "eth:0xImpl1..."}]}},
    {"name": "owner", "value": {"type": "address", "address": "eth:0xOwner..."}}
  ]
}
```

For `$self.$admin`: field `$admin` has an address value — valid.

Note: The `$` prefix on `$admin` and `$implementations` is intentional — these are special discovery system fields.

---

## Navigating AccessControl Paths

OpenZeppelin AccessControl roles appear as a nested object field:

```json
{
  "name": "accessControl",
  "value": {
    "type": "object",
    "values": [
      ["DEFAULT_ADMIN_ROLE", {"type": "object", "values": [
        ["adminRole", {"type": "string", "value": "DEFAULT_ADMIN_ROLE"}],
        ["members", {"type": "array", "values": [{"type": "address", "address": "eth:0xAdmin1..."}]}]
      ]}],
      ["MINTER_ROLE", {"type": "object", "values": [
        ["adminRole", {"type": "string", "value": "DEFAULT_ADMIN_ROLE"}],
        ["members", {"type": "array", "values": [{"type": "address", "address": "eth:0xMinter1..."}]}]
      ]}]
    ]
  }
}
```

For `$self.accessControl.MINTER_ROLE.members`:
1. Find field `accessControl` → it's an object
2. Find key `MINTER_ROLE` in its values → another object
3. Find key `members` → an array of addresses

**Important**: Role names use human-readable names, not bytes32 hashes. If the source code defines `bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE")`, the field will use `MINTER_ROLE` as the key.

**Empty members**: If `members` is an empty array, the path still resolves — it just means no one currently holds the role.

---

## Following `@fieldName` References

To verify a path like `@governor.owner`:

### Step 1: Resolve the field reference
Extract the current contract's fields. Find the field named `governor`:
```json
{"name": "governor", "value": {"type": "address", "address": "eth:0xGovernorAddress..."}}
```
The field holds address `eth:0xGovernorAddress...`.

### Step 2: Extract the target contract's fields
Use `jq` to extract fields for `eth:0xGovernorAddress...` from `/tmp/scan-project.json` (see SKILL.md Step 1a).

### Step 3: Navigate the remaining path
In the governor contract's fields, find `owner`:
```json
{"name": "owner", "value": {"type": "address", "address": "eth:0xMultisig..."}}
```

Result: `@governor.owner` resolves to `"eth:0xMultisig..."` — valid.

### Common failure: field is not an address
If `governor` field value is not type `"address"`, the `@` reference cannot be followed. Try alternative field names.

### Common failure: target contract not in project data
The address may point to a contract that wasn't included in discovery. This happens with external contracts. In this case, the path cannot be fully verified — flag it for manual review.

---

## Implementation/Proxy Address Resolution

Functions defined in implementation source files are stored under implementation addresses in functions.json, but their **field values live on the proxy contract**.

### How to find the right contract

When you have an implementation address (e.g., from a `.0.sol` source file):

1. **Direct lookup**: Extract fields for that address — if found, check if it has useful fields.

2. **Proxy lookup**: If the contract has limited fields, it may be an implementation. Check if another contract lists this address in its ABI addresses (the proxy will have ABI entries for both itself and its implementations).

3. **For path resolution**: Use the proxy contract's fields even when the function is on an implementation address. The `$self` reference resolves against the proxy's fields.

### Source file mapping
- `ContractName.p.sol` → proxy address
- `ContractName.sol` (no suffix) → first implementation address
- `ContractName.0.sol` → first implementation address
- `ContractName.1.sol` → second implementation address

---

## Verification Checklist

For each owner path expression, confirm:

- [ ] The contract reference resolves (contract exists in discovered.json)
- [ ] Each segment of the value path exists (field names are real)
- [ ] The final value contains addresses (strings matching `eth:0x` + 40 hex chars)
- [ ] For `@fieldName`: the intermediate field is an address, and the target contract exists
- [ ] For AccessControl: the role name exists under `accessControl` and `.members` is included

---

## Troubleshooting Resolution Failures

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Field not found in `fields[]` | Getter name differs from storage name | Check all available field names in the contract's `fields[]` array |
| `@fieldName` target not in entries | External contract not discovered | Flag for manual review |
| AccessControl role not found | Role name mismatch or no AccessControl | Check exact role names in the `accessControl` field's value |
| **No `accessControl` field at all** | **Handler not configured** | See section below |
| Path resolves to non-address value | Wrong field or field type changed | Try alternative paths, check field value types |
| Implementation address has no fields | Fields are on proxy, not implementation | Look up parent proxy contract |

## Missing AccessControl Handler

**This is a common and important case.** If the source code clearly uses OpenZeppelin AccessControl (`onlyRole(...)`, `_checkRole(...)`, `hasRole(...)`, or inherits `AccessControl`/`AccessControlUpgradeable`) but `values.accessControl` does **not** exist in discovered.json, the handler has not been configured.

The discovery system only runs handlers that are explicitly listed in `config.jsonc`. Without the handler, no event logs are queried and no roles appear.

**How to detect this**: Source code has AccessControl patterns, but the contract's `fields[]` array in discovered.json has no field with `name: "accessControl"`.

**Fix**: Add the handler to `packages/config/src/projects/<project>/config.jsonc`:

```jsonc
"eth:0xContractAddress...": {
  "fields": {
    "accessControl": {
      "handler": { "type": "accessControl" }
    }
  }
}
```

The handler auto-detects role names from the ABI (e.g., `function MINTER_ROLE() view returns (bytes32)`). A `roleNames` mapping is only needed for roles that don't have a public getter.

After adding the handler, re-run discovery (`l2b discover <project>` from `packages/config`) and then re-scan.
