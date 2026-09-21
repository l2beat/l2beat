# accessControl@1: OpenZeppelin AccessControl logs into { ROLE: { adminRole, members } }.
#
# Mirrors V1's AccessControlHandler: every role touched by any log appears,
# DEFAULT_ADMIN_ROLE appears even without logs, admin defaults to the zero
# hash, members are a grant-ordered set. Hashes are lower-cased before lookup
# so a role name is never missed because of hex casing.

def zeroHash: "0x" + ("0" * 64);

def emptyRole: { adminRole: zeroHash, members: [] };

def roleOf($log):
  if ($log.args.role | type) == "string" then ($log.args.role | ascii_downcase)
  else error("log \($log.event) has no bytes32 `role` argument") end;

def replay($log):
  if ($log.event | IN("RoleGranted", "RoleRevoked", "RoleAdminChanged") | not) then
    error("accessControl@1 expects RoleGranted, RoleRevoked or RoleAdminChanged logs, got \($log.event)")
  else
    roleOf($log) as $role
    | .[$role] //= emptyRole
    | if $log.event == "RoleAdminChanged" then
        .[$role].adminRole = ($log.args.newAdminRole | ascii_downcase)
      elif $log.event == "RoleGranted" then
        .[$role].members |=
          (if any(.[]; . == $log.args.account) then . else . + [$log.args.account] end)
      else
        .[$role].members |= map(select(. != $log.args.account))
      end
  end;

. as { input: $logs, args: $args }
| (
    { (zeroHash): "DEFAULT_ADMIN_ROLE" }
    + (($args.roleNames // {}) | with_entries(.key |= ascii_downcase))
  ) as $names
| def named: $names[.] // .;
  reduce $logs[] as $log ({ (zeroHash): emptyRole }; replay($log))
  | with_entries(.key |= named | .value.adminRole |= named)
