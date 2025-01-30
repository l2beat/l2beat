// SPDX-License-Identifier: Unknown
pragma solidity 0.8.12;

library BitmapUtils {
    /**
     * @notice Byte arrays are meant to contain unique bytes.
     * If the array length exceeds 256, then it's impossible for all entries to be unique.
     * This constant captures the max allowed array length (inclusive, i.e. 256 is allowed).
     */
    uint256 internal constant MAX_BYTE_ARRAY_LENGTH = 256;

    /**
     * @notice Converts an ordered array of bytes into a bitmap.
     * @param orderedBytesArray The array of bytes to convert/compress into a bitmap. Must be in strictly ascending order.
     * @return The resulting bitmap.
     * @dev Each byte in the input is processed as indicating a single bit to flip in the bitmap.
     * @dev This function will eventually revert in the event that the `orderedBytesArray` is not properly ordered (in ascending order).
     * @dev This function will also revert if the `orderedBytesArray` input contains any duplicate entries (i.e. duplicate bytes).
     */
    function orderedBytesArrayToBitmap(bytes memory orderedBytesArray) internal pure returns (uint256) {
        // sanity-check on input. a too-long input would fail later on due to having duplicate entry(s)
        require(orderedBytesArray.length <= MAX_BYTE_ARRAY_LENGTH,
            "BitmapUtils.orderedBytesArrayToBitmap: orderedBytesArray is too long");

        // return empty bitmap early if length of array is 0
        if (orderedBytesArray.length == 0) {
            return uint256(0);
        }

        // initialize the empty bitmap, to be built inside the loop
        uint256 bitmap;
        // initialize an empty uint256 to be used as a bitmask inside the loop
        uint256 bitMask;

        // perform the 0-th loop iteration with the ordering check *omitted* (since it is unnecessary / will always pass)
        // construct a single-bit mask from the numerical value of the 0th byte of the array, and immediately add it to the bitmap
        bitmap = uint256(1 << uint8(orderedBytesArray[0]));

        // loop through each byte in the array to construct the bitmap
        for (uint256 i = 1; i < orderedBytesArray.length; ++i) {
            // construct a single-bit mask from the numerical value of the next byte of the array
            bitMask = uint256(1 << uint8(orderedBytesArray[i]));
            // check strictly ascending array ordering by comparing the mask to the bitmap so far (revert if mask isn't greater than bitmap)
            require(bitMask > bitmap, "BitmapUtils.orderedBytesArrayToBitmap: orderedBytesArray is not ordered");
            // add the entry to the bitmap
            bitmap = (bitmap | bitMask);
        }
        return bitmap;
    }

    /**
     * @notice Converts an ordered byte array to a bitmap, validating that all bits are less than `bitUpperBound`
     * @param orderedBytesArray The array to convert to a bitmap; must be in strictly ascending order
     * @param bitUpperBound The exclusive largest bit. Each bit must be strictly less than this value.
     * @dev Reverts if bitmap contains a bit greater than or equal to `bitUpperBound`
     */
    function orderedBytesArrayToBitmap(bytes memory orderedBytesArray, uint8 bitUpperBound) internal pure returns (uint256) {
        uint256 bitmap = orderedBytesArrayToBitmap(orderedBytesArray);

        require((1 << bitUpperBound) > bitmap, 
            "BitmapUtils.orderedBytesArrayToBitmap: bitmap exceeds max value"
        );

        return bitmap;
    }

    /**
     * @notice Utility function for checking if a bytes array is strictly ordered, in ascending order.
     * @param bytesArray the bytes array of interest
     * @return Returns 'true' if the array is ordered in strictly ascending order, and 'false' otherwise.
     * @dev This function returns 'true' for the edge case of the `bytesArray` having zero length.
     * It also returns 'false' early for arrays with length in excess of MAX_BYTE_ARRAY_LENGTH (i.e. so long that they cannot be strictly ordered)
     */
    function isArrayStrictlyAscendingOrdered(bytes calldata bytesArray) internal pure returns (bool) {
        // Return early if the array is too long, or has a length of 0
        if (bytesArray.length > MAX_BYTE_ARRAY_LENGTH) {
            return false;
        }

        if (bytesArray.length == 0) {
            return true;
        }

        // Perform the 0-th loop iteration by pulling the 0th byte out of the array
        bytes1 singleByte = bytesArray[0];

        // For each byte, validate that each entry is *strictly greater than* the previous
        // If it isn't, return false as the array is not ordered
        for (uint256 i = 1; i < bytesArray.length; ++i) {
            if (uint256(uint8(bytesArray[i])) <= uint256(uint8(singleByte))) {
                return false;
            }
            
            // Pull the next byte out of the array
            singleByte = bytesArray[i];
        }
        
        return true;
    }

    /**
     * @notice Converts a bitmap into an array of bytes.
     * @param bitmap The bitmap to decompress/convert to an array of bytes.
     * @return bytesArray The resulting bitmap array of bytes.
     * @dev Each byte in the input is processed as indicating a single bit to flip in the bitmap
     */
    function bitmapToBytesArray(uint256 bitmap) internal pure returns (bytes memory /*bytesArray*/) {
        // initialize an empty uint256 to be used as a bitmask inside the loop
        uint256 bitMask;
        // allocate only the needed amount of memory
        bytes memory bytesArray = new bytes(countNumOnes(bitmap));
        // track the array index to assign to
        uint256 arrayIndex = 0;
        /**
         * loop through each index in the bitmap to construct the array,
         * but short-circuit the loop if we reach the number of ones and thus are done
         * assigning to memory
         */
        for (uint256 i = 0; (arrayIndex < bytesArray.length) && (i < 256); ++i) {
            // construct a single-bit mask for the i-th bit
            bitMask = uint256(1 << i);
            // check if the i-th bit is flipped in the bitmap
            if (bitmap & bitMask != 0) {
                // if the i-th bit is flipped, then add a byte encoding the value 'i' to the `bytesArray`
                bytesArray[arrayIndex] = bytes1(uint8(i));
                // increment the bytesArray slot since we've assigned one more byte of memory
                unchecked{ ++arrayIndex; }
            }
        }
        return bytesArray;
    }

    /// @return count number of ones in binary representation of `n`
    function countNumOnes(uint256 n) internal pure returns (uint16) {
        uint16 count = 0;
        while (n > 0) {
            n &= (n - 1); // Clear the least significant bit (turn off the rightmost set bit).
            count++; // Increment the count for each cleared bit (each one encountered).
        }
        return count; // Return the total count of ones in the binary representation of n.
    }

    /// @notice Returns `true` if `bit` is in `bitmap`. Returns `false` otherwise.
    function isSet(uint256 bitmap, uint8 bit) internal pure returns (bool) {
        return 1 == ((bitmap >> bit) & 1);
    }
    
    /**
     * @notice Returns a copy of `bitmap` with `bit` set. 
     * @dev IMPORTANT: we're dealing with stack values here, so this doesn't modify
     * the original bitmap. Using this correctly requires an assignment statement:
     * `bitmap = bitmap.setBit(bit);`
     */
    function setBit(uint256 bitmap, uint8 bit) internal pure returns (uint256) {
        return bitmap | (1 << bit);
    }

    /**
     * @notice Returns true if `bitmap` has no set bits
     */
    function isEmpty(uint256 bitmap) internal pure returns (bool) {
        return bitmap == 0;
    }

    /**
     * @notice Returns true if `a` and `b` have no common set bits
     */
    function noBitsInCommon(uint256 a, uint256 b) internal pure returns (bool) {
        return a & b == 0;
    }

    /**
     * @notice Returns true if `a` is a subset of `b`: ALL of the bits in `a` are also in `b`
     */
    function isSubsetOf(uint256 a, uint256 b) internal pure returns (bool) {
        return a & b == a;
    }

    /**
     * @notice Returns a new bitmap that contains all bits set in either `a` or `b`
     * @dev Result is the union of `a` and `b`
     */
    function plus(uint256 a, uint256 b) internal pure returns (uint256) {
        return a | b;
    }

    /**
     * @notice Returns a new bitmap that clears all set bits of `b` from `a`
     * @dev Negates `b` and returns the intersection of the result with `a`
     */
    function minus(uint256 a, uint256 b) internal pure returns (uint256) {
        return a & ~b;
    }
}

interface IRegistry {
    function registryCoordinator() external view returns (address);
}

interface IStakeRegistry is IRegistry {
    
    // DATA STRUCTURES

    /// @notice struct used to store the stakes of an individual operator or the sum of all operators' stakes, for storage
    struct StakeUpdate {
        // the block number at which the stake amounts were updated and stored
        uint32 updateBlockNumber;
        // the block number at which the *next update* occurred.
        /// @notice This entry has the value **0** until another update takes place.
        uint32 nextUpdateBlockNumber;
        // stake weight for the quorum
        uint96 stake;
    }

    /**
     * @notice In weighing a particular strategy, the amount of underlying asset for that strategy is
     * multiplied by its multiplier, then divided by WEIGHTING_DIVISOR
     */
    struct StrategyParams {
        IStrategy strategy;
        uint96 multiplier;
    }

    // EVENTS

    /// @notice emitted whenever the stake of `operator` is updated
    event OperatorStakeUpdate(
        bytes32 indexed operatorId,
        uint8 quorumNumber,
        uint96 stake
    );
    /// @notice emitted when the minimum stake for a quorum is updated
    event MinimumStakeForQuorumUpdated(uint8 indexed quorumNumber, uint96 minimumStake);
    /// @notice emitted when a new quorum is created
    event QuorumCreated(uint8 indexed quorumNumber);
    /// @notice emitted when `strategy` has been added to the array at `strategyParams[quorumNumber]`
    event StrategyAddedToQuorum(uint8 indexed quorumNumber, IStrategy strategy);
    /// @notice emitted when `strategy` has removed from the array at `strategyParams[quorumNumber]`
    event StrategyRemovedFromQuorum(uint8 indexed quorumNumber, IStrategy strategy);
    /// @notice emitted when `strategy` has its `multiplier` updated in the array at `strategyParams[quorumNumber]`
    event StrategyMultiplierUpdated(uint8 indexed quorumNumber, IStrategy strategy, uint256 multiplier);

    /**
     * @notice Registers the `operator` with `operatorId` for the specified `quorumNumbers`.
     * @param operator The address of the operator to register.
     * @param operatorId The id of the operator to register.
     * @param quorumNumbers The quorum numbers the operator is registering for, where each byte is an 8 bit integer quorumNumber.
     * @return The operator's current stake for each quorum, and the total stake for each quorum
     * @dev access restricted to the RegistryCoordinator
     * @dev Preconditions (these are assumed, not validated in this contract):
     *         1) `quorumNumbers` has no duplicates
     *         2) `quorumNumbers.length` != 0
     *         3) `quorumNumbers` is ordered in ascending order
     *         4) the operator is not already registered
     */
    function registerOperator(
        address operator, 
        bytes32 operatorId, 
        bytes memory quorumNumbers
    ) external returns (uint96[] memory, uint96[] memory);

    /**
     * @notice Deregisters the operator with `operatorId` for the specified `quorumNumbers`.
     * @param operatorId The id of the operator to deregister.
     * @param quorumNumbers The quorum numbers the operator is deregistering from, where each byte is an 8 bit integer quorumNumber.
     * @dev access restricted to the RegistryCoordinator
     * @dev Preconditions (these are assumed, not validated in this contract):
     *         1) `quorumNumbers` has no duplicates
     *         2) `quorumNumbers.length` != 0
     *         3) `quorumNumbers` is ordered in ascending order
     *         4) the operator is not already deregistered
     *         5) `quorumNumbers` is a subset of the quorumNumbers that the operator is registered for
     */
    function deregisterOperator(bytes32 operatorId, bytes memory quorumNumbers) external;

    /**
     * @notice Initialize a new quorum created by the registry coordinator by setting strategies, weights, and minimum stake
     */
    function initializeQuorum(uint8 quorumNumber, uint96 minimumStake, StrategyParams[] memory strategyParams) external;

    /// @notice Adds new strategies and the associated multipliers to the @param quorumNumber.
    function addStrategies(
        uint8 quorumNumber,
        StrategyParams[] memory strategyParams
    ) external;

    /**
     * @notice This function is used for removing strategies and their associated weights from the
     * mapping strategyParams for a specific @param quorumNumber.
     * @dev higher indices should be *first* in the list of @param indicesToRemove, since otherwise
     * the removal of lower index entries will cause a shift in the indices of the other strategiesToRemove
     */
    function removeStrategies(uint8 quorumNumber, uint256[] calldata indicesToRemove) external;

    /**
     * @notice This function is used for modifying the weights of strategies that are already in the
     * mapping strategyParams for a specific
     * @param quorumNumber is the quorum number to change the strategy for
     * @param strategyIndices are the indices of the strategies to change
     * @param newMultipliers are the new multipliers for the strategies
     */
    function modifyStrategyParams(
        uint8 quorumNumber,
        uint256[] calldata strategyIndices,
        uint96[] calldata newMultipliers
    ) external;

    /// @notice Constant used as a divisor in calculating weights.
    function WEIGHTING_DIVISOR() external pure returns (uint256);

    /// @notice Returns the EigenLayer delegation manager contract.
    function delegation() external view returns (IDelegationManager);

    /// @notice In order to register for a quorum i, an operator must have at least `minimumStakeForQuorum[i]`
    function minimumStakeForQuorum(uint8 quorumNumber) external view returns (uint96);

    /// @notice Returns the length of the dynamic array stored in `strategyParams[quorumNumber]`.
    function strategyParamsLength(uint8 quorumNumber) external view returns (uint256);

    /// @notice Returns the strategy and weight multiplier for the `index`'th strategy in the quorum `quorumNumber`
    function strategyParamsByIndex(
        uint8 quorumNumber,
        uint256 index
    ) external view returns (StrategyParams memory);

    /**
     * @notice This function computes the total weight of the @param operator in the quorum @param quorumNumber.
     * @dev reverts in the case that `quorumNumber` is greater than or equal to `quorumCount`
     */
    function weightOfOperatorForQuorum(uint8 quorumNumber, address operator) external view returns (uint96);

    /**
     * @notice Returns the entire `operatorIdToStakeHistory[operatorId][quorumNumber]` array.
     * @param operatorId The id of the operator of interest.
     * @param quorumNumber The quorum number to get the stake for.
     */
    function getStakeHistory(bytes32 operatorId, uint8 quorumNumber) external view returns (StakeUpdate[] memory);

    function getTotalStakeHistoryLength(uint8 quorumNumber) external view returns (uint256);

    /**
     * @notice Returns the `index`-th entry in the dynamic array of total stake, `totalStakeHistory` for quorum `quorumNumber`.
     * @param quorumNumber The quorum number to get the stake for.
     * @param index Array index for lookup, within the dynamic array `totalStakeHistory[quorumNumber]`.
     */
    function getTotalStakeUpdateAtIndex(uint8 quorumNumber, uint256 index) external view returns (StakeUpdate memory);

    /// @notice Returns the indices of the operator stakes for the provided `quorumNumber` at the given `blockNumber`
    function getStakeUpdateIndexAtBlockNumber(bytes32 operatorId, uint8 quorumNumber, uint32 blockNumber)
        external
        view
        returns (uint32);

    /// @notice Returns the indices of the total stakes for the provided `quorumNumbers` at the given `blockNumber`
    function getTotalStakeIndicesAtBlockNumber(uint32 blockNumber, bytes calldata quorumNumbers) external view returns(uint32[] memory) ;

    /**
     * @notice Returns the `index`-th entry in the `operatorIdToStakeHistory[operatorId][quorumNumber]` array.
     * @param quorumNumber The quorum number to get the stake for.
     * @param operatorId The id of the operator of interest.
     * @param index Array index for lookup, within the dynamic array `operatorIdToStakeHistory[operatorId][quorumNumber]`.
     * @dev Function will revert if `index` is out-of-bounds.
     */
    function getStakeUpdateAtIndex(uint8 quorumNumber, bytes32 operatorId, uint256 index)
        external
        view
        returns (StakeUpdate memory);

    /**
     * @notice Returns the most recent stake weight for the `operatorId` for a certain quorum
     * @dev Function returns an StakeUpdate struct with **every entry equal to 0** in the event that the operator has no stake history
     */
    function getLatestStakeUpdate(bytes32 operatorId, uint8 quorumNumber) external view returns (StakeUpdate memory);

    /**
     * @notice Returns the stake weight corresponding to `operatorId` for quorum `quorumNumber`, at the
     * `index`-th entry in the `operatorIdToStakeHistory[operatorId][quorumNumber]` array if the entry 
     * corresponds to the operator's stake at `blockNumber`. Reverts otherwise.
     * @param quorumNumber The quorum number to get the stake for.
     * @param operatorId The id of the operator of interest.
     * @param index Array index for lookup, within the dynamic array `operatorIdToStakeHistory[operatorId][quorumNumber]`.
     * @param blockNumber Block number to make sure the stake is from.
     * @dev Function will revert if `index` is out-of-bounds.
     * @dev used the BLSSignatureChecker to get past stakes of signing operators
     */
    function getStakeAtBlockNumberAndIndex(uint8 quorumNumber, uint32 blockNumber, bytes32 operatorId, uint256 index)
        external
        view
        returns (uint96);

    /**
     * @notice Returns the total stake weight for quorum `quorumNumber`, at the `index`-th entry in the 
     * `totalStakeHistory[quorumNumber]` array if the entry corresponds to the total stake at `blockNumber`. 
     * Reverts otherwise.
     * @param quorumNumber The quorum number to get the stake for.
     * @param index Array index for lookup, within the dynamic array `totalStakeHistory[quorumNumber]`.
     * @param blockNumber Block number to make sure the stake is from.
     * @dev Function will revert if `index` is out-of-bounds.
     * @dev used the BLSSignatureChecker to get past stakes of signing operators
     */
    function getTotalStakeAtBlockNumberFromIndex(uint8 quorumNumber, uint32 blockNumber, uint256 index) external view returns (uint96);

    /**
     * @notice Returns the most recent stake weight for the `operatorId` for quorum `quorumNumber`
     * @dev Function returns weight of **0** in the event that the operator has no stake history
     */
    function getCurrentStake(bytes32 operatorId, uint8 quorumNumber) external view returns (uint96);

    /// @notice Returns the stake of the operator for the provided `quorumNumber` at the given `blockNumber`
    function getStakeAtBlockNumber(bytes32 operatorId, uint8 quorumNumber, uint32 blockNumber)
        external
        view
        returns (uint96);

    /**
     * @notice Returns the stake weight from the latest entry in `_totalStakeHistory` for quorum `quorumNumber`.
     * @dev Will revert if `_totalStakeHistory[quorumNumber]` is empty.
     */
    function getCurrentTotalStake(uint8 quorumNumber) external view returns (uint96);

    /**
     * @notice Called by the registry coordinator to update an operator's stake for one
     * or more quorums.
     *
     * If the operator no longer has the minimum stake required for a quorum, they are
     * added to the
     * @return A bitmap of quorums where the operator no longer meets the minimum stake
     * and should be deregistered.
     */
    function updateOperatorStake(
        address operator, 
        bytes32 operatorId, 
        bytes calldata quorumNumbers
    ) external returns (uint192);
}

abstract contract StakeRegistryStorage is IStakeRegistry {
    
    /// @notice Constant used as a divisor in calculating weights.
    uint256 public constant WEIGHTING_DIVISOR = 1e18;
    /// @notice Maximum length of dynamic arrays in the `strategyParams` mapping.
    uint8 public constant MAX_WEIGHING_FUNCTION_LENGTH = 32;
    /// @notice Constant used as a divisor in dealing with BIPS amounts.
    uint256 internal constant MAX_BIPS = 10000;

    /// @notice The address of the Delegation contract for EigenLayer.
    IDelegationManager public immutable delegation;

    /// @notice the coordinator contract that this registry is associated with
    address public immutable registryCoordinator;

    /// @notice In order to register for a quorum i, an operator must have at least `minimumStakeForQuorum[i]`
    /// evaluated by this contract's 'VoteWeigher' logic.
    mapping(uint8 => uint96) public minimumStakeForQuorum;

    /// @notice History of the total stakes for each quorum
    mapping(uint8 => StakeUpdate[]) internal _totalStakeHistory;

    /// @notice mapping from operator's operatorId to the history of their stake updates
    mapping(bytes32 => mapping(uint8 => StakeUpdate[])) internal operatorStakeHistory;

    /**
     * @notice mapping from quorum number to the list of strategies considered and their
     * corresponding multipliers for that specific quorum
     */
    mapping(uint8 => StrategyParams[]) public strategyParams;
    mapping(uint8 => IStrategy[]) public strategiesPerQuorum;


    constructor(
        IRegistryCoordinator _registryCoordinator, 
        IDelegationManager _delegationManager
    ) {
        registryCoordinator = address(_registryCoordinator);
        delegation = _delegationManager;
    }

    // storage gap for upgradeability
    // slither-disable-next-line shadowing-state
    uint256[45] private __GAP;
}

contract StakeRegistry is StakeRegistryStorage {

    using BitmapUtils for *;
    
    modifier onlyRegistryCoordinator() {
        require(
            msg.sender == address(registryCoordinator),
            "StakeRegistry.onlyRegistryCoordinator: caller is not the RegistryCoordinator"
        );
        _;
    }

    modifier onlyCoordinatorOwner() {
        require(msg.sender == IRegistryCoordinator(registryCoordinator).owner(), "StakeRegistry.onlyCoordinatorOwner: caller is not the owner of the registryCoordinator");
        _;
    }

    modifier quorumExists(uint8 quorumNumber) {
        require(_quorumExists(quorumNumber), "StakeRegistry.quorumExists: quorum does not exist");
        _;
    }

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IDelegationManager _delegationManager
    ) StakeRegistryStorage(_registryCoordinator, _delegationManager) {}

    /*******************************************************************************
                      EXTERNAL FUNCTIONS - REGISTRY COORDINATOR
    *******************************************************************************/

    /**
     * @notice Registers the `operator` with `operatorId` for the specified `quorumNumbers`.
     * @param operator The address of the operator to register.
     * @param operatorId The id of the operator to register.
     * @param quorumNumbers The quorum numbers the operator is registering for, where each byte is an 8 bit integer quorumNumber.
     * @return The operator's current stake for each quorum, and the total stake for each quorum
     * @dev access restricted to the RegistryCoordinator
     * @dev Preconditions (these are assumed, not validated in this contract):
     *         1) `quorumNumbers` has no duplicates
     *         2) `quorumNumbers.length` != 0
     *         3) `quorumNumbers` is ordered in ascending order
     *         4) the operator is not already registered
     */
    function registerOperator(
        address operator,
        bytes32 operatorId,
        bytes calldata quorumNumbers
    ) public virtual onlyRegistryCoordinator returns (uint96[] memory, uint96[] memory) {

        uint96[] memory currentStakes = new uint96[](quorumNumbers.length);
        uint96[] memory totalStakes = new uint96[](quorumNumbers.length);
        for (uint256 i = 0; i < quorumNumbers.length; i++) {            
            
            uint8 quorumNumber = uint8(quorumNumbers[i]);
            require(_quorumExists(quorumNumber), "StakeRegistry.registerOperator: quorum does not exist");

            // Retrieve the operator's current weighted stake for the quorum, reverting if they have not met
            // the minimum.
            (uint96 currentStake, bool hasMinimumStake) = _weightOfOperatorForQuorum(quorumNumber, operator);
            require(
                hasMinimumStake,
                "StakeRegistry.registerOperator: Operator does not meet minimum stake requirement for quorum"
            );

            // Update the operator's stake
            int256 stakeDelta = _recordOperatorStakeUpdate({
                operatorId: operatorId, 
                quorumNumber: quorumNumber,
                newStake: currentStake
            });

            // Update this quorum's total stake by applying the operator's delta
            currentStakes[i] = currentStake;
            totalStakes[i] = _recordTotalStakeUpdate(quorumNumber, stakeDelta);
        }

        return (currentStakes, totalStakes);
    }

    /**
     * @notice Deregisters the operator with `operatorId` for the specified `quorumNumbers`.
     * @param operatorId The id of the operator to deregister.
     * @param quorumNumbers The quorum numbers the operator is deregistering from, where each byte is an 8 bit integer quorumNumber.
     * @dev access restricted to the RegistryCoordinator
     * @dev Preconditions (these are assumed, not validated in this contract):
     *         1) `quorumNumbers` has no duplicates
     *         2) `quorumNumbers.length` != 0
     *         3) `quorumNumbers` is ordered in ascending order
     *         4) the operator is not already deregistered
     *         5) `quorumNumbers` is a subset of the quorumNumbers that the operator is registered for
     */
    function deregisterOperator(
        bytes32 operatorId,
        bytes calldata quorumNumbers
    ) public virtual onlyRegistryCoordinator {
        /**
         * For each quorum, remove the operator's stake for the quorum and update
         * the quorum's total stake to account for the removal
         */
        for (uint256 i = 0; i < quorumNumbers.length; i++) {
            uint8 quorumNumber = uint8(quorumNumbers[i]);
            require(_quorumExists(quorumNumber), "StakeRegistry.deregisterOperator: quorum does not exist");

            // Update the operator's stake for the quorum and retrieve the shares removed
            int256 stakeDelta = _recordOperatorStakeUpdate({
                operatorId: operatorId, 
                quorumNumber: quorumNumber, 
                newStake: 0
            });

            // Apply the operator's stake delta to the total stake for this quorum
            _recordTotalStakeUpdate(quorumNumber, stakeDelta);
        }
    }

    /**
     * @notice Called by the registry coordinator to update an operator's stake for one
     * or more quorums.
     *
     * If the operator no longer has the minimum stake required for a quorum, they are
     * added to the `quorumsToRemove`, which is returned to the registry coordinator
     * @return A bitmap of quorums where the operator no longer meets the minimum stake
     * and should be deregistered.
     */
    function updateOperatorStake(
        address operator, 
        bytes32 operatorId, 
        bytes calldata quorumNumbers
    ) external onlyRegistryCoordinator returns (uint192) {
        uint192 quorumsToRemove;

        /**
         * For each quorum, update the operator's stake and record the delta
         * in the quorum's total stake.
         *
         * If the operator no longer has the minimum stake required to be registered
         * in the quorum, the quorum number is added to `quorumsToRemove`, which
         * is returned to the registry coordinator.
         */
        for (uint256 i = 0; i < quorumNumbers.length; i++) {
            uint8 quorumNumber = uint8(quorumNumbers[i]);
            require(_quorumExists(quorumNumber), "StakeRegistry.updateOperatorStake: quorum does not exist");

            // Fetch the operator's current stake, applying weighting parameters and checking
            // against the minimum stake requirements for the quorum.
            (uint96 stakeWeight, bool hasMinimumStake) = _weightOfOperatorForQuorum(quorumNumber, operator);

            // If the operator no longer meets the minimum stake, set their stake to zero and mark them for removal
            if (!hasMinimumStake) {
                stakeWeight = 0;
                quorumsToRemove = uint192(quorumsToRemove.setBit(quorumNumber));
            }

            // Update the operator's stake and retrieve the delta
            // If we're deregistering them, their weight is set to 0
            int256 stakeDelta = _recordOperatorStakeUpdate({
                operatorId: operatorId,
                quorumNumber: quorumNumber,
                newStake: stakeWeight
            });

            // Apply the delta to the quorum's total stake
            _recordTotalStakeUpdate(quorumNumber, stakeDelta);
        }

        return quorumsToRemove;
    }

    /// @notice Initialize a new quorum and push its first history update
    function initializeQuorum(
        uint8 quorumNumber,
        uint96 minimumStake,
        StrategyParams[] memory _strategyParams
    ) public virtual onlyRegistryCoordinator {
        require(!_quorumExists(quorumNumber), "StakeRegistry.initializeQuorum: quorum already exists");
        _addStrategyParams(quorumNumber, _strategyParams);
        _setMinimumStakeForQuorum(quorumNumber, minimumStake);

        _totalStakeHistory[quorumNumber].push(StakeUpdate({
            updateBlockNumber: uint32(block.number),
            nextUpdateBlockNumber: 0,
            stake: 0
        }));
    }

    function setMinimumStakeForQuorum(
        uint8 quorumNumber, 
        uint96 minimumStake
    ) public virtual onlyCoordinatorOwner quorumExists(quorumNumber) {
        _setMinimumStakeForQuorum(quorumNumber, minimumStake);
    }

    /** 
     * @notice Adds strategies and weights to the quorum
     * @dev Checks to make sure that the *same* strategy cannot be added multiple times (checks against both against existing and new strategies).
     * @dev This function has no check to make sure that the strategies for a single quorum have the same underlying asset. This is a concious choice,
     * since a middleware may want, e.g., a stablecoin quorum that accepts USDC, USDT, DAI, etc. as underlying assets and trades them as "equivalent".
     */
    function addStrategies(
        uint8 quorumNumber, 
        StrategyParams[] memory _strategyParams
    ) public virtual onlyCoordinatorOwner quorumExists(quorumNumber) {
        _addStrategyParams(quorumNumber, _strategyParams);
    }

    /**
     * @notice Remove strategies and their associated weights from the quorum's considered strategies
     * @dev higher indices should be *first* in the list of @param indicesToRemove, since otherwise
     * the removal of lower index entries will cause a shift in the indices of the other strategies to remove
     */
    function removeStrategies(
        uint8 quorumNumber,
        uint256[] memory indicesToRemove
    ) public virtual onlyCoordinatorOwner quorumExists(quorumNumber) {
        uint256 toRemoveLength = indicesToRemove.length;
        require(toRemoveLength > 0, "StakeRegistry.removeStrategies: no indices to remove provided");

        StrategyParams[] storage _strategyParams = strategyParams[quorumNumber];
        IStrategy[] storage _strategiesPerQuorum = strategiesPerQuorum[quorumNumber];

        for (uint256 i = 0; i < toRemoveLength; i++) {
            emit StrategyRemovedFromQuorum(quorumNumber, _strategyParams[indicesToRemove[i]].strategy);
            emit StrategyMultiplierUpdated(quorumNumber, _strategyParams[indicesToRemove[i]].strategy, 0);

            // Replace index to remove with the last item in the list, then pop the last item
            _strategyParams[indicesToRemove[i]] = _strategyParams[_strategyParams.length - 1];
            _strategyParams.pop();
            _strategiesPerQuorum[indicesToRemove[i]] = _strategiesPerQuorum[_strategiesPerQuorum.length - 1];
            _strategiesPerQuorum.pop();
        }
    }

    /**
     * @notice Modifies the weights of existing strategies for a specific quorum
     * @param quorumNumber is the quorum number to which the strategies belong
     * @param strategyIndices are the indices of the strategies to change
     * @param newMultipliers are the new multipliers for the strategies
     */
    function modifyStrategyParams(
        uint8 quorumNumber,
        uint256[] calldata strategyIndices,
        uint96[] calldata newMultipliers
    ) public virtual onlyCoordinatorOwner quorumExists(quorumNumber) {
        uint256 numStrats = strategyIndices.length;
        require(numStrats > 0, "StakeRegistry.modifyStrategyParams: no strategy indices provided");
        require(newMultipliers.length == numStrats, "StakeRegistry.modifyStrategyParams: input length mismatch");

        StrategyParams[] storage _strategyParams = strategyParams[quorumNumber];

        for (uint256 i = 0; i < numStrats; i++) {
            // Change the strategy's associated multiplier
            _strategyParams[strategyIndices[i]].multiplier = newMultipliers[i];
            emit StrategyMultiplierUpdated(quorumNumber, _strategyParams[strategyIndices[i]].strategy, newMultipliers[i]);
        }
    }

    /*******************************************************************************
                            INTERNAL FUNCTIONS
    *******************************************************************************/

    function _getStakeUpdateIndexForOperatorAtBlockNumber(
        bytes32 operatorId,
        uint8 quorumNumber,
        uint32 blockNumber
    ) internal view returns (uint32) {
        uint256 length = operatorStakeHistory[operatorId][quorumNumber].length;

        // Iterate backwards through operatorStakeHistory until we find an update that preceeds blockNumber
        for (uint256 i = length; i > 0; i--) {
            if (operatorStakeHistory[operatorId][quorumNumber][i - 1].updateBlockNumber <= blockNumber) {
                return uint32(i - 1);
            }
        }

        // If we hit this point, no stake update exists at blockNumber
        revert(
            "StakeRegistry._getStakeUpdateIndexForOperatorAtBlockNumber: no stake update found for operatorId and quorumNumber at block number"
        );
    }

    function _setMinimumStakeForQuorum(uint8 quorumNumber, uint96 minimumStake) internal {
        minimumStakeForQuorum[quorumNumber] = minimumStake;
        emit MinimumStakeForQuorumUpdated(quorumNumber, minimumStake);
    }

    /**
     * @notice Records that `operatorId`'s current stake for `quorumNumber` is now `newStake`
     * @return The change in the operator's stake as a signed int256
     */
    function _recordOperatorStakeUpdate(
        bytes32 operatorId,
        uint8 quorumNumber,
        uint96 newStake
    ) internal returns (int256) {

        uint96 prevStake;
        uint256 historyLength = operatorStakeHistory[operatorId][quorumNumber].length;

        if (historyLength == 0) {
            // No prior stake history - push our first entry
            operatorStakeHistory[operatorId][quorumNumber].push(StakeUpdate({
                updateBlockNumber: uint32(block.number),
                nextUpdateBlockNumber: 0,
                stake: newStake
            }));
        } else {
            // We have prior stake history - fetch our last-recorded stake
            StakeUpdate storage lastUpdate = operatorStakeHistory[operatorId][quorumNumber][historyLength-1]; 
            prevStake = lastUpdate.stake;

            // Short-circuit in case there's no change in stake
            if (prevStake == newStake) {
                return 0;
            }

            /**
             * If our last stake entry was made in the current block, update the entry
             * Otherwise, push a new entry and update the previous entry's "next" field
             */ 
            if (lastUpdate.updateBlockNumber == uint32(block.number)) {
                lastUpdate.stake = newStake;
            } else {
                lastUpdate.nextUpdateBlockNumber = uint32(block.number);
                operatorStakeHistory[operatorId][quorumNumber].push(StakeUpdate({
                    updateBlockNumber: uint32(block.number),
                    nextUpdateBlockNumber: 0,
                    stake: newStake
                }));
            }
        }

        // Log update and return stake delta
        emit OperatorStakeUpdate(operatorId, quorumNumber, newStake);
        return _calculateDelta({ prev: prevStake, cur: newStake });
    }

    /// @notice Applies a delta to the total stake recorded for `quorumNumber`
    /// @return Returns the new total stake for the quorum
    function _recordTotalStakeUpdate(uint8 quorumNumber, int256 stakeDelta) internal returns (uint96) {
        // Get our last-recorded stake update
        uint256 historyLength = _totalStakeHistory[quorumNumber].length;
        StakeUpdate storage lastStakeUpdate = _totalStakeHistory[quorumNumber][historyLength - 1];

        // Return early if no update is needed
        if (stakeDelta == 0) {
            return lastStakeUpdate.stake;
        }
        
        // Calculate the new total stake by applying the delta to our previous stake
        uint96 newStake = _applyDelta(lastStakeUpdate.stake, stakeDelta);

        /**
         * If our last stake entry was made in the current block, update the entry
         * Otherwise, push a new entry and update the previous entry's "next" field
         */
        if (lastStakeUpdate.updateBlockNumber == uint32(block.number)) {
            lastStakeUpdate.stake = newStake;
        } else {
            lastStakeUpdate.nextUpdateBlockNumber = uint32(block.number);
            _totalStakeHistory[quorumNumber].push(StakeUpdate({
                updateBlockNumber: uint32(block.number),
                nextUpdateBlockNumber: 0,
                stake: newStake
            }));
        }

        return newStake;
    }

    /** 
     * @notice Adds `strategyParams` to the `quorumNumber`-th quorum.
     * @dev Checks to make sure that the *same* strategy cannot be added multiple times (checks against both against existing and new strategies).
     * @dev This function has no check to make sure that the strategies for a single quorum have the same underlying asset. This is a conscious choice,
     * since a middleware may want, e.g., a stablecoin quorum that accepts USDC, USDT, DAI, etc. as underlying assets and trades them as "equivalent".
     */
    function _addStrategyParams(
        uint8 quorumNumber,
        StrategyParams[] memory _strategyParams
    ) internal {
        require(_strategyParams.length > 0, "StakeRegistry._addStrategyParams: no strategies provided");
        uint256 numStratsToAdd = _strategyParams.length;
        uint256 numStratsExisting = strategyParams[quorumNumber].length;
        require(
            numStratsExisting + numStratsToAdd <= MAX_WEIGHING_FUNCTION_LENGTH,
            "StakeRegistry._addStrategyParams: exceed MAX_WEIGHING_FUNCTION_LENGTH"
        );
        for (uint256 i = 0; i < numStratsToAdd; i++) {
            // fairly gas-expensive internal loop to make sure that the *same* strategy cannot be added multiple times
            for (uint256 j = 0; j < (numStratsExisting + i); j++) {
                require(
                    strategyParams[quorumNumber][j].strategy != _strategyParams[i].strategy,
                    "StakeRegistry._addStrategyParams: cannot add same strategy 2x"
                );
            }
            require(
                _strategyParams[i].multiplier > 0,
                "StakeRegistry._addStrategyParams: cannot add strategy with zero weight"
            );
            strategyParams[quorumNumber].push(_strategyParams[i]);
            strategiesPerQuorum[quorumNumber].push(_strategyParams[i].strategy);
            emit StrategyAddedToQuorum(quorumNumber, _strategyParams[i].strategy);
            emit StrategyMultiplierUpdated(
                quorumNumber,
                _strategyParams[i].strategy,
                _strategyParams[i].multiplier
            );
        }
    }

    /// @notice Returns the change between a previous and current value as a signed int
    function _calculateDelta(uint96 prev, uint96 cur) internal pure returns (int256) {
        return int256(uint256(cur)) - int256(uint256(prev));
    }

    /// @notice Adds or subtracts delta from value, according to its sign
    function _applyDelta(uint96 value, int256 delta) internal pure returns (uint96) {
        if (delta < 0) {
            return value - uint96(uint256(-delta));
        } else {
            return value + uint96(uint256(delta));
        }
    }

    /// @notice Checks that the `stakeUpdate` was valid at the given `blockNumber`
    function _validateStakeUpdateAtBlockNumber(
        StakeUpdate memory stakeUpdate,
        uint32 blockNumber
    ) internal pure {
        /**
         * Check that the update is valid for the given blockNumber:
         * - blockNumber should be >= the update block number
         * - the next update block number should be either 0 or strictly greater than blockNumber
         */
        require(
            blockNumber >= stakeUpdate.updateBlockNumber,
            "StakeRegistry._validateStakeUpdateAtBlockNumber: stakeUpdate is from after blockNumber"
        );
        require(
            stakeUpdate.nextUpdateBlockNumber == 0 || blockNumber < stakeUpdate.nextUpdateBlockNumber,
            "StakeRegistry._validateStakeUpdateAtBlockNumber: there is a newer stakeUpdate available before blockNumber"
        );
    }

    /**
     * @notice This function computes the total weight of the @param operator in the quorum @param quorumNumber.
     * @dev this method DOES NOT check that the quorum exists
     * @return `uint96` The weighted sum of the operator's shares across each strategy considered by the quorum
     * @return `bool` True if the operator meets the quorum's minimum stake
     */
    function _weightOfOperatorForQuorum(uint8 quorumNumber, address operator) internal virtual view returns (uint96, bool) {
        uint96 weight;
        uint256 stratsLength = strategyParamsLength(quorumNumber);
        StrategyParams memory strategyAndMultiplier;

        uint256[] memory strategyShares = delegation.getOperatorShares(operator, strategiesPerQuorum[quorumNumber]);
        for (uint256 i = 0; i < stratsLength; i++) {
            // accessing i^th StrategyParams struct for the quorumNumber
            strategyAndMultiplier = strategyParams[quorumNumber][i];

            // add the weight from the shares for this strategy to the total weight
            if (strategyShares[i] > 0) {
                weight += uint96(strategyShares[i] * strategyAndMultiplier.multiplier / WEIGHTING_DIVISOR);
            }
        }

        // Return the weight, and `true` if the operator meets the quorum's minimum stake
        bool hasMinimumStake = weight >= minimumStakeForQuorum[quorumNumber];
        return (weight, hasMinimumStake);
    }

    /// @notice Returns `true` if the quorum has been initialized
    function _quorumExists(uint8 quorumNumber) internal view returns (bool) {
        return _totalStakeHistory[quorumNumber].length != 0;
    }

    /*******************************************************************************
                            VIEW FUNCTIONS
    *******************************************************************************/

    /**
     * @notice This function computes the total weight of the @param operator in the quorum @param quorumNumber.
     * @dev reverts if the quorum does not exist
     */
    function weightOfOperatorForQuorum(
        uint8 quorumNumber, 
        address operator
    ) public virtual view quorumExists(quorumNumber) returns (uint96) {
        (uint96 stake, ) = _weightOfOperatorForQuorum(quorumNumber, operator);
        return stake;
    }

    /// @notice Returns the length of the dynamic array stored in `strategyParams[quorumNumber]`.
    function strategyParamsLength(uint8 quorumNumber) public view returns (uint256) {
        return strategyParams[quorumNumber].length;
    }

    /// @notice Returns the strategy and weight multiplier for the `index`'th strategy in the quorum `quorumNumber`
    function strategyParamsByIndex(
        uint8 quorumNumber, 
        uint256 index
    ) public view returns (StrategyParams memory)
    {
        return strategyParams[quorumNumber][index];
    }

    /*******************************************************************************
                      VIEW FUNCTIONS - Operator Stake History
    *******************************************************************************/

    /**
     * @notice Returns the length of an operator's stake history for the given quorum
     */
    function getStakeHistoryLength(
        bytes32 operatorId,
        uint8 quorumNumber
    ) external view returns (uint256) {
        return operatorStakeHistory[operatorId][quorumNumber].length;
    }

    /**
     * @notice Returns the entire `operatorStakeHistory[operatorId][quorumNumber]` array.
     * @param operatorId The id of the operator of interest.
     * @param quorumNumber The quorum number to get the stake for.
     */
    function getStakeHistory(
        bytes32 operatorId, 
        uint8 quorumNumber
    ) external view returns (StakeUpdate[] memory) {
        return operatorStakeHistory[operatorId][quorumNumber];
    }

    /**
     * @notice Returns the most recent stake weight for the `operatorId` for quorum `quorumNumber`
     * @dev Function returns weight of **0** in the event that the operator has no stake history
     */
    function getCurrentStake(bytes32 operatorId, uint8 quorumNumber) external view returns (uint96) {
        StakeUpdate memory operatorStakeUpdate = getLatestStakeUpdate(operatorId, quorumNumber);
        return operatorStakeUpdate.stake;
    }

    /**
     * @notice Returns the most recent stake weight for the `operatorId` for a certain quorum
     * @dev Function returns an StakeUpdate struct with **every entry equal to 0** in the event that the operator has no stake history
     */
    function getLatestStakeUpdate(
        bytes32 operatorId,
        uint8 quorumNumber
    ) public view returns (StakeUpdate memory) {
        uint256 historyLength = operatorStakeHistory[operatorId][quorumNumber].length;
        StakeUpdate memory operatorStakeUpdate;
        if (historyLength == 0) {
            return operatorStakeUpdate;
        } else {
            operatorStakeUpdate = operatorStakeHistory[operatorId][quorumNumber][historyLength - 1];
            return operatorStakeUpdate;
        }
    }

    /**
     * @notice Returns the `index`-th entry in the `operatorStakeHistory[operatorId][quorumNumber]` array.
     * @param quorumNumber The quorum number to get the stake for.
     * @param operatorId The id of the operator of interest.
     * @param index Array index for lookup, within the dynamic array `operatorStakeHistory[operatorId][quorumNumber]`.
     * @dev Function will revert if `index` is out-of-bounds.
     */
    function getStakeUpdateAtIndex(
        uint8 quorumNumber,
        bytes32 operatorId,
        uint256 index
    ) external view returns (StakeUpdate memory) {
        return operatorStakeHistory[operatorId][quorumNumber][index];
    }

    /// @notice Returns the stake of the operator for the provided `quorumNumber` at the given `blockNumber`
    function getStakeAtBlockNumber(
        bytes32 operatorId,
        uint8 quorumNumber,
        uint32 blockNumber
    ) external view returns (uint96) {
        return
            operatorStakeHistory[operatorId][quorumNumber][
                _getStakeUpdateIndexForOperatorAtBlockNumber(operatorId, quorumNumber, blockNumber)
            ].stake;
    }

    /// @notice Returns the indices of the operator stakes for the provided `quorumNumber` at the given `blockNumber`
    function getStakeUpdateIndexAtBlockNumber(
        bytes32 operatorId,
        uint8 quorumNumber,
        uint32 blockNumber
    ) external view returns (uint32) {
        return _getStakeUpdateIndexForOperatorAtBlockNumber(operatorId, quorumNumber, blockNumber);
    }

    /**
     * @notice Returns the stake weight corresponding to `operatorId` for quorum `quorumNumber`, at the
     * `index`-th entry in the `operatorStakeHistory[operatorId][quorumNumber]` array if it was the operator's
     * stake at `blockNumber`. Reverts otherwise.
     * @param quorumNumber The quorum number to get the stake for.
     * @param operatorId The id of the operator of interest.
     * @param index Array index for lookup, within the dynamic array `operatorStakeHistory[operatorId][quorumNumber]`.
     * @param blockNumber Block number to make sure the stake is from.
     * @dev Function will revert if `index` is out-of-bounds.
     */
    function getStakeAtBlockNumberAndIndex(
        uint8 quorumNumber,
        uint32 blockNumber,
        bytes32 operatorId,
        uint256 index
    ) external view returns (uint96) {
        StakeUpdate memory operatorStakeUpdate = operatorStakeHistory[operatorId][quorumNumber][index];
        _validateStakeUpdateAtBlockNumber(operatorStakeUpdate, blockNumber);
        return operatorStakeUpdate.stake;
    }

    /*******************************************************************************
                        VIEW FUNCTIONS - Total Stake History
    *******************************************************************************/

    /**
     * @notice Returns the length of the total stake history for the given quorum
     */
    function getTotalStakeHistoryLength(uint8 quorumNumber) external view returns (uint256) {
        return _totalStakeHistory[quorumNumber].length;
    }

    /**
     * @notice Returns the stake weight from the latest entry in `_totalStakeHistory` for quorum `quorumNumber`.
     * @dev Will revert if `_totalStakeHistory[quorumNumber]` is empty.
     */
    function getCurrentTotalStake(uint8 quorumNumber) external view returns (uint96) {
        return _totalStakeHistory[quorumNumber][_totalStakeHistory[quorumNumber].length - 1].stake;
    }

    /**
     * @notice Returns the `index`-th entry in the dynamic array of total stake, `_totalStakeHistory` for quorum `quorumNumber`.
     * @param quorumNumber The quorum number to get the stake for.
     * @param index Array index for lookup, within the dynamic array `_totalStakeHistory[quorumNumber]`.
     */
    function getTotalStakeUpdateAtIndex(
        uint8 quorumNumber,
        uint256 index
    ) external view returns (StakeUpdate memory) {
        return _totalStakeHistory[quorumNumber][index];
    } 

    /**
     * @notice Returns the total stake weight for quorum `quorumNumber`, at the `index`-th entry in the
     * `_totalStakeHistory[quorumNumber]` array if it was the stake at `blockNumber`. Reverts otherwise.
     * @param quorumNumber The quorum number to get the stake for.
     * @param index Array index for lookup, within the dynamic array `_totalStakeHistory[quorumNumber]`.
     * @param blockNumber Block number to make sure the stake is from.
     * @dev Function will revert if `index` is out-of-bounds.
     */
    function getTotalStakeAtBlockNumberFromIndex(
        uint8 quorumNumber,
        uint32 blockNumber,
        uint256 index
    ) external view returns (uint96) {
        StakeUpdate memory totalStakeUpdate = _totalStakeHistory[quorumNumber][index];
        _validateStakeUpdateAtBlockNumber(totalStakeUpdate, blockNumber);
        return totalStakeUpdate.stake;
    }

    /**
     * @notice Returns the indices of the total stakes for the provided `quorumNumbers` at the given `blockNumber`
     * @param blockNumber Block number to retrieve the stake indices from.
     * @param quorumNumbers The quorum numbers to get the stake indices for.
     * @dev Function will revert if there are no indices for the given `blockNumber`
     */
    function getTotalStakeIndicesAtBlockNumber(
        uint32 blockNumber,
        bytes calldata quorumNumbers
    ) external view returns (uint32[] memory) {
        uint32[] memory indices = new uint32[](quorumNumbers.length);
        for (uint256 i = 0; i < quorumNumbers.length; i++) {
            uint8 quorumNumber = uint8(quorumNumbers[i]);
            require(_quorumExists(quorumNumber), "StakeRegistry.getTotalStakeIndicesAtBlockNumber: quorum does not exist");
            require(
                _totalStakeHistory[quorumNumber][0].updateBlockNumber <= blockNumber,
                "StakeRegistry.getTotalStakeIndicesAtBlockNumber: quorum has no stake history at blockNumber"
            );
            uint256 length = _totalStakeHistory[quorumNumber].length;
            for (uint256 j = 0; j < length; j++) {
                if (_totalStakeHistory[quorumNumber][length - j - 1].updateBlockNumber <= blockNumber) {
                    indices[i] = uint32(length - j - 1);
                    break;
                }
            }
        }
        return indices;
    }
}