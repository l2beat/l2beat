// SPDX-License-Identifier: Unknown
pragma solidity 0.8.20;

contract LordsL1Bridge {
    /// @notice The Starknet Core contract address on L1
    address public immutable starknet;

    /// @notice The $LORDS ERC20 contract address on L1
    address public immutable l1Token;

    /// @notice The L2 address of the $LORDS bridge, the counterpart to this contract
    uint256 public immutable l2Bridge;

    event LogDeposit(
        address indexed l1Sender,
        uint256 amount,
        uint256 l2Recipient
    );
    event LogWithdrawal(address indexed l1Recipient, uint256 amount);

    // 2 ** 251 + 17 * 2 ** 192 + 1;
    uint256 private constant CAIRO_PRIME =
        3618502788666131213697322783095070105623107215331596699973092056135872020481;

    // from starkware.starknet.compiler.compile import get_selector_from_name
    // print(get_selector_from_name('handle_deposit'))
    uint256 private constant DEPOSIT_SELECTOR =
        1285101517810983806491589552491143496277809242732141897358598292095611420389;

    // operation ID sent in the L2 -> L1 message
    uint256 private constant PROCESS_WITHDRAWAL = 1;

    function splitUint256(uint256 value)
        internal
        pure
        returns (uint256, uint256)
    {
        uint256 low = value & ((1 << 128) - 1);
        uint256 high = value >> 128;
        return (low, high);
    }

    constructor(
        address _starknet,
        address _l1Token,
        uint256 _l2Bridge
    ) {
        require(_l2Bridge < CAIRO_PRIME, "Invalid L2 bridge address");

        starknet = _starknet;
        l1Token = _l1Token;
        l2Bridge = _l2Bridge;
    }

    /// @notice Function used to bridge $LORDS from L1 to L2
    /// @param amount How many $LORDS to send from msg.sender
    /// @param l2Recipient To which L2 address should we deposit the $LORDS to
    /// @param fee Compulsory fee paid to the sequencer for passing on the message
    function deposit(uint256 amount, uint256 l2Recipient, uint256 fee) external payable {
        require(amount > 0, "Amount is 0");
        require(
            l2Recipient != 0 &&
            l2Recipient != l2Bridge &&
            l2Recipient < CAIRO_PRIME,
            "Invalid L2 recipient"
        );

        uint256[] memory payload = new uint256[](3);
        payload[0] = l2Recipient;
        (payload[1], payload[2]) = splitUint256(amount);

        IERC20Like(l1Token).transferFrom(msg.sender, address(this), amount);
        IStarknetCore(starknet).sendMessageToL2{value: fee}(
            l2Bridge,
            DEPOSIT_SELECTOR,
            payload
        );

        emit LogDeposit(msg.sender, amount, l2Recipient);
    }

    /// @notice Function to process the L2 withdrawal
    /// @param amount How many $LORDS were sent from L2
    /// @param l1Recipient Recipient of the (de)bridged $LORDS
    function withdraw(uint256 amount, address l1Recipient) external {
        uint256[] memory payload = new uint256[](4);
        payload[0] = PROCESS_WITHDRAWAL;
        payload[1] = uint256(uint160(l1Recipient));
        (payload[2], payload[3]) = splitUint256(amount);

        // The call to consumeMessageFromL2 will succeed only if a
        // matching L2->L1 message exists and is ready for consumption.
        IStarknetCore(starknet).consumeMessageFromL2(l2Bridge, payload);
        IERC20Like(l1Token).transfer(l1Recipient, amount);

        emit LogWithdrawal(l1Recipient, amount);
    }
}