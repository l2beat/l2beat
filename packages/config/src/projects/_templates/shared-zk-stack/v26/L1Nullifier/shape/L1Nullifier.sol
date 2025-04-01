// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library UnsafeBytes {
    function readUint32(bytes memory _bytes, uint256 _start) internal pure returns (uint32 result, uint256 offset) {
        assembly {
            offset := add(_start, 4)
            result := mload(add(_bytes, offset))
        }
    }

    function readAddress(bytes memory _bytes, uint256 _start) internal pure returns (address result, uint256 offset) {
        assembly {
            offset := add(_start, 20)
            result := mload(add(_bytes, offset))
        }
    }

    function readUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readBytes32(bytes memory _bytes, uint256 _start) internal pure returns (bytes32 result, uint256 offset) {
        assembly {
            offset := add(_start, 32)
            result := mload(add(_bytes, offset))
        }
    }

    function readRemainingBytes(bytes memory _bytes, uint256 _start) internal pure returns (bytes memory result) {
        uint256 arrayLen = _bytes.length - _start;
        result = new bytes(arrayLen);

        assembly {
            mcopy(add(result, 0x20), add(_bytes, add(0x20, _start)), arrayLen)
        }
    }
}

struct L2Message {
    uint16 txNumberInBatch;
    address sender;
    bytes data;
}

enum SharedBridgeKey {
    PostUpgradeFirstBatch,
    LegacyBridgeFirstBatch,
    LegacyBridgeLastDepositBatch,
    LegacyBridgeLastDepositTxn
}

enum TxStatus {
    Failure,
    Success
}

library DataEncoding {
    /// @notice Abi.encodes the data required for bridgeBurn for NativeTokenVault.
    /// @param _amount The amount of token to be transferred.
    /// @param _remoteReceiver The address which to receive tokens on remote chain.
    /// @param _maybeTokenAddress The helper field that should be either equal to 0 (in this case
    /// it is assumed that the token has been registered within NativeTokenVault already) or it
    /// can be equal to the address of the token on the current chain. Providing non-zero address
    /// allows it to be automatically registered in case it is not yet a part of NativeTokenVault.
    /// @return The encoded bridgeBurn data
    function encodeBridgeBurnData(
        uint256 _amount,
        address _remoteReceiver,
        address _maybeTokenAddress
    ) internal pure returns (bytes memory) {
        return abi.encode(_amount, _remoteReceiver, _maybeTokenAddress);
    }

    /// @notice Function decoding bridgeBurn data previously encoded with this library.
    /// @param _data The encoded data for bridgeBurn
    /// @return amount The amount of token to be transferred.
    /// @return receiver The address which to receive tokens on remote chain.
    /// @return maybeTokenAddress The helper field that should be either equal to 0 (in this case
    /// it is assumed that the token has been registered within NativeTokenVault already) or it
    /// can be equal to the address of the token on the current chain. Providing non-zero address
    /// allows it to be automatically registered in case it is not yet a part of NativeTokenVault.
    function decodeBridgeBurnData(
        bytes memory _data
    ) internal pure returns (uint256 amount, address receiver, address maybeTokenAddress) {
        if (_data.length != 96) {
            // For better error handling
            revert InvalidNTVBurnData();
        }

        (amount, receiver, maybeTokenAddress) = abi.decode(_data, (uint256, address, address));
    }

    /// @notice Abi.encodes the data required for bridgeMint on remote chain.
    /// @param _originalCaller The address which initiated the transfer.
    /// @param _remoteReceiver The address which to receive tokens on remote chain.
    /// @param _originToken The transferred token address.
    /// @param _amount The amount of token to be transferred.
    /// @param _erc20Metadata The transferred token metadata.
    /// @return The encoded bridgeMint data
    function encodeBridgeMintData(
        address _originalCaller,
        address _remoteReceiver,
        address _originToken,
        uint256 _amount,
        bytes memory _erc20Metadata
    ) internal pure returns (bytes memory) {
        // solhint-disable-next-line func-named-parameters
        return abi.encode(_originalCaller, _remoteReceiver, _originToken, _amount, _erc20Metadata);
    }

    /// @notice Function decoding transfer data previously encoded with this library.
    /// @param _bridgeMintData The encoded bridgeMint data
    /// @return _originalCaller The address which initiated the transfer.
    /// @return _remoteReceiver The address which to receive tokens on remote chain.
    /// @return _parsedOriginToken The transferred token address.
    /// @return _amount The amount of token to be transferred.
    /// @return _erc20Metadata The transferred token metadata.
    function decodeBridgeMintData(
        bytes memory _bridgeMintData
    )
        internal
        pure
        returns (
            address _originalCaller,
            address _remoteReceiver,
            address _parsedOriginToken,
            uint256 _amount,
            bytes memory _erc20Metadata
        )
    {
        (_originalCaller, _remoteReceiver, _parsedOriginToken, _amount, _erc20Metadata) = abi.decode(
            _bridgeMintData,
            (address, address, address, uint256, bytes)
        );
    }

    /// @notice Encodes the asset data by combining chain id, asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _assetData The asset data that has to be encoded.
    /// @param _sender The asset deployment tracker address.
    /// @return The encoded asset data.
    function encodeAssetId(uint256 _chainId, bytes32 _assetData, address _sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, _sender, _assetData));
    }

    /// @notice Encodes the asset data by combining chain id, asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _tokenAddress The address of token that has to be encoded (asset data is the address itself).
    /// @param _sender The asset deployment tracker address.
    /// @return The encoded asset data.
    function encodeAssetId(uint256 _chainId, address _tokenAddress, address _sender) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, _sender, _tokenAddress));
    }

    /// @notice Encodes the asset data by combining chain id, NTV as asset deployment tracker and asset data.
    /// @param _chainId The id of the chain token is native to.
    /// @param _assetData The asset data that has to be encoded.
    /// @return The encoded asset data.
    function encodeNTVAssetId(uint256 _chainId, bytes32 _assetData) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, L2_NATIVE_TOKEN_VAULT_ADDR, _assetData));
    }

    /// @notice Encodes the asset data by combining chain id, NTV as asset deployment tracker and token address.
    /// @param _chainId The id of the chain token is native to.
    /// @param _tokenAddress The address of token that has to be encoded (asset data is the address itself).
    /// @return The encoded asset data.
    function encodeNTVAssetId(uint256 _chainId, address _tokenAddress) internal pure returns (bytes32) {
        return keccak256(abi.encode(_chainId, L2_NATIVE_TOKEN_VAULT_ADDR, _tokenAddress));
    }

    /// @dev Encodes the transaction data hash using either the latest encoding standard or the legacy standard.
    /// @param _encodingVersion EncodingVersion.
    /// @param _originalCaller The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _nativeTokenVault The address of the token, only used if the encoding version is legacy.
    /// @param _transferData The encoded transfer data, which includes both the deposit amount and the address of the L2 receiver.
    /// @return txDataHash The resulting encoded transaction data hash.
    function encodeTxDataHash(
        bytes1 _encodingVersion,
        address _originalCaller,
        bytes32 _assetId,
        address _nativeTokenVault,
        bytes memory _transferData
    ) internal view returns (bytes32 txDataHash) {
        if (_encodingVersion == LEGACY_ENCODING_VERSION) {
            address tokenAddress = INativeTokenVault(_nativeTokenVault).tokenAddress(_assetId);

            // This is a double check to ensure that the used token for the legacy encoding is correct.
            // This revert should never be emitted and in real life and should only serve as a guard in
            // case of inconsistent state of Native Token Vault.
            bytes32 expectedAssetId = encodeNTVAssetId(block.chainid, tokenAddress);
            if (_assetId != expectedAssetId) {
                revert IncorrectTokenAddressFromNTV(_assetId, tokenAddress);
            }

            (uint256 depositAmount, , ) = decodeBridgeBurnData(_transferData);
            txDataHash = keccak256(abi.encode(_originalCaller, tokenAddress, depositAmount));
        } else if (_encodingVersion == NEW_ENCODING_VERSION) {
            // Similarly to calldata, the txDataHash is collision-resistant.
            // In the legacy data hash, the first encoded variable was the address, which is padded with zeros during `abi.encode`.
            txDataHash = keccak256(
                bytes.concat(_encodingVersion, abi.encode(_originalCaller, _assetId, _transferData))
            );
        } else {
            revert UnsupportedEncodingVersion();
        }
    }

    /// @notice Decodes the token data by combining chain id, asset deployment tracker and asset data.
    function decodeTokenData(
        bytes calldata _tokenData
    ) internal pure returns (uint256 chainId, bytes memory name, bytes memory symbol, bytes memory decimals) {
        bytes1 encodingVersion = _tokenData[0];
        if (encodingVersion == LEGACY_ENCODING_VERSION) {
            (name, symbol, decimals) = abi.decode(_tokenData, (bytes, bytes, bytes));
        } else if (encodingVersion == NEW_ENCODING_VERSION) {
            return abi.decode(_tokenData[1:], (uint256, bytes, bytes, bytes));
        } else {
            revert UnsupportedEncodingVersion();
        }
    }

    /// @notice Encodes the token data by combining chain id, and its metadata.
    /// @dev Note that all the metadata of the token is expected to be ABI encoded.
    /// @param _chainId The id of the chain token is native to.
    /// @param _name The name of the token.
    /// @param _symbol The symbol of the token.
    /// @param _decimals The decimals of the token.
    /// @return The encoded token data.
    function encodeTokenData(
        uint256 _chainId,
        bytes memory _name,
        bytes memory _symbol,
        bytes memory _decimals
    ) internal pure returns (bytes memory) {
        return bytes.concat(NEW_ENCODING_VERSION, abi.encode(_chainId, _name, _symbol, _decimals));
    }
}

library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

library SafeERC20 {
    using Address for address;

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
     * Revert on invalid signature.
     */
    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return
            success && (returndata.length == 0 || abi.decode(returndata, (bool))) && Address.isContract(address(token));
    }
}

abstract contract PausableUpgradeable is Initializable, ContextUpgradeable {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    function __Pausable_init() internal onlyInitializing {
        __Pausable_init_unchained();
    }

    function __Pausable_init_unchained() internal onlyInitializing {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized != type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    function __Ownable_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable_init_unchained() internal onlyInitializing {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

abstract contract Ownable2StepUpgradeable is Initializable, OwnableUpgradeable {
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    function __Ownable2Step_init() internal onlyInitializing {
        __Ownable_init_unchained();
    }

    function __Ownable2Step_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        delete _pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        require(pendingOwner() == sender, "Ownable2Step: caller is not the new owner");
        _transferOwnership(sender);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

abstract contract ReentrancyGuard {
    /// @dev Address of lock flag variable.
    /// @dev Flag is placed at random memory location to not interfere with Storage contract.
    // keccak256("ReentrancyGuard") - 1;
    uint256 private constant LOCK_FLAG_ADDRESS = 0x8e94fed44239eb2314ab7a406345e6c5a8f0ccedf3b600de3d004e672c33abf4;

    // solhint-disable-next-line max-line-length
    // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/566a774222707e424896c0c390a84dc3c13bdcb2/contracts/security/ReentrancyGuard.sol
    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    modifier reentrancyGuardInitializer() {
        _initializeReentrancyGuard();
        _;
    }

    function _initializeReentrancyGuard() private {
        uint256 lockSlotOldValue;

        // Storing an initial non-zero value makes deployment a bit more
        // expensive but in exchange every call to nonReentrant
        // will be cheaper.
        assembly {
            lockSlotOldValue := sload(LOCK_FLAG_ADDRESS)
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }

        // Check that storage slot for reentrancy guard is empty to rule out possibility of slot conflict
        if (lockSlotOldValue != 0) {
            revert SlotOccupied();
        }
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        uint256 _status;
        assembly {
            _status := sload(LOCK_FLAG_ADDRESS)
        }

        if (_status == 0) {
            revert NotInitializedReentrancyGuard();
        }
        // On the first call to nonReentrant, _NOT_ENTERED will be true
        if (_status != _NOT_ENTERED) {
            revert Reentrancy();
        }

        // Any calls to nonReentrant after this point will fail
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _ENTERED)
        }

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        assembly {
            sstore(LOCK_FLAG_ADDRESS, _NOT_ENTERED)
        }
    }
}

struct FinalizeL1DepositParams {
    uint256 chainId;
    uint256 l2BatchNumber;
    uint256 l2MessageIndex;
    address l2Sender;
    uint16 l2TxNumberInBatch;
    bytes message;
    bytes32[] merkleProof;
}

interface IL1Nullifier {
    event BridgehubDepositFinalized(
        uint256 indexed chainId,
        bytes32 indexed txDataHash,
        bytes32 indexed l2DepositTxHash
    );

    function isWithdrawalFinalized(
        uint256 _chainId,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex
    ) external view returns (bool);

    function claimFailedDepositLegacyErc20Bridge(
        address _depositSender,
        address _l1Token,
        uint256 _amount,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) external;

    function claimFailedDeposit(
        uint256 _chainId,
        address _depositSender,
        address _l1Token,
        uint256 _amount,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) external;

    function finalizeDeposit(FinalizeL1DepositParams calldata _finalizeWithdrawalParams) external;

    function BRIDGE_HUB() external view returns (IBridgehub);

    function legacyBridge() external view returns (IL1ERC20Bridge);

    function depositHappened(uint256 _chainId, bytes32 _l2TxHash) external view returns (bytes32);

    function bridgehubConfirmL2TransactionForwarded(uint256 _chainId, bytes32 _txDataHash, bytes32 _txHash) external;

    function l1NativeTokenVault() external view returns (IL1NativeTokenVault);

    function setL1NativeTokenVault(IL1NativeTokenVault _nativeTokenVault) external;

    function setL1AssetRouter(address _l1AssetRouter) external;

    function chainBalance(uint256 _chainId, address _token) external view returns (uint256);

    function l2BridgeAddress(uint256 _chainId) external view returns (address);

    function transferTokenToNTV(address _token) external;

    function nullifyChainBalanceByNTV(uint256 _chainId, address _token) external;

    /// @dev Withdraw funds from the initiated deposit, that failed when finalizing on L2.
    /// @param _chainId The ZK chain id to which deposit was initiated.
    /// @param _depositSender The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _assetData The encoded transfer data, which includes both the deposit amount and the address of the L2 receiver. Might include extra information.
    /// @param _l2TxHash The L2 transaction hash of the failed deposit finalization.
    /// @param _l2BatchNumber The L2 batch number where the deposit finalization was processed.
    /// @param _l2MessageIndex The position in the L2 logs Merkle tree of the l2Log that was sent with the message.
    /// @param _l2TxNumberInBatch The L2 transaction number in a batch, in which the log was sent.
    /// @param _merkleProof The Merkle proof of the processing L1 -> L2 transaction with deposit finalization.
    /// @dev Processes claims of failed deposit, whether they originated from the legacy bridge or the current system.
    function bridgeRecoverFailedTransfer(
        uint256 _chainId,
        address _depositSender,
        bytes32 _assetId,
        bytes memory _assetData,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) external;

    /// @notice Legacy function to finalize withdrawal via the same
    /// interface as the old L1SharedBridge.
    /// @dev Note, that we need to keep this interface, since the `L2AssetRouter`
    /// will continue returning the previous address as the `l1SharedBridge`. The value
    /// returned by it is used in the SDK for finalizing withdrawals.
    /// @param _chainId The chain ID of the transaction to check
    /// @param _l2BatchNumber The L2 batch number where the withdrawal was processed
    /// @param _l2MessageIndex The position in the L2 logs Merkle tree of the l2Log that was sent with the message
    /// @param _l2TxNumberInBatch The L2 transaction number in the batch, in which the log was sent
    /// @param _message The L2 withdraw data, stored in an L2 -> L1 message
    /// @param _merkleProof The Merkle proof of the inclusion L2 -> L1 message about withdrawal initialization
    function finalizeWithdrawal(
        uint256 _chainId,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes calldata _message,
        bytes32[] calldata _merkleProof
    ) external;
}

contract L1Nullifier is IL1Nullifier, ReentrancyGuard, Ownable2StepUpgradeable, PausableUpgradeable {
    using SafeERC20 for IERC20;

    /// @dev Bridgehub smart contract that is used to operate with L2 via asynchronous L2 <-> L1 communication.
    IBridgehub public immutable override BRIDGE_HUB;

    /// @dev Era's chainID
    uint256 internal immutable ERA_CHAIN_ID;

    /// @dev The address of ZKsync Era diamond proxy contract.
    address internal immutable ERA_DIAMOND_PROXY;

    /// @dev Stores the first batch number on the ZKsync Era Diamond Proxy that was settled after Diamond proxy upgrade.
    /// This variable is used to differentiate between pre-upgrade and post-upgrade Eth withdrawals. Withdrawals from batches older
    /// than this value are considered to have been finalized prior to the upgrade and handled separately.
    uint256 internal eraPostDiamondUpgradeFirstBatch;

    /// @dev Stores the first batch number on the ZKsync Era Diamond Proxy that was settled after L1ERC20 Bridge upgrade.
    /// This variable is used to differentiate between pre-upgrade and post-upgrade ERC20 withdrawals. Withdrawals from batches older
    /// than this value are considered to have been finalized prior to the upgrade and handled separately.
    uint256 internal eraPostLegacyBridgeUpgradeFirstBatch;

    /// @dev Stores the ZKsync Era batch number that processes the last deposit tx initiated by the legacy bridge
    /// This variable (together with eraLegacyBridgeLastDepositTxNumber) is used to differentiate between pre-upgrade and post-upgrade deposits. Deposits processed in older batches
    /// than this value are considered to have been processed prior to the upgrade and handled separately.
    /// We use this both for Eth and erc20 token deposits, so we need to update the diamond and bridge simultaneously.
    uint256 internal eraLegacyBridgeLastDepositBatch;

    /// @dev The tx number in the _eraLegacyBridgeLastDepositBatch that comes *right after* the last deposit tx initiated by the legacy bridge.
    /// This variable (together with eraLegacyBridgeLastDepositBatch) is used to differentiate between pre-upgrade and post-upgrade deposits. Deposits processed in older txs
    /// than this value are considered to have been processed prior to the upgrade and handled separately.
    /// We use this both for Eth and erc20 token deposits, so we need to update the diamond and bridge simultaneously.
    uint256 internal eraLegacyBridgeLastDepositTxNumber;

    /// @dev Legacy bridge smart contract that used to hold ERC20 tokens.
    IL1ERC20Bridge public override legacyBridge;

    /// @dev A mapping chainId => bridgeProxy. Used to store the bridge proxy's address, and to see if it has been deployed yet.
    // slither-disable-next-line uninitialized-state
    mapping(uint256 chainId => address l2Bridge) public __DEPRECATED_l2BridgeAddress;

    /// @dev A mapping chainId => L2 deposit transaction hash => dataHash
    // keccak256(abi.encode(account, tokenAddress, amount)) for legacy transfers
    // keccak256(abi.encode(_originalCaller, assetId, transferData)) for new transfers
    /// @dev Tracks deposit transactions to L2 to enable users to claim their funds if a deposit fails.
    mapping(uint256 chainId => mapping(bytes32 l2DepositTxHash => bytes32 depositDataHash))
        public
        override depositHappened;

    /// @dev Tracks the processing status of L2 to L1 messages, indicating whether a message has already been finalized.
    mapping(uint256 chainId => mapping(uint256 l2BatchNumber => mapping(uint256 l2ToL1MessageNumber => bool isFinalized)))
        public isWithdrawalFinalized;

    /// @notice Deprecated. Kept for backwards compatibility.
    /// @dev Indicates whether the hyperbridging is enabled for a given chain.
    // slither-disable-next-line uninitialized-state
    mapping(uint256 chainId => bool enabled) private __DEPRECATED_hyperbridgingEnabled;

    /// @dev Maps token balances for each chain to prevent unauthorized spending across ZK chain.
    /// This serves as a security measure until hyperbridging is implemented.
    /// NOTE: this function may be removed in the future, don't rely on it!
    mapping(uint256 chainId => mapping(address l1Token => uint256 balance)) public __DEPRECATED_chainBalance;

    /// @dev Admin has the ability to register new chains within the shared bridge.
    address public __DEPRECATED_admin;

    /// @dev The pending admin, i.e. the candidate to the admin role.
    address public __DEPRECATED_pendingAdmin;

    /// @dev Address of L1 asset router.
    IL1AssetRouter public l1AssetRouter;

    /// @dev Address of native token vault.
    IL1NativeTokenVault public l1NativeTokenVault;

    /// @notice Checks that the message sender is the asset router..
    modifier onlyAssetRouter() {
        if (msg.sender != address(l1AssetRouter)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @notice Checks that the message sender is the native token vault.
    modifier onlyL1NTV() {
        if (msg.sender != address(l1NativeTokenVault)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @notice Checks that the message sender is the legacy bridge.
    modifier onlyLegacyBridge() {
        if (msg.sender != address(legacyBridge)) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    /// @dev Contract is expected to be used as proxy implementation.
    /// @dev Initialize the implementation to prevent Parity hack.
    constructor(IBridgehub _bridgehub, uint256 _eraChainId, address _eraDiamondProxy) reentrancyGuardInitializer {
        _disableInitializers();
        BRIDGE_HUB = _bridgehub;
        ERA_CHAIN_ID = _eraChainId;
        ERA_DIAMOND_PROXY = _eraDiamondProxy;
    }

    /// @dev Initializes a contract bridge for later use. Expected to be used in the proxy.
    /// @dev Used for testing purposes only, as the contract has been initialized on mainnet.
    /// @param _owner The address which can change L2 token implementation and upgrade the bridge implementation.
    /// The owner is the Governor and separate from the ProxyAdmin from now on, so that the Governor can call the bridge.
    /// @param _eraPostDiamondUpgradeFirstBatch The first batch number on the ZKsync Era Diamond Proxy that was settled after diamond proxy upgrade.
    /// @param _eraPostLegacyBridgeUpgradeFirstBatch The first batch number on the ZKsync Era Diamond Proxy that was settled after legacy bridge upgrade.
    /// @param _eraLegacyBridgeLastDepositBatch The the ZKsync Era batch number that processes the last deposit tx initiated by the legacy bridge.
    /// @param _eraLegacyBridgeLastDepositTxNumber The tx number in the _eraLegacyBridgeLastDepositBatch of the last deposit tx initiated by the legacy bridge.
    function initialize(
        address _owner,
        uint256 _eraPostDiamondUpgradeFirstBatch,
        uint256 _eraPostLegacyBridgeUpgradeFirstBatch,
        uint256 _eraLegacyBridgeLastDepositBatch,
        uint256 _eraLegacyBridgeLastDepositTxNumber
    ) external reentrancyGuardInitializer initializer {
        if (_owner == address(0)) {
            revert ZeroAddress();
        }
        _transferOwnership(_owner);
        if (eraPostDiamondUpgradeFirstBatch == 0) {
            eraPostDiamondUpgradeFirstBatch = _eraPostDiamondUpgradeFirstBatch;
            eraPostLegacyBridgeUpgradeFirstBatch = _eraPostLegacyBridgeUpgradeFirstBatch;
            eraLegacyBridgeLastDepositBatch = _eraLegacyBridgeLastDepositBatch;
            eraLegacyBridgeLastDepositTxNumber = _eraLegacyBridgeLastDepositTxNumber;
        }
    }

    /// @notice Transfers tokens from shared bridge to native token vault.
    /// @dev This function is part of the upgrade process used to transfer liquidity.
    /// @param _token The address of the token to be transferred to NTV.
    function transferTokenToNTV(address _token) external onlyL1NTV {
        address ntvAddress = address(l1NativeTokenVault);
        if (ETH_TOKEN_ADDRESS == _token) {
            uint256 amount = address(this).balance;
            bool callSuccess;
            // Low-level assembly call, to avoid any memory copying (save gas)
            assembly {
                callSuccess := call(gas(), ntvAddress, amount, 0, 0, 0, 0)
            }
            if (!callSuccess) {
                revert EthTransferFailed();
            }
        } else {
            IERC20(_token).safeTransfer(ntvAddress, IERC20(_token).balanceOf(address(this)));
        }
    }

    /// @notice Clears chain balance for specific token.
    /// @dev This function is part of the upgrade process used to nullify chain balances once they are credited to NTV.
    /// @param _chainId The ID of the ZK chain.
    /// @param _token The address of the token which was previously deposit to shared bridge.
    function nullifyChainBalanceByNTV(uint256 _chainId, address _token) external onlyL1NTV {
        __DEPRECATED_chainBalance[_chainId][_token] = 0;
    }

    /// @notice Legacy function used for migration, do not use!
    /// @param _chainId The chain id on which the bridge is deployed.
    // slither-disable-next-line uninitialized-state-variables
    function l2BridgeAddress(uint256 _chainId) external view returns (address) {
        // slither-disable-next-line uninitialized-state-variables
        return __DEPRECATED_l2BridgeAddress[_chainId];
    }

    /// @notice Legacy function used for migration, do not use!
    /// @param _chainId The chain id we want to get the balance for.
    /// @param _token The address of the token.
    // slither-disable-next-line uninitialized-state-variables
    function chainBalance(uint256 _chainId, address _token) external view returns (uint256) {
        // slither-disable-next-line uninitialized-state-variables
        return __DEPRECATED_chainBalance[_chainId][_token];
    }

    /// @notice Sets the L1ERC20Bridge contract address.
    /// @dev Should be called only once by the owner.
    /// @param _legacyBridge The address of the legacy bridge.
    function setL1Erc20Bridge(IL1ERC20Bridge _legacyBridge) external onlyOwner {
        if (address(legacyBridge) != address(0)) {
            revert AddressAlreadySet(address(legacyBridge));
        }
        if (address(_legacyBridge) == address(0)) {
            revert ZeroAddress();
        }
        legacyBridge = _legacyBridge;
    }

    /// @notice Sets the nativeTokenVault contract address.
    /// @dev Should be called only once by the owner.
    /// @param _l1NativeTokenVault The address of the native token vault.
    function setL1NativeTokenVault(IL1NativeTokenVault _l1NativeTokenVault) external onlyOwner {
        if (address(l1NativeTokenVault) != address(0)) {
            revert NativeTokenVaultAlreadySet();
        }
        if (address(_l1NativeTokenVault) == address(0)) {
            revert ZeroAddress();
        }
        l1NativeTokenVault = _l1NativeTokenVault;
    }

    /// @notice Sets the L1 asset router contract address.
    /// @dev Should be called only once by the owner.
    /// @param _l1AssetRouter The address of the asset router.
    function setL1AssetRouter(address _l1AssetRouter) external onlyOwner {
        if (address(l1AssetRouter) != address(0)) {
            revert AddressAlreadySet(address(l1AssetRouter));
        }
        if (_l1AssetRouter == address(0)) {
            revert ZeroAddress();
        }
        l1AssetRouter = IL1AssetRouter(_l1AssetRouter);
    }

    /// @notice Confirms the acceptance of a transaction by the Mailbox, as part of the L2 transaction process within Bridgehub.
    /// This function is utilized by `requestL2TransactionTwoBridges` to validate the execution of a transaction.
    /// @param _chainId The chain ID of the ZK chain to which confirm the deposit.
    /// @param _txDataHash The keccak256 hash of 0x01 || abi.encode(bytes32, bytes) to identify deposits.
    /// @param _txHash The hash of the L1->L2 transaction to confirm the deposit.
    function bridgehubConfirmL2TransactionForwarded(
        uint256 _chainId,
        bytes32 _txDataHash,
        bytes32 _txHash
    ) external override onlyAssetRouter whenNotPaused {
        if (depositHappened[_chainId][_txHash] != 0x00) {
            revert DepositExists();
        }
        depositHappened[_chainId][_txHash] = _txDataHash;
        emit BridgehubDepositFinalized(_chainId, _txDataHash, _txHash);
    }

    /// @dev Calls the library `encodeTxDataHash`. Used as a wrapped for try / catch case.
    /// @dev Encodes the transaction data hash using either the latest encoding standard or the legacy standard.
    /// @param _encodingVersion EncodingVersion.
    /// @param _originalCaller The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _transferData The encoded transfer data, which includes both the deposit amount and the address of the L2 receiver.
    /// @return txDataHash The resulting encoded transaction data hash.
    function encodeTxDataHash(
        bytes1 _encodingVersion,
        address _originalCaller,
        bytes32 _assetId,
        bytes calldata _transferData
    ) external view returns (bytes32 txDataHash) {
        txDataHash = DataEncoding.encodeTxDataHash({
            _encodingVersion: _encodingVersion,
            _originalCaller: _originalCaller,
            _assetId: _assetId,
            _nativeTokenVault: address(l1NativeTokenVault),
            _transferData: _transferData
        });
    }

    /// @inheritdoc IL1Nullifier
    function bridgeRecoverFailedTransfer(
        uint256 _chainId,
        address _depositSender,
        bytes32 _assetId,
        bytes memory _assetData,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) public nonReentrant {
        _verifyAndClearFailedTransfer({
            _checkedInLegacyBridge: false,
            _chainId: _chainId,
            _depositSender: _depositSender,
            _assetId: _assetId,
            _assetData: _assetData,
            _l2TxHash: _l2TxHash,
            _l2BatchNumber: _l2BatchNumber,
            _l2MessageIndex: _l2MessageIndex,
            _l2TxNumberInBatch: _l2TxNumberInBatch,
            _merkleProof: _merkleProof
        });

        l1AssetRouter.bridgeRecoverFailedTransfer(_chainId, _depositSender, _assetId, _assetData);
    }

    /// @dev Withdraw funds from the initiated deposit, that failed when finalizing on L2.
    /// @param _chainId The ZK chain id to which deposit was initiated.
    /// @param _depositSender The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _assetData The encoded data, which is used by the asset handler to determine L2 recipient and amount. Might include extra information.
    /// @param _l2TxHash The L2 transaction hash of the failed deposit finalization.
    /// @param _l2BatchNumber The L2 batch number where the deposit finalization was processed.
    /// @param _l2MessageIndex The position in the L2 logs Merkle tree of the l2Log that was sent with the message.
    /// @param _l2TxNumberInBatch The L2 transaction number in a batch, in which the log was sent.
    /// @param _merkleProof The Merkle proof of the processing L1 -> L2 transaction with deposit finalization.
    /// @dev Processes claims of failed deposit, whether they originated from the legacy bridge or the current system.
    function _verifyAndClearFailedTransfer(
        bool _checkedInLegacyBridge,
        uint256 _chainId,
        address _depositSender,
        bytes32 _assetId,
        bytes memory _assetData,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) internal whenNotPaused {
        {
            bool proofValid = BRIDGE_HUB.proveL1ToL2TransactionStatus({
                _chainId: _chainId,
                _l2TxHash: _l2TxHash,
                _l2BatchNumber: _l2BatchNumber,
                _l2MessageIndex: _l2MessageIndex,
                _l2TxNumberInBatch: _l2TxNumberInBatch,
                _merkleProof: _merkleProof,
                _status: TxStatus.Failure
            });
            if (!proofValid) {
                revert InvalidProof();
            }
        }

        bool notCheckedInLegacyBridgeOrWeCanCheckDeposit;
        {
            // Deposits that happened before the upgrade cannot be checked here, they have to be claimed and checked in the legacyBridge
            bool weCanCheckDepositHere = !_isPreSharedBridgeDepositOnEra(_chainId, _l2BatchNumber, _l2TxNumberInBatch);
            // Double claims are not possible, as depositHappened is checked here for all except legacy deposits (which have to happen through the legacy bridge)
            // Funds claimed before the update will still be recorded in the legacy bridge
            // Note we double check NEW deposits if they are called from the legacy bridge
            notCheckedInLegacyBridgeOrWeCanCheckDeposit = (!_checkedInLegacyBridge) || weCanCheckDepositHere;
        }

        if (notCheckedInLegacyBridgeOrWeCanCheckDeposit) {
            bytes32 dataHash = depositHappened[_chainId][_l2TxHash];
            // Determine if the given dataHash matches the calculated legacy transaction hash.
            bool isLegacyTxDataHash = _isLegacyTxDataHash(_depositSender, _assetId, _assetData, dataHash);
            // If the dataHash matches the legacy transaction hash, skip the next step.
            // Otherwise, perform the check using the new transaction data hash encoding.
            if (!isLegacyTxDataHash) {
                bytes32 txDataHash = DataEncoding.encodeTxDataHash({
                    _encodingVersion: NEW_ENCODING_VERSION,
                    _originalCaller: _depositSender,
                    _assetId: _assetId,
                    _nativeTokenVault: address(l1NativeTokenVault),
                    _transferData: _assetData
                });
                if (dataHash != txDataHash) {
                    revert DepositDoesNotExist();
                }
            }
        }
        delete depositHappened[_chainId][_l2TxHash];
    }

    /// @notice Finalize the withdrawal and release funds.
    /// @param _finalizeWithdrawalParams The structure that holds all necessary data to finalize withdrawal
    /// @dev We have both the legacy finalizeWithdrawal and the new finalizeDeposit functions,
    /// finalizeDeposit uses the new format. On the L2 we have finalizeDeposit with new and old formats both.
    function finalizeDeposit(FinalizeL1DepositParams memory _finalizeWithdrawalParams) public {
        _finalizeDeposit(_finalizeWithdrawalParams);
    }

    /// @notice Internal function that handles the logic for finalizing withdrawals, supporting both the current bridge system and the legacy ERC20 bridge.
    /// @param _finalizeWithdrawalParams The structure that holds all necessary data to finalize withdrawal
    function _finalizeDeposit(
        FinalizeL1DepositParams memory _finalizeWithdrawalParams
    ) internal nonReentrant whenNotPaused {
        uint256 chainId = _finalizeWithdrawalParams.chainId;
        uint256 l2BatchNumber = _finalizeWithdrawalParams.l2BatchNumber;
        uint256 l2MessageIndex = _finalizeWithdrawalParams.l2MessageIndex;
        if (isWithdrawalFinalized[chainId][l2BatchNumber][l2MessageIndex]) {
            revert WithdrawalAlreadyFinalized();
        }
        isWithdrawalFinalized[chainId][l2BatchNumber][l2MessageIndex] = true;

        (bytes32 assetId, bytes memory transferData) = _verifyWithdrawal(_finalizeWithdrawalParams);

        // Handling special case for withdrawal from ZKsync Era initiated before Shared Bridge.
        if (_isPreSharedBridgeEraEthWithdrawal(chainId, l2BatchNumber)) {
            // Checks that the withdrawal wasn't finalized already.
            bool alreadyFinalized = IGetters(ERA_DIAMOND_PROXY).isEthWithdrawalFinalized(l2BatchNumber, l2MessageIndex);
            if (alreadyFinalized) {
                revert WithdrawalAlreadyFinalized();
            }
        }
        if (_isPreSharedBridgeEraTokenWithdrawal(chainId, l2BatchNumber)) {
            if (legacyBridge.isWithdrawalFinalized(l2BatchNumber, l2MessageIndex)) {
                revert WithdrawalAlreadyFinalized();
            }
        }

        l1AssetRouter.finalizeDeposit(chainId, assetId, transferData);
    }

    /// @dev Determines if an eth withdrawal was initiated on ZKsync Era before the upgrade to the Shared Bridge.
    /// @param _chainId The chain ID of the transaction to check.
    /// @param _l2BatchNumber The L2 batch number for the withdrawal.
    /// @return Whether withdrawal was initiated on ZKsync Era before diamond proxy upgrade.
    function _isPreSharedBridgeEraEthWithdrawal(uint256 _chainId, uint256 _l2BatchNumber) internal view returns (bool) {
        if ((_chainId == ERA_CHAIN_ID) && eraPostDiamondUpgradeFirstBatch == 0) {
            revert SharedBridgeValueNotSet(SharedBridgeKey.PostUpgradeFirstBatch);
        }
        return (_chainId == ERA_CHAIN_ID) && (_l2BatchNumber < eraPostDiamondUpgradeFirstBatch);
    }

    /// @dev Determines if a token withdrawal was initiated on ZKsync Era before the upgrade to the Shared Bridge.
    /// @param _chainId The chain ID of the transaction to check.
    /// @param _l2BatchNumber The L2 batch number for the withdrawal.
    /// @return Whether withdrawal was initiated on ZKsync Era before Legacy Bridge upgrade.
    function _isPreSharedBridgeEraTokenWithdrawal(
        uint256 _chainId,
        uint256 _l2BatchNumber
    ) internal view returns (bool) {
        if ((_chainId == ERA_CHAIN_ID) && eraPostLegacyBridgeUpgradeFirstBatch == 0) {
            revert SharedBridgeValueNotSet(SharedBridgeKey.LegacyBridgeFirstBatch);
        }
        return (_chainId == ERA_CHAIN_ID) && (_l2BatchNumber < eraPostLegacyBridgeUpgradeFirstBatch);
    }

    /// @dev Determines if the provided data for a failed deposit corresponds to a legacy failed deposit.
    /// @param _depositSender The address of the entity that initiated the deposit.
    /// @param _assetId The unique identifier of the deposited L1 token.
    /// @param _transferData The encoded transfer data, which includes both the deposit amount and the address of the L2 receiver.
    /// @param _expectedTxDataHash The nullifier data hash stored for the failed deposit.
    /// @return isLegacyTxDataHash True if the transaction is legacy, false otherwise.
    function _isLegacyTxDataHash(
        address _depositSender,
        bytes32 _assetId,
        bytes memory _transferData,
        bytes32 _expectedTxDataHash
    ) internal view returns (bool isLegacyTxDataHash) {
        try this.encodeTxDataHash(LEGACY_ENCODING_VERSION, _depositSender, _assetId, _transferData) returns (
            bytes32 txDataHash
        ) {
            return txDataHash == _expectedTxDataHash;
        } catch {
            return false;
        }
    }

    /// @dev Determines if a deposit was initiated on ZKsync Era before the upgrade to the Shared Bridge.
    /// @param _chainId The chain ID of the transaction to check.
    /// @param _l2BatchNumber The L2 batch number for the deposit where it was processed.
    /// @param _l2TxNumberInBatch The L2 transaction number in the batch, in which the deposit was processed.
    /// @return Whether deposit was initiated on ZKsync Era before Shared Bridge upgrade.
    function _isPreSharedBridgeDepositOnEra(
        uint256 _chainId,
        uint256 _l2BatchNumber,
        uint256 _l2TxNumberInBatch
    ) internal view returns (bool) {
        if ((_chainId == ERA_CHAIN_ID) && (eraLegacyBridgeLastDepositBatch == 0)) {
            revert SharedBridgeValueNotSet(SharedBridgeKey.LegacyBridgeLastDepositBatch);
        }
        return
            (_chainId == ERA_CHAIN_ID) &&
            (_l2BatchNumber < eraLegacyBridgeLastDepositBatch ||
                (_l2TxNumberInBatch < eraLegacyBridgeLastDepositTxNumber &&
                    _l2BatchNumber == eraLegacyBridgeLastDepositBatch));
    }

    /// @notice Verifies the validity of a withdrawal message from L2 and returns withdrawal details.
    /// @param _finalizeWithdrawalParams The structure that holds all necessary data to finalize withdrawal
    /// @return assetId The ID of the bridged asset.
    /// @return transferData The transfer data used to finalize withdawal.
    function _verifyWithdrawal(
        FinalizeL1DepositParams memory _finalizeWithdrawalParams
    ) internal returns (bytes32 assetId, bytes memory transferData) {
        (assetId, transferData) = _parseL2WithdrawalMessage(
            _finalizeWithdrawalParams.chainId,
            _finalizeWithdrawalParams.message
        );
        L2Message memory l2ToL1Message;
        {
            address l2Sender = _finalizeWithdrawalParams.l2Sender;
            bool baseTokenWithdrawal = (assetId == BRIDGE_HUB.baseTokenAssetId(_finalizeWithdrawalParams.chainId));

            bool isL2SenderCorrect = l2Sender == L2_ASSET_ROUTER_ADDR ||
                l2Sender == L2_BASE_TOKEN_SYSTEM_CONTRACT_ADDR ||
                l2Sender == __DEPRECATED_l2BridgeAddress[_finalizeWithdrawalParams.chainId];
            if (!isL2SenderCorrect) {
                revert WrongL2Sender(l2Sender);
            }

            l2ToL1Message = L2Message({
                txNumberInBatch: _finalizeWithdrawalParams.l2TxNumberInBatch,
                sender: baseTokenWithdrawal ? L2_BASE_TOKEN_SYSTEM_CONTRACT_ADDR : l2Sender,
                data: _finalizeWithdrawalParams.message
            });
        }

        bool success = BRIDGE_HUB.proveL2MessageInclusion({
            _chainId: _finalizeWithdrawalParams.chainId,
            _batchNumber: _finalizeWithdrawalParams.l2BatchNumber,
            _index: _finalizeWithdrawalParams.l2MessageIndex,
            _message: l2ToL1Message,
            _proof: _finalizeWithdrawalParams.merkleProof
        });
        // withdrawal wrong proof
        if (!success) {
            revert InvalidProof();
        }
    }

    /// @notice Parses the withdrawal message and returns withdrawal details.
    /// @dev Currently, 3 different encoding versions are supported: legacy mailbox withdrawal, ERC20 bridge withdrawal,
    /// @dev and the latest version supported by shared bridge. Selectors are used for versioning.
    /// @param _chainId The ZK chain ID.
    /// @param _l2ToL1message The encoded L2 -> L1 message.
    /// @return assetId The ID of the bridged asset.
    /// @return transferData The transfer data used to finalize withdawal.
    function _parseL2WithdrawalMessage(
        uint256 _chainId,
        bytes memory _l2ToL1message
    ) internal returns (bytes32 assetId, bytes memory transferData) {
        // Please note that there are three versions of the message:
        // 1. The message that is sent from `L2BaseToken` to withdraw base token.
        // 2. The message that is sent from L2 Legacy Shared Bridge to withdraw ERC20 tokens or base token.
        // 3. The message that is sent from L2 Asset Router to withdraw ERC20 tokens or base token.

        uint256 amount;
        address l1Receiver;

        (uint32 functionSignature, uint256 offset) = UnsafeBytes.readUint32(_l2ToL1message, 0);
        if (bytes4(functionSignature) == IMailbox.finalizeEthWithdrawal.selector) {
            // The data is expected to be at least 56 bytes long.
            if (_l2ToL1message.length < 56) {
                revert L2WithdrawalMessageWrongLength(_l2ToL1message.length);
            }
            // this message is a base token withdrawal
            (l1Receiver, offset) = UnsafeBytes.readAddress(_l2ToL1message, offset);
            // slither-disable-next-line unused-return
            (amount, ) = UnsafeBytes.readUint256(_l2ToL1message, offset);
            assetId = BRIDGE_HUB.baseTokenAssetId(_chainId);
            transferData = DataEncoding.encodeBridgeMintData({
                _originalCaller: address(0),
                _remoteReceiver: l1Receiver,
                // Note, that `assetId` could belong to a token native to an L2, and so
                // the logic for determining the correct origin token address will be complex.
                // It is expected that this value won't be used in the NativeTokenVault and so providing
                // any value is acceptable here.
                _originToken: address(0),
                _amount: amount,
                _erc20Metadata: new bytes(0)
            });
        } else if (bytes4(functionSignature) == IL1ERC20Bridge.finalizeWithdrawal.selector) {
            // this message is a token withdrawal

            // Check that the message length is correct.
            // It should be equal to the length of the function signature + address + address + uint256 = 4 + 20 + 20 + 32 =
            // 76 (bytes).
            if (_l2ToL1message.length != 76) {
                revert L2WithdrawalMessageWrongLength(_l2ToL1message.length);
            }
            (l1Receiver, offset) = UnsafeBytes.readAddress(_l2ToL1message, offset);
            // We use the IL1ERC20Bridge for backward compatibility with old withdrawals.
            address l1Token;
            (l1Token, offset) = UnsafeBytes.readAddress(_l2ToL1message, offset);
            // slither-disable-next-line unused-return
            (amount, ) = UnsafeBytes.readUint256(_l2ToL1message, offset);

            l1NativeTokenVault.ensureTokenIsRegistered(l1Token);
            assetId = DataEncoding.encodeNTVAssetId(block.chainid, l1Token);
            transferData = DataEncoding.encodeBridgeMintData({
                _originalCaller: address(0),
                _remoteReceiver: l1Receiver,
                _originToken: l1Token,
                _amount: amount,
                _erc20Metadata: new bytes(0)
            });
        } else if (bytes4(functionSignature) == IAssetRouterBase.finalizeDeposit.selector) {
            // The data is expected to be at least 68 bytes long to contain assetId.
            if (_l2ToL1message.length < 68) {
                revert WrongMsgLength(68, _l2ToL1message.length);
            }
            // slither-disable-next-line unused-return
            (, offset) = UnsafeBytes.readUint256(_l2ToL1message, offset); // originChainId, not used for L2->L1 txs
            (assetId, offset) = UnsafeBytes.readBytes32(_l2ToL1message, offset);
            transferData = UnsafeBytes.readRemainingBytes(_l2ToL1message, offset);
        } else {
            revert InvalidSelector(bytes4(functionSignature));
        }
    }

    /*//////////////////////////////////////////////////////////////
            SHARED BRIDGE TOKEN BRIDGING LEGACY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @dev Withdraw funds from the initiated deposit, that failed when finalizing on L2.
    /// @param _depositSender The address of the deposit initiator.
    /// @param _l1Token The address of the deposited L1 ERC20 token.
    /// @param _amount The amount of the deposit that failed.
    /// @param _l2TxHash The L2 transaction hash of the failed deposit finalization.
    /// @param _l2BatchNumber The L2 batch number where the deposit finalization was processed.
    /// @param _l2MessageIndex The position in the L2 logs Merkle tree of the l2Log that was sent with the message.
    /// @param _l2TxNumberInBatch The L2 transaction number in a batch, in which the log was sent.
    /// @param _merkleProof The Merkle proof of the processing L1 -> L2 transaction with deposit finalization.
    function claimFailedDeposit(
        uint256 _chainId,
        address _depositSender,
        address _l1Token,
        uint256 _amount,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) external {
        bytes32 assetId = l1NativeTokenVault.assetId(_l1Token);
        bytes32 ntvAssetId = DataEncoding.encodeNTVAssetId(block.chainid, _l1Token);
        if (assetId == bytes32(0)) {
            assetId = ntvAssetId;
        } else if (assetId != ntvAssetId) {
            revert LegacyMethodForNonL1Token();
        }

        // For legacy deposits, the l2 receiver is not required to check tx data hash
        // The token address does not have to be provided for this functionality either.
        bytes memory assetData = DataEncoding.encodeBridgeBurnData(_amount, address(0), address(0));

        _verifyAndClearFailedTransfer({
            _checkedInLegacyBridge: false,
            _depositSender: _depositSender,
            _chainId: _chainId,
            _assetId: assetId,
            _assetData: assetData,
            _l2TxHash: _l2TxHash,
            _l2BatchNumber: _l2BatchNumber,
            _l2MessageIndex: _l2MessageIndex,
            _l2TxNumberInBatch: _l2TxNumberInBatch,
            _merkleProof: _merkleProof
        });

        l1AssetRouter.bridgeRecoverFailedTransfer({
            _chainId: _chainId,
            _depositSender: _depositSender,
            _assetId: assetId,
            _assetData: assetData
        });
    }

    /*//////////////////////////////////////////////////////////////
                    ERA ERC20 LEGACY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Withdraw funds from the initiated deposit, that failed when finalizing on ZKsync Era chain.
    /// This function is specifically designed for maintaining backward-compatibility with legacy `claimFailedDeposit`
    /// method in `L1ERC20Bridge`.
    ///
    /// @param _depositSender The address of the deposit initiator.
    /// @param _l1Token The address of the deposited L1 ERC20 token.
    /// @param _amount The amount of the deposit that failed.
    /// @param _l2TxHash The L2 transaction hash of the failed deposit finalization.
    /// @param _l2BatchNumber The L2 batch number where the deposit finalization was processed.
    /// @param _l2MessageIndex The position in the L2 logs Merkle tree of the l2Log that was sent with the message.
    /// @param _l2TxNumberInBatch The L2 transaction number in a batch, in which the log was sent.
    /// @param _merkleProof The Merkle proof of the processing L1 -> L2 transaction with deposit finalization.
    function claimFailedDepositLegacyErc20Bridge(
        address _depositSender,
        address _l1Token,
        uint256 _amount,
        bytes32 _l2TxHash,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes32[] calldata _merkleProof
    ) external override onlyLegacyBridge {
        // For legacy deposits, the l2 receiver is not required to check tx data hash
        // The token address does not have to be provided for this functionality either.
        bytes memory assetData = DataEncoding.encodeBridgeBurnData(_amount, address(0), address(0));

        /// the legacy bridge can only be used with L1 native tokens.
        bytes32 assetId = DataEncoding.encodeNTVAssetId(block.chainid, _l1Token);

        _verifyAndClearFailedTransfer({
            _checkedInLegacyBridge: true,
            _depositSender: _depositSender,
            _chainId: ERA_CHAIN_ID,
            _assetId: assetId,
            _assetData: assetData,
            _l2TxHash: _l2TxHash,
            _l2BatchNumber: _l2BatchNumber,
            _l2MessageIndex: _l2MessageIndex,
            _l2TxNumberInBatch: _l2TxNumberInBatch,
            _merkleProof: _merkleProof
        });

        l1AssetRouter.bridgeRecoverFailedTransfer({
            _chainId: ERA_CHAIN_ID,
            _depositSender: _depositSender,
            _assetId: assetId,
            _assetData: assetData
        });
    }

    /*//////////////////////////////////////////////////////////////
                            PAUSE
    //////////////////////////////////////////////////////////////*/

    /// @notice Pauses all functions marked with the `whenNotPaused` modifier.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the contract, allowing all functions marked with the `whenNotPaused` modifier to be called again.
    function unpause() external onlyOwner {
        _unpause();
    }

    /*//////////////////////////////////////////////////////////////
                            LEGACY INTERFACE
    //////////////////////////////////////////////////////////////*/

    /// @inheritdoc IL1Nullifier
    function finalizeWithdrawal(
        uint256 _chainId,
        uint256 _l2BatchNumber,
        uint256 _l2MessageIndex,
        uint16 _l2TxNumberInBatch,
        bytes calldata _message,
        bytes32[] calldata _merkleProof
    ) external override {
        /// @dev We use a deprecated field to support L2->L1 legacy withdrawals, which were started
        /// by the legacy bridge.
        address legacyL2Bridge = __DEPRECATED_l2BridgeAddress[_chainId];
        if (legacyL2Bridge == address(0)) {
            revert LegacyBridgeNotSet();
        }

        FinalizeL1DepositParams memory finalizeWithdrawalParams = FinalizeL1DepositParams({
            chainId: _chainId,
            l2BatchNumber: _l2BatchNumber,
            l2MessageIndex: _l2MessageIndex,
            l2Sender: legacyL2Bridge,
            l2TxNumberInBatch: _l2TxNumberInBatch,
            message: _message,
            merkleProof: _merkleProof
        });
        finalizeDeposit(finalizeWithdrawalParams);
    }
}