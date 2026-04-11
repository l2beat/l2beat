// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Errors library
 * @author BGD Labs
 * @notice Defines the error messages emitted by the different contracts of the Aave Governance V3
 */
library Errors {
  string public constant VOTING_PORTALS_COUNT_NOT_0 = '1'; // to be able to rescue voting portals count must be 0
  string public constant AT_LEAST_ONE_PAYLOAD = '2'; // to create a proposal, it must have at least one payload
  string public constant VOTING_PORTAL_NOT_APPROVED = '3'; // the voting portal used to vote on proposal must be approved
  string public constant PROPOSITION_POWER_IS_TOO_LOW = '4'; // proposition power of proposal creator must be equal or higher than the specified threshold for the access level
  string public constant PROPOSAL_NOT_IN_CREATED_STATE = '5'; // proposal should be in the CREATED state
  string public constant PROPOSAL_NOT_IN_ACTIVE_STATE = '6'; // proposal must be in an ACTIVE state
  string public constant PROPOSAL_NOT_IN_QUEUED_STATE = '7'; // proposal must be in a QUEUED state
  string public constant VOTING_START_COOLDOWN_PERIOD_NOT_PASSED = '8'; // to activate a proposal vote, the cool down delay must pass
  string public constant CALLER_NOT_A_VALID_VOTING_PORTAL = '9'; // only an allowed voting portal can queue a proposal
  string public constant QUEUE_COOLDOWN_PERIOD_NOT_PASSED = '10'; // to execute a proposal a cooldown delay must pass
  string public constant PROPOSAL_NOT_IN_THE_CORRECT_STATE = '11'; // proposal must be created but not executed yet to be able to be canceled
  string public constant CALLER_NOT_GOVERNANCE = '12'; // caller must be governance
  string public constant VOTER_ALREADY_VOTED_ON_PROPOSAL = '13'; // voter can only vote once per proposal using voting portal
  string public constant WRONG_MESSAGE_ORIGIN = '14'; // received message must come from registered source address, chain id, CrossChainController
  string public constant NO_VOTING_ASSETS = '15'; // Strategy must have voting assets
  string public constant PROPOSAL_VOTE_ALREADY_CREATED = '16'; // vote on proposal can only be created once
  string public constant INVALID_SIGNATURE = '17'; // submitted signature is not valid
  string public constant PROPOSAL_VOTE_NOT_FINISHED = '18'; // proposal vote must be finished
  string public constant PROPOSAL_VOTE_NOT_IN_ACTIVE_STATE = '19'; // proposal vote must be in active state
  string public constant PROPOSAL_VOTE_ALREADY_EXISTS = '20'; // proposal vote already exists
  string public constant VOTE_ONCE_FOR_ASSET = '21'; // an asset can only be used once per vote
  string public constant USER_BALANCE_DOES_NOT_EXISTS = '22'; // to vote an user must have balance in the token the user is voting with
  string public constant USER_VOTING_BALANCE_IS_ZERO = '23'; // to vote an user must have some balance between all the tokens selected for voting
  string public constant MISSING_AAVE_ROOTS = '24'; // must have AAVE roots registered to use strategy
  string public constant MISSING_STK_AAVE_ROOTS = '25'; // must have stkAAVE roots registered to use strategy
  string public constant MISSING_STK_AAVE_SLASHING_EXCHANGE_RATE = '26'; // must have stkAAVE slashing exchange rate registered to use strategy
  string public constant UNPROCESSED_STORAGE_ROOT = '27'; // root must be registered beforehand
  string public constant NOT_ENOUGH_MSG_VALUE = '28'; // method was not called with enough value to execute the call
  string public constant FAILED_ACTION_EXECUTION = '29'; // action failed to execute
  string public constant SHOULD_BE_AT_LEAST_ONE_EXECUTOR = '30'; // at least one executor is needed
  string public constant INVALID_EMPTY_TARGETS = '31'; // target of the payload execution must not be empty
  string public constant EXECUTOR_WAS_NOT_SPECIFIED_FOR_REQUESTED_ACCESS_LEVEL =
    '32'; // payload executor must be registered for the specified payload access level
  string public constant PAYLOAD_NOT_IN_QUEUED_STATE = '33'; // payload must be en the queued state
  string public constant TIMELOCK_NOT_FINISHED = '34'; // delay has not passed before execution can be called
  string public constant PAYLOAD_NOT_IN_THE_CORRECT_STATE = '35'; // payload must be created but not executed yet to be able to be canceled
  string public constant PAYLOAD_NOT_IN_CREATED_STATE = '36'; // payload must be in the created state
  string public constant MISSING_A_AAVE_ROOTS = '37'; // must have aAAVE roots registered to use strategy
  string public constant MISSING_PROPOSAL_BLOCK_HASH = '38'; // block hash for this proposal was not bridged before
  string public constant PROPOSAL_VOTE_CONFIGURATION_ALREADY_BRIDGED = '39'; // configuration for this proposal bridged already
  string public constant INVALID_VOTING_PORTAL_ADDRESS = '40'; // voting portal address can't be 0x0
  string public constant INVALID_POWER_STRATEGY = '41'; // 0x0 is not valid as the power strategy
  string public constant INVALID_EXECUTOR_ADDRESS = '42'; // executor address can't be 0x0
  string public constant EXECUTOR_ALREADY_SET_IN_DIFFERENT_LEVEL = '43'; // executor address already being used as executor of a different level
  string public constant INVALID_VOTING_DURATION = '44'; // voting duration can not be bigger than the time it takes to execute a proposal
  string public constant VOTING_DURATION_NOT_PASSED = '45'; // at least votingDuration should have passed since voting started for a proposal to be queued
  string public constant INVALID_PROPOSAL_ACCESS_LEVEL = '46'; // the bridged proposal access level does not correspond with the maximum access level required by the payload
  string public constant PAYLOAD_NOT_CREATED_BEFORE_PROPOSAL = '47'; // payload must be created before proposal
  string public constant INVALID_CROSS_CHAIN_CONTROLLER_ADDRESS = '48';
  string public constant INVALID_MESSAGE_ORIGINATOR_ADDRESS = '49';
  string public constant INVALID_ORIGIN_CHAIN_ID = '50';
  string public constant INVALID_ACTION_TARGET = '51';
  string public constant INVALID_ACTION_ACCESS_LEVEL = '52';
  string public constant INVALID_EXECUTOR_ACCESS_LEVEL = '53';
  string public constant INVALID_VOTING_PORTAL_CROSS_CHAIN_CONTROLLER = '54';
  string public constant INVALID_VOTING_PORTAL_VOTING_MACHINE = '55';
  string public constant INVALID_VOTING_PORTAL_GOVERNANCE = '56';
  string public constant INVALID_VOTING_MACHINE_CHAIN_ID = '57';
  string public constant G_INVALID_CROSS_CHAIN_CONTROLLER_ADDRESS = '58';
  string public constant G_INVALID_IPFS_HASH = '59';
  string public constant G_INVALID_PAYLOAD_ACCESS_LEVEL = '60';
  string public constant G_INVALID_PAYLOADS_CONTROLLER = '61';
  string public constant G_INVALID_PAYLOAD_CHAIN = '62';
  string public constant POWER_STRATEGY_HAS_NO_TOKENS = '63'; // power strategy should at least have
  string public constant INVALID_VOTING_CONFIG_ACCESS_LEVEL = '64';
  string public constant VOTING_DURATION_TOO_SMALL = '65';
  string public constant NO_BRIDGED_VOTING_ASSETS = '66';
  string public constant INVALID_VOTER = '67';
  string public constant INVALID_DATA_WAREHOUSE = '68';
  string public constant INVALID_VOTING_MACHINE_CROSS_CHAIN_CONTROLLER = '69';
  string public constant INVALID_L1_VOTING_PORTAL = '70';
  string public constant INVALID_VOTING_PORTAL_CHAIN_ID = '71';
  string public constant INVALID_VOTING_STRATEGY = '72';
  string public constant INVALID_VOTE_CONFIGURATION_BLOCKHASH = '73';
  string public constant INVALID_VOTE_CONFIGURATION_VOTING_DURATION = '74';
  string public constant INVALID_GAS_LIMIT = '75';
  string public constant INVALID_VOTING_CONFIGS = '76'; // a lvl2 voting configuration must be sent to initializer
  string public constant INVALID_EXECUTOR_DELAY = '77';
  string public constant REPEATED_STRATEGY_ASSET = '78';
  string public constant EMPTY_ASSET_STORAGE_SLOTS = '79';
  string public constant REPEATED_STRATEGY_ASSET_SLOT = '80';
  string public constant INVALID_EXECUTION_TARGET = '81';
  string public constant MISSING_VOTING_CONFIGURATIONS = '82'; // voting configurations for lvl1 and lvl2 must be included on initialization
  string public constant INVALID_PROPOSITION_POWER = '83';
  string public constant INVALID_YES_THRESHOLD = '84';
  string public constant INVALID_YES_NO_DIFFERENTIAL = '85';
  string public constant ETH_TRANSFER_FAILED = '86';
  string public constant INVALID_INITIAL_VOTING_CONFIGS = '87'; // initial voting configurations can not be of the same level
  string public constant INVALID_VOTING_PORTAL_ADDRESS_IN_VOTING_MACHINE = '88';
  string public constant INVALID_VOTING_PORTAL_OWNER = '89';
  string public constant CANCELLATION_FEE_REDEEM_FAILED = '90'; // cancellation fee was not able to be redeemed
  string public constant INVALID_CANCELLATION_FEE_COLLECTOR = '91'; // collector can not be address 0
  string public constant INVALID_CANCELLATION_FEE_SENT = '92'; // cancellation fee sent does not match the needed amount
  string public constant CANCELLATION_FEE_ALREADY_REDEEMED = '93'; // cancellation fee already redeemed
  string public constant INVALID_STATE_TO_REDEEM_CANCELLATION_FEE = '94'; // proposal state is not a valid state to redeem cancellation fee
  string public constant MISSING_REPRESENTATION_ROOTS = '95'; // to represent a voter the representation roots need to be registered
  string public constant CALLER_IS_NOT_VOTER_REPRESENTATIVE = '96'; // to represent a voter, caller must be the stored representative
  string public constant VM_INVALID_GOVERNANCE_ADDRESS = '97'; // governance address can not be 0
  string public constant ALL_DELEGATION_ACTIONS_FAILED = '98'; // all meta delegation actions failed on MetaDelegateHelper
}
