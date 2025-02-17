// SPDX-License-Identifier: Unknown
pragma solidity 0.6.11;

interface L2ITokenGateway {
  event DepositFinalized(
    address indexed l1Token,
    address indexed from,
    address indexed to,
    uint256 amount
  );

  event WithdrawalInitiated(
    address l1Token,
    address indexed from,
    address indexed to,
    uint256 indexed l2ToL1Id,
    uint256 exitNum,
    uint256 amount
  );

  function outboundTransfer(
    address token,
    address to,
    uint256 amount,
    uint256 maxGas,
    uint256 gasPriceBid,
    bytes calldata data
  ) external returns (bytes memory);

  function finalizeInboundTransfer(
    address token,
    address from,
    address to,
    uint256 amount,
    bytes calldata data
  ) external;

  // if token is not supported this should return 0x0 address
  function calculateL2TokenAddress(address l1Token) external view returns (address);

  // used by router
  function counterpartGateway() external view returns (address);
}

abstract contract L2CrossDomainEnabled {
  event TxToL1(address indexed from, address indexed to, uint256 indexed id, bytes data);

  function sendTxToL1(
    address user,
    address to,
    bytes memory data
  ) internal returns (uint256) {
    // note: this method doesn't support sending ether to L1 together with a call
    uint256 id = ArbSys(address(100)).sendTxToL1(to, data);

    emit TxToL1(user, to, id, data);

    return id;
  }

  modifier onlyL1Counterpart(address l1Counterpart) {
    require(msg.sender == applyL1ToL2Alias(l1Counterpart), "ONLY_COUNTERPART_GATEWAY");
    _;
  }

  uint160 constant offset = uint160(0x1111000000000000000000000000000000001111);

  // l1 addresses are transformed durng l1->l2 calls
  function applyL1ToL2Alias(address l1Address) internal pure returns (address l2Address) {
    l2Address = address(uint160(l1Address) + offset);
  }
}

contract L2DaiGateway is L2CrossDomainEnabled, L2ITokenGateway {
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
    require(wards[msg.sender] == 1, "L2DaiGateway/not-authorized");
    _;
  }

  event Rely(address indexed usr);
  event Deny(address indexed usr);

  address public immutable l1Dai;
  address public immutable l2Dai;
  address public immutable l1Counterpart;
  address public immutable l2Router;
  uint256 public isOpen = 1;

  event Closed();

  constructor(
    address _l1Counterpart,
    address _l2Router,
    address _l1Dai,
    address _l2Dai
  ) public {
    wards[msg.sender] = 1;
    emit Rely(msg.sender);

    l1Dai = _l1Dai;
    l2Dai = _l2Dai;
    l1Counterpart = _l1Counterpart;
    l2Router = _l2Router;
  }

  function close() external auth {
    isOpen = 0;

    emit Closed();
  }

  function outboundTransfer(
    address l1Token,
    address to,
    uint256 amount,
    bytes calldata data
  ) external returns (bytes memory) {
    return outboundTransfer(l1Token, to, amount, 0, 0, data);
  }

  function outboundTransfer(
    address l1Token,
    address to,
    uint256 amount,
    uint256, // maxGas
    uint256, // gasPriceBid
    bytes calldata data
  ) public override returns (bytes memory res) {
    require(isOpen == 1, "L2DaiGateway/closed");
    require(l1Token == l1Dai, "L2DaiGateway/token-not-dai");

    (address from, bytes memory extraData) = parseOutboundData(data);
    require(extraData.length == 0, "L2DaiGateway/call-hook-data-not-allowed");

    Mintable(l2Dai).burn(from, amount);

    uint256 id = sendTxToL1(
      from,
      l1Counterpart,
      getOutboundCalldata(l1Token, from, to, amount, extraData)
    );

    // we don't need to track exitNums (b/c we have no fast exits) so we always use 0
    emit WithdrawalInitiated(l1Token, from, to, id, 0, amount);

    return abi.encode(id);
  }

  function getOutboundCalldata(
    address token,
    address from,
    address to,
    uint256 amount,
    bytes memory data
  ) public pure returns (bytes memory outboundCalldata) {
    outboundCalldata = abi.encodeWithSelector(
      L1ITokenGateway.finalizeInboundTransfer.selector,
      token,
      from,
      to,
      amount,
      abi.encode(0, data) // we don't need to track exitNums (b/c we have no fast exits) so we always use 0
    );

    return outboundCalldata;
  }

  function finalizeInboundTransfer(
    address l1Token,
    address from,
    address to,
    uint256 amount,
    bytes calldata // data -- unsused
  ) external override onlyL1Counterpart(l1Counterpart) {
    require(l1Token == l1Dai, "L2DaiGateway/token-not-dai");

    Mintable(l2Dai).mint(to, amount);

    emit DepositFinalized(l1Token, from, to, amount);
  }

  function calculateL2TokenAddress(address l1Token) external view override returns (address) {
    if (l1Token != l1Dai) {
      return address(0);
    }

    return l2Dai;
  }

  function parseOutboundData(bytes memory data)
    internal
    view
    returns (address from, bytes memory extraData)
  {
    if (msg.sender == l2Router) {
      (from, extraData) = abi.decode(data, (address, bytes));
    } else {
      from = msg.sender;
      extraData = data;
    }
  }

  function counterpartGateway() external view override returns (address) {
    return l1Counterpart;
  }
}