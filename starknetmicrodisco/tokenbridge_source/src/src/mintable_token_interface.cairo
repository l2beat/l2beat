use starknet::ContractAddress;

#[starknet::interface]
trait IMintableToken<TContractState> {
    fn permissioned_mint(ref self: TContractState, account: ContractAddress, amount: u256);
    fn permissioned_burn(ref self: TContractState, account: ContractAddress, amount: u256);
}

#[starknet::interface]
trait IMintableTokenCamel<TContractState> {
    fn permissionedMint(ref self: TContractState, account: ContractAddress, amount: u256);
    fn permissionedBurn(ref self: TContractState, account: ContractAddress, amount: u256);
}
