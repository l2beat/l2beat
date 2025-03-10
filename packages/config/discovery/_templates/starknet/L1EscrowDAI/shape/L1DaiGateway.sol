// SPDX-License-Identifier: Unknown
pragma solidity 0.8.14;

contract L1DAIBridge {
    // --- Auth ---
    mapping(address => uint256) public wards;

    function rely(address usr) external auth {
        wards[usr] = 1;
        emit Rely(usr);
    }

    function deny(address usr) external auth {
        wards[usr] = 0;
        emit Deny(usr);
    }

    modifier auth() {
        require(wards[msg.sender] == 1, "L1DAIBridge/not-authorized");
        _;
    }

    event Rely(address indexed usr);
    event Deny(address indexed usr);


    uint256 public isOpen = 1;

    modifier whenOpen() {
        require(isOpen == 1, "L1DAIBridge/closed");
        _;
    }

    function close() external auth {
        isOpen = 0;
        emit Closed();
    }

    event Closed();

    address public immutable starkNet;
    address public immutable dai;
    uint256 public immutable l2Dai;
    address public immutable escrow;
    uint256 public immutable l2DaiBridge;

    uint256 public ceiling = 0;
    uint256 public maxDeposit = type(uint256).max;

    uint256 constant HANDLE_WITHDRAW = 0;

    // src/starkware/cairo/lang/cairo_constants.py
    //  2 ** 251 + 17 * 2 ** 192 + 1;
    uint256 constant SN_PRIME =
        3618502788666131213697322783095070105623107215331596699973092056135872020481;

    //  from starkware.starknet.compiler.compile import get_selector_from_name
    //  print(get_selector_from_name('handle_deposit'))
    uint256 constant DEPOSIT =
        1285101517810983806491589552491143496277809242732141897358598292095611420389;

    //  print(get_selector_from_name('handle_force_withdrawal'))
    uint256 constant FORCE_WITHDRAW =
        1137729855293860737061629600728503767337326808607526258057644140918272132445;

    event LogCeiling(uint256 ceiling);
    event LogMaxDeposit(uint256 maxDeposit);
    event LogDeposit(address indexed l1Sender, uint256 amount, uint256 l2Recipient);
    event LogWithdrawal(address indexed l1Recipient, uint256 amount);
    event LogForceWithdrawal(address indexed l1Recipient, uint256 amount, uint256 indexed l2Sender);
    event LogStartDepositCancellation(uint256 indexed l2Receipient, uint256 amount, uint256 nonce);
    event LogCancelDeposit(
        uint256 indexed l2Recipient, address l1Recipient, uint256 amount, uint256 nonce
    );

    constructor(
        address _starkNet,
        address _dai,
        uint256 _l2Dai,
        address _escrow,
        uint256 _l2DaiBridge
    ) {
        wards[msg.sender] = 1;
        emit Rely(msg.sender);

        starkNet = _starkNet;
        dai = _dai;
        l2Dai = _l2Dai;
        escrow = _escrow;
        l2DaiBridge = _l2DaiBridge;
    }

    function setCeiling(uint256 _ceiling) external auth whenOpen {
        ceiling = _ceiling;
        emit LogCeiling(_ceiling);
    }

    function setMaxDeposit(uint256 _maxDeposit) external auth whenOpen {
        maxDeposit = _maxDeposit;
        emit LogMaxDeposit(_maxDeposit);
    }

    // slither-disable-next-line similar-names
    function deposit(
        uint256 amount,
        uint256 l2Recipient
    ) external payable whenOpen {
        emit LogDeposit(msg.sender, amount, l2Recipient);

        require(l2Recipient != 0 && l2Recipient != l2Dai && l2Recipient < SN_PRIME, "L1DAIBridge/invalid-address");

        require(amount <= maxDeposit, "L1DAIBridge/above-max-deposit");

        TokenLike(dai).transferFrom(msg.sender, escrow, amount);

        require(
            TokenLike(dai).balanceOf(escrow) <= ceiling,
            "L1DAIBridge/above-ceiling"
        );

        uint256[] memory payload = new uint256[](4);
        payload[0] = l2Recipient;
        (payload[1], payload[2]) = toSplitUint(amount);
        payload[3] = uint256(uint160(msg.sender));

        StarkNetLike(starkNet).sendMessageToL2{value: msg.value}(l2DaiBridge, DEPOSIT, payload);
    }

    function toSplitUint(uint256 value) internal pure returns (uint256, uint256) {
      uint256 low = value & ((1 << 128) - 1);
      uint256 high = value >> 128;
      return (low, high);
    }

    // slither-disable-next-line similar-names
    function withdraw(uint256 amount, address l1Recipient) external {
        emit LogWithdrawal(l1Recipient, amount);

        uint256[] memory payload = new uint256[](4);
        payload[0] = HANDLE_WITHDRAW;
        payload[1] = uint256(uint160(msg.sender));
        (payload[2], payload[3]) = toSplitUint(amount);

        StarkNetLike(starkNet).consumeMessageFromL2(l2DaiBridge, payload);
        TokenLike(dai).transferFrom(escrow, l1Recipient, amount);
    }

    function forceWithdrawal(uint256 amount, uint256 l2Sender) external payable whenOpen {
        emit LogForceWithdrawal(msg.sender, amount, l2Sender);

        uint256[] memory payload = new uint256[](4);
        payload[0] = l2Sender;
        payload[1] = uint256(uint160(msg.sender));
        (payload[2], payload[3]) = toSplitUint(amount);

        StarkNetLike(starkNet).sendMessageToL2{value: msg.value}(l2DaiBridge, FORCE_WITHDRAW, payload);
    }

    function startDepositCancellation(
        uint256 amount,
        uint256 l2Recipient,
        uint256 nonce
    ) external {
        emit LogStartDepositCancellation(l2Recipient, amount, nonce);

        uint256[] memory payload = new uint256[](4);
        payload[0] = l2Recipient;
        (payload[1], payload[2]) = toSplitUint(amount);
        payload[3] = uint256(uint160(msg.sender));

        StarkNetLike(starkNet).startL1ToL2MessageCancellation(l2DaiBridge, DEPOSIT, payload, nonce);
    }

    function cancelDeposit(
        uint256 amount,
        uint256 l2Recipient,
        // slither-disable-next-line similar-names
        address l1Recipient,
        uint256 nonce
    ) external {
        emit LogCancelDeposit(l2Recipient, l1Recipient, amount, nonce);

        uint256[] memory payload = new uint256[](4);
        payload[0] = l2Recipient;
        (payload[1], payload[2]) = toSplitUint(amount);
        payload[3] = uint256(uint160(msg.sender));

        StarkNetLike(starkNet).cancelL1ToL2Message(l2DaiBridge, DEPOSIT, payload, nonce);
        TokenLike(dai).transferFrom(escrow, l1Recipient, amount);
    }
}