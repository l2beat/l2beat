use array::ArrayTrait;
use array::SpanTrait;
use option::OptionTrait;

use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};

// Holds EIC data. 
// * eic_hash is the EIC class hash.
// * eic_init_data is a span of the EIC init args.
#[derive(Copy, Drop, Serde, PartialEq)]
struct EICData {
    eic_hash: ClassHash,
    eic_init_data: Span<felt252>
}

// Holds implementation data. 
// * impl_hash is the implementation class hash.
// * eic_data is the EIC data when applicable, and empty otherwise.
// * final indicates whether the implementation is finalized.
#[derive(Copy, Drop, Serde, PartialEq)]
struct ImplementationData {
    impl_hash: ClassHash,
    eic_data: Option<EICData>,
    final: bool
}


// starknet_keccak(eic_initialize).
const EIC_INITIALIZE_SELECTOR: felt252 =
    1770792127795049777084697565458798191120226931451376769053057094489776256516;

// Duration from implementation is eligible until it expires. (1209600 = 2 weeks).
const IMPLEMENTATION_EXPIRATION: u64 = 1209600;

#[starknet::interface]
trait IEICInitializable<TContractState> {
    fn eic_initialize(ref self: TContractState, eic_init_data: Span<felt252>);
}


#[starknet::interface]
trait IReplaceable<TContractState> {
    fn get_upgrade_delay(self: @TContractState) -> u64;
    fn get_impl_activation_time(
        self: @TContractState, implementation_data: ImplementationData
    ) -> u64;
    fn add_new_implementation(ref self: TContractState, implementation_data: ImplementationData);
    fn remove_implementation(ref self: TContractState, implementation_data: ImplementationData);
    fn replace_to(ref self: TContractState, implementation_data: ImplementationData);
}

#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct ImplementationAdded {
    implementation_data: ImplementationData,
}


#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct ImplementationRemoved {
    implementation_data: ImplementationData,
}


#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct ImplementationReplaced {
    implementation_data: ImplementationData,
}

#[derive(Copy, Drop, PartialEq, starknet::Event)]
struct ImplementationFinalized {
    impl_hash: ClassHash,
}
