// SPDX-License-Identifier: Unknown
pragma solidity 0.4.24;

library SafeMath64 {
    string private constant ERROR_ADD_OVERFLOW = "MATH64_ADD_OVERFLOW";
    string private constant ERROR_SUB_UNDERFLOW = "MATH64_SUB_UNDERFLOW";
    string private constant ERROR_MUL_OVERFLOW = "MATH64_MUL_OVERFLOW";
    string private constant ERROR_DIV_ZERO = "MATH64_DIV_ZERO";

    /**
    * @dev Multiplies two numbers, reverts on overflow.
    */
    function mul(uint64 _a, uint64 _b) internal pure returns (uint64) {
        uint256 c = uint256(_a) * uint256(_b);
        require(c < 0x010000000000000000, ERROR_MUL_OVERFLOW); // 2**64 (less gas this way)

        return uint64(c);
    }

    /**
    * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
    */
    function div(uint64 _a, uint64 _b) internal pure returns (uint64) {
        require(_b > 0, ERROR_DIV_ZERO); // Solidity only automatically asserts when dividing by 0
        uint64 c = _a / _b;
        // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint64 _a, uint64 _b) internal pure returns (uint64) {
        require(_b <= _a, ERROR_SUB_UNDERFLOW);
        uint64 c = _a - _b;

        return c;
    }

    /**
    * @dev Adds two numbers, reverts on overflow.
    */
    function add(uint64 _a, uint64 _b) internal pure returns (uint64) {
        uint64 c = _a + _b;
        require(c >= _a, ERROR_ADD_OVERFLOW);

        return c;
    }

    /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint64 a, uint64 b) internal pure returns (uint64) {
        require(b != 0, ERROR_DIV_ZERO);
        return a % b;
    }
}

library SafeMath {
    string private constant ERROR_ADD_OVERFLOW = "MATH_ADD_OVERFLOW";
    string private constant ERROR_SUB_UNDERFLOW = "MATH_SUB_UNDERFLOW";
    string private constant ERROR_MUL_OVERFLOW = "MATH_MUL_OVERFLOW";
    string private constant ERROR_DIV_ZERO = "MATH_DIV_ZERO";

    /**
    * @dev Multiplies two numbers, reverts on overflow.
    */
    function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (_a == 0) {
            return 0;
        }

        uint256 c = _a * _b;
        require(c / _a == _b, ERROR_MUL_OVERFLOW);

        return c;
    }

    /**
    * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b > 0, ERROR_DIV_ZERO); // Solidity only automatically asserts when dividing by 0
        uint256 c = _a / _b;
        // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b <= _a, ERROR_SUB_UNDERFLOW);
        uint256 c = _a - _b;

        return c;
    }

    /**
    * @dev Adds two numbers, reverts on overflow.
    */
    function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
        uint256 c = _a + _b;
        require(c >= _a, ERROR_ADD_OVERFLOW);

        return c;
    }

    /**
    * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, ERROR_DIV_ZERO);
        return a % b;
    }
}

contract Petrifiable is Initializable {
    // Use block UINT256_MAX (which should be never) as the initializable date
    uint256 internal constant PETRIFIED_BLOCK = uint256(-1);

    function isPetrified() public view returns (bool) {
        return getInitializationBlock() == PETRIFIED_BLOCK;
    }

    /**
    * @dev Function to be called by top level contract to prevent being initialized.
    *      Useful for freezing base contracts when they're used behind proxies.
    */
    function petrify() internal onlyInit {
        initializedAt(PETRIFIED_BLOCK);
    }
}

contract Autopetrified is Petrifiable {
    constructor() public {
        // Immediately petrify base (non-proxy) instances of inherited contracts on deploy.
        // This renders them uninitializable (and unusable without a proxy).
        petrify();
    }
}

interface IVaultRecoverable {
    event RecoverToVault(address indexed vault, address indexed token, uint256 amount);

    function transferToVault(address token) external;

    function allowRecoverability(address token) external view returns (bool);
    function getRecoveryVault() external view returns (address);
}

contract EtherTokenConstant {
    address internal constant ETH = address(0);
}

contract IsContract {
    /*
    * NOTE: this should NEVER be used for authentication
    * (see pitfalls: https://github.com/fergarrui/ethereum-security/tree/master/contracts/extcodesize).
    *
    * This is only intended to be used as a sanity check that an address is actually a contract,
    * RATHER THAN an address not being a contract.
    */
    function isContract(address _target) internal view returns (bool) {
        if (_target == address(0)) {
            return false;
        }

        uint256 size;
        assembly { size := extcodesize(_target) }
        return size > 0;
    }
}

library SafeERC20 {
    // Before 0.5, solidity has a mismatch between `address.transfer()` and `token.transfer()`:
    // https://github.com/ethereum/solidity/issues/3544
    bytes4 private constant TRANSFER_SELECTOR = 0xa9059cbb;

    string private constant ERROR_TOKEN_BALANCE_REVERTED = "SAFE_ERC_20_BALANCE_REVERTED";
    string private constant ERROR_TOKEN_ALLOWANCE_REVERTED = "SAFE_ERC_20_ALLOWANCE_REVERTED";

    function invokeAndCheckSuccess(address _addr, bytes memory _calldata)
        private
        returns (bool)
    {
        bool ret;
        assembly {
            let ptr := mload(0x40)    // free memory pointer

            let success := call(
                gas,                  // forward all gas
                _addr,                // address
                0,                    // no value
                add(_calldata, 0x20), // calldata start
                mload(_calldata),     // calldata length
                ptr,                  // write output over free memory
                0x20                  // uint256 return
            )

            if gt(success, 0) {
                // Check number of bytes returned from last function call
                switch returndatasize

                // No bytes returned: assume success
                case 0 {
                    ret := 1
                }

                // 32 bytes returned: check if non-zero
                case 0x20 {
                    // Only return success if returned data was true
                    // Already have output in ptr
                    ret := eq(mload(ptr), 1)
                }

                // Not sure what was returned: don't mark as success
                default { }
            }
        }
        return ret;
    }

    function staticInvoke(address _addr, bytes memory _calldata)
        private
        view
        returns (bool, uint256)
    {
        bool success;
        uint256 ret;
        assembly {
            let ptr := mload(0x40)    // free memory pointer

            success := staticcall(
                gas,                  // forward all gas
                _addr,                // address
                add(_calldata, 0x20), // calldata start
                mload(_calldata),     // calldata length
                ptr,                  // write output over free memory
                0x20                  // uint256 return
            )

            if gt(success, 0) {
                ret := mload(ptr)
            }
        }
        return (success, ret);
    }

    /**
    * @dev Same as a standards-compliant ERC20.transfer() that never reverts (returns false).
    *      Note that this makes an external call to the token.
    */
    function safeTransfer(ERC20 _token, address _to, uint256 _amount) internal returns (bool) {
        bytes memory transferCallData = abi.encodeWithSelector(
            TRANSFER_SELECTOR,
            _to,
            _amount
        );
        return invokeAndCheckSuccess(_token, transferCallData);
    }

    /**
    * @dev Same as a standards-compliant ERC20.transferFrom() that never reverts (returns false).
    *      Note that this makes an external call to the token.
    */
    function safeTransferFrom(ERC20 _token, address _from, address _to, uint256 _amount) internal returns (bool) {
        bytes memory transferFromCallData = abi.encodeWithSelector(
            _token.transferFrom.selector,
            _from,
            _to,
            _amount
        );
        return invokeAndCheckSuccess(_token, transferFromCallData);
    }

    /**
    * @dev Same as a standards-compliant ERC20.approve() that never reverts (returns false).
    *      Note that this makes an external call to the token.
    */
    function safeApprove(ERC20 _token, address _spender, uint256 _amount) internal returns (bool) {
        bytes memory approveCallData = abi.encodeWithSelector(
            _token.approve.selector,
            _spender,
            _amount
        );
        return invokeAndCheckSuccess(_token, approveCallData);
    }

    /**
    * @dev Static call into ERC20.balanceOf().
    * Reverts if the call fails for some reason (should never fail).
    */
    function staticBalanceOf(ERC20 _token, address _owner) internal view returns (uint256) {
        bytes memory balanceOfCallData = abi.encodeWithSelector(
            _token.balanceOf.selector,
            _owner
        );

        (bool success, uint256 tokenBalance) = staticInvoke(_token, balanceOfCallData);
        require(success, ERROR_TOKEN_BALANCE_REVERTED);

        return tokenBalance;
    }

    /**
    * @dev Static call into ERC20.allowance().
    * Reverts if the call fails for some reason (should never fail).
    */
    function staticAllowance(ERC20 _token, address _owner, address _spender) internal view returns (uint256) {
        bytes memory allowanceCallData = abi.encodeWithSelector(
            _token.allowance.selector,
            _owner,
            _spender
        );

        (bool success, uint256 allowance) = staticInvoke(_token, allowanceCallData);
        require(success, ERROR_TOKEN_ALLOWANCE_REVERTED);

        return allowance;
    }

    /**
    * @dev Static call into ERC20.totalSupply().
    * Reverts if the call fails for some reason (should never fail).
    */
    function staticTotalSupply(ERC20 _token) internal view returns (uint256) {
        bytes memory totalSupplyCallData = abi.encodeWithSelector(_token.totalSupply.selector);

        (bool success, uint256 totalSupply) = staticInvoke(_token, totalSupplyCallData);
        require(success, ERROR_TOKEN_ALLOWANCE_REVERTED);

        return totalSupply;
    }
}

contract VaultRecoverable is IVaultRecoverable, EtherTokenConstant, IsContract {
    using SafeERC20 for ERC20;

    string private constant ERROR_DISALLOWED = "RECOVER_DISALLOWED";
    string private constant ERROR_VAULT_NOT_CONTRACT = "RECOVER_VAULT_NOT_CONTRACT";
    string private constant ERROR_TOKEN_TRANSFER_FAILED = "RECOVER_TOKEN_TRANSFER_FAILED";

    /**
     * @notice Send funds to recovery Vault. This contract should never receive funds,
     *         but in case it does, this function allows one to recover them.
     * @param _token Token balance to be sent to recovery vault.
     */
    function transferToVault(address _token) external {
        require(allowRecoverability(_token), ERROR_DISALLOWED);
        address vault = getRecoveryVault();
        require(isContract(vault), ERROR_VAULT_NOT_CONTRACT);

        uint256 balance;
        if (_token == ETH) {
            balance = address(this).balance;
            vault.transfer(balance);
        } else {
            ERC20 token = ERC20(_token);
            balance = token.staticBalanceOf(this);
            require(token.safeTransfer(vault, balance), ERROR_TOKEN_TRANSFER_FAILED);
        }

        emit RecoverToVault(vault, _token, balance);
    }

    /**
    * @dev By default deriving from AragonApp makes it recoverable
    * @param token Token address that would be recovered
    * @return bool whether the app allows the recovery
    */
    function allowRecoverability(address token) public view returns (bool) {
        return true;
    }

    // Cast non-implemented interface to be public so we can use it internally
    function getRecoveryVault() public view returns (address);
}

contract ReentrancyGuard {
    using UnstructuredStorage for bytes32;

    /* Hardcoded constants to save gas
    bytes32 internal constant REENTRANCY_MUTEX_POSITION = keccak256("aragonOS.reentrancyGuard.mutex");
    */
    bytes32 private constant REENTRANCY_MUTEX_POSITION = 0xe855346402235fdd185c890e68d2c4ecad599b88587635ee285bce2fda58dacb;

    string private constant ERROR_REENTRANT = "REENTRANCY_REENTRANT_CALL";

    modifier nonReentrant() {
        // Ensure mutex is unlocked
        require(!REENTRANCY_MUTEX_POSITION.getStorageBool(), ERROR_REENTRANT);

        // Lock mutex before function call
        REENTRANCY_MUTEX_POSITION.setStorageBool(true);

        // Perform function call
        _;

        // Unlock mutex after function call
        REENTRANCY_MUTEX_POSITION.setStorageBool(false);
    }
}

contract AppStorage {
    using UnstructuredStorage for bytes32;

    /* Hardcoded constants to save gas
    bytes32 internal constant KERNEL_POSITION = keccak256("aragonOS.appStorage.kernel");
    bytes32 internal constant APP_ID_POSITION = keccak256("aragonOS.appStorage.appId");
    */
    bytes32 internal constant KERNEL_POSITION = 0x4172f0f7d2289153072b0a6ca36959e0cbe2efc3afe50fc81636caa96338137b;
    bytes32 internal constant APP_ID_POSITION = 0xd625496217aa6a3453eecb9c3489dc5a53e6c67b444329ea2b2cbc9ff547639b;

    function kernel() public view returns (IKernel) {
        return IKernel(KERNEL_POSITION.getStorageAddress());
    }

    function appId() public view returns (bytes32) {
        return APP_ID_POSITION.getStorageBytes32();
    }

    function setKernel(IKernel _kernel) internal {
        KERNEL_POSITION.setStorageAddress(address(_kernel));
    }

    function setAppId(bytes32 _appId) internal {
        APP_ID_POSITION.setStorageBytes32(_appId);
    }
}

library Uint256Helpers {
    uint256 private constant MAX_UINT64 = uint64(-1);

    string private constant ERROR_NUMBER_TOO_BIG = "UINT64_NUMBER_TOO_BIG";

    function toUint64(uint256 a) internal pure returns (uint64) {
        require(a <= MAX_UINT64, ERROR_NUMBER_TOO_BIG);
        return uint64(a);
    }
}

contract TimeHelpers {
    using Uint256Helpers for uint256;

    /**
    * @dev Returns the current block number.
    *      Using a function rather than `block.number` allows us to easily mock the block number in
    *      tests.
    */
    function getBlockNumber() internal view returns (uint256) {
        return block.number;
    }

    /**
    * @dev Returns the current block number, converted to uint64.
    *      Using a function rather than `block.number` allows us to easily mock the block number in
    *      tests.
    */
    function getBlockNumber64() internal view returns (uint64) {
        return getBlockNumber().toUint64();
    }

    /**
    * @dev Returns the current timestamp.
    *      Using a function rather than `block.timestamp` allows us to easily mock it in
    *      tests.
    */
    function getTimestamp() internal view returns (uint256) {
        return block.timestamp; // solium-disable-line security/no-block-members
    }

    /**
    * @dev Returns the current timestamp, converted to uint64.
    *      Using a function rather than `block.timestamp` allows us to easily mock it in
    *      tests.
    */
    function getTimestamp64() internal view returns (uint64) {
        return getTimestamp().toUint64();
    }
}

library UnstructuredStorage {
    function getStorageBool(bytes32 position) internal view returns (bool data) {
        assembly { data := sload(position) }
    }

    function getStorageAddress(bytes32 position) internal view returns (address data) {
        assembly { data := sload(position) }
    }

    function getStorageBytes32(bytes32 position) internal view returns (bytes32 data) {
        assembly { data := sload(position) }
    }

    function getStorageUint256(bytes32 position) internal view returns (uint256 data) {
        assembly { data := sload(position) }
    }

    function setStorageBool(bytes32 position, bool data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageAddress(bytes32 position, address data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageBytes32(bytes32 position, bytes32 data) internal {
        assembly { sstore(position, data) }
    }

    function setStorageUint256(bytes32 position, uint256 data) internal {
        assembly { sstore(position, data) }
    }
}

contract Initializable is TimeHelpers {
    using UnstructuredStorage for bytes32;

    // keccak256("aragonOS.initializable.initializationBlock")
    bytes32 internal constant INITIALIZATION_BLOCK_POSITION = 0xebb05b386a8d34882b8711d156f463690983dc47815980fb82aeeff1aa43579e;

    string private constant ERROR_ALREADY_INITIALIZED = "INIT_ALREADY_INITIALIZED";
    string private constant ERROR_NOT_INITIALIZED = "INIT_NOT_INITIALIZED";

    modifier onlyInit {
        require(getInitializationBlock() == 0, ERROR_ALREADY_INITIALIZED);
        _;
    }

    modifier isInitialized {
        require(hasInitialized(), ERROR_NOT_INITIALIZED);
        _;
    }

    /**
    * @return Block number in which the contract was initialized
    */
    function getInitializationBlock() public view returns (uint256) {
        return INITIALIZATION_BLOCK_POSITION.getStorageUint256();
    }

    /**
    * @return Whether the contract has been initialized by the time of the current block
    */
    function hasInitialized() public view returns (bool) {
        uint256 initializationBlock = getInitializationBlock();
        return initializationBlock != 0 && getBlockNumber() >= initializationBlock;
    }

    /**
    * @dev Function to be called by top level contract after initialization has finished.
    */
    function initialized() internal onlyInit {
        INITIALIZATION_BLOCK_POSITION.setStorageUint256(getBlockNumber());
    }

    /**
    * @dev Function to be called by top level contract after initialization to enable the contract
    *      at a future block number rather than immediately.
    */
    function initializedAt(uint256 _blockNumber) internal onlyInit {
        INITIALIZATION_BLOCK_POSITION.setStorageUint256(_blockNumber);
    }
}

contract EVMScriptRegistryConstants {
    /* Hardcoded constants to save gas
    bytes32 internal constant EVMSCRIPT_REGISTRY_APP_ID = apmNamehash("evmreg");
    */
    bytes32 internal constant EVMSCRIPT_REGISTRY_APP_ID = 0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61;
}

contract KernelNamespaceConstants {
    /* Hardcoded constants to save gas
    bytes32 internal constant KERNEL_CORE_NAMESPACE = keccak256("core");
    bytes32 internal constant KERNEL_APP_BASES_NAMESPACE = keccak256("base");
    bytes32 internal constant KERNEL_APP_ADDR_NAMESPACE = keccak256("app");
    */
    bytes32 internal constant KERNEL_CORE_NAMESPACE = 0xc681a85306374a5ab27f0bbc385296a54bcd314a1948b6cf61c4ea1bc44bb9f8;
    bytes32 internal constant KERNEL_APP_BASES_NAMESPACE = 0xf1f3eb40f5bc1ad1344716ced8b8a0431d840b5783aea1fd01786bc26f35ac0f;
    bytes32 internal constant KERNEL_APP_ADDR_NAMESPACE = 0xd6f028ca0e8edb4a8c9757ca4fdccab25fa1e0317da1188108f7d2dee14902fb;
}

contract EVMScriptRunner is AppStorage, Initializable, EVMScriptRegistryConstants, KernelNamespaceConstants {
    string private constant ERROR_EXECUTOR_UNAVAILABLE = "EVMRUN_EXECUTOR_UNAVAILABLE";
    string private constant ERROR_PROTECTED_STATE_MODIFIED = "EVMRUN_PROTECTED_STATE_MODIFIED";

    /* This is manually crafted in assembly
    string private constant ERROR_EXECUTOR_INVALID_RETURN = "EVMRUN_EXECUTOR_INVALID_RETURN";
    */

    event ScriptResult(address indexed executor, bytes script, bytes input, bytes returnData);

    function getEVMScriptExecutor(bytes _script) public view returns (IEVMScriptExecutor) {
        return IEVMScriptExecutor(getEVMScriptRegistry().getScriptExecutor(_script));
    }

    function getEVMScriptRegistry() public view returns (IEVMScriptRegistry) {
        address registryAddr = kernel().getApp(KERNEL_APP_ADDR_NAMESPACE, EVMSCRIPT_REGISTRY_APP_ID);
        return IEVMScriptRegistry(registryAddr);
    }

    function runScript(bytes _script, bytes _input, address[] _blacklist)
        internal
        isInitialized
        protectState
        returns (bytes)
    {
        IEVMScriptExecutor executor = getEVMScriptExecutor(_script);
        require(address(executor) != address(0), ERROR_EXECUTOR_UNAVAILABLE);

        bytes4 sig = executor.execScript.selector;
        bytes memory data = abi.encodeWithSelector(sig, _script, _input, _blacklist);

        bytes memory output;
        assembly {
            let success := delegatecall(
                gas,                // forward all gas
                executor,           // address
                add(data, 0x20),    // calldata start
                mload(data),        // calldata length
                0,                  // don't write output (we'll handle this ourselves)
                0                   // don't write output
            )

            output := mload(0x40) // free mem ptr get

            switch success
            case 0 {
                // If the call errored, forward its full error data
                returndatacopy(output, 0, returndatasize)
                revert(output, returndatasize)
            }
            default {
                switch gt(returndatasize, 0x3f)
                case 0 {
                    // Need at least 0x40 bytes returned for properly ABI-encoded bytes values,
                    // revert with "EVMRUN_EXECUTOR_INVALID_RETURN"
                    // See remix: doing a `revert("EVMRUN_EXECUTOR_INVALID_RETURN")` always results in
                    // this memory layout
                    mstore(output, 0x08c379a000000000000000000000000000000000000000000000000000000000)         // error identifier
                    mstore(add(output, 0x04), 0x0000000000000000000000000000000000000000000000000000000000000020) // starting offset
                    mstore(add(output, 0x24), 0x000000000000000000000000000000000000000000000000000000000000001e) // reason length
                    mstore(add(output, 0x44), 0x45564d52554e5f4558454355544f525f494e56414c49445f52455455524e0000) // reason

                    revert(output, 100) // 100 = 4 + 3 * 32 (error identifier + 3 words for the ABI encoded error)
                }
                default {
                    // Copy result
                    //
                    // Needs to perform an ABI decode for the expected `bytes` return type of
                    // `executor.execScript()` as solidity will automatically ABI encode the returned bytes as:
                    //    [ position of the first dynamic length return value = 0x20 (32 bytes) ]
                    //    [ output length (32 bytes) ]
                    //    [ output content (N bytes) ]
                    //
                    // Perform the ABI decode by ignoring the first 32 bytes of the return data
                    let copysize := sub(returndatasize, 0x20)
                    returndatacopy(output, 0x20, copysize)

                    mstore(0x40, add(output, copysize)) // free mem ptr set
                }
            }
        }

        emit ScriptResult(address(executor), _script, _input, output);

        return output;
    }

    modifier protectState {
        address preKernel = address(kernel());
        bytes32 preAppId = appId();
        _; // exec
        require(address(kernel()) == preKernel, ERROR_PROTECTED_STATE_MODIFIED);
        require(appId() == preAppId, ERROR_PROTECTED_STATE_MODIFIED);
    }
}

contract ACLSyntaxSugar {
    function arr() internal pure returns (uint256[]) {
        return new uint256[](0);
    }

    function arr(bytes32 _a) internal pure returns (uint256[] r) {
        return arr(uint256(_a));
    }

    function arr(bytes32 _a, bytes32 _b) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b));
    }

    function arr(address _a) internal pure returns (uint256[] r) {
        return arr(uint256(_a));
    }

    function arr(address _a, address _b) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b));
    }

    function arr(address _a, uint256 _b, uint256 _c) internal pure returns (uint256[] r) {
        return arr(uint256(_a), _b, _c);
    }

    function arr(address _a, uint256 _b, uint256 _c, uint256 _d) internal pure returns (uint256[] r) {
        return arr(uint256(_a), _b, _c, _d);
    }

    function arr(address _a, uint256 _b) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b));
    }

    function arr(address _a, address _b, uint256 _c, uint256 _d, uint256 _e) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b), _c, _d, _e);
    }

    function arr(address _a, address _b, address _c) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b), uint256(_c));
    }

    function arr(address _a, address _b, uint256 _c) internal pure returns (uint256[] r) {
        return arr(uint256(_a), uint256(_b), uint256(_c));
    }

    function arr(uint256 _a) internal pure returns (uint256[] r) {
        r = new uint256[](1);
        r[0] = _a;
    }

    function arr(uint256 _a, uint256 _b) internal pure returns (uint256[] r) {
        r = new uint256[](2);
        r[0] = _a;
        r[1] = _b;
    }

    function arr(uint256 _a, uint256 _b, uint256 _c) internal pure returns (uint256[] r) {
        r = new uint256[](3);
        r[0] = _a;
        r[1] = _b;
        r[2] = _c;
    }

    function arr(uint256 _a, uint256 _b, uint256 _c, uint256 _d) internal pure returns (uint256[] r) {
        r = new uint256[](4);
        r[0] = _a;
        r[1] = _b;
        r[2] = _c;
        r[3] = _d;
    }

    function arr(uint256 _a, uint256 _b, uint256 _c, uint256 _d, uint256 _e) internal pure returns (uint256[] r) {
        r = new uint256[](5);
        r[0] = _a;
        r[1] = _b;
        r[2] = _c;
        r[3] = _d;
        r[4] = _e;
    }
}

library ConversionHelpers {
    string private constant ERROR_IMPROPER_LENGTH = "CONVERSION_IMPROPER_LENGTH";

    function dangerouslyCastUintArrayToBytes(uint256[] memory _input) internal pure returns (bytes memory output) {
        // Force cast the uint256[] into a bytes array, by overwriting its length
        // Note that the bytes array doesn't need to be initialized as we immediately overwrite it
        // with the input and a new length. The input becomes invalid from this point forward.
        uint256 byteLength = _input.length * 32;
        assembly {
            output := _input
            mstore(output, byteLength)
        }
    }

    function dangerouslyCastBytesToUintArray(bytes memory _input) internal pure returns (uint256[] memory output) {
        // Force cast the bytes array into a uint256[], by overwriting its length
        // Note that the uint256[] doesn't need to be initialized as we immediately overwrite it
        // with the input and a new length. The input becomes invalid from this point forward.
        uint256 intsLength = _input.length / 32;
        require(_input.length == intsLength * 32, ERROR_IMPROPER_LENGTH);

        assembly {
            output := _input
            mstore(output, intsLength)
        }
    }
}

contract AragonApp is AppStorage, Autopetrified, VaultRecoverable, ReentrancyGuard, EVMScriptRunner, ACLSyntaxSugar {
    string private constant ERROR_AUTH_FAILED = "APP_AUTH_FAILED";

    modifier auth(bytes32 _role) {
        require(canPerform(msg.sender, _role, new uint256[](0)), ERROR_AUTH_FAILED);
        _;
    }

    modifier authP(bytes32 _role, uint256[] _params) {
        require(canPerform(msg.sender, _role, _params), ERROR_AUTH_FAILED);
        _;
    }

    /**
    * @dev Check whether an action can be performed by a sender for a particular role on this app
    * @param _sender Sender of the call
    * @param _role Role on this app
    * @param _params Permission params for the role
    * @return Boolean indicating whether the sender has the permissions to perform the action.
    *         Always returns false if the app hasn't been initialized yet.
    */
    function canPerform(address _sender, bytes32 _role, uint256[] _params) public view returns (bool) {
        if (!hasInitialized()) {
            return false;
        }

        IKernel linkedKernel = kernel();
        if (address(linkedKernel) == address(0)) {
            return false;
        }

        return linkedKernel.hasPermission(
            _sender,
            address(this),
            _role,
            ConversionHelpers.dangerouslyCastUintArrayToBytes(_params)
        );
    }

    /**
    * @dev Get the recovery vault for the app
    * @return Recovery vault address for the app
    */
    function getRecoveryVault() public view returns (address) {
        // Funds recovery via a vault is only available when used with a kernel
        return kernel().getRecoveryVault(); // if kernel is not set, it will revert
    }
}

interface IForwarder {
    function isForwarder() external pure returns (bool);

    // TODO: this should be external
    // See https://github.com/ethereum/solidity/issues/4832
    function canForward(address sender, bytes evmCallScript) public view returns (bool);

    // TODO: this should be external
    // See https://github.com/ethereum/solidity/issues/4832
    function forward(bytes evmCallScript) public;
}

contract Voting is IForwarder, AragonApp {
    using SafeMath for uint256;
    using SafeMath64 for uint64;

    bytes32 public constant CREATE_VOTES_ROLE = keccak256("CREATE_VOTES_ROLE");
    bytes32 public constant MODIFY_SUPPORT_ROLE = keccak256("MODIFY_SUPPORT_ROLE");
    bytes32 public constant MODIFY_QUORUM_ROLE = keccak256("MODIFY_QUORUM_ROLE");
    bytes32 public constant UNSAFELY_MODIFY_VOTE_TIME_ROLE = keccak256("UNSAFELY_MODIFY_VOTE_TIME_ROLE");

    uint64 public constant PCT_BASE = 10 ** 18; // 0% = 0; 1% = 10^16; 100% = 10^18
    uint256 private constant UINT_96_MAX = 2 ** 96 - 1;

    string private constant ERROR_NO_VOTE = "VOTING_NO_VOTE";
    string private constant ERROR_INIT_PCTS = "VOTING_INIT_PCTS";
    string private constant ERROR_CHANGE_SUPPORT_PCTS = "VOTING_CHANGE_SUPPORT_PCTS";
    string private constant ERROR_CHANGE_QUORUM_PCTS = "VOTING_CHANGE_QUORUM_PCTS";
    string private constant ERROR_INIT_SUPPORT_TOO_BIG = "VOTING_INIT_SUPPORT_TOO_BIG";
    string private constant ERROR_CHANGE_SUPPORT_TOO_BIG = "VOTING_CHANGE_SUPP_TOO_BIG";
    string private constant ERROR_CAN_NOT_VOTE = "VOTING_CAN_NOT_VOTE";
    string private constant ERROR_CAN_NOT_EXECUTE = "VOTING_CAN_NOT_EXECUTE";
    string private constant ERROR_CAN_NOT_FORWARD = "VOTING_CAN_NOT_FORWARD";
    string private constant ERROR_NO_VOTING_POWER = "VOTING_NO_VOTING_POWER";
    string private constant ERROR_VOTE_TIME_TOO_SMALL = "VOTING_VOTE_TIME_TOO_SMALL";
    string private constant ERROR_OBJ_TIME_TOO_BIG = "VOTING_OBJ_TIME_TOO_BIG";
    string private constant ERROR_INIT_OBJ_TIME_TOO_BIG = "VOTING_INIT_OBJ_TIME_TOO_BIG";
    string private constant ERROR_CAN_NOT_VOTE_FOR = "VOTING_CAN_NOT_VOTE_FOR";
    string private constant ERROR_ZERO_ADDRESS_PASSED = "VOTING_ZERO_ADDRESS_PASSED";
    string private constant ERROR_DELEGATE_NOT_SET = "VOTING_DELEGATE_NOT_SET";
    string private constant ERROR_SELF_DELEGATE = "VOTING_SELF_DELEGATE";
    string private constant ERROR_DELEGATE_SAME_AS_PREV = "VOTING_DELEGATE_SAME_AS_PREV";
    string private constant ERROR_MAX_DELEGATED_VOTERS_REACHED = "VOTING_MAX_DELEGATED_VOTERS_REACHED";

    enum VoterState {
        Absent, // Voter has not voted
        Yea, // Voter has voted for
        Nay, // Voter has voted against
        DelegateYea, // Delegate has voted for on behalf of the voter
        DelegateNay // Delegate has voted against on behalf of the voter
    }

    enum VotePhase { Main, Objection, Closed }

    struct Vote {
        bool executed;
        uint64 startDate;
        uint64 snapshotBlock;
        uint64 supportRequiredPct;
        uint64 minAcceptQuorumPct;
        uint256 yea;
        uint256 nay;
        uint256 votingPower;
        bytes executionScript;
        mapping (address => VoterState) voters;
    }

    struct DelegatedVoters {
        address[] addresses;
    }

    struct Delegate {
        address delegate;
        uint96 voterIndex;
    }

    MiniMeToken public token;
    uint64 public supportRequiredPct;
    uint64 public minAcceptQuorumPct;
    uint64 public voteTime;

    // We are mimicing an array, we use a mapping instead to make app upgrade more graceful
    mapping (uint256 => Vote) internal votes;
    uint256 public votesLength;
    uint64 public objectionPhaseTime;

    mapping(address /* delegate */ => DelegatedVoters) private delegatedVoters;
    mapping(address /* voter */ => Delegate) private delegates;

    event StartVote(uint256 indexed voteId, address indexed creator, string metadata);
    event CastVote(uint256 indexed voteId, address indexed voter, bool supports, uint256 stake);
    event CastObjection(uint256 indexed voteId, address indexed voter, uint256 stake);
    event ExecuteVote(uint256 indexed voteId);
    event ChangeSupportRequired(uint64 supportRequiredPct);
    event ChangeMinQuorum(uint64 minAcceptQuorumPct);
    event ChangeVoteTime(uint64 voteTime);
    event ChangeObjectionPhaseTime(uint64 objectionPhaseTime);
    event AssignDelegate(address indexed voter, address indexed assignedDelegate);
    event UnassignDelegate(address indexed voter, address indexed unassignedDelegate);

    // IMPORTANT: The voters array contains ALL voters the vote was attempted.
    // It's not possible to distinguish successful and skipped votes based only on this event.
    // See the `attemptVoteForMultiple` method for details.
    event AttemptCastVoteAsDelegate(uint256 indexed voteId, address indexed delegate, address[] voters);

    modifier voteExists(uint256 _voteId) {
        require(_voteId < votesLength, ERROR_NO_VOTE);
        _;
    }

    /**
    * @notice Initialize Voting app with `_token.symbol(): string` for governance, minimum support of `@formatPct(_supportRequiredPct)`%, minimum acceptance quorum of `@formatPct(_minAcceptQuorumPct)`%, and a voting duration of `@transformTime(_voteTime)`
    * @param _token MiniMeToken Address that will be used as governance token
    * @param _supportRequiredPct Percentage of yeas in casted votes for a vote to succeed (expressed as a percentage of 10^18; eg. 10^16 = 1%, 10^18 = 100%)
    * @param _minAcceptQuorumPct Percentage of yeas in total possible votes for a vote to succeed (expressed as a percentage of 10^18; eg. 10^16 = 1%, 10^18 = 100%)
    * @param _voteTime Total duration of voting in seconds.
    * @param _objectionPhaseTime The duration of the objection vote phase, i.e. seconds that a vote will be open after the main vote phase ends for token holders to object to the outcome. Main phase duration is calculated as `voteTime - objectionPhaseTime`.
    */
    function initialize(MiniMeToken _token, uint64 _supportRequiredPct, uint64 _minAcceptQuorumPct, uint64 _voteTime, uint64 _objectionPhaseTime)
        external
        onlyInit
    {
        initialized();

        require(_minAcceptQuorumPct <= _supportRequiredPct, ERROR_INIT_PCTS);
        require(_supportRequiredPct < PCT_BASE, ERROR_INIT_SUPPORT_TOO_BIG);
        require(_voteTime > _objectionPhaseTime, ERROR_INIT_OBJ_TIME_TOO_BIG);

        token = _token;
        supportRequiredPct = _supportRequiredPct;
        minAcceptQuorumPct = _minAcceptQuorumPct;
        voteTime = _voteTime;
        objectionPhaseTime = _objectionPhaseTime;
    }

    /**
    * @notice Change required support to `@formatPct(_supportRequiredPct)`%
    * @param _supportRequiredPct New required support
    */
    function changeSupportRequiredPct(uint64 _supportRequiredPct)
        external
        authP(MODIFY_SUPPORT_ROLE, arr(uint256(_supportRequiredPct), uint256(supportRequiredPct)))
    {
        require(minAcceptQuorumPct <= _supportRequiredPct, ERROR_CHANGE_SUPPORT_PCTS);
        require(_supportRequiredPct < PCT_BASE, ERROR_CHANGE_SUPPORT_TOO_BIG);
        supportRequiredPct = _supportRequiredPct;

        emit ChangeSupportRequired(_supportRequiredPct);
    }

    /**
    * @notice Change minimum acceptance quorum to `@formatPct(_minAcceptQuorumPct)`%
    * @param _minAcceptQuorumPct New acceptance quorum
    */
    function changeMinAcceptQuorumPct(uint64 _minAcceptQuorumPct)
        external
        authP(MODIFY_QUORUM_ROLE, arr(uint256(_minAcceptQuorumPct), uint256(minAcceptQuorumPct)))
    {
        require(_minAcceptQuorumPct <= supportRequiredPct, ERROR_CHANGE_QUORUM_PCTS);
        minAcceptQuorumPct = _minAcceptQuorumPct;

        emit ChangeMinQuorum(_minAcceptQuorumPct);
    }

    /**
    * @notice Change vote time to `_voteTime` sec. The change affects all existing unexecuted votes, so be really careful with it
    * @param _voteTime New vote time
    */
    function unsafelyChangeVoteTime(uint64 _voteTime)
        external
        auth(UNSAFELY_MODIFY_VOTE_TIME_ROLE)
    {
        require(_voteTime > objectionPhaseTime, ERROR_VOTE_TIME_TOO_SMALL);
        voteTime = _voteTime;

        emit ChangeVoteTime(_voteTime);
    }

    /**
    * @notice Change the objection phase duration to `_objectionPhaseTime` sec. The change affects all existing unexecuted votes, so be really careful with it
    * @param _objectionPhaseTime New objection time
    */
    function unsafelyChangeObjectionPhaseTime(uint64 _objectionPhaseTime)
        external
        auth(UNSAFELY_MODIFY_VOTE_TIME_ROLE)
    {
        require(voteTime > _objectionPhaseTime, ERROR_OBJ_TIME_TOO_BIG);
        objectionPhaseTime = _objectionPhaseTime;

        emit ChangeObjectionPhaseTime(_objectionPhaseTime);
    }

    /**
    * @notice Create a new vote about "`_metadata`"
    * @param _executionScript EVM script to be executed on approval
    * @param _metadata Vote metadata
    * @return voteId Id for newly created vote
    */
    function newVote(bytes _executionScript, string _metadata) external auth(CREATE_VOTES_ROLE) returns (uint256 voteId) {
        return _newVote(_executionScript, _metadata);
    }

    /**
    * @notice Create a new vote about "`_metadata`"
    * @dev  _executesIfDecided was deprecated to introduce a proper lock period between decision and execution.
    * @param _executionScript EVM script to be executed on approval
    * @param _metadata Vote metadata
    * @dev _castVote_deprecated Whether to also cast newly created vote - DEPRECATED
    * @dev _executesIfDecided_deprecated Whether to also immediately execute newly created vote if decided - DEPRECATED
    * @return voteId Id for newly created vote
    */
    function newVote(bytes _executionScript, string _metadata, bool /* _castVote_deprecated */, bool /* _executesIfDecided_deprecated */)
        external
        auth(CREATE_VOTES_ROLE)
        returns (uint256 voteId)
    {
        return _newVote(_executionScript, _metadata);
    }

    /**
    * @notice Vote `_supports ? 'yes' : 'no'` in vote #`_voteId`. During objection phase one can only vote 'no'
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @dev  _executesIfDecided was deprecated to introduce a proper lock period between decision and execution.
    * @param _voteId Vote identifier
    * @param _supports Whether voter supports the vote
    * @dev _executesIfDecided_deprecated Whether the vote should execute its action if it becomes decided - DEPRECATED
    */
    function vote(uint256 _voteId, bool _supports, bool /* _executesIfDecided_deprecated */) external voteExists(_voteId) {
        Vote storage vote_ = votes[_voteId];
        VotePhase votePhase = _getVotePhase(vote_);
        require(_isValidPhaseToVote(votePhase, _supports), ERROR_CAN_NOT_VOTE);

        // In version 0.4.24 of Solidity, for view methods, a regular CALL is used instead of STATICCALL.
        // This allows for the possibility of reentrance from the governance token.
        // However, we strongly assume here that the governance token is not malicious.
        uint256 votingPower = token.balanceOfAt(msg.sender, vote_.snapshotBlock);
        require(votingPower > 0, ERROR_NO_VOTING_POWER);
        _vote(_voteId, votePhase, /* voter */ msg.sender, _supports, votingPower, /* isDelegate */ false);
    }

    /**
    * @notice Execute vote #`_voteId`
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @param _voteId Vote identifier
    */
    function executeVote(uint256 _voteId) external voteExists(_voteId) {
        _executeVote(_voteId);
    }

    /**
    * @notice Assign `_delegate` as the sender's delegate, allowing `_delegate` to vote on behalf of the sender
    * @param _delegate Address of the account to delegate to
    */
    function assignDelegate(address _delegate) external {
        require(_delegate != address(0), ERROR_ZERO_ADDRESS_PASSED);
        require(_delegate != msg.sender, ERROR_SELF_DELEGATE);

        address prevDelegate = delegates[msg.sender].delegate;
        require(_delegate != prevDelegate, ERROR_DELEGATE_SAME_AS_PREV);

        if (prevDelegate != address(0)) {
            _removeDelegatedAddressFor(prevDelegate, msg.sender);
        }
        _addDelegatedAddressFor(_delegate, msg.sender);
    }

    /**
    * @notice Unassign `_delegate` from the sender and remove the sender from the `_delegate`'s list of delegated addresses
    */
    function unassignDelegate() external {
        address prevDelegate = delegates[msg.sender].delegate;
        require(prevDelegate != address(0), ERROR_DELEGATE_NOT_SET);

        _removeDelegatedAddressFor(prevDelegate, msg.sender);
    }

    /**
     * @notice Vote `_supports ? 'yes' : 'no'` in vote #`_voteId` on behalf of the `_voters` list.
     *         Each voter from the list must have assigned the sender as their delegate with `assignDelegate`.
     * @dev By the delegation mechanism design, it is possible for a misbehaving voter to front-run a delegate by voting
     *      or unassigning the delegation before the delegate's vote. That is why checks of the address belonging to
     *      the list of delegated voters and the voter's state are unstrict, hence the "attempt" word in the function name.
     *      The voter's voting power is being fetched at the vote's snapshot block, making moving voting power
     *      from one address to another worthless in the sense of harming the delegate's actions during the vote.
     * @param _voteId Vote identifier
     * @param _supports Whether the delegate supports the vote
     * @param _voters List of voters
     */
    function attemptVoteForMultiple(uint256 _voteId, bool _supports, address[] _voters) public voteExists(_voteId) {
        Vote storage vote_ = votes[_voteId];
        VotePhase votePhase = _getVotePhase(vote_);
        require(_isValidPhaseToVote(votePhase, _supports), ERROR_CAN_NOT_VOTE);

        bool votedForAtLeastOne = false;
        uint64 voteSnapshotBlock = vote_.snapshotBlock;
        uint256 votersCount = _voters.length;
        for (uint256 i = 0; i < votersCount; ++i) {
            address voter = _voters[i];

            // In version 0.4.24 of Solidity, for view methods, a regular CALL is used instead of STATICCALL.
            // This allows for the possibility of reentrance from the governance token.
            // However, we strongly assume here that the governance token is not malicious.
            uint256 votingPower = token.balanceOfAt(voter, voteSnapshotBlock);

            // A strict check for balance was introduced to have a persistent logic with the `vote` method.
            // It's not possible to front-run the voting attempt with balance manipulation since the balances are being checked at the vote's snapshot block
            require(votingPower > 0, ERROR_NO_VOTING_POWER);
            // The _canVoteFor() check below does not revert to avoid a situation where a voter votes by themselves
            // or undelegates previously delegated voting power before the delegate sends a transaction. This approach
            // helps protect the entire transaction from failing due to the actions of a single misbehaving voter.
            if (_canVoteFor(vote_, voter, msg.sender)) {
                _vote(_voteId, votePhase, voter, _supports, votingPower, /* isDelegate */ true);
                votedForAtLeastOne = true;
            }
        }
        require(votedForAtLeastOne, ERROR_CAN_NOT_VOTE_FOR);

        // IMPORTANT: The voters array contains ALL voters the vote was attempted.
        // It's not possible to distinguish successful and skipped votes based only on this event.
        // To filter votes, use this event along with the `CastVote` event, which is emitted for each successful voting attempt.
        emit AttemptCastVoteAsDelegate(_voteId, msg.sender, _voters);
    }

    /**
     * @notice Vote `_supports ? 'yes' : 'no'` in vote #`_voteId` on behalf of the `_voter`.
     *         The `_voter` must have assigned the sender as their delegate with `assignDelegate`.
     * @param _voteId Vote identifier
     * @param _supports Whether the delegate supports the vote
     * @param _voter Address of the voter
     */
    function attemptVoteFor(uint256 _voteId, bool _supports, address _voter) external {
        address[] memory voters = new address[](1);
        voters[0] = _voter;
        attemptVoteForMultiple(_voteId, _supports, voters);
    }

    // ---
    // FORWARDING METHODS
    // ---

    /**
    * @notice Tells whether the Voting app is a forwarder
    * @dev IForwarder interface conformance
    * @return Always true
    */
    function isForwarder() external pure returns (bool) {
        return true;
    }

    /**
    * @notice Creates a vote to execute the desired action
    * @dev IForwarder interface conformance
    * @param _evmScript Start vote with script
    */
    function forward(bytes _evmScript) public {
        require(canForward(msg.sender, _evmScript), ERROR_CAN_NOT_FORWARD);
        _newVote(_evmScript, "");
    }

    /**
    * @notice Tells whether `_sender` can forward actions
    * @dev IForwarder interface conformance
    * @param _sender Address of the account intending to forward an action
    * @return True if the given address can create votes, false otherwise
    */
    function canForward(address _sender, bytes) public view returns (bool) {
        // Note that `canPerform()` implicitly does an initialization check itself
        return canPerform(_sender, CREATE_VOTES_ROLE, arr());
    }

    // ---
    // GETTER METHODS
    // ---

    /**
    * @notice Tells whether a vote #`_voteId` can be executed
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @param _voteId Vote identifier
    * @return True if the given vote can be executed, false otherwise
    */
    function canExecute(uint256 _voteId) public view voteExists(_voteId) returns (bool) {
        return _canExecute(_voteId);
    }

    /**
    * @notice Tells whether `_voter` can participate in the main or objection phase of the vote #`_voteId`
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @param _voteId Vote identifier
    * @param _voter Address of the voter
    * @return True if the given voter can participate in the main phase of a certain vote
    *         both directly and indirectly by a delegate voting for them, false otherwise
    */
    function canVote(uint256 _voteId, address _voter) external view voteExists(_voteId) returns (bool) {
        Vote storage vote_ = votes[_voteId];
        uint256 votingPower = token.balanceOfAt(_voter, vote_.snapshotBlock);
        return _getVotePhase(vote_) != VotePhase.Closed && votingPower > 0;
    }

    /**
    * @notice Tells the current phase of the vote #`_voteId`
    * @dev Initialization check is implicitly provided by `voteExists()` as new votes can only be
    *      created via `newVote(),` which requires initialization
    * @param _voteId Vote identifier
    * @return VotePhase.Main if one can vote yes or no and VotePhase.Objection if one can vote only no and VotingPhase.Closed if no votes are accepted
    */
    function getVotePhase(uint256 _voteId) external view voteExists(_voteId) returns (VotePhase) {
        return _getVotePhase(votes[_voteId]);
    }

    /**
    * @dev Return all information for a vote by its ID
    * @param _voteId Vote identifier
    * @return open True if the vote is open
    * @return executed Vote executed status
    * @return startDate Vote start date
    * @return snapshotBlock Vote snapshot block
    * @return supportRequired Vote support required
    * @return minAcceptQuorum Vote minimum acceptance quorum
    * @return yea Vote yeas amount
    * @return nay Vote nays amount
    * @return votingPower Vote power
    * @return script Vote script
    * @return phase Vote phase
    */
    function getVote(uint256 _voteId)
        public
        view
        voteExists(_voteId)
        returns (
            bool open,
            bool executed,
            uint64 startDate,
            uint64 snapshotBlock,
            uint64 supportRequired,
            uint64 minAcceptQuorum,
            uint256 yea,
            uint256 nay,
            uint256 votingPower,
            bytes script,
            VotePhase phase
        )
    {
        Vote storage vote_ = votes[_voteId];

        executed = vote_.executed;
        startDate = vote_.startDate;
        snapshotBlock = vote_.snapshotBlock;
        supportRequired = vote_.supportRequiredPct;
        minAcceptQuorum = vote_.minAcceptQuorumPct;
        yea = vote_.yea;
        nay = vote_.nay;
        votingPower = vote_.votingPower;
        script = vote_.executionScript;
        phase = _getVotePhase(vote_);
        open = phase != VotePhase.Closed;
    }

    /**
    * @dev Return the state of a voter for a given vote by its ID
    * @param _voteId Vote identifier
    * @param _voter Address of the voter
    * @return VoterState of the requested voter for a certain vote
    */
    function getVoterState(uint256 _voteId, address _voter) external view voteExists(_voteId) returns (VoterState) {
        return votes[_voteId].voters[_voter];
    }

    /**
     * @notice Return the sliced list of voters who delegated to the `_delegate`
     * @param _delegate Address of the delegate
     * @param _offset Number of delegated voters from the start of the list to skip
     * @param _limit Maximum number of delegated voters to return. The length of the returned slice can be lower than if the end of the list is reached
     * @return voters Array of delegated voters' addresses
     */
    function getDelegatedVoters(address _delegate, uint256 _offset, uint256 _limit) external view returns (address[] memory voters) {
        require(_delegate != address(0), ERROR_ZERO_ADDRESS_PASSED);

        address[] storage votersList = delegatedVoters[_delegate].addresses;
        uint256 votersCount = votersList.length;
        if (_offset >= votersCount) {
            return voters;
        }

        uint256 returnCount = _offset.add(_limit) > votersCount ? votersCount.sub(_offset) : _limit;
        voters = new address[](returnCount);
        for (uint256 i = 0; i < returnCount; ++i) {
            voters[i] = votersList[_offset + i];
        }
    }

    /**
    * @dev Return the number of voters who delegated to the `_delegate`
    * @param _delegate Address of the delegate
    * @return Number of `_delegate`'s delegated voters
    */
    function getDelegatedVotersCount(address _delegate) external view returns (uint256) {
        require(_delegate != address(0), ERROR_ZERO_ADDRESS_PASSED);
        return delegatedVoters[_delegate].addresses.length;
    }

    /**
     * @notice Return the delegate address of the `_voter`
     * @param _voter Address of the voter
     */
    function getDelegate(address _voter) external view returns (address) {
        require(_voter != address(0), ERROR_ZERO_ADDRESS_PASSED);
        return delegates[_voter].delegate;
    }

    /**
     * @notice Return the list of `VoterState` for the `_voters` for the vote #`_voteId`
     * @param _voteId Vote identifier
     * @param _voters List of voters
     * @return voterStatesList Array of voter states
     */
    function getVoterStateMultipleAtVote(uint256 _voteId, address[] _voters) external view voteExists(_voteId) returns (VoterState[] memory voterStatesList) {
        uint256 votersCount = _voters.length;
        voterStatesList = new VoterState[](votersCount);
        Vote storage vote_ = votes[_voteId];
        for (uint256 i = 0; i < votersCount; ++i) {
            voterStatesList[i] = vote_.voters[_voters[i]];
        }
    }

    /**
     * @notice Return the cumulative voting power of the `_voters` at the current block
     * @param _voters List of voters
     * @return balances Array of governance token balances
     */
    function getVotingPowerMultiple(address[] _voters) external view returns (uint256[] memory balances) {
        return _getVotingPowerMultipleAt(_voters, getBlockNumber64());
    }

    /**
     * @notice Return the cumulative voting power of the `_voters` at the vote #`_voteId` snapshot block
     * @param _voteId Vote identifier
     * @param _voters List of voters
     * @return balances Array of governance token balances
     */
    function getVotingPowerMultipleAtVote(uint256 _voteId, address[] _voters) external view voteExists(_voteId) returns (uint256[] memory balances) {
        return _getVotingPowerMultipleAt(_voters, votes[_voteId].snapshotBlock);
    }

    // ---
    // INTERNAL METHODS
    // ---

    /**
    * @dev Internal function to create a new vote
    * @param _executionScript The execution script for the vote
    * @param _metadata The metadata for the vote
    * @return voteId id for newly created vote
    */
    function _newVote(bytes _executionScript, string _metadata) internal returns (uint256 voteId) {
        uint64 snapshotBlock = getBlockNumber64() - 1; // avoid double voting in this very block
        uint256 votingPower = token.totalSupplyAt(snapshotBlock);
        require(votingPower > 0, ERROR_NO_VOTING_POWER);

        voteId = votesLength++;

        Vote storage vote_ = votes[voteId];
        vote_.startDate = getTimestamp64();
        vote_.snapshotBlock = snapshotBlock;
        vote_.supportRequiredPct = supportRequiredPct;
        vote_.minAcceptQuorumPct = minAcceptQuorumPct;
        vote_.votingPower = votingPower;
        vote_.executionScript = _executionScript;

        emit StartVote(voteId, msg.sender, _metadata);
    }

    /**
     * @dev Internal function to cast a vote or object to.
     * @dev It assumes that voter can support or object to the vote
     * @param _voteId Vote identifier
     * @param _supports Whether the voter supports the vote
     * @param _voter Address of the voter
     * @param _isDelegate Whether the voter is a delegate
     */
    function _vote(uint256 _voteId, VotePhase _votePhase, address _voter, bool _supports, uint256 _votingPower, bool _isDelegate) internal {
        Vote storage vote_ = votes[_voteId];
        VoterState state = vote_.voters[_voter];

        // If voter had previously voted, decrease count.
        // Since the most common case is voter voting once, the additional check here works as a gas optimization.
        if (state != VoterState.Absent) {
            if (state == VoterState.Yea || state == VoterState.DelegateYea) {
                vote_.yea = vote_.yea.sub(_votingPower);
            } else { // Remaining states are Nay and DelegateNay
                vote_.nay = vote_.nay.sub(_votingPower);
            }
        }

        if (_supports) {
            vote_.yea = vote_.yea.add(_votingPower);
            vote_.voters[_voter] = _isDelegate ? VoterState.DelegateYea : VoterState.Yea;
        } else {
            vote_.nay = vote_.nay.add(_votingPower);
            vote_.voters[_voter] = _isDelegate ? VoterState.DelegateNay : VoterState.Nay;
        }

        emit CastVote(_voteId, _voter, _supports, _votingPower);

        if (_votePhase == VotePhase.Objection) {
            emit CastObjection(_voteId, _voter, _votingPower);
        }
    }

    /**
    * @dev Internal function to execute a vote. It assumes the queried vote exists.
    * @param _voteId Vote identifier
    */
    function _executeVote(uint256 _voteId) internal {
        require(_canExecute(_voteId), ERROR_CAN_NOT_EXECUTE);
        _unsafeExecuteVote(_voteId);
    }

    /**
    * @dev Unsafe version of _executeVote that assumes you have already checked if the vote can be executed and exists
    * @param _voteId Vote identifier
    */
    function _unsafeExecuteVote(uint256 _voteId) internal {
        Vote storage vote_ = votes[_voteId];

        vote_.executed = true;

        bytes memory input = new bytes(0); // TODO: Consider input for voting scripts
        runScript(vote_.executionScript, input, new address[](0));

        emit ExecuteVote(_voteId);
    }

    /**
     * @dev internal function to add the `_voter` to the list of delegated voters for the `_delegate` and update the delegate for the `_voter`
     * @param _delegate Address of the delegate
     * @param _voter Address of the voter
     */
    function _addDelegatedAddressFor(address _delegate, address _voter) internal {
        address[] storage votersList = delegatedVoters[_delegate].addresses;
        uint256 delegatedVotersCount = votersList.length;
        require(delegatedVotersCount <= UINT_96_MAX, ERROR_MAX_DELEGATED_VOTERS_REACHED);

        votersList.push(_voter);
        delegates[_voter] = Delegate(_delegate, uint96(delegatedVotersCount));
        emit AssignDelegate(_voter, _delegate);
    }

    /**
     * @dev internal function to remove  the `_voter` from the list of delegated voters for the `_delegate`
     * @param _delegate Address of the delegate
     * @param _voter Address of the voter
     */
    function _removeDelegatedAddressFor(address _delegate, address _voter) internal {
        uint96 voterIndex = delegates[_voter].voterIndex;
        address[] storage votersList = delegatedVoters[_delegate].addresses;
        assert(votersList[voterIndex] == _voter);

        uint256 lastVoterIndex = votersList.length - 1;
        if (voterIndex < lastVoterIndex) {
            address lastVoter = votersList[lastVoterIndex];
            votersList[voterIndex] = lastVoter;
            delegates[lastVoter].voterIndex = voterIndex;
        }
        votersList.length--;
        delete delegates[_voter];
        emit UnassignDelegate(_voter, _delegate);
    }

    /**
     * @dev Internal function to get the cumulative voting power of the `_voters` at the `_blockNumber`
     * @param _voters List of voters
     * @param _blockNumber Target block number
     */
    function _getVotingPowerMultipleAt(address[] _voters, uint256 _blockNumber) internal view returns (uint256[] memory balances) {
        uint256 votersCount = _voters.length;
        balances = new uint256[](votersCount);
        for (uint256 i = 0; i < votersCount; ++i) {
            balances[i] = token.balanceOfAt(_voters[i], _blockNumber);
        }
    }

    /**
    * @dev Internal function to check if a vote can be executed. It assumes the queried vote exists.
    * @param _voteId Vote identifier
    * @return True if the given vote can be executed, false otherwise
    */
    function _canExecute(uint256 _voteId) internal view returns (bool) {
        Vote storage vote_ = votes[_voteId];

        if (vote_.executed) {
            return false;
        }

        // Vote ended?
        if (_getVotePhase(vote_) != VotePhase.Closed) {
            return false;
        }

        // Has enough support?
        uint256 voteYea = vote_.yea;
        uint256 totalVotes = voteYea.add(vote_.nay);
        if (!_isValuePct(voteYea, totalVotes, vote_.supportRequiredPct)) {
            return false;
        }
        // Has min quorum?
        if (!_isValuePct(voteYea, vote_.votingPower, vote_.minAcceptQuorumPct)) {
            return false;
        }

        return true;
    }

    /**
    * @dev Internal function to check if the given option is applicable at the given vote phase.
    *      It assumes the queried vote exists.
    * @param _votePhase The queried vote phase
    * @param _supports Whether the voter supports the vote
    * @return True if the given voter can participate a certain vote, false otherwise
    */
    function _isValidPhaseToVote(VotePhase _votePhase, bool _supports) internal pure returns (bool) {
        // In the Main phase both Yea and Nay votes are allowed
        if (_votePhase == VotePhase.Main) {
            return true;
        }
        // During the Objection phase only Nay votes are allowed
        if (_votePhase == VotePhase.Objection) {
            return !_supports;
        }
        // It's not allowed to vote in any other cases
        return false;
    }

    /**
    * @dev Internal function to check if the _delegate can vote on behalf of the _voter in the given vote.
    *      Note that the overpowering is possible both by the delegate's voter themself
    *      and by a new delegate they might elect while the vote is running.
    * @param vote_ The queried vote
    * @param _delegate Address of the delegate
    * @param _voter Address of the voter
    * @return True if the _delegate can vote on behalf of the _voter in the given vote, false otherwise
    */
    function _canVoteFor(Vote storage vote_, address _voter, address _delegate) internal view returns (bool) {
        // Zero addresses are not allowed
        if (_delegate == address(0) || _voter == address(0)) {
            return false;
        }
        // The _delegate must be a delegate for the _voter
        if (delegates[_voter].delegate != _delegate) {
            return false;
        }

        // The _voter must not have voted directly
        VoterState state = vote_.voters[_voter];
        return state != VoterState.Yea && state != VoterState.Nay;
    }

    /**
    * @dev Internal function to get the current phase of the vote. It assumes the queried vote exists.
    * @param vote_ The queried vote
    * @return VotePhase.Main if one can vote 'yes' or 'no', VotePhase.Objection if one can vote only 'no' or VotePhase.Closed if no votes are accepted
    */
    function _getVotePhase(Vote storage vote_) internal view returns (VotePhase) {
        uint64 timestamp = getTimestamp64();
        uint64 voteTimeEnd = vote_.startDate.add(voteTime);
        if (timestamp >= voteTimeEnd || vote_.executed) {
            return VotePhase.Closed;
        }
        if (timestamp < voteTimeEnd.sub(objectionPhaseTime)) {
            return VotePhase.Main;
        }
        assert(timestamp < voteTimeEnd);
        return VotePhase.Objection;
    }

    /**
    * @dev Calculates whether `_value` is more than a percentage `_pct` of `_total`
    * @param _value The value to compare
    * @param _total The total value
    * @param _pct The percentage to compare
    * @return True if `_value` is more than a percentage `_pct` of `_total`, false otherwise
    */
    function _isValuePct(uint256 _value, uint256 _total, uint256 _pct) internal pure returns (bool) {
        if (_total == 0) {
            return false;
        }

        uint256 computedPct = _value.mul(PCT_BASE) / _total;
        return computedPct > _pct;
    }
}