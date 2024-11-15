// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

interface IRollupEventInbox {
    function bridge() external view returns (IBridge);

    function initialize(IBridge _bridge) external;

    function rollup() external view returns (address);

    function updateRollupAddress() external;

    function rollupInitialized(uint256 chainId, string calldata chainConfig) external;
}

interface IDelayedMessageProvider {
    /// @dev event emitted when a inbox message is added to the Bridge's delayed accumulator
    event InboxMessageDelivered(uint256 indexed messageNum, bytes data);

    /// @dev event emitted when a inbox message is added to the Bridge's delayed accumulator
    /// same as InboxMessageDelivered but the batch data is available in tx.input
    event InboxMessageDeliveredFromOrigin(uint256 indexed messageNum);
}

abstract contract DelegateCallAware {
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegate call. This allows a function to be
     * callable on the proxy contract but not on the logic contract.
     */
    modifier onlyDelegated() {
        require(address(this) != __self, "Function must be called through delegatecall");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "Function must not be called through delegatecall");
        _;
    }

    /// @dev Check that msg.sender is the current EIP 1967 proxy admin
    modifier onlyProxyOwner() {
        // Storage slot with the admin of the proxy contract
        // This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1
        bytes32 slot = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
        address admin;
        assembly {
            admin := sload(slot)
        }
        if (msg.sender != admin) revert NotOwner(msg.sender, admin);
        _;
    }
}

library ArbitrumChecker {
    function runningOnArbitrum() internal view returns (bool) {
        (bool ok, bytes memory data) = address(100).staticcall(
            abi.encodeWithSelector(ArbSys.arbOSVersion.selector)
        );
        return ok && data.length == 32;
    }
}

abstract contract AbsRollupEventInbox is
    IRollupEventInbox,
    IDelayedMessageProvider,
    DelegateCallAware
{
    IBridge public override bridge;
    address public override rollup;

    modifier onlyRollup() {
        require(msg.sender == rollup, "ONLY_ROLLUP");
        _;
    }

    function initialize(IBridge _bridge) external override onlyDelegated {
        if (address(bridge) != address(0)) revert AlreadyInit();
        if (address(_bridge) == address(0)) revert HadZeroInit();
        bridge = _bridge;
        rollup = address(_bridge.rollup());
    }

    /// @notice Allows the rollup owner to sync the rollup address
    function updateRollupAddress() external {
        if (msg.sender != IOwnable(rollup).owner())
            revert NotOwner(msg.sender, IOwnable(rollup).owner());
        address newRollup = address(bridge.rollup());
        if (rollup == newRollup) revert RollupNotChanged();
        rollup = newRollup;
    }

    function rollupInitialized(uint256 chainId, string calldata chainConfig)
        external
        override
        onlyRollup
    {
        require(bytes(chainConfig).length > 0, "EMPTY_CHAIN_CONFIG");
        uint8 initMsgVersion = 1;
        uint256 currentDataCost = block.basefee;
        if (ArbitrumChecker.runningOnArbitrum()) {
            currentDataCost += ArbGasInfo(address(0x6c)).getL1BaseFeeEstimate();
        }
        bytes memory initMsg = abi.encodePacked(
            chainId,
            initMsgVersion,
            currentDataCost,
            chainConfig
        );
        uint256 num = _enqueueInitializationMsg(initMsg);
        emit InboxMessageDelivered(num, initMsg);
    }

    function _enqueueInitializationMsg(bytes memory initMsg) internal virtual returns (uint256);
}

contract RollupEventInbox is AbsRollupEventInbox {
    constructor() AbsRollupEventInbox() {}

    function _enqueueInitializationMsg(bytes memory initMsg) internal override returns (uint256) {
        return
            IEthBridge(address(bridge)).enqueueDelayedMessage(
                INITIALIZATION_MSG_TYPE,
                address(0),
                keccak256(initMsg)
            );
    }
}