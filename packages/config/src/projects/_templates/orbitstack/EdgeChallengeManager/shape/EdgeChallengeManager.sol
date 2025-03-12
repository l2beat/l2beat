// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");

        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly
                /// @solidity memory-safe-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

library ChallengeEdgeLib {
    /// @notice Common checks to do when adding an edge
    function newEdgeChecks(
        bytes32 originId,
        bytes32 startHistoryRoot,
        uint256 startHeight,
        bytes32 endHistoryRoot,
        uint256 endHeight
    ) internal pure {
        if (originId == 0) {
            revert EmptyOriginId();
        }
        if (endHeight <= startHeight) {
            revert InvalidHeights(startHeight, endHeight);
        }
        if (startHistoryRoot == 0) {
            revert EmptyStartRoot();
        }
        if (endHistoryRoot == 0) {
            revert EmptyEndRoot();
        }
    }

    /// @notice Create a new layer zero edge. These edges make claims about length one edges in the level
    ///         below. Creating a layer zero edge also requires placing a mini stake, so information
    ///         about that staker is also stored on this edge.
    function newLayerZeroEdge(
        bytes32 originId,
        bytes32 startHistoryRoot,
        uint256 startHeight,
        bytes32 endHistoryRoot,
        uint256 endHeight,
        bytes32 claimId,
        address staker,
        uint8 level
    ) internal view returns (ChallengeEdge memory) {
        if (staker == address(0)) {
            revert EmptyStaker();
        }
        if (claimId == 0) {
            revert EmptyClaimId();
        }

        newEdgeChecks(originId, startHistoryRoot, startHeight, endHistoryRoot, endHeight);

        return ChallengeEdge({
            originId: originId,
            startHeight: startHeight,
            startHistoryRoot: startHistoryRoot,
            endHeight: endHeight,
            endHistoryRoot: endHistoryRoot,
            lowerChildId: 0,
            upperChildId: 0,
            createdAtBlock: uint64(block.number),
            claimId: claimId,
            staker: staker,
            status: EdgeStatus.Pending,
            level: level,
            refunded: false,
            confirmedAtBlock: 0,
            totalTimeUnrivaledCache: 0
        });
    }

    /// @notice Creates a new child edge. All edges except layer zero edges are child edges.
    ///         These are edges that are created by bisection, and have parents rather than claims.
    function newChildEdge(
        bytes32 originId,
        bytes32 startHistoryRoot,
        uint256 startHeight,
        bytes32 endHistoryRoot,
        uint256 endHeight,
        uint8 level
    ) internal view returns (ChallengeEdge memory) {
        newEdgeChecks(originId, startHistoryRoot, startHeight, endHistoryRoot, endHeight);

        return ChallengeEdge({
            originId: originId,
            startHeight: startHeight,
            startHistoryRoot: startHistoryRoot,
            endHeight: endHeight,
            endHistoryRoot: endHistoryRoot,
            lowerChildId: 0,
            upperChildId: 0,
            createdAtBlock: uint64(block.number),
            claimId: 0,
            staker: address(0),
            status: EdgeStatus.Pending,
            level: level,
            refunded: false,
            confirmedAtBlock: 0,
            totalTimeUnrivaledCache: 0
        });
    }

    /// @notice The "mutualId" of an edge. A mutual id is a hash of all the data that is shared by rivals.
    ///         Rivals have the same start height, start history root and end height. They also have the same origin id and level.
    ///         The difference between rivals is that they have a different endHistoryRoot, so that information
    ///         is not included in this hash.
    function mutualIdComponent(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight
    ) internal pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(level, originId, startHeight, startHistoryRoot, endHeight));
    }

    /// @notice The "mutualId" of an edge. A mutual id is a hash of all the data that is shared by rivals.
    ///         Rivals have the same start height, start history root and end height. They also have the same origin id and level.
    ///         The difference between rivals is that they have a different endHistoryRoot, so that information
    ///         is not included in this hash.
    function mutualId(
        ChallengeEdge storage ce
    ) internal view returns (bytes32) {
        return mutualIdComponent(
            ce.level, ce.originId, ce.startHeight, ce.startHistoryRoot, ce.endHeight
        );
    }

    function mutualIdMem(
        ChallengeEdge memory ce
    ) internal pure returns (bytes32) {
        return mutualIdComponent(
            ce.level, ce.originId, ce.startHeight, ce.startHistoryRoot, ce.endHeight
        );
    }

    /// @notice The id of an edge. Edges are uniquely identified by their id, and commit to the same information
    function idComponent(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight,
        bytes32 endHistoryRoot
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                mutualIdComponent(level, originId, startHeight, startHistoryRoot, endHeight),
                endHistoryRoot
            )
        );
    }

    /// @notice The id of an edge. Edges are uniquely identified by their id, and commit to the same information
    /// @dev    This separate idMem method is to be explicit about when ChallengeEdges are copied into memory. It is
    ///         possible to pass a storage edge to this method and the id be computed correctly, but that would load
    ///         the whole struct into memory, so we're explicit here that this should be used for edges already in memory.
    function idMem(
        ChallengeEdge memory edge
    ) internal pure returns (bytes32) {
        return idComponent(
            edge.level,
            edge.originId,
            edge.startHeight,
            edge.startHistoryRoot,
            edge.endHeight,
            edge.endHistoryRoot
        );
    }

    /// @notice The id of an edge. Edges are uniquely identified by their id, and commit to the same information
    function id(
        ChallengeEdge storage edge
    ) internal view returns (bytes32) {
        return idComponent(
            edge.level,
            edge.originId,
            edge.startHeight,
            edge.startHistoryRoot,
            edge.endHeight,
            edge.endHistoryRoot
        );
    }

    /// @notice Does this edge exist in storage
    function exists(
        ChallengeEdge storage edge
    ) internal view returns (bool) {
        // All edges have a createdAtBlock number
        return edge.createdAtBlock != 0;
    }

    /// @notice The length of this edge - difference between the start and end heights
    function length(
        ChallengeEdge storage edge
    ) internal view returns (uint256) {
        uint256 len = edge.endHeight - edge.startHeight;
        // It's impossible for a zero length edge to exist
        if (len == 0) {
            revert EdgeNotExists(ChallengeEdgeLib.id(edge));
        }
        return len;
    }

    /// @notice Set the children of an edge
    /// @dev    Children can only be set once
    function setChildren(
        ChallengeEdge storage edge,
        bytes32 lowerChildId,
        bytes32 upperChildId
    ) internal {
        if (edge.lowerChildId != 0 || edge.upperChildId != 0) {
            revert ChildrenAlreadySet(
                ChallengeEdgeLib.id(edge), edge.lowerChildId, edge.upperChildId
            );
        }
        edge.lowerChildId = lowerChildId;
        edge.upperChildId = upperChildId;
    }

    /// @notice Set the status of an edge to Confirmed
    /// @dev    Only Pending edges can be confirmed
    function setConfirmed(
        ChallengeEdge storage edge
    ) internal {
        if (edge.status != EdgeStatus.Pending) {
            revert EdgeNotPending(ChallengeEdgeLib.id(edge), edge.status);
        }
        edge.status = EdgeStatus.Confirmed;
        edge.confirmedAtBlock = uint64(block.number);
    }

    /// @notice Is the edge a layer zero edge.
    function isLayerZero(
        ChallengeEdge storage edge
    ) internal view returns (bool) {
        return edge.claimId != 0 && edge.staker != address(0);
    }

    /// @notice Set the refunded flag of an edge
    /// @dev    Checks internally that edge is confirmed, layer zero edge and hasnt been refunded already
    function setRefunded(
        ChallengeEdge storage edge
    ) internal {
        if (edge.status != EdgeStatus.Confirmed) {
            revert EdgeNotConfirmed(ChallengeEdgeLib.id(edge), edge.status);
        }
        if (!isLayerZero(edge)) {
            revert EdgeNotLayerZero(ChallengeEdgeLib.id(edge), edge.staker, edge.claimId);
        }
        if (edge.refunded == true) {
            revert EdgeAlreadyRefunded(ChallengeEdgeLib.id(edge));
        }

        edge.refunded = true;
    }

    /// @notice Returns the edge type for a given level, given the total number of big step levels
    function levelToType(
        uint8 level,
        uint8 numBigStepLevels
    ) internal pure returns (EdgeType eType) {
        if (level == 0) {
            return EdgeType.Block;
        } else if (level <= numBigStepLevels) {
            return EdgeType.BigStep;
        } else if (level == numBigStepLevels + 1) {
            return EdgeType.SmallStep;
        } else {
            revert LevelTooHigh(level, numBigStepLevels);
        }
    }
}

library GlobalStateLib {
    using GlobalStateLib for GlobalState;

    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "Global state:",
                state.bytes32Vals[0],
                state.bytes32Vals[1],
                state.u64Vals[0],
                state.u64Vals[1]
            )
        );
    }

    function getBlockHash(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(
        GlobalState memory state
    ) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(
        GlobalState memory state
    ) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(
        GlobalState calldata state
    ) internal pure returns (bool) {
        return (
            state.bytes32Vals[0] == bytes32(0) && state.bytes32Vals[1] == bytes32(0)
                && state.u64Vals[0] == 0 && state.u64Vals[1] == 0
        );
    }

    function comparePositions(
        GlobalState calldata a,
        GlobalState calldata b
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        uint64 bPos = b.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            uint64 aMsg = a.getPositionInMessage();
            uint64 bMsg = b.getPositionInMessage();
            if (aMsg < bMsg) {
                return -1;
            } else if (aMsg > bMsg) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    function comparePositionsAgainstStartOfBatch(
        GlobalState calldata a,
        uint256 bPos
    ) internal pure returns (int256) {
        uint64 aPos = a.getInboxPosition();
        if (aPos < bPos) {
            return -1;
        } else if (aPos > bPos) {
            return 1;
        } else {
            if (a.getPositionInMessage() > 0) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}

struct ExecutionState {
    GlobalState globalState;
    MachineStatus machineStatus;
}

library AssertionStateLib {
    function toExecutionState(
        AssertionState memory state
    ) internal pure returns (ExecutionState memory) {
        return ExecutionState(state.globalState, state.machineStatus);
    }

    function hash(
        AssertionState memory state
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(state));
    }
}

struct EdgeAddedData {
    bytes32 edgeId;
    bytes32 mutualId;
    bytes32 originId;
    bytes32 claimId;
    uint256 length;
    uint8 level;
    bool hasRival;
    bool isLayerZero;
}

struct AssertionReferenceData {
    /// @notice The id of the assertion - will be used in a sanity check
    bytes32 assertionHash;
    /// @notice The predecessor of the assertion
    bytes32 predecessorId;
    /// @notice Is the assertion pending
    bool isPending;
    /// @notice Does the assertion have a sibling
    bool hasSibling;
    /// @notice The execution state of the predecessor assertion
    AssertionState startState;
    /// @notice The execution state of the assertion being claimed
    AssertionState endState;
}

struct ProofData {
    /// @notice The first state being committed to by an edge
    bytes32 startState;
    /// @notice The last state being committed to by an edge
    bytes32 endState;
    /// @notice A proof that the end state is included in the edge
    bytes32[] inclusionProof;
}

library ArrayUtilsLib {
    /// @notice Append an item to the end of an array
    /// @param arr      The array to append to
    /// @param newItem  The item to append
    function append(
        bytes32[] memory arr,
        bytes32 newItem
    ) internal pure returns (bytes32[] memory) {
        bytes32[] memory clone = new bytes32[](arr.length + 1);
        for (uint256 i = 0; i < arr.length; i++) {
            clone[i] = arr[i];
        }
        clone[clone.length - 1] = newItem;
        return clone;
    }

    /// @notice Get a slice of an existing array
    /// @dev    End index exlusive so slice(arr, 0, 5) gets the first 5 elements of arr
    /// @param arr          Array to slice
    /// @param startIndex   The start index of the slice in the original array - inclusive
    /// @param endIndex     The end index of the slice in the original array - exlusive
    function slice(
        bytes32[] memory arr,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (bytes32[] memory) {
        require(startIndex < endIndex, "Start not less than end");
        require(endIndex <= arr.length, "End not less or equal than length");

        bytes32[] memory newArr = new bytes32[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            newArr[i - startIndex] = arr[i];
        }
        return newArr;
    }

    /// @notice Concatenated to arrays
    /// @param arr1 First array
    /// @param arr1 Second array
    function concat(
        bytes32[] memory arr1,
        bytes32[] memory arr2
    ) internal pure returns (bytes32[] memory) {
        bytes32[] memory full = new bytes32[](arr1.length + arr2.length);
        for (uint256 i = 0; i < arr1.length; i++) {
            full[i] = arr1[i];
        }
        for (uint256 i = 0; i < arr2.length; i++) {
            full[arr1.length + i] = arr2[i];
        }
        return full;
    }
}

library MerkleLib {
    function generateRoot(
        bytes32[] memory _hashes
    ) internal pure returns (bytes32) {
        bytes32[] memory prevLayer = _hashes;
        while (prevLayer.length > 1) {
            bytes32[] memory nextLayer = new bytes32[]((prevLayer.length + 1) / 2);
            for (uint256 i = 0; i < nextLayer.length; i++) {
                if (2 * i + 1 < prevLayer.length) {
                    nextLayer[i] =
                        keccak256(abi.encodePacked(prevLayer[2 * i], prevLayer[2 * i + 1]));
                } else {
                    nextLayer[i] = prevLayer[2 * i];
                }
            }
            prevLayer = nextLayer;
        }
        return prevLayer[0];
    }

    function calculateRoot(
        bytes32[] memory nodes,
        uint256 route,
        bytes32 item
    ) internal pure returns (bytes32) {
        uint256 proofItems = nodes.length;
        if (proofItems > 256) revert MerkleProofTooLong(proofItems, 256);
        bytes32 h = item;
        for (uint256 i = 0; i < proofItems;) {
            bytes32 node = nodes[i];
            if ((route & (1 << i)) == 0) {
                assembly {
                    mstore(0x00, h)
                    mstore(0x20, node)
                    h := keccak256(0x00, 0x40)
                }
            } else {
                assembly {
                    mstore(0x00, node)
                    mstore(0x20, h)
                    h := keccak256(0x00, 0x40)
                }
            }
            unchecked {
                ++i;
            }
        }
        return h;
    }
}

library MerkleTreeAccumulatorLib {
    // the go code uses uint64, so we ensure we never go above that here
    uint256 public constant MAX_LEVEL = 64;

    /// @notice The accumulator root of the a merkle expansion.
    /// @dev    The accumulator root is defined as the cumulative hashing of the
    ///         roots of all of its subtrees. Throws error for an empty merkle expansion
    /// @param me   The merkle expansion to calculate the root of
    function root(
        bytes32[] memory me
    ) internal pure returns (bytes32) {
        require(me.length > 0, "Empty merkle expansion");
        require(me.length <= MAX_LEVEL, "Merkle expansion too large");

        bytes32 accum = 0;
        for (uint256 i = 0; i < me.length; i++) {
            bytes32 val = me[i];
            if (accum == 0) {
                if (val != 0) {
                    accum = val;

                    // the tree is balanced if the only non zero entry in the merkle extension
                    // is the last entry
                    // otherwise the lowest level entry needs to be combined with a zero to balance the bottom
                    // level, after which zeros in the merkle extension above that will balance the rest
                    if (i != me.length - 1) {
                        accum = keccak256(abi.encodePacked(accum, bytes32(0)));
                    }
                }
            } else if (val != 0) {
                // accum represents the smaller sub trees, since it is earlier in the expansion
                // we put the larger subtrees on the left
                accum = keccak256(abi.encodePacked(val, accum));
            } else {
                // by definition we always complete trees by appending zeros to the right
                accum = keccak256(abi.encodePacked(accum, bytes32(0)));
            }
        }

        return accum;
    }

    /// @notice Append a complete subtree to an existing accumulator
    /// @dev    See above description of the accumulator for rules on how appending can occur.
    ///         Briefly, appending works like binary addition only that the value being added must be an
    ///         exact power of two (complete), and must equal to or less than the least significant bit
    ///         in the existing tree.
    ///         If the me is empty, will just append directly.
    /// @param me           The merkle expansion to append a complete sub tree to
    /// @param level        The level at which to append the complete subtree
    /// @param subtreeRoot  The root of the complete subtree to be appended
    function appendCompleteSubTree(
        bytes32[] memory me,
        uint256 level,
        bytes32 subtreeRoot
    ) internal pure returns (bytes32[] memory) {
        // we use number representations of the levels elsewhere, so we need to ensure we're appending a leve
        // that's too high to use in uint
        require(level < MAX_LEVEL, "Level too high");
        require(subtreeRoot != 0, "Cannot append empty subtree");
        require(me.length <= MAX_LEVEL, "Merkle expansion too large");

        if (me.length == 0) {
            bytes32[] memory empty = new bytes32[](level + 1);
            empty[level] = subtreeRoot;
            return empty;
        }

        // This technically isn't necessary since it would be caught by the i < level check
        // on the last loop of the for-loop below, but we add it for a clearer error message
        require(level < me.length, "Level greater than highest level of current expansion");

        bytes32 accumHash = subtreeRoot;
        uint256 meSize = treeSize(me);
        uint256 postSize = meSize + 2 ** level;

        // if by appending the sub tree we increase the numbe of most sig bits of the size, that means
        // we'll need more space in the expansion to describe the tree, so we enlarge by one
        bytes32[] memory next = UintUtilsLib.mostSignificantBit(postSize)
            > UintUtilsLib.mostSignificantBit(meSize)
            ? new bytes32[](me.length + 1)
            : new bytes32[](me.length);

        // ensure we're never creating an expansion that's too big
        require(next.length <= MAX_LEVEL, "Append creates oversize tree");

        // loop through all the levels in self and try to append the new subtree
        // since each node has two children by appending a subtree we may complete another one
        // in the level above. So we move through the levels updating the result at each level
        for (uint256 i = 0; i < me.length; i++) {
            // we can only append at the level of the smallest complete sub tree or below
            // appending above this level would mean create "holes" in the tree
            // we can find the smallest complete sub tree by looking for the first entry in the merkle expansion
            if (i < level) {
                // we're below the level we want to append - no complete sub trees allowed down here
                // if the level is 0 there are no complete subtrees, and we therefore cannot be too low
                require(me[i] == 0, "Append above least significant bit");
            } else {
                // we're at or above the level
                if (accumHash == 0) {
                    // no more changes to propagate upwards - just fill the tree
                    next[i] = me[i];
                } else {
                    // we have a change to propagate
                    if (me[i] == 0) {
                        // if the level is currently empty we can just add the change
                        next[i] = accumHash;
                        // and then there's nothing more to propagate
                        accumHash = 0;
                    } else {
                        // if the level is not currently empty then we combine it with propagation
                        // change, and propagate that to the level above. This level is now part of a complete subtree
                        // so we zero it out
                        next[i] = 0;
                        accumHash = keccak256(abi.encodePacked(me[i], accumHash));
                    }
                }
            }
        }

        // we had a final change to propagate above the existing highest complete sub tree
        // so we have a new highest complete sub tree in the level above - this was why we
        // increased the storeage above
        if (accumHash != 0) {
            next[next.length - 1] = accumHash;
        }

        // it should never be possible to achieve this ever we sized the array correctly
        // so this is just a sanity check
        require(next[next.length - 1] != 0, "Last entry zero");

        return next;
    }

    /// @notice Append a leaf to a merkle expansion
    /// @dev    Leaves are just complete subtrees at level 0, however we hash the leaf before putting it
    ///         into the tree to avoid root collisions.
    /// @param me   The merkle expansion to append a leaf to
    /// @param leaf The leaf to append - will be hashed in here before appending
    function appendLeaf(
        bytes32[] memory me,
        bytes32 leaf
    ) internal pure returns (bytes32[] memory) {
        // it's important that we hash the leaf, this ensures that this leaf cannot be a collision with any other non leaf
        // or root node, since these are always the hash of 64 bytes of data, and we're hashing 32 bytes
        return appendCompleteSubTree(me, 0, keccak256(abi.encodePacked(leaf)));
    }

    /// @notice Find the highest level which can be appended to an accumulator of size startSize without
    ///         creating a tree with size greater than end size (inclusive)
    /// @dev    Subtrees can only be appended according to certain rules, see tree description at top of file
    ///         for details. A subtree can only be appended if it is at the same level, or below, the current lowest
    ///         subtree in the expansion
    /// @param startSize    The size of the start tree to find the maximum append to
    /// @param endSize      The size of the end tree to find a maximum append under
    function maximumAppendBetween(
        uint256 startSize,
        uint256 endSize
    ) internal pure returns (uint256) {
        // The accumulator can be represented in the same way as a binary representation of a number
        // As described above, subtrees can only be appended to a tree if they are at the same level, or below,
        // the current lowest subtree.
        // In this function we want to find the level of the highest tree that can be appended to the current
        // accumulator, without the resulting accumulator size surpassing the end point. We do this by looking at the difference
        // between the start and end size, and iteratively reducing it in the maximal way.

        // The start and end size will share some higher order bits, below that they differ, and it is this
        // difference that we need to fill in the minimum number of appends
        // startSize looks like: xxxxxxyyyy
        // endSize looks like:   xxxxxxzzzz
        // where x are the complete sub trees they share, and y and z are the subtrees they dont

        require(startSize < endSize, "Start not less than end");

        // remove the high order bits that are shared
        uint256 msb = UintUtilsLib.mostSignificantBit(startSize ^ endSize);
        uint256 mask = (1 << (msb) + 1) - 1;
        uint256 y = startSize & mask;
        uint256 z = endSize & mask;

        // Since in the verification we will be appending at start size, the highest level at which we
        // can append is the lowest complete subtree - the least significant bit
        if (y != 0) {
            return UintUtilsLib.leastSignificantBit(y);
        }

        // y == 0, therefore we can append at any of levels where start and end differ
        // The highest level that we can append at without surpassing the end, is the most significant
        // bit of the end
        if (z != 0) {
            return UintUtilsLib.mostSignificantBit(z);
        }

        // since we enforce that start < end, we know that y and z cannot both be 0
        revert("Both y and z cannot be zero");
    }

    /// @notice Calculate the full tree size represented by a merkle expansion
    /// @param me   The merkle expansion to calculate the tree size of
    function treeSize(
        bytes32[] memory me
    ) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < me.length; i++) {
            if (me[i] != 0) {
                sum += 2 ** i;
            }
        }
        return sum;
    }

    /// @notice Verify that a pre-accumulator-root commits to a prefix of the leaves committed by a post-accumulator-root
    /// @dev    Verifies by appending sub trees to the pre accumulator until we get to the size of the post accumulator
    ///         and then checking that the root of the calculated post accumulator is equal to the supplied one
    /// @param preRoot      The root of the accumulator which is a prefix of the post accumulator
    /// @param preSize      The size of the pre-accumulator
    /// @param postRoot     The root the post-accumulator - the accumulator which we're proving pre is a prefix of
    /// @param postSize     The size of the post-accumulator
    /// @param preExpansion The merkle expansion of the pre-accumulator
    /// @param proof        The proof is the minimum set of complete subtree hashes that can be appended to
    ///                     the accumulator-tree in order to form the post accumulator
    ///                     The first entry in the proof will be appended at the level of the first non-zero entry in the pre-expansion.
    ///                     The second entry will then be appended to the the first non zero entry in the resulting expansion and so on, until
    ///                     appending a sub tree will create a tree of greater that the post size. Then, starting at the highest level,
    ///                     the next entry in the proof is attempted to be appended to the expansion, but the result is only accepted if has a size
    ///                     less than or equal the post-size. This continues until all proof entries have been used up.
    ///                     The resulting expansion is then checked to see if it equals the provided post-root
    function verifyPrefixProof(
        bytes32 preRoot,
        uint256 preSize,
        bytes32 postRoot,
        uint256 postSize,
        bytes32[] memory preExpansion,
        bytes32[] memory proof
    ) internal pure {
        require(preSize > 0, "Pre-size cannot be 0");
        require(root(preExpansion) == preRoot, "Pre expansion root mismatch");
        require(treeSize(preExpansion) == preSize, "Pre size does not match expansion");
        require(preSize < postSize, "Pre size not less than post size");

        uint256 size = preSize;
        uint256 proofIndex = 0;
        // we clone here to avoid mutating the input arguments
        // which could be unexpected for callers
        bytes32[] memory exp = ArrayUtilsLib.slice(preExpansion, 0, preExpansion.length);

        // Iteratively append a tree at the maximum possible level until we get to the post size
        while (size < postSize) {
            uint256 level = maximumAppendBetween(size, postSize);

            require(proofIndex < proof.length, "Index out of range");
            exp = appendCompleteSubTree(exp, level, proof[proofIndex]);

            uint256 numLeaves = 1 << level;
            size += numLeaves;
            assert(size <= postSize);
            proofIndex++;
        }

        // Check that the calculated root is equal to the provided post root
        require(root(exp) == postRoot, "Post expansion root not equal post");

        // ensure that we consumed the full proof
        // this is just a safety check to guard against mistakenly supplied args
        require(proofIndex == proof.length, "Incomplete proof usage");
    }

    /// @notice Using the provided proof verify that the provided leaf is included in the roothash of a complete tree at
    ///         the specified index. Note that here we use a 0-indexed value for the leaf number, whereas
    ///         elsewhere we use size.
    /// @param rootHash The root hash to prove inclusion in
    /// @param leaf     The leaf preimage to prove inclusion - will be hashed in here before checking inclusion
    /// @param index    The index of the leaf in the tree
    /// @param proof    The path from the leaf to the root
    function verifyInclusionProof(
        bytes32 rootHash,
        bytes32 leaf,
        uint256 index,
        bytes32[] memory proof
    ) internal pure {
        bytes32 calculatedRoot =
            MerkleLib.calculateRoot(proof, index, keccak256(abi.encodePacked(leaf)));
        require(rootHash == calculatedRoot, "Invalid inclusion proof");
    }
}

library UintUtilsLib {
    /// @notice The least significant bit in the bit representation of a uint
    /// @dev    Zero indexed from the least sig bit. Eg 1010 => 1, 1100 => 2, 1001 => 0
    ///         Finds lsb in linear (uint size) time
    /// @param x Cannot be zero, since zero that has no signficant bits
    function leastSignificantBit(
        uint256 x
    ) internal pure returns (uint256 msb) {
        require(x > 0, "Zero has no significant bits");

        // isolate the least sig bit
        uint256 isolated = ((x - 1) & x) ^ x;

        // since we removed all higher bits, least sig == most sig
        return mostSignificantBit(isolated);
    }

    /// @notice The most significant bit in the bit representation of a uint
    /// @dev    Zero indexed from the least sig bit. Eg 1010 => 3, 110 => 2, 1 => 0
    ///         Taken from https://solidity-by-example.org/bitwise/
    ///         Finds msb in log (uint size) time
    /// @param x Cannot be zero, since zero has no sigificant bits
    function mostSignificantBit(
        uint256 x
    ) internal pure returns (uint256 msb) {
        require(x != 0, "Zero has no significant bits");

        // x >= 2 ** 128
        if (x >= 0x100000000000000000000000000000000) {
            x >>= 128;
            msb += 128;
        }
        // x >= 2 ** 64
        if (x >= 0x10000000000000000) {
            x >>= 64;
            msb += 64;
        }
        // x >= 2 ** 32
        if (x >= 0x100000000) {
            x >>= 32;
            msb += 32;
        }
        // x >= 2 ** 16
        if (x >= 0x10000) {
            x >>= 16;
            msb += 16;
        }
        // x >= 2 ** 8
        if (x >= 0x100) {
            x >>= 8;
            msb += 8;
        }
        // x >= 2 ** 4
        if (x >= 0x10) {
            x >>= 4;
            msb += 4;
        }
        // x >= 2 ** 2
        if (x >= 0x4) {
            x >>= 2;
            msb += 2;
        }
        // x >= 2 ** 1
        if (x >= 0x2) msb += 1;
    }
}

struct ExecutionContext {
    uint256 maxInboxMessagesRead;
    IBridge bridge;
    bytes32 initialWasmModuleRoot;
}

library EdgeChallengeManagerLib {
    using ChallengeEdgeLib for ChallengeEdge;
    using GlobalStateLib for GlobalState;
    using AssertionStateLib for AssertionState;

    /// @dev Magic string hash to represent that a edges with a given mutual id have no rivals
    bytes32 public constant UNRIVALED = keccak256(abi.encodePacked("UNRIVALED"));

    /// @notice Get an edge from the store
    /// @dev    Throws if the edge does not exist in the store
    /// @param store    The edge store to fetch an id from
    /// @param edgeId   The id of the edge to fetch
    function get(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (ChallengeEdge storage) {
        if (!store.edges[edgeId].exists()) {
            revert EdgeNotExists(edgeId);
        }
        return store.edges[edgeId];
    }

    /// @notice Gets an edge from the store without checking if it exists
    /// @dev    Useful where you already know the edge exists in the store - avoid a storage lookup
    /// @param store    The edge store to fetch an id from
    /// @param edgeId   The id of the edge to fetch
    function getNoCheck(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (ChallengeEdge storage) {
        return store.edges[edgeId];
    }

    /// @notice Adds a new edge to the store
    /// @dev    Updates first rival info for later use in calculating time unrivaled
    /// @param store    The store to add the edge to
    /// @param edge     The edge to add
    function add(
        EdgeStore storage store,
        ChallengeEdge memory edge
    ) internal returns (EdgeAddedData memory) {
        bytes32 eId = edge.idMem();
        // add the edge if it doesnt exist already
        if (store.edges[eId].exists()) {
            revert EdgeAlreadyExists(eId);
        }
        store.edges[eId] = edge;

        // edges that are rivals share the same mutual id
        // we use records of whether a mutual id has ever been added to decide if
        // the new edge is a rival. This will later allow us to calculate time an edge
        // stayed unrivaled
        bytes32 mutualId = ChallengeEdgeLib.mutualIdComponent(
            edge.level, edge.originId, edge.startHeight, edge.startHistoryRoot, edge.endHeight
        );
        bytes32 firstRival = store.firstRivals[mutualId];

        // the first time we add a mutual id we store a magic string hash against it
        // We do this to distinguish from there being no edges
        // with this mutual. And to distinguish it from the first rival, where we
        // will use an actual edge id so that we can look up the created when time
        // of the first rival, and use it for calculating time unrivaled
        if (firstRival == 0) {
            store.firstRivals[mutualId] = UNRIVALED;
        } else if (firstRival == UNRIVALED) {
            store.firstRivals[mutualId] = eId;
        } else {
            // after we've stored the first rival we dont need to keep a record of any
            // other rival edges - they will all have a zero time unrivaled
        }

        return EdgeAddedData(
            eId,
            mutualId,
            edge.originId,
            edge.claimId,
            store.edges[eId].length(),
            edge.level,
            firstRival != 0,
            edge.claimId != 0
        );
    }

    /// @notice Conduct checks that are specific to the edge type.
    /// @dev    Since different edge types also require different proofs, we also include the specific
    ///         proof parsing logic and return the common parts for later use.
    /// @param store                The store containing current edges
    /// @param args                 The edge creation args
    /// @param ard                  Data about the assertion data is is also need to when creating a Block edge type
    ///                             The created edge must be shown to be consistent with the states in the assertion chain
    ///                             Empty for non block edge type edges
    /// @param oneStepProofEntry    The one step proof contract that defines how machine states are hashed
    /// @return                     Data parsed from the proof, or fetched from elsewhere. Also the origin id for the edge to be created.
    function layerZeroTypeSpecificChecks(
        EdgeStore storage store,
        CreateEdgeArgs calldata args,
        AssertionReferenceData memory ard,
        IOneStepProofEntry oneStepProofEntry,
        uint8 numBigStepLevel
    ) private view returns (ProofData memory, bytes32) {
        if (ChallengeEdgeLib.levelToType(args.level, numBigStepLevel) == EdgeType.Block) {
            // origin id is the assertion which is the root of challenge
            // all rivals and their children share the same origin id - it is a link to the information
            // they agree on
            bytes32 originId = ard.predecessorId;

            // Sanity check: The assertion reference data should be related to the claim
            // Of course the caller can provide whatever args they wish, so this is really just a helpful
            // check to avoid mistakes
            if (ard.assertionHash == 0) {
                revert AssertionHashEmpty();
            }
            if (ard.assertionHash != args.claimId) {
                revert AssertionHashMismatch(ard.assertionHash, args.claimId);
            }

            // if the assertion is already confirmed or rejected then it cant be referenced as a claim
            if (!ard.isPending) {
                revert AssertionNotPending();
            }

            // if the claim doesnt have a sibling then it is undisputed, there's no need
            // to open challenge edges for it
            if (!ard.hasSibling) {
                revert AssertionNoSibling();
            }

            // parse the inclusion proof for later use
            if (args.proof.length == 0) {
                revert EmptyEdgeSpecificProof();
            }
            (bytes32[] memory inclusionProof,,) =
                abi.decode(args.proof, (bytes32[], AssertionStateData, AssertionStateData));

            // check the start and end execution states exist, the block hash entry should be non zero
            if (ard.startState.machineStatus == MachineStatus.RUNNING) {
                revert EmptyStartMachineStatus();
            }
            if (ard.endState.machineStatus == MachineStatus.RUNNING) {
                revert EmptyEndMachineStatus();
            }

            // Create machine hashes out of the proven state
            bytes32 startStateHash =
                oneStepProofEntry.getMachineHash(ard.startState.toExecutionState());
            bytes32 endStateHash = oneStepProofEntry.getMachineHash(ard.endState.toExecutionState());

            return (ProofData(startStateHash, endStateHash, inclusionProof), originId);
        } else {
            // Claim must be length one. If it is unrivaled then its unrivaled time is ticking up, so there's
            // no need to create claims against it
            if (!hasLengthOneRival(store, args.claimId)) {
                revert ClaimEdgeNotLengthOneRival(args.claimId);
            }

            // hasLengthOneRival checks existance, so we can use getNoCheck
            ChallengeEdge storage claimEdge = getNoCheck(store, args.claimId);

            // origin id is the mutual id of the claim
            // all rivals and their children share the same origin id - it is a link to the information
            // they agree on
            bytes32 originId = claimEdge.mutualId();

            // once a claim is confirmed it's status can never become pending again, so there is no point
            // opening a challenge that references it
            if (claimEdge.status != EdgeStatus.Pending) {
                revert ClaimEdgeNotPending();
            }

            // the edge must be a level up from the claim
            if (args.level != nextEdgeLevel(claimEdge.level, numBigStepLevel)) {
                revert ClaimEdgeInvalidLevel(args.level, claimEdge.level);
            }

            // parse the proofs
            if (args.proof.length == 0) {
                revert EmptyEdgeSpecificProof();
            }
            (
                bytes32 startState,
                bytes32 endState,
                bytes32[] memory claimStartInclusionProof,
                bytes32[] memory claimEndInclusionProof,
                bytes32[] memory edgeInclusionProof
            ) = abi.decode(args.proof, (bytes32, bytes32, bytes32[], bytes32[], bytes32[]));

            // if the start and end states are consistent with the claim edge
            // this guarantees that the edge we're creating is a 'continuation' of the claim edge, it is
            // a commitment to the states that between start and end states of the claim
            MerkleTreeAccumulatorLib.verifyInclusionProof(
                claimEdge.startHistoryRoot,
                startState,
                claimEdge.startHeight,
                claimStartInclusionProof
            );

            // it's doubly important to check the end state since if the end state since the claim id is
            // not part of the edge id, so we need to ensure that it's not possible to create two edges of the
            // same id, but with different claim id. Ensuring that the end state is linked to the claim,
            // and later ensuring that the end state is part of the history commitment of the new edge ensures
            // that the end history root of the new edge will be different for different claim ids, and therefore
            // the edge ids will be different
            MerkleTreeAccumulatorLib.verifyInclusionProof(
                claimEdge.endHistoryRoot, endState, claimEdge.endHeight, claimEndInclusionProof
            );

            return (ProofData(startState, endState, edgeInclusionProof), originId);
        }
    }

    /// @notice Check that a uint is a power of 2
    function isPowerOfTwo(
        uint256 x
    ) internal pure returns (bool) {
        // zero is not a power of 2
        if (x == 0) {
            return false;
        }

        // if x is a power of 2, then this will be 0111111
        uint256 y = x - 1;

        // if x is a power of 2 then y will share no bits with x
        return ((x & y) == 0);
    }

    /// @notice Common checks that apply to all layer zero edges
    /// @param proofData            Data extracted from supplied proof
    /// @param args                 The edge creation args
    /// @param expectedEndHeight    Edges have a deterministic end height dependent on their level
    function layerZeroCommonChecks(
        ProofData memory proofData,
        CreateEdgeArgs calldata args,
        uint256 expectedEndHeight
    ) private pure returns (bytes32) {
        // since zero layer edges have a start height of zero, we know that they are a size
        // one tree containing only the start state. We can then compute the history root directly
        bytes32 startHistoryRoot = MerkleTreeAccumulatorLib.root(
            MerkleTreeAccumulatorLib.appendLeaf(new bytes32[](0), proofData.startState)
        );

        // all end heights are expected to be a power of 2, the specific power is defined by the
        // edge challenge manager itself
        if (!isPowerOfTwo(expectedEndHeight)) {
            revert NotPowerOfTwo(expectedEndHeight);
        }

        // It isnt strictly necessary to pass in the end height, we know what it
        // should be so we could just use the end height that we get from getLayerZeroEndHeight
        // However it's a nice sanity check for the calling code to check that their local edge
        // will have the same height as the one created here
        if (args.endHeight != expectedEndHeight) {
            revert InvalidEndHeight(args.endHeight, expectedEndHeight);
        }

        // the end state is checked/determined as part of the specific edge level
        // We then ensure that that same end state is part of the end history root we're creating
        // This ensures continuity of states between levels - the state is present in both this
        // level and the one below
        MerkleTreeAccumulatorLib.verifyInclusionProof(
            args.endHistoryRoot, proofData.endState, args.endHeight, proofData.inclusionProof
        );

        // start root must always be a prefix of end root, we ensure that
        // this new edge adheres to this. Future bisections will ensure that this
        // property is conserved
        if (args.prefixProof.length == 0) {
            revert EmptyPrefixProof();
        }
        (bytes32[] memory preExpansion, bytes32[] memory preProof) =
            abi.decode(args.prefixProof, (bytes32[], bytes32[]));
        MerkleTreeAccumulatorLib.verifyPrefixProof(
            startHistoryRoot, 1, args.endHistoryRoot, args.endHeight + 1, preExpansion, preProof
        );

        return (startHistoryRoot);
    }

    /// @notice Creates a new layer zero edges from edge creation args
    function toLayerZeroEdge(
        bytes32 originId,
        bytes32 startHistoryRoot,
        CreateEdgeArgs calldata args
    ) private view returns (ChallengeEdge memory) {
        return ChallengeEdgeLib.newLayerZeroEdge(
            originId,
            startHistoryRoot,
            0,
            args.endHistoryRoot,
            args.endHeight,
            args.claimId,
            msg.sender,
            args.level
        );
    }

    /// @notice Performs necessary checks and creates a new layer zero edge
    /// @param store                The store containing existing edges
    /// @param args                 Edge data
    /// @param ard                  If the edge being added is of Block type then additional assertion data is required
    ///                             to check if the edge can be added. Empty if edge is not of type Block.
    ///                             The supplied assertion data must be related to the assertion that is being claimed
    ///                             by the supplied edge args
    /// @param oneStepProofEntry    The one step proof contract that defines how machine states are hashed
    /// @param expectedEndHeight    The expected end height of an edge. Layer zero block edges have predefined heights.
    /// @param numBigStepLevel      The number of big step levels in this challenge
    function createLayerZeroEdge(
        EdgeStore storage store,
        CreateEdgeArgs calldata args,
        AssertionReferenceData memory ard,
        IOneStepProofEntry oneStepProofEntry,
        uint256 expectedEndHeight,
        uint8 numBigStepLevel,
        bool whitelistEnabled
    ) internal returns (EdgeAddedData memory) {
        // each edge type requires some specific checks
        (ProofData memory proofData, bytes32 originId) =
            layerZeroTypeSpecificChecks(store, args, ard, oneStepProofEntry, numBigStepLevel);
        // all edge types share some common checks
        (bytes32 startHistoryRoot) = layerZeroCommonChecks(proofData, args, expectedEndHeight);
        // we only wrap the struct creation in a function as doing so with exceeds the stack limit
        ChallengeEdge memory ce = toLayerZeroEdge(originId, startHistoryRoot, args);

        // if the validator whitelist is enabled, we can enforce that a single party cannot create two layer zero edges that rival each other
        // if the validator whitelist is disabled, this check serves no purpose since an attacker can create new accounts
        if (whitelistEnabled) {
            bytes32 mutualId = ce.mutualIdMem();
            if (store.hasMadeLayerZeroRival[msg.sender][mutualId]) {
                revert AccountHasMadeLayerZeroRival(msg.sender, mutualId);
            }
            store.hasMadeLayerZeroRival[msg.sender][mutualId] = true;
        }

        return add(store, ce);
    }

    /// @notice From any given edge, get the id of the previous assertion
    /// @param edgeId           The edge to get the prev assertion hash
    function getPrevAssertionHash(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (bytes32) {
        ChallengeEdge storage edge = get(store, edgeId);
        while (edge.level > 0) {
            // the origin id gives us a link to the lower level
            // we know a first rival must exist, since otherwise we would not have had a one step fork
            // and we wouldnt be able to go to the next level
            // we can use the first rival to get an edge id, and from there get the next origin id
            bytes32 lowerLevelId = store.firstRivals[edge.originId];
            edge = get(store, lowerLevelId);
        }

        // For Block type edges the origin id is the assertion hash of claim prev
        return edge.originId;
    }

    /// @notice Does this edge currently have one or more rivals
    ///         Rival edges share the same startHeight, startHistoryCommitment and the same endHeight,
    ///         but they have a different endHistoryRoot. Rival edges have the same mutualId
    /// @param store    The edge store containing the edge
    /// @param edgeId   The edge if to test if it is unrivaled
    function hasRival(EdgeStore storage store, bytes32 edgeId) internal view returns (bool) {
        if (!store.edges[edgeId].exists()) {
            revert EdgeNotExists(edgeId);
        }

        // rivals have the same mutual id
        bytes32 mutualId = store.edges[edgeId].mutualId();
        bytes32 firstRival = store.firstRivals[mutualId];
        // Sanity check: it should never be possible to create an edge without having an entry in firstRivals
        if (firstRival == 0) {
            revert EmptyFirstRival();
        }

        // can only have no rival if the firstRival is the UNRIVALED magic hash
        return firstRival != UNRIVALED;
    }

    /// @notice Is the edge a single step in length, and does it have at least one rival.
    /// @param store    The edge store containing the edge
    /// @param edgeId   The edge id to test for single step and rivaled
    function hasLengthOneRival(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (bool) {
        // must be length 1 and have rivals - all rivals have the same length
        return (hasRival(store, edgeId) && store.edges[edgeId].length() == 1);
    }

    function timeUnrivaledTotal(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (uint256) {
        uint256 totalTimeUnrivaled = timeUnrivaled(store, edgeId);
        if (store.edges[edgeId].lowerChildId != bytes32(0)) {
            uint256 lowerTimer =
                store.edges[store.edges[edgeId].lowerChildId].totalTimeUnrivaledCache;
            uint256 upperTimer =
                store.edges[store.edges[edgeId].upperChildId].totalTimeUnrivaledCache;
            totalTimeUnrivaled += lowerTimer < upperTimer ? lowerTimer : upperTimer;
        }
        return totalTimeUnrivaled;
    }

    /// @dev revert if the current totalTimeUnrivaledCache on the edge is greater than or equal to maximumCachedTime
    /// @return the current totalTimeUnrivaledCache on the edge
    function validateCurrentTimer(
        EdgeStore storage store,
        bytes32 edgeId,
        uint256 maximumCachedTime
    ) internal view returns (uint256) {
        uint256 currentAccuTimer = store.edges[edgeId].totalTimeUnrivaledCache;
        if (currentAccuTimer >= maximumCachedTime) {
            revert CachedTimeSufficient(currentAccuTimer, maximumCachedTime);
        }
        return currentAccuTimer;
    }

    /// @notice Update the timer cache for an edge
    /// @dev    The cache is only updated if the new value is greater than the current value.
    ///         If the new value is greater than uint64 max then the cache is set to uint64 max
    /// @return (bool, uint256) A boolean indicating if the cache was updated, and the value of the cache
    function updateTimerCache(
        EdgeStore storage store,
        bytes32 edgeId,
        uint256 newValue,
        uint256 maximumCachedTime
    ) internal returns (bool, uint256) {
        uint256 currentAccuTimer = validateCurrentTimer(store, edgeId, maximumCachedTime);
        newValue = newValue > type(uint64).max ? type(uint64).max : newValue;
        // only update when increased
        if (newValue > currentAccuTimer) {
            store.edges[edgeId].totalTimeUnrivaledCache = uint64(newValue);
            return (true, newValue);
        }
        return (false, currentAccuTimer);
    }

    function updateTimerCacheByChildren(
        EdgeStore storage store,
        bytes32 edgeId,
        uint256 maximumCachedTime
    ) internal returns (bool, uint256) {
        return updateTimerCache(store, edgeId, timeUnrivaledTotal(store, edgeId), maximumCachedTime);
    }

    function updateTimerCacheByClaim(
        EdgeStore storage store,
        bytes32 edgeId,
        bytes32 claimingEdgeId,
        uint8 numBigStepLevel,
        uint256 maximumCachedTime
    ) internal returns (bool, uint256) {
        // calculate the time unrivaled without inheritance
        uint256 totalTimeUnrivaled = timeUnrivaled(store, edgeId);
        checkClaimIdLink(store, edgeId, claimingEdgeId, numBigStepLevel);
        totalTimeUnrivaled += store.edges[claimingEdgeId].totalTimeUnrivaledCache;
        return updateTimerCache(store, edgeId, totalTimeUnrivaled, maximumCachedTime);
    }

    /// @notice The amount of time (in blocks) this edge has spent without rivals
    ///         This value is increasing whilst an edge is unrivaled, once a rival is created
    ///         it is fixed. If an edge has rivals from the moment it is created then it will have
    ///         a zero time unrivaled
    function timeUnrivaled(
        EdgeStore storage store,
        bytes32 edgeId
    ) internal view returns (uint256) {
        if (!store.edges[edgeId].exists()) {
            revert EdgeNotExists(edgeId);
        }

        bytes32 mutualId = store.edges[edgeId].mutualId();
        bytes32 firstRival = store.firstRivals[mutualId];
        // Sanity check: it's not possible to have a 0 first rival for an edge that exists
        if (firstRival == 0) {
            revert EmptyFirstRival();
        }

        // this edge has no rivals, the time is still going up
        // we give the current amount of time unrivaled
        if (firstRival == UNRIVALED) {
            return block.number - store.edges[edgeId].createdAtBlock;
        } else {
            // Sanity check: it's not possible an edge does not exist for a first rival record
            if (!store.edges[firstRival].exists()) {
                revert EdgeNotExists(firstRival);
            }

            // rivals exist for this edge
            uint256 firstRivalCreatedAtBlock = store.edges[firstRival].createdAtBlock;
            uint256 edgeCreatedAtBlock = store.edges[edgeId].createdAtBlock;
            if (firstRivalCreatedAtBlock > edgeCreatedAtBlock) {
                // if this edge was created before the first rival then we return the difference
                // in createdAtBlock number
                return firstRivalCreatedAtBlock - edgeCreatedAtBlock;
            } else {
                // if this was created at the same time as, or after the the first rival
                // then we return 0
                return 0;
            }
        }
    }

    /// @notice Given a start and an endpoint determine the bisection height
    /// @dev    Returns the highest power of 2 in the differing lower bits of start and end
    function mandatoryBisectionHeight(uint256 start, uint256 end) internal pure returns (uint256) {
        if (end - start < 2) {
            revert HeightDiffLtTwo(start, end);
        }
        if (end - start == 2) {
            return start + 1;
        }

        uint256 diff = (end - 1) ^ start;
        uint256 mostSignificantSharedBit = UintUtilsLib.mostSignificantBit(diff);
        uint256 mask = type(uint256).max << mostSignificantSharedBit;
        return ((end - 1) & mask);
    }

    /// @notice Bisect and edge. This creates two child edges:
    ///         lowerChild: has the same start root and height as this edge, but a different end root and height
    ///         upperChild: has the same end root and height as this edge, but a different start root and height
    ///         The lower child end root and height are equal to the upper child start root and height. This height
    ///         is the mandatoryBisectionHeight.
    ///         The lower child may already exist, however it's not possible for the upper child to exist as that would
    ///         mean that the edge has already been bisected
    /// @param store                The edge store containing the edge to bisect
    /// @param edgeId               Edge to bisect
    /// @param bisectionHistoryRoot The new history root to be used in the lower and upper children
    /// @param prefixProof          A proof to show that the bisectionHistoryRoot commits to a prefix of the current endHistoryRoot
    /// @return lowerChildId        The id of the newly created lower child edge
    /// @return lowerChildAdded     Data about the lower child edge, empty if the lower child already existed
    /// @return upperChildAdded     Data about the upper child edge, never empty
    function bisectEdge(
        EdgeStore storage store,
        bytes32 edgeId,
        bytes32 bisectionHistoryRoot,
        bytes memory prefixProof
    ) internal returns (bytes32, EdgeAddedData memory, EdgeAddedData memory) {
        if (store.edges[edgeId].status != EdgeStatus.Pending) {
            revert EdgeNotPending(edgeId, store.edges[edgeId].status);
        }
        if (!hasRival(store, edgeId)) {
            revert EdgeUnrivaled(edgeId);
        }

        // cannot bisect an edge twice
        // has rival above checks the edge - so no need to check again
        ChallengeEdge memory ce = getNoCheck(store, edgeId);

        // bisections occur at deterministic heights, this ensures that
        // rival edges bisect at the same height, and create the same child if they agree
        uint256 middleHeight = mandatoryBisectionHeight(ce.startHeight, ce.endHeight);
        {
            (bytes32[] memory preExpansion, bytes32[] memory proof) =
                abi.decode(prefixProof, (bytes32[], bytes32[]));
            MerkleTreeAccumulatorLib.verifyPrefixProof(
                bisectionHistoryRoot,
                middleHeight + 1,
                ce.endHistoryRoot,
                ce.endHeight + 1,
                preExpansion,
                proof
            );
        }

        bytes32 lowerChildId;
        EdgeAddedData memory lowerChildAdded;
        {
            // midpoint proof it valid, create and store the children
            ChallengeEdge memory lowerChild = ChallengeEdgeLib.newChildEdge(
                ce.originId,
                ce.startHistoryRoot,
                ce.startHeight,
                bisectionHistoryRoot,
                middleHeight,
                ce.level
            );
            lowerChildId = lowerChild.idMem();
            // it's possible that the store already has the lower child if it was created by a rival
            // (aka a merge move)
            if (!store.edges[lowerChildId].exists()) {
                lowerChildAdded = add(store, lowerChild);
            }
        }

        EdgeAddedData memory upperChildAdded;
        {
            ChallengeEdge memory upperChild = ChallengeEdgeLib.newChildEdge(
                ce.originId,
                bisectionHistoryRoot,
                middleHeight,
                ce.endHistoryRoot,
                ce.endHeight,
                ce.level
            );

            // add checks existence and throws if the id already exists
            upperChildAdded = add(store, upperChild);
        }

        store.edges[edgeId].setChildren(lowerChildId, upperChildAdded.edgeId);

        return (lowerChildId, lowerChildAdded, upperChildAdded);
    }

    /// @notice Store that an edge has been confirmed. Recorded against the mutual id
    ///         so that rivals can look up rival confirmed edges
    /// @dev    Checks that a rival edge has not already been confirmed
    function setConfirmedRival(EdgeStore storage store, bytes32 edgeId) internal {
        bytes32 mutualId = store.edges[edgeId].mutualId();
        bytes32 confirmedRivalId = store.confirmedRivals[mutualId];
        if (confirmedRivalId != bytes32(0)) {
            revert RivalEdgeConfirmed(edgeId, confirmedRivalId);
        }
        store.confirmedRivals[mutualId] = edgeId;
    }

    /// @notice Returns the sub edge level of the provided edge level
    /// @param level            The edge level to fetch the next of
    /// @param numBigStepLevel  The number of big step levels in this challenge
    function nextEdgeLevel(uint8 level, uint8 numBigStepLevel) internal pure returns (uint8) {
        uint8 nextLevel = level + 1;

        // levelToType throws an error when level is not a valid type
        ChallengeEdgeLib.levelToType(nextLevel, numBigStepLevel);

        return nextLevel;
    }

    /// @notice Check that the originId of a claiming edge matched the mutualId() of a supplied edge
    /// @dev    Does some additional sanity checks to ensure that the claim id link is valid
    /// @param store            The store containing all edges and rivals
    /// @param edgeId           The edge being claimed
    /// @param claimingEdgeId   The edge with a claim id equal to edge id
    /// @param numBigStepLevel  The number of big step levels in this challenge
    function checkClaimIdLink(
        EdgeStore storage store,
        bytes32 edgeId,
        bytes32 claimingEdgeId,
        uint8 numBigStepLevel
    ) private view {
        if (edgeId != store.edges[claimingEdgeId].claimId) {
            revert EdgeClaimMismatch(edgeId, store.edges[claimingEdgeId].claimId);
        }
        // we do some extra checks that edge being claimed is eligible to be claimed by the claiming edge
        // these shouldn't be necessary since it should be impossible to add layer zero edges that do not
        // satisfy the checks below, but we conduct these checks anyway for double safety

        // the origin id of an edge should be the mutual id of the edge in the level below
        if (store.edges[edgeId].mutualId() != store.edges[claimingEdgeId].originId) {
            revert OriginIdMutualIdMismatch(
                store.edges[edgeId].mutualId(), store.edges[claimingEdgeId].originId
            );
        }
        // the claiming edge must be exactly one level below
        if (
            nextEdgeLevel(store.edges[edgeId].level, numBigStepLevel)
                != store.edges[claimingEdgeId].level
        ) {
            revert EdgeLevelInvalid(
                edgeId,
                claimingEdgeId,
                nextEdgeLevel(store.edges[edgeId].level, numBigStepLevel),
                store.edges[claimingEdgeId].level
            );
        }
    }

    /// @notice An edge can be confirmed if the total amount of time (in blocks) it and a single chain of its direct ancestors
    ///         has spent unrivaled is greater than the challenge period.
    /// @dev    Edges inherit time from their parents, so the sum of unrivaled timer is compared against the threshold.
    ///         Given that an edge cannot become unrivaled after becoming rivaled, once the threshold is passed
    ///         it will always remain passed. The direct ancestors of an edge are linked by parent-child links for edges
    ///         of the same level, and claimId-edgeId links for zero layer edges that claim an edge in the level below.
    /// @param store                            The edge store containing all edges and rival data
    /// @param edgeId                           The id of the edge to confirm
    /// @param claimedAssertionUnrivaledBlocks  The number of blocks that the assertion ultimately being claimed by this edge spent unrivaled
    /// @param confirmationThresholdBlock       The number of blocks that the total unrivaled time of an ancestor chain needs to exceed in
    ///                                         order to be confirmed
    function confirmEdgeByTime(
        EdgeStore storage store,
        bytes32 edgeId,
        uint64 claimedAssertionUnrivaledBlocks,
        uint64 confirmationThresholdBlock
    ) internal returns (uint256) {
        if (!store.edges[edgeId].exists()) {
            revert EdgeNotExists(edgeId);
        }

        uint256 totalTimeUnrivaled = timeUnrivaledTotal(store, edgeId);

        // since sibling assertions have the same predecessor, they can be viewed as
        // rival edges. Adding the assertion unrivaled time allows us to start the confirmation
        // timer from the moment the first assertion is made, rather than having to wait until the
        // second assertion is made.
        totalTimeUnrivaled += claimedAssertionUnrivaledBlocks;

        if (totalTimeUnrivaled < confirmationThresholdBlock) {
            revert InsufficientConfirmationBlocks(totalTimeUnrivaled, confirmationThresholdBlock);
        }

        // we also check the edge is pending in setConfirmed()
        store.edges[edgeId].setConfirmed();

        // also checks that no other rival has been confirmed
        setConfirmedRival(store, edgeId);

        return totalTimeUnrivaled;
    }

    /// @notice Confirm an edge by executing a one step proof
    /// @dev    One step proofs can only be executed against edges that have length one and of type SmallStep
    /// @param store                        The edge store containing all edges and rival data
    /// @param edgeId                       The id of the edge to confirm
    /// @param oneStepProofEntry            The one step proof contract
    /// @param oneStepData                  Input data to the one step proof
    /// @param execCtx                      The execution context to be supplied to the one step proof entry
    /// @param beforeHistoryInclusionProof  Proof that the state which is the start of the edge is committed to by the startHistoryRoot
    /// @param afterHistoryInclusionProof   Proof that the state which is the end of the edge is committed to by the endHistoryRoot
    /// @param numBigStepLevel              The number of big step levels in this challenge
    /// @param bigStepHeight                The height of the zero layer levels of big step type
    /// @param smallStepHeight              The height of the zero layer levels of big step type
    function confirmEdgeByOneStepProof(
        EdgeStore storage store,
        bytes32 edgeId,
        IOneStepProofEntry oneStepProofEntry,
        OneStepData calldata oneStepData,
        ExecutionContext memory execCtx,
        bytes32[] calldata beforeHistoryInclusionProof,
        bytes32[] calldata afterHistoryInclusionProof,
        uint8 numBigStepLevel,
        uint256 bigStepHeight,
        uint256 smallStepHeight
    ) internal {
        if (!store.edges[edgeId].exists()) {
            revert EdgeNotExists(edgeId);
        }

        // edge must of type SmallStep
        if (
            ChallengeEdgeLib.levelToType(store.edges[edgeId].level, numBigStepLevel)
                != EdgeType.SmallStep
        ) {
            revert EdgeTypeNotSmallStep(store.edges[edgeId].level);
        }

        // edge must be length one to execute one step proofs against
        if (store.edges[edgeId].length() != 1) {
            revert EdgeNotLengthOne(store.edges[edgeId].length());
        }

        // Get the machine step that corresponds to the start height of this edge
        // To do this we sum the machine steps of the edges in each of the preceeding levels.
        // We do not include the block height, since each step at the block level is a new block
        // and new blocks reset the machine step to 0.
        uint256 machineStep = store.edges[edgeId].startHeight;
        {
            bytes32 cursor = edgeId;
            uint256 stepSize = smallStepHeight;
            while (store.edges[cursor].level > 1) {
                bytes32 nextEdgeId = store.edges[cursor].originId;
                // We can traverse to previous levels using the origin id
                cursor = store.firstRivals[nextEdgeId];
                // sum the stepSize * offset from 0 at this level
                machineStep += stepSize * store.edges[cursor].startHeight;
                // the step size at each level is the product of the heights at all succeeding levels
                stepSize *= bigStepHeight;
            }
        }

        // the state in the onestep data must be committed to by the startHistoryRoot
        MerkleTreeAccumulatorLib.verifyInclusionProof(
            store.edges[edgeId].startHistoryRoot,
            oneStepData.beforeHash,
            machineStep,
            beforeHistoryInclusionProof
        );

        // execute the single step to produce the after state
        bytes32 afterHash = oneStepProofEntry.proveOneStep(
            execCtx, machineStep, oneStepData.beforeHash, oneStepData.proof
        );

        // check that the after state was indeed committed to by the endHistoryRoot
        MerkleTreeAccumulatorLib.verifyInclusionProof(
            store.edges[edgeId].endHistoryRoot,
            afterHash,
            machineStep + 1,
            afterHistoryInclusionProof
        );

        // we also check the edge is pending in setConfirmed()
        store.edges[edgeId].setConfirmed();

        // also checks that no other rival has been confirmed
        setConfirmedRival(store, edgeId);

        store.edges[edgeId].totalTimeUnrivaledCache = type(uint64).max;
    }
}

struct EdgeStore {
    /// @notice A mapping of edge id to edges. Edges are never deleted, only created, and potentially confirmed.
    mapping(bytes32 => ChallengeEdge) edges;
    /// @notice A mapping of mutualId to edge id. Rivals share the same mutual id, and here we
    ///         store the edge id of the second edge that was created with the same mutual id - the first rival
    ///         When only one edge exists for a specific mutual id then a special magic string hash is stored instead
    ///         of the first rival id, to signify that a single edge does exist with this mutual id
    mapping(bytes32 => bytes32) firstRivals;
    /// @notice A mapping of mutualId to the edge id of the confirmed rival with that mutualId
    /// @dev    Each group of rivals (edges sharing mutual id) can only have at most one confirmed edge
    mapping(bytes32 => bytes32) confirmedRivals;
    /// @notice A mapping of account -> mutualId -> bool indicating if the account has created a layer zero edge with a mutual id
    mapping(address => mapping(bytes32 => bool)) hasMadeLayerZeroRival;
}

library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly
                /// @solidity memory-safe-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts. Equivalent to `reinitializer(1)`.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * `initializer` is equivalent to `reinitializer(1)`, so a reinitializer may be used after the original
     * initialization step. This is essential to configure modules that are added through upgrades and that require
     * initialization.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }
}

struct CreateEdgeArgs {
    /// @notice The level of edge to be created. Challenges are decomposed into multiple levels.
    ///         The first (level 0) being of type Block, followed by n (set by NUM_BIGSTEP_LEVEL) levels of type BigStep, and finally
    ///         followed by a single level of type SmallStep. Each level is bisected until an edge
    ///         of length one is reached before proceeding to the next level. The first edge in each level (the layer zero edge)
    ///         makes a claim about an assertion or assertion in the lower level.
    ///         Finally in the last level, a SmallStep edge is added that claims a lower level length one BigStep edge, and these
    ///         SmallStep edges are bisected until they reach length one. A length one small step edge
    ///         can then be directly executed using a one-step proof.
    uint8 level;
    /// @notice The end history root of the edge to be created
    bytes32 endHistoryRoot;
    /// @notice The end height of the edge to be created.
    /// @dev    End height is deterministic for different levels but supplying it here gives the
    ///         caller a bit of extra security that they are supplying data for the correct level of edge
    uint256 endHeight;
    /// @notice The edge, or assertion, that is being claimed correct by the newly created edge.
    bytes32 claimId;
    /// @notice Proof that the start history root commits to a prefix of the states that
    ///         end history root commits to
    bytes prefixProof;
    /// @notice Edge type specific data
    ///         For Block type edges this is the abi encoding of:
    ///         bytes32[]: Inclusion proof - proof to show that the end state is the last state in the end history root
    ///         AssertionStateData: the before state of the edge
    ///         AssertionStateData: the after state of the edge
    ///         bytes32 predecessorId: id of the prev assertion
    ///         bytes32 inboxAcc:  the inbox accumulator of the assertion
    ///         For BigStep and SmallStep edges this is the abi encoding of:
    ///         bytes32: Start state - first state the edge commits to
    ///         bytes32: End state - last state the edge commits to
    ///         bytes32[]: Claim start inclusion proof - proof to show the start state is the first state in the claim edge
    ///         bytes32[]: Claim end inclusion proof - proof to show the end state is the last state in the claim edge
    ///         bytes32[]: Inclusion proof - proof to show that the end state is the last state in the end history root
    bytes proof;
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED
}

struct AssertionState {
    GlobalState globalState;
    MachineStatus machineStatus;
    bytes32 endHistoryRoot;
}

struct AssertionStateData {
    /// @notice An execution state
    AssertionState assertionState;
    /// @notice assertion Hash of the prev assertion
    bytes32 prevAssertionHash;
    /// @notice Inbox accumulator of the assertion
    bytes32 inboxAcc;
}

struct OneStepData {
    /// @notice The hash of the state that's being executed from
    bytes32 beforeHash;
    /// @notice Proof data to accompany the execution context
    bytes proof;
}

struct ConfigData {
    bytes32 wasmModuleRoot;
    uint256 requiredStake;
    address challengeManager;
    uint64 confirmPeriodBlocks;
    uint64 nextInboxPosition;
}

enum EdgeType {
    Block,
    BigStep,
    SmallStep
}

enum EdgeStatus {
    Pending,
    Confirmed
}

struct ChallengeEdge {
    /// @notice The origin id is a link from the edge to an edge or assertion at a lower level.
    ///         Intuitively all edges with the same origin id agree on the information committed to in the origin id
    ///         For a SmallStep edge the origin id is the 'mutual' id of the length one BigStep edge being claimed by the zero layer ancestors of this edge
    ///         For a BigStep edge the origin id is the 'mutual' id of the length one Block edge being claimed by the zero layer ancestors of this edge
    ///         For a Block edge the origin id is the assertion hash of the assertion that is the root of the challenge - all edges in this challenge agree
    ///         that that assertion hash is valid.
    ///         The purpose of the origin id is to ensure that only edges that agree on a common start position
    ///         are being compared against one another.
    bytes32 originId;
    /// @notice A root of all the states in the history up to the startHeight
    bytes32 startHistoryRoot;
    /// @notice The height of the start history root
    uint256 startHeight;
    /// @notice A root of all the states in the history up to the endHeight. Since endHeight > startHeight, the startHistoryRoot must
    ///         commit to a prefix of the states committed to by the endHistoryRoot
    bytes32 endHistoryRoot;
    /// @notice The height of the end history root
    uint256 endHeight;
    /// @notice Edges can be bisected into two children. If this edge has been bisected the id of the
    ///         lower child is populated here, until that time this value is 0. The lower child has startHistoryRoot and startHeight
    ///         equal to this edge, but endHistoryRoot and endHeight equal to some prefix of the endHistoryRoot of this edge
    bytes32 lowerChildId;
    /// @notice Edges can be bisected into two children. If this edge has been bisected the id of the
    ///         upper child is populated here, until that time this value is 0. The upper child has startHistoryRoot and startHeight
    ///         equal to some prefix of the endHistoryRoot of this edge, and endHistoryRoot and endHeight equal to this edge
    bytes32 upperChildId;
    /// @notice The edge or assertion in the upper level that this edge claims to be true.
    ///         Only populated on zero layer edges
    bytes32 claimId;
    /// @notice The entity that supplied a mini-stake accompanying this edge
    ///         Only populated on zero layer edges
    address staker;
    /// @notice The block number when this edge was created
    uint64 createdAtBlock;
    /// @notice The block number at which this edge was confirmed
    ///         Zero if not confirmed
    uint64 confirmedAtBlock;
    /// @notice Current status of this edge. All edges are created Pending, and may be updated to Confirmed
    ///         Once Confirmed they cannot transition back to Pending
    EdgeStatus status;
    /// @notice The level of this edge.
    ///         Level 0 is type Block
    ///         Last level (defined by NUM_BIGSTEP_LEVEL + 1) is type SmallStep
    ///         All levels in between are of type BigStep
    uint8 level;
    /// @notice Set to true when the staker has been refunded. Can only be set to true if the status is Confirmed
    ///         and the staker is non zero.
    bool refunded;
    /// @notice TODO
    uint64 totalTimeUnrivaledCache;
}

interface IEdgeChallengeManager {
    /// @notice Initialize the EdgeChallengeManager. EdgeChallengeManagers are upgradeable
    ///         so use the initializer paradigm
    /// @param _assertionChain              The assertion chain contract
    /// @param _challengePeriodBlocks       The amount of cumulative time an edge must spend unrivaled before it can be confirmed
    ///                                     This should be the censorship period + the cumulative amount of time needed to do any
    ///                                     offchain calculation. We currently estimate around 10 mins for each layer zero edge and 1
    ///                                     one minute for each other edge.
    /// @param _oneStepProofEntry           The one step proof logic
    /// @param layerZeroBlockEdgeHeight     The end height of layer zero edges of type Block
    /// @param layerZeroBigStepEdgeHeight   The end height of layer zero edges of type BigStep
    /// @param layerZeroSmallStepEdgeHeight The end height of layer zero edges of type SmallStep
    /// @param _stakeToken                  The token that stake will be provided in when creating zero layer block edges
    /// @param _excessStakeReceiver         The address that excess stake will be sent to when 2nd+ block edge is created
    /// @param _numBigStepLevel             The number of bigstep levels
    /// @param _stakeAmounts                The stake amount for each level. (first element is for block level)
    function initialize(
        IAssertionChain _assertionChain,
        uint64 _challengePeriodBlocks,
        IOneStepProofEntry _oneStepProofEntry,
        uint256 layerZeroBlockEdgeHeight,
        uint256 layerZeroBigStepEdgeHeight,
        uint256 layerZeroSmallStepEdgeHeight,
        IERC20 _stakeToken,
        address _excessStakeReceiver,
        uint8 _numBigStepLevel,
        uint256[] calldata _stakeAmounts
    ) external;

    function stakeToken() external view returns (IERC20);

    function stakeAmounts(
        uint256
    ) external view returns (uint256);

    function challengePeriodBlocks() external view returns (uint64);

    /// @notice The one step proof resolver used to decide between rival SmallStep edges of length 1
    function oneStepProofEntry() external view returns (IOneStepProofEntry);

    /// @notice Performs necessary checks and creates a new layer zero edge
    /// @param args             Edge creation args
    function createLayerZeroEdge(
        CreateEdgeArgs calldata args
    ) external returns (bytes32);

    /// @notice Bisect an edge. This creates two child edges:
    ///         lowerChild: has the same start root and height as this edge, but a different end root and height
    ///         upperChild: has the same end root and height as this edge, but a different start root and height
    ///         The lower child end root and height are equal to the upper child start root and height. This height
    ///         is the mandatoryBisectionHeight.
    ///         The lower child may already exist, however it's not possible for the upper child to exist as that would
    ///         mean that the edge has already been bisected
    /// @param edgeId               Edge to bisect
    /// @param bisectionHistoryRoot The new history root to be used in the lower and upper children
    /// @param prefixProof          A proof to show that the bisectionHistoryRoot commits to a prefix of the current endHistoryRoot
    /// @return lowerChildId        The id of the newly created lower child edge
    /// @return upperChildId        The id of the newly created upper child edge
    function bisectEdge(
        bytes32 edgeId,
        bytes32 bisectionHistoryRoot,
        bytes calldata prefixProof
    ) external returns (bytes32, bytes32);

    /// @notice An edge can be confirmed if the total amount of time it and a single chain of its direct ancestors
    ///         has spent unrivaled is greater than the challenge period.
    /// @dev    Edges inherit time from their parents, so the sum of unrivaled timers is compared against the threshold.
    ///         Given that an edge cannot become unrivaled after becoming rivaled, once the threshold is passed
    ///         it will always remain passed. The direct ancestors of an edge are linked by parent-child links for edges
    ///         of the same level, and claimId-edgeId links for zero layer edges that claim an edge in the level below.
    ///         This method also includes the amount of time the assertion being claimed spent without a sibling
    /// @param edgeId                   The id of the edge to confirm
    function confirmEdgeByTime(
        bytes32 edgeId,
        AssertionStateData calldata claimStateData
    ) external;

    /// @notice Update multiple edges' timer cache by their children. Equivalent to calling updateTimerCacheByChildren for each edge.
    ///         May update timer cache above maximum if the last edge's timer cache was below maximumCachedTime.
    ///         Revert when the last edge's timer cache is already equal to or above maximumCachedTime.
    /// @param edgeIds           The ids of the edges to update
    /// @param maximumCachedTime The maximum amount of cached time allowed on the last edge (β∗)
    function multiUpdateTimeCacheByChildren(
        bytes32[] calldata edgeIds,
        uint256 maximumCachedTime
    ) external;

    /// @notice Update an edge's timer cache by its children.
    ///         Sets the edge's timer cache to its timeUnrivaled + (minimum timer cache of its children).
    ///         May update timer cache above maximum if the last edge's timer cache was below maximumCachedTime.
    ///         Revert when the edge's timer cache is already equal to or above maximumCachedTime.
    /// @param edgeId            The id of the edge to update
    /// @param maximumCachedTime The maximum amount of cached time allowed on the edge (β∗)
    function updateTimerCacheByChildren(bytes32 edgeId, uint256 maximumCachedTime) external;

    /// @notice Given a one step fork edge and an edge with matching claim id,
    ///         set the one step fork edge's timer cache to its timeUnrivaled + claiming edge's timer cache.
    ///         May update timer cache above maximum if the last edge's timer cache was below maximumCachedTime.
    ///         Revert when the edge's timer cache is already equal to or above maximumCachedTime.
    /// @param edgeId            The id of the edge to update
    /// @param claimingEdgeId    The id of the edge which has a claimId equal to edgeId
    /// @param maximumCachedTime The maximum amount of cached time allowed on the edge (β∗)
    function updateTimerCacheByClaim(
        bytes32 edgeId,
        bytes32 claimingEdgeId,
        uint256 maximumCachedTime
    ) external;

    /// @notice Confirm an edge by executing a one step proof
    /// @dev    One step proofs can only be executed against edges that have length one and of type SmallStep
    /// @param edgeId                       The id of the edge to confirm
    /// @param oneStepData                  Input data to the one step proof
    /// @param prevConfig                     Data about the config set in prev
    /// @param beforeHistoryInclusionProof  Proof that the state which is the start of the edge is committed to by the startHistoryRoot
    /// @param afterHistoryInclusionProof   Proof that the state which is the end of the edge is committed to by the endHistoryRoot
    function confirmEdgeByOneStepProof(
        bytes32 edgeId,
        OneStepData calldata oneStepData,
        ConfigData calldata prevConfig,
        bytes32[] calldata beforeHistoryInclusionProof,
        bytes32[] calldata afterHistoryInclusionProof
    ) external;

    /// @notice When zero layer block edges are created a stake is also provided
    ///         The stake on this edge can be refunded if the edge is confirme
    function refundStake(
        bytes32 edgeId
    ) external;

    /// @notice Zero layer edges have to be a fixed height.
    ///         This function returns the end height for a given edge type
    function getLayerZeroEndHeight(
        EdgeType eType
    ) external view returns (uint256);

    /// @notice Calculate the unique id of an edge
    /// @param level            The level of the edge
    /// @param originId         The origin id of the edge
    /// @param startHeight      The start height of the edge
    /// @param startHistoryRoot The start history root of the edge
    /// @param endHeight        The end height of the edge
    /// @param endHistoryRoot   The end history root of the edge
    function calculateEdgeId(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight,
        bytes32 endHistoryRoot
    ) external pure returns (bytes32);

    /// @notice Calculate the mutual id of the edge
    ///         Edges that are rivals share the same mutual id
    /// @param level            The level of the edge
    /// @param originId         The origin id of the edge
    /// @param startHeight      The start height of the edge
    /// @param startHistoryRoot The start history root of the edge
    /// @param endHeight        The end height of the edge
    function calculateMutualId(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight
    ) external pure returns (bytes32);

    /// @notice Has the edge already been stored in the manager
    function edgeExists(
        bytes32 edgeId
    ) external view returns (bool);

    /// @notice Get full edge data for an edge
    function getEdge(
        bytes32 edgeId
    ) external view returns (ChallengeEdge memory);

    /// @notice The length of the edge, from start height to end height
    function edgeLength(
        bytes32 edgeId
    ) external view returns (uint256);

    /// @notice Does this edge currently have one or more rivals
    ///         Rival edges share the same mutual id
    function hasRival(
        bytes32 edgeId
    ) external view returns (bool);

    /// @notice The confirmed rival of this mutual id
    ///         Returns 0 if one does not exist
    function confirmedRival(
        bytes32 mutualId
    ) external view returns (bytes32);

    /// @notice Does the edge have at least one rival, and it has length one
    function hasLengthOneRival(
        bytes32 edgeId
    ) external view returns (bool);

    /// @notice The amount of time this edge has spent without rivals
    ///         This value is increasing whilst an edge is unrivaled, once a rival is created
    ///         it is fixed. If an edge has rivals from the moment it is created then it will have
    ///         a zero time unrivaled
    function timeUnrivaled(
        bytes32 edgeId
    ) external view returns (uint256);

    /// @notice Get the id of the prev assertion that this edge is originates from
    /// @dev    Uses the parent chain to traverse upwards SmallStep->BigStep->Block->Assertion
    ///         until it gets to the origin assertion
    function getPrevAssertionHash(
        bytes32 edgeId
    ) external view returns (bytes32);

    /// @notice Fetch the raw first rival record for the given mutual id
    /// @dev    Returns 0 if there is no edge with the given mutual id
    ///         Returns a magic value if there is one edge but it is unrivaled
    ///         Returns the id of the second edge created with the mutual id, if > 1 exists
    function firstRival(
        bytes32 mutualId
    ) external view returns (bytes32);

    /// @notice True if an account has made a layer zero edge with the given mutual id.
    ///         This is only tracked when the validator whitelist is enabled
    function hasMadeLayerZeroRival(
        address account,
        bytes32 mutualId
    ) external view returns (bool);
}

contract EdgeChallengeManager is IEdgeChallengeManager, Initializable {
    using EdgeChallengeManagerLib for EdgeStore;
    using ChallengeEdgeLib for ChallengeEdge;
    using SafeERC20 for IERC20;

    /// @notice A new edge has been added to the challenge manager
    /// @param edgeId       The id of the newly added edge
    /// @param mutualId     The mutual id of the added edge - all rivals share the same mutual id
    /// @param originId     The origin id of the added edge - origin ids link an edge to the level below
    /// @param hasRival     Does the newly added edge have a rival upon creation
    /// @param length       The length of the new edge
    /// @param level        The level of the new edge
    /// @param isLayerZero  Whether the new edge was added at layer zero - has a claim and a staker
    event EdgeAdded(
        bytes32 indexed edgeId,
        bytes32 indexed mutualId,
        bytes32 indexed originId,
        bytes32 claimId,
        uint256 length,
        uint8 level,
        bool hasRival,
        bool isLayerZero
    );

    /// @notice An edge has been bisected
    /// @param edgeId                   The id of the edge that was bisected
    /// @param lowerChildId             The id of the lower child created during bisection
    /// @param upperChildId             The id of the upper child created during bisection
    /// @param lowerChildAlreadyExists  When an edge is bisected the lower child may already exist - created by a rival.
    event EdgeBisected(
        bytes32 indexed edgeId,
        bytes32 indexed lowerChildId,
        bytes32 indexed upperChildId,
        bool lowerChildAlreadyExists
    );

    /// @notice An edge can be confirmed if the cumulative time (in blocks) unrivaled of it and a direct chain of ancestors is greater than a threshold
    /// @param edgeId               The edge that was confirmed
    /// @param mutualId             The mutual id of the confirmed edge
    /// @param totalTimeUnrivaled   The cumulative amount of time (in blocks) this edge spent unrivaled
    event EdgeConfirmedByTime(
        bytes32 indexed edgeId, bytes32 indexed mutualId, uint256 totalTimeUnrivaled
    );

    /// @notice A SmallStep edge of length 1 can be confirmed via a one step proof
    /// @param edgeId   The edge that was confirmed
    /// @param mutualId The mutual id of the confirmed edge
    event EdgeConfirmedByOneStepProof(bytes32 indexed edgeId, bytes32 indexed mutualId);

    /// @notice An edge's timer cache has been updated
    /// @param edgeId   The edge that was updated
    /// @param newValue The new value of its timer cache
    event TimerCacheUpdated(bytes32 indexed edgeId, uint256 newValue);

    /// @notice A stake has been refunded for a confirmed layer zero block edge
    /// @param edgeId       The edge that was confirmed
    /// @param mutualId     The mutual id of the confirmed edge
    /// @param stakeToken   The ERC20 being refunded
    /// @param stakeAmount  The amount of tokens being refunded
    event EdgeRefunded(
        bytes32 indexed edgeId, bytes32 indexed mutualId, address stakeToken, uint256 stakeAmount
    );

    /// @dev Store for all edges and rival data
    ///      All edges, including edges from different challenges, are stored together in the same store
    ///      Since edge ids include the origin id, which is unique for each challenge, we can be sure that
    ///      edges from different challenges cannot have the same id, and so can be stored in the same store
    EdgeStore internal store;

    /// @notice When creating a zero layer block edge a stake must be supplied. However since we know that only
    ///         one edge in a group of rivals can ever be confirmed, we only need to keep one stake in this contract
    ///         to later refund for that edge. Other stakes can immediately be sent to an excess stake receiver.
    ///         This excess stake receiver can then choose to refund the gas of participants who aided in the confirmation
    ///         of the winning edge
    address public excessStakeReceiver;

    /// @notice The token to supply stake in
    IERC20 public stakeToken;

    /// @notice The amount of stake token to be supplied when creating a zero layer block edge at a given level
    uint256[] public stakeAmounts;

    /// @notice The number of blocks accumulated on an edge before it can be confirmed by time
    uint64 public challengePeriodBlocks;

    /// @notice The assertion chain about which challenges are created
    IAssertionChain public assertionChain;

    /// @inheritdoc IEdgeChallengeManager
    IOneStepProofEntry public override oneStepProofEntry;

    /// @notice The end height of layer zero Block edges
    uint256 public LAYERZERO_BLOCKEDGE_HEIGHT;
    /// @notice The end height of layer zero BigStep edges
    uint256 public LAYERZERO_BIGSTEPEDGE_HEIGHT;
    /// @notice The end height of layer zero SmallStep edges
    uint256 public LAYERZERO_SMALLSTEPEDGE_HEIGHT;
    /// @notice The number of big step levels configured for this challenge manager
    ///         There is 1 block level, 1 small step level and N big step levels
    uint8 public NUM_BIGSTEP_LEVEL;

    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc IEdgeChallengeManager
    function initialize(
        IAssertionChain _assertionChain,
        uint64 _challengePeriodBlocks,
        IOneStepProofEntry _oneStepProofEntry,
        uint256 layerZeroBlockEdgeHeight,
        uint256 layerZeroBigStepEdgeHeight,
        uint256 layerZeroSmallStepEdgeHeight,
        IERC20 _stakeToken,
        address _excessStakeReceiver,
        uint8 _numBigStepLevel,
        uint256[] calldata _stakeAmounts
    ) public initializer {
        if (address(_assertionChain) == address(0)) {
            revert EmptyAssertionChain();
        }
        assertionChain = _assertionChain;
        if (address(_oneStepProofEntry) == address(0)) {
            revert EmptyOneStepProofEntry();
        }
        oneStepProofEntry = _oneStepProofEntry;
        if (_challengePeriodBlocks == 0) {
            revert EmptyChallengePeriod();
        }
        challengePeriodBlocks = _challengePeriodBlocks;

        stakeToken = _stakeToken;
        if (_excessStakeReceiver == address(0)) {
            revert EmptyStakeReceiver();
        }
        excessStakeReceiver = _excessStakeReceiver;

        if (!EdgeChallengeManagerLib.isPowerOfTwo(layerZeroBlockEdgeHeight)) {
            revert NotPowerOfTwo(layerZeroBlockEdgeHeight);
        }
        LAYERZERO_BLOCKEDGE_HEIGHT = layerZeroBlockEdgeHeight;
        if (!EdgeChallengeManagerLib.isPowerOfTwo(layerZeroBigStepEdgeHeight)) {
            revert NotPowerOfTwo(layerZeroBigStepEdgeHeight);
        }
        LAYERZERO_BIGSTEPEDGE_HEIGHT = layerZeroBigStepEdgeHeight;
        if (!EdgeChallengeManagerLib.isPowerOfTwo(layerZeroSmallStepEdgeHeight)) {
            revert NotPowerOfTwo(layerZeroSmallStepEdgeHeight);
        }
        LAYERZERO_SMALLSTEPEDGE_HEIGHT = layerZeroSmallStepEdgeHeight;

        // ensure that there is at least on of each type of level
        if (_numBigStepLevel == 0) {
            revert ZeroBigStepLevels();
        }
        // ensure there's also space for the block level and the small step level
        // in total level parameters
        if (_numBigStepLevel > 253) {
            revert BigStepLevelsTooMany(_numBigStepLevel);
        }
        NUM_BIGSTEP_LEVEL = _numBigStepLevel;

        if (_numBigStepLevel + 2 != _stakeAmounts.length) {
            revert StakeAmountsMismatch(_stakeAmounts.length, _numBigStepLevel + 2);
        }
        stakeAmounts = _stakeAmounts;
    }

    /////////////////////////////
    // STATE MUTATING SECTIION //
    /////////////////////////////

    /// @inheritdoc IEdgeChallengeManager
    function createLayerZeroEdge(
        CreateEdgeArgs calldata args
    ) external returns (bytes32) {
        // Check if whitelist is enabled in the Rollup
        // We only enforce whitelist in this function as it may exhaust resources
        bool whitelistEnabled = !assertionChain.validatorWhitelistDisabled();

        if (whitelistEnabled && !assertionChain.isValidator(msg.sender)) {
            revert NotValidator(msg.sender);
        }

        EdgeAddedData memory edgeAdded;
        EdgeType eType = ChallengeEdgeLib.levelToType(args.level, NUM_BIGSTEP_LEVEL);
        uint256 expectedEndHeight = getLayerZeroEndHeight(eType);
        AssertionReferenceData memory ard;

        if (eType == EdgeType.Block) {
            // for block type edges we need to provide some extra assertion data context
            if (args.proof.length == 0) {
                revert EmptyEdgeSpecificProof();
            }
            (
                ,
                AssertionStateData memory predecessorStateData,
                AssertionStateData memory claimStateData
            ) = abi.decode(args.proof, (bytes32[], AssertionStateData, AssertionStateData));

            assertionChain.validateAssertionHash(
                args.claimId,
                claimStateData.assertionState,
                claimStateData.prevAssertionHash,
                claimStateData.inboxAcc
            );

            assertionChain.validateAssertionHash(
                claimStateData.prevAssertionHash,
                predecessorStateData.assertionState,
                predecessorStateData.prevAssertionHash,
                predecessorStateData.inboxAcc
            );

            if (args.endHistoryRoot != claimStateData.assertionState.endHistoryRoot) {
                revert EndHistoryRootMismatch(
                    args.endHistoryRoot, claimStateData.assertionState.endHistoryRoot
                );
            }

            ard = AssertionReferenceData(
                args.claimId,
                claimStateData.prevAssertionHash,
                assertionChain.isPending(args.claimId),
                assertionChain.getSecondChildCreationBlock(claimStateData.prevAssertionHash) > 0,
                predecessorStateData.assertionState,
                claimStateData.assertionState
            );
        }
        edgeAdded = store.createLayerZeroEdge(
            args, ard, oneStepProofEntry, expectedEndHeight, NUM_BIGSTEP_LEVEL, whitelistEnabled
        );

        IERC20 st = stakeToken;
        uint256 sa = stakeAmounts[args.level];
        // when a zero layer edge is created it must include stake amount. Each time a zero layer
        // edge is created it forces the honest participants to do some work, so we want to disincentive
        // their creation. The amount should also be enough to pay for the gas costs incurred by the honest
        // participant. This can be arranged out of bound by the excess stake receiver.
        // The contract initializer can disable staking by setting zeros for token or amount, to change
        // this a new challenge manager needs to be deployed and its address updated in the assertion chain
        if (address(st) != address(0) && sa != 0) {
            // since only one edge in a group of rivals can ever be confirmed, we know that we
            // will never need to refund more than one edge. Therefore we can immediately send
            // all stakes provided after the first one to an excess stake receiver.
            address receiver = edgeAdded.hasRival ? excessStakeReceiver : address(this);
            st.safeTransferFrom(msg.sender, receiver, sa);
        }

        emit EdgeAdded(
            edgeAdded.edgeId,
            edgeAdded.mutualId,
            edgeAdded.originId,
            edgeAdded.claimId,
            edgeAdded.length,
            edgeAdded.level,
            edgeAdded.hasRival,
            edgeAdded.isLayerZero
        );
        return edgeAdded.edgeId;
    }

    /// @inheritdoc IEdgeChallengeManager
    function bisectEdge(
        bytes32 edgeId,
        bytes32 bisectionHistoryRoot,
        bytes calldata prefixProof
    ) external returns (bytes32, bytes32) {
        (
            bytes32 lowerChildId,
            EdgeAddedData memory lowerChildAdded,
            EdgeAddedData memory upperChildAdded
        ) = store.bisectEdge(edgeId, bisectionHistoryRoot, prefixProof);

        bool lowerChildAlreadyExists = lowerChildAdded.edgeId == 0;
        // the lower child might already exist, if it didnt then a new
        // edge was added
        if (!lowerChildAlreadyExists) {
            emit EdgeAdded(
                lowerChildAdded.edgeId,
                lowerChildAdded.mutualId,
                lowerChildAdded.originId,
                lowerChildAdded.claimId,
                lowerChildAdded.length,
                lowerChildAdded.level,
                lowerChildAdded.hasRival,
                lowerChildAdded.isLayerZero
            );
        }
        // upper child is always added
        emit EdgeAdded(
            upperChildAdded.edgeId,
            upperChildAdded.mutualId,
            upperChildAdded.originId,
            upperChildAdded.claimId,
            upperChildAdded.length,
            upperChildAdded.level,
            upperChildAdded.hasRival,
            upperChildAdded.isLayerZero
        );

        emit EdgeBisected(edgeId, lowerChildId, upperChildAdded.edgeId, lowerChildAlreadyExists);

        return (lowerChildId, upperChildAdded.edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function multiUpdateTimeCacheByChildren(
        bytes32[] calldata edgeIds,
        uint256 maximumCachedTime
    ) public {
        if (edgeIds.length == 0) revert EmptyArray();
        // revert early if the last edge already has sufficient time
        store.validateCurrentTimer(edgeIds[edgeIds.length - 1], maximumCachedTime);
        for (uint256 i = 0; i < edgeIds.length; i++) {
            updateTimerCacheByChildren(edgeIds[i], type(uint256).max);
        }
    }

    /// @inheritdoc IEdgeChallengeManager
    function updateTimerCacheByChildren(bytes32 edgeId, uint256 maximumCachedTime) public {
        (bool updated, uint256 newValue) =
            store.updateTimerCacheByChildren(edgeId, maximumCachedTime);
        if (updated) emit TimerCacheUpdated(edgeId, newValue);
    }

    /// @inheritdoc IEdgeChallengeManager
    function updateTimerCacheByClaim(
        bytes32 edgeId,
        bytes32 claimingEdgeId,
        uint256 maximumCachedTime
    ) public {
        (bool updated, uint256 newValue) = store.updateTimerCacheByClaim(
            edgeId, claimingEdgeId, NUM_BIGSTEP_LEVEL, maximumCachedTime
        );
        if (updated) emit TimerCacheUpdated(edgeId, newValue);
    }

    /// @inheritdoc IEdgeChallengeManager
    function confirmEdgeByTime(bytes32 edgeId, AssertionStateData calldata claimStateData) public {
        ChallengeEdge storage topEdge = store.get(edgeId);
        if (!topEdge.isLayerZero()) {
            revert EdgeNotLayerZero(topEdge.id(), topEdge.staker, topEdge.claimId);
        }

        uint64 assertionBlocks = 0;
        // if the edge is block level and the assertion being claimed against was the first child of its predecessor
        // then we are able to count the time between the first and second child as time towards
        // the this edge
        bool isBlockLevel =
            ChallengeEdgeLib.levelToType(topEdge.level, NUM_BIGSTEP_LEVEL) == EdgeType.Block;
        if (isBlockLevel && assertionChain.isFirstChild(topEdge.claimId)) {
            assertionChain.validateAssertionHash(
                topEdge.claimId,
                claimStateData.assertionState,
                claimStateData.prevAssertionHash,
                claimStateData.inboxAcc
            );
            assertionBlocks = assertionChain.getSecondChildCreationBlock(
                claimStateData.prevAssertionHash
            ) - assertionChain.getFirstChildCreationBlock(claimStateData.prevAssertionHash);
        }

        uint256 totalTimeUnrivaled =
            store.confirmEdgeByTime(edgeId, assertionBlocks, challengePeriodBlocks);

        emit EdgeConfirmedByTime(edgeId, store.edges[edgeId].mutualId(), totalTimeUnrivaled);
    }

    /// @inheritdoc IEdgeChallengeManager
    function confirmEdgeByOneStepProof(
        bytes32 edgeId,
        OneStepData calldata oneStepData,
        ConfigData calldata prevConfig,
        bytes32[] calldata beforeHistoryInclusionProof,
        bytes32[] calldata afterHistoryInclusionProof
    ) public {
        bytes32 prevAssertionHash = store.getPrevAssertionHash(edgeId);

        assertionChain.validateConfig(prevAssertionHash, prevConfig);

        ExecutionContext memory execCtx = ExecutionContext({
            maxInboxMessagesRead: prevConfig.nextInboxPosition,
            bridge: assertionChain.bridge(),
            initialWasmModuleRoot: prevConfig.wasmModuleRoot
        });

        store.confirmEdgeByOneStepProof(
            edgeId,
            oneStepProofEntry,
            oneStepData,
            execCtx,
            beforeHistoryInclusionProof,
            afterHistoryInclusionProof,
            NUM_BIGSTEP_LEVEL,
            LAYERZERO_BIGSTEPEDGE_HEIGHT,
            LAYERZERO_SMALLSTEPEDGE_HEIGHT
        );

        emit EdgeConfirmedByOneStepProof(edgeId, store.edges[edgeId].mutualId());
    }

    /// @inheritdoc IEdgeChallengeManager
    function refundStake(
        bytes32 edgeId
    ) public {
        ChallengeEdge storage edge = store.get(edgeId);
        // setting refunded also do checks that the edge cannot be refunded twice
        edge.setRefunded();

        IERC20 st = stakeToken;
        uint256 sa = stakeAmounts[edge.level];
        // no need to refund with the token or amount where zero'd out
        if (address(st) != address(0) && sa != 0) {
            st.safeTransfer(edge.staker, sa);
        }

        emit EdgeRefunded(edgeId, store.edges[edgeId].mutualId(), address(st), sa);
    }

    ///////////////////////
    // VIEW ONLY SECTION //
    ///////////////////////
    /// @inheritdoc IEdgeChallengeManager
    function getLayerZeroEndHeight(
        EdgeType eType
    ) public view returns (uint256) {
        if (eType == EdgeType.Block) {
            return LAYERZERO_BLOCKEDGE_HEIGHT;
        } else if (eType == EdgeType.BigStep) {
            return LAYERZERO_BIGSTEPEDGE_HEIGHT;
        } else if (eType == EdgeType.SmallStep) {
            return LAYERZERO_SMALLSTEPEDGE_HEIGHT;
        } else {
            revert InvalidEdgeType(eType);
        }
    }

    /// @inheritdoc IEdgeChallengeManager
    function calculateEdgeId(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight,
        bytes32 endHistoryRoot
    ) public pure returns (bytes32) {
        return ChallengeEdgeLib.idComponent(
            level, originId, startHeight, startHistoryRoot, endHeight, endHistoryRoot
        );
    }

    /// @inheritdoc IEdgeChallengeManager
    function calculateMutualId(
        uint8 level,
        bytes32 originId,
        uint256 startHeight,
        bytes32 startHistoryRoot,
        uint256 endHeight
    ) public pure returns (bytes32) {
        return ChallengeEdgeLib.mutualIdComponent(
            level, originId, startHeight, startHistoryRoot, endHeight
        );
    }

    /// @inheritdoc IEdgeChallengeManager
    function edgeExists(
        bytes32 edgeId
    ) public view returns (bool) {
        return store.edges[edgeId].exists();
    }

    /// @inheritdoc IEdgeChallengeManager
    function getEdge(
        bytes32 edgeId
    ) public view returns (ChallengeEdge memory) {
        return store.get(edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function edgeLength(
        bytes32 edgeId
    ) public view returns (uint256) {
        return store.get(edgeId).length();
    }

    /// @inheritdoc IEdgeChallengeManager
    function hasRival(
        bytes32 edgeId
    ) public view returns (bool) {
        return store.hasRival(edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function confirmedRival(
        bytes32 mutualId
    ) public view returns (bytes32) {
        return store.confirmedRivals[mutualId];
    }

    /// @inheritdoc IEdgeChallengeManager
    function hasLengthOneRival(
        bytes32 edgeId
    ) public view returns (bool) {
        return store.hasLengthOneRival(edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function timeUnrivaled(
        bytes32 edgeId
    ) public view returns (uint256) {
        return store.timeUnrivaled(edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function getPrevAssertionHash(
        bytes32 edgeId
    ) public view returns (bytes32) {
        return store.getPrevAssertionHash(edgeId);
    }

    /// @inheritdoc IEdgeChallengeManager
    function firstRival(
        bytes32 mutualId
    ) public view returns (bytes32) {
        return store.firstRivals[mutualId];
    }

    /// @inheritdoc IEdgeChallengeManager
    function hasMadeLayerZeroRival(
        address account,
        bytes32 mutualId
    ) external view returns (bool) {
        return store.hasMadeLayerZeroRival[account][mutualId];
    }
}