// SPDX-License-Identifier: Unknown
pragma solidity 0.8.10;

interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

abstract contract TokenRateAndUpdateTimestampProvider {

    /// @notice Non-rebasable token of Core Lido procotol.
    address public immutable WSTETH;

    /// @notice Address of the AccountingOracle instance
    address public immutable ACCOUNTING_ORACLE;

    /// @notice Timetamp of the Consensus Layer genesis
    uint256 public immutable GENESIS_TIME;

    /// @notice Seconds per single Consensus Layer slot
    uint256 public immutable SECONDS_PER_SLOT;

    /// @notice Token rate decimals to push
    uint256 public constant TOKEN_RATE_DECIMALS = 27;

    constructor(address wstETH_, address accountingOracle_) {
        if (wstETH_ == address(0)) {
            revert ErrorZeroAddressWstETH();
        }
        if (accountingOracle_ == address(0)) {
            revert ErrorZeroAddressAccountingOracle();
        }
        WSTETH = wstETH_;
        ACCOUNTING_ORACLE = accountingOracle_;
        GENESIS_TIME = IAccountingOracle(ACCOUNTING_ORACLE).GENESIS_TIME();
        SECONDS_PER_SLOT = IAccountingOracle(ACCOUNTING_ORACLE).SECONDS_PER_SLOT();
    }

    function _getTokenRateAndUpdateTimestamp() internal view returns (uint256 rate, uint256 updateTimestamp) {
        rate = IERC20WstETH(WSTETH).getStETHByWstETH(10 ** TOKEN_RATE_DECIMALS);

        /// @dev github.com/ethereum/consensus-specs/blob/dev/specs/bellatrix/beacon-chain.md#compute_timestamp_at_slot
        updateTimestamp = GENESIS_TIME + SECONDS_PER_SLOT * IAccountingOracle(
            ACCOUNTING_ORACLE
        ).getLastProcessingRefSlot();
    }

    error ErrorZeroAddressWstETH();
    error ErrorZeroAddressAccountingOracle();
}

contract CrossDomainEnabled {
    /// @notice Messenger contract used to send and receive messages from the other domain
    ICrossDomainMessenger public immutable MESSENGER;

    /// @param messenger_ Address of the CrossDomainMessenger on the current layer
    constructor(address messenger_) {
        if (messenger_ == address(0)) {
            revert ErrorZeroAddressMessenger();
        }
        MESSENGER = ICrossDomainMessenger(messenger_);
    }

    /// @dev Sends a message to an account on another domain
    /// @param crossDomainTarget_ Intended recipient on the destination domain
    /// @param message_ Data to send to the target (usually calldata to a function with
    ///     `onlyFromCrossDomainAccount()`)
    /// @param gasLimit_ gasLimit for the receipt of the message on the target domain.
    function sendCrossDomainMessage(
        address crossDomainTarget_,
        uint32 gasLimit_,
        bytes memory message_
    ) internal {
        MESSENGER.sendMessage(crossDomainTarget_, message_, gasLimit_);
    }

    /// @dev Enforces that the modified function is only callable by a specific cross-domain account
    /// @param sourceDomainAccount_ The only account on the originating domain which is
    ///     authenticated to call this function
    modifier onlyFromCrossDomainAccount(address sourceDomainAccount_) {
        if (msg.sender != address(MESSENGER)) {
            revert ErrorUnauthorizedMessenger();
        }
        if (MESSENGER.xDomainMessageSender() != sourceDomainAccount_) {
            revert ErrorWrongCrossDomainSender();
        }
        _;
    }

    error ErrorZeroAddressMessenger();
    error ErrorUnauthorizedMessenger();
    error ErrorWrongCrossDomainSender();
}

interface ITokenRatePusher {
    /// @notice Pushes token rate to L2 by depositing zero token amount.
    function pushTokenRate() external;
}

contract OpStackTokenRatePusher is ITokenRatePusher, CrossDomainEnabled, TokenRateAndUpdateTimestampProvider, ERC165 {

    /// @notice Oracle address on L2 for receiving token rate.
    address public immutable L2_TOKEN_RATE_ORACLE;

    /// @notice Gas limit for L2 required to finish pushing token rate on L2 side.
    ///         Client pays for gas on L2 by burning it on L1.
    ///         Depends linearly on deposit data length and gas used for finalizing deposit on L2.
    ///         Formula to find value:
    ///         (gas cost of L2Bridge.finalizeDeposit() + OptimismPortal.minimumGasLimit(depositData.length)) * 1.5
    uint32 public immutable L2_GAS_LIMIT_FOR_PUSHING_TOKEN_RATE;

    /// @param messenger_ L1 messenger address being used for cross-chain communications.
    /// @param wstETH_ L1 token bridge address.
    /// @param accountingOracle_ Address of the AccountingOracle instance to retrieve rate update timestamps.
    /// @param tokenRateOracle_ Oracle address on L2 for receiving token rate.
    /// @param l2GasLimitForPushingTokenRate_ Gas limit required to complete pushing token rate on L2.
    constructor(
        address messenger_,
        address wstETH_,
        address accountingOracle_,
        address tokenRateOracle_,
        uint32 l2GasLimitForPushingTokenRate_
    ) CrossDomainEnabled(messenger_) TokenRateAndUpdateTimestampProvider(wstETH_, accountingOracle_) {
        if (tokenRateOracle_ == address(0)) {
            revert ErrorZeroAddressTokenRateOracle();
        }
        L2_TOKEN_RATE_ORACLE = tokenRateOracle_;
        L2_GAS_LIMIT_FOR_PUSHING_TOKEN_RATE = l2GasLimitForPushingTokenRate_;
    }

    /// @inheritdoc ITokenRatePusher
    function pushTokenRate() external {
        (uint256 rate, uint256 updateTimestamp) = _getTokenRateAndUpdateTimestamp();

        bytes memory message = abi.encodeWithSelector(ITokenRateUpdatable.updateRate.selector, rate, updateTimestamp);

        sendCrossDomainMessage(L2_TOKEN_RATE_ORACLE, L2_GAS_LIMIT_FOR_PUSHING_TOKEN_RATE, message);
    }

    /// @inheritdoc ERC165
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return (
            _interfaceId == type(ITokenRatePusher).interfaceId
            || super.supportsInterface(_interfaceId)
        );
    }

    error ErrorZeroAddressTokenRateOracle();
}