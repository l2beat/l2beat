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

library Math {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(
        uint256 x,
        uint256 y,
        uint256 denominator
    ) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1);

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(
        uint256 x,
        uint256 y,
        uint256 denominator,
        Rounding rounding
    ) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10**64) {
                value /= 10**64;
                result += 64;
            }
            if (value >= 10**32) {
                value /= 10**32;
                result += 32;
            }
            if (value >= 10**16) {
                value /= 10**16;
                result += 16;
            }
            if (value >= 10**8) {
                value /= 10**8;
                result += 8;
            }
            if (value >= 10**4) {
                value /= 10**4;
                result += 4;
            }
            if (value >= 10**2) {
                value /= 10**2;
                result += 2;
            }
            if (value >= 10**1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10**result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result * 8) < value ? 1 : 0);
        }
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
   uint public MIN_WAIT_PERIOD_EXECUTE=79200; // Minimal 22 hour waiting
   uint public FEE_RATE=10;      // 0.1% fee
   uint public FEE_MIN=5*1e18;   // 5 token min fee
   uint public FEE_MAX=100*1e18; // 100 token max fee
   
   uint constant MAX_FEE_RATE=100; // Max fee rate is 1%
   uint constant MAX_FEE_MIN=100e18; // Max minimum fee is 100 tokens
   uint constant MAX_FEE_MAX=1000e18; // Max fee is 1000 tokens
   
   uint constant public REDUCED_DECIMALS=1e10;
   
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

   constructor(address _token, uint _chainid, address _targetToken, uint _targetChain) {
      //require (block.chainid==_chainid,"Wrong chain");
      chainid=_chainid;
      token = IERC20(_token);
      targetToken = IERC20(_targetToken);
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
   event SetFee(uint previousFeeRate, uint feeRate,uint previousFeeMin, uint feeMin,uint previousFeeMax, uint feeMax);
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
      uint fee = Math.min(Math.max(FEE_MIN,amount*FEE_RATE/10000),FEE_MAX);
      require (amount>fee,"Amount too low");
      require (amount/REDUCED_DECIMALS<=type(uint64).max,"Amount too high");
      TransferHelper.safeTransferFrom(address(token),msg.sender,address(this),amount); 
      uint64 amountAfterFee = uint64((amount-fee)/REDUCED_DECIMALS);
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
   
   function setFee(uint _FEE_RATE, uint _FEE_MIN, uint _FEE_MAX) external isOwner {
      require(_FEE_RATE<MAX_FEE_RATE);
      require(_FEE_MIN<MAX_FEE_MIN);
      require(_FEE_MAX<MAX_FEE_MAX);
      emit SetFee(FEE_RATE,_FEE_RATE,FEE_MIN,_FEE_MIN,FEE_MAX,_FEE_MAX);
      FEE_RATE=_FEE_RATE;
      FEE_MIN=_FEE_MIN;
      FEE_MAX=_FEE_MAX;
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