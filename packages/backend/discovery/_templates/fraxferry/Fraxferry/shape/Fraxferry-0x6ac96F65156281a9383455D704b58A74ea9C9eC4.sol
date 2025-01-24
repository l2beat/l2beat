// SPDX-License-Identifier: Unknown
pragma solidity 0.8.17;

library TransferHelper {
    /// @notice Transfers tokens from the targeted address to the given destination
    /// @notice Errors with 'STF' if transfer fails
    /// @param token The contract address of the token to be transferred
    /// @param from The originating address from which the tokens will be transferred
    /// @param to The destination address of the transfer
    /// @param value The amount to be transferred
    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        (bool success, bytes memory data) =
            token.call(abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'STF');
    }

    /// @notice Transfers tokens from msg.sender to a recipient
    /// @dev Errors with ST if transfer fails
    /// @param token The contract address of the token which will be transferred
    /// @param to The recipient of the transfer
    /// @param value The value of the transfer
    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.transfer.selector, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'ST');
    }

    /// @notice Approves the stipulated contract to spend the given allowance in the given token
    /// @dev Errors with 'SA' if transfer fails
    /// @param token The contract address of the token to be approved
    /// @param to The target of the approval
    /// @param value The amount of the given token the target will be allowed to spend
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.approve.selector, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'SA');
    }

    /// @notice Transfers ETH to the recipient address
    /// @dev Fails with `STE`
    /// @param to The destination of the transfer
    /// @param value The value to be transferred
    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'STE');
    }
}

contract Fraxferry {
   IERC20 immutable public token;
   IERC20 immutable public targetToken;
   uint immutable public chainid;
   uint immutable public targetChain;   
   
   address public owner;
   address public nominatedOwner;
   address public captain;
   address public firstOfficer;
   mapping(address => bool) public crewmembers;

   bool public paused;
   
   uint public MIN_WAIT_PERIOD_ADD=3600; // Minimal 1 hour waiting
   uint public MIN_WAIT_PERIOD_EXECUTE=3600; // Minimal 1 hour waiting
   uint public FEE=1*1e18; // 1 token
   uint immutable MAX_FEE=100e18; // Max fee is 100 tokens
   uint immutable public REDUCED_DECIMALS=1e10;
   
   Transaction[] public transactions;
   mapping(uint => bool) public cancelled;
   uint public executeIndex;
   Batch[] public batches;
   
   struct Transaction {
      address user;
      uint64 amount;
      uint32 timestamp;
   }
   
   struct Batch {
      uint64 start;
      uint64 end;
      uint64 departureTime;
      uint64 status;
      bytes32 hash;
   }
   
   struct BatchData {
      uint startTransactionNo;
      Transaction[] transactions;
   }

   constructor(IERC20 _token, uint _chainid, IERC20 _targetToken, uint _targetChain) {
      //require (block.chainid==_chainid,"Wrong chain");
      chainid=_chainid;
      token = _token;
      targetToken = _targetToken;
      owner = msg.sender;
      targetChain = _targetChain;
   }
   
   
   // ############## Events ##############
   
   event Embark(address indexed sender, uint index, uint amount, uint amountAfterFee, uint timestamp);
   event Disembark(uint start, uint end, bytes32 hash); 
   event Depart(uint batchNo,uint start,uint end,bytes32 hash); 
   event RemoveBatch(uint batchNo);
   event DisputeBatch(uint batchNo, bytes32 hash);
   event Cancelled(uint index, bool cancel);
   event Pause(bool paused);
   event OwnerNominated(address indexed newOwner);
   event OwnerChanged(address indexed previousOwner,address indexed newOwner);
   event SetCaptain(address indexed previousCaptain, address indexed newCaptain);   
   event SetFirstOfficer(address indexed previousFirstOfficer, address indexed newFirstOfficer);
   event SetCrewmember(address indexed crewmember,bool set); 
   event SetFee(uint previousFee, uint fee);
   event SetMinWaitPeriods(uint previousMinWaitAdd,uint previousMinWaitExecute,uint minWaitAdd,uint minWaitExecute); 
   
   // ############## Modifiers ##############
   
   modifier isOwner() {
      require (msg.sender==owner,"Not owner");
      _;
   }
   
   modifier isCaptain() {
      require (msg.sender==captain,"Not captain");
      _;
   }
   
   modifier isFirstOfficer() {
      require (msg.sender==firstOfficer,"Not first officer");
      _;
   }   
    
   modifier isCrewmember() {
      require (crewmembers[msg.sender] || msg.sender==owner || msg.sender==captain || msg.sender==firstOfficer,"Not crewmember");
      _;
   }
   
   modifier notPaused() {
      require (!paused,"Paused");
      _;
   } 
   
   // ############## Ferry actions ##############
   
   function embarkWithRecipient(uint amount, address recipient) public notPaused {
      amount = (amount/REDUCED_DECIMALS)*REDUCED_DECIMALS; // Round amount to fit in data structure
      require (amount>FEE,"Amount too low");
      require (amount/REDUCED_DECIMALS<=type(uint64).max,"Amount too high");
      TransferHelper.safeTransferFrom(address(token),msg.sender,address(this),amount); 
      uint64 amountAfterFee = uint64((amount-FEE)/REDUCED_DECIMALS);
      emit Embark(recipient,transactions.length,amount,amountAfterFee*REDUCED_DECIMALS,block.timestamp);
      transactions.push(Transaction(recipient,amountAfterFee,uint32(block.timestamp)));   
   }
   
   function embark(uint amount) public {
      embarkWithRecipient(amount, msg.sender) ;
   }

   function embarkWithSignature(
      uint256 _amount,
      address recipient,
      uint256 deadline,
      bool approveMax,
      uint8 v,
      bytes32 r,
      bytes32 s
   ) public {
      uint amount = approveMax ? type(uint256).max : _amount;
      IERC20Permit(address(token)).permit(msg.sender, address(this), amount, deadline, v, r, s);
      embarkWithRecipient(amount,recipient);
   }   
   
   function depart(uint start, uint end, bytes32 hash) external notPaused isCaptain {
      require ((batches.length==0 && start==0) || (batches.length>0 && start==batches[batches.length-1].end+1),"Wrong start");
      require (end>=start && end<type(uint64).max,"Wrong end");
      batches.push(Batch(uint64(start),uint64(end),uint64(block.timestamp),0,hash));
      emit Depart(batches.length-1,start,end,hash);
   }
   
   function disembark(BatchData calldata batchData) external notPaused isFirstOfficer {
      Batch memory batch = batches[executeIndex++];
      require (batch.status==0,"Batch disputed");
      require (batch.start==batchData.startTransactionNo,"Wrong start");
      require (batch.start+batchData.transactions.length-1==batch.end,"Wrong size");
      require (block.timestamp-batch.departureTime>=MIN_WAIT_PERIOD_EXECUTE,"Too soon");
      
      bytes32 hash = keccak256(abi.encodePacked(targetChain, targetToken, chainid, token, batch.start));
      for (uint i=0;i<batchData.transactions.length;++i) {
         if (!cancelled[batch.start+i]) {
            TransferHelper.safeTransfer(address(token),batchData.transactions[i].user,batchData.transactions[i].amount*REDUCED_DECIMALS);
         }
         hash = keccak256(abi.encodePacked(hash, batchData.transactions[i].user,batchData.transactions[i].amount));
      }
      require (batch.hash==hash,"Wrong hash");
      emit Disembark(batch.start,batch.end,hash);
   }
   
   function removeBatches(uint batchNo) external isOwner {
      require (executeIndex<=batchNo,"Batch already executed");
      while (batches.length>batchNo) batches.pop();
      emit RemoveBatch(batchNo);
   }
   
   function disputeBatch(uint batchNo, bytes32 hash) external isCrewmember {
      require (batches[batchNo].hash==hash,"Wrong hash");
      require (executeIndex<=batchNo,"Batch already executed");
      require (batches[batchNo].status==0,"Batch already disputed");
      batches[batchNo].status=1; // Set status on disputed
      _pause(true);
      emit DisputeBatch(batchNo,hash);
   }
   
   function pause() external isCrewmember {
      _pause(true);
   }
   
   function unPause() external isOwner {
      _pause(false);
   }   
   
   function _pause(bool _paused) internal {
      paused=_paused;
      emit Pause(_paused);
   } 
   
   function _jettison(uint index, bool cancel) internal {
      require (executeIndex==0 || index>batches[executeIndex-1].end,"Transaction already executed");
      cancelled[index]=cancel;
      emit Cancelled(index,cancel);
   }
   
   function jettison(uint index, bool cancel) external isOwner {
      _jettison(index,cancel);
   }
   
   function jettisonGroup(uint[] calldata indexes, bool cancel) external isOwner {
      for (uint i=0;i<indexes.length;++i) {
         _jettison(indexes[i],cancel);
      }
   }   
   
   // ############## Parameters management ##############
   
   function setFee(uint _FEE) external isOwner {
      require(FEE<MAX_FEE);
      emit SetFee(FEE,_FEE);
      FEE=_FEE;
   }
   
   function setMinWaitPeriods(uint _MIN_WAIT_PERIOD_ADD, uint _MIN_WAIT_PERIOD_EXECUTE) external isOwner {
      require(_MIN_WAIT_PERIOD_ADD>=3600 && _MIN_WAIT_PERIOD_EXECUTE>=3600,"Period too short");
      emit SetMinWaitPeriods(MIN_WAIT_PERIOD_ADD, MIN_WAIT_PERIOD_EXECUTE,_MIN_WAIT_PERIOD_ADD, _MIN_WAIT_PERIOD_EXECUTE);
      MIN_WAIT_PERIOD_ADD=_MIN_WAIT_PERIOD_ADD;
      MIN_WAIT_PERIOD_EXECUTE=_MIN_WAIT_PERIOD_EXECUTE;
   }
   
   // ############## Roles management ##############
   
   function nominateNewOwner(address newOwner) external isOwner {
      nominatedOwner = newOwner;
      emit OwnerNominated(newOwner);
   }   
   
   function acceptOwnership() external {
      require(msg.sender == nominatedOwner, "You must be nominated before you can accept ownership");
      emit OwnerChanged(owner, nominatedOwner);
      owner = nominatedOwner;
      nominatedOwner = address(0);
   }
   
   function setCaptain(address newCaptain) external isOwner {
      emit SetCaptain(captain,newCaptain);
      captain=newCaptain;
   }
   
   function setFirstOfficer(address newFirstOfficer) external isOwner {
      emit SetFirstOfficer(firstOfficer,newFirstOfficer);
      firstOfficer=newFirstOfficer;
   }    
   
   function setCrewmember(address crewmember, bool set) external isOwner {
      crewmembers[crewmember]=set;
      emit SetCrewmember(crewmember,set);
   }   
  
   
   // ############## Token management ##############   
   
   function sendTokens(address receiver, uint amount) external isOwner {
      require (receiver!=address(0),"Zero address not allowed");
      TransferHelper.safeTransfer(address(token),receiver,amount);
   }   
   
   // Generic proxy
   function execute(address _to, uint256 _value, bytes calldata _data) external isOwner returns (bool, bytes memory) {
      require(_data.length==0 || _to.code.length>0,"Can not call a function on a EOA");
      (bool success, bytes memory result) = _to.call{value:_value}(_data);
      return (success, result);
   }   
   
   // ############## Views ##############
   function getNextBatch(uint _start, uint max) public view returns (uint start, uint end, bytes32 hash) {
      uint cutoffTime = block.timestamp-MIN_WAIT_PERIOD_ADD;
      if (_start<transactions.length && transactions[_start].timestamp<cutoffTime) {
         start=_start;
         end=start+max-1;
         if (end>=transactions.length) end=transactions.length-1;
         while(transactions[end].timestamp>=cutoffTime) end--;
         hash = getTransactionsHash(start,end);
      }
   }
   
   function getBatchData(uint start, uint end) public view returns (BatchData memory data) {
      data.startTransactionNo = start;
      data.transactions = new Transaction[](end-start+1);
      for (uint i=start;i<=end;++i) {
         data.transactions[i-start]=transactions[i];
      }
   }
   
   function getBatchAmount(uint start, uint end) public view returns (uint totalAmount) {
      for (uint i=start;i<=end;++i) {
         totalAmount+=transactions[i].amount;
      }
      totalAmount*=REDUCED_DECIMALS;
   }
   
   function getTransactionsHash(uint start, uint end) public view returns (bytes32) {
      bytes32 result = keccak256(abi.encodePacked(chainid, token, targetChain, targetToken, uint64(start)));
      for (uint i=start;i<=end;++i) {
         result = keccak256(abi.encodePacked(result, transactions[i].user,transactions[i].amount));
      }
      return result;
   }   
   
   function noTransactions() public view returns (uint) {
      return transactions.length;
   }
   
   function noBatches() public view returns (uint) {
      return batches.length;
   }
}