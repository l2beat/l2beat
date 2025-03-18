// SPDX-License-Identifier: Unknown
pragma solidity 0.6.11;

interface L1ITokenGateway {
  event DepositInitiated(
    address l1Token,
    address indexed from,
    address indexed to,
    uint256 indexed sequenceNumber,
    uint256 amount
  );

  event WithdrawalFinalized(
    address l1Token,
    address indexed from,
    address indexed to,
    uint256 indexed exitNum,
    uint256 amount
  );

  function outboundTransfer(
    address token,
    address to,
    uint256 amount,
    uint256 maxGas,
    uint256 gasPriceBid,
    bytes calldata data
  ) external payable returns (bytes memory);

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

abstract contract L1CrossDomainEnabled {
  IInbox public immutable inbox;

  event TxToL2(address indexed from, address indexed to, uint256 indexed seqNum, bytes data);

  constructor(address _inbox) public {
    inbox = IInbox(_inbox);
  }

  modifier onlyL2Counterpart(address l2Counterpart) {
    // a message coming from the counterpart gateway was executed by the bridge
    address bridge = inbox.bridge();
    require(msg.sender == bridge, "NOT_FROM_BRIDGE");

    // and the outbox reports that the L2 address of the sender is the counterpart gateway
    address l2ToL1Sender = IOutbox(IBridge(bridge).activeOutbox()).l2ToL1Sender();
    require(l2ToL1Sender == l2Counterpart, "ONLY_COUNTERPART_GATEWAY");
    _;
  }

  function sendTxToL2(
    address target,
    address user,
    uint256 maxSubmissionCost,
    uint256 maxGas,
    uint256 gasPriceBid,
    bytes memory data
  ) internal returns (uint256) {
    uint256 seqNum = inbox.createRetryableTicket{value: msg.value}(
      target,
      0, // we always assume that l2CallValue = 0
      maxSubmissionCost,
      user,
      user,
      maxGas,
      gasPriceBid,
      data
    );
    emit TxToL2(user, target, seqNum, data);
    return seqNum;
  }

  function sendTxToL2NoAliasing(
    address target,
    address user,
    uint256 l1CallValue,
    uint256 maxSubmissionCost,
    uint256 maxGas,
    uint256 gasPriceBid,
    bytes memory data
  ) internal returns (uint256) {
    uint256 seqNum = inbox.createRetryableTicketNoRefundAliasRewrite{value: l1CallValue}(
      target,
      0, // we always assume that l2CallValue = 0
      maxSubmissionCost,
      user,
      user,
      maxGas,
      gasPriceBid,
      data
    );
    emit TxToL2(user, target, seqNum, data);
    return seqNum;
  }
}

contract L1DaiGateway is L1CrossDomainEnabled, L1ITokenGateway {
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
    require(wards[msg.sender] == 1, "L1DaiGateway/not-authorized");
    _;
  }

  event Rely(address indexed usr);
  event Deny(address indexed usr);

  address public immutable l1Dai;
  address public immutable l2Dai;
  address public immutable l1Escrow;
  address public immutable l1Router;
  address public immutable l2Counterpart;
  uint256 public isOpen = 1;

  event Closed();

  constructor(
    address _l2Counterpart,
    address _l1Router,
    address _inbox,
    address _l1Dai,
    address _l2Dai,
    address _l1Escrow
  ) public L1CrossDomainEnabled(_inbox) {
    wards[msg.sender] = 1;
    emit Rely(msg.sender);

    l1Dai = _l1Dai;
    l2Dai = _l2Dai;
    l1Escrow = _l1Escrow;
    l1Router = _l1Router;
    l2Counterpart = _l2Counterpart;
  }

  function close() external auth {
    isOpen = 0;

    emit Closed();
  }

  function outboundTransfer(
    address l1Token,
    address to,
    uint256 amount,
    uint256 maxGas,
    uint256 gasPriceBid,
    bytes calldata data
  ) external payable override returns (bytes memory) {
    // do not allow initiating new xchain messages if bridge is closed
    require(isOpen == 1, "L1DaiGateway/closed");
    require(l1Token == l1Dai, "L1DaiGateway/token-not-dai");

    // we use nested scope to avoid stack too deep errors
    address from;
    uint256 seqNum;
    bytes memory extraData;
    {
      uint256 maxSubmissionCost;
      (from, maxSubmissionCost, extraData) = parseOutboundData(data);
      require(extraData.length == 0, "L1DaiGateway/call-hook-data-not-allowed");

      TokenLike(l1Token).transferFrom(from, l1Escrow, amount);

      bytes memory outboundCalldata = getOutboundCalldata(l1Token, from, to, amount, extraData);
      seqNum = sendTxToL2(
        l2Counterpart,
        from,
        maxSubmissionCost,
        maxGas,
        gasPriceBid,
        outboundCalldata
      );
    }

    emit DepositInitiated(l1Token, from, to, seqNum, amount);

    return abi.encode(seqNum);
  }

  function getOutboundCalldata(
    address l1Token,
    address from,
    address to,
    uint256 amount,
    bytes memory data
  ) public pure returns (bytes memory outboundCalldata) {
    bytes memory emptyBytes = "";

    outboundCalldata = abi.encodeWithSelector(
      L2ITokenGateway.finalizeInboundTransfer.selector,
      l1Token,
      from,
      to,
      amount,
      abi.encode(emptyBytes, data)
    );

    return outboundCalldata;
  }

  function finalizeInboundTransfer(
    address l1Token,
    address from,
    address to,
    uint256 amount,
    bytes calldata data
  ) external override onlyL2Counterpart(l2Counterpart) {
    require(l1Token == l1Dai, "L1DaiGateway/token-not-dai");
    (uint256 exitNum, ) = abi.decode(data, (uint256, bytes));

    TokenLike(l1Token).transferFrom(l1Escrow, to, amount);

    emit WithdrawalFinalized(l1Token, from, to, exitNum, amount);
  }

  function parseOutboundData(bytes memory data)
    internal
    view
    returns (
      address from,
      uint256 maxSubmissionCost,
      bytes memory extraData
    )
  {
    if (msg.sender == l1Router) {
      // router encoded
      (from, extraData) = abi.decode(data, (address, bytes));
    } else {
      from = msg.sender;
      extraData = data;
    }
    // user encoded
    (maxSubmissionCost, extraData) = abi.decode(extraData, (uint256, bytes));
  }

  function calculateL2TokenAddress(address l1Token) external view override returns (address) {
    if (l1Token != l1Dai) {
      return address(0);
    }

    return l2Dai;
  }

  function counterpartGateway() external view override returns (address) {
    return l2Counterpart;
  }
}