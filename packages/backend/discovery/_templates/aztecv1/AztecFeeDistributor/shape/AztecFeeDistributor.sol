// SPDX-License-Identifier: Unknown
pragma solidity 0.6.10;

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'ds-math-add-overflow');
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'ds-math-sub-underflow');
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
    }
}

library UniswapV2Library {
    using SafeMath for uint;

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(uint(keccak256(abi.encodePacked(
                hex'ff',
                factory,
                keccak256(abi.encodePacked(token0, token1)),
                hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f' // init code hash
            ))));
    }

    // fetches and sorts the reserves for a pair
    function getReserves(address factory, address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset
    function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
        require(amountA > 0, 'UniswapV2Library: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        amountB = amountA.mul(reserveB) / reserveA;
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {
        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(997);
        amountIn = (numerator / denominator).add(1);
    }

    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(address factory, uint amountIn, address[] memory path) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');
        amounts = new uint[](path.length);
        amounts[0] = amountIn;
        for (uint i; i < path.length - 1; i++) {
            (uint reserveIn, uint reserveOut) = getReserves(factory, path[i], path[i + 1]);
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }

    // performs chained getAmountIn calculations on any number of pairs
    function getAmountsIn(address factory, uint amountOut, address[] memory path) internal view returns (uint[] memory amounts) {
        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');
        amounts = new uint[](path.length);
        amounts[amounts.length - 1] = amountOut;
        for (uint i = path.length - 1; i > 0; i--) {
            (uint reserveIn, uint reserveOut) = getReserves(factory, path[i - 1], path[i]);
            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);
        }
    }
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryDiv}.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

interface IFeeDistributor {
    event FeeReimbursed(address receiver, uint256 amount);
    event Convert(uint256 assetId, uint256 inputValue, uint256 outputValue);

    function reimburseConstant() external pure returns (uint256);

    function convertConstant() external pure returns (uint256);

    function rollupProcessor() external pure returns (address);

    function router() external pure returns (address);

    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function setReimburseConstant(uint256 _reimburseConstant) external;

    function setConvertConstant(uint256 _convertConstant) external;

    function txFeeBalance(uint256 assetId) external view returns (uint256);

    function deposit(uint256 assetId, uint256 amount) external payable returns (uint256 depositedAmount);

    function reimburseGas(
        uint256 gasUsed,
        uint256 feeLimit,
        address payable feeReceiver
    ) external returns (uint256 reimbursement);

    function convert(uint256 assetId, uint256 minOutputValue) external returns (uint256 outputValue);
}

contract AztecFeeDistributor is IFeeDistributor, Ownable {
    using SafeMath for uint256;

    uint256 constant ethAssetId = 0;

    uint256 public override reimburseConstant = 16 * 14465;
    uint256 public override convertConstant = 157768 * 20; // gas for calling convert() / 5%
    address public immutable override rollupProcessor;
    address public immutable override router;
    address public immutable override factory;
    address public immutable override WETH;

    constructor(address _rollupProcessor, address _router) public {
        rollupProcessor = _rollupProcessor;
        router = _router;
        factory = IUniswapV2Router02(_router).factory();
        WETH = IUniswapV2Router02(_router).WETH();
    }

    receive() external payable {}

    function setReimburseConstant(uint256 _reimburseConstant) external override onlyOwner {
        reimburseConstant = _reimburseConstant;
    }

    function setConvertConstant(uint256 _convertConstant) external override onlyOwner {
        convertConstant = _convertConstant;
    }

    function txFeeBalance(uint256 assetId) public override view returns (uint256) {
        if (assetId == ethAssetId) {
            return address(this).balance;
        } else {
            address assetAddress = IRollupProcessor(rollupProcessor).getSupportedAsset(assetId);
            return IERC20(assetAddress).balanceOf(address(this));
        }
    }

    function deposit(uint256 assetId, uint256 amount) external override payable returns (uint256 depositedAmount) {
        if (assetId == ethAssetId) {
            require(amount == msg.value, 'Fee Distributor: WRONG_AMOUNT');
        } else {
            require(msg.value == 0, 'Fee Distributor: WRONG_PAYMENT_TYPE');

            address assetAddress = IRollupProcessor(rollupProcessor).getSupportedAsset(assetId);
            IERC20(assetAddress).transferFrom(msg.sender, address(this), amount);

            uint256 balance = IERC20(assetAddress).balanceOf(address(this));
            uint256 outputValue = getAmountOut(assetAddress, balance);
            if (outputValue >= convertConstant.mul(tx.gasprice)) {
                swapTokensForETH(assetAddress, balance, outputValue);

                emit Convert(assetId, balance, outputValue);
            }
        }

        depositedAmount = amount;
    }

    function reimburseGas(
        uint256 gasUsed,
        uint256 feeLimit,
        address payable feeReceiver
    ) external override returns (uint256 reimbursement) {
        require(msg.sender == rollupProcessor, 'Fee Distributor: INVALID_CALLER');

        reimbursement = gasUsed.add(reimburseConstant).mul(tx.gasprice);
        require(reimbursement <= feeLimit, 'Fee Distributor: FEE_LIMIT_EXCEEDED');

        (bool success, ) = feeReceiver.call{value: reimbursement}('');
        require(success, 'Fee Distributor: REIMBURSE_GAS_FAILED');

        emit FeeReimbursed(feeReceiver, reimbursement);
    }

    function convert(uint256 assetId, uint256 minOutputValue) public override onlyOwner returns (uint256 outputValue) {
        require(assetId != ethAssetId, 'Fee Distributor: NOT_A_TOKEN_ASSET');

        address assetAddress = IRollupProcessor(rollupProcessor).getSupportedAsset(assetId);
        uint256 inputValue = IERC20(assetAddress).balanceOf(address(this));
        require(inputValue > 0, 'Fee Distributor: EMPTY_BALANCE');

        outputValue = getAmountOut(assetAddress, inputValue);
        require(outputValue >= minOutputValue, 'Fee Distributor: INSUFFICIENT_OUTPUT_AMOUNT');

        swapTokensForETH(assetAddress, inputValue, outputValue);

        emit Convert(assetId, inputValue, outputValue);
    }

    function getAmountOut(address assetAddress, uint256 inputValue) internal view returns (uint256 outputValue) {
        (uint256 reserveIn, uint256 reserveOut) = UniswapV2Library.getReserves(factory, assetAddress, WETH);
        outputValue = UniswapV2Library.getAmountOut(inputValue, reserveIn, reserveOut);
    }

    function swapTokensForETH(
        address assetAddress,
        uint256 inputValue,
        uint256 outputValue
    ) internal {
        address pair = UniswapV2Library.pairFor(factory, assetAddress, WETH);
        (bool success, ) = assetAddress.call(abi.encodeWithSelector(0xa9059cbb, pair, inputValue));
        require(success, 'Fee Distributor: TRANSFER_FAILED');

        (uint256 amountOut0, uint256 amountOut1) = assetAddress < WETH
            ? (uint256(0), outputValue)
            : (outputValue, uint256(0));
        IUniswapV2Pair(pair).swap(amountOut0, amountOut1, address(this), new bytes(0));

        IWETH(WETH).withdraw(outputValue);
    }
}