// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

abstract contract Owned {
    address public owner;
    address private pendingOwner;

    event OwnershipAccepted(address indexed newOwner);
    event OwnershipNominated(address indexed currentOwner, address indexed newOwner);
    event OwnershipNominationCleared();

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(owner != newOwner, "ALREADY_OWNER");
        pendingOwner = newOwner;
        if (newOwner == address(0x0)) {
            emit OwnershipNominationCleared();
        } else {
            emit OwnershipNominated(owner, newOwner);
        }
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "NOT_DESIGNATED_OWNER");
        _acceptOwnership(pendingOwner);
    }

    constructor(address _owner) {
        _acceptOwnership(_owner);
    }

    function _acceptOwnership(address newOwner) private {
        require(newOwner != address(0x0), "ZERO_OWNER_ADDRESS");
        delete pendingOwner;
        emit OwnershipAccepted(newOwner);
        owner = newOwner;
    }
}

enum TxSetType {
    Transaction,
    PayableTransaction,
    MultiTransaction,
    MultiPayableTransaction
}

abstract contract Executor {
    // The caller is the user that called the execTransaction on the Executor.
    event TxExecuted(address indexed caller, address indexed target, uint256 eth_value, bytes data);

    /**
      Modifier to all execute entries, allows extending contract to add pre-check and pre-process.
    */
    modifier allowedTx(TxSetType setType) {
        (bool allowed, string memory allowed_err) = isAllowed(setType);
        require(allowed, allowed_err);
        preExec(setType);
        _;
    }

    function preExec(TxSetType setType) internal virtual {}

    /**
      The allowedTx modifier reverts with the error message returned by this function.
      It's implemented by the extending contract.
    */
    function isAllowed(TxSetType setType) internal virtual returns (bool, string memory);

    function execTransaction(address target, bytes calldata data)
        external
        allowedTx(TxSetType.Transaction)
    {
        _exec(target, 0, data);
    }

    function execPayableTransaction(
        address target,
        uint256 eth_value,
        bytes calldata data
    ) external payable allowedTx(TxSetType.PayableTransaction) {
        _exec(target, eth_value, data);
    }

    function execMultiTransaction(address[] calldata targets, bytes[] calldata datas)
        external
        allowedTx(TxSetType.MultiTransaction)
    {
        require(targets.length == datas.length, "INPUT_LENGTH_MISMATCH");
        for (uint256 i = 0; i < datas.length; i++) {
            _exec(targets[i], 0, datas[i]);
        }
    }

    function execMultiPayableTransaction(
        address[] calldata targets,
        uint256[] calldata eth_values,
        bytes[] calldata datas
    ) external payable allowedTx(TxSetType.MultiPayableTransaction) {
        require(
            targets.length == eth_values.length && eth_values.length == datas.length,
            "INPUT_LENGTH_MISMATCH"
        );
        for (uint256 i = 0; i < datas.length; i++) {
            _exec(targets[i], eth_values[i], datas[i]);
        }
    }

    /**
      Internal common execution function.
      Note - eth_value can be used either from the msg.value or from pre-existing balance.
    */
    function _exec(
        address target,
        uint256 eth_value,
        bytes calldata data
    ) internal {
        // solium-disable-next-line security/no-call-value
        (bool success, bytes memory returnData) = target.call{value: eth_value}(data);
        require(success, string(returnData));
        emit TxExecuted(msg.sender, target, eth_value, data);
    }
}

contract DelayedExecutor is Executor, Owned {
    event TransactionRegistered(address target, bytes data, bytes32 txSetHash, uint256 enableTime);
    event PayableTransactionRegistered(
        address target,
        uint256 eth_value,
        bytes data,
        bytes32 txSetHash,
        uint256 enableTime
    );
    event MultiTransactionRegistered(
        address[] targets,
        bytes[] datas,
        bytes32 txSetHash,
        uint256 enableTime
    );
    event MultiPayableTransactionRegistered(
        address[] targets,
        uint256[] eth_values,
        bytes[] datas,
        bytes32 txSetHash,
        uint256 enableTime
    );

    // The delay (seconds) required between registration and execution.
    uint256 public immutable executionDelay;

    // Execution can be done only within `executionExpiration` seconds since active.
    uint256 public immutable executionExpiration;

    // A map from registered tx/multi-tx hash to eligible activation time.
    mapping(bytes32 => uint256) public txSetAllowedTime;

    constructor(
        address _owner,
        uint256 delay,
        uint256 expiration
    ) Owned(_owner) {
        require(delay <= MAX_DELAY, "DELAY_TOO_LONG");
        require(expiration >= MIN_EXPIRATION, "EXPIRATION_TOO_SHORT");
        require(expiration <= MAX_EXPIRATION, "EXPIRATION_TOO_LONG");
        executionDelay = delay;
        executionExpiration = expiration;
    }

    // Allowing contract to receive eth, to allow adding balance to it.
    // Useful to allow txs that need eth to use existing balance.
    receive() external payable {}

    // As a key we use the entire tx data, excluding the selector,
    // so that txKey(registerTransaction(...)) == txKey(execTransaction(...)).
    function txKey(TxSetType setType) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(setType, msg.data[4:]));
    }

    /**
      Reset the executed entry.
      This function is called by the executing functions in Executor.
    */
    function preExec(TxSetType setType) internal virtual override {
        txSetAllowedTime[txKey(setType)] = TX_EXECUTED;
    }

    function isAllowed(TxSetType setType) internal virtual override returns (bool, string memory) {
        uint256 _txtime = txSetAllowedTime[txKey(setType)];
        if (_txtime == 0) {
            return (false, "TX_UNKNOWN");
        }
        if (_txtime == TX_EXECUTED) {
            return (false, "TX_ALREADY_EXECUTED");
        }
        if (block.timestamp < _txtime) {
            return (false, "TX_NOT_ENABLED_YET");
        }
        if (block.timestamp > _txtime + executionExpiration) {
            return (false, "TX_EXPIRED");
        }
        if (msg.sender != owner) {
            return (false, "ONLY_OWNER");
        }
        return (true, "");
    }

    function registerTransaction(address target, bytes calldata data)
        external
        onlyOwner
        returns (bytes32)
    {
        bytes32 txSetHash = registerTxSet(TxSetType.Transaction);
        emit TransactionRegistered(target, data, txSetHash, txSetAllowedTime[txSetHash]);
        return txSetHash;
    }

    function registerPayableTransaction(
        address target,
        uint256 eth_value,
        bytes calldata data
    ) external onlyOwner returns (bytes32) {
        bytes32 txSetHash = registerTxSet(TxSetType.PayableTransaction);
        emit PayableTransactionRegistered(
            target,
            eth_value,
            data,
            txSetHash,
            txSetAllowedTime[txSetHash]
        );
        return txSetHash;
    }

    function registerMultiTransaction(address[] calldata targets, bytes[] calldata datas)
        external
        onlyOwner
        returns (bytes32)
    {
        bytes32 txSetHash = registerTxSet(TxSetType.MultiTransaction);
        emit MultiTransactionRegistered(targets, datas, txSetHash, txSetAllowedTime[txSetHash]);
        return txSetHash;
    }

    function registerMultiPayableTransaction(
        address[] calldata targets,
        uint256[] calldata eth_values,
        bytes[] calldata datas
    ) external onlyOwner returns (bytes32) {
        bytes32 txSetHash = registerTxSet(TxSetType.MultiPayableTransaction);
        emit MultiPayableTransactionRegistered(
            targets,
            eth_values,
            datas,
            txSetHash,
            txSetAllowedTime[txSetHash]
        );
        return txSetHash;
    }

    function registerTxSet(TxSetType setType) internal returns (bytes32) {
        bytes32 _key = txKey(setType);
        txSetAllowedTime[_key] = block.timestamp + executionDelay;
        return _key;
    }

    function removeTxSet(bytes32 txSetHash) external onlyOwner {
        txSetAllowedTime[txSetHash] = 0;
    }
}