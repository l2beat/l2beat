// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

interface IRollupUser is IRollupUserAbs {
    function newStakeOnExistingNode(uint64 nodeNum, bytes32 nodeHash) external payable;

    function newStakeOnNewNode(
        Assertion calldata assertion,
        bytes32 expectedNodeHash,
        uint256 prevNodeInboxMaxCount
    ) external payable;

    function addToDeposit(address stakerAddress) external payable;
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
     */
    bool private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Modifier to protect an initializer function from being invoked twice.
     */
    modifier initializer() {
        // If the contract is initializing we ignore whether _initialized is set in order to support multiple
        // inheritance patterns, but we only do this in the context of a constructor, because in other contexts the
        // contract may have been reentered.
        require(_initializing ? _isConstructor() : !_initialized, "Initializable: contract is already initialized");

        bool isTopLevelCall = !_initializing;
        if (isTopLevelCall) {
            _initializing = true;
            _initialized = true;
        }

        _;

        if (isTopLevelCall) {
            _initializing = false;
        }
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} modifier, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    function _isConstructor() private view returns (bool) {
        return !AddressUpgradeable.isContract(address(this));
    }
}

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

abstract contract PausableUpgradeable is Initializable, ContextUpgradeable {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    function __Pausable_init() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    function __Pausable_init_unchained() internal onlyInitializing {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        require(!paused(), "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        require(paused(), "Pausable: not paused");
        _;
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

library ArbitrumChecker {
    function runningOnArbitrum() internal view returns (bool) {
        (bool ok, bytes memory data) = address(100).staticcall(
            abi.encodeWithSelector(ArbSys.arbOSVersion.selector)
        );
        return ok && data.length == 32;
    }
}

abstract contract RollupCore is IRollupCore, PausableUpgradeable {
    using NodeLib for Node;
    using GlobalStateLib for GlobalState;

    // Rollup Config
    uint64 public confirmPeriodBlocks;
    uint64 public extraChallengeTimeBlocks;
    uint256 public chainId;
    uint256 public baseStake;
    bytes32 public wasmModuleRoot;

    IInboxBase public inbox;
    IBridge public bridge;
    IOutbox public outbox;
    ISequencerInbox public sequencerInbox;
    IRollupEventInbox public rollupEventInbox;
    IChallengeManager public override challengeManager;

    // misc useful contracts when interacting with the rollup
    address public validatorUtils;
    address public validatorWalletCreator;

    // when a staker loses a challenge, half of their funds get escrowed in this address
    address public loserStakeEscrow;
    address public stakeToken;
    uint256 public minimumAssertionPeriod;

    mapping(address => bool) public isValidator;

    // Stakers become Zombies after losing a challenge
    struct Zombie {
        address stakerAddress;
        uint64 latestStakedNode;
    }

    uint64 private _latestConfirmed;
    uint64 private _firstUnresolvedNode;
    uint64 private _latestNodeCreated;
    uint64 private _lastStakeBlock;
    mapping(uint64 => Node) private _nodes;
    mapping(uint64 => mapping(address => bool)) private _nodeStakers;

    address[] private _stakerList;
    mapping(address => Staker) public _stakerMap;

    Zombie[] private _zombies;

    mapping(address => uint256) private _withdrawableFunds;
    uint256 public totalWithdrawableFunds;
    uint256 public rollupDeploymentBlock;

    // The node number of the initial node
    uint64 internal constant GENESIS_NODE = 0;

    bool public validatorWhitelistDisabled;
    address public anyTrustFastConfirmer;

    // If the chain this RollupCore is deployed on is an Arbitrum chain.
    bool internal immutable _hostChainIsArbitrum = ArbitrumChecker.runningOnArbitrum();
    // If the chain RollupCore is deployed on, this will contain the ArbSys.blockNumber() at each node's creation.
    mapping(uint64 => uint256) internal _nodeCreatedAtArbSysBlock;

    /**
     * @notice Get a storage reference to the Node for the given node index
     * @param nodeNum Index of the node
     * @return Node struct
     */
    function getNodeStorage(uint64 nodeNum) internal view returns (Node storage) {
        return _nodes[nodeNum];
    }

    /**
     * @notice Get the Node for the given index.
     */
    function getNode(uint64 nodeNum) public view override returns (Node memory) {
        return getNodeStorage(nodeNum);
    }

    /**
     * @notice Returns the block in which the given node was created for looking up its creation event.
     * Unlike the Node's createdAtBlock field, this will be the ArbSys blockNumber if the host chain is an Arbitrum chain.
     * That means that the block number returned for this is usable for event queries.
     * This function will revert if the given node number does not exist.
     * @dev This function is meant for internal use only and has no stability guarantees.
     */
    function getNodeCreationBlockForLogLookup(uint64 nodeNum)
        external
        view
        override
        returns (uint256)
    {
        if (_hostChainIsArbitrum) {
            uint256 blockNum = _nodeCreatedAtArbSysBlock[nodeNum];
            require(blockNum > 0, "NO_NODE");
            return blockNum;
        } else {
            Node storage node = getNodeStorage(nodeNum);
            require(node.deadlineBlock != 0, "NO_NODE");
            return node.createdAtBlock;
        }
    }

    /**
     * @notice Check if the specified node has been staked on by the provided staker.
     * Only accurate at the latest confirmed node and afterwards.
     */
    function nodeHasStaker(uint64 nodeNum, address staker) public view override returns (bool) {
        return _nodeStakers[nodeNum][staker];
    }

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(uint64 stakerNum) external view override returns (address) {
        return _stakerList[stakerNum];
    }

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(address staker) public view override returns (bool) {
        return _stakerMap[staker].isStaked;
    }

    /**
     * @notice Check whether the given staker is staked on the latest confirmed node,
     * which includes if the staker is staked on a descendent of the latest confirmed node.
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStakedOnLatestConfirmed(address staker) public view returns (bool) {
        return _stakerMap[staker].isStaked && nodeHasStaker(_latestConfirmed, staker);
    }

    /**
     * @notice Get the latest staked node of the given staker
     * @param staker Staker address to lookup
     * @return Latest node staked of the staker
     */
    function latestStakedNode(address staker) public view override returns (uint64) {
        return _stakerMap[staker].latestStakedNode;
    }

    /**
     * @notice Get the current challenge of the given staker
     * @param staker Staker address to lookup
     * @return Current challenge of the staker
     */
    function currentChallenge(address staker) public view override returns (uint64) {
        return _stakerMap[staker].currentChallenge;
    }

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(address staker) public view override returns (uint256) {
        return _stakerMap[staker].amountStaked;
    }

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(address staker) external view override returns (Staker memory) {
        return _stakerMap[staker];
    }

    /**
     * @notice Get the original staker address of the zombie at the given index
     * @param zombieNum Index of the zombie to lookup
     * @return Original staker address of the zombie
     */
    function zombieAddress(uint256 zombieNum) public view override returns (address) {
        return _zombies[zombieNum].stakerAddress;
    }

    /**
     * @notice Get Latest node that the given zombie at the given index is staked on
     * @param zombieNum Index of the zombie to lookup
     * @return Latest node that the given zombie is staked on
     */
    function zombieLatestStakedNode(uint256 zombieNum) public view override returns (uint64) {
        return _zombies[zombieNum].latestStakedNode;
    }

    /**
     * @notice Retrieves stored information about a requested zombie
     * @param zombieNum Index of the zombie to lookup
     * @return A structure with information about the requested staker
     */
    function getZombieStorage(uint256 zombieNum) internal view returns (Zombie storage) {
        return _zombies[zombieNum];
    }

    /// @return Current number of un-removed zombies
    function zombieCount() public view override returns (uint256) {
        return _zombies.length;
    }

    function isZombie(address staker) public view override returns (bool) {
        for (uint256 i = 0; i < _zombies.length; i++) {
            if (staker == _zombies[i].stakerAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param user Address to check the funds of
     * @return Amount of funds withdrawable by user
     */
    function withdrawableFunds(address user) external view override returns (uint256) {
        return _withdrawableFunds[user];
    }

    /**
     * @return Index of the first unresolved node
     * @dev If all nodes have been resolved, this will be latestNodeCreated + 1
     */
    function firstUnresolvedNode() public view override returns (uint64) {
        return _firstUnresolvedNode;
    }

    /// @return Index of the latest confirmed node
    function latestConfirmed() public view override returns (uint64) {
        return _latestConfirmed;
    }

    /// @return Index of the latest rollup node created
    function latestNodeCreated() public view override returns (uint64) {
        return _latestNodeCreated;
    }

    /// @return Ethereum block that the most recent stake was created
    function lastStakeBlock() external view override returns (uint64) {
        return _lastStakeBlock;
    }

    /// @return Number of active stakers currently staked
    function stakerCount() public view override returns (uint64) {
        return uint64(_stakerList.length);
    }

    /**
     * @notice Initialize the core with an initial node
     * @param initialNode Initial node to start the chain with
     */
    function initializeCore(Node memory initialNode) internal {
        __Pausable_init();
        _nodes[GENESIS_NODE] = initialNode;
        _firstUnresolvedNode = GENESIS_NODE + 1;
        if (_hostChainIsArbitrum) {
            _nodeCreatedAtArbSysBlock[GENESIS_NODE] = ArbSys(address(100)).arbBlockNumber();
        }
    }

    /**
     * @notice React to a new node being created by storing it an incrementing the latest node counter
     * @param node Node that was newly created
     */
    function nodeCreated(Node memory node) internal {
        _latestNodeCreated++;
        _nodes[_latestNodeCreated] = node;
        if (_hostChainIsArbitrum) {
            _nodeCreatedAtArbSysBlock[_latestNodeCreated] = ArbSys(address(100)).arbBlockNumber();
        }
    }

    /// @notice Reject the next unresolved node
    function _rejectNextNode() internal {
        _firstUnresolvedNode++;
    }

    function confirmNode(
        uint64 nodeNum,
        bytes32 blockHash,
        bytes32 sendRoot
    ) internal {
        Node storage node = getNodeStorage(nodeNum);
        // Authenticate data against node's confirm data pre-image
        require(node.confirmData == RollupLib.confirmHash(blockHash, sendRoot), "CONFIRM_DATA");

        // trusted external call to outbox
        outbox.updateSendRoot(sendRoot, blockHash);

        _latestConfirmed = nodeNum;
        _firstUnresolvedNode = nodeNum + 1;

        emit NodeConfirmed(nodeNum, blockHash, sendRoot);
    }

    /**
     * @notice Create a new stake at latest confirmed node
     * @param stakerAddress Address of the new staker
     * @param depositAmount Stake amount of the new staker
     */
    function createNewStake(address stakerAddress, uint256 depositAmount) internal {
        uint64 stakerIndex = uint64(_stakerList.length);
        _stakerList.push(stakerAddress);
        _stakerMap[stakerAddress] = Staker(
            depositAmount,
            stakerIndex,
            _latestConfirmed,
            NO_CHAL_INDEX, // new staker is not in challenge
            true
        );
        _nodeStakers[_latestConfirmed][stakerAddress] = true;
        _lastStakeBlock = uint64(block.number);
        emit UserStakeUpdated(stakerAddress, 0, depositAmount);
    }

    /**
     * @notice Check to see whether the two stakers are in the same challenge
     * @param stakerAddress1 Address of the first staker
     * @param stakerAddress2 Address of the second staker
     * @return Address of the challenge that the two stakers are in
     */
    function inChallenge(address stakerAddress1, address stakerAddress2)
        internal
        view
        returns (uint64)
    {
        Staker storage staker1 = _stakerMap[stakerAddress1];
        Staker storage staker2 = _stakerMap[stakerAddress2];
        uint64 challenge = staker1.currentChallenge;
        require(challenge != NO_CHAL_INDEX, "NO_CHAL");
        require(challenge == staker2.currentChallenge, "DIFF_IN_CHAL");
        return challenge;
    }

    /**
     * @notice Make the given staker as not being in a challenge
     * @param stakerAddress Address of the staker to remove from a challenge
     */
    function clearChallenge(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        staker.currentChallenge = NO_CHAL_INDEX;
    }

    /**
     * @notice Mark both the given stakers as engaged in the challenge
     * @param staker1 Address of the first staker
     * @param staker2 Address of the second staker
     * @param challenge Address of the challenge both stakers are now in
     */
    function challengeStarted(
        address staker1,
        address staker2,
        uint64 challenge
    ) internal {
        _stakerMap[staker1].currentChallenge = challenge;
        _stakerMap[staker2].currentChallenge = challenge;
    }

    /**
     * @notice Add to the stake of the given staker by the given amount
     * @param stakerAddress Address of the staker to increase the stake of
     * @param amountAdded Amount of stake to add to the staker
     */
    function increaseStakeBy(address stakerAddress, uint256 amountAdded) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        uint256 initialStaked = staker.amountStaked;
        uint256 finalStaked = initialStaked + amountAdded;
        staker.amountStaked = finalStaked;
        emit UserStakeUpdated(stakerAddress, initialStaked, finalStaked);
    }

    /**
     * @notice Reduce the stake of the given staker to the given target
     * @param stakerAddress Address of the staker to reduce the stake of
     * @param target Amount of stake to leave with the staker
     * @return Amount of value released from the stake
     */
    function reduceStakeTo(address stakerAddress, uint256 target) internal returns (uint256) {
        Staker storage staker = _stakerMap[stakerAddress];
        uint256 current = staker.amountStaked;
        require(target <= current, "TOO_LITTLE_STAKE");
        uint256 amountWithdrawn = current - target;
        staker.amountStaked = target;
        increaseWithdrawableFunds(stakerAddress, amountWithdrawn);
        emit UserStakeUpdated(stakerAddress, current, target);
        return amountWithdrawn;
    }

    /**
     * @notice Remove the given staker and turn them into a zombie
     * @param stakerAddress Address of the staker to remove
     */
    function turnIntoZombie(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        _zombies.push(Zombie(stakerAddress, staker.latestStakedNode));
        deleteStaker(stakerAddress);
    }

    /**
     * @notice Update the latest staked node of the zombie at the given index
     * @param zombieNum Index of the zombie to move
     * @param latest New latest node the zombie is staked on
     */
    function zombieUpdateLatestStakedNode(uint256 zombieNum, uint64 latest) internal {
        _zombies[zombieNum].latestStakedNode = latest;
    }

    /**
     * @notice Remove the zombie at the given index
     * @param zombieNum Index of the zombie to remove
     */
    function removeZombie(uint256 zombieNum) internal {
        _zombies[zombieNum] = _zombies[_zombies.length - 1];
        _zombies.pop();
    }

    /**
     * @notice Mark the given staker as staked on this node
     * @param staker Address of the staker to mark
     */
    function addStaker(uint64 nodeNum, address staker) internal {
        require(!_nodeStakers[nodeNum][staker], "ALREADY_STAKED");
        _nodeStakers[nodeNum][staker] = true;
        Node storage node = getNodeStorage(nodeNum);
        require(node.deadlineBlock != 0, "NO_NODE");

        uint64 prevCount = node.stakerCount;
        node.stakerCount = prevCount + 1;

        if (nodeNum > GENESIS_NODE) {
            Node storage parent = getNodeStorage(node.prevNum);
            parent.childStakerCount++;
            if (prevCount == 0) {
                parent.newChildConfirmDeadline(uint64(block.number) + confirmPeriodBlocks);
            }
        }
    }

    /**
     * @notice Remove the given staker from this node
     * @param staker Address of the staker to remove
     */
    function removeStaker(uint64 nodeNum, address staker) internal {
        require(_nodeStakers[nodeNum][staker], "NOT_STAKED");
        _nodeStakers[nodeNum][staker] = false;

        Node storage node = getNodeStorage(nodeNum);
        node.stakerCount--;

        if (nodeNum > GENESIS_NODE) {
            getNodeStorage(node.prevNum).childStakerCount--;
        }
    }

    /**
     * @notice Remove the given staker and return their stake
     * This should not be called if the staker is staked on a descendent of the latest confirmed node
     * @param stakerAddress Address of the staker withdrawing their stake
     */
    function withdrawStaker(address stakerAddress) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        uint64 latestConfirmedNum = latestConfirmed();
        if (nodeHasStaker(latestConfirmedNum, stakerAddress)) {
            // Withdrawing a staker whose latest staked node isn't resolved should be impossible
            assert(staker.latestStakedNode == latestConfirmedNum);
            removeStaker(latestConfirmedNum, stakerAddress);
        }
        uint256 initialStaked = staker.amountStaked;
        increaseWithdrawableFunds(stakerAddress, initialStaked);
        deleteStaker(stakerAddress);
        emit UserStakeUpdated(stakerAddress, initialStaked, 0);
    }

    /**
     * @notice Advance the given staker to the given node
     * @param stakerAddress Address of the staker adding their stake
     * @param nodeNum Index of the node to stake on
     */
    function stakeOnNode(address stakerAddress, uint64 nodeNum) internal {
        Staker storage staker = _stakerMap[stakerAddress];
        addStaker(nodeNum, stakerAddress);
        staker.latestStakedNode = nodeNum;
    }

    /**
     * @notice Clear the withdrawable funds for the given address
     * @param account Address of the account to remove funds from
     * @return Amount of funds removed from account
     */
    function withdrawFunds(address account) internal returns (uint256) {
        uint256 amount = _withdrawableFunds[account];
        _withdrawableFunds[account] = 0;
        totalWithdrawableFunds -= amount;
        emit UserWithdrawableFundsUpdated(account, amount, 0);
        return amount;
    }

    /**
     * @notice Increase the withdrawable funds for the given address
     * @param account Address of the account to add withdrawable funds to
     */
    function increaseWithdrawableFunds(address account, uint256 amount) internal {
        uint256 initialWithdrawable = _withdrawableFunds[account];
        uint256 finalWithdrawable = initialWithdrawable + amount;
        _withdrawableFunds[account] = finalWithdrawable;
        totalWithdrawableFunds += amount;
        emit UserWithdrawableFundsUpdated(account, initialWithdrawable, finalWithdrawable);
    }

    /**
     * @notice Remove the given staker
     * @param stakerAddress Address of the staker to remove
     */
    function deleteStaker(address stakerAddress) private {
        Staker storage staker = _stakerMap[stakerAddress];
        require(staker.isStaked, "NOT_STAKED");
        uint64 stakerIndex = staker.index;
        _stakerList[stakerIndex] = _stakerList[_stakerList.length - 1];
        _stakerMap[_stakerList[stakerIndex]].index = stakerIndex;
        _stakerList.pop();
        delete _stakerMap[stakerAddress];
    }

    struct StakeOnNewNodeFrame {
        uint256 currentInboxSize;
        Node node;
        bytes32 executionHash;
        Node prevNode;
        bytes32 lastHash;
        bool hasSibling;
        uint64 deadlineBlock;
        bytes32 sequencerBatchAcc;
    }

    function createNewNode(
        Assertion calldata assertion,
        uint64 prevNodeNum,
        uint256 prevNodeInboxMaxCount,
        bytes32 expectedNodeHash
    ) internal returns (bytes32 newNodeHash) {
        require(
            assertion.afterState.machineStatus == MachineStatus.FINISHED ||
                assertion.afterState.machineStatus == MachineStatus.ERRORED,
            "BAD_AFTER_STATUS"
        );

        StakeOnNewNodeFrame memory memoryFrame;
        {
            // validate data
            memoryFrame.prevNode = getNode(prevNodeNum);
            memoryFrame.currentInboxSize = bridge.sequencerMessageCount();

            // Make sure the previous state is correct against the node being built on
            require(
                RollupLib.stateHash(assertion.beforeState, prevNodeInboxMaxCount) ==
                    memoryFrame.prevNode.stateHash,
                "PREV_STATE_HASH"
            );

            // Ensure that the assertion doesn't read past the end of the current inbox
            uint64 afterInboxCount = assertion.afterState.globalState.getInboxPosition();
            uint64 prevInboxPosition = assertion.beforeState.globalState.getInboxPosition();
            require(afterInboxCount >= prevInboxPosition, "INBOX_BACKWARDS");
            if (afterInboxCount == prevInboxPosition) {
                require(
                    assertion.afterState.globalState.getPositionInMessage() >=
                        assertion.beforeState.globalState.getPositionInMessage(),
                    "INBOX_POS_IN_MSG_BACKWARDS"
                );
            }
            // See validator/assertion.go ExecutionState RequiredBatches() for reasoning
            if (
                assertion.afterState.machineStatus == MachineStatus.ERRORED ||
                assertion.afterState.globalState.getPositionInMessage() > 0
            ) {
                // The current inbox message was read
                afterInboxCount++;
            }
            require(afterInboxCount <= memoryFrame.currentInboxSize, "INBOX_PAST_END");
            // This gives replay protection against the state of the inbox
            if (afterInboxCount > 0) {
                memoryFrame.sequencerBatchAcc = bridge.sequencerInboxAccs(afterInboxCount - 1);
            }
        }

        {
            memoryFrame.executionHash = RollupLib.executionHash(assertion);

            memoryFrame.deadlineBlock = uint64(block.number) + confirmPeriodBlocks;

            memoryFrame.hasSibling = memoryFrame.prevNode.latestChildNumber > 0;
            // here we don't use ternacy operator to remain compatible with slither
            if (memoryFrame.hasSibling) {
                memoryFrame.lastHash = getNodeStorage(memoryFrame.prevNode.latestChildNumber)
                    .nodeHash;
            } else {
                memoryFrame.lastHash = memoryFrame.prevNode.nodeHash;
            }

            newNodeHash = RollupLib.nodeHash(
                memoryFrame.hasSibling,
                memoryFrame.lastHash,
                memoryFrame.executionHash,
                memoryFrame.sequencerBatchAcc,
                wasmModuleRoot
            );
            require(
                newNodeHash == expectedNodeHash || expectedNodeHash == bytes32(0),
                "UNEXPECTED_NODE_HASH"
            );

            memoryFrame.node = NodeLib.createNode(
                RollupLib.stateHash(assertion.afterState, memoryFrame.currentInboxSize),
                RollupLib.challengeRootHash(
                    memoryFrame.executionHash,
                    block.number,
                    wasmModuleRoot
                ),
                RollupLib.confirmHash(assertion),
                prevNodeNum,
                memoryFrame.deadlineBlock,
                newNodeHash
            );
        }

        {
            uint64 nodeNum = latestNodeCreated() + 1;

            // Fetch a storage reference to prevNode since we copied our other one into memory
            // and we don't have enough stack available to keep to keep the previous storage reference around
            Node storage prevNode = getNodeStorage(prevNodeNum);
            prevNode.childCreated(nodeNum);

            nodeCreated(memoryFrame.node);
        }

        emit NodeCreated(
            latestNodeCreated(),
            memoryFrame.prevNode.nodeHash,
            newNodeHash,
            memoryFrame.executionHash,
            assertion,
            memoryFrame.sequencerBatchAcc,
            wasmModuleRoot,
            memoryFrame.currentInboxSize
        );

        return newNodeHash;
    }
}

interface IERC1822Proxiable {
    /**
     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
     * address.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy.
     */
    function proxiableUUID() external view returns (bytes32);
}

abstract contract ERC1967Upgrade {
    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Emitted when the implementation is upgraded.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform implementation upgrade
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Perform implementation upgrade with additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlot.getBooleanSlot(_ROLLBACK_SLOT).value) {
            _setImplementation(newImplementation);
        } else {
            try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
            } catch {
                revert("ERC1967Upgrade: new implementation is not UUPS");
            }
            _upgradeToAndCall(newImplementation, data, forceCall);
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Emitted when the admin account has changed.
     */
    event AdminChanged(address previousAdmin, address newAdmin);

    /**
     * @dev Returns the current admin.
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        StorageSlot.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {AdminChanged} event.
     */
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
     */
    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Emitted when the beacon is upgraded.
     */
    event BeaconUpgraded(address indexed beacon);

    /**
     * @dev Returns the current beacon.
     */
    function _getBeacon() internal view returns (address) {
        return StorageSlot.getAddressSlot(_BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        require(Address.isContract(newBeacon), "ERC1967: new beacon is not a contract");
        require(
            Address.isContract(IBeacon(newBeacon).implementation()),
            "ERC1967: beacon implementation is not a contract"
        );
        StorageSlot.getAddressSlot(_BEACON_SLOT).value = newBeacon;
    }

    /**
     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
     *
     * Emits a {BeaconUpgraded} event.
     */
    function _upgradeBeaconToAndCall(
        address newBeacon,
        bytes memory data,
        bool forceCall
    ) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(IBeacon(newBeacon).implementation(), data);
        }
    }
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

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly {
            r.slot := slot
        }
    }
}

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

abstract contract DoubleLogicERC1967Upgrade is ERC1967Upgrade {
    // This is the keccak-256 hash of "eip1967.proxy.implementation.secondary" subtracted by 1
    bytes32 internal constant _IMPLEMENTATION_SECONDARY_SLOT =
        0x2b1dbce74324248c222f0ec2d5ed7bd323cfc425b336f0253c5ccfda7265546d;

    // This is the keccak-256 hash of "eip1967.proxy.rollback.secondary" subtracted by 1
    bytes32 private constant _ROLLBACK_SECONDARY_SLOT =
        0x49bd798cd84788856140a4cd5030756b4d08a9e4d55db725ec195f232d262a89;

    /**
     * @dev Emitted when the secondary implementation is upgraded.
     */
    event UpgradedSecondary(address indexed implementation);

    /**
     * @dev Returns the current secondary implementation address.
     */
    function _getSecondaryImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SECONDARY_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setSecondaryImplementation(address newImplementation) private {
        require(
            Address.isContract(newImplementation),
            "ERC1967: new secondary implementation is not a contract"
        );
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SECONDARY_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform secondary implementation upgrade
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryTo(address newImplementation) internal {
        _setSecondaryImplementation(newImplementation);
        emit UpgradedSecondary(newImplementation);
    }

    /**
     * @dev Perform secondary implementation upgrade with additional setup call.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeSecondaryTo(newImplementation);
        if (data.length > 0 || forceCall) {
            Address.functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform secondary implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {UpgradedSecondary} event.
     */
    function _upgradeSecondaryToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlot.getBooleanSlot(_ROLLBACK_SECONDARY_SLOT).value) {
            _setSecondaryImplementation(newImplementation);
        } else {
            try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(
                    slot == _IMPLEMENTATION_SECONDARY_SLOT,
                    "ERC1967Upgrade: unsupported secondary proxiableUUID"
                );
            } catch {
                revert("ERC1967Upgrade: new secondary implementation is not UUPS");
            }
            _upgradeSecondaryToAndCall(newImplementation, data, forceCall);
        }
    }
}

abstract contract UUPSNotUpgradeable is IERC1822Proxiable, DoubleLogicERC1967Upgrade {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        require(address(this) != __self, "Function must be called through delegatecall");
        require(
            _getSecondaryImplementation() == __self,
            "Function must be called through active proxy"
        );
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(
            address(this) == __self,
            "UUPSNotUpgradeable: must not be called through delegatecall"
        );
        _;
    }

    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate that the this implementation remains valid after an upgrade.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SECONDARY_SLOT;
    }
}

interface IRollupCore {
    struct Staker {
        uint256 amountStaked;
        uint64 index;
        uint64 latestStakedNode;
        // currentChallenge is 0 if staker is not in a challenge
        uint64 currentChallenge;
        bool isStaked;
    }

    event RollupInitialized(bytes32 machineHash, uint256 chainId);

    event NodeCreated(
        uint64 indexed nodeNum,
        bytes32 indexed parentNodeHash,
        bytes32 indexed nodeHash,
        bytes32 executionHash,
        Assertion assertion,
        bytes32 afterInboxBatchAcc,
        bytes32 wasmModuleRoot,
        uint256 inboxMaxCount
    );

    event NodeConfirmed(uint64 indexed nodeNum, bytes32 blockHash, bytes32 sendRoot);

    event NodeRejected(uint64 indexed nodeNum);

    event RollupChallengeStarted(
        uint64 indexed challengeIndex,
        address asserter,
        address challenger,
        uint64 challengedNode
    );

    event UserStakeUpdated(address indexed user, uint256 initialBalance, uint256 finalBalance);

    event UserWithdrawableFundsUpdated(
        address indexed user,
        uint256 initialBalance,
        uint256 finalBalance
    );

    function confirmPeriodBlocks() external view returns (uint64);

    function extraChallengeTimeBlocks() external view returns (uint64);

    function chainId() external view returns (uint256);

    function baseStake() external view returns (uint256);

    function wasmModuleRoot() external view returns (bytes32);

    function bridge() external view returns (IBridge);

    function sequencerInbox() external view returns (ISequencerInbox);

    function outbox() external view returns (IOutbox);

    function rollupEventInbox() external view returns (IRollupEventInbox);

    function challengeManager() external view returns (IChallengeManager);

    function loserStakeEscrow() external view returns (address);

    function stakeToken() external view returns (address);

    function minimumAssertionPeriod() external view returns (uint256);

    function isValidator(address) external view returns (bool);

    function validatorWhitelistDisabled() external view returns (bool);

    /**
     * @notice Get the Node for the given index.
     */
    function getNode(uint64 nodeNum) external view returns (Node memory);

    /**
     * @notice Returns the block in which the given node was created for looking up its creation event.
     * Unlike the Node's createdAtBlock field, this will be the ArbSys blockNumber if the host chain is an Arbitrum chain.
     * That means that the block number returned for this is usable for event queries.
     * This function will revert if the given node number does not exist.
     * @dev This function is meant for internal use only and has no stability guarantees.
     */
    function getNodeCreationBlockForLogLookup(uint64 nodeNum) external view returns (uint256);

    /**
     * @notice Check if the specified node has been staked on by the provided staker.
     * Only accurate at the latest confirmed node and afterwards.
     */
    function nodeHasStaker(uint64 nodeNum, address staker) external view returns (bool);

    /**
     * @notice Get the address of the staker at the given index
     * @param stakerNum Index of the staker
     * @return Address of the staker
     */
    function getStakerAddress(uint64 stakerNum) external view returns (address);

    /**
     * @notice Check whether the given staker is staked
     * @param staker Staker address to check
     * @return True or False for whether the staker was staked
     */
    function isStaked(address staker) external view returns (bool);

    /**
     * @notice Get the latest staked node of the given staker
     * @param staker Staker address to lookup
     * @return Latest node staked of the staker
     */
    function latestStakedNode(address staker) external view returns (uint64);

    /**
     * @notice Get the current challenge of the given staker
     * @param staker Staker address to lookup
     * @return Current challenge of the staker
     */
    function currentChallenge(address staker) external view returns (uint64);

    /**
     * @notice Get the amount staked of the given staker
     * @param staker Staker address to lookup
     * @return Amount staked of the staker
     */
    function amountStaked(address staker) external view returns (uint256);

    /**
     * @notice Retrieves stored information about a requested staker
     * @param staker Staker address to retrieve
     * @return A structure with information about the requested staker
     */
    function getStaker(address staker) external view returns (Staker memory);

    /**
     * @notice Get the original staker address of the zombie at the given index
     * @param zombieNum Index of the zombie to lookup
     * @return Original staker address of the zombie
     */
    function zombieAddress(uint256 zombieNum) external view returns (address);

    /**
     * @notice Get Latest node that the given zombie at the given index is staked on
     * @param zombieNum Index of the zombie to lookup
     * @return Latest node that the given zombie is staked on
     */
    function zombieLatestStakedNode(uint256 zombieNum) external view returns (uint64);

    /// @return Current number of un-removed zombies
    function zombieCount() external view returns (uint256);

    function isZombie(address staker) external view returns (bool);

    /**
     * @notice Get the amount of funds withdrawable by the given address
     * @param owner Address to check the funds of
     * @return Amount of funds withdrawable by owner
     */
    function withdrawableFunds(address owner) external view returns (uint256);

    /**
     * @return Index of the first unresolved node
     * @dev If all nodes have been resolved, this will be latestNodeCreated + 1
     */
    function firstUnresolvedNode() external view returns (uint64);

    /// @return Index of the latest confirmed node
    function latestConfirmed() external view returns (uint64);

    /// @return Index of the latest rollup node created
    function latestNodeCreated() external view returns (uint64);

    /// @return Ethereum block that the most recent stake was created
    function lastStakeBlock() external view returns (uint64);

    /// @return Number of active stakers currently staked
    function stakerCount() external view returns (uint64);
}

interface IOwnable {
    function owner() external view returns (address);
}

interface IRollupUserAbs is IRollupCore, IOwnable {
    /// @dev the user logic just validated configuration and shouldn't write to state during init
    /// this allows the admin logic to ensure consistency on parameters.
    function initialize(address stakeToken) external view;

    function removeWhitelistAfterFork() external;

    function removeWhitelistAfterValidatorAfk() external;

    function isERC20Enabled() external view returns (bool);

    function rejectNextNode(address stakerAddress) external;

    function confirmNextNode(bytes32 blockHash, bytes32 sendRoot) external;

    function fastConfirmNextNode(
        bytes32 blockHash,
        bytes32 sendRoot,
        bytes32 nodeHash
    ) external;

    function stakeOnExistingNode(uint64 nodeNum, bytes32 nodeHash) external;

    function stakeOnNewNode(
        Assertion memory assertion,
        bytes32 expectedNodeHash,
        uint256 prevNodeInboxMaxCount
    ) external;

    function returnOldDeposit(address stakerAddress) external;

    function reduceDeposit(uint256 target) external;

    function removeZombie(uint256 zombieNum, uint256 maxNodes) external;

    function removeOldZombies(uint256 startIndex) external;

    function requiredStake(
        uint256 blockNumber,
        uint64 firstUnresolvedNodeNum,
        uint64 latestCreatedNode
    ) external view returns (uint256);

    function currentRequiredStake() external view returns (uint256);

    function countStakedZombies(uint64 nodeNum) external view returns (uint256);

    function countZombiesStakedOnChildren(uint64 nodeNum) external view returns (uint256);

    function requireUnresolvedExists() external view;

    function requireUnresolved(uint256 nodeNum) external view;

    function withdrawStakerFunds() external returns (uint256);

    function createChallenge(
        address[2] calldata stakers,
        uint64[2] calldata nodeNums,
        MachineStatus[2] calldata machineStatuses,
        GlobalState[2] calldata globalStates,
        uint64 numBlocks,
        bytes32 secondExecutionHash,
        uint256[2] calldata proposedTimes,
        bytes32[2] calldata wasmModuleRoots
    ) external;
}

interface IChallengeResultReceiver {
    function completeChallenge(
        uint256 challengeIndex,
        address winner,
        address loser
    ) external;
}

struct Node {
    // Hash of the state of the chain as of this node
    bytes32 stateHash;
    // Hash of the data that can be challenged
    bytes32 challengeHash;
    // Hash of the data that will be committed if this node is confirmed
    bytes32 confirmData;
    // Index of the node previous to this one
    uint64 prevNum;
    // Deadline at which this node can be confirmed
    uint64 deadlineBlock;
    // Deadline at which a child of this node can be confirmed
    uint64 noChildConfirmedBeforeBlock;
    // Number of stakers staked on this node. This includes real stakers and zombies
    uint64 stakerCount;
    // Number of stakers staked on a child node. This includes real stakers and zombies
    uint64 childStakerCount;
    // This value starts at zero and is set to a value when the first child is created. After that it is constant until the node is destroyed or the owner destroys pending nodes
    uint64 firstChildBlock;
    // The number of the latest child of this node to be created
    uint64 latestChildNumber;
    // The block number when this node was created
    uint64 createdAtBlock;
    // A hash of all the data needed to determine this node's validity, to protect against reorgs
    bytes32 nodeHash;
}

library NodeLib {
    /**
     * @notice Initialize a Node
     * @param _stateHash Initial value of stateHash
     * @param _challengeHash Initial value of challengeHash
     * @param _confirmData Initial value of confirmData
     * @param _prevNum Initial value of prevNum
     * @param _deadlineBlock Initial value of deadlineBlock
     * @param _nodeHash Initial value of nodeHash
     */
    function createNode(
        bytes32 _stateHash,
        bytes32 _challengeHash,
        bytes32 _confirmData,
        uint64 _prevNum,
        uint64 _deadlineBlock,
        bytes32 _nodeHash
    ) internal view returns (Node memory) {
        Node memory node;
        node.stateHash = _stateHash;
        node.challengeHash = _challengeHash;
        node.confirmData = _confirmData;
        node.prevNum = _prevNum;
        node.deadlineBlock = _deadlineBlock;
        node.noChildConfirmedBeforeBlock = _deadlineBlock;
        node.createdAtBlock = uint64(block.number);
        node.nodeHash = _nodeHash;
        return node;
    }

    /**
     * @notice Update child properties
     * @param number The child number to set
     */
    function childCreated(Node storage self, uint64 number) internal {
        if (self.firstChildBlock == 0) {
            self.firstChildBlock = uint64(block.number);
        }
        self.latestChildNumber = number;
    }

    /**
     * @notice Update the child confirmed deadline
     * @param deadline The new deadline to set
     */
    function newChildConfirmDeadline(Node storage self, uint64 deadline) internal {
        self.noChildConfirmedBeforeBlock = deadline;
    }

    /**
     * @notice Check whether the current block number has met or passed the node's deadline
     */
    function requirePastDeadline(Node memory self) internal view {
        require(block.number >= self.deadlineBlock, "BEFORE_DEADLINE");
    }

    /**
     * @notice Check whether the current block number has met or passed deadline for children of this node to be confirmed
     */
    function requirePastChildConfirmDeadline(Node memory self) internal view {
        require(block.number >= self.noChildConfirmedBeforeBlock, "CHILD_TOO_RECENT");
    }
}

library GlobalStateLib {
    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(GlobalState memory state) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Global state:",
                    state.bytes32Vals[0],
                    state.bytes32Vals[1],
                    state.u64Vals[0],
                    state.u64Vals[1]
                )
            );
    }

    function getBlockHash(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(GlobalState calldata state) internal pure returns (bool) {
        return (state.bytes32Vals[0] == bytes32(0) &&
            state.bytes32Vals[1] == bytes32(0) &&
            state.u64Vals[0] == 0 &&
            state.u64Vals[1] == 0);
    }
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

struct ExecutionState {
    GlobalState globalState;
    MachineStatus machineStatus;
}

struct Assertion {
    ExecutionState beforeState;
    ExecutionState afterState;
    uint64 numBlocks;
}

library StackFrameLib {
    using ValueLib for Value;

    function hash(StackFrame memory frame) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Stack frame:",
                    frame.returnPc.hash(),
                    frame.localsMerkleRoot,
                    frame.callerModule,
                    frame.callerModuleInternals
                )
            );
    }

    function hash(StackFrameWindow memory window) internal pure returns (bytes32 h) {
        h = window.remainingHash;
        for (uint256 i = 0; i < window.proved.length; i++) {
            h = keccak256(abi.encodePacked("Stack frame stack:", hash(window.proved[i]), h));
        }
    }

    function peek(StackFrameWindow memory window) internal pure returns (StackFrame memory) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        return window.proved[0];
    }

    function pop(StackFrameWindow memory window) internal pure returns (StackFrame memory frame) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        frame = window.proved[0];
        window.proved = new StackFrame[](0);
    }

    function push(StackFrameWindow memory window, StackFrame memory frame) internal pure {
        StackFrame[] memory newProved = new StackFrame[](window.proved.length + 1);
        for (uint256 i = 0; i < window.proved.length; i++) {
            newProved[i] = window.proved[i];
        }
        newProved[window.proved.length] = frame;
        window.proved = newProved;
    }

    function overwrite(StackFrameWindow memory window, bytes32 root) internal pure {
        window.remainingHash = root;
        delete window.proved;
    }
}

library ValueLib {
    function hash(Value memory val) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Value:", val.valueType, val.contents));
    }

    function maxValueType() internal pure returns (ValueType) {
        return ValueType.INTERNAL_REF;
    }

    function assumeI32(Value memory val) internal pure returns (uint32) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I32, "NOT_I32");
        require(uintval < (1 << 32), "BAD_I32");
        return uint32(uintval);
    }

    function assumeI64(Value memory val) internal pure returns (uint64) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I64, "NOT_I64");
        require(uintval < (1 << 64), "BAD_I64");
        return uint64(uintval);
    }

    function newRefNull() internal pure returns (Value memory) {
        return Value({valueType: ValueType.REF_NULL, contents: 0});
    }

    function newI32(uint32 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I32, contents: uint256(x)});
    }

    function newI64(uint64 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I64, contents: uint256(x)});
    }

    function newBoolean(bool x) internal pure returns (Value memory) {
        if (x) {
            return newI32(uint32(1));
        } else {
            return newI32(uint32(0));
        }
    }

    function newPc(
        uint32 funcPc,
        uint32 func,
        uint32 module
    ) internal pure returns (Value memory) {
        uint256 data = 0;
        data |= funcPc;
        data |= uint256(func) << 32;
        data |= uint256(module) << 64;
        return Value({valueType: ValueType.INTERNAL_REF, contents: data});
    }
}

library ValueArrayLib {
    function get(ValueArray memory arr, uint256 index) internal pure returns (Value memory) {
        return arr.inner[index];
    }

    function set(
        ValueArray memory arr,
        uint256 index,
        Value memory val
    ) internal pure {
        arr.inner[index] = val;
    }

    function length(ValueArray memory arr) internal pure returns (uint256) {
        return arr.inner.length;
    }

    function push(ValueArray memory arr, Value memory val) internal pure {
        Value[] memory newInner = new Value[](arr.inner.length + 1);
        for (uint256 i = 0; i < arr.inner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        newInner[arr.inner.length] = val;
        arr.inner = newInner;
    }

    function pop(ValueArray memory arr) internal pure returns (Value memory popped) {
        popped = arr.inner[arr.inner.length - 1];
        Value[] memory newInner = new Value[](arr.inner.length - 1);
        for (uint256 i = 0; i < newInner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        arr.inner = newInner;
    }
}

library ValueStackLib {
    using ValueLib for Value;
    using ValueArrayLib for ValueArray;

    function hash(ValueStack memory stack) internal pure returns (bytes32 h) {
        h = stack.remainingHash;
        uint256 len = stack.proved.length();
        for (uint256 i = 0; i < len; i++) {
            h = keccak256(abi.encodePacked("Value stack:", stack.proved.get(i).hash(), h));
        }
    }

    function peek(ValueStack memory stack) internal pure returns (Value memory) {
        uint256 len = stack.proved.length();
        return stack.proved.get(len - 1);
    }

    function pop(ValueStack memory stack) internal pure returns (Value memory) {
        return stack.proved.pop();
    }

    function push(ValueStack memory stack, Value memory val) internal pure {
        return stack.proved.push(val);
    }

    function overwrite(ValueStack memory stack, bytes32 root) internal pure {
        stack.remainingHash = root;
        delete stack.proved;
    }
}

library MultiStackLib {
    bytes32 internal constant NO_STACK_HASH = ~bytes32(0);

    function hash(
        MultiStack memory multi,
        bytes32 activeStackHash,
        bool cothread
    ) internal pure returns (bytes32) {
        require(activeStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_ACTIVE");
        if (cothread) {
            require(multi.inactiveStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_MAIN");
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        multi.inactiveStackHash,
                        activeStackHash,
                        multi.remainingHash
                    )
                );
        } else {
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        activeStackHash,
                        multi.inactiveStackHash,
                        multi.remainingHash
                    )
                );
        }
    }

    function setEmpty(MultiStack memory multi) internal pure {
        multi.inactiveStackHash = NO_STACK_HASH;
        multi.remainingHash = 0;
    }

    function pushNew(MultiStack memory multi) internal pure {
        if (multi.inactiveStackHash != NO_STACK_HASH) {
            multi.remainingHash = keccak256(
                abi.encodePacked("cothread:", multi.inactiveStackHash, multi.remainingHash)
            );
        }
        multi.inactiveStackHash = 0;
    }
}

struct ValueArray {
    Value[] inner;
}

struct ValueStack {
    ValueArray proved;
    bytes32 remainingHash;
}

struct MultiStack {
    bytes32 inactiveStackHash; // NO_STACK_HASH if no stack, 0 if empty stack
    bytes32 remainingHash; // 0 if less than 2 cothreads exist
}

struct StackFrame {
    Value returnPc;
    bytes32 localsMerkleRoot;
    uint32 callerModule;
    uint32 callerModuleInternals;
}

struct StackFrameWindow {
    StackFrame[] proved;
    bytes32 remainingHash;
}

struct Machine {
    MachineStatus status;
    ValueStack valueStack;
    MultiStack valueMultiStack;
    ValueStack internalStack;
    StackFrameWindow frameStack;
    MultiStack frameMultiStack;
    bytes32 globalStateHash;
    uint32 moduleIdx;
    uint32 functionIdx;
    uint32 functionPc;
    bytes32 recoveryPc;
    bytes32 modulesRoot;
}

struct Value {
    ValueType valueType;
    uint256 contents;
}

enum ValueType {
    I32,
    I64,
    F32,
    F64,
    REF_NULL,
    FUNC_REF,
    INTERNAL_REF
}

library MachineLib {
    using StackFrameLib for StackFrameWindow;
    using ValueStackLib for ValueStack;
    using MultiStackLib for MultiStack;

    bytes32 internal constant NO_RECOVERY_PC = ~bytes32(0);

    function hash(Machine memory mach) internal pure returns (bytes32) {
        // Warning: the non-running hashes are replicated in Challenge
        if (mach.status == MachineStatus.RUNNING) {
            bytes32 valueMultiHash = mach.valueMultiStack.hash(
                mach.valueStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes32 frameMultiHash = mach.frameMultiStack.hash(
                mach.frameStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes memory preimage = abi.encodePacked(
                "Machine running:",
                valueMultiHash,
                mach.internalStack.hash(),
                frameMultiHash,
                mach.globalStateHash,
                mach.moduleIdx,
                mach.functionIdx,
                mach.functionPc,
                mach.recoveryPc,
                mach.modulesRoot
            );
            return keccak256(preimage);
        } else if (mach.status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", mach.globalStateHash));
        } else if (mach.status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:"));
        } else if (mach.status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Machine too far:"));
        } else {
            revert("BAD_MACH_STATUS");
        }
    }

    function switchCoThreadStacks(Machine memory mach) internal pure {
        bytes32 newActiveValue = mach.valueMultiStack.inactiveStackHash;
        bytes32 newActiveFrame = mach.frameMultiStack.inactiveStackHash;
        if (
            newActiveFrame == MultiStackLib.NO_STACK_HASH ||
            newActiveValue == MultiStackLib.NO_STACK_HASH
        ) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        mach.frameMultiStack.inactiveStackHash = mach.frameStack.hash();
        mach.valueMultiStack.inactiveStackHash = mach.valueStack.hash();
        mach.frameStack.overwrite(newActiveFrame);
        mach.valueStack.overwrite(newActiveValue);
    }

    function setPcFromData(Machine memory mach, uint256 data) internal pure returns (bool) {
        if (data >> 96 != 0) {
            return false;
        }

        mach.functionPc = uint32(data);
        mach.functionIdx = uint32(data >> 32);
        mach.moduleIdx = uint32(data >> 64);
        return true;
    }

    function setPcFromRecovery(Machine memory mach) internal pure returns (bool) {
        if (!setPcFromData(mach, uint256(mach.recoveryPc))) {
            return false;
        }
        mach.recoveryPc = NO_RECOVERY_PC;
        return true;
    }

    function setRecoveryFromPc(Machine memory mach, uint32 offset) internal pure returns (bool) {
        if (mach.recoveryPc != NO_RECOVERY_PC) {
            return false;
        }

        uint256 result;
        result = uint256(mach.moduleIdx) << 64;
        result = result | (uint256(mach.functionIdx) << 32);
        result = result | uint256(mach.functionPc + offset - 1);
        mach.recoveryPc = bytes32(result);
        return true;
    }

    function setPc(Machine memory mach, Value memory pc) internal pure {
        if (pc.valueType == ValueType.REF_NULL) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (pc.valueType != ValueType.INTERNAL_REF) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (!setPcFromData(mach, pc.contents)) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
    }
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED,
    TOO_FAR
}

library ChallengeLib {
    using MachineLib for Machine;
    using ChallengeLib for Challenge;

    /// @dev It's assumed that that uninitialzed challenges have mode NONE
    enum ChallengeMode {
        NONE,
        BLOCK,
        EXECUTION
    }

    struct Participant {
        address addr;
        uint256 timeLeft;
    }

    struct Challenge {
        Participant current;
        Participant next;
        uint256 lastMoveTimestamp;
        bytes32 wasmModuleRoot;
        bytes32 challengeStateHash;
        uint64 maxInboxMessages;
        ChallengeMode mode;
    }

    struct SegmentSelection {
        uint256 oldSegmentsStart;
        uint256 oldSegmentsLength;
        bytes32[] oldSegments;
        uint256 challengePosition;
    }

    function timeUsedSinceLastMove(Challenge storage challenge) internal view returns (uint256) {
        return block.timestamp - challenge.lastMoveTimestamp;
    }

    function isTimedOut(Challenge storage challenge) internal view returns (bool) {
        return challenge.timeUsedSinceLastMove() > challenge.current.timeLeft;
    }

    function extractChallengeSegment(SegmentSelection calldata selection)
        internal
        pure
        returns (uint256 segmentStart, uint256 segmentLength)
    {
        uint256 oldChallengeDegree = selection.oldSegments.length - 1;
        segmentLength = selection.oldSegmentsLength / oldChallengeDegree;
        // Intentionally done before challengeLength is potentially added to for the final segment
        segmentStart = selection.oldSegmentsStart + segmentLength * selection.challengePosition;
        if (selection.challengePosition == selection.oldSegments.length - 2) {
            segmentLength += selection.oldSegmentsLength % oldChallengeDegree;
        }
    }

    function hashChallengeState(
        uint256 segmentsStart,
        uint256 segmentsLength,
        bytes32[] memory segments
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(segmentsStart, segmentsLength, segments));
    }

    function blockStateHash(MachineStatus status, bytes32 globalStateHash)
        internal
        pure
        returns (bytes32)
    {
        if (status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Block state:", globalStateHash));
        } else if (status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Block state, errored:", globalStateHash));
        } else if (status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Block state, too far:"));
        } else {
            revert("BAD_BLOCK_STATUS");
        }
    }
}

library RollupLib {
    using GlobalStateLib for GlobalState;

    function stateHash(ExecutionState calldata execState, uint256 inboxMaxCount)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    execState.globalState.hash(),
                    inboxMaxCount,
                    execState.machineStatus
                )
            );
    }

    /// @dev same as stateHash but expects execState in memory instead of calldata
    function stateHashMem(ExecutionState memory execState, uint256 inboxMaxCount)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    execState.globalState.hash(),
                    inboxMaxCount,
                    execState.machineStatus
                )
            );
    }

    function executionHash(Assertion memory assertion) internal pure returns (bytes32) {
        MachineStatus[2] memory statuses;
        statuses[0] = assertion.beforeState.machineStatus;
        statuses[1] = assertion.afterState.machineStatus;
        GlobalState[2] memory globalStates;
        globalStates[0] = assertion.beforeState.globalState;
        globalStates[1] = assertion.afterState.globalState;
        // TODO: benchmark how much this abstraction adds of gas overhead
        return executionHash(statuses, globalStates, assertion.numBlocks);
    }

    function executionHash(
        MachineStatus[2] memory statuses,
        GlobalState[2] memory globalStates,
        uint64 numBlocks
    ) internal pure returns (bytes32) {
        bytes32[] memory segments = new bytes32[](2);
        segments[0] = ChallengeLib.blockStateHash(statuses[0], globalStates[0].hash());
        segments[1] = ChallengeLib.blockStateHash(statuses[1], globalStates[1].hash());
        return ChallengeLib.hashChallengeState(0, numBlocks, segments);
    }

    function challengeRootHash(
        bytes32 execution,
        uint256 proposedTime,
        bytes32 wasmModuleRoot
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(execution, proposedTime, wasmModuleRoot));
    }

    function confirmHash(Assertion memory assertion) internal pure returns (bytes32) {
        return
            confirmHash(
                assertion.afterState.globalState.getBlockHash(),
                assertion.afterState.globalState.getSendRoot()
            );
    }

    function confirmHash(bytes32 blockHash, bytes32 sendRoot) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(blockHash, sendRoot));
    }

    function nodeHash(
        bool hasSibling,
        bytes32 lastHash,
        bytes32 assertionExecHash,
        bytes32 inboxAcc,
        bytes32 wasmModuleRoot
    ) internal pure returns (bytes32) {
        uint8 hasSiblingInt = hasSibling ? 1 : 0;
        return
            keccak256(
                abi.encodePacked(
                    hasSiblingInt,
                    lastHash,
                    assertionExecHash,
                    inboxAcc,
                    wasmModuleRoot
                )
            );
    }
}

abstract contract AbsRollupUserLogic is
    RollupCore,
    UUPSNotUpgradeable,
    IRollupUserAbs,
    IChallengeResultReceiver
{
    using NodeLib for Node;
    using GlobalStateLib for GlobalState;

    modifier onlyValidator() {
        require(isValidator[msg.sender] || validatorWhitelistDisabled, "NOT_VALIDATOR");
        _;
    }

    modifier whenNotPausedOrDeprecated() {
        require(!paused() || address(bridge.rollup()) != address(this), "PAUSED_AND_ACTIVE");
        _;
    }

    uint256 internal immutable deployTimeChainId = block.chainid;

    function _chainIdChanged() internal view returns (bool) {
        return deployTimeChainId != block.chainid;
    }

    /**
     * @notice Extra number of blocks the validator can remain inactive before considered inactive
     *         This is 7 days assuming a 13.2 seconds block time
     */
    uint256 public constant VALIDATOR_AFK_BLOCKS = 45818;

    function _validatorIsAfk() internal view returns (bool) {
        Node memory latestNode = getNodeStorage(latestNodeCreated());
        if (latestNode.createdAtBlock == 0) return false;
        if (latestNode.createdAtBlock + confirmPeriodBlocks + VALIDATOR_AFK_BLOCKS < block.number) {
            return true;
        }
        return false;
    }

    function removeWhitelistAfterFork() external {
        require(!validatorWhitelistDisabled, "WHITELIST_DISABLED");
        require(_chainIdChanged(), "CHAIN_ID_NOT_CHANGED");
        validatorWhitelistDisabled = true;
    }

    function removeWhitelistAfterValidatorAfk() external {
        require(!validatorWhitelistDisabled, "WHITELIST_DISABLED");
        require(_validatorIsAfk(), "VALIDATOR_NOT_AFK");
        validatorWhitelistDisabled = true;
    }

    function isERC20Enabled() public view override returns (bool) {
        return stakeToken != address(0);
    }

    /**
     * @notice Reject the next unresolved node
     * @param stakerAddress Example staker staked on sibling, used to prove a node is on an unconfirmable branch and can be rejected
     */
    function rejectNextNode(address stakerAddress) external onlyValidator whenNotPaused {
        requireUnresolvedExists();
        uint64 latestConfirmedNodeNum = latestConfirmed();
        uint64 firstUnresolvedNodeNum = firstUnresolvedNode();
        Node storage firstUnresolvedNode_ = getNodeStorage(firstUnresolvedNodeNum);

        if (firstUnresolvedNode_.prevNum == latestConfirmedNodeNum) {
            /**If the first unresolved node is a child of the latest confirmed node, to prove it can be rejected, we show:
             * a) Its deadline has expired
             * b) *Some* staker is staked on a sibling

             * The following three checks are sufficient to prove b:
            */

            // 1.  StakerAddress is indeed a staker
            require(isStakedOnLatestConfirmed(stakerAddress), "NOT_STAKED");

            // 2. Staker's latest staked node hasn't been resolved; this proves that staker's latest staked node can't be a parent of firstUnresolvedNode
            requireUnresolved(latestStakedNode(stakerAddress));

            // 3. staker isn't staked on first unresolved node; this proves staker's latest staked can't be a child of firstUnresolvedNode (recall staking on node requires staking on all of its parents)
            require(!nodeHasStaker(firstUnresolvedNodeNum, stakerAddress), "STAKED_ON_TARGET");
            // If a staker is staked on a node that is neither a child nor a parent of firstUnresolvedNode, it must be a sibling, QED

            // Verify the block's deadline has passed
            firstUnresolvedNode_.requirePastDeadline();

            getNodeStorage(latestConfirmedNodeNum).requirePastChildConfirmDeadline();

            removeOldZombies(0);

            // Verify that no staker is staked on this node
            require(
                firstUnresolvedNode_.stakerCount == countStakedZombies(firstUnresolvedNodeNum),
                "HAS_STAKERS"
            );
        }
        // Simpler case: if the first unreseolved node doesn't point to the last confirmed node, another branch was confirmed and can simply reject it outright
        _rejectNextNode();

        emit NodeRejected(firstUnresolvedNodeNum);
    }

    function _confirmNextNode(
        bytes32 blockHash,
        bytes32 sendRoot,
        bool isFastConfirm
    ) internal whenNotPaused {
        requireUnresolvedExists();

        uint64 nodeNum = firstUnresolvedNode();
        Node storage node = getNodeStorage(nodeNum);

        if (!isFastConfirm) {
            // Verify the block's deadline has passed
            node.requirePastDeadline();
        }

        // Check that prev is latest confirmed
        assert(node.prevNum == latestConfirmed());

        Node storage prevNode = getNodeStorage(node.prevNum);
        if (!isFastConfirm) {
            prevNode.requirePastChildConfirmDeadline();
        }

        removeOldZombies(0);

        // Require only zombies are staked on siblings to this node, and there's at least one non-zombie staked on this node
        uint256 stakedZombies = countStakedZombies(nodeNum);
        uint256 zombiesStakedOnOtherChildren = countZombiesStakedOnChildren(node.prevNum) -
            stakedZombies;
        require(node.stakerCount > stakedZombies, "NO_STAKERS");
        require(
            prevNode.childStakerCount == node.stakerCount + zombiesStakedOnOtherChildren,
            "NOT_ALL_STAKED"
        );

        confirmNode(nodeNum, blockHash, sendRoot);
    }

    /**
     * @notice Confirm the next unresolved node
     * @param blockHash The block hash at the end of the assertion
     * @param sendRoot The send root at the end of the assertion
     */
    function confirmNextNode(bytes32 blockHash, bytes32 sendRoot) external onlyValidator {
        _confirmNextNode(blockHash, sendRoot, false);
    }

    /**
     * @notice This allow anyTrustFastConfirmer to confirm next node regardless of deadline
     *         the anyTrustFastConfirmer is supposed to be set only on an AnyTrust chain to
     *         a contract that can call this function when received sufficient signatures
     *         node hash must be match the node to be confirmed to protect against reorgs
     */
    function fastConfirmNextNode(
        bytes32 blockHash,
        bytes32 sendRoot,
        bytes32 nodeHash
    ) external {
        require(msg.sender == anyTrustFastConfirmer, "NFC");
        require(nodeHash == getNodeStorage(firstUnresolvedNode()).nodeHash, "WH");
        _confirmNextNode(blockHash, sendRoot, true);
    }

    /**
     * @notice Create a new stake
     * @param depositAmount The amount of either eth or tokens staked
     */
    function _newStake(uint256 depositAmount) internal onlyValidator whenNotPaused {
        // Verify that sender is not already a staker
        require(!isStaked(msg.sender), "ALREADY_STAKED");
        require(!isZombie(msg.sender), "STAKER_IS_ZOMBIE");
        require(depositAmount >= currentRequiredStake(), "NOT_ENOUGH_STAKE");

        createNewStake(msg.sender, depositAmount);
    }

    /**
     * @notice Move stake onto existing child node
     * @param nodeNum Index of the node to move stake to. This must by a child of the node the staker is currently staked on
     * @param nodeHash Node hash of nodeNum (protects against reorgs)
     */
    function stakeOnExistingNode(uint64 nodeNum, bytes32 nodeHash)
        public
        onlyValidator
        whenNotPaused
    {
        require(isStakedOnLatestConfirmed(msg.sender), "NOT_STAKED");

        require(
            nodeNum >= firstUnresolvedNode() && nodeNum <= latestNodeCreated(),
            "NODE_NUM_OUT_OF_RANGE"
        );
        Node storage node = getNodeStorage(nodeNum);
        require(node.nodeHash == nodeHash, "NODE_REORG");
        require(latestStakedNode(msg.sender) == node.prevNum, "NOT_STAKED_PREV");
        stakeOnNode(msg.sender, nodeNum);
    }

    /**
     * @notice Create a new node and move stake onto it
     * @param assertion The assertion data
     * @param expectedNodeHash The hash of the node being created (protects against reorgs)
     */
    function stakeOnNewNode(
        Assertion calldata assertion,
        bytes32 expectedNodeHash,
        uint256 prevNodeInboxMaxCount
    ) public onlyValidator whenNotPaused {
        require(isStakedOnLatestConfirmed(msg.sender), "NOT_STAKED");
        // Ensure staker is staked on the previous node
        uint64 prevNode = latestStakedNode(msg.sender);

        {
            uint256 timeSinceLastNode = block.number - getNode(prevNode).createdAtBlock;
            // Verify that assertion meets the minimum Delta time requirement
            require(timeSinceLastNode >= minimumAssertionPeriod, "TIME_DELTA");

            // Minimum size requirement: any assertion must consume at least all inbox messages
            // put into L1 inbox before the prev node’s L1 blocknum.
            // We make an exception if the machine enters the errored state,
            // as it can't consume future batches.
            require(
                assertion.afterState.machineStatus == MachineStatus.ERRORED ||
                    assertion.afterState.globalState.getInboxPosition() >= prevNodeInboxMaxCount,
                "TOO_SMALL"
            );
            // Minimum size requirement: any assertion must contain at least one block
            require(assertion.numBlocks > 0, "EMPTY_ASSERTION");

            // The rollup cannot advance normally from an errored state
            require(
                assertion.beforeState.machineStatus == MachineStatus.FINISHED,
                "BAD_PREV_STATUS"
            );
        }
        createNewNode(assertion, prevNode, prevNodeInboxMaxCount, expectedNodeHash);

        stakeOnNode(msg.sender, latestNodeCreated());
    }

    /**
     * @notice Refund a staker that is currently staked on or before the latest confirmed node
     * @dev Since a staker is initially placed in the latest confirmed node, if they don't move it
     * a griefer can remove their stake. It is recomended to batch together the txs to place a stake
     * and move it to the desired node.
     * @param stakerAddress Address of the staker whose stake is refunded
     */
    function returnOldDeposit(address stakerAddress)
        external
        override
        onlyValidator
        whenNotPausedOrDeprecated
    {
        require(latestStakedNode(stakerAddress) <= latestConfirmed(), "TOO_RECENT");
        requireUnchallengedStaker(stakerAddress);
        withdrawStaker(stakerAddress);
    }

    /**
     * @notice Increase the amount staked for the given staker
     * @param stakerAddress Address of the staker whose stake is increased
     * @param depositAmount The amount of either eth or tokens deposited
     */
    function _addToDeposit(address stakerAddress, uint256 depositAmount)
        internal
        onlyValidator
        whenNotPaused
    {
        requireUnchallengedStaker(stakerAddress);
        increaseStakeBy(stakerAddress, depositAmount);
    }

    /**
     * @notice Reduce the amount staked for the sender (difference between initial amount staked and target is creditted back to the sender).
     * @param target Target amount of stake for the staker. If this is below the current minimum, it will be set to minimum instead
     */
    function reduceDeposit(uint256 target) external onlyValidator whenNotPausedOrDeprecated {
        requireUnchallengedStaker(msg.sender);
        uint256 currentRequired = currentRequiredStake();
        if (target < currentRequired) {
            target = currentRequired;
        }
        reduceStakeTo(msg.sender, target);
    }

    /**
     * @notice Start a challenge between the given stakers over the node created by the first staker assuming that the two are staked on conflicting nodes. N.B.: challenge creator does not necessarily need to be one of the two asserters.
     * @param stakers Stakers engaged in the challenge. The first staker should be staked on the first node
     * @param nodeNums Nodes of the stakers engaged in the challenge. The first node should be the earliest and is the one challenged
     * @param machineStatuses The before and after machine status for the first assertion
     * @param globalStates The before and after global state for the first assertion
     * @param numBlocks The number of L2 blocks contained in the first assertion
     * @param secondExecutionHash The execution hash of the second assertion
     * @param proposedBlocks L1 block numbers that the two nodes were proposed at
     * @param wasmModuleRoots The wasm module roots at the time of the creation of each assertion
     */
    function createChallenge(
        address[2] calldata stakers,
        uint64[2] calldata nodeNums,
        MachineStatus[2] calldata machineStatuses,
        GlobalState[2] calldata globalStates,
        uint64 numBlocks,
        bytes32 secondExecutionHash,
        uint256[2] calldata proposedBlocks,
        bytes32[2] calldata wasmModuleRoots
    ) external onlyValidator whenNotPaused {
        require(nodeNums[0] < nodeNums[1], "WRONG_ORDER");
        require(nodeNums[1] <= latestNodeCreated(), "NOT_PROPOSED");
        require(latestConfirmed() < nodeNums[0], "ALREADY_CONFIRMED");

        Node storage node1 = getNodeStorage(nodeNums[0]);
        Node storage node2 = getNodeStorage(nodeNums[1]);

        // ensure nodes staked on the same parent (and thus in conflict)
        require(node1.prevNum == node2.prevNum, "DIFF_PREV");

        // ensure both stakers aren't currently in challenge
        requireUnchallengedStaker(stakers[0]);
        requireUnchallengedStaker(stakers[1]);

        require(nodeHasStaker(nodeNums[0], stakers[0]), "STAKER1_NOT_STAKED");
        require(nodeHasStaker(nodeNums[1], stakers[1]), "STAKER2_NOT_STAKED");

        // Check param data against challenge hash
        require(
            node1.challengeHash ==
                RollupLib.challengeRootHash(
                    RollupLib.executionHash(machineStatuses, globalStates, numBlocks),
                    proposedBlocks[0],
                    wasmModuleRoots[0]
                ),
            "CHAL_HASH1"
        );

        require(
            node2.challengeHash ==
                RollupLib.challengeRootHash(
                    secondExecutionHash,
                    proposedBlocks[1],
                    wasmModuleRoots[1]
                ),
            "CHAL_HASH2"
        );

        // Calculate upper limit for allowed node proposal time:
        uint256 commonEndBlock = getNodeStorage(node1.prevNum).firstChildBlock +
            // Dispute start: dispute timer for a node starts when its first child is created
            (node1.deadlineBlock - proposedBlocks[0]) +
            extraChallengeTimeBlocks; // add dispute window to dispute start time
        if (commonEndBlock < proposedBlocks[1]) {
            // The 2nd node was created too late; loses challenge automatically.
            completeChallengeImpl(stakers[0], stakers[1]);
            return;
        }
        // Start a challenge between staker1 and staker2. Staker1 will defend the correctness of node1, and staker2 will challenge it.
        uint64 challengeIndex = createChallengeHelper(
            stakers,
            machineStatuses,
            globalStates,
            numBlocks,
            wasmModuleRoots,
            // convert from block counts to real second based timestamps
            (commonEndBlock - proposedBlocks[0]) * ETH_POS_BLOCK_TIME,
            (commonEndBlock - proposedBlocks[1]) * ETH_POS_BLOCK_TIME
        ); // trusted external call

        challengeStarted(stakers[0], stakers[1], challengeIndex);

        emit RollupChallengeStarted(challengeIndex, stakers[0], stakers[1], nodeNums[0]);
    }

    function createChallengeHelper(
        address[2] calldata stakers,
        MachineStatus[2] calldata machineStatuses,
        GlobalState[2] calldata globalStates,
        uint64 numBlocks,
        bytes32[2] calldata wasmModuleRoots,
        uint256 asserterTimeLeft,
        uint256 challengerTimeLeft
    ) internal returns (uint64) {
        return
            challengeManager.createChallenge(
                wasmModuleRoots[0],
                machineStatuses,
                globalStates,
                numBlocks,
                stakers[0],
                stakers[1],
                asserterTimeLeft,
                challengerTimeLeft
            );
    }

    /**
     * @notice Inform the rollup that the challenge between the given stakers is completed
     * @param winningStaker Address of the winning staker
     * @param losingStaker Address of the losing staker
     */
    function completeChallenge(
        uint256 challengeIndex,
        address winningStaker,
        address losingStaker
    ) external override whenNotPaused {
        // Only the challenge manager contract can call this to declare the winner and loser
        require(msg.sender == address(challengeManager), "WRONG_SENDER");
        require(challengeIndex == inChallenge(winningStaker, losingStaker), "NOT_IN_CHAL");
        completeChallengeImpl(winningStaker, losingStaker);
    }

    function completeChallengeImpl(address winningStaker, address losingStaker) private {
        uint256 remainingLoserStake = amountStaked(losingStaker);
        uint256 winnerStake = amountStaked(winningStaker);
        if (remainingLoserStake > winnerStake) {
            // If loser has a higher stake than the winner, refund the difference
            remainingLoserStake -= reduceStakeTo(losingStaker, winnerStake);
        }

        // Reward the winner with half the remaining stake
        uint256 amountWon = remainingLoserStake / 2;
        increaseStakeBy(winningStaker, amountWon);
        remainingLoserStake -= amountWon;
        // We deliberately leave loser in challenge state to prevent them from
        // doing certain thing that are allowed only to parties not in a challenge
        clearChallenge(winningStaker);
        // Credit the other half to the loserStakeEscrow address
        increaseWithdrawableFunds(loserStakeEscrow, remainingLoserStake);
        // Turning loser into zombie renders the loser's remaining stake inaccessible
        turnIntoZombie(losingStaker);
    }

    /**
     * @notice Remove the given zombie from nodes it is staked on, moving backwords from the latest node it is staked on
     * @param zombieNum Index of the zombie to remove
     * @param maxNodes Maximum number of nodes to remove the zombie from (to limit the cost of this transaction)
     */
    function removeZombie(uint256 zombieNum, uint256 maxNodes)
        external
        onlyValidator
        whenNotPaused
    {
        require(zombieNum < zombieCount(), "NO_SUCH_ZOMBIE");
        address zombieStakerAddress = zombieAddress(zombieNum);
        uint64 latestNodeStaked = zombieLatestStakedNode(zombieNum);
        uint256 nodesRemoved = 0;
        uint256 latestConfirmedNum = latestConfirmed();
        while (latestNodeStaked >= latestConfirmedNum && nodesRemoved < maxNodes) {
            Node storage node = getNodeStorage(latestNodeStaked);
            removeStaker(latestNodeStaked, zombieStakerAddress);
            latestNodeStaked = node.prevNum;
            nodesRemoved++;
        }
        if (latestNodeStaked < latestConfirmedNum) {
            removeZombie(zombieNum);
        } else {
            zombieUpdateLatestStakedNode(zombieNum, latestNodeStaked);
        }
    }

    /**
     * @notice Remove any zombies whose latest stake is earlier than the latest confirmed node
     * @param startIndex Index in the zombie list to start removing zombies from (to limit the cost of this transaction)
     */
    function removeOldZombies(uint256 startIndex) public onlyValidator whenNotPaused {
        uint256 currentZombieCount = zombieCount();
        uint256 latestConfirmedNum = latestConfirmed();
        for (uint256 i = startIndex; i < currentZombieCount; i++) {
            while (zombieLatestStakedNode(i) < latestConfirmedNum) {
                removeZombie(i);
                currentZombieCount--;
                if (i >= currentZombieCount) {
                    return;
                }
            }
        }
    }

    /**
     * @notice Calculate the current amount of funds required to place a new stake in the rollup
     * @dev If the stake requirement get's too high, this function may start reverting due to overflow, but
     * that only blocks operations that should be blocked anyway
     * @return The current minimum stake requirement
     */
    function currentRequiredStake(
        uint256 _blockNumber,
        uint64 _firstUnresolvedNodeNum,
        uint256 _latestCreatedNode
    ) internal view returns (uint256) {
        // If there are no unresolved nodes, then you can use the base stake
        if (_firstUnresolvedNodeNum - 1 == _latestCreatedNode) {
            return baseStake;
        }
        uint256 firstUnresolvedDeadline = getNodeStorage(_firstUnresolvedNodeNum).deadlineBlock;
        if (_blockNumber < firstUnresolvedDeadline) {
            return baseStake;
        }
        uint24[10] memory numerators = [
            1,
            122971,
            128977,
            80017,
            207329,
            114243,
            314252,
            129988,
            224562,
            162163
        ];
        uint24[10] memory denominators = [
            1,
            114736,
            112281,
            64994,
            157126,
            80782,
            207329,
            80017,
            128977,
            86901
        ];
        uint256 firstUnresolvedAge = _blockNumber - firstUnresolvedDeadline;
        uint256 periodsPassed = (firstUnresolvedAge * 10) / confirmPeriodBlocks;
        uint256 baseMultiplier = 2**(periodsPassed / 10);
        uint256 withNumerator = baseMultiplier * numerators[periodsPassed % 10];
        uint256 multiplier = withNumerator / denominators[periodsPassed % 10];
        if (multiplier == 0) {
            multiplier = 1;
        }
        return baseStake * multiplier;
    }

    /**
     * @notice Calculate the current amount of funds required to place a new stake in the rollup
     * @dev If the stake requirement get's too high, this function may start reverting due to overflow, but
     * that only blocks operations that should be blocked anyway
     * @return The current minimum stake requirement
     */
    function requiredStake(
        uint256 blockNumber,
        uint64 firstUnresolvedNodeNum,
        uint64 latestCreatedNode
    ) external view returns (uint256) {
        return currentRequiredStake(blockNumber, firstUnresolvedNodeNum, latestCreatedNode);
    }

    function owner() external view returns (address) {
        return _getAdmin();
    }

    function currentRequiredStake() public view returns (uint256) {
        uint64 firstUnresolvedNodeNum = firstUnresolvedNode();

        return currentRequiredStake(block.number, firstUnresolvedNodeNum, latestNodeCreated());
    }

    /**
     * @notice Calculate the number of zombies staked on the given node
     *
     * @dev This function could be uncallable if there are too many zombies. However,
     * removeZombie and removeOldZombies can be used to remove any zombies that exist
     * so that this will then be callable
     *
     * @param nodeNum The node on which to count staked zombies
     * @return The number of zombies staked on the node
     */
    function countStakedZombies(uint64 nodeNum) public view override returns (uint256) {
        uint256 currentZombieCount = zombieCount();
        uint256 stakedZombieCount = 0;
        for (uint256 i = 0; i < currentZombieCount; i++) {
            if (nodeHasStaker(nodeNum, zombieAddress(i))) {
                stakedZombieCount++;
            }
        }
        return stakedZombieCount;
    }

    /**
     * @notice Calculate the number of zombies staked on a child of the given node
     *
     * @dev This function could be uncallable if there are too many zombies. However,
     * removeZombie and removeOldZombies can be used to remove any zombies that exist
     * so that this will then be callable
     *
     * @param nodeNum The parent node on which to count zombies staked on children
     * @return The number of zombies staked on children of the node
     */
    function countZombiesStakedOnChildren(uint64 nodeNum) public view override returns (uint256) {
        uint256 currentZombieCount = zombieCount();
        uint256 stakedZombieCount = 0;
        for (uint256 i = 0; i < currentZombieCount; i++) {
            Zombie storage zombie = getZombieStorage(i);
            // If this zombie is staked on this node, but its _latest_ staked node isn't this node,
            // then it must be staked on a child of this node.
            if (
                zombie.latestStakedNode != nodeNum && nodeHasStaker(nodeNum, zombie.stakerAddress)
            ) {
                stakedZombieCount++;
            }
        }
        return stakedZombieCount;
    }

    /**
     * @notice Verify that there are some number of nodes still unresolved
     */
    function requireUnresolvedExists() public view override {
        uint256 firstUnresolved = firstUnresolvedNode();
        require(
            firstUnresolved > latestConfirmed() && firstUnresolved <= latestNodeCreated(),
            "NO_UNRESOLVED"
        );
    }

    function requireUnresolved(uint256 nodeNum) public view override {
        require(nodeNum >= firstUnresolvedNode(), "ALREADY_DECIDED");
        require(nodeNum <= latestNodeCreated(), "DOESNT_EXIST");
    }

    /**
     * @notice Verify that the given address is staked and not actively in a challenge
     * @param stakerAddress Address to check
     */
    function requireUnchallengedStaker(address stakerAddress) private view {
        require(isStaked(stakerAddress), "NOT_STAKED");
        require(currentChallenge(stakerAddress) == NO_CHAL_INDEX, "IN_CHAL");
    }
}

contract RollupUserLogic is AbsRollupUserLogic, IRollupUser {
    /// @dev the user logic just validated configuration and shouldn't write to state during init
    /// this allows the admin logic to ensure consistency on parameters.
    function initialize(address _stakeToken) external view override onlyProxy {
        require(_stakeToken == address(0), "NO_TOKEN_ALLOWED");
        require(!isERC20Enabled(), "FACET_NOT_ERC20");
    }

    /**
     * @notice Create a new stake on an existing node
     * @param nodeNum Number of the node your stake will be place one
     * @param nodeHash Node hash of the node with the given nodeNum
     */
    function newStakeOnExistingNode(uint64 nodeNum, bytes32 nodeHash) external payable override {
        _newStake(msg.value);
        stakeOnExistingNode(nodeNum, nodeHash);
    }

    /**
     * @notice Create a new stake on a new node
     * @param assertion Assertion describing the state change between the old node and the new one
     * @param expectedNodeHash Node hash of the node that will be created
     * @param prevNodeInboxMaxCount Total of messages in the inbox as of the previous node
     */
    function newStakeOnNewNode(
        Assertion calldata assertion,
        bytes32 expectedNodeHash,
        uint256 prevNodeInboxMaxCount
    ) external payable override {
        _newStake(msg.value);
        stakeOnNewNode(assertion, expectedNodeHash, prevNodeInboxMaxCount);
    }

    /**
     * @notice Increase the amount staked eth for the given staker
     * @param stakerAddress Address of the staker whose stake is increased
     */
    function addToDeposit(address stakerAddress)
        external
        payable
        override
        onlyValidator
        whenNotPaused
    {
        _addToDeposit(stakerAddress, msg.value);
    }

    /**
     * @notice Withdraw uncommitted funds owned by sender from the rollup chain
     */
    function withdrawStakerFunds()
        external
        override
        onlyValidator
        whenNotPausedOrDeprecated
        returns (uint256)
    {
        uint256 amount = withdrawFunds(msg.sender);
        // This is safe because it occurs after all checks and effects
        // solhint-disable-next-line avoid-low-level-calls
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "TRANSFER_FAILED");
        return amount;
    }
}