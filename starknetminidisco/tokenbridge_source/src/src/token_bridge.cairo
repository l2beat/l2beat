use starknet::ContractAddress;
use serde::Serde;
use traits::Into;
use zeroable::Zeroable;


#[starknet::contract]
mod TokenBridge {
    use super::super::err_msg::AccessErrors::{
        CALLER_MISSING_ROLE, ZERO_ADDRESS, ALREADY_INITIALIZED, ONLY_APP_GOVERNOR, ONLY_OPERATOR,
        ONLY_TOKEN_ADMIN, ONLY_UPGRADE_GOVERNOR, ONLY_SECURITY_ADMIN, ONLY_SECURITY_AGENT,
        GOV_ADMIN_CANNOT_RENOUNCE
    };
    use super::super::err_msg::ERC20Errors as ERC20Errors;
    use super::super::err_msg::ReplaceErrors as ReplaceErrors;
    use integer::BoundedInt;
    use core::result::ResultTrait;
    use starknet::SyscallResultTrait;
    use array::ArrayTrait;
    use core::hash::LegacyHash;
    use integer::{Felt252IntoU256, U64IntoFelt252};
    use option::OptionTrait;
    use serde::Serde;
    use starknet::contract_address::ContractAddressZeroable;
    use starknet::{
        ContractAddress, get_caller_address, EthAddress, EthAddressIntoFelt252, EthAddressSerde,
        EthAddressZeroable, syscalls::send_message_to_l1_syscall, syscalls::call_contract_syscall,
        syscalls::library_call_syscall, get_block_timestamp, replace_class_syscall, deploy_syscall,
        get_contract_address,
    };
    use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
    use super::super::token_bridge_interface::{
        ITokenBridge, ITokenBridgeDispatcher, ITokenBridgeDispatcherTrait
    };
    use super::super::token_bridge_admin_interface::{
        ITokenBridgeAdmin, ITokenBridgeAdminDispatcher, ITokenBridgeAdminDispatcherTrait
    };
    use super::super::access_control_interface::{
        IAccessControl, RoleId, RoleAdminChanged, RoleGranted, RoleRevoked
    };
    use super::super::roles_interface::{
        IRoles, APP_GOVERNOR, APP_ROLE_ADMIN, GOVERNANCE_ADMIN, OPERATOR, TOKEN_ADMIN,
        UPGRADE_GOVERNOR, SECURITY_ADMIN, SECURITY_AGENT, SecurityAdminAdded, SecurityAdminRemoved,
        SecurityAgentAdded, SecurityAgentRemoved, AppGovernorAdded, AppGovernorRemoved,
        AppRoleAdminAdded, AppRoleAdminRemoved, GovernanceAdminAdded, GovernanceAdminRemoved,
        OperatorAdded, OperatorRemoved, TokenAdminAdded, TokenAdminRemoved, UpgradeGovernorAdded,
        UpgradeGovernorRemoved,
    };
    use super::super::erc20_interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use super::super::mintable_token_interface::{
        IMintableTokenDispatcher, IMintableTokenDispatcherTrait
    };

    use super::super::replaceability_interface::{
        ImplementationData, IReplaceable, IReplaceableDispatcher, IReplaceableDispatcherTrait,
        IEICInitializable, EIC_INITIALIZE_SELECTOR, IMPLEMENTATION_EXPIRATION, ImplementationAdded,
        ImplementationRemoved, ImplementationReplaced, ImplementationFinalized
    };

    use traits::{Into, TryInto};
    use zeroable::Zeroable;

    const WITHDRAW_MESSAGE: felt252 = 0;
    const CONTRACT_IDENTITY: felt252 = 'STARKGATE';
    const CONTRACT_VERSION: felt252 = 2;

    const DEFAULT_DAILY_WITHDRAW_LIMIT_PCT: u8 = 5;

    const SECONDS_IN_DAY: u64 = 86400;
    const DEFAULT_UPGRADE_DELAY: u64 = 0;


    // When storing the remaining quota for today, we add 1 to the value. This is because we want
    // that 0 will mean that it was not set yet.
    const REMAINING_QUOTA_OFFSET: u256 = 1;

    // starknet_keccak('on_receive').
    const ON_RECEIVE_SELECTOR: felt252 =
        480768629706071032051132431608482761444818804172389941599997570483678682398;


    #[storage]
    struct Storage {
        // --- Token Bridge ---
        // The L1 bridge address. Zero when unset.
        l1_bridge: EthAddress,
        // The erc20 class hash.
        erc20_class_hash: ClassHash,
        // Governor of deployed L2 Tokens.
        l2_token_governance: ContractAddress,
        // Mapping from between l1<->l2 token addresses.
        l1_l2_token_map: LegacyMap<EthAddress, ContractAddress>,
        l2_l1_token_map: LegacyMap<ContractAddress, EthAddress>,
        // Mapping between l2_token => bool that defines if withdrawal limit is applied on
        // the l2_token. By default withdrawal limit is not applied.
        withdrawal_limit_applied: LegacyMap<ContractAddress, bool>,
        // For each token and day, stores the amount that can still be withdrawn from this token
        // in this day (if the value is x, the amount left to withdraw is x-1). 0 means that
        // currently there was no withdrawal from this token in this day or there were withdrawals
        // but the limit flag was turned off.
        remaining_intraday_withdraw_quota: LegacyMap<(ContractAddress, u64), u256>,
        // The daily withdrawal limit percentage.
        daily_withdrawal_limit_pct: u8,
        // `l2_token` is a legacy storage variable from older versions.
        // It's expected to be non-empty only in a case of an upgrade from such a version.
        //  This case also implies that this is the only token that is served by the bridge.
        l2_token: ContractAddress,
        // --- Replaceability ---
        // Delay in seconds before performing an upgrade.
        upgrade_delay: u64,
        // Timestamp by which implementation can be activated.
        impl_activation_time: LegacyMap<felt252, u64>,
        // Timestamp until which implementation can be activated.
        impl_expiration_time: LegacyMap<felt252, u64>,
        // Is the implementation finalized.
        finalized: bool,
        // --- Access Control ---
        // For each role id store its role admin id.
        role_admin: LegacyMap<RoleId, RoleId>,
        // For each role and address, stores true if the address has this role; otherwise, false.
        role_members: LegacyMap<(RoleId, ContractAddress), bool>,
    }

    #[event]
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    enum Event {
        // --- Token Bridge ---
        L1BridgeSet: L1BridgeSet,
        Erc20ClassHashStored: Erc20ClassHashStored,
        L2TokenGovernanceChanged: L2TokenGovernanceChanged,
        withdraw_initiated: withdraw_initiated,
        WithdrawInitiated: WithdrawInitiated,
        deposit_handled: deposit_handled,
        DepositHandled: DepositHandled,
        DepositWithMessageHandled: DepositWithMessageHandled,
        DeployHandled: DeployHandled,
        WithdrawalLimitEnabled: WithdrawalLimitEnabled,
        WithdrawalLimitDisabled: WithdrawalLimitDisabled,
        // --- Replaceability ---
        ImplementationAdded: ImplementationAdded,
        ImplementationRemoved: ImplementationRemoved,
        ImplementationReplaced: ImplementationReplaced,
        ImplementationFinalized: ImplementationFinalized,
        // --- Access Control ---
        RoleGranted: RoleGranted,
        RoleRevoked: RoleRevoked,
        RoleAdminChanged: RoleAdminChanged,
        // --- Roles ---
        AppGovernorAdded: AppGovernorAdded,
        AppGovernorRemoved: AppGovernorRemoved,
        AppRoleAdminAdded: AppRoleAdminAdded,
        AppRoleAdminRemoved: AppRoleAdminRemoved,
        GovernanceAdminAdded: GovernanceAdminAdded,
        GovernanceAdminRemoved: GovernanceAdminRemoved,
        OperatorAdded: OperatorAdded,
        OperatorRemoved: OperatorRemoved,
        TokenAdminAdded: TokenAdminAdded,
        TokenAdminRemoved: TokenAdminRemoved,
        UpgradeGovernorAdded: UpgradeGovernorAdded,
        UpgradeGovernorRemoved: UpgradeGovernorRemoved,
        SecurityAdminAdded: SecurityAdminAdded,
        SecurityAdminRemoved: SecurityAdminRemoved,
        SecurityAgentAdded: SecurityAgentAdded,
        SecurityAgentRemoved: SecurityAgentRemoved,
    }

    // An event that is emitted when set_l1_bridge is called.
    // * l1_bridge_address is the new l1 bridge address.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct L1BridgeSet {
        l1_bridge_address: EthAddress,
    }


    // Emitted when setting a new erc20_class_hash (for future).
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct Erc20ClassHashStored {
        previous_hash: ClassHash,
        erc20_class_hash: ClassHash,
    }

    // Emitted when setting/replacing the governance of the deplopyed l2_tokens.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct L2TokenGovernanceChanged {
        previous_governance: ContractAddress,
        new_governance: ContractAddress,
    }


    // Legacy event, for backward competability. Emitted only for upgraded bridge when
    // `initiate_withdraw` is called.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct withdraw_initiated {
        l1_recipient: EthAddress,
        amount: u256,
        caller_address: ContractAddress,
    }

    // Emitted when either `initiate_withdraw` or `initiate_token_withdraw` is called.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct WithdrawInitiated {
        #[key]
        l1_token: EthAddress,
        #[key]
        l1_recipient: EthAddress,
        amount: u256,
        #[key]
        caller_address: ContractAddress,
    }

    // Legacy event, for backward competability. Emitted only for upgraded bridge when
    // `handle_deposit` is called.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct deposit_handled {
        account: ContractAddress,
        amount: u256
    }

    // Emitted when either `handle_deposit` or `handle_token_deposit` is called.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct DepositHandled {
        #[key]
        l1_token: EthAddress,
        #[key]
        l2_recipient: ContractAddress,
        amount: u256
    }

    // An event that is emitted when handle_deposit_with_message is called.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct DepositWithMessageHandled {
        #[key]
        depositor: EthAddress,
        #[key]
        l1_token: EthAddress,
        #[key]
        l2_recipient: ContractAddress,
        amount: u256,
        message: Span<felt252>,
    }

    // Emitted upon processing of the handle_token_deployment L1 handler.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct DeployHandled {
        l1_token: EthAddress,
        name: felt252,
        symbol: felt252,
        decimals: u8,
    }

    // Emitted upon starting of limiting withdrawals on a token.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct WithdrawalLimitEnabled {
        #[key]
        sender: ContractAddress,
        #[key]
        l1_token: EthAddress,
    }

    // Emitted upon stopping of limiting withdrawals on a token.
    #[derive(Copy, Drop, PartialEq, starknet::Event)]
    struct WithdrawalLimitDisabled {
        #[key]
        sender: ContractAddress,
        #[key]
        l1_token: EthAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, upgrade_delay: u64) {
        self._initialize_roles();
        self.upgrade_delay.write(upgrade_delay);
        self
            .write_daily_withdrawal_limit_pct(
                daily_withdrawal_limit_pct: DEFAULT_DAILY_WITHDRAW_LIMIT_PCT
            );
    }

    #[generate_trait]
    impl WithdrawalLimitInternal of _WithdrawalLimitInternal {
        fn is_withdrawal_limit_applied(self: @ContractState, l2_token: ContractAddress) -> bool {
            self.withdrawal_limit_applied.read(l2_token)
        }

        // Sets the remaining withdrawal quota for today.
        fn set_remaining_withdrawal_quota(
            ref self: ContractState, l2_token: ContractAddress, amount: u256
        ) {
            let now = get_block_timestamp();
            let day = now / SECONDS_IN_DAY;
            self
                .remaining_intraday_withdraw_quota
                .write((l2_token, day), amount + REMAINING_QUOTA_OFFSET);
        }

        // Returns the remaining withdrawal quota for today.
        fn read_withdrawal_quota_slot(self: @ContractState, l2_token: ContractAddress) -> u256 {
            let now = get_block_timestamp();
            let day = now / SECONDS_IN_DAY;
            self.remaining_intraday_withdraw_quota.read((l2_token, day))
        }


        // Try to withdraw an amount and if it succeeds, update the remaining withdrawal quota.
        fn consume_withdrawal_quota(
            ref self: ContractState, l1_token: EthAddress, amount_to_withdraw: u256
        ) {
            let remaining_withdrawal_quota = self.get_remaining_withdrawal_quota(:l1_token);
            // This function should be called only after checking that `is_withdrawal_limit_applied`
            // is true. When limit withdrawal is disabled, the `remaining_withdrawal_quota` is
            // BoundedInt::max(). We rely on that to limit the access only to cases where limit
            // withdrawal is enabled.
            assert(
                remaining_withdrawal_quota < BoundedInt::max(), 'withdrawal_limit_applied ERROR'
            );
            assert(remaining_withdrawal_quota >= amount_to_withdraw, 'LIMIT_EXCEEDED');
            let l2_token = self.get_l2_token(:l1_token);
            self
                .set_remaining_withdrawal_quota(
                    :l2_token, amount: remaining_withdrawal_quota - amount_to_withdraw
                )
        }

        // Returns the full quota of the daily withdrawal limit for a given token.
        // The calculation is based on the limit percentage and current token total supply.
        // Note - while techincally, we're exposed to overflow error here, we consider that
        // risk non-existant for any token of even the smallest value.
        fn get_daily_withdrawal_limit(self: @ContractState, l2_token: ContractAddress) -> u256 {
            let total_supply = IERC20Dispatcher { contract_address: l2_token }.total_supply();
            let daily_withdrawal_limit_pct: u256 = self.get_daily_withdrawal_limit_pct().into();
            total_supply * daily_withdrawal_limit_pct / 100
        }

        fn get_daily_withdrawal_limit_pct(self: @ContractState) -> u8 {
            self.daily_withdrawal_limit_pct.read()
        }


        fn write_daily_withdrawal_limit_pct(
            ref self: ContractState, daily_withdrawal_limit_pct: u8
        ) {
            assert(daily_withdrawal_limit_pct <= 100, 'LIMIT_PCT_TOO_HIGH');
            self.daily_withdrawal_limit_pct.write(daily_withdrawal_limit_pct);
        }
    }

    #[generate_trait]
    impl TokenBridgeInternal of _TokenBridgeInternal {
        // --- Token Bridge ---
        // Read l1_bridge and verify it's initialized.
        fn get_l1_bridge_address(self: @ContractState) -> EthAddress {
            let l1_bridge_address = self.l1_bridge.read();
            assert(l1_bridge_address.is_non_zero(), 'UNINITIALIZED_L1_BRIDGE_ADDRESS');
            l1_bridge_address
        }

        fn only_from_l1_bridge(self: @ContractState, from_address: felt252) {
            let l1_bridge_address = self.get_l1_bridge_address();
            assert(from_address == l1_bridge_address.into(), 'EXPECTED_FROM_BRIDGE_ONLY');
        }

        fn handle_deposit_common(
            self: @ContractState,
            l2_recipient: ContractAddress,
            l2_token: ContractAddress,
            amount: u256,
        ) {
            assert(l2_token.is_non_zero(), 'TOKEN_NOT_IN_BRIDGE');

            // Call mint on l2_token contract.
            IMintableTokenDispatcher { contract_address: l2_token }
                .permissioned_mint(account: l2_recipient, :amount);
        }
    }

    #[external(v0)]
    impl TokenBridgeAdmin of ITokenBridgeAdmin<ContractState> {
        fn get_erc20_class_hash(self: @ContractState) -> ClassHash {
            self.erc20_class_hash.read()
        }

        fn get_l2_token_governance(self: @ContractState) -> ContractAddress {
            self.l2_token_governance.read()
        }
        fn set_l1_bridge(ref self: ContractState, l1_bridge_address: EthAddress) {
            // The call is restricted to the app governor.
            self.only_app_governor();
            assert(self.l1_bridge.read().is_zero(), 'L1_BRIDGE_ALREADY_INITIALIZED');
            assert(l1_bridge_address.is_non_zero(), 'ZERO_L1_BRIDGE_ADDRESS');
            self.l1_bridge.write(l1_bridge_address);
            self.emit(L1BridgeSet { l1_bridge_address });
        }

        fn set_erc20_class_hash(ref self: ContractState, erc20_class_hash: ClassHash) {
            // The call is restricted to the app governor.
            self.only_app_governor();
            let previous_hash = self.erc20_class_hash.read();
            self.erc20_class_hash.write(erc20_class_hash);
            self
                .emit(
                    Erc20ClassHashStored {
                        erc20_class_hash: erc20_class_hash, previous_hash: previous_hash
                    }
                );
        }

        fn set_l2_token_governance(ref self: ContractState, l2_token_governance: ContractAddress) {
            // The call is restricted to the app governor (l2_bridge app_governor).
            self.only_app_governor();
            let previous_governance = self.l2_token_governance.read();
            self.l2_token_governance.write(l2_token_governance);
            self
                .emit(
                    L2TokenGovernanceChanged {
                        previous_governance, new_governance: l2_token_governance
                    }
                );
        }

        // Enable withdrawal limit for a token.
        fn enable_withdrawal_limit(ref self: ContractState, l1_token: EthAddress) {
            self.only_security_agent();
            let l2_token = self.get_l2_token(:l1_token);
            assert(l2_token.is_non_zero(), 'TOKEN_NOT_IN_BRIDGE');
            self.withdrawal_limit_applied.write(l2_token, true);
            let sender = get_caller_address();
            self.emit(WithdrawalLimitEnabled { sender: sender, l1_token: l1_token });
        }

        // Disable withdrawal limit for a token.
        fn disable_withdrawal_limit(ref self: ContractState, l1_token: EthAddress) {
            self.only_security_admin();
            let l2_token = self.get_l2_token(:l1_token);
            assert(l2_token.is_non_zero(), 'TOKEN_NOT_IN_BRIDGE');
            self.withdrawal_limit_applied.write(l2_token, false);
            let sender = get_caller_address();
            self.emit(WithdrawalLimitDisabled { sender: sender, l1_token: l1_token });
        }
    }

    #[external(v0)]
    impl TokenBridge of ITokenBridge<ContractState> {
        fn get_version(self: @ContractState) -> felt252 {
            CONTRACT_VERSION
        }

        fn get_identity(self: @ContractState) -> felt252 {
            CONTRACT_IDENTITY
        }


        fn get_l1_token(self: @ContractState, l2_token: ContractAddress) -> EthAddress {
            self.l2_l1_token_map.read(l2_token)
        }
        fn get_l2_token(self: @ContractState, l1_token: EthAddress) -> ContractAddress {
            self.l1_l2_token_map.read(l1_token)
        }


        // Returns the current remaining withdrawal quota for a given token. If there is no limit,
        // returns max uint256. If the limit was not set yet, we calculate it based on the total
        // supply. Otherwise, return the limit.
        fn get_remaining_withdrawal_quota(self: @ContractState, l1_token: EthAddress) -> u256 {
            let l2_token = self.get_l2_token(:l1_token);
            // If there is no limit, return max uint256.
            if self.is_withdrawal_limit_applied(:l2_token) == false {
                return BoundedInt::max();
            }
            let remaining_quota = self.read_withdrawal_quota_slot(:l2_token);
            if remaining_quota == 0 {
                return self.get_daily_withdrawal_limit(:l2_token);
            }
            remaining_quota - REMAINING_QUOTA_OFFSET
        }

        // Legacy format of initite_withdraw. Applicable only for upgraded legacy bridges.
        // In such bridges, there is a single token that is stored in `l2_token()`.
        fn initiate_withdraw(ref self: ContractState, l1_recipient: EthAddress, amount: u256) {
            let l2_token = self.l2_token.read();
            assert(l2_token.is_non_zero(), 'L2_TOKEN_NOT_SET');
            let l1_token = self.get_l1_token(:l2_token);

            assert(l2_token == self.get_l2_token(:l1_token), 'L1_L2_TOKEN_MISMATCH');

            self.initiate_token_withdraw(:l1_token, :l1_recipient, :amount);

            // Legacy withdraw_initiated is emitted (in addition to the event that is emitted in
            // initiate_token_withdraw).
            let caller_address = get_caller_address();
            self.emit(withdraw_initiated { l1_recipient, amount, caller_address });
        }

        // Initiates an l2-to-l1 token withdraw.
        fn initiate_token_withdraw(
            ref self: ContractState, l1_token: EthAddress, l1_recipient: EthAddress, amount: u256
        ) {
            // Prevent burn to zero.
            assert(l1_recipient.is_non_zero(), 'INVALID_RECIPIENT');

            // Read addresses.
            let caller_address = get_caller_address();
            let l2_token = self.get_l2_token(:l1_token);
            assert(l2_token.is_non_zero(), 'TOKEN_NOT_IN_BRIDGE');
            let l1_bridge_address = self.get_l1_bridge_address();

            // Validate amount.
            assert(amount != 0, 'ZERO_WITHDRAWAL');
            let caller_balance = IERC20Dispatcher { contract_address: l2_token }
                .balance_of(account: caller_address);
            assert(amount <= caller_balance, 'INSUFFICIENT_FUNDS');

            if (self.is_withdrawal_limit_applied(:l2_token)) {
                self.consume_withdrawal_quota(:l1_token, amount_to_withdraw: amount);
            }

            // Call burn on l2_token contract.
            IMintableTokenDispatcher { contract_address: l2_token }
                .permissioned_burn(account: caller_address, :amount);

            // Send the message.
            let mut message_payload = ArrayTrait::new();
            WITHDRAW_MESSAGE.serialize(ref message_payload);
            l1_recipient.serialize(ref message_payload);
            l1_token.serialize(ref message_payload);
            amount.serialize(ref message_payload);

            let result = send_message_to_l1_syscall(
                to_address: l1_bridge_address.into(), payload: message_payload.span()
            );
            assert(result.is_ok(), 'MESSAGE_SEND_FAIILED');
            self.emit(WithdrawInitiated { l1_token, l1_recipient, amount, caller_address });
        }
    }

    // -- Replaceability --

    // Derives the implementation_data key.
    fn calc_impl_key(implementation_data: ImplementationData) -> felt252 {
        // Hash the implementation_data to obtain a key.
        let mut hash_input = ArrayTrait::new();
        implementation_data.serialize(ref hash_input);
        poseidon::poseidon_hash_span(hash_input.span())
    }


    #[external(v0)]
    impl Replaceable of IReplaceable<ContractState> {
        fn get_upgrade_delay(self: @ContractState) -> u64 {
            self.upgrade_delay.read()
        }

        // Returns the implementation activation time.
        fn get_impl_activation_time(
            self: @ContractState, implementation_data: ImplementationData
        ) -> u64 {
            let impl_key = calc_impl_key(:implementation_data);
            self.impl_activation_time.read(impl_key)
        }

        // Adds a new implementation.
        fn add_new_implementation(
            ref self: ContractState, implementation_data: ImplementationData
        ) {
            // The call is restricted to the upgrade governor.
            self.only_upgrade_governor();
            let activation_time = get_block_timestamp() + self.get_upgrade_delay();
            let expiration_time = activation_time + IMPLEMENTATION_EXPIRATION;
            // TODO -  add an assertion that the `implementation_data.impl_hash` is declared.
            self.set_impl_activation_time(:implementation_data, :activation_time);
            self.set_impl_expiration_time(:implementation_data, :expiration_time);
            self.emit(ImplementationAdded { implementation_data });
        }

        // Removes an existing implementation.
        fn remove_implementation(ref self: ContractState, implementation_data: ImplementationData) {
            // The call is restricted to the upgrade governor.
            self.only_upgrade_governor();

            // Read implementation activation time.
            let impl_activation_time = self.get_impl_activation_time(:implementation_data);

            if (impl_activation_time.is_non_zero()) {
                self.set_impl_activation_time(:implementation_data, activation_time: 0);
                self.set_impl_expiration_time(:implementation_data, expiration_time: 0);
                self.emit(ImplementationRemoved { implementation_data });
            }
        }

        // Replaces the non-finalized current implementation to one that was previously added and
        // whose activation time had passed.
        fn replace_to(ref self: ContractState, implementation_data: ImplementationData) {
            // The call is restricted to the upgrade governor.
            self.only_upgrade_governor();

            // Validate implementation is not finalized.
            assert(!self.is_finalized(), ReplaceErrors::FINALIZED);

            let now = get_block_timestamp();
            let impl_activation_time = self.get_impl_activation_time(:implementation_data);
            let impl_expiration_time = self.get_impl_expiration_time(:implementation_data);

            // Zero activation time means that this implementation & init vector combination
            // was not previously added.
            assert(impl_activation_time.is_non_zero(), ReplaceErrors::UNKNOWN_IMPLEMENTATION);

            assert(impl_activation_time <= now, ReplaceErrors::NOT_ENABLED_YET);
            assert(now <= impl_expiration_time, ReplaceErrors::IMPLEMENTATION_EXPIRED);
            // We emit now so that finalize emits last (if it does).
            self.emit(ImplementationReplaced { implementation_data });

            // Finalize imeplementation, if needed.
            if (implementation_data.final) {
                self.finalize();
                self.emit(ImplementationFinalized { impl_hash: implementation_data.impl_hash });
            }

            // Handle EIC.
            match implementation_data.eic_data {
                Option::Some(eic_data) => {
                    // Wrap the calldata as a span, as preperation for the library_call_syscall
                    // invocation.
                    let mut calldata_wrapper = ArrayTrait::new();
                    eic_data.eic_init_data.serialize(ref calldata_wrapper);

                    // Invoke the EIC's initialize function as a library call.
                    let res = library_call_syscall(
                        class_hash: eic_data.eic_hash,
                        function_selector: EIC_INITIALIZE_SELECTOR,
                        calldata: calldata_wrapper.span()
                    );
                    assert(res.is_ok(), ReplaceErrors::EIC_LIB_CALL_FAILED);
                },
                Option::None(()) => {}
            };

            // Replace the class hash.
            let result = starknet::replace_class_syscall(implementation_data.impl_hash);
            assert(result.is_ok(), ReplaceErrors::REPLACE_CLASS_HASH_FAILED);

            // Remove implementation data, as it was comsumed.
            self.set_impl_activation_time(:implementation_data, activation_time: 0);
            self.set_impl_expiration_time(:implementation_data, expiration_time: 0);
        }
    }

    #[generate_trait]
    impl ReplaceableInternal of _ReplaceableInternal {
        fn is_finalized(self: @ContractState) -> bool {
            self.finalized.read()
        }

        fn finalize(ref self: ContractState) {
            self.finalized.write(true);
        }


        // Sets the implementation activation time.
        fn set_impl_activation_time(
            ref self: ContractState, implementation_data: ImplementationData, activation_time: u64
        ) {
            let impl_key = calc_impl_key(:implementation_data);
            self.impl_activation_time.write(impl_key, activation_time);
        }

        // Returns the implementation activation time.
        fn get_impl_expiration_time(
            self: @ContractState, implementation_data: ImplementationData
        ) -> u64 {
            let impl_key = calc_impl_key(:implementation_data);
            self.impl_expiration_time.read(impl_key)
        }

        // Sets the implementation expiration time.
        fn set_impl_expiration_time(
            ref self: ContractState, implementation_data: ImplementationData, expiration_time: u64
        ) {
            let impl_key = calc_impl_key(:implementation_data);
            self.impl_expiration_time.write(impl_key, expiration_time);
        }
    }

    #[external(v0)]
    impl AccessControlImplExternal of IAccessControl<ContractState> {
        fn has_role(self: @ContractState, role: RoleId, account: ContractAddress) -> bool {
            self.role_members.read((role, account))
        }

        fn get_role_admin(self: @ContractState, role: RoleId) -> RoleId {
            self.role_admin.read(role)
        }
    }

    #[generate_trait]
    impl AccessControlImplInternal of _AccessControlImplInternal {
        fn grant_role(ref self: ContractState, role: RoleId, account: ContractAddress) {
            let admin = self.get_role_admin(:role);
            self.assert_only_role(role: admin);
            self._grant_role(:role, :account);
        }

        fn revoke_role(ref self: ContractState, role: RoleId, account: ContractAddress) {
            let admin = self.get_role_admin(:role);
            self.assert_only_role(role: admin);
            self._revoke_role(:role, :account);
        }

        fn renounce_role(ref self: ContractState, role: RoleId, account: ContractAddress) {
            assert(get_caller_address() == account, 'Can only renounce role for self');
            self._revoke_role(:role, :account);
        }
    }

    #[generate_trait]
    impl InternalAccessControl of _InternalAccessControl {
        fn assert_only_role(self: @ContractState, role: RoleId) {
            let authorized: bool = self.has_role(:role, account: get_caller_address());
            assert(authorized, CALLER_MISSING_ROLE);
        }

        //
        // WARNING
        // This method is unprotected and should be used only from the contract's constructor or
        // from grant_role.
        //
        fn _grant_role(ref self: ContractState, role: RoleId, account: ContractAddress) {
            if !self.has_role(:role, :account) {
                self.role_members.write((role, account), true);
                self.emit(RoleGranted { role, account, sender: get_caller_address() });
            }
        }

        //
        // WARNING
        // This method is unprotected and should be used only from revoke_role or from
        // renounce_role.
        //
        fn _revoke_role(ref self: ContractState, role: RoleId, account: ContractAddress) {
            if self.has_role(:role, :account) {
                self.role_members.write((role, account), false);
                self.emit(RoleRevoked { role, account, sender: get_caller_address() });
            }
        }

        //
        // WARNING
        // This method is unprotected and should not be used outside of a contract's constructor.
        //

        fn _set_role_admin(ref self: ContractState, role: RoleId, admin_role: RoleId) {
            let previous_admin_role = self.get_role_admin(:role);
            self.role_admin.write(role, admin_role);
            self.emit(RoleAdminChanged { role, previous_admin_role, new_admin_role: admin_role });
        }
    }


    #[external(v0)]
    impl RolesImpl of IRoles<ContractState> {
        fn is_app_governor(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: APP_GOVERNOR, :account)
        }

        fn is_app_role_admin(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: APP_ROLE_ADMIN, :account)
        }

        fn is_governance_admin(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: GOVERNANCE_ADMIN, :account)
        }

        fn is_operator(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: OPERATOR, :account)
        }

        fn is_token_admin(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: TOKEN_ADMIN, :account)
        }

        fn is_upgrade_governor(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: UPGRADE_GOVERNOR, :account)
        }

        fn is_security_admin(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: SECURITY_ADMIN, :account)
        }

        fn is_security_agent(self: @ContractState, account: ContractAddress) -> bool {
            self.has_role(role: SECURITY_AGENT, :account)
        }

        fn register_app_governor(ref self: ContractState, account: ContractAddress) {
            let event = Event::AppGovernorAdded(
                AppGovernorAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: APP_GOVERNOR, :account, :event);
        }

        fn remove_app_governor(ref self: ContractState, account: ContractAddress) {
            let event = Event::AppGovernorRemoved(
                AppGovernorRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: APP_GOVERNOR, :account, :event);
        }

        fn register_app_role_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::AppRoleAdminAdded(
                AppRoleAdminAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: APP_ROLE_ADMIN, :account, :event);
        }

        fn remove_app_role_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::AppRoleAdminRemoved(
                AppRoleAdminRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: APP_ROLE_ADMIN, :account, :event);
        }

        fn register_security_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::SecurityAdminAdded(
                SecurityAdminAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: SECURITY_ADMIN, :account, :event);
        }

        fn remove_security_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::SecurityAdminRemoved(
                SecurityAdminRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: SECURITY_ADMIN, :account, :event);
        }

        fn register_security_agent(ref self: ContractState, account: ContractAddress) {
            let event = Event::SecurityAgentAdded(
                SecurityAgentAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: SECURITY_AGENT, :account, :event);
        }

        fn remove_security_agent(ref self: ContractState, account: ContractAddress) {
            let event = Event::SecurityAgentRemoved(
                SecurityAgentRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: SECURITY_AGENT, :account, :event);
        }


        fn register_governance_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::GovernanceAdminAdded(
                GovernanceAdminAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: GOVERNANCE_ADMIN, :account, :event);
        }

        fn remove_governance_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::GovernanceAdminRemoved(
                GovernanceAdminRemoved {
                    removed_account: account, removed_by: get_caller_address()
                }
            );
            self._revoke_role_and_emit(role: GOVERNANCE_ADMIN, :account, :event);
        }

        fn register_operator(ref self: ContractState, account: ContractAddress) {
            let event = Event::OperatorAdded(
                OperatorAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: OPERATOR, :account, :event);
        }

        fn remove_operator(ref self: ContractState, account: ContractAddress) {
            let event = Event::OperatorRemoved(
                OperatorRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: OPERATOR, :account, :event);
        }

        fn register_token_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::TokenAdminAdded(
                TokenAdminAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: TOKEN_ADMIN, :account, :event);
        }

        fn remove_token_admin(ref self: ContractState, account: ContractAddress) {
            let event = Event::TokenAdminRemoved(
                TokenAdminRemoved { removed_account: account, removed_by: get_caller_address() }
            );
            self._revoke_role_and_emit(role: TOKEN_ADMIN, :account, :event);
        }

        fn register_upgrade_governor(ref self: ContractState, account: ContractAddress) {
            let event = Event::UpgradeGovernorAdded(
                UpgradeGovernorAdded { added_account: account, added_by: get_caller_address() }
            );
            self._grant_role_and_emit(role: UPGRADE_GOVERNOR, :account, :event);
        }

        fn remove_upgrade_governor(ref self: ContractState, account: ContractAddress) {
            let event = Event::UpgradeGovernorRemoved(
                UpgradeGovernorRemoved {
                    removed_account: account, removed_by: get_caller_address()
                }
            );
            self._revoke_role_and_emit(role: UPGRADE_GOVERNOR, :account, :event);
        }

        // TODO -  change the fn name to renounce_role when we can have modularity.
        // TODO -  change to GOVERNANCE_ADMIN_CANNOT_SELF_REMOVE when the 32 characters limitations
        // is off.
        fn renounce(ref self: ContractState, role: RoleId) {
            assert(role != GOVERNANCE_ADMIN, GOV_ADMIN_CANNOT_RENOUNCE);
            self.renounce_role(:role, account: get_caller_address())
        // TODO add another event? Currently there are two events when a role is removed but
        // only one if it was renounced.
        }
    }


    #[generate_trait]
    impl RolesInternal of _RolesInternal {
        // TODO -  change the fn name to _grant_role when we can have modularity.
        fn _grant_role_and_emit(
            ref self: ContractState, role: RoleId, account: ContractAddress, event: Event
        ) {
            if !self.has_role(:role, :account) {
                assert(account.is_non_zero(), ZERO_ADDRESS);
                self.grant_role(:role, :account);
                self.emit(event);
            }
        }

        // TODO -  change the fn name to _revoke_role when we can have modularity.
        fn _revoke_role_and_emit(
            ref self: ContractState, role: RoleId, account: ContractAddress, event: Event
        ) {
            if self.has_role(:role, :account) {
                self.revoke_role(:role, :account);
                self.emit(event);
            }
        }
        //
        // WARNING
        // The following internal method is unprotected and should not be used outside of a
        // contract's constructor.
        //
        // TODO -  This function should be under initialize function under roles contract.

        fn _initialize_roles(ref self: ContractState) {
            let provisional_governance_admin = get_caller_address();
            let un_initialized = self.get_role_admin(role: GOVERNANCE_ADMIN) == 0;
            assert(un_initialized, ALREADY_INITIALIZED);
            self._grant_role(role: GOVERNANCE_ADMIN, account: provisional_governance_admin);
            self._set_role_admin(role: APP_GOVERNOR, admin_role: APP_ROLE_ADMIN);
            self._set_role_admin(role: APP_ROLE_ADMIN, admin_role: GOVERNANCE_ADMIN);
            self._set_role_admin(role: GOVERNANCE_ADMIN, admin_role: GOVERNANCE_ADMIN);
            self._set_role_admin(role: OPERATOR, admin_role: APP_ROLE_ADMIN);
            self._set_role_admin(role: TOKEN_ADMIN, admin_role: APP_ROLE_ADMIN);
            self._set_role_admin(role: UPGRADE_GOVERNOR, admin_role: GOVERNANCE_ADMIN);

            self._grant_role(role: SECURITY_ADMIN, account: provisional_governance_admin);
            self._set_role_admin(role: SECURITY_ADMIN, admin_role: SECURITY_ADMIN);
            self._set_role_admin(role: SECURITY_AGENT, admin_role: SECURITY_ADMIN);
        }

        fn only_app_governor(self: @ContractState) {
            assert(self.is_app_governor(get_caller_address()), ONLY_APP_GOVERNOR);
        }
        fn only_operator(self: @ContractState) {
            assert(self.is_operator(get_caller_address()), ONLY_OPERATOR);
        }
        fn only_token_admin(self: @ContractState) {
            assert(self.is_token_admin(get_caller_address()), ONLY_TOKEN_ADMIN);
        }
        fn only_upgrade_governor(self: @ContractState) {
            assert(self.is_upgrade_governor(get_caller_address()), ONLY_UPGRADE_GOVERNOR);
        }

        fn only_security_admin(self: @ContractState) {
            assert(self.is_security_admin(get_caller_address()), ONLY_SECURITY_ADMIN);
        }

        fn only_security_agent(self: @ContractState) {
            assert(self.is_security_agent(get_caller_address()), ONLY_SECURITY_AGENT);
        }
    }


    // Legacy format of handle_deposit. Applicable only for legacy bridges.
    // In such bridges, there is a single token that is stored in `l2_token()`.
    #[l1_handler]
    fn handle_deposit(
        ref self: ContractState, from_address: felt252, l2_recipient: ContractAddress, amount: u256,
    ) {
        let l2_token = self.l2_token.read();
        assert(l2_token.is_non_zero(), 'TOKEN_CONFIG_MISMATCH');
        let l1_token = self.get_l1_token(:l2_token);

        assert(l2_token == self.get_l2_token(:l1_token), 'L1_L2_TOKEN_MISMATCH');

        // Verify deposit originating from the l1 bridge.
        self.only_from_l1_bridge(:from_address);

        self.handle_deposit_common(:l2_recipient, :l2_token, :amount);
        self.emit(DepositHandled { l1_token, l2_recipient, amount });
        self.emit(deposit_handled { account: l2_recipient, amount });
    }

    // Handles an l1-to-l2 token deposit.
    #[l1_handler]
    fn handle_token_deposit(
        ref self: ContractState,
        from_address: felt252,
        l1_token: EthAddress,
        depositor: EthAddress,
        l2_recipient: ContractAddress,
        amount: u256,
    ) {
        // Verify deposit originating from the l1 bridge.
        self.only_from_l1_bridge(:from_address);

        let l2_token = self.get_l2_token(:l1_token);
        self.handle_deposit_common(:l2_recipient, :l2_token, :amount);
        self.emit(DepositHandled { l1_token, l2_recipient, amount });
    }

    #[l1_handler]
    fn handle_deposit_with_message(
        ref self: ContractState,
        from_address: felt252,
        l1_token: EthAddress,
        depositor: EthAddress,
        l2_recipient: ContractAddress,
        amount: u256,
        message: Span<felt252>,
    ) {
        // Verify deposit originating from the l1 bridge.
        self.only_from_l1_bridge(:from_address);

        let l2_token = self.get_l2_token(:l1_token);
        self.handle_deposit_common(:l2_recipient, :l2_token, :amount);

        // Create the calldata that will be sent to on_receive. l2_token, amount and
        // depositor are the fields from the deposit context.
        let mut calldata = ArrayTrait::new();
        l2_token.serialize(ref calldata);
        amount.serialize(ref calldata);
        depositor.serialize(ref calldata);
        message.serialize(ref calldata);

        let mut on_receive_result = call_contract_syscall(
            address: l2_recipient,
            entry_point_selector: ON_RECEIVE_SELECTOR,
            calldata: calldata.span()
        );
        assert(on_receive_result.is_ok(), 'ON_RECEIVE_FAILED');

        let mut on_receive_result_unwrapped = on_receive_result.unwrap();
        let on_receive_success = Serde::<bool>::deserialize(ref on_receive_result_unwrapped)
            .unwrap();
        assert(on_receive_success, 'DEPOSIT_REJECTED');

        self.emit(DepositWithMessageHandled { depositor, l1_token, l2_recipient, amount, message });
    }

    #[l1_handler]
    fn handle_token_deployment(
        ref self: ContractState,
        from_address: felt252,
        l1_token: EthAddress,
        name: felt252,
        symbol: felt252,
        decimals: u8
    ) {
        // Upgraded legacy bridge is not allowed to deploy tokens.
        let l2_token = self.l2_token.read();
        // l2_token != 0 implies the bridge is an upgraded legacy bridge.
        assert(l2_token.is_zero(), 'DEPLOY_TOKEN_DISALLOWED');

        // Verify deploy originating from the l1 bridge.
        self.only_from_l1_bridge(:from_address);
        assert(self.l1_l2_token_map.read(l1_token).is_zero(), 'TOKEN_ALREADY_EXISTS');
        let l2_token_governance = self.get_l2_token_governance();
        assert(l2_token_governance.is_non_zero(), 'L2_TOKEN_GOV_NOT_SET');
        let class_hash = self.get_erc20_class_hash();
        assert(class_hash.is_non_zero(), 'L2_TOKEN_CLASS_HASH_NOT_SET');

        let initial_supply = 0_u256;
        let permitted_minter = get_contract_address();
        let initial_recipient = permitted_minter;
        let mut calldata = ArrayTrait::new();
        name.serialize(ref calldata);
        symbol.serialize(ref calldata);
        decimals.serialize(ref calldata);
        initial_supply.serialize(ref calldata);
        initial_recipient.serialize(ref calldata);
        permitted_minter.serialize(ref calldata);
        l2_token_governance.serialize(ref calldata);
        DEFAULT_UPGRADE_DELAY.serialize(ref calldata);

        // Deploy the contract.
        // Using `l1_token` as salt to enforce uniqueness.
        let (l2_token, _) = deploy_syscall(class_hash, l1_token.into(), calldata.span(), false)
            .unwrap_syscall();

        self.l1_l2_token_map.write(l1_token, l2_token);
        self.l2_l1_token_map.write(l2_token, l1_token);

        self
            .emit(
                DeployHandled { l1_token: l1_token, name: name, symbol: symbol, decimals: decimals }
            );
    }
}
