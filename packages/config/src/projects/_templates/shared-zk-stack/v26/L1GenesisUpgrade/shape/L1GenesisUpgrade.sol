// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library Diamond {
    using UncheckedMath for uint256;
    using SafeCast for uint256;

    /// @dev Magic value that should be returned by diamond cut initialize contracts.
    /// @dev Used to distinguish calls to contracts that were supposed to be used as diamond initializer from other contracts.
    bytes32 internal constant DIAMOND_INIT_SUCCESS_RETURN_VALUE =
        0x33774e659306e47509050e97cb651e731180a42d458212294d30751925c551a2; // keccak256("diamond.zksync.init") - 1

    /// @dev Storage position of `DiamondStorage` structure.
    bytes32 private constant DIAMOND_STORAGE_POSITION =
        0xc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131b; // keccak256("diamond.standard.diamond.storage") - 1;

    event DiamondCut(FacetCut[] facetCuts, address initAddress, bytes initCalldata);

    /// @dev Utility struct that contains associated facet & meta information of selector
    /// @param facetAddress address of the facet which is connected with selector
    /// @param selectorPosition index in `FacetToSelectors.selectors` array, where is selector stored
    /// @param isFreezable denotes whether the selector can be frozen.
    struct SelectorToFacet {
        address facetAddress;
        uint16 selectorPosition;
        bool isFreezable;
    }

    /// @dev Utility struct that contains associated selectors & meta information of facet
    /// @param selectors list of all selectors that belong to the facet
    /// @param facetPosition index in `DiamondStorage.facets` array, where is facet stored
    struct FacetToSelectors {
        bytes4[] selectors;
        uint16 facetPosition;
    }

    /// @notice The structure that holds all diamond proxy associated parameters
    /// @dev According to the EIP-2535 should be stored on a special storage key - `DIAMOND_STORAGE_POSITION`
    /// @param selectorToFacet A mapping from the selector to the facet address and its meta information
    /// @param facetToSelectors A mapping from facet address to its selectors with meta information
    /// @param facets The array of all unique facet addresses that belong to the diamond proxy
    /// @param isFrozen Denotes whether the diamond proxy is frozen and all freezable facets are not accessible
    struct DiamondStorage {
        mapping(bytes4 selector => SelectorToFacet selectorInfo) selectorToFacet;
        mapping(address facetAddress => FacetToSelectors facetInfo) facetToSelectors;
        address[] facets;
        bool isFrozen;
    }

    /// @dev Parameters for diamond changes that touch one of the facets
    /// @param facet The address of facet that's affected by the cut
    /// @param action The action that is made on the facet
    /// @param isFreezable Denotes whether the facet & all their selectors can be frozen
    /// @param selectors An array of unique selectors that belongs to the facet address
    // solhint-disable-next-line gas-struct-packing
    struct FacetCut {
        address facet;
        Action action;
        bool isFreezable;
        bytes4[] selectors;
    }

    /// @dev Structure of the diamond proxy changes
    /// @param facetCuts The set of changes (adding/removing/replacement) of implementation contracts
    /// @param initAddress The address that's delegate called after setting up new facet changes
    /// @param initCalldata Calldata for the delegate call to `initAddress`
    struct DiamondCutData {
        FacetCut[] facetCuts;
        address initAddress;
        bytes initCalldata;
    }

    /// @dev Type of change over diamond: add/replace/remove facets
    enum Action {
        Add,
        Replace,
        Remove
    }

    /// @return diamondStorage The pointer to the storage where all specific diamond proxy parameters stored
    function getDiamondStorage() internal pure returns (DiamondStorage storage diamondStorage) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            diamondStorage.slot := position
        }
    }

    /// @dev Add/replace/remove any number of selectors and optionally execute a function with delegatecall
    /// @param _diamondCut Diamond's facet changes and the parameters to optional initialization delegatecall
    function diamondCut(DiamondCutData memory _diamondCut) internal {
        FacetCut[] memory facetCuts = _diamondCut.facetCuts;
        address initAddress = _diamondCut.initAddress;
        bytes memory initCalldata = _diamondCut.initCalldata;
        uint256 facetCutsLength = facetCuts.length;
        for (uint256 i = 0; i < facetCutsLength; i = i.uncheckedInc()) {
            Action action = facetCuts[i].action;
            address facet = facetCuts[i].facet;
            bool isFacetFreezable = facetCuts[i].isFreezable;
            bytes4[] memory selectors = facetCuts[i].selectors;

            if (selectors.length == 0) {
                revert NoFunctionsForDiamondCut();
            }

            if (action == Action.Add) {
                _addFunctions(facet, selectors, isFacetFreezable);
            } else if (action == Action.Replace) {
                _replaceFunctions(facet, selectors, isFacetFreezable);
            } else if (action == Action.Remove) {
                _removeFunctions(facet, selectors);
            } else {
                revert UndefinedDiamondCutAction();
            }
        }

        _initializeDiamondCut(initAddress, initCalldata);
        emit DiamondCut(facetCuts, initAddress, initCalldata);
    }

    /// @dev Add new functions to the diamond proxy
    /// NOTE: expect but NOT enforce that `_selectors` is NON-EMPTY array
    function _addFunctions(address _facet, bytes4[] memory _selectors, bool _isFacetFreezable) private {
        DiamondStorage storage ds = getDiamondStorage();

        // Facet with no code cannot be added.
        // This check also verifies that the facet does not have zero address, since it is the
        // address with which 0x00000000 selector is associated.
        if (_facet.code.length == 0) {
            revert AddressHasNoCode(_facet);
        }

        // Add facet to the list of facets if the facet address is new one
        _saveFacetIfNew(_facet);

        uint256 selectorsLength = _selectors.length;
        for (uint256 i = 0; i < selectorsLength; i = i.uncheckedInc()) {
            bytes4 selector = _selectors[i];
            SelectorToFacet memory oldFacet = ds.selectorToFacet[selector];
            if (oldFacet.facetAddress != address(0)) {
                revert FacetExists(selector, oldFacet.facetAddress);
            }

            _addOneFunction(_facet, selector, _isFacetFreezable);
        }
    }

    /// @dev Change associated facets to already known function selectors
    /// NOTE: expect but NOT enforce that `_selectors` is NON-EMPTY array
    function _replaceFunctions(address _facet, bytes4[] memory _selectors, bool _isFacetFreezable) private {
        DiamondStorage storage ds = getDiamondStorage();

        // Facet with no code cannot be added.
        // This check also verifies that the facet does not have zero address, since it is the
        // address with which 0x00000000 selector is associated.
        if (_facet.code.length == 0) {
            revert AddressHasNoCode(_facet);
        }

        uint256 selectorsLength = _selectors.length;
        for (uint256 i = 0; i < selectorsLength; i = i.uncheckedInc()) {
            bytes4 selector = _selectors[i];
            SelectorToFacet memory oldFacet = ds.selectorToFacet[selector];
            // it is impossible to replace the facet with zero address
            if (oldFacet.facetAddress == address(0)) {
                revert ReplaceFunctionFacetAddressZero();
            }

            _removeOneFunction(oldFacet.facetAddress, selector);
            // Add facet to the list of facets if the facet address is a new one
            _saveFacetIfNew(_facet);
            _addOneFunction(_facet, selector, _isFacetFreezable);
        }
    }

    /// @dev Remove association with function and facet
    /// NOTE: expect but NOT enforce that `_selectors` is NON-EMPTY array
    function _removeFunctions(address _facet, bytes4[] memory _selectors) private {
        DiamondStorage storage ds = getDiamondStorage();

        // facet address must be zero
        if (_facet != address(0)) {
            revert RemoveFunctionFacetAddressNotZero(_facet);
        }

        uint256 selectorsLength = _selectors.length;
        for (uint256 i = 0; i < selectorsLength; i = i.uncheckedInc()) {
            bytes4 selector = _selectors[i];
            SelectorToFacet memory oldFacet = ds.selectorToFacet[selector];
            // Can't delete a non-existent facet
            if (oldFacet.facetAddress == address(0)) {
                revert RemoveFunctionFacetAddressZero();
            }

            _removeOneFunction(oldFacet.facetAddress, selector);
        }
    }

    /// @dev Add address to the list of known facets if it is not on the list yet
    /// NOTE: should be called ONLY before adding a new selector associated with the address
    function _saveFacetIfNew(address _facet) private {
        DiamondStorage storage ds = getDiamondStorage();

        uint256 selectorsLength = ds.facetToSelectors[_facet].selectors.length;
        // If there are no selectors associated with facet then save facet as new one
        if (selectorsLength == 0) {
            ds.facetToSelectors[_facet].facetPosition = ds.facets.length.toUint16();
            ds.facets.push(_facet);
        }
    }

    /// @dev Add one function to the already known facet
    /// NOTE: It is expected but NOT enforced that:
    /// - `_facet` is NON-ZERO address
    /// - `_facet` is already stored address in `DiamondStorage.facets`
    /// - `_selector` is NOT associated by another facet
    function _addOneFunction(address _facet, bytes4 _selector, bool _isSelectorFreezable) private {
        DiamondStorage storage ds = getDiamondStorage();

        uint16 selectorPosition = (ds.facetToSelectors[_facet].selectors.length).toUint16();

        // if selectorPosition is nonzero, it means it is not a new facet
        // so the freezability of the first selector must be matched to _isSelectorFreezable
        // so all the selectors in a facet will have the same freezability
        if (selectorPosition != 0) {
            bytes4 selector0 = ds.facetToSelectors[_facet].selectors[0];
            if (_isSelectorFreezable != ds.selectorToFacet[selector0].isFreezable) {
                revert SelectorsMustAllHaveSameFreezability();
            }
        }

        ds.selectorToFacet[_selector] = SelectorToFacet({
            facetAddress: _facet,
            selectorPosition: selectorPosition,
            isFreezable: _isSelectorFreezable
        });
        ds.facetToSelectors[_facet].selectors.push(_selector);
    }

    /// @dev Remove one associated function with facet
    /// NOTE: It is expected but NOT enforced that `_facet` is NON-ZERO address
    function _removeOneFunction(address _facet, bytes4 _selector) private {
        DiamondStorage storage ds = getDiamondStorage();

        // Get index of `FacetToSelectors.selectors` of the selector and last element of array
        uint256 selectorPosition = ds.selectorToFacet[_selector].selectorPosition;
        uint256 lastSelectorPosition = ds.facetToSelectors[_facet].selectors.length - 1;

        // If the selector is not at the end of the array then move the last element to the selector position
        if (selectorPosition != lastSelectorPosition) {
            bytes4 lastSelector = ds.facetToSelectors[_facet].selectors[lastSelectorPosition];

            ds.facetToSelectors[_facet].selectors[selectorPosition] = lastSelector;
            ds.selectorToFacet[lastSelector].selectorPosition = selectorPosition.toUint16();
        }

        // Remove last element from the selectors array
        ds.facetToSelectors[_facet].selectors.pop();

        // Finally, clean up the association with facet
        delete ds.selectorToFacet[_selector];

        // If there are no selectors for facet then remove the facet from the list of known facets
        if (lastSelectorPosition == 0) {
            _removeFacet(_facet);
        }
    }

    /// @dev remove facet from the list of known facets
    /// NOTE: It is expected but NOT enforced that there are no selectors associated with `_facet`
    function _removeFacet(address _facet) private {
        DiamondStorage storage ds = getDiamondStorage();

        // Get index of `DiamondStorage.facets` of the facet and last element of array
        uint256 facetPosition = ds.facetToSelectors[_facet].facetPosition;
        uint256 lastFacetPosition = ds.facets.length - 1;

        // If the facet is not at the end of the array then move the last element to the facet position
        if (facetPosition != lastFacetPosition) {
            address lastFacet = ds.facets[lastFacetPosition];

            ds.facets[facetPosition] = lastFacet;
            ds.facetToSelectors[lastFacet].facetPosition = facetPosition.toUint16();
        }

        // Remove last element from the facets array
        ds.facets.pop();
    }

    /// @dev Delegates call to the initialization address with provided calldata
    /// @dev Used as a final step of diamond cut to execute the logic of the initialization for changed facets
    function _initializeDiamondCut(address _init, bytes memory _calldata) private {
        if (_init == address(0)) {
            // Non-empty calldata for zero address
            if (_calldata.length != 0) {
                revert NonEmptyCalldata();
            }
        } else {
            // Do not check whether `_init` is a contract since later we check that it returns data.
            (bool success, bytes memory data) = _init.delegatecall(_calldata);
            if (!success) {
                // If the returndata is too small, we still want to produce some meaningful error

                if (data.length < 4) {
                    revert DelegateCallFailed(data);
                }

                assembly {
                    revert(add(data, 0x20), mload(data))
                }
            }

            // Check that called contract returns magic value to make sure that contract logic
            // supposed to be used as diamond cut initializer.
            if (data.length != 32) {
                revert DelegateCallFailed(data);
            }
            if (abi.decode(data, (bytes32)) != DIAMOND_INIT_SUCCESS_RETURN_VALUE) {
                revert DelegateCallFailed(data);
            }
        }
    }
}

library UnsafeBytes {
    function readUint32(bytes memory _bytes, uint256 _start) internal pure returns (uint32 result, uint256 offset) {
        assembly {
            offset := add(_start, 4)
            result := mload(add(_bytes, offset))
        }
    }

    function readAddress(bytes memory _bytes, uint256 _start) internal pure returns (address result, uint256 offset) {
        assembly {
            offset := add(_start, 20)
            result := mload(add(_bytes, offset))
        }
    }

    function readUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readBytes32(bytes memory _bytes, uint256 _start) internal pure returns (bytes32 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readRemainingBytes(bytes memory _bytes, uint256 _start) internal pure returns (bytes memory result) {
        uint256 arrayLen = _bytes.length - _start;
        result = new bytes(arrayLen);

        assembly {
            mcopy(add(result, 0x20), add(_bytes, add(0x20, _start)), arrayLen)
        }
    }
}

struct ZKChainSpecificForceDeploymentsData {
    bytes32 baseTokenAssetId;
    address l2LegacySharedBridge;
    address predeployedL2WethAddress;
    address baseTokenL1Address;
    /// @dev Some info about the base token, it is
    /// needed to deploy weth token in case it is not present
    string baseTokenName;
    string baseTokenSymbol;
}

abstract contract L1GatewayBase {
    using UnsafeBytes for bytes;

    /// @notice The function to retrieve the chain-specific upgrade data.
    /// @param s The pointer to the storage of the chain.
    /// @param _wrappedBaseTokenStore The address of the `L2WrappedBaseTokenStore` contract.
    /// It is expected to be zero during creation of new chains and non-zero during upgrades.
    /// @param _baseTokenAddress The L1 address of the base token of the chain. Note, that for
    /// chains whose token originates from an L2, this address will be the address of its bridged
    /// representation on L1.
    function getZKChainSpecificForceDeploymentsData(
        ZKChainStorage storage s,
        address _wrappedBaseTokenStore,
        address _baseTokenAddress
    ) internal view returns (bytes memory) {
        address sharedBridge = IBridgehub(s.bridgehub).sharedBridge();
        address legacySharedBridge = IL1SharedBridgeLegacy(sharedBridge).l2BridgeAddress(s.chainId);

        address l2WBaseToken;
        if (_wrappedBaseTokenStore != address(0)) {
            l2WBaseToken = L2WrappedBaseTokenStore(_wrappedBaseTokenStore).l2WBaseTokenAddress(s.chainId);
        }

        // It is required for a base token to implement the following methods
        string memory baseTokenName;
        string memory baseTokenSymbol;
        if (_baseTokenAddress == ETH_TOKEN_ADDRESS) {
            baseTokenName = string("Ether");
            baseTokenSymbol = string("ETH");
        } else {
            (string memory stringResult, bool success) = _safeCallTokenMetadata(
                _baseTokenAddress,
                abi.encodeCall(IERC20Metadata.name, ())
            );
            if (success) {
                baseTokenName = stringResult;
            } else {
                baseTokenName = string("Base Token");
            }

            (stringResult, success) = _safeCallTokenMetadata(
                _baseTokenAddress,
                abi.encodeCall(IERC20Metadata.symbol, ())
            );
            if (success) {
                baseTokenSymbol = stringResult;
            } else {
                // "BT" is an acronym for "Base Token"
                baseTokenSymbol = string("BT");
            }
        }

        ZKChainSpecificForceDeploymentsData
            memory additionalForceDeploymentsData = ZKChainSpecificForceDeploymentsData({
                baseTokenAssetId: s.baseTokenAssetId,
                l2LegacySharedBridge: legacySharedBridge,
                predeployedL2WethAddress: l2WBaseToken,
                baseTokenL1Address: _baseTokenAddress,
                baseTokenName: baseTokenName,
                baseTokenSymbol: baseTokenSymbol
            });
        return abi.encode(additionalForceDeploymentsData);
    }

    /// @notice Calls a token's metadata method.
    /// @dev For the sake of simplicity, we expect that either of the
    /// following is true:
    /// 1. The token does not support metadata methods
    /// 2. The token supports it and returns a `bytes32` string there.
    /// 3. The token supports it and returns a correct `string` as a returndata.
    ///
    /// For all other cases, this function will panic and so such chains would not be
    /// deployable.
    function _safeCallTokenMetadata(address _token, bytes memory data) internal view returns (string memory, bool) {
        // We are not afraid if token returns large calldata, since it affects
        // only the deployment of the chain that uses such a malicious token.
        (bool callSuccess, bytes memory returnData) = _token.staticcall(data);

        // The failed call most likely means that this method is not supported.
        if (!callSuccess) {
            return ("", false);
        }

        // This case covers non-standard tokens, such as Maker (MKR), that return `bytes32` instead of `string`
        if (returnData.length == 32) {
            return ("", false);
        }

        // Note, that the following line will panic in case the token has more non-standard behavior.
        return (abi.decode(returnData, (string)), true);
    }
}

abstract contract ReentrancyGuard {
    /// @dev Address of lock flag variable.
    /// @dev Flag is placed at random memory location to not interfere with Storage contract.
    // keccak256("ReentrancyGuard") - 1;
    uint256 private constant LOCK_FLAG_ADDRESS = 0x8e94fed44239eb2314ab7a406345e6c5a8f0ccedf3b600de3d004e672c33abf4;

    // solhint-disable-next-line max-line-length
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/566a774222707e424896c0c390a84dc3c13bdcb2/contracts/security/ReentrancyGuard.sol
    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier reentrancyGuardInitializer() {
        _initializeReentrancyGuard();
        _;
    }

    function _initializeReentrancyGuard() private {
        uint256 lockSlotOldValue;

        // Storing an initial non-zero value makes deployment a bit more
        // expensive but in exchange every call to nonReentrant
        // will be cheaper.
        assembly {
            lockSlotOldValue := sload(LOCK_FLAG_ADDRESS)
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }

        // Check that storage slot for reentrancy guard is empty to rule out possibility of slot conflict
        if (lockSlotOldValue != 0) {
            revert SlotOccupied();
        }
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        uint256 _status;
        assembly {
            _status := sload(LOCK_FLAG_ADDRESS)
        }

        if (_status == 0) {
            revert NotInitializedReentrancyGuard();
        }
        // On the first call to nonReentrant, _NOT_ENTERED will be true
        if (_status != _NOT_ENTERED) {
            revert Reentrancy();
        }

        // Any calls to nonReentrant after this point will fail
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _ENTERED)
        }

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }
    }
}

struct PriorityOperation {
    bytes32 canonicalTxHash;
    uint64 expirationTimestamp;
    uint192 layer2Tip;
}

library PriorityQueue {
    using PriorityQueue for Queue;

    /// @notice Container that stores priority operations
    /// @param data The inner mapping that saves priority operation by its index
    /// @param head The pointer to the first unprocessed priority operation, equal to the tail if the queue is empty
    /// @param tail The pointer to the free slot
    struct Queue {
        mapping(uint256 priorityOpId => PriorityOperation priorityOp) data;
        uint256 tail;
        uint256 head;
    }

    /// @notice Returns zero if and only if no operations were processed from the queue
    /// @return Index of the oldest priority operation that wasn't processed yet
    function getFirstUnprocessedPriorityTx(Queue storage _queue) internal view returns (uint256) {
        return _queue.head;
    }

    /// @return The total number of priority operations that were added to the priority queue, including all processed ones
    function getTotalPriorityTxs(Queue storage _queue) internal view returns (uint256) {
        return _queue.tail;
    }

    /// @return The total number of unprocessed priority operations in a priority queue
    function getSize(Queue storage _queue) internal view returns (uint256) {
        return uint256(_queue.tail - _queue.head);
    }

    /// @return Whether the priority queue contains no operations
    function isEmpty(Queue storage _queue) internal view returns (bool) {
        return _queue.tail == _queue.head;
    }

    /// @notice Add the priority operation to the end of the priority queue
    function pushBack(Queue storage _queue, PriorityOperation memory _operation) internal {
        // Save value into the stack to avoid double reading from the storage
        uint256 tail = _queue.tail;

        _queue.data[tail] = _operation;
        _queue.tail = tail + 1;
    }

    /// @return The first unprocessed priority operation from the queue
    function front(Queue storage _queue) internal view returns (PriorityOperation memory) {
        // priority queue is empty
        if (_queue.isEmpty()) {
            revert QueueIsEmpty();
        }

        return _queue.data[_queue.head];
    }

    /// @notice Remove the first unprocessed priority operation from the queue
    /// @return priorityOperation that was popped from the priority queue
    function popFront(Queue storage _queue) internal returns (PriorityOperation memory priorityOperation) {
        // priority queue is empty
        if (_queue.isEmpty()) {
            revert QueueIsEmpty();
        }

        // Save value into the stack to avoid double reading from the storage
        uint256 head = _queue.head;

        priorityOperation = _queue.data[head];
        delete _queue.data[head];
        _queue.head = head + 1;
    }
}

enum UpgradeState {
    None,
    Transparent,
    Shadow
}

struct UpgradeStorage {
    bytes32 proposedUpgradeHash;
    UpgradeState state;
    address securityCouncil;
    bool approvedBySecurityCouncil;
    uint40 proposedUpgradeTimestamp;
    uint40 currentProposalId;
}

enum PubdataPricingMode {
    Rollup,
    Validium
}

struct FeeParams {
    PubdataPricingMode pubdataPricingMode;
    uint32 batchOverheadL1Gas;
    uint32 maxPubdataPerBatch;
    uint32 maxL2GasPerBatch;
    uint32 priorityTxMaxPubdata;
    uint64 minimalL2GasPrice;
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }
}

library Arrays {
    using StorageSlot for bytes32;

    /**
     * @dev Searches a sorted `array` and returns the first index that contains
     * a value greater or equal to `element`. If no such index exists (i.e. all
     * values in the array are strictly less than `element`), the array length is
     * returned. Time complexity O(log n).
     *
     * `array` is expected to be sorted in ascending order, and to contain no
     * repeated elements.
     */
    function findUpperBound(uint256[] storage array, uint256 element) internal view returns (uint256) {
        if (array.length == 0) {
            return 0;
        }

        uint256 low = 0;
        uint256 high = array.length;

        while (low < high) {
            uint256 mid = Math.average(low, high);

            // Note that mid will always be strictly less than high (i.e. it will be a valid array index)
            // because Math.average rounds down (it does integer division with truncation).
            if (unsafeAccess(array, mid).value > element) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        // At this point `low` is the exclusive upper bound. We will return the inclusive upper bound.
        if (low > 0 && unsafeAccess(array, low - 1).value == element) {
            return low - 1;
        } else {
            return low;
        }
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(address[] storage arr, uint256 pos) internal pure returns (StorageSlot.AddressSlot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getAddressSlot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(bytes32[] storage arr, uint256 pos) internal pure returns (StorageSlot.Bytes32Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getBytes32Slot();
    }

    /**
     * @dev Access an array in an "unsafe" way. Skips solidity "index-out-of-range" check.
     *
     * WARNING: Only use if you are certain `pos` is lower than the array length.
     */
    function unsafeAccess(uint256[] storage arr, uint256 pos) internal pure returns (StorageSlot.Uint256Slot storage) {
        bytes32 slot;
        // We use assembly to calculate the storage slot of the element at index `pos` of the dynamic array `arr`
        // following https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html#mappings-and-dynamic-arrays.

        /// @solidity memory-safe-assembly
        assembly {
            mstore(0, arr.slot)
            slot := add(keccak256(0, 0x20), pos)
        }
        return slot.getUint256Slot();
    }
}

library DynamicIncrementalMerkle {
    /**
     * @dev A complete `bytes32` Merkle tree.
     *
     * The `sides` and `zero` arrays are set to have a length equal to the depth of the tree during setup.
     *
     * Struct members have an underscore prefix indicating that they are "private" and should not be read or written to
     * directly. Use the functions provided below instead. Modifying the struct manually may violate assumptions and
     * lead to unexpected behavior.
     *
     * NOTE: The `root` and the updates history is not stored within the tree. Consider using a secondary structure to
     * store a list of historical roots from the values returned from {setup} and {push} (e.g. a mapping, {BitMaps} or
     * {Checkpoints}).
     *
     * WARNING: Updating any of the tree's parameters after the first insertion will result in a corrupted tree.
     */
    struct Bytes32PushTree {
        uint256 _nextLeafIndex;
        bytes32[] _sides;
        bytes32[] _zeros;
    }

    /**
     * @dev Initialize a {Bytes32PushTree} using {Hashes-Keccak256} to hash internal nodes.
     * The capacity of the tree (i.e. number of leaves) is set to `2**levels`.
     *
     * IMPORTANT: The zero value should be carefully chosen since it will be stored in the tree representing
     * empty leaves. It should be a value that is not expected to be part of the tree.
     */
    function setup(Bytes32PushTree storage self, bytes32 zero) internal returns (bytes32 initialRoot) {
        self._nextLeafIndex = 0;
        self._zeros.push(zero);
        self._sides.push(bytes32(0));
        return bytes32(0);
    }

    /**
     * @dev Resets the tree to a blank state.
     * Calling this function on MerkleTree that was already setup and used will reset it to a blank state.
     * @param zero The value that represents an empty leaf.
     * @return initialRoot The initial root of the tree.
     */
    function reset(Bytes32PushTree storage self, bytes32 zero) internal returns (bytes32 initialRoot) {
        self._nextLeafIndex = 0;
        uint256 length = self._zeros.length;
        for (uint256 i = length; 0 < i; --i) {
            self._zeros.pop();
        }
        length = self._sides.length;
        for (uint256 i = length; 0 < i; --i) {
            self._sides.pop();
        }
        self._zeros.push(zero);
        self._sides.push(bytes32(0));
        return bytes32(0);
    }

    /**
     * @dev Insert a new leaf in the tree, and compute the new root. Returns the position of the inserted leaf in the
     * tree, and the resulting root.
     *
     * Hashing the leaf before calling this function is recommended as a protection against
     * second pre-image attacks.
     */
    function push(Bytes32PushTree storage self, bytes32 leaf) internal returns (uint256 index, bytes32 newRoot) {
        // Cache read
        uint256 levels = self._zeros.length - 1;

        // Get leaf index
        // solhint-disable-next-line gas-increment-by-one
        index = self._nextLeafIndex++;

        // Check if tree is full.
        if (index == 1 << levels) {
            bytes32 zero = self._zeros[levels];
            bytes32 newZero = Merkle.efficientHash(zero, zero);
            self._zeros.push(newZero);
            self._sides.push(bytes32(0));
            ++levels;
        }

        // Rebuild branch from leaf to root
        uint256 currentIndex = index;
        bytes32 currentLevelHash = leaf;
        bool updatedSides = false;
        for (uint32 i = 0; i < levels; ++i) {
            // Reaching the parent node, is currentLevelHash the left child?
            bool isLeft = currentIndex % 2 == 0;

            // If so, next time we will come from the right, so we need to save it
            if (isLeft && !updatedSides) {
                Arrays.unsafeAccess(self._sides, i).value = currentLevelHash;
                updatedSides = true;
            }

            // Compute the current node hash by using the hash function
            // with either its sibling (side) or the zero value for that level.
            currentLevelHash = Merkle.efficientHash(
                isLeft ? currentLevelHash : Arrays.unsafeAccess(self._sides, i).value,
                isLeft ? Arrays.unsafeAccess(self._zeros, i).value : currentLevelHash
            );

            // Update node index
            currentIndex >>= 1;
        }

        Arrays.unsafeAccess(self._sides, levels).value = currentLevelHash;
        return (index, currentLevelHash);
    }

    /**
     * @dev Tree's root.
     */
    function root(Bytes32PushTree storage self) internal view returns (bytes32) {
        return Arrays.unsafeAccess(self._sides, self._sides.length - 1).value;
    }

    /**
     * @dev Tree's height (does not include the root node).
     */
    function height(Bytes32PushTree storage self) internal view returns (uint256) {
        return self._sides.length - 1;
    }
}

struct PriorityOpsBatchInfo {
    bytes32[] leftPath;
    bytes32[] rightPath;
    bytes32[] itemHashes;
}

library Merkle {
    using UncheckedMath for uint256;

    /// @dev Calculate Merkle root by the provided Merkle proof.
    /// NOTE: When using this function, check that the _path length is equal to the tree height to prevent shorter/longer paths attack
    /// however, for chains settling on GW the proof includes the GW proof, so the path increases. See Mailbox for more details.
    /// @param _path Merkle path from the leaf to the root
    /// @param _index Leaf index in the tree
    /// @param _itemHash Hash of leaf content
    /// @return The Merkle root
    function calculateRoot(
        bytes32[] calldata _path,
        uint256 _index,
        bytes32 _itemHash
    ) internal pure returns (bytes32) {
        uint256 pathLength = _path.length;
        _validatePathLengthForSingleProof(_index, pathLength);

        bytes32 currentHash = _itemHash;
        for (uint256 i; i < pathLength; i = i.uncheckedInc()) {
            currentHash = (_index % 2 == 0)
                ? efficientHash(currentHash, _path[i])
                : efficientHash(_path[i], currentHash);
            _index /= 2;
        }

        return currentHash;
    }

    /// @dev Calculate Merkle root by the provided Merkle proof.
    /// NOTE: When using this function, check that the _path length is equal to the tree height to prevent shorter/longer paths attack
    /// @param _path Merkle path from the leaf to the root
    /// @param _index Leaf index in the tree
    /// @param _itemHash Hash of leaf content
    /// @return The Merkle root
    function calculateRootMemory(
        bytes32[] memory _path,
        uint256 _index,
        bytes32 _itemHash
    ) internal pure returns (bytes32) {
        uint256 pathLength = _path.length;
        _validatePathLengthForSingleProof(_index, pathLength);

        bytes32 currentHash = _itemHash;
        for (uint256 i; i < pathLength; i = i.uncheckedInc()) {
            currentHash = (_index % 2 == 0)
                ? efficientHash(currentHash, _path[i])
                : efficientHash(_path[i], currentHash);
            _index /= 2;
        }

        return currentHash;
    }

    /// @dev Calculate Merkle root by the provided Merkle proof for a range of elements
    /// NOTE: When using this function, check that the _startPath and _endPath lengths are equal to the tree height to prevent shorter/longer paths attack
    /// @param _startPath Merkle path from the first element of the range to the root
    /// @param _endPath Merkle path from the last element of the range to the root
    /// @param _startIndex Index of the first element of the range in the tree
    /// @param _itemHashes Hashes of the elements in the range
    /// @return The Merkle root
    function calculateRootPaths(
        bytes32[] memory _startPath,
        bytes32[] memory _endPath,
        uint256 _startIndex,
        bytes32[] memory _itemHashes
    ) internal pure returns (bytes32) {
        uint256 pathLength = _startPath.length;
        if (pathLength != _endPath.length) {
            revert MerklePathLengthMismatch(pathLength, _endPath.length);
        }
        if (pathLength >= 256) {
            revert MerklePathOutOfBounds();
        }
        uint256 levelLen = _itemHashes.length;
        // Edge case: we want to be able to prove an element in a single-node tree.
        if (pathLength == 0 && (_startIndex != 0 || levelLen != 1)) {
            revert MerklePathEmpty();
        }
        if (levelLen == 0) {
            revert MerkleNothingToProve();
        }
        if (_startIndex + levelLen > (1 << pathLength)) {
            revert MerkleIndexOrHeightMismatch();
        }
        bytes32[] memory itemHashes = _itemHashes;

        for (uint256 level; level < pathLength; level = level.uncheckedInc()) {
            uint256 parity = _startIndex % 2;
            // We get an extra element on the next level if on the current level elements either
            // start on an odd index (`parity == 1`) or end on an even index (`levelLen % 2 == 1`)
            uint256 nextLevelLen = levelLen / 2 + (parity | (levelLen % 2));
            for (uint256 i; i < nextLevelLen; i = i.uncheckedInc()) {
                bytes32 lhs = (i == 0 && parity == 1) ? _startPath[level] : itemHashes[2 * i - parity];
                bytes32 rhs = (i == nextLevelLen - 1 && (levelLen - parity) % 2 == 1)
                    ? _endPath[level]
                    : itemHashes[2 * i + 1 - parity];
                itemHashes[i] = efficientHash(lhs, rhs);
            }
            levelLen = nextLevelLen;
            _startIndex /= 2;
        }

        return itemHashes[0];
    }

    /// @dev Keccak hash of the concatenation of two 32-byte words
    function efficientHash(bytes32 _lhs, bytes32 _rhs) internal pure returns (bytes32 result) {
        assembly {
            mstore(0x00, _lhs)
            mstore(0x20, _rhs)
            result := keccak256(0x00, 0x40)
        }
    }

    function _validatePathLengthForSingleProof(uint256 _index, uint256 _pathLength) private pure {
        if (_pathLength >= 256) {
            revert MerklePathOutOfBounds();
        }
        if (_index >= (1 << _pathLength)) {
            revert MerkleIndexOutOfBounds();
        }
    }
}

struct PriorityTreeCommitment {
    uint256 nextLeafIndex;
    uint256 startIndex;
    uint256 unprocessedIndex;
    bytes32[] sides;
}

library PriorityTree {
    using PriorityTree for Tree;
    using DynamicIncrementalMerkle for DynamicIncrementalMerkle.Bytes32PushTree;

    struct Tree {
        uint256 startIndex; // priority tree started accepting priority ops from this index
        uint256 unprocessedIndex; // relative to `startIndex`
        mapping(bytes32 => bool) historicalRoots;
        DynamicIncrementalMerkle.Bytes32PushTree tree;
    }

    /// @notice Returns zero if and only if no operations were processed from the tree
    /// @return Index of the oldest priority operation that wasn't processed yet
    function getFirstUnprocessedPriorityTx(Tree storage _tree) internal view returns (uint256) {
        return _tree.startIndex + _tree.unprocessedIndex;
    }

    /// @return The total number of priority operations that were added to the priority queue, including all processed ones
    function getTotalPriorityTxs(Tree storage _tree) internal view returns (uint256) {
        return _tree.startIndex + _tree.tree._nextLeafIndex;
    }

    /// @return The total number of unprocessed priority operations in a priority queue
    function getSize(Tree storage _tree) internal view returns (uint256) {
        return _tree.tree._nextLeafIndex - _tree.unprocessedIndex;
    }

    /// @notice Add the priority operation to the end of the priority queue
    function push(Tree storage _tree, bytes32 _hash) internal {
        (, bytes32 newRoot) = _tree.tree.push(_hash);
        _tree.historicalRoots[newRoot] = true;
    }

    /// @notice Set up the tree
    function setup(Tree storage _tree, uint256 _startIndex) internal {
        bytes32 initialRoot = _tree.tree.setup(ZERO_LEAF_HASH);
        _tree.historicalRoots[initialRoot] = true;
        _tree.startIndex = _startIndex;
    }

    /// @return Returns the tree root.
    function getRoot(Tree storage _tree) internal view returns (bytes32) {
        return _tree.tree.root();
    }

    /// @param _root The root to check.
    /// @return Returns true if the root is a historical root.
    function isHistoricalRoot(Tree storage _tree, bytes32 _root) internal view returns (bool) {
        return _tree.historicalRoots[_root];
    }

    /// @notice Process the priority operations of a batch.
    /// @dev Note, that the function below only checks that a certain segment of items is present in the tree.
    /// It does not check that e.g. there are no zero items inside the provided `itemHashes`, so in theory proofs
    /// that include non-existing priority operations could be created. This function relies on the fact
    /// that the `itemHashes` of `_priorityOpsData` are hashes of valid priority transactions.
    /// This fact is ensures by the fact the rolling hash of those is sent to the Executor by the bootloader
    /// and so assuming that zero knowledge proofs are correct, so is the structure of the `itemHashes`.
    function processBatch(Tree storage _tree, PriorityOpsBatchInfo memory _priorityOpsData) internal {
        if (_priorityOpsData.itemHashes.length > 0) {
            bytes32 expectedRoot = Merkle.calculateRootPaths(
                _priorityOpsData.leftPath,
                _priorityOpsData.rightPath,
                _tree.unprocessedIndex,
                _priorityOpsData.itemHashes
            );
            if (!_tree.historicalRoots[expectedRoot]) {
                revert NotHistoricalRoot();
            }
            _tree.unprocessedIndex += _priorityOpsData.itemHashes.length;
        }
    }

    /// @notice Allows to skip a certain number of operations.
    /// @param _lastUnprocessed The new expected id of the unprocessed transaction.
    /// @dev It is used when the corresponding transactions have been processed by priority queue.
    function skipUntil(Tree storage _tree, uint256 _lastUnprocessed) internal {
        if (_tree.startIndex > _lastUnprocessed) {
            // Nothing to do, return
            return;
        }
        uint256 newUnprocessedIndex = _lastUnprocessed - _tree.startIndex;
        if (newUnprocessedIndex <= _tree.unprocessedIndex) {
            // These transactions were already processed, skip.
            return;
        }

        _tree.unprocessedIndex = newUnprocessedIndex;
    }

    /// @notice Initialize a chain from a commitment.
    function initFromCommitment(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal {
        uint256 height = _commitment.sides.length; // Height, including the root node.
        if (height == 0) {
            revert InvalidCommitment();
        }
        _tree.startIndex = _commitment.startIndex;
        _tree.unprocessedIndex = _commitment.unprocessedIndex;
        _tree.tree._nextLeafIndex = _commitment.nextLeafIndex;
        _tree.tree._sides = _commitment.sides;
        bytes32 zero = ZERO_LEAF_HASH;
        _tree.tree._zeros = new bytes32[](height);
        for (uint256 i; i < height; ++i) {
            _tree.tree._zeros[i] = zero;
            zero = Merkle.efficientHash(zero, zero);
        }
        _tree.historicalRoots[_tree.tree.root()] = true;
    }

    /// @notice Reinitialize the tree from a commitment on L1.
    function l1Reinit(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal {
        if (_tree.startIndex != _commitment.startIndex) {
            revert InvalidStartIndex(_tree.startIndex, _commitment.startIndex);
        }
        if (_tree.unprocessedIndex > _commitment.unprocessedIndex) {
            revert InvalidUnprocessedIndex(_tree.unprocessedIndex, _commitment.unprocessedIndex);
        }
        if (_tree.tree._nextLeafIndex < _commitment.nextLeafIndex) {
            revert InvalidNextLeafIndex(_tree.tree._nextLeafIndex, _commitment.nextLeafIndex);
        }

        _tree.unprocessedIndex = _commitment.unprocessedIndex;
    }

    /// @notice Reinitialize the tree from a commitment on GW.
    function checkGWReinit(Tree storage _tree, PriorityTreeCommitment memory _commitment) internal view {
        if (_tree.startIndex != _commitment.startIndex) {
            revert InvalidStartIndex(_tree.startIndex, _commitment.startIndex);
        }
        if (_tree.unprocessedIndex > _commitment.unprocessedIndex) {
            revert InvalidUnprocessedIndex(_tree.unprocessedIndex, _commitment.unprocessedIndex);
        }
        if (_tree.tree._nextLeafIndex > _commitment.nextLeafIndex) {
            revert InvalidNextLeafIndex(_tree.tree._nextLeafIndex, _commitment.nextLeafIndex);
        }
    }

    /// @notice Returns the commitment to the priority tree.
    function getCommitment(Tree storage _tree) internal view returns (PriorityTreeCommitment memory commitment) {
        commitment.nextLeafIndex = _tree.tree._nextLeafIndex;
        commitment.startIndex = _tree.startIndex;
        commitment.unprocessedIndex = _tree.unprocessedIndex;
        commitment.sides = _tree.tree._sides;
    }
}

struct ZKChainStorage {
    /// @dev Storage of variables needed for deprecated diamond cut facet
    uint256[7] __DEPRECATED_diamondCutStorage;
    /// @notice Address which will exercise critical changes to the Diamond Proxy (upgrades, freezing & unfreezing). Replaced by CTM
    address __DEPRECATED_governor;
    /// @notice Address that the governor proposed as one that will replace it
    address __DEPRECATED_pendingGovernor;
    /// @notice List of permitted validators
    mapping(address validatorAddress => bool isValidator) validators;
    /// @dev Verifier contract. Used to verify aggregated proof for batches
    IVerifier verifier;
    /// @notice Total number of executed batches i.e. batches[totalBatchesExecuted] points at the latest executed batch
    /// (batch 0 is genesis)
    uint256 totalBatchesExecuted;
    /// @notice Total number of proved batches i.e. batches[totalBatchesProved] points at the latest proved batch
    uint256 totalBatchesVerified;
    /// @notice Total number of committed batches i.e. batches[totalBatchesCommitted] points at the latest committed
    /// batch
    uint256 totalBatchesCommitted;
    /// @dev Stored hashed StoredBatch for batch number
    mapping(uint256 batchNumber => bytes32 batchHash) storedBatchHashes;
    /// @dev Stored root hashes of L2 -> L1 logs
    mapping(uint256 batchNumber => bytes32 l2LogsRootHash) l2LogsRootHashes;
    /// @dev Container that stores transactions requested from L1
    PriorityQueue.Queue priorityQueue;
    /// @dev The smart contract that manages the list with permission to call contract functions
    address __DEPRECATED_allowList;
    VerifierParams __DEPRECATED_verifierParams;
    /// @notice Bytecode hash of bootloader program.
    /// @dev Used as an input to zkp-circuit.
    bytes32 l2BootloaderBytecodeHash;
    /// @notice Bytecode hash of default account (bytecode for EOA).
    /// @dev Used as an input to zkp-circuit.
    bytes32 l2DefaultAccountBytecodeHash;
    /// @dev Indicates that the porter may be touched on L2 transactions.
    /// @dev Used as an input to zkp-circuit.
    bool zkPorterIsAvailable;
    /// @dev The maximum number of the L2 gas that a user can request for L1 -> L2 transactions
    /// @dev This is the maximum number of L2 gas that is available for the "body" of the transaction, i.e.
    /// without overhead for proving the batch.
    uint256 priorityTxMaxGasLimit;
    /// @dev Storage of variables needed for upgrade facet
    UpgradeStorage __DEPRECATED_upgrades;
    /// @dev A mapping L2 batch number => message number => flag.
    /// @dev The L2 -> L1 log is sent for every withdrawal, so this mapping is serving as
    /// a flag to indicate that the message was already processed.
    /// @dev Used to indicate that eth withdrawal was already processed
    mapping(uint256 l2BatchNumber => mapping(uint256 l2ToL1MessageNumber => bool isFinalized)) isEthWithdrawalFinalized;
    /// @dev The most recent withdrawal time and amount reset
    uint256 __DEPRECATED_lastWithdrawalLimitReset;
    /// @dev The accumulated withdrawn amount during the withdrawal limit window
    uint256 __DEPRECATED_withdrawnAmountInWindow;
    /// @dev A mapping user address => the total deposited amount by the user
    mapping(address => uint256) __DEPRECATED_totalDepositedAmountPerUser;
    /// @dev Stores the protocol version. Note, that the protocol version may not only encompass changes to the
    /// smart contracts, but also to the node behavior.
    uint256 protocolVersion;
    /// @dev Hash of the system contract upgrade transaction. If 0, then no upgrade transaction needs to be done.
    bytes32 l2SystemContractsUpgradeTxHash;
    /// @dev Batch number where the upgrade transaction has happened. If 0, then no upgrade transaction has happened
    /// yet.
    uint256 l2SystemContractsUpgradeBatchNumber;
    /// @dev Address which will exercise non-critical changes to the Diamond Proxy (changing validator set & unfreezing)
    address admin;
    /// @notice Address that the admin proposed as one that will replace admin role
    address pendingAdmin;
    /// @dev Fee params used to derive gasPrice for the L1->L2 transactions. For L2 transactions,
    /// the bootloader gives enough freedom to the operator.
    /// @dev The value is only for the L1 deployment of the ZK Chain, since payment for all the priority transactions is
    /// charged at that level.
    FeeParams feeParams;
    /// @dev Address of the blob versioned hash getter smart contract used for EIP-4844 versioned hashes.
    /// @dev Used only for testing.
    address blobVersionedHashRetriever;
    /// @dev The chainId of the chain
    uint256 chainId;
    /// @dev The address of the bridgehub
    address bridgehub;
    /// @dev The address of the ChainTypeManager
    address chainTypeManager;
    /// @dev The address of the baseToken contract. Eth is address(1)
    address __DEPRECATED_baseToken;
    /// @dev The address of the baseTokenbridge. Eth also uses the shared bridge
    address __DEPRECATED_baseTokenBridge;
    /// @notice gasPriceMultiplier for each baseToken, so that each L1->L2 transaction pays for its transaction on the destination
    /// we multiply by the nominator, and divide by the denominator
    uint128 baseTokenGasPriceMultiplierNominator;
    uint128 baseTokenGasPriceMultiplierDenominator;
    /// @dev The optional address of the contract that has to be used for transaction filtering/whitelisting
    address transactionFilterer;
    /// @dev The address of the l1DAValidator contract.
    /// This contract is responsible for the verification of the correctness of the DA on L1.
    address l1DAValidator;
    /// @dev The address of the contract on L2 that is responsible for the data availability verification.
    /// This contract sends `l2DAValidatorOutputHash` to L1 via L2->L1 system log and it will routed to the `l1DAValidator` contract.
    address l2DAValidator;
    /// @dev the Asset Id of the baseToken
    bytes32 baseTokenAssetId;
    /// @dev If this ZKchain settles on this chain, then this is zero. Otherwise it is the address of the ZKchain that is a
    /// settlement layer for this ZKchain. (think about it as a 'forwarding' address for the chain that migrated away).
    address settlementLayer;
    /// @dev Priority tree, the new data structure for priority queue
    PriorityTree.Tree priorityTree;
    /// @dev Whether the chain is a permanent rollup. Note, that it only enforces the DA validator pair, but
    /// it does not enforce any other parameters, e.g. `pubdataPricingMode`
    bool isPermanentRollup;
}

contract ZKChainBase is ReentrancyGuard {
    using PriorityQueue for PriorityQueue.Queue;
    using PriorityTree for PriorityTree.Tree;

    // slither-disable-next-line uninitialized-state
    ZKChainStorage internal s;

    /// @notice Checks that the message sender is an active admin
    modifier onlyAdmin() {
        if (msg.sender != s.admin) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @notice Checks if validator is active
    modifier onlyValidator() {
        if (!s.validators[msg.sender]) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyChainTypeManager() {
        if (msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyBridgehub() {
        if (msg.sender != s.bridgehub) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyAdminOrChainTypeManager() {
        if (msg.sender != s.admin && msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyValidatorOrChainTypeManager() {
        if (!s.validators[msg.sender] && msg.sender != s.chainTypeManager) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlySettlementLayer() {
        if (s.settlementLayer != address(0)) {
            revert NotSettlementLayer();
        }
        _;
    }

    /// @notice Returns whether the priority queue is still active, i.e.
    /// the chain has not processed all transactions from it
    function _isPriorityQueueActive() internal view returns (bool) {
        return s.priorityQueue.getFirstUnprocessedPriorityTx() < s.priorityTree.startIndex;
    }

    /// @notice Ensures that the queue is deactivated. Should be invoked
    /// whenever the chain migrates to another settlement layer.
    function _forceDeactivateQueue() internal {
        // We double check whether it is still active mainly to prevent
        // overriding `tail`/`head` on L1 deployment.
        if (_isPriorityQueueActive()) {
            uint256 startIndex = s.priorityTree.startIndex;
            s.priorityQueue.head = startIndex;
            s.priorityQueue.tail = startIndex;
        }
    }

    function _getTotalPriorityTxs() internal view returns (uint256) {
        if (_isPriorityQueueActive()) {
            return s.priorityQueue.getTotalPriorityTxs();
        } else {
            return s.priorityTree.getTotalPriorityTxs();
        }
    }
}

struct VerifierParams {
    bytes32 recursionNodeLevelVkHash;
    bytes32 recursionLeafLevelVkHash;
    bytes32 recursionCircuitsSetVksHash;
}

struct ProposedUpgrade {
    L2CanonicalTransaction l2ProtocolUpgradeTx;
    bytes32 bootloaderHash;
    bytes32 defaultAccountHash;
    address verifier;
    VerifierParams verifierParams;
    bytes l1ContractsUpgradeCalldata;
    bytes postUpgradeCalldata;
    uint256 upgradeTimestamp;
    uint256 newProtocolVersion;
}

library UncheckedMath {
    function uncheckedInc(uint256 _number) internal pure returns (uint256) {
        unchecked {
            return _number + 1;
        }
    }

    function uncheckedAdd(uint256 _lhs, uint256 _rhs) internal pure returns (uint256) {
        unchecked {
            return _lhs + _rhs;
        }
    }
}

enum BytecodeError {
    Version,
    NumberOfWords,
    Length,
    WordsMustBeOdd
}

library L2ContractHelper {
    using UncheckedMath for uint256;

    /// @dev The prefix used to create CREATE2 addresses.
    bytes32 private constant CREATE2_PREFIX = keccak256("zksyncCreate2");

    /// @dev Prefix used during derivation of account addresses using CREATE
    bytes32 private constant CREATE_PREFIX = 0x63bae3a9951d38e8a3fbb7b70909afc1200610fc5bc55ade242f815974674f23;

    /// @notice Sends L2 -> L1 arbitrary-long message through the system contract messenger.
    /// @param _message Data to be sent to L1.
    /// @return keccak256 hash of the sent message.
    function sendMessageToL1(bytes memory _message) internal returns (bytes32) {
        return L2_MESSENGER.sendToL1(_message);
    }

    /// @notice Validate the bytecode format and calculate its hash.
    /// @param _bytecode The bytecode to hash.
    /// @return hashedBytecode The 32-byte hash of the bytecode.
    /// Note: The function reverts the execution if the bytecode has non expected format:
    /// - Bytecode bytes length is not a multiple of 32
    /// - Bytecode bytes length is not less than 2^21 bytes (2^16 words)
    /// - Bytecode words length is not odd
    function hashL2Bytecode(bytes memory _bytecode) internal pure returns (bytes32 hashedBytecode) {
        // Note that the length of the bytecode must be provided in 32-byte words.
        if (_bytecode.length % 32 != 0) {
            revert LengthIsNotDivisibleBy32(_bytecode.length);
        }

        uint256 bytecodeLenInWords = _bytecode.length / 32;
        // bytecode length must be less than 2^16 words
        if (bytecodeLenInWords >= 2 ** 16) {
            revert MalformedBytecode(BytecodeError.NumberOfWords);
        }
        // bytecode length in words must be odd
        if (bytecodeLenInWords % 2 == 0) {
            revert MalformedBytecode(BytecodeError.WordsMustBeOdd);
        }
        hashedBytecode = sha256(_bytecode) & 0x00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        // Setting the version of the hash
        hashedBytecode = (hashedBytecode | bytes32(uint256(1 << 248)));
        // Setting the length
        hashedBytecode = hashedBytecode | bytes32(bytecodeLenInWords << 224);
    }

    /// @notice Validate the bytecode format and calculate its hash.
    /// @param _bytecode The bytecode to hash.
    /// @return hashedBytecode The 32-byte hash of the bytecode.
    /// Note: The function reverts the execution if the bytecode has non expected format:
    /// - Bytecode bytes length is not a multiple of 32
    /// - Bytecode bytes length is not less than 2^21 bytes (2^16 words)
    /// - Bytecode words length is not odd
    function hashL2BytecodeCalldata(bytes calldata _bytecode) internal pure returns (bytes32 hashedBytecode) {
        // Note that the length of the bytecode must be provided in 32-byte words.
        if (_bytecode.length % 32 != 0) {
            revert LengthIsNotDivisibleBy32(_bytecode.length);
        }

        uint256 bytecodeLenInWords = _bytecode.length / 32;
        // bytecode length must be less than 2^16 words
        if (bytecodeLenInWords >= 2 ** 16) {
            revert MalformedBytecode(BytecodeError.NumberOfWords);
        }
        // bytecode length in words must be odd
        if (bytecodeLenInWords % 2 == 0) {
            revert MalformedBytecode(BytecodeError.WordsMustBeOdd);
        }
        hashedBytecode = sha256(_bytecode) & 0x00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        // Setting the version of the hash
        hashedBytecode = (hashedBytecode | bytes32(uint256(1 << 248)));
        // Setting the length
        hashedBytecode = hashedBytecode | bytes32(bytecodeLenInWords << 224);
    }

    /// @notice Validates the format of the given bytecode hash.
    /// @dev Due to the specification of the L2 bytecode hash, not every 32 bytes could be a legit bytecode hash.
    /// @dev The function reverts on invalid bytecode hash format.
    /// @param _bytecodeHash The hash of the bytecode to validate.
    function validateBytecodeHash(bytes32 _bytecodeHash) internal pure {
        uint8 version = uint8(_bytecodeHash[0]);
        // Incorrectly formatted bytecodeHash
        if (version != 1 || _bytecodeHash[1] != bytes1(0)) {
            revert MalformedBytecode(BytecodeError.Version);
        }

        // Code length in words must be odd
        if (bytecodeLen(_bytecodeHash) % 2 == 0) {
            revert MalformedBytecode(BytecodeError.WordsMustBeOdd);
        }
    }

    /// @notice Returns the length of the bytecode associated with the given hash.
    /// @param _bytecodeHash The hash of the bytecode.
    /// @return codeLengthInWords The length of the bytecode in words.
    function bytecodeLen(bytes32 _bytecodeHash) internal pure returns (uint256 codeLengthInWords) {
        codeLengthInWords = uint256(uint8(_bytecodeHash[2])) * 256 + uint256(uint8(_bytecodeHash[3]));
    }

    /// @notice Computes the create2 address for a Layer 2 contract.
    /// @param _sender The address of the sender.
    /// @param _salt The salt value to use in the create2 address computation.
    /// @param _bytecodeHash The contract bytecode hash.
    /// @param _constructorInputHash The hash of the constructor input data.
    /// @return The create2 address of the contract.
    /// NOTE: L2 create2 derivation is different from L1 derivation!
    function computeCreate2Address(
        address _sender,
        bytes32 _salt,
        bytes32 _bytecodeHash,
        bytes32 _constructorInputHash
    ) internal pure returns (address) {
        bytes32 senderBytes = bytes32(uint256(uint160(_sender)));
        bytes32 data = keccak256(
            // solhint-disable-next-line func-named-parameters
            bytes.concat(CREATE2_PREFIX, senderBytes, _salt, _bytecodeHash, _constructorInputHash)
        );

        return address(uint160(uint256(data)));
    }

    /// @notice Calculates the address of a deployed contract via create
    /// @param _sender The account that deploys the contract.
    /// @param _senderNonce The deploy nonce of the sender's account.
    /// NOTE: L2 create derivation is different from L1 derivation!
    function computeCreateAddress(address _sender, uint256 _senderNonce) internal pure returns (address) {
        // No collision is possible with the Ethereum's CREATE, since
        // the prefix begins with 0x63....
        bytes32 hash = keccak256(
            bytes.concat(CREATE_PREFIX, bytes32(uint256(uint160(_sender))), bytes32(_senderNonce))
        );

        return address(uint160(uint256(hash)));
    }

    /// @notice Hashes the L2 bytecodes and returns them in the format in which they are processed by the bootloader
    function hashFactoryDeps(bytes[] memory _factoryDeps) internal pure returns (uint256[] memory hashedFactoryDeps) {
        uint256 factoryDepsLen = _factoryDeps.length;
        hashedFactoryDeps = new uint256[](factoryDepsLen);
        for (uint256 i = 0; i < factoryDepsLen; i = i.uncheckedInc()) {
            bytes32 hashedBytecode = hashL2Bytecode(_factoryDeps[i]);

            // Store the resulting hash sequentially in bytes.
            assembly {
                mstore(add(hashedFactoryDeps, mul(add(i, 1), 32)), hashedBytecode)
            }
        }
    }
}

enum UpgradeTxVerifyParam {
    From,
    To,
    Paymaster,
    Value,
    MaxFeePerGas,
    MaxPriorityFeePerGas,
    Reserved0,
    Reserved1,
    Reserved2,
    Reserved3,
    Signature,
    PaymasterInput,
    ReservedDynamic
}

library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library TransactionValidator {
    /// @dev Used to validate key properties of an L1->L2 transaction
    /// @param _transaction The transaction to validate
    /// @param _encoded The abi encoded bytes of the transaction
    /// @param _priorityTxMaxGasLimit The max gas limit, generally provided from Storage.sol
    /// @param _priorityTxMaxPubdata The maximal amount of pubdata that a single L1->L2 transaction can emit
    function validateL1ToL2Transaction(
        L2CanonicalTransaction memory _transaction,
        bytes memory _encoded,
        uint256 _priorityTxMaxGasLimit,
        uint256 _priorityTxMaxPubdata
    ) internal pure {
        uint256 l2GasForTxBody = getTransactionBodyGasLimit(_transaction.gasLimit, _encoded.length);

        // Ensuring that the transaction is provable
        if (l2GasForTxBody > _priorityTxMaxGasLimit) {
            revert TooMuchGas();
        }
        // Ensuring that the transaction cannot output more pubdata than is processable
        if (l2GasForTxBody / _transaction.gasPerPubdataByteLimit > _priorityTxMaxPubdata) {
            revert PubdataGreaterThanLimit(_priorityTxMaxPubdata, l2GasForTxBody / _transaction.gasPerPubdataByteLimit);
        }

        // Ensuring that the transaction covers the minimal costs for its processing:
        // hashing its content, publishing the factory dependencies, etc.
        if (
            getMinimalPriorityTransactionGasLimit(
                _encoded.length,
                _transaction.factoryDeps.length,
                _transaction.gasPerPubdataByteLimit
            ) > l2GasForTxBody
        ) {
            revert ValidateTxnNotEnoughGas();
        }
    }

    /// @dev Used to validate upgrade transactions
    /// @param _transaction The transaction to validate
    function validateUpgradeTransaction(L2CanonicalTransaction memory _transaction) internal pure {
        // Restrict from to be within system contract range (0...2^16 - 1)
        if (_transaction.from > type(uint16).max) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.From);
        }
        if (_transaction.to > type(uint160).max) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.To);
        }
        if (_transaction.paymaster != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Paymaster);
        }
        if (_transaction.value != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Value);
        }
        if (_transaction.maxFeePerGas != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.MaxFeePerGas);
        }
        if (_transaction.maxPriorityFeePerGas != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.MaxPriorityFeePerGas);
        }
        if (_transaction.reserved[0] != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Reserved0);
        }
        if (_transaction.reserved[1] > type(uint160).max) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Reserved1);
        }
        if (_transaction.reserved[2] != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Reserved2);
        }
        if (_transaction.reserved[3] != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Reserved3);
        }
        if (_transaction.signature.length != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.Signature);
        }
        if (_transaction.paymasterInput.length != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.PaymasterInput);
        }
        if (_transaction.reservedDynamic.length != 0) {
            revert InvalidUpgradeTxn(UpgradeTxVerifyParam.ReservedDynamic);
        }
    }

    /// @dev Calculates the approximate minimum gas limit required for executing a priority transaction.
    /// @param _encodingLength The length of the priority transaction encoding in bytes.
    /// @param _numberOfFactoryDependencies The number of new factory dependencies that will be added.
    /// @param _l2GasPricePerPubdata The L2 gas price for publishing the priority transaction on L2.
    /// @return The minimum gas limit required to execute the priority transaction.
    /// Note: The calculation includes the main cost of the priority transaction, however, in reality, the operator can spend a little more gas on overheads.
    function getMinimalPriorityTransactionGasLimit(
        uint256 _encodingLength,
        uint256 _numberOfFactoryDependencies,
        uint256 _l2GasPricePerPubdata
    ) internal pure returns (uint256) {
        uint256 costForComputation;
        {
            // Adding the intrinsic cost for the transaction, i.e. auxiliary prices which cannot be easily accounted for
            costForComputation = L1_TX_INTRINSIC_L2_GAS;

            // Taking into account the hashing costs that depend on the length of the transaction
            // Note that L1_TX_DELTA_544_ENCODING_BYTES is the delta in the price for every 544 bytes of
            // the transaction's encoding. It is taken as LCM between 136 and 32 (the length for each keccak256 round
            // and the size of each new encoding word).
            costForComputation += Math.ceilDiv(_encodingLength * L1_TX_DELTA_544_ENCODING_BYTES, 544);

            // Taking into the account the additional costs of providing new factory dependencies
            costForComputation += _numberOfFactoryDependencies * L1_TX_DELTA_FACTORY_DEPS_L2_GAS;

            // There is a minimal amount of computational L2 gas that the transaction should cover
            costForComputation = Math.max(costForComputation, L1_TX_MIN_L2_GAS_BASE);
        }

        uint256 costForPubdata = 0;
        {
            // Adding the intrinsic cost for the transaction, i.e. auxiliary prices which cannot be easily accounted for
            costForPubdata = L1_TX_INTRINSIC_PUBDATA * _l2GasPricePerPubdata;

            // Taking into the account the additional costs of providing new factory dependencies
            costForPubdata += _numberOfFactoryDependencies * L1_TX_DELTA_FACTORY_DEPS_PUBDATA * _l2GasPricePerPubdata;
        }

        return costForComputation + costForPubdata;
    }

    /// @notice Based on the full L2 gas limit (that includes the batch overhead) and other
    /// properties of the transaction, returns the l2GasLimit for the body of the transaction (the actual execution).
    /// @param _totalGasLimit The L2 gas limit that includes both the overhead for processing the batch
    /// and the L2 gas needed to process the transaction itself (i.e. the actual l2GasLimit that will be used for the transaction).
    /// @param _encodingLength The length of the ABI-encoding of the transaction.
    function getTransactionBodyGasLimit(
        uint256 _totalGasLimit,
        uint256 _encodingLength
    ) internal pure returns (uint256 txBodyGasLimit) {
        uint256 overhead = getOverheadForTransaction(_encodingLength);

        // provided gas limit doesn't cover transaction overhead
        if (_totalGasLimit < overhead) {
            revert TxnBodyGasLimitNotEnoughGas();
        }
        unchecked {
            // We enforce the fact that `_totalGasLimit >= overhead` explicitly above.
            txBodyGasLimit = _totalGasLimit - overhead;
        }
    }

    /// @notice Based on the total L2 gas limit and several other parameters of the transaction
    /// returns the part of the L2 gas that will be spent on the batch's overhead.
    /// @dev The details of how this function works can be checked in the documentation
    /// of the fee model of ZKsync. The appropriate comments are also present
    /// in the Rust implementation description of function `get_maximal_allowed_overhead`.
    /// @param _encodingLength The length of the binary encoding of the transaction in bytes
    function getOverheadForTransaction(
        uint256 _encodingLength
    ) internal pure returns (uint256 batchOverheadForTransaction) {
        // The overhead from taking up the transaction's slot
        batchOverheadForTransaction = TX_SLOT_OVERHEAD_L2_GAS;

        // The overhead for occupying the bootloader memory can be derived from encoded_len
        uint256 overheadForLength = MEMORY_OVERHEAD_GAS * _encodingLength;
        batchOverheadForTransaction = Math.max(batchOverheadForTransaction, overheadForLength);
    }
}

abstract contract BaseZkSyncUpgrade is ZKChainBase {
    /// @notice Changes the protocol version
    event NewProtocolVersion(uint256 indexed previousProtocolVersion, uint256 indexed newProtocolVersion);

    /// @notice Сhanges to the bytecode that is used in L2 as a bootloader (start program)
    event NewL2BootloaderBytecodeHash(bytes32 indexed previousBytecodeHash, bytes32 indexed newBytecodeHash);

    /// @notice Сhanges to the bytecode that is used in L2 as a default account
    event NewL2DefaultAccountBytecodeHash(bytes32 indexed previousBytecodeHash, bytes32 indexed newBytecodeHash);

    /// @notice Verifier address changed
    event NewVerifier(address indexed oldVerifier, address indexed newVerifier);

    /// @notice Verifier parameters changed
    event NewVerifierParams(VerifierParams oldVerifierParams, VerifierParams newVerifierParams);

    /// @notice Notifies about complete upgrade
    event UpgradeComplete(uint256 indexed newProtocolVersion, bytes32 indexed l2UpgradeTxHash, ProposedUpgrade upgrade);

    /// @notice The main function that will be delegate-called by the chain.
    /// @dev This is a virtual function and should be overridden by custom upgrade implementations.
    /// @param _proposedUpgrade The upgrade to be executed.
    /// @return txHash The hash of the L2 system contract upgrade transaction.
    function upgrade(ProposedUpgrade calldata _proposedUpgrade) public virtual returns (bytes32 txHash) {
        // Note that due to commitment delay, the timestamp of the L2 upgrade batch may be earlier than the timestamp
        // of the L1 block at which the upgrade occurred. This means that using timestamp as a signifier of "upgraded"
        // on the L2 side would be inaccurate. The effects of this "back-dating" of L2 upgrade batches will be reduced
        // as the permitted delay window is reduced in the future.
        if (block.timestamp < _proposedUpgrade.upgradeTimestamp) {
            revert TimeNotReached(_proposedUpgrade.upgradeTimestamp, block.timestamp);
        }

        (uint32 newMinorVersion, bool isPatchOnly) = _setNewProtocolVersion(_proposedUpgrade.newProtocolVersion);
        _upgradeL1Contract(_proposedUpgrade.l1ContractsUpgradeCalldata);
        _upgradeVerifier(_proposedUpgrade.verifier, _proposedUpgrade.verifierParams);
        _setBaseSystemContracts(_proposedUpgrade.bootloaderHash, _proposedUpgrade.defaultAccountHash, isPatchOnly);

        txHash = _setL2SystemContractUpgrade(_proposedUpgrade.l2ProtocolUpgradeTx, newMinorVersion, isPatchOnly);

        _postUpgrade(_proposedUpgrade.postUpgradeCalldata);

        emit UpgradeComplete(_proposedUpgrade.newProtocolVersion, txHash, _proposedUpgrade);
    }

    /// @notice Change default account bytecode hash, that is used on L2
    /// @param _l2DefaultAccountBytecodeHash The hash of default account L2 bytecode
    /// @param _patchOnly Whether only the patch part of the protocol version semver has changed
    function _setL2DefaultAccountBytecodeHash(bytes32 _l2DefaultAccountBytecodeHash, bool _patchOnly) private {
        if (_l2DefaultAccountBytecodeHash == bytes32(0)) {
            return;
        }

        if (_patchOnly) {
            revert PatchUpgradeCantSetDefaultAccount();
        }

        L2ContractHelper.validateBytecodeHash(_l2DefaultAccountBytecodeHash);

        // Save previous value into the stack to put it into the event later
        bytes32 previousDefaultAccountBytecodeHash = s.l2DefaultAccountBytecodeHash;

        // Change the default account bytecode hash
        s.l2DefaultAccountBytecodeHash = _l2DefaultAccountBytecodeHash;
        emit NewL2DefaultAccountBytecodeHash(previousDefaultAccountBytecodeHash, _l2DefaultAccountBytecodeHash);
    }

    /// @notice Change bootloader bytecode hash, that is used on L2
    /// @param _l2BootloaderBytecodeHash The hash of bootloader L2 bytecode
    /// @param _patchOnly Whether only the patch part of the protocol version semver has changed
    function _setL2BootloaderBytecodeHash(bytes32 _l2BootloaderBytecodeHash, bool _patchOnly) private {
        if (_l2BootloaderBytecodeHash == bytes32(0)) {
            return;
        }

        if (_patchOnly) {
            revert PatchUpgradeCantSetBootloader();
        }

        L2ContractHelper.validateBytecodeHash(_l2BootloaderBytecodeHash);

        // Save previous value into the stack to put it into the event later
        bytes32 previousBootloaderBytecodeHash = s.l2BootloaderBytecodeHash;

        // Change the bootloader bytecode hash
        s.l2BootloaderBytecodeHash = _l2BootloaderBytecodeHash;
        emit NewL2BootloaderBytecodeHash(previousBootloaderBytecodeHash, _l2BootloaderBytecodeHash);
    }

    /// @notice Change the address of the verifier smart contract
    /// @param _newVerifier Verifier smart contract address
    function _setVerifier(IVerifier _newVerifier) private {
        // An upgrade to the verifier must be done carefully to ensure there aren't batches in the committed state
        // during the transition. If verifier is upgraded, it will immediately be used to prove all committed batches.
        // Batches committed expecting the old verifier will fail. Ensure all committed batches are finalized before the
        // verifier is upgraded.
        if (_newVerifier == IVerifier(address(0))) {
            return;
        }

        IVerifier oldVerifier = s.verifier;
        s.verifier = _newVerifier;
        emit NewVerifier(address(oldVerifier), address(_newVerifier));
    }

    /// @notice Change the verifier parameters
    /// @param _newVerifierParams New parameters for the verifier
    function _setVerifierParams(VerifierParams calldata _newVerifierParams) private {
        // An upgrade to the verifier params must be done carefully to ensure there aren't batches in the committed state
        // during the transition. If verifier is upgraded, it will immediately be used to prove all committed batches.
        // Batches committed expecting the old verifier params will fail. Ensure all committed batches are finalized before the
        // verifier is upgraded.
        if (
            _newVerifierParams.recursionNodeLevelVkHash == bytes32(0) &&
            _newVerifierParams.recursionLeafLevelVkHash == bytes32(0) &&
            _newVerifierParams.recursionCircuitsSetVksHash == bytes32(0)
        ) {
            return;
        }

        VerifierParams memory oldVerifierParams = s.__DEPRECATED_verifierParams;
        s.__DEPRECATED_verifierParams = _newVerifierParams;
        emit NewVerifierParams(oldVerifierParams, _newVerifierParams);
    }

    /// @notice Updates the verifier and the verifier params
    /// @param _newVerifier The address of the new verifier. If 0, the verifier will not be updated.
    /// @param _verifierParams The new verifier params. If all of the fields are 0, the params will not be updated.
    function _upgradeVerifier(address _newVerifier, VerifierParams calldata _verifierParams) internal {
        _setVerifier(IVerifier(_newVerifier));
        _setVerifierParams(_verifierParams);
    }

    /// @notice Updates the bootloader hash and the hash of the default account
    /// @param _bootloaderHash The hash of the new bootloader bytecode. If zero, it will not be updated.
    /// @param _defaultAccountHash The hash of the new default account bytecode. If zero, it will not be updated.
    /// @param _patchOnly Whether only the patch part of the protocol version semver has changed.
    function _setBaseSystemContracts(bytes32 _bootloaderHash, bytes32 _defaultAccountHash, bool _patchOnly) internal {
        _setL2BootloaderBytecodeHash(_bootloaderHash, _patchOnly);
        _setL2DefaultAccountBytecodeHash(_defaultAccountHash, _patchOnly);
    }

    /// @notice Sets the hash of the L2 system contract upgrade transaction for the next batch to be committed
    /// @dev If the transaction is noop (i.e. its type is 0) it does nothing and returns 0.
    /// @param _l2ProtocolUpgradeTx The L2 system contract upgrade transaction.
    /// @param _newMinorProtocolVersion The new minor protocol version. It must be used as the `nonce` field
    /// of the `_l2ProtocolUpgradeTx`.
    /// @param _patchOnly Whether only the patch part of the protocol version semver has changed.
    /// @return System contracts upgrade transaction hash. Zero if no upgrade transaction is set.
    function _setL2SystemContractUpgrade(
        L2CanonicalTransaction calldata _l2ProtocolUpgradeTx,
        uint32 _newMinorProtocolVersion,
        bool _patchOnly
    ) internal returns (bytes32) {
        // If the type is 0, it is considered as noop and so will not be required to be executed.
        if (_l2ProtocolUpgradeTx.txType == 0) {
            return bytes32(0);
        }

        if (_l2ProtocolUpgradeTx.txType != SYSTEM_UPGRADE_L2_TX_TYPE) {
            revert InvalidTxType(_l2ProtocolUpgradeTx.txType);
        }
        if (_patchOnly) {
            revert PatchCantSetUpgradeTxn();
        }

        bytes memory encodedTransaction = abi.encode(_l2ProtocolUpgradeTx);

        TransactionValidator.validateL1ToL2Transaction(
            _l2ProtocolUpgradeTx,
            encodedTransaction,
            s.priorityTxMaxGasLimit,
            s.feeParams.priorityTxMaxPubdata
        );

        TransactionValidator.validateUpgradeTransaction(_l2ProtocolUpgradeTx);

        // We want the hashes of l2 system upgrade transactions to be unique.
        // This is why we require that the `nonce` field is unique to each upgrade.
        if (_l2ProtocolUpgradeTx.nonce != _newMinorProtocolVersion) {
            revert L2UpgradeNonceNotEqualToNewProtocolVersion(_l2ProtocolUpgradeTx.nonce, _newMinorProtocolVersion);
        }

        _verifyFactoryDeps(_l2ProtocolUpgradeTx.factoryDeps);

        bytes32 l2ProtocolUpgradeTxHash = keccak256(encodedTransaction);

        s.l2SystemContractsUpgradeTxHash = l2ProtocolUpgradeTxHash;

        return l2ProtocolUpgradeTxHash;
    }

    /// @notice Verifies that the factory deps provided are in the correct format
    /// @param _hashes The list of hashes of factory deps
    /// @dev Note, that unlike normal L1->L2 transactions, factory dependencies for
    /// an upgrade transaction should be made available prior to the upgrade via publishing those
    /// to the `BytecodesSupplier` contract.
    function _verifyFactoryDeps(uint256[] calldata _hashes) private pure {
        if (_hashes.length > MAX_NEW_FACTORY_DEPS) {
            revert TooManyFactoryDeps();
        }
    }

    /// @notice Changes the protocol version
    /// @param _newProtocolVersion The new protocol version
    function _setNewProtocolVersion(
        uint256 _newProtocolVersion
    ) internal virtual returns (uint32 newMinorVersion, bool patchOnly) {
        uint256 previousProtocolVersion = s.protocolVersion;
        if (_newProtocolVersion <= previousProtocolVersion) {
            revert ProtocolVersionTooSmall();
        }
        // slither-disable-next-line unused-return
        (uint32 previousMajorVersion, uint32 previousMinorVersion, ) = SemVer.unpackSemVer(
            SafeCast.toUint96(previousProtocolVersion)
        );
        if (previousMajorVersion != 0) {
            revert PreviousProtocolMajorVersionNotZero();
        }

        uint32 newMajorVersion;
        // slither-disable-next-line unused-return
        (newMajorVersion, newMinorVersion, ) = SemVer.unpackSemVer(SafeCast.toUint96(_newProtocolVersion));
        if (newMajorVersion != 0) {
            revert NewProtocolMajorVersionNotZero();
        }

        // Since `_newProtocolVersion > previousProtocolVersion`, and both old and new major version is 0,
        // the difference between minor versions is >= 0.
        uint256 minorDelta = newMinorVersion - previousMinorVersion;

        if (minorDelta == 0) {
            patchOnly = true;
        }

        // While this is implicitly enforced by other checks above, we still double check just in case
        if (minorDelta > MAX_ALLOWED_MINOR_VERSION_DELTA) {
            revert ProtocolVersionMinorDeltaTooBig(MAX_ALLOWED_MINOR_VERSION_DELTA, minorDelta);
        }

        // If the minor version changes also, we need to ensure that the previous upgrade has been finalized.
        // In case the minor version does not change, we permit to keep the old upgrade transaction in the system, but it
        // must be ensured in the other parts of the upgrade that the upgrade transaction is not overridden.
        if (!patchOnly) {
            // If the previous upgrade had an L2 system upgrade transaction, we require that it is finalized.
            // Note it is important to keep this check, as otherwise ZK chains might skip upgrades by overwriting
            if (s.l2SystemContractsUpgradeTxHash != bytes32(0)) {
                revert PreviousUpgradeNotFinalized(s.l2SystemContractsUpgradeTxHash);
            }
            if (s.l2SystemContractsUpgradeBatchNumber != 0) {
                revert PreviousUpgradeNotCleaned();
            }
        }

        s.protocolVersion = _newProtocolVersion;
        emit NewProtocolVersion(previousProtocolVersion, _newProtocolVersion);
    }

    /// @notice Placeholder function for custom logic for upgrading L1 contract.
    /// Typically this function will never be used.
    /// @param _customCallDataForUpgrade Custom data for an upgrade, which may be interpreted differently for each
    /// upgrade.
    function _upgradeL1Contract(bytes calldata _customCallDataForUpgrade) internal virtual {}

    /// @notice placeholder function for custom logic for post-upgrade logic.
    /// Typically this function will never be used.
    /// @param _customCallDataForUpgrade Custom data for an upgrade, which may be interpreted differently for each
    /// upgrade.
    function _postUpgrade(bytes calldata _customCallDataForUpgrade) internal virtual {}
}

library SemVer {
    /// @notice Unpacks the SemVer version from a single uint256 into major, minor and patch components.
    /// @param _packedProtocolVersion The packed protocol version.
    /// @return major The major version.
    /// @return minor The minor version.
    /// @return patch The patch version.
    function unpackSemVer(
        uint96 _packedProtocolVersion
    ) internal pure returns (uint32 major, uint32 minor, uint32 patch) {
        patch = uint32(_packedProtocolVersion);
        minor = uint32(_packedProtocolVersion >> SEMVER_MINOR_OFFSET);
        major = uint32(_packedProtocolVersion >> SEMVER_MAJOR_OFFSET);
    }

    /// @notice Packs the SemVer version from the major, minor and patch components into a single uint96.
    /// @param _major The major version.
    /// @param _minor The minor version.
    /// @param _patch The patch version.
    /// @return packedProtocolVersion The packed protocol version.
    function packSemVer(
        uint32 _major,
        uint32 _minor,
        uint32 _patch
    ) internal pure returns (uint96 packedProtocolVersion) {
        packedProtocolVersion =
            uint96(_patch) |
            (uint96(_minor) << SEMVER_MINOR_OFFSET) |
            (uint96(_major) << SEMVER_MAJOR_OFFSET);
    }
}

library SafeCast {
    /**
     * @dev Returns the downcasted uint248 from uint256, reverting on
     * overflow (when the input is greater than largest uint248).
     *
     * Counterpart to Solidity's `uint248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toUint248(uint256 value) internal pure returns (uint248) {
        require(value <= type(uint248).max, "SafeCast: value doesn't fit in 248 bits");
        return uint248(value);
    }

    /**
     * @dev Returns the downcasted uint240 from uint256, reverting on
     * overflow (when the input is greater than largest uint240).
     *
     * Counterpart to Solidity's `uint240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toUint240(uint256 value) internal pure returns (uint240) {
        require(value <= type(uint240).max, "SafeCast: value doesn't fit in 240 bits");
        return uint240(value);
    }

    /**
     * @dev Returns the downcasted uint232 from uint256, reverting on
     * overflow (when the input is greater than largest uint232).
     *
     * Counterpart to Solidity's `uint232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toUint232(uint256 value) internal pure returns (uint232) {
        require(value <= type(uint232).max, "SafeCast: value doesn't fit in 232 bits");
        return uint232(value);
    }

    /**
     * @dev Returns the downcasted uint224 from uint256, reverting on
     * overflow (when the input is greater than largest uint224).
     *
     * Counterpart to Solidity's `uint224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.2._
     */
    function toUint224(uint256 value) internal pure returns (uint224) {
        require(value <= type(uint224).max, "SafeCast: value doesn't fit in 224 bits");
        return uint224(value);
    }

    /**
     * @dev Returns the downcasted uint216 from uint256, reverting on
     * overflow (when the input is greater than largest uint216).
     *
     * Counterpart to Solidity's `uint216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toUint216(uint256 value) internal pure returns (uint216) {
        require(value <= type(uint216).max, "SafeCast: value doesn't fit in 216 bits");
        return uint216(value);
    }

    /**
     * @dev Returns the downcasted uint208 from uint256, reverting on
     * overflow (when the input is greater than largest uint208).
     *
     * Counterpart to Solidity's `uint208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toUint208(uint256 value) internal pure returns (uint208) {
        require(value <= type(uint208).max, "SafeCast: value doesn't fit in 208 bits");
        return uint208(value);
    }

    /**
     * @dev Returns the downcasted uint200 from uint256, reverting on
     * overflow (when the input is greater than largest uint200).
     *
     * Counterpart to Solidity's `uint200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toUint200(uint256 value) internal pure returns (uint200) {
        require(value <= type(uint200).max, "SafeCast: value doesn't fit in 200 bits");
        return uint200(value);
    }

    /**
     * @dev Returns the downcasted uint192 from uint256, reverting on
     * overflow (when the input is greater than largest uint192).
     *
     * Counterpart to Solidity's `uint192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toUint192(uint256 value) internal pure returns (uint192) {
        require(value <= type(uint192).max, "SafeCast: value doesn't fit in 192 bits");
        return uint192(value);
    }

    /**
     * @dev Returns the downcasted uint184 from uint256, reverting on
     * overflow (when the input is greater than largest uint184).
     *
     * Counterpart to Solidity's `uint184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toUint184(uint256 value) internal pure returns (uint184) {
        require(value <= type(uint184).max, "SafeCast: value doesn't fit in 184 bits");
        return uint184(value);
    }

    /**
     * @dev Returns the downcasted uint176 from uint256, reverting on
     * overflow (when the input is greater than largest uint176).
     *
     * Counterpart to Solidity's `uint176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toUint176(uint256 value) internal pure returns (uint176) {
        require(value <= type(uint176).max, "SafeCast: value doesn't fit in 176 bits");
        return uint176(value);
    }

    /**
     * @dev Returns the downcasted uint168 from uint256, reverting on
     * overflow (when the input is greater than largest uint168).
     *
     * Counterpart to Solidity's `uint168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toUint168(uint256 value) internal pure returns (uint168) {
        require(value <= type(uint168).max, "SafeCast: value doesn't fit in 168 bits");
        return uint168(value);
    }

    /**
     * @dev Returns the downcasted uint160 from uint256, reverting on
     * overflow (when the input is greater than largest uint160).
     *
     * Counterpart to Solidity's `uint160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toUint160(uint256 value) internal pure returns (uint160) {
        require(value <= type(uint160).max, "SafeCast: value doesn't fit in 160 bits");
        return uint160(value);
    }

    /**
     * @dev Returns the downcasted uint152 from uint256, reverting on
     * overflow (when the input is greater than largest uint152).
     *
     * Counterpart to Solidity's `uint152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toUint152(uint256 value) internal pure returns (uint152) {
        require(value <= type(uint152).max, "SafeCast: value doesn't fit in 152 bits");
        return uint152(value);
    }

    /**
     * @dev Returns the downcasted uint144 from uint256, reverting on
     * overflow (when the input is greater than largest uint144).
     *
     * Counterpart to Solidity's `uint144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toUint144(uint256 value) internal pure returns (uint144) {
        require(value <= type(uint144).max, "SafeCast: value doesn't fit in 144 bits");
        return uint144(value);
    }

    /**
     * @dev Returns the downcasted uint136 from uint256, reverting on
     * overflow (when the input is greater than largest uint136).
     *
     * Counterpart to Solidity's `uint136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toUint136(uint256 value) internal pure returns (uint136) {
        require(value <= type(uint136).max, "SafeCast: value doesn't fit in 136 bits");
        return uint136(value);
    }

    /**
     * @dev Returns the downcasted uint128 from uint256, reverting on
     * overflow (when the input is greater than largest uint128).
     *
     * Counterpart to Solidity's `uint128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v2.5._
     */
    function toUint128(uint256 value) internal pure returns (uint128) {
        require(value <= type(uint128).max, "SafeCast: value doesn't fit in 128 bits");
        return uint128(value);
    }

    /**
     * @dev Returns the downcasted uint120 from uint256, reverting on
     * overflow (when the input is greater than largest uint120).
     *
     * Counterpart to Solidity's `uint120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toUint120(uint256 value) internal pure returns (uint120) {
        require(value <= type(uint120).max, "SafeCast: value doesn't fit in 120 bits");
        return uint120(value);
    }

    /**
     * @dev Returns the downcasted uint112 from uint256, reverting on
     * overflow (when the input is greater than largest uint112).
     *
     * Counterpart to Solidity's `uint112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toUint112(uint256 value) internal pure returns (uint112) {
        require(value <= type(uint112).max, "SafeCast: value doesn't fit in 112 bits");
        return uint112(value);
    }

    /**
     * @dev Returns the downcasted uint104 from uint256, reverting on
     * overflow (when the input is greater than largest uint104).
     *
     * Counterpart to Solidity's `uint104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toUint104(uint256 value) internal pure returns (uint104) {
        require(value <= type(uint104).max, "SafeCast: value doesn't fit in 104 bits");
        return uint104(value);
    }

    /**
     * @dev Returns the downcasted uint96 from uint256, reverting on
     * overflow (when the input is greater than largest uint96).
     *
     * Counterpart to Solidity's `uint96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.2._
     */
    function toUint96(uint256 value) internal pure returns (uint96) {
        require(value <= type(uint96).max, "SafeCast: value doesn't fit in 96 bits");
        return uint96(value);
    }

    /**
     * @dev Returns the downcasted uint88 from uint256, reverting on
     * overflow (when the input is greater than largest uint88).
     *
     * Counterpart to Solidity's `uint88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toUint88(uint256 value) internal pure returns (uint88) {
        require(value <= type(uint88).max, "SafeCast: value doesn't fit in 88 bits");
        return uint88(value);
    }

    /**
     * @dev Returns the downcasted uint80 from uint256, reverting on
     * overflow (when the input is greater than largest uint80).
     *
     * Counterpart to Solidity's `uint80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toUint80(uint256 value) internal pure returns (uint80) {
        require(value <= type(uint80).max, "SafeCast: value doesn't fit in 80 bits");
        return uint80(value);
    }

    /**
     * @dev Returns the downcasted uint72 from uint256, reverting on
     * overflow (when the input is greater than largest uint72).
     *
     * Counterpart to Solidity's `uint72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toUint72(uint256 value) internal pure returns (uint72) {
        require(value <= type(uint72).max, "SafeCast: value doesn't fit in 72 bits");
        return uint72(value);
    }

    /**
     * @dev Returns the downcasted uint64 from uint256, reverting on
     * overflow (when the input is greater than largest uint64).
     *
     * Counterpart to Solidity's `uint64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v2.5._
     */
    function toUint64(uint256 value) internal pure returns (uint64) {
        require(value <= type(uint64).max, "SafeCast: value doesn't fit in 64 bits");
        return uint64(value);
    }

    /**
     * @dev Returns the downcasted uint56 from uint256, reverting on
     * overflow (when the input is greater than largest uint56).
     *
     * Counterpart to Solidity's `uint56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toUint56(uint256 value) internal pure returns (uint56) {
        require(value <= type(uint56).max, "SafeCast: value doesn't fit in 56 bits");
        return uint56(value);
    }

    /**
     * @dev Returns the downcasted uint48 from uint256, reverting on
     * overflow (when the input is greater than largest uint48).
     *
     * Counterpart to Solidity's `uint48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toUint48(uint256 value) internal pure returns (uint48) {
        require(value <= type(uint48).max, "SafeCast: value doesn't fit in 48 bits");
        return uint48(value);
    }

    /**
     * @dev Returns the downcasted uint40 from uint256, reverting on
     * overflow (when the input is greater than largest uint40).
     *
     * Counterpart to Solidity's `uint40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toUint40(uint256 value) internal pure returns (uint40) {
        require(value <= type(uint40).max, "SafeCast: value doesn't fit in 40 bits");
        return uint40(value);
    }

    /**
     * @dev Returns the downcasted uint32 from uint256, reverting on
     * overflow (when the input is greater than largest uint32).
     *
     * Counterpart to Solidity's `uint32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v2.5._
     */
    function toUint32(uint256 value) internal pure returns (uint32) {
        require(value <= type(uint32).max, "SafeCast: value doesn't fit in 32 bits");
        return uint32(value);
    }

    /**
     * @dev Returns the downcasted uint24 from uint256, reverting on
     * overflow (when the input is greater than largest uint24).
     *
     * Counterpart to Solidity's `uint24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toUint24(uint256 value) internal pure returns (uint24) {
        require(value <= type(uint24).max, "SafeCast: value doesn't fit in 24 bits");
        return uint24(value);
    }

    /**
     * @dev Returns the downcasted uint16 from uint256, reverting on
     * overflow (when the input is greater than largest uint16).
     *
     * Counterpart to Solidity's `uint16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v2.5._
     */
    function toUint16(uint256 value) internal pure returns (uint16) {
        require(value <= type(uint16).max, "SafeCast: value doesn't fit in 16 bits");
        return uint16(value);
    }

    /**
     * @dev Returns the downcasted uint8 from uint256, reverting on
     * overflow (when the input is greater than largest uint8).
     *
     * Counterpart to Solidity's `uint8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v2.5._
     */
    function toUint8(uint256 value) internal pure returns (uint8) {
        require(value <= type(uint8).max, "SafeCast: value doesn't fit in 8 bits");
        return uint8(value);
    }

    /**
     * @dev Converts a signed int256 into an unsigned uint256.
     *
     * Requirements:
     *
     * - input must be greater than or equal to 0.
     *
     * _Available since v3.0._
     */
    function toUint256(int256 value) internal pure returns (uint256) {
        require(value >= 0, "SafeCast: value must be positive");
        return uint256(value);
    }

    /**
     * @dev Returns the downcasted int248 from int256, reverting on
     * overflow (when the input is less than smallest int248 or
     * greater than largest int248).
     *
     * Counterpart to Solidity's `int248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toInt248(int256 value) internal pure returns (int248 downcasted) {
        downcasted = int248(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 248 bits");
    }

    /**
     * @dev Returns the downcasted int240 from int256, reverting on
     * overflow (when the input is less than smallest int240 or
     * greater than largest int240).
     *
     * Counterpart to Solidity's `int240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toInt240(int256 value) internal pure returns (int240 downcasted) {
        downcasted = int240(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 240 bits");
    }

    /**
     * @dev Returns the downcasted int232 from int256, reverting on
     * overflow (when the input is less than smallest int232 or
     * greater than largest int232).
     *
     * Counterpart to Solidity's `int232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toInt232(int256 value) internal pure returns (int232 downcasted) {
        downcasted = int232(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 232 bits");
    }

    /**
     * @dev Returns the downcasted int224 from int256, reverting on
     * overflow (when the input is less than smallest int224 or
     * greater than largest int224).
     *
     * Counterpart to Solidity's `int224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.7._
     */
    function toInt224(int256 value) internal pure returns (int224 downcasted) {
        downcasted = int224(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 224 bits");
    }

    /**
     * @dev Returns the downcasted int216 from int256, reverting on
     * overflow (when the input is less than smallest int216 or
     * greater than largest int216).
     *
     * Counterpart to Solidity's `int216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toInt216(int256 value) internal pure returns (int216 downcasted) {
        downcasted = int216(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 216 bits");
    }

    /**
     * @dev Returns the downcasted int208 from int256, reverting on
     * overflow (when the input is less than smallest int208 or
     * greater than largest int208).
     *
     * Counterpart to Solidity's `int208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toInt208(int256 value) internal pure returns (int208 downcasted) {
        downcasted = int208(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 208 bits");
    }

    /**
     * @dev Returns the downcasted int200 from int256, reverting on
     * overflow (when the input is less than smallest int200 or
     * greater than largest int200).
     *
     * Counterpart to Solidity's `int200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toInt200(int256 value) internal pure returns (int200 downcasted) {
        downcasted = int200(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 200 bits");
    }

    /**
     * @dev Returns the downcasted int192 from int256, reverting on
     * overflow (when the input is less than smallest int192 or
     * greater than largest int192).
     *
     * Counterpart to Solidity's `int192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toInt192(int256 value) internal pure returns (int192 downcasted) {
        downcasted = int192(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 192 bits");
    }

    /**
     * @dev Returns the downcasted int184 from int256, reverting on
     * overflow (when the input is less than smallest int184 or
     * greater than largest int184).
     *
     * Counterpart to Solidity's `int184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toInt184(int256 value) internal pure returns (int184 downcasted) {
        downcasted = int184(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 184 bits");
    }

    /**
     * @dev Returns the downcasted int176 from int256, reverting on
     * overflow (when the input is less than smallest int176 or
     * greater than largest int176).
     *
     * Counterpart to Solidity's `int176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toInt176(int256 value) internal pure returns (int176 downcasted) {
        downcasted = int176(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 176 bits");
    }

    /**
     * @dev Returns the downcasted int168 from int256, reverting on
     * overflow (when the input is less than smallest int168 or
     * greater than largest int168).
     *
     * Counterpart to Solidity's `int168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toInt168(int256 value) internal pure returns (int168 downcasted) {
        downcasted = int168(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 168 bits");
    }

    /**
     * @dev Returns the downcasted int160 from int256, reverting on
     * overflow (when the input is less than smallest int160 or
     * greater than largest int160).
     *
     * Counterpart to Solidity's `int160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toInt160(int256 value) internal pure returns (int160 downcasted) {
        downcasted = int160(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 160 bits");
    }

    /**
     * @dev Returns the downcasted int152 from int256, reverting on
     * overflow (when the input is less than smallest int152 or
     * greater than largest int152).
     *
     * Counterpart to Solidity's `int152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toInt152(int256 value) internal pure returns (int152 downcasted) {
        downcasted = int152(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 152 bits");
    }

    /**
     * @dev Returns the downcasted int144 from int256, reverting on
     * overflow (when the input is less than smallest int144 or
     * greater than largest int144).
     *
     * Counterpart to Solidity's `int144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toInt144(int256 value) internal pure returns (int144 downcasted) {
        downcasted = int144(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 144 bits");
    }

    /**
     * @dev Returns the downcasted int136 from int256, reverting on
     * overflow (when the input is less than smallest int136 or
     * greater than largest int136).
     *
     * Counterpart to Solidity's `int136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toInt136(int256 value) internal pure returns (int136 downcasted) {
        downcasted = int136(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 136 bits");
    }

    /**
     * @dev Returns the downcasted int128 from int256, reverting on
     * overflow (when the input is less than smallest int128 or
     * greater than largest int128).
     *
     * Counterpart to Solidity's `int128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v3.1._
     */
    function toInt128(int256 value) internal pure returns (int128 downcasted) {
        downcasted = int128(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 128 bits");
    }

    /**
     * @dev Returns the downcasted int120 from int256, reverting on
     * overflow (when the input is less than smallest int120 or
     * greater than largest int120).
     *
     * Counterpart to Solidity's `int120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toInt120(int256 value) internal pure returns (int120 downcasted) {
        downcasted = int120(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 120 bits");
    }

    /**
     * @dev Returns the downcasted int112 from int256, reverting on
     * overflow (when the input is less than smallest int112 or
     * greater than largest int112).
     *
     * Counterpart to Solidity's `int112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toInt112(int256 value) internal pure returns (int112 downcasted) {
        downcasted = int112(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 112 bits");
    }

    /**
     * @dev Returns the downcasted int104 from int256, reverting on
     * overflow (when the input is less than smallest int104 or
     * greater than largest int104).
     *
     * Counterpart to Solidity's `int104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toInt104(int256 value) internal pure returns (int104 downcasted) {
        downcasted = int104(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 104 bits");
    }

    /**
     * @dev Returns the downcasted int96 from int256, reverting on
     * overflow (when the input is less than smallest int96 or
     * greater than largest int96).
     *
     * Counterpart to Solidity's `int96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.7._
     */
    function toInt96(int256 value) internal pure returns (int96 downcasted) {
        downcasted = int96(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 96 bits");
    }

    /**
     * @dev Returns the downcasted int88 from int256, reverting on
     * overflow (when the input is less than smallest int88 or
     * greater than largest int88).
     *
     * Counterpart to Solidity's `int88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toInt88(int256 value) internal pure returns (int88 downcasted) {
        downcasted = int88(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 88 bits");
    }

    /**
     * @dev Returns the downcasted int80 from int256, reverting on
     * overflow (when the input is less than smallest int80 or
     * greater than largest int80).
     *
     * Counterpart to Solidity's `int80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toInt80(int256 value) internal pure returns (int80 downcasted) {
        downcasted = int80(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 80 bits");
    }

    /**
     * @dev Returns the downcasted int72 from int256, reverting on
     * overflow (when the input is less than smallest int72 or
     * greater than largest int72).
     *
     * Counterpart to Solidity's `int72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toInt72(int256 value) internal pure returns (int72 downcasted) {
        downcasted = int72(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 72 bits");
    }

    /**
     * @dev Returns the downcasted int64 from int256, reverting on
     * overflow (when the input is less than smallest int64 or
     * greater than largest int64).
     *
     * Counterpart to Solidity's `int64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v3.1._
     */
    function toInt64(int256 value) internal pure returns (int64 downcasted) {
        downcasted = int64(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 64 bits");
    }

    /**
     * @dev Returns the downcasted int56 from int256, reverting on
     * overflow (when the input is less than smallest int56 or
     * greater than largest int56).
     *
     * Counterpart to Solidity's `int56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toInt56(int256 value) internal pure returns (int56 downcasted) {
        downcasted = int56(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 56 bits");
    }

    /**
     * @dev Returns the downcasted int48 from int256, reverting on
     * overflow (when the input is less than smallest int48 or
     * greater than largest int48).
     *
     * Counterpart to Solidity's `int48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toInt48(int256 value) internal pure returns (int48 downcasted) {
        downcasted = int48(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 48 bits");
    }

    /**
     * @dev Returns the downcasted int40 from int256, reverting on
     * overflow (when the input is less than smallest int40 or
     * greater than largest int40).
     *
     * Counterpart to Solidity's `int40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toInt40(int256 value) internal pure returns (int40 downcasted) {
        downcasted = int40(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 40 bits");
    }

    /**
     * @dev Returns the downcasted int32 from int256, reverting on
     * overflow (when the input is less than smallest int32 or
     * greater than largest int32).
     *
     * Counterpart to Solidity's `int32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v3.1._
     */
    function toInt32(int256 value) internal pure returns (int32 downcasted) {
        downcasted = int32(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 32 bits");
    }

    /**
     * @dev Returns the downcasted int24 from int256, reverting on
     * overflow (when the input is less than smallest int24 or
     * greater than largest int24).
     *
     * Counterpart to Solidity's `int24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toInt24(int256 value) internal pure returns (int24 downcasted) {
        downcasted = int24(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 24 bits");
    }

    /**
     * @dev Returns the downcasted int16 from int256, reverting on
     * overflow (when the input is less than smallest int16 or
     * greater than largest int16).
     *
     * Counterpart to Solidity's `int16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v3.1._
     */
    function toInt16(int256 value) internal pure returns (int16 downcasted) {
        downcasted = int16(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 16 bits");
    }

    /**
     * @dev Returns the downcasted int8 from int256, reverting on
     * overflow (when the input is less than smallest int8 or
     * greater than largest int8).
     *
     * Counterpart to Solidity's `int8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v3.1._
     */
    function toInt8(int256 value) internal pure returns (int8 downcasted) {
        downcasted = int8(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 8 bits");
    }

    /**
     * @dev Converts an unsigned uint256 into a signed int256.
     *
     * Requirements:
     *
     * - input must be less than or equal to maxInt256.
     *
     * _Available since v3.0._
     */
    function toInt256(uint256 value) internal pure returns (int256) {
        // Note: Unsafe cast below is okay because `type(int256).max` is guaranteed to be positive
        require(value <= uint256(type(int256).max), "SafeCast: value doesn't fit in an int256");
        return int256(value);
    }
}

abstract contract BaseZkSyncUpgradeGenesis is BaseZkSyncUpgrade {
    /// @notice Changes the protocol version
    /// @param _newProtocolVersion The new protocol version
    function _setNewProtocolVersion(
        uint256 _newProtocolVersion
    ) internal override returns (uint32 newMinorVersion, bool patchOnly) {
        uint256 previousProtocolVersion = s.protocolVersion;
        if (
            // IMPORTANT Genesis Upgrade difference: Note this is the only thing change <= to <
            _newProtocolVersion < previousProtocolVersion
        ) {
            revert ProtocolVersionTooSmall();
        }
        // slither-disable-next-line unused-return
        (uint32 previousMajorVersion, uint32 previousMinorVersion, ) = SemVer.unpackSemVer(
            SafeCast.toUint96(previousProtocolVersion)
        );

        if (previousMajorVersion != 0) {
            revert ProtocolMajorVersionNotZero();
        }

        uint32 newMajorVersion;
        // slither-disable-next-line unused-return
        (newMajorVersion, newMinorVersion, ) = SemVer.unpackSemVer(SafeCast.toUint96(_newProtocolVersion));
        if (newMajorVersion != 0) {
            revert ProtocolMajorVersionNotZero();
        }

        // Since `_newProtocolVersion > previousProtocolVersion`, and both old and new major version is 0,
        // the difference between minor versions is >= 0.
        uint256 minorDelta = newMinorVersion - previousMinorVersion;

        // IMPORTANT Genesis Upgrade difference: We never set patchOnly to `true` to allow to put a system upgrade transaction there.
        patchOnly = false;

        // While this is implicitly enforced by other checks above, we still double check just in case
        if (minorDelta > MAX_ALLOWED_MINOR_VERSION_DELTA) {
            revert ProtocolVersionDeltaTooLarge(minorDelta, MAX_ALLOWED_MINOR_VERSION_DELTA);
        }

        // If the minor version changes also, we need to ensure that the previous upgrade has been finalized.
        // In case the minor version does not change, we permit to keep the old upgrade transaction in the system, but it
        // must be ensured in the other parts of the upgrade that the upgrade transaction is not overridden.
        if (!patchOnly) {
            // If the previous upgrade had an L2 system upgrade transaction, we require that it is finalized.
            // Note it is important to keep this check, as otherwise ZK chains might skip upgrades by overwriting
            if (s.l2SystemContractsUpgradeTxHash != bytes32(0)) {
                revert PreviousUpgradeNotFinalized(s.l2SystemContractsUpgradeTxHash);
            }
            if (s.l2SystemContractsUpgradeBatchNumber != 0) {
                revert PreviousUpgradeBatchNotCleared();
            }
        }

        s.protocolVersion = _newProtocolVersion;
        emit NewProtocolVersion(previousProtocolVersion, _newProtocolVersion);
    }
}

struct L2CanonicalTransaction {
    uint256 txType;
    uint256 from;
    uint256 to;
    uint256 gasLimit;
    uint256 gasPerPubdataByteLimit;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    uint256 paymaster;
    uint256 nonce;
    uint256 value;
    // In the future, we might want to add some
    // new fields to the struct. The `txData` struct
    // is to be passed to account and any changes to its structure
    // would mean a breaking change to these accounts. To prevent this,
    // we should keep some fields as "reserved"
    // It is also recommended that their length is fixed, since
    // it would allow easier proof integration (in case we will need
    // some special circuit for preprocessing transactions)
    uint256[4] reserved;
    bytes data;
    bytes signature;
    uint256[] factoryDeps;
    bytes paymasterInput;
    // Reserved dynamic type for the future use-case. Using it should be avoided,
    // But it is still here, just in case we want to enable some additional functionality
    bytes reservedDynamic;
}

interface IL1GenesisUpgrade {
    /// @dev emitted when a chain registers and a GenesisUpgrade happens
    /// @param _zkChain the address of the zk chain
    /// @param _l2Transaction the l2 genesis upgrade transaction
    /// @param _protocolVersion the current protocol version
    /// @param _factoryDeps the factory dependencies needed for the upgrade
    event GenesisUpgrade(
        address indexed _zkChain,
        L2CanonicalTransaction _l2Transaction,
        uint256 indexed _protocolVersion,
        bytes[] _factoryDeps
    );

    /// @notice The main function that will be called by the Admin facet at genesis.
    /// @param _l1GenesisUpgrade the address of the l1 genesis upgrade
    /// @param _chainId the chain id
    /// @param _protocolVersion the current protocol version
    /// @param _l1CtmDeployerAddress the address of the l1 ctm deployer
    /// @param _forceDeployments the force deployments
    /// @param _factoryDeps the factory dependencies
    function genesisUpgrade(
        address _l1GenesisUpgrade,
        uint256 _chainId,
        uint256 _protocolVersion,
        address _l1CtmDeployerAddress,
        bytes calldata _forceDeployments,
        bytes[] calldata _factoryDeps
    ) external returns (bytes32);
}

contract L1GenesisUpgrade is IL1GenesisUpgrade, BaseZkSyncUpgradeGenesis, L1GatewayBase {
    /// @notice The main function that will be called by the Admin facet.
    /// @param _l1GenesisUpgrade the address of the l1 genesis upgrade
    /// @param _chainId the chain id
    /// @param _protocolVersion the current protocol version
    /// @param _l1CtmDeployerAddress the address of the l1 ctm deployer
    /// @param _fixedForceDeploymentsData the force deployments data
    /// @param _factoryDeps the factory dependencies
    function genesisUpgrade(
        address _l1GenesisUpgrade,
        uint256 _chainId,
        uint256 _protocolVersion,
        address _l1CtmDeployerAddress,
        bytes calldata _fixedForceDeploymentsData,
        bytes[] calldata _factoryDeps
    ) public override returns (bytes32) {
        address baseTokenAddress = IBridgehub(s.bridgehub).baseToken(_chainId);

        L2CanonicalTransaction memory l2ProtocolUpgradeTx;

        {
            bytes memory complexUpgraderCalldata;
            {
                bytes memory additionalForceDeploymentsData = getZKChainSpecificForceDeploymentsData(
                    s,
                    address(0),
                    baseTokenAddress
                );
                bytes memory l2GenesisUpgradeCalldata = abi.encodeCall(
                    IL2GenesisUpgrade.genesisUpgrade,
                    (_chainId, _l1CtmDeployerAddress, _fixedForceDeploymentsData, additionalForceDeploymentsData)
                );
                complexUpgraderCalldata = abi.encodeCall(
                    IComplexUpgrader.upgrade,
                    (L2_GENESIS_UPGRADE_ADDR, l2GenesisUpgradeCalldata)
                );
            }

            // slither-disable-next-line unused-return
            (, uint32 minorVersion, ) = SemVer.unpackSemVer(SafeCast.toUint96(_protocolVersion));
            l2ProtocolUpgradeTx = L2CanonicalTransaction({
                txType: SYSTEM_UPGRADE_L2_TX_TYPE,
                from: uint256(uint160(L2_FORCE_DEPLOYER_ADDR)),
                to: uint256(uint160(L2_COMPLEX_UPGRADER_ADDR)),
                gasLimit: PRIORITY_TX_MAX_GAS_LIMIT,
                gasPerPubdataByteLimit: REQUIRED_L2_GAS_PRICE_PER_PUBDATA,
                maxFeePerGas: uint256(0),
                maxPriorityFeePerGas: uint256(0),
                paymaster: uint256(0),
                // Note, that the protocol version is used as "nonce" for system upgrade transactions
                nonce: minorVersion,
                value: 0,
                reserved: [uint256(0), 0, 0, 0],
                data: complexUpgraderCalldata,
                signature: new bytes(0),
                factoryDeps: L2ContractHelper.hashFactoryDeps(_factoryDeps),
                paymasterInput: new bytes(0),
                reservedDynamic: new bytes(0)
            });
        }
        ProposedUpgrade memory proposedUpgrade = ProposedUpgrade({
            l2ProtocolUpgradeTx: l2ProtocolUpgradeTx,
            bootloaderHash: bytes32(0),
            defaultAccountHash: bytes32(0),
            verifier: address(0),
            verifierParams: VerifierParams({
                recursionNodeLevelVkHash: bytes32(0),
                recursionLeafLevelVkHash: bytes32(0),
                recursionCircuitsSetVksHash: bytes32(0)
            }),
            l1ContractsUpgradeCalldata: new bytes(0),
            postUpgradeCalldata: new bytes(0),
            upgradeTimestamp: 0,
            newProtocolVersion: _protocolVersion
        });

        Diamond.FacetCut[] memory emptyArray;
        Diamond.DiamondCutData memory cutData = Diamond.DiamondCutData({
            facetCuts: emptyArray,
            initAddress: _l1GenesisUpgrade,
            initCalldata: abi.encodeCall(this.upgrade, (proposedUpgrade))
        });
        Diamond.diamondCut(cutData);

        emit GenesisUpgrade(address(this), l2ProtocolUpgradeTx, _protocolVersion, _factoryDeps);
        return Diamond.DIAMOND_INIT_SUCCESS_RETURN_VALUE;
    }

    /// @notice the upgrade function.
    function upgrade(ProposedUpgrade calldata _proposedUpgrade) public override returns (bytes32) {
        super.upgrade(_proposedUpgrade);
        return Diamond.DIAMOND_INIT_SUCCESS_RETURN_VALUE;
    }
}