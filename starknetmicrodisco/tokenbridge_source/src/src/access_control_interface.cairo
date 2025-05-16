use starknet::ContractAddress;


type RoleId = felt252;

#[starknet::interface]
trait IAccessControl<TContractState> {
    fn has_role(self: @TContractState, role: RoleId, account: ContractAddress) -> bool;
    fn get_role_admin(self: @TContractState, role: RoleId) -> RoleId;
}

// An event that is emitted when `account` is granted `role`.
// `sender` is the account that originated the contract call, an admin role
// bearer (except if `_grant_role` is called during initialization from the constructor).
#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct RoleGranted {
    role: RoleId,
    account: ContractAddress,
    sender: ContractAddress,
}

// An event that is emitted when `account` is revoked `role`.
// `sender` is the account that originated the contract call:
//   - If using `revoke_role`, it is the admin role bearer.
//   - If using `renounce_role`, it is the role bearer (i.e. `account`).
#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct RoleRevoked {
    role: RoleId,
    account: ContractAddress,
    sender: ContractAddress,
}

// An event that is emitted when `new_admin_role` is set as `role`'s admin role, replacing
// `previous_admin_role`.
// `DEFAULT_ADMIN_ROLE`(0) is the starting admin for all roles, despite {RoleAdminChanged} not
// being emitted signaling this.
#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct RoleAdminChanged {
    role: RoleId,
    previous_admin_role: RoleId,
    new_admin_role: RoleId,
}
