// SPDX-License-Identifier: Unknown
pragma solidity 0.6.11;

contract GovernanceStorage {
    struct GovernanceInfoStruct {
        mapping(address => bool) effectiveGovernors;
        address candidateGovernor;
        bool initialized;
    }

    // A map from a Governor tag to its own GovernanceInfoStruct.
    mapping(string => GovernanceInfoStruct) internal governanceInfo;
}

contract ProxyStorage is GovernanceStorage {
    // NOLINTNEXTLINE: naming-convention uninitialized-state.
    mapping(address => bytes32) internal initializationHash_DEPRECATED;

    // The time after which we can switch to the implementation.
    // Hash(implementation, data, finalize) => time.
    mapping(bytes32 => uint256) internal enabledTime;

    // A central storage of the flags whether implementation has been initialized.
    // Note - it can be used flexibly enough to accommodate multiple levels of initialization
    // (i.e. using different key salting schemes for different initialization levels).
    mapping(bytes32 => bool) internal initialized;
}

library StarkExTypes {
    // Structure representing a list of verifiers (validity/availability).
    // A statement is valid only if all the verifiers in the list agree on it.
    // Adding a verifier to the list is immediate - this is used for fast resolution of
    // any soundness issues.
    // Removing from the list is time-locked, to ensure that any user of the system
    // not content with the announced removal has ample time to leave the system before it is
    // removed.
    struct ApprovalChainData {
        address[] list;
        // Represents the time after which the verifier with the given address can be removed.
        // Removal of the verifier with address A is allowed only in the case the value
        // of unlockedForRemovalTime[A] != 0 and unlockedForRemovalTime[A] < (current time).
        mapping(address => uint256) unlockedForRemovalTime;
    }
}

contract MainStorage is ProxyStorage {
    uint256 internal constant LAYOUT_LENGTH = 2**64;

    address escapeVerifierAddress; // NOLINT: constable-states.

    // Global dex-frozen flag.
    bool stateFrozen; // NOLINT: constable-states.

    // Time when unFreeze can be successfully called (UNFREEZE_DELAY after freeze).
    uint256 unFreezeTime; // NOLINT: constable-states.

    // Pending deposits.
    // A map STARK key => asset id => vault id => quantized amount.
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) pendingDeposits;

    // Cancellation requests.
    // A map STARK key => asset id => vault id => request timestamp.
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) cancellationRequests;

    // Pending withdrawals.
    // A map STARK key => asset id => quantized amount.
    mapping(uint256 => mapping(uint256 => uint256)) pendingWithdrawals;

    // vault_id => escape used boolean.
    mapping(uint256 => bool) escapesUsed;

    // Number of escapes that were performed when frozen.
    uint256 escapesUsedCount; // NOLINT: constable-states.

    // NOTE: fullWithdrawalRequests is deprecated, and replaced by forcedActionRequests.
    // NOLINTNEXTLINE naming-convention.
    mapping(uint256 => mapping(uint256 => uint256)) fullWithdrawalRequests_DEPRECATED;

    // State sequence number.
    uint256 sequenceNumber; // NOLINT: constable-states uninitialized-state.

    // Vaults Tree Root & Height.
    uint256 vaultRoot; // NOLINT: constable-states uninitialized-state.
    uint256 vaultTreeHeight; // NOLINT: constable-states uninitialized-state.

    // Order Tree Root & Height.
    uint256 orderRoot; // NOLINT: constable-states uninitialized-state.
    uint256 orderTreeHeight; // NOLINT: constable-states uninitialized-state.

    // True if and only if the address is allowed to add tokens.
    mapping(address => bool) tokenAdmins;

    // This mapping is no longer in use, remains for backwards compatibility.
    mapping(address => bool) userAdmins_DEPRECATED; // NOLINT: naming-convention.

    // True if and only if the address is an operator (allowed to update state).
    mapping(address => bool) operators;

    // Mapping of contract ID to asset data.
    mapping(uint256 => bytes) assetTypeToAssetInfo; // NOLINT: uninitialized-state.

    // Mapping of registered contract IDs.
    mapping(uint256 => bool) registeredAssetType; // NOLINT: uninitialized-state.

    // Mapping from contract ID to quantum.
    mapping(uint256 => uint256) assetTypeToQuantum; // NOLINT: uninitialized-state.

    // This mapping is no longer in use, remains for backwards compatibility.
    mapping(address => uint256) starkKeys_DEPRECATED; // NOLINT: naming-convention.

    // Mapping from STARK public key to the Ethereum public key of its owner.
    mapping(uint256 => address) ethKeys; // NOLINT: uninitialized-state.

    // Timelocked state transition and availability verification chain.
    StarkExTypes.ApprovalChainData verifiersChain;
    StarkExTypes.ApprovalChainData availabilityVerifiersChain;

    // Batch id of last accepted proof.
    uint256 lastBatchId; // NOLINT: constable-states uninitialized-state.

    // Mapping between sub-contract index to sub-contract address.
    mapping(uint256 => address) subContracts; // NOLINT: uninitialized-state.

    mapping(uint256 => bool) permissiveAssetType_DEPRECATED; // NOLINT: naming-convention.
    // ---- END OF MAIN STORAGE AS DEPLOYED IN STARKEX2.0 ----

    // Onchain-data version configured for the system.
    uint256 onchainDataVersion; // NOLINT: constable-states uninitialized-state.

    // Counter of forced action request in block. The key is the block number.
    mapping(uint256 => uint256) forcedRequestsInBlock;

    // ForcedAction requests: actionHash => requestTime.
    mapping(bytes32 => uint256) forcedActionRequests;

    // Mapping for timelocked actions.
    // A actionKey => activation time.
    mapping(bytes32 => uint256) actionsTimeLock;

    // Append only list of requested forced action hashes.
    bytes32[] actionHashList;

    // Reserved storage space for Extensibility.
    // Every added MUST be added above the end gap, and the __endGap size must be reduced
    // accordingly.
    // NOLINTNEXTLINE: naming-convention.
    uint256[LAYOUT_LENGTH - 37] private __endGap; // __endGap complements layout to LAYOUT_LENGTH.
}

abstract contract IDispatcherBase {
    function getSubContract(bytes4 selector) internal view virtual returns (address);

    function setSubContractAddress(uint256 index, address subContract) internal virtual;

    function getNumSubcontracts() internal pure virtual returns (uint256);

    function validateSubContractIndex(uint256 index, address subContract) internal pure virtual;

    /*
      Ensures initializer can be called. Reverts otherwise.
    */
    function initializationSentinel() internal view virtual;
}

abstract contract BlockDirectCall {
    bytes32 immutable UNIQUE_SAFEGUARD_SLOT; // NOLINT naming-convention.

    constructor() internal {
        // The slot is pseudo-random to allow hierarchy of contracts with guarded functions.
        bytes32 slot = keccak256(abi.encode(this, block.timestamp, gasleft()));
        UNIQUE_SAFEGUARD_SLOT = slot;
        assembly {
            sstore(slot, 42)
        }
    }

    modifier notCalledDirectly() {
        {
            // Prevent too many local variables in stack.
            uint256 safeGuardValue;
            bytes32 slot = UNIQUE_SAFEGUARD_SLOT;
            assembly {
                safeGuardValue := sload(slot)
            }
            require(safeGuardValue == 0, "DIRECT_CALL_DISALLOWED");
        }
        _;
    }
}

library Addresses {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function performEthTransfer(address recipient, uint256 amount) internal {
        (bool success, ) = recipient.call{value: amount}(""); // NOLINT: low-level-calls.
        require(success, "ETH_TRANSFER_FAILED");
    }

    /*
      Safe wrapper around ERC20/ERC721 calls.
      This is required because many deployed ERC20 contracts don't return a value.
      See https://github.com/ethereum/solidity/issues/4116.
    */
    function safeTokenContractCall(address tokenAddress, bytes memory callData) internal {
        require(isContract(tokenAddress), "BAD_TOKEN_ADDRESS");
        // NOLINTNEXTLINE: low-level-calls.
        (bool success, bytes memory returndata) = tokenAddress.call(callData);
        require(success, string(returndata));

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "TOKEN_OPERATION_FAILED");
        }
    }

    /*
      Validates that the passed contract address is of a real contract,
      and that its id hash (as infered fromn identify()) matched the expected one.
    */
    function validateContractId(address contractAddress, bytes32 expectedIdHash) internal {
        require(isContract(contractAddress), "ADDRESS_NOT_CONTRACT");
        (bool success, bytes memory returndata) = contractAddress.call( // NOLINT: low-level-calls.
            abi.encodeWithSignature("identify()")
        );
        require(success, "FAILED_TO_IDENTIFY_CONTRACT");
        string memory realContractId = abi.decode(returndata, (string));
        require(
            keccak256(abi.encodePacked(realContractId)) == expectedIdHash,
            "UNEXPECTED_CONTRACT_IDENTIFIER"
        );
    }
}

abstract contract MainDispatcherBase is IDispatcherBase, BlockDirectCall {
    using Addresses for address;

    /*
      This entry point serves only transactions with empty calldata. (i.e. pure value transfer tx).
      We don't expect to receive such, thus block them.
    */
    receive() external payable {
        revert("CONTRACT_NOT_EXPECTED_TO_RECEIVE");
    }

    fallback() external payable {
        address subContractAddress = getSubContract(msg.sig);
        require(subContractAddress != address(0x0), "NO_CONTRACT_FOR_FUNCTION");

        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 for now, as we don"t know the out size yet.
            let result := delegatecall(gas(), subContractAddress, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /*
      1. Extract subcontracts.
      2. Verify correct sub-contract initializer size.
      3. Extract sub-contract initializer data.
      4. Call sub-contract initializer.

      The init data bytes passed to initialize are structed as following:
      I. N slots (uin256 size) addresses of the deployed sub-contracts.
      II. An address of an external initialization contract (optional, or ZERO_ADDRESS).
      III. (Up to) N bytes sections of the sub-contracts initializers.

      If already initialized (i.e. upgrade) we expect the init data to be consistent with this.
      and if a different size of init data is expected when upgrading, the initializerSize should
      reflect this.

      If an external initializer contract is not used, ZERO_ADDRESS is passed in its slot.
      If the external initializer contract is used, all the remaining init data is passed to it,
      and internal initialization will not occur.

      External Initialization Contract
      --------------------------------
      External Initialization Contract (EIC) is a hook for custom initialization.
      Typically in an upgrade flow, the expected initialization contains only the addresses of
      the sub-contracts. Normal initialization of the sub-contracts is such that is not needed
      in an upgrade, and actually may be very dangerous, as changing of state on a working system
      may corrupt it.

      In the event that some state initialization is required, the EIC is a hook that allows this.
      It may be deployed and called specifically for this purpose.

      The address of the EIC must be provided (if at all) when a new implementation is added to
      a Proxy contract (as part of the initialization vector).
      Hence, it is considered part of the code open to reviewers prior to a time-locked upgrade.

      When a custom initialization is performed using an EIC,
      the main dispatcher initialize extracts and stores the sub-contracts addresses, and then
      yields to the EIC, skipping the rest of its initialization code.


      Flow of MainDispatcher initialize
      ---------------------------------
      1. Extraction and assignment of subcontracts addresses
         Main dispatcher expects a valid and consistent set of addresses in the passed data.
         It validates that, extracts the addresses from the data, and validates that the addresses
         are of the expected type and order. Then those addresses are stored.

      2. Extraction of EIC address
         The address of the EIC is extracted from the data.
         External Initializer Contract is optional. ZERO_ADDRESS indicates it is not used.

      3a. EIC is used
          Dispatcher calls the EIC initialize function with the remaining data.
          Note - In this option 3b is not performed.

      3b. EIC is not used
          If there is additional initialization data then:
          I. Sentitenl function is called to permit subcontracts initialization.
          II. Dispatcher loops through the subcontracts and for each one it extracts the
              initializing data and passes it to the subcontract's initialize function.

    */
    function initialize(bytes calldata data) external virtual notCalledDirectly {
        // Number of sub-contracts.
        uint256 nSubContracts = getNumSubcontracts();

        // We support currently 4 bits per contract, i.e. 16, reserving 00 leads to 15.
        require(nSubContracts <= 15, "TOO_MANY_SUB_CONTRACTS");

        // Sum of subcontract initializers. Aggregated for verification near the end.
        uint256 totalInitSizes = 0;

        // Offset (within data) of sub-contract initializer vector.
        // Just past the sub-contract+eic addresses.
        uint256 initDataContractsOffset = 32 * (nSubContracts + 1);

        // Init data MUST include addresses for all sub-contracts + EIC.
        require(data.length >= initDataContractsOffset, "SUB_CONTRACTS_NOT_PROVIDED");

        // Size of passed data, excluding sub-contract addresses.
        uint256 additionalDataSize = data.length - initDataContractsOffset;

        // Extract & update contract addresses.
        for (uint256 nContract = 1; nContract <= nSubContracts; nContract++) {
            // Extract sub-contract address.
            address contractAddress = abi.decode(
                data[32 * (nContract - 1):32 * nContract],
                (address)
            );

            validateSubContractIndex(nContract, contractAddress);

            // Contracts are indexed from 1 and 0 is not in use here.
            setSubContractAddress(nContract, contractAddress);
        }

        // Check if we have an external initializer contract.
        address externalInitializerAddr = abi.decode(
            data[initDataContractsOffset - 32:initDataContractsOffset],
            (address)
        );

        // 3(a). Yield to EIC initialization.
        if (externalInitializerAddr != address(0x0)) {
            callExternalInitializer(externalInitializerAddr, data[initDataContractsOffset:]);
            return;
        }

        // 3(b). Subcontracts initialization.
        // I. If no init data passed besides sub-contracts, return.
        if (additionalDataSize == 0) {
            return;
        }

        // Just to be on the safe side.
        assert(externalInitializerAddr == address(0x0));

        // II. Gate further initialization.
        initializationSentinel();

        // III. Loops through the subcontracts, extracts their data and calls their initializer.
        for (uint256 nContract = 1; nContract <= nSubContracts; nContract++) {
            // Extract sub-contract address.
            address contractAddress = abi.decode(
                data[32 * (nContract - 1):32 * nContract],
                (address)
            );

            // The initializerSize is called via delegatecall, so that it can relate to the state,
            // and not only to the new contract code. (e.g. return 0 if state-intialized else 192).
            // NOLINTNEXTLINE: controlled-delegatecall low-level-calls calls-loop.
            (bool success, bytes memory returndata) = contractAddress.delegatecall(
                abi.encodeWithSelector(SubContractor(contractAddress).initializerSize.selector)
            );
            require(success, string(returndata));
            uint256 initSize = abi.decode(returndata, (uint256));
            require(initSize <= additionalDataSize, "INVALID_INITIALIZER_SIZE");
            require(totalInitSizes + initSize <= additionalDataSize, "INVALID_INITIALIZER_SIZE");

            if (initSize == 0) {
                continue;
            }

            // Call sub-contract initializer.
            // NOLINTNEXTLINE: controlled-delegatecall calls-loop.
            (success, returndata) = contractAddress.delegatecall(
                abi.encodeWithSelector(
                    this.initialize.selector,
                    data[initDataContractsOffset:initDataContractsOffset + initSize]
                )
            );
            require(success, string(returndata));
            totalInitSizes += initSize;
            initDataContractsOffset += initSize;
        }
        require(additionalDataSize == totalInitSizes, "MISMATCHING_INIT_DATA_SIZE");
    }

    function callExternalInitializer(address externalInitializerAddr, bytes calldata extInitData)
        private
    {
        require(externalInitializerAddr.isContract(), "NOT_A_CONTRACT");

        // NOLINTNEXTLINE: low-level-calls, controlled-delegatecall.
        (bool success, bytes memory returndata) = externalInitializerAddr.delegatecall(
            abi.encodeWithSelector(this.initialize.selector, extInitData)
        );
        require(success, string(returndata));
        require(returndata.length == 0, string(returndata));
    }
}

abstract contract MainDispatcher is MainStorage, MainDispatcherBase {
    uint256 constant SUBCONTRACT_BITS = 4;

    function magicSalt() internal pure virtual returns (uint256);

    function handlerMapSection(uint256 section) internal view virtual returns (uint256);

    function expectedIdByIndex(uint256 index) internal pure virtual returns (string memory id);

    function validateSubContractIndex(uint256 index, address subContract) internal pure override {
        string memory id = SubContractor(subContract).identify();
        bytes32 hashed_expected_id = keccak256(abi.encodePacked(expectedIdByIndex(index)));
        require(
            hashed_expected_id == keccak256(abi.encodePacked(id)),
            "MISPLACED_INDEX_OR_BAD_CONTRACT_ID"
        );
    }

    function getSubContract(bytes4 selector) internal view override returns (address) {
        uint256 location = 0xFF & uint256(keccak256(abi.encodePacked(selector, magicSalt())));
        uint256 subContractIdx;
        uint256 offset = (SUBCONTRACT_BITS * location) % 256;

        // We have 64 locations in each register, hence the >>6 (i.e. location // 64).
        subContractIdx = (handlerMapSection(location >> 6) >> offset) & 0xF;
        return subContracts[subContractIdx];
    }

    function setSubContractAddress(uint256 index, address subContractAddress) internal override {
        subContracts[index] = subContractAddress;
    }
}

contract StarkExchange is MainDispatcher {
    string public constant VERSION = "4.0.1";

    // Salt for a 8 bit unique spread of all relevant selectors. Pre-caclulated.
    // ---------- The following code was auto-generated. PLEASE DO NOT EDIT. ----------
    uint256 constant MAGIC_SALT = 46110;
    uint256 constant IDX_MAP_0 = 0x30006100050005012000102002000001200000010001100500200000000020;
    uint256 constant IDX_MAP_1 = 0x120000105000000501200000120502000000200452005000202002030500003;
    uint256 constant IDX_MAP_2 = 0x1020000000003020000502203000300000200000000001000100330010220001;
    uint256 constant IDX_MAP_3 = 0x200230200020300001401200000000100020011200000002020000010000301;

    // ---------- End of auto-generated code. ----------

    function getNumSubcontracts() internal pure override returns (uint256) {
        return 6;
    }

    function magicSalt() internal pure override returns (uint256) {
        return MAGIC_SALT;
    }

    function handlerMapSection(uint256 section) internal view override returns (uint256) {
        if (section == 0) {
            return IDX_MAP_0;
        } else if (section == 1) {
            return IDX_MAP_1;
        } else if (section == 2) {
            return IDX_MAP_2;
        } else if (section == 3) {
            return IDX_MAP_3;
        }
        revert("BAD_IDX_MAP_SECTION");
    }

    function expectedIdByIndex(uint256 index) internal pure override returns (string memory id) {
        if (index == 1) {
            id = "StarkWare_AllVerifiers_2020_1";
        } else if (index == 2) {
            id = "StarkWare_TokensAndRamping_2020_1";
        } else if (index == 3) {
            id = "StarkWare_StarkExState_2021_1";
        } else if (index == 4) {
            id = "StarkWare_ForcedActions_2020_1";
        } else if (index == 5) {
            id = "StarkWare_OnchainVaults_2021_1";
        } else if (index == 6) {
            id = "StarkWare_ProxyUtils_2021_1";
        } else {
            revert("UNEXPECTED_INDEX");
        }
    }

    function initializationSentinel() internal view override {
        string memory REVERT_MSG = "INITIALIZATION_BLOCKED";
        // This initializer sets roots etc. It must not be applied twice.
        // I.e. it can run only when the state is still empty.
        require(vaultRoot == 0, REVERT_MSG);
        require(vaultTreeHeight == 0, REVERT_MSG);
        require(orderRoot == 0, REVERT_MSG);
        require(orderTreeHeight == 0, REVERT_MSG);
    }
}