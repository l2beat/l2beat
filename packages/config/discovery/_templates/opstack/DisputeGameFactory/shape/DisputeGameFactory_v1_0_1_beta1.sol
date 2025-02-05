// SPDX-License-Identifier: Unknown
pragma solidity 0.8.15;

library LibGameId {
    /// @notice Packs values into a 32 byte GameId type.
    /// @param _gameType The game type.
    /// @param _timestamp The timestamp of the game's creation.
    /// @param _gameProxy The game proxy address.
    /// @return gameId_ The packed GameId.
    function pack(
        GameType _gameType,
        Timestamp _timestamp,
        address _gameProxy
    )
        internal
        pure
        returns (GameId gameId_)
    {
        assembly {
            gameId_ := or(or(shl(224, _gameType), shl(160, _timestamp)), _gameProxy)
        }
    }

    /// @notice Unpacks values from a 32 byte GameId type.
    /// @param _gameId The packed GameId.
    /// @return gameType_ The game type.
    /// @return timestamp_ The timestamp of the game's creation.
    /// @return gameProxy_ The game proxy address.
    function unpack(GameId _gameId)
        internal
        pure
        returns (GameType gameType_, Timestamp timestamp_, address gameProxy_)
    {
        assembly {
            gameType_ := shr(224, _gameId)
            timestamp_ := and(shr(160, _gameId), 0xFFFFFFFFFFFFFFFF)
            gameProxy_ := and(_gameId, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
        }
    }
}

library LibClone {
    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                       CUSTOM ERRORS                        */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /// @dev Unable to deploy the clone.
    error DeploymentFailed();

    /// @dev The salt must start with either the zero address or `by`.
    error SaltDoesNotStartWith();

    /// @dev The ETH transfer has failed.
    error ETHTransferFailed();

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                  MINIMAL PROXY OPERATIONS                  */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /// @dev Deploys a clone of `implementation`.
    function clone(address implementation) internal returns (address instance) {
        instance = clone(0, implementation);
    }

    /// @dev Deploys a clone of `implementation`.
    function clone(uint256 value, address implementation) internal returns (address instance) {
        /// @solidity memory-safe-assembly
        assembly {
            /**
             * --------------------------------------------------------------------------+
             * CREATION (9 bytes)                                                        |
             * --------------------------------------------------------------------------|
             * Opcode     | Mnemonic          | Stack     | Memory                       |
             * --------------------------------------------------------------------------|
             * 60 runSize | PUSH1 runSize     | r         |                              |
             * 3d         | RETURNDATASIZE    | 0 r       |                              |
             * 81         | DUP2              | r 0 r     |                              |
             * 60 offset  | PUSH1 offset      | o r 0 r   |                              |
             * 3d         | RETURNDATASIZE    | 0 o r 0 r |                              |
             * 39         | CODECOPY          | 0 r       | [0..runSize): runtime code   |
             * f3         | RETURN            |           | [0..runSize): runtime code   |
             * --------------------------------------------------------------------------|
             * RUNTIME (44 bytes)                                                        |
             * --------------------------------------------------------------------------|
             * Opcode  | Mnemonic       | Stack                  | Memory                |
             * --------------------------------------------------------------------------|
             *                                                                           |
             * ::: keep some values in stack ::::::::::::::::::::::::::::::::::::::::::: |
             * 3d      | RETURNDATASIZE | 0                      |                       |
             * 3d      | RETURNDATASIZE | 0 0                    |                       |
             * 3d      | RETURNDATASIZE | 0 0 0                  |                       |
             * 3d      | RETURNDATASIZE | 0 0 0 0                |                       |
             *                                                                           |
             * ::: copy calldata to memory ::::::::::::::::::::::::::::::::::::::::::::: |
             * 36      | CALLDATASIZE   | cds 0 0 0 0            |                       |
             * 3d      | RETURNDATASIZE | 0 cds 0 0 0 0          |                       |
             * 3d      | RETURNDATASIZE | 0 0 cds 0 0 0 0        |                       |
             * 37      | CALLDATACOPY   | 0 0 0 0                | [0..cds): calldata    |
             *                                                                           |
             * ::: delegate call to the implementation contract :::::::::::::::::::::::: |
             * 36      | CALLDATASIZE   | cds 0 0 0 0            | [0..cds): calldata    |
             * 3d      | RETURNDATASIZE | 0 cds 0 0 0 0          | [0..cds): calldata    |
             * 73 addr | PUSH20 addr    | addr 0 cds 0 0 0 0     | [0..cds): calldata    |
             * 5a      | GAS            | gas addr 0 cds 0 0 0 0 | [0..cds): calldata    |
             * f4      | DELEGATECALL   | success 0 0            | [0..cds): calldata    |
             *                                                                           |
             * ::: copy return data to memory :::::::::::::::::::::::::::::::::::::::::: |
             * 3d      | RETURNDATASIZE | rds success 0 0        | [0..cds): calldata    |
             * 3d      | RETURNDATASIZE | rds rds success 0 0    | [0..cds): calldata    |
             * 93      | SWAP4          | 0 rds success 0 rds    | [0..cds): calldata    |
             * 80      | DUP1           | 0 0 rds success 0 rds  | [0..cds): calldata    |
             * 3e      | RETURNDATACOPY | success 0 rds          | [0..rds): returndata  |
             *                                                                           |
             * 60 0x2a | PUSH1 0x2a     | 0x2a success 0 rds     | [0..rds): returndata  |
             * 57      | JUMPI          | 0 rds                  | [0..rds): returndata  |
             *                                                                           |
             * ::: revert :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * fd      | REVERT         |                        | [0..rds): returndata  |
             *                                                                           |
             * ::: return :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 5b      | JUMPDEST       | 0 rds                  | [0..rds): returndata  |
             * f3      | RETURN         |                        | [0..rds): returndata  |
             * --------------------------------------------------------------------------+
             */
            mstore(0x21, 0x5af43d3d93803e602a57fd5bf3)
            mstore(0x14, implementation)
            mstore(0x00, 0x602c3d8160093d39f33d3d3d3d363d3d37363d73)
            instance := create(value, 0x0c, 0x35)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x21, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Deploys a deterministic clone of `implementation` with `salt`.
    function cloneDeterministic(address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        instance = cloneDeterministic(0, implementation, salt);
    }

    /// @dev Deploys a deterministic clone of `implementation` with `salt`.
    function cloneDeterministic(uint256 value, address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x21, 0x5af43d3d93803e602a57fd5bf3)
            mstore(0x14, implementation)
            mstore(0x00, 0x602c3d8160093d39f33d3d3d3d363d3d37363d73)
            instance := create2(value, 0x0c, 0x35, salt)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x21, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Returns the initialization code hash of the clone of `implementation`.
    /// Used for mining vanity addresses with create2crunch.
    function initCodeHash(address implementation) internal pure returns (bytes32 hash) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x21, 0x5af43d3d93803e602a57fd5bf3)
            mstore(0x14, implementation)
            mstore(0x00, 0x602c3d8160093d39f33d3d3d3d363d3d37363d73)
            hash := keccak256(0x0c, 0x35)
            mstore(0x21, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Returns the address of the deterministic clone of `implementation`,
    /// with `salt` by `deployer`.
    /// Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.
    function predictDeterministicAddress(address implementation, bytes32 salt, address deployer)
        internal
        pure
        returns (address predicted)
    {
        bytes32 hash = initCodeHash(implementation);
        predicted = predictDeterministicAddress(hash, salt, deployer);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*          MINIMAL PROXY OPERATIONS (PUSH0 VARIANT)          */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /// @dev Deploys a PUSH0 clone of `implementation`.
    function clone_PUSH0(address implementation) internal returns (address instance) {
        instance = clone_PUSH0(0, implementation);
    }

    /// @dev Deploys a PUSH0 clone of `implementation`.
    function clone_PUSH0(uint256 value, address implementation)
        internal
        returns (address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            /**
             * --------------------------------------------------------------------------+
             * CREATION (9 bytes)                                                        |
             * --------------------------------------------------------------------------|
             * Opcode     | Mnemonic          | Stack     | Memory                       |
             * --------------------------------------------------------------------------|
             * 60 runSize | PUSH1 runSize     | r         |                              |
             * 5f         | PUSH0             | 0 r       |                              |
             * 81         | DUP2              | r 0 r     |                              |
             * 60 offset  | PUSH1 offset      | o r 0 r   |                              |
             * 5f         | PUSH0             | 0 o r 0 r |                              |
             * 39         | CODECOPY          | 0 r       | [0..runSize): runtime code   |
             * f3         | RETURN            |           | [0..runSize): runtime code   |
             * --------------------------------------------------------------------------|
             * RUNTIME (45 bytes)                                                        |
             * --------------------------------------------------------------------------|
             * Opcode  | Mnemonic       | Stack                  | Memory                |
             * --------------------------------------------------------------------------|
             *                                                                           |
             * ::: keep some values in stack ::::::::::::::::::::::::::::::::::::::::::: |
             * 5f      | PUSH0          | 0                      |                       |
             * 5f      | PUSH0          | 0 0                    |                       |
             *                                                                           |
             * ::: copy calldata to memory ::::::::::::::::::::::::::::::::::::::::::::: |
             * 36      | CALLDATASIZE   | cds 0 0                |                       |
             * 5f      | PUSH0          | 0 cds 0 0              |                       |
             * 5f      | PUSH0          | 0 0 cds 0 0            |                       |
             * 37      | CALLDATACOPY   | 0 0                    | [0..cds): calldata    |
             *                                                                           |
             * ::: delegate call to the implementation contract :::::::::::::::::::::::: |
             * 36      | CALLDATASIZE   | cds 0 0                | [0..cds): calldata    |
             * 5f      | PUSH0          | 0 cds 0 0              | [0..cds): calldata    |
             * 73 addr | PUSH20 addr    | addr 0 cds 0 0         | [0..cds): calldata    |
             * 5a      | GAS            | gas addr 0 cds 0 0     | [0..cds): calldata    |
             * f4      | DELEGATECALL   | success                | [0..cds): calldata    |
             *                                                                           |
             * ::: copy return data to memory :::::::::::::::::::::::::::::::::::::::::: |
             * 3d      | RETURNDATASIZE | rds success            | [0..cds): calldata    |
             * 5f      | PUSH0          | 0 rds success          | [0..cds): calldata    |
             * 5f      | PUSH0          | 0 0 rds success        | [0..cds): calldata    |
             * 3e      | RETURNDATACOPY | success                | [0..rds): returndata  |
             *                                                                           |
             * 60 0x29 | PUSH1 0x29     | 0x29 success           | [0..rds): returndata  |
             * 57      | JUMPI          |                        | [0..rds): returndata  |
             *                                                                           |
             * ::: revert :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d      | RETURNDATASIZE | rds                    | [0..rds): returndata  |
             * 5f      | PUSH0          | 0 rds                  | [0..rds): returndata  |
             * fd      | REVERT         |                        | [0..rds): returndata  |
             *                                                                           |
             * ::: return :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 5b      | JUMPDEST       |                        | [0..rds): returndata  |
             * 3d      | RETURNDATASIZE | rds                    | [0..rds): returndata  |
             * 5f      | PUSH0          | 0 rds                  | [0..rds): returndata  |
             * f3      | RETURN         |                        | [0..rds): returndata  |
             * --------------------------------------------------------------------------+
             */
            mstore(0x24, 0x5af43d5f5f3e6029573d5ffd5b3d5ff3) // 16
            mstore(0x14, implementation) // 20
            mstore(0x00, 0x602d5f8160095f39f35f5f365f5f37365f73) // 9 + 9
            instance := create(value, 0x0e, 0x36)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x24, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Deploys a deterministic PUSH0 clone of `implementation` with `salt`.
    function cloneDeterministic_PUSH0(address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        instance = cloneDeterministic_PUSH0(0, implementation, salt);
    }

    /// @dev Deploys a deterministic PUSH0 clone of `implementation` with `salt`.
    function cloneDeterministic_PUSH0(uint256 value, address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x24, 0x5af43d5f5f3e6029573d5ffd5b3d5ff3) // 16
            mstore(0x14, implementation) // 20
            mstore(0x00, 0x602d5f8160095f39f35f5f365f5f37365f73) // 9 + 9
            instance := create2(value, 0x0e, 0x36, salt)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x24, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Returns the initialization code hash of the PUSH0 clone of `implementation`.
    /// Used for mining vanity addresses with create2crunch.
    function initCodeHash_PUSH0(address implementation) internal pure returns (bytes32 hash) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x24, 0x5af43d5f5f3e6029573d5ffd5b3d5ff3) // 16
            mstore(0x14, implementation) // 20
            mstore(0x00, 0x602d5f8160095f39f35f5f365f5f37365f73) // 9 + 9
            hash := keccak256(0x0e, 0x36)
            mstore(0x24, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Returns the address of the deterministic PUSH0 clone of `implementation`,
    /// with `salt` by `deployer`.
    /// Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.
    function predictDeterministicAddress_PUSH0(
        address implementation,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        bytes32 hash = initCodeHash_PUSH0(implementation);
        predicted = predictDeterministicAddress(hash, salt, deployer);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*           CLONES WITH IMMUTABLE ARGS OPERATIONS            */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // Note: This implementation of CWIA differs from the original implementation.
    // If the calldata is empty, it will emit a `ReceiveETH(uint256)` event and skip the `DELEGATECALL`.

    /// @dev Deploys a clone of `implementation` with immutable arguments encoded in `data`.
    function clone(address implementation, bytes memory data) internal returns (address instance) {
        instance = clone(0, implementation, data);
    }

    /// @dev Deploys a clone of `implementation` with immutable arguments encoded in `data`.
    function clone(uint256 value, address implementation, bytes memory data)
        internal
        returns (address instance)
    {
        assembly {
            // Compute the boundaries of the data and cache the memory slots around it.
            let mBefore3 := mload(sub(data, 0x60))
            let mBefore2 := mload(sub(data, 0x40))
            let mBefore1 := mload(sub(data, 0x20))
            let dataLength := mload(data)
            let dataEnd := add(add(data, 0x20), dataLength)
            let mAfter1 := mload(dataEnd)

            // +2 bytes for telling how much data there is appended to the call.
            let extraLength := add(dataLength, 2)
            // The `creationSize` is `extraLength + 108`
            // The `runSize` is `creationSize - 10`.

            /**
             * ---------------------------------------------------------------------------------------------------+
             * CREATION (10 bytes)                                                                                |
             * ---------------------------------------------------------------------------------------------------|
             * Opcode     | Mnemonic          | Stack     | Memory                                                |
             * ---------------------------------------------------------------------------------------------------|
             * 61 runSize | PUSH2 runSize     | r         |                                                       |
             * 3d         | RETURNDATASIZE    | 0 r       |                                                       |
             * 81         | DUP2              | r 0 r     |                                                       |
             * 60 offset  | PUSH1 offset      | o r 0 r   |                                                       |
             * 3d         | RETURNDATASIZE    | 0 o r 0 r |                                                       |
             * 39         | CODECOPY          | 0 r       | [0..runSize): runtime code                            |
             * f3         | RETURN            |           | [0..runSize): runtime code                            |
             * ---------------------------------------------------------------------------------------------------|
             * RUNTIME (98 bytes + extraLength)                                                                   |
             * ---------------------------------------------------------------------------------------------------|
             * Opcode   | Mnemonic       | Stack                    | Memory                                      |
             * ---------------------------------------------------------------------------------------------------|
             *                                                                                                    |
             * ::: if no calldata, emit event & return w/o `DELEGATECALL` ::::::::::::::::::::::::::::::::::::::: |
             * 36       | CALLDATASIZE   | cds                      |                                             |
             * 60 0x2c  | PUSH1 0x2c     | 0x2c cds                 |                                             |
             * 57       | JUMPI          |                          |                                             |
             * 34       | CALLVALUE      | cv                       |                                             |
             * 3d       | RETURNDATASIZE | 0 cv                     |                                             |
             * 52       | MSTORE         |                          | [0..0x20): callvalue                        |
             * 7f sig   | PUSH32 0x9e..  | sig                      | [0..0x20): callvalue                        |
             * 59       | MSIZE          | 0x20 sig                 | [0..0x20): callvalue                        |
             * 3d       | RETURNDATASIZE | 0 0x20 sig               | [0..0x20): callvalue                        |
             * a1       | LOG1           |                          | [0..0x20): callvalue                        |
             * 00       | STOP           |                          | [0..0x20): callvalue                        |
             * 5b       | JUMPDEST       |                          |                                             |
             *                                                                                                    |
             * ::: copy calldata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 36       | CALLDATASIZE   | cds                      |                                             |
             * 3d       | RETURNDATASIZE | 0 cds                    |                                             |
             * 3d       | RETURNDATASIZE | 0 0 cds                  |                                             |
             * 37       | CALLDATACOPY   |                          | [0..cds): calldata                          |
             *                                                                                                    |
             * ::: keep some values in stack :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d       | RETURNDATASIZE | 0                        | [0..cds): calldata                          |
             * 3d       | RETURNDATASIZE | 0 0                      | [0..cds): calldata                          |
             * 3d       | RETURNDATASIZE | 0 0 0                    | [0..cds): calldata                          |
             * 3d       | RETURNDATASIZE | 0 0 0 0                  | [0..cds): calldata                          |
             * 61 extra | PUSH2 extra    | e 0 0 0 0                | [0..cds): calldata                          |
             *                                                                                                    |
             * ::: copy extra data to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 80       | DUP1           | e e 0 0 0 0              | [0..cds): calldata                          |
             * 60 0x62  | PUSH1 0x62     | 0x62 e e 0 0 0 0         | [0..cds): calldata                          |
             * 36       | CALLDATASIZE   | cds 0x62 e e 0 0 0 0     | [0..cds): calldata                          |
             * 39       | CODECOPY       | e 0 0 0 0                | [0..cds): calldata, [cds..cds+e): extraData |
             *                                                                                                    |
             * ::: delegate call to the implementation contract ::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 36       | CALLDATASIZE   | cds e 0 0 0 0            | [0..cds): calldata, [cds..cds+e): extraData |
             * 01       | ADD            | cds+e 0 0 0 0            | [0..cds): calldata, [cds..cds+e): extraData |
             * 3d       | RETURNDATASIZE | 0 cds+e 0 0 0 0          | [0..cds): calldata, [cds..cds+e): extraData |
             * 73 addr  | PUSH20 addr    | addr 0 cds+e 0 0 0 0     | [0..cds): calldata, [cds..cds+e): extraData |
             * 5a       | GAS            | gas addr 0 cds+e 0 0 0 0 | [0..cds): calldata, [cds..cds+e): extraData |
             * f4       | DELEGATECALL   | success 0 0              | [0..cds): calldata, [cds..cds+e): extraData |
             *                                                                                                    |
             * ::: copy return data to memory ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d       | RETURNDATASIZE | rds success 0 0          | [0..cds): calldata, [cds..cds+e): extraData |
             * 3d       | RETURNDATASIZE | rds rds success 0 0      | [0..cds): calldata, [cds..cds+e): extraData |
             * 93       | SWAP4          | 0 rds success 0 rds      | [0..cds): calldata, [cds..cds+e): extraData |
             * 80       | DUP1           | 0 0 rds success 0 rds    | [0..cds): calldata, [cds..cds+e): extraData |
             * 3e       | RETURNDATACOPY | success 0 rds            | [0..rds): returndata                        |
             *                                                                                                    |
             * 60 0x60  | PUSH1 0x60     | 0x60 success 0 rds       | [0..rds): returndata                        |
             * 57       | JUMPI          | 0 rds                    | [0..rds): returndata                        |
             *                                                                                                    |
             * ::: revert ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * fd       | REVERT         |                          | [0..rds): returndata                        |
             *                                                                                                    |
             * ::: return ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 5b       | JUMPDEST       | 0 rds                    | [0..rds): returndata                        |
             * f3       | RETURN         |                          | [0..rds): returndata                        |
             * ---------------------------------------------------------------------------------------------------+
             */
            mstore(data, 0x5af43d3d93803e606057fd5bf3) // Write the bytecode before the data.
            mstore(sub(data, 0x0d), implementation) // Write the address of the implementation.
            // Write the rest of the bytecode.
            mstore(
                sub(data, 0x21),
                or(shl(0x48, extraLength), 0x593da1005b363d3d373d3d3d3d610000806062363936013d73)
            )
            // `keccak256("ReceiveETH(uint256)")`
            mstore(
                sub(data, 0x3a), 0x9e4ac34f21c619cefc926c8bd93b54bf5a39c7ab2127a895af1cc0691d7e3dff
            )
            mstore(
                // Do a out-of-gas revert if `extraLength` is too big. 0xffff - 0x62 + 0x01 = 0xff9e.
                // The actual EVM limit may be smaller and may change over time.
                sub(data, add(0x59, lt(extraLength, 0xff9e))),
                or(shl(0x78, add(extraLength, 0x62)), 0xfd6100003d81600a3d39f336602c57343d527f)
            )
            mstore(dataEnd, shl(0xf0, extraLength))

            instance := create(value, sub(data, 0x4c), add(extraLength, 0x6c))
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }

            // Restore the overwritten memory surrounding `data`.
            mstore(dataEnd, mAfter1)
            mstore(data, dataLength)
            mstore(sub(data, 0x20), mBefore1)
            mstore(sub(data, 0x40), mBefore2)
            mstore(sub(data, 0x60), mBefore3)
        }
    }

    /// @dev Deploys a deterministic clone of `implementation`
    /// with immutable arguments encoded in `data` and `salt`.
    function cloneDeterministic(address implementation, bytes memory data, bytes32 salt)
        internal
        returns (address instance)
    {
        instance = cloneDeterministic(0, implementation, data, salt);
    }

    /// @dev Deploys a deterministic clone of `implementation`
    /// with immutable arguments encoded in `data` and `salt`.
    function cloneDeterministic(
        uint256 value,
        address implementation,
        bytes memory data,
        bytes32 salt
    ) internal returns (address instance) {
        assembly {
            // Compute the boundaries of the data and cache the memory slots around it.
            let mBefore3 := mload(sub(data, 0x60))
            let mBefore2 := mload(sub(data, 0x40))
            let mBefore1 := mload(sub(data, 0x20))
            let dataLength := mload(data)
            let dataEnd := add(add(data, 0x20), dataLength)
            let mAfter1 := mload(dataEnd)

            // +2 bytes for telling how much data there is appended to the call.
            let extraLength := add(dataLength, 2)

            mstore(data, 0x5af43d3d93803e606057fd5bf3) // Write the bytecode before the data.
            mstore(sub(data, 0x0d), implementation) // Write the address of the implementation.
            // Write the rest of the bytecode.
            mstore(
                sub(data, 0x21),
                or(shl(0x48, extraLength), 0x593da1005b363d3d373d3d3d3d610000806062363936013d73)
            )
            // `keccak256("ReceiveETH(uint256)")`
            mstore(
                sub(data, 0x3a), 0x9e4ac34f21c619cefc926c8bd93b54bf5a39c7ab2127a895af1cc0691d7e3dff
            )
            mstore(
                // Do a out-of-gas revert if `extraLength` is too big. 0xffff - 0x62 + 0x01 = 0xff9e.
                // The actual EVM limit may be smaller and may change over time.
                sub(data, add(0x59, lt(extraLength, 0xff9e))),
                or(shl(0x78, add(extraLength, 0x62)), 0xfd6100003d81600a3d39f336602c57343d527f)
            )
            mstore(dataEnd, shl(0xf0, extraLength))

            instance := create2(value, sub(data, 0x4c), add(extraLength, 0x6c), salt)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }

            // Restore the overwritten memory surrounding `data`.
            mstore(dataEnd, mAfter1)
            mstore(data, dataLength)
            mstore(sub(data, 0x20), mBefore1)
            mstore(sub(data, 0x40), mBefore2)
            mstore(sub(data, 0x60), mBefore3)
        }
    }

    /// @dev Returns the initialization code hash of the clone of `implementation`
    /// using immutable arguments encoded in `data`.
    /// Used for mining vanity addresses with create2crunch.
    function initCodeHash(address implementation, bytes memory data)
        internal
        pure
        returns (bytes32 hash)
    {
        assembly {
            // Compute the boundaries of the data and cache the memory slots around it.
            let mBefore3 := mload(sub(data, 0x60))
            let mBefore2 := mload(sub(data, 0x40))
            let mBefore1 := mload(sub(data, 0x20))
            let dataLength := mload(data)
            let dataEnd := add(add(data, 0x20), dataLength)
            let mAfter1 := mload(dataEnd)

            // Do a out-of-gas revert if `dataLength` is too big. 0xffff - 0x02 - 0x62 = 0xff9b.
            // The actual EVM limit may be smaller and may change over time.
            returndatacopy(returndatasize(), returndatasize(), gt(dataLength, 0xff9b))

            // +2 bytes for telling how much data there is appended to the call.
            let extraLength := add(dataLength, 2)

            mstore(data, 0x5af43d3d93803e606057fd5bf3) // Write the bytecode before the data.
            mstore(sub(data, 0x0d), implementation) // Write the address of the implementation.
            // Write the rest of the bytecode.
            mstore(
                sub(data, 0x21),
                or(shl(0x48, extraLength), 0x593da1005b363d3d373d3d3d3d610000806062363936013d73)
            )
            // `keccak256("ReceiveETH(uint256)")`
            mstore(
                sub(data, 0x3a), 0x9e4ac34f21c619cefc926c8bd93b54bf5a39c7ab2127a895af1cc0691d7e3dff
            )
            mstore(
                sub(data, 0x5a),
                or(shl(0x78, add(extraLength, 0x62)), 0x6100003d81600a3d39f336602c57343d527f)
            )
            mstore(dataEnd, shl(0xf0, extraLength))

            hash := keccak256(sub(data, 0x4c), add(extraLength, 0x6c))

            // Restore the overwritten memory surrounding `data`.
            mstore(dataEnd, mAfter1)
            mstore(data, dataLength)
            mstore(sub(data, 0x20), mBefore1)
            mstore(sub(data, 0x40), mBefore2)
            mstore(sub(data, 0x60), mBefore3)
        }
    }

    /// @dev Returns the address of the deterministic clone of
    /// `implementation` using immutable arguments encoded in `data`, with `salt`, by `deployer`.
    /// Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.
    function predictDeterministicAddress(
        address implementation,
        bytes memory data,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        bytes32 hash = initCodeHash(implementation, data);
        predicted = predictDeterministicAddress(hash, salt, deployer);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*              MINIMAL ERC1967 PROXY OPERATIONS              */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    // Note: The ERC1967 proxy here is intended to be upgraded with UUPS.
    // This is NOT the same as ERC1967Factory's transparent proxy, which includes admin logic.

    /// @dev Deploys a minimal ERC1967 proxy with `implementation`.
    function deployERC1967(address implementation) internal returns (address instance) {
        instance = deployERC1967(0, implementation);
    }

    /// @dev Deploys a minimal ERC1967 proxy with `implementation`.
    function deployERC1967(uint256 value, address implementation)
        internal
        returns (address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            /**
             * ---------------------------------------------------------------------------------+
             * CREATION (34 bytes)                                                              |
             * ---------------------------------------------------------------------------------|
             * Opcode     | Mnemonic       | Stack            | Memory                          |
             * ---------------------------------------------------------------------------------|
             * 60 runSize | PUSH1 runSize  | r                |                                 |
             * 3d         | RETURNDATASIZE | 0 r              |                                 |
             * 81         | DUP2           | r 0 r            |                                 |
             * 60 offset  | PUSH1 offset   | o r 0 r          |                                 |
             * 3d         | RETURNDATASIZE | 0 o r 0 r        |                                 |
             * 39         | CODECOPY       | 0 r              | [0..runSize): runtime code      |
             * 73 impl    | PUSH20 impl    | impl 0 r         | [0..runSize): runtime code      |
             * 60 slotPos | PUSH1 slotPos  | slotPos impl 0 r | [0..runSize): runtime code      |
             * 51         | MLOAD          | slot impl 0 r    | [0..runSize): runtime code      |
             * 55         | SSTORE         | 0 r              | [0..runSize): runtime code      |
             * f3         | RETURN         |                  | [0..runSize): runtime code      |
             * ---------------------------------------------------------------------------------|
             * RUNTIME (62 bytes)                                                               |
             * ---------------------------------------------------------------------------------|
             * Opcode     | Mnemonic       | Stack            | Memory                          |
             * ---------------------------------------------------------------------------------|
             *                                                                                  |
             * ::: copy calldata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 36         | CALLDATASIZE   | cds              |                                 |
             * 3d         | RETURNDATASIZE | 0 cds            |                                 |
             * 3d         | RETURNDATASIZE | 0 0 cds          |                                 |
             * 37         | CALLDATACOPY   |                  | [0..calldatasize): calldata     |
             *                                                                                  |
             * ::: delegatecall to implementation ::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d         | RETURNDATASIZE | 0                |                                 |
             * 3d         | RETURNDATASIZE | 0 0              |                                 |
             * 36         | CALLDATASIZE   | cds 0 0          | [0..calldatasize): calldata     |
             * 3d         | RETURNDATASIZE | 0 cds 0 0        | [0..calldatasize): calldata     |
             * 7f slot    | PUSH32 slot    | s 0 cds 0 0      | [0..calldatasize): calldata     |
             * 54         | SLOAD          | i 0 cds 0 0      | [0..calldatasize): calldata     |
             * 5a         | GAS            | g i 0 cds 0 0    | [0..calldatasize): calldata     |
             * f4         | DELEGATECALL   | succ             | [0..calldatasize): calldata     |
             *                                                                                  |
             * ::: copy returndata to memory :::::::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d         | RETURNDATASIZE | rds succ         | [0..calldatasize): calldata     |
             * 60 0x00    | PUSH1 0x00     | 0 rds succ       | [0..calldatasize): calldata     |
             * 80         | DUP1           | 0 0 rds succ     | [0..calldatasize): calldata     |
             * 3e         | RETURNDATACOPY | succ             | [0..returndatasize): returndata |
             *                                                                                  |
             * ::: branch on delegatecall status :::::::::::::::::::::::::::::::::::::::::::::: |
             * 60 0x38    | PUSH1 0x38     | dest succ        | [0..returndatasize): returndata |
             * 57         | JUMPI          |                  | [0..returndatasize): returndata |
             *                                                                                  |
             * ::: delegatecall failed, revert :::::::::::::::::::::::::::::::::::::::::::::::: |
             * 3d         | RETURNDATASIZE | rds              | [0..returndatasize): returndata |
             * 60 0x00    | PUSH1 0x00     | 0 rds            | [0..returndatasize): returndata |
             * fd         | REVERT         |                  | [0..returndatasize): returndata |
             *                                                                                  |
             * ::: delegatecall succeeded, return ::::::::::::::::::::::::::::::::::::::::::::: |
             * 5b         | JUMPDEST       |                  | [0..returndatasize): returndata |
             * 3d         | RETURNDATASIZE | rds              | [0..returndatasize): returndata |
             * 60 0x00    | PUSH1 0x00     | 0 rds            | [0..returndatasize): returndata |
             * f3         | RETURN         |                  | [0..returndatasize): returndata |
             * ---------------------------------------------------------------------------------+
             */
            let m := mload(0x40) // Cache the free memory pointer.
            mstore(0x60, 0xcc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3)
            mstore(0x40, 0x5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076)
            mstore(0x20, 0x6009)
            mstore(0x1e, implementation)
            mstore(0x0a, 0x603d3d8160223d3973)
            instance := create(value, 0x21, 0x5f)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x40, m) // Restore the free memory pointer.
            mstore(0x60, 0) // Restore the zero slot.
        }
    }

    /// @dev Deploys a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
    function deployDeterministicERC1967(address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        instance = deployDeterministicERC1967(0, implementation, salt);
    }

    /// @dev Deploys a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
    function deployDeterministicERC1967(uint256 value, address implementation, bytes32 salt)
        internal
        returns (address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            let m := mload(0x40) // Cache the free memory pointer.
            mstore(0x60, 0xcc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3)
            mstore(0x40, 0x5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076)
            mstore(0x20, 0x6009)
            mstore(0x1e, implementation)
            mstore(0x0a, 0x603d3d8160223d3973)
            instance := create2(value, 0x21, 0x5f, salt)
            if iszero(instance) {
                mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                revert(0x1c, 0x04)
            }
            mstore(0x40, m) // Restore the free memory pointer.
            mstore(0x60, 0) // Restore the zero slot.
        }
    }

    /// @dev Creates a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
    /// Note: This method is intended for use in ERC4337 factories,
    /// which are expected to NOT revert if the proxy is already deployed.
    function createDeterministicERC1967(address implementation, bytes32 salt)
        internal
        returns (bool alreadyDeployed, address instance)
    {
        return createDeterministicERC1967(0, implementation, salt);
    }

    /// @dev Creates a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
    /// Note: This method is intended for use in ERC4337 factories,
    /// which are expected to NOT revert if the proxy is already deployed.
    function createDeterministicERC1967(uint256 value, address implementation, bytes32 salt)
        internal
        returns (bool alreadyDeployed, address instance)
    {
        /// @solidity memory-safe-assembly
        assembly {
            let m := mload(0x40) // Cache the free memory pointer.
            mstore(0x60, 0xcc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3)
            mstore(0x40, 0x5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076)
            mstore(0x20, 0x6009)
            mstore(0x1e, implementation)
            mstore(0x0a, 0x603d3d8160223d3973)
            // Compute and store the bytecode hash.
            mstore(add(m, 0x35), keccak256(0x21, 0x5f))
            mstore(m, shl(88, address()))
            mstore8(m, 0xff) // Write the prefix.
            mstore(add(m, 0x15), salt)
            instance := keccak256(m, 0x55)
            for {} 1 {} {
                if iszero(extcodesize(instance)) {
                    instance := create2(value, 0x21, 0x5f, salt)
                    if iszero(instance) {
                        mstore(0x00, 0x30116425) // `DeploymentFailed()`.
                        revert(0x1c, 0x04)
                    }
                    break
                }
                alreadyDeployed := 1
                if iszero(value) { break }
                if iszero(call(gas(), instance, value, codesize(), 0x00, codesize(), 0x00)) {
                    mstore(0x00, 0xb12d13eb) // `ETHTransferFailed()`.
                    revert(0x1c, 0x04)
                }
                break
            }
            mstore(0x40, m) // Restore the free memory pointer.
            mstore(0x60, 0) // Restore the zero slot.
        }
    }

    /// @dev Returns the initialization code hash of the clone of `implementation`
    /// using immutable arguments encoded in `data`.
    /// Used for mining vanity addresses with create2crunch.
    function initCodeHashERC1967(address implementation) internal pure returns (bytes32 hash) {
        /// @solidity memory-safe-assembly
        assembly {
            let m := mload(0x40) // Cache the free memory pointer.
            mstore(0x60, 0xcc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3)
            mstore(0x40, 0x5155f3363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076)
            mstore(0x20, 0x6009)
            mstore(0x1e, implementation)
            mstore(0x0a, 0x603d3d8160223d3973)
            hash := keccak256(0x21, 0x5f)
            mstore(0x40, m) // Restore the free memory pointer.
            mstore(0x60, 0) // Restore the zero slot.
        }
    }

    /// @dev Returns the address of the deterministic clone of
    /// `implementation` using immutable arguments encoded in `data`, with `salt`, by `deployer`.
    /// Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.
    function predictDeterministicAddressERC1967(
        address implementation,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        bytes32 hash = initCodeHashERC1967(implementation);
        predicted = predictDeterministicAddress(hash, salt, deployer);
    }

    /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
    /*                      OTHER OPERATIONS                      */
    /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

    /// @dev Returns the address when a contract with initialization code hash,
    /// `hash`, is deployed with `salt`, by `deployer`.
    /// Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.
    function predictDeterministicAddress(bytes32 hash, bytes32 salt, address deployer)
        internal
        pure
        returns (address predicted)
    {
        /// @solidity memory-safe-assembly
        assembly {
            // Compute and store the bytecode hash.
            mstore8(0x00, 0xff) // Write the prefix.
            mstore(0x35, hash)
            mstore(0x01, shl(96, deployer))
            mstore(0x15, salt)
            predicted := keccak256(0x00, 0x55)
            mstore(0x35, 0) // Restore the overwritten part of the free memory pointer.
        }
    }

    /// @dev Requires that `salt` starts with either the zero address or `by`.
    function checkStartsWith(bytes32 salt, address by) internal pure {
        /// @solidity memory-safe-assembly
        assembly {
            // If the salt does not start with the zero address or `by`.
            if iszero(or(iszero(shr(96, salt)), eq(shr(96, shl(96, by)), shr(96, salt)))) {
                mstore(0x00, 0x0c4549ef) // `SaltDoesNotStartWith()`.
                revert(0x1c, 0x04)
            }
        }
    }
}

interface ISemver {
    /// @notice Getter for the semantic version of the contract. This is not
    ///         meant to be used onchain but instead meant to be used by offchain
    ///         tooling.
    /// @return Semver contract version as a string.
    function version() external view returns (string memory);
}

type GameType is uint32;

type Claim is bytes32;

type GameId is bytes32;

type Timestamp is uint64;

type Hash is bytes32;

interface IDisputeGameFactory {
    /// @notice Emitted when a new dispute game is created
    /// @param disputeProxy The address of the dispute game proxy
    /// @param gameType The type of the dispute game proxy's implementation
    /// @param rootClaim The root claim of the dispute game
    event DisputeGameCreated(address indexed disputeProxy, GameType indexed gameType, Claim indexed rootClaim);

    /// @notice Emitted when a new game implementation added to the factory
    /// @param impl The implementation contract for the given `GameType`.
    /// @param gameType The type of the DisputeGame.
    event ImplementationSet(address indexed impl, GameType indexed gameType);

    /// @notice Emitted when a game type's initialization bond is updated
    /// @param gameType The type of the DisputeGame.
    /// @param newBond The new bond (in wei) for initializing the game type.
    event InitBondUpdated(GameType indexed gameType, uint256 indexed newBond);

    /// @notice Information about a dispute game found in a `findLatestGames` search.
    struct GameSearchResult {
        uint256 index;
        GameId metadata;
        Timestamp timestamp;
        Claim rootClaim;
        bytes extraData;
    }

    /// @notice The total number of dispute games created by this factory.
    /// @return gameCount_ The total number of dispute games created by this factory.
    function gameCount() external view returns (uint256 gameCount_);

    /// @notice `games` queries an internal mapping that maps the hash of
    ///         `gameType ++ rootClaim ++ extraData` to the deployed `DisputeGame` clone.
    /// @dev `++` equates to concatenation.
    /// @param _gameType The type of the DisputeGame - used to decide the proxy implementation
    /// @param _rootClaim The root claim of the DisputeGame.
    /// @param _extraData Any extra data that should be provided to the created dispute game.
    /// @return proxy_ The clone of the `DisputeGame` created with the given parameters.
    ///         Returns `address(0)` if nonexistent.
    /// @return timestamp_ The timestamp of the creation of the dispute game.
    function games(
        GameType _gameType,
        Claim _rootClaim,
        bytes calldata _extraData
    )
        external
        view
        returns (IDisputeGame proxy_, Timestamp timestamp_);

    /// @notice `gameAtIndex` returns the dispute game contract address and its creation timestamp
    ///          at the given index. Each created dispute game increments the underlying index.
    /// @param _index The index of the dispute game.
    /// @return gameType_ The type of the DisputeGame - used to decide the proxy implementation.
    /// @return timestamp_ The timestamp of the creation of the dispute game.
    /// @return proxy_ The clone of the `DisputeGame` created with the given parameters.
    ///         Returns `address(0)` if nonexistent.
    function gameAtIndex(uint256 _index)
        external
        view
        returns (GameType gameType_, Timestamp timestamp_, IDisputeGame proxy_);

    /// @notice `gameImpls` is a mapping that maps `GameType`s to their respective
    ///         `IDisputeGame` implementations.
    /// @param _gameType The type of the dispute game.
    /// @return impl_ The address of the implementation of the game type.
    ///         Will be cloned on creation of a new dispute game with the given `gameType`.
    function gameImpls(GameType _gameType) external view returns (IDisputeGame impl_);

    /// @notice Returns the required bonds for initializing a dispute game of the given type.
    /// @param _gameType The type of the dispute game.
    /// @return bond_ The required bond for initializing a dispute game of the given type.
    function initBonds(GameType _gameType) external view returns (uint256 bond_);

    /// @notice Creates a new DisputeGame proxy contract.
    /// @param _gameType The type of the DisputeGame - used to decide the proxy implementation.
    /// @param _rootClaim The root claim of the DisputeGame.
    /// @param _extraData Any extra data that should be provided to the created dispute game.
    /// @return proxy_ The address of the created DisputeGame proxy.
    function create(
        GameType _gameType,
        Claim _rootClaim,
        bytes calldata _extraData
    )
        external
        payable
        returns (IDisputeGame proxy_);

    /// @notice Sets the implementation contract for a specific `GameType`.
    /// @dev May only be called by the `owner`.
    /// @param _gameType The type of the DisputeGame.
    /// @param _impl The implementation contract for the given `GameType`.
    function setImplementation(GameType _gameType, IDisputeGame _impl) external;

    /// @notice Sets the bond (in wei) for initializing a game type.
    /// @dev May only be called by the `owner`.
    /// @param _gameType The type of the DisputeGame.
    /// @param _initBond The bond (in wei) for initializing a game type.
    function setInitBond(GameType _gameType, uint256 _initBond) external;

    /// @notice Returns a unique identifier for the given dispute game parameters.
    /// @dev Hashes the concatenation of `gameType . rootClaim . extraData`
    ///      without expanding memory.
    /// @param _gameType The type of the DisputeGame.
    /// @param _rootClaim The root claim of the DisputeGame.
    /// @param _extraData Any extra data that should be provided to the created dispute game.
    /// @return uuid_ The unique identifier for the given dispute game parameters.
    function getGameUUID(
        GameType _gameType,
        Claim _rootClaim,
        bytes memory _extraData
    )
        external
        pure
        returns (Hash uuid_);

    /// @notice Finds the `_n` most recent `GameId`'s of type `_gameType` starting at `_start`. If there are less than
    ///         `_n` games of type `_gameType` starting at `_start`, then the returned array will be shorter than `_n`.
    /// @param _gameType The type of game to find.
    /// @param _start The index to start the reverse search from.
    /// @param _n The number of games to find.
    function findLatestGames(
        GameType _gameType,
        uint256 _start,
        uint256 _n
    )
        external
        view
        returns (GameSearchResult[] memory games_);
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
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
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
        return functionCall(target, data, "Address: low-level call failed");
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
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
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
        require(isContract(target), "Address: call to non-contract");

        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResult(success, returndata, errorMessage);
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
        require(isContract(target), "Address: static call to non-contract");

        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResult(success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verifies that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason using the provided one.
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
     * `onlyInitializing` functions can be used to initialize parent contracts. Equivalent to `reinitializer(1)`.
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
     * `initializer` is equivalent to `reinitializer(1)`, so a reinitializer may be used after the original
     * initialization step. This is essential to configure modules that are added through upgrades and that require
     * initialization.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
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
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
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
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
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

contract DisputeGameFactory is OwnableUpgradeable, IDisputeGameFactory, ISemver {
    /// @dev Allows for the creation of clone proxies with immutable arguments.
    using LibClone for address;

    /// @notice Semantic version.
    /// @custom:semver 1.0.1-beta.1
    string public constant version = "1.0.1-beta.1";

    /// @inheritdoc IDisputeGameFactory
    mapping(GameType => IDisputeGame) public gameImpls;

    /// @inheritdoc IDisputeGameFactory
    mapping(GameType => uint256) public initBonds;

    /// @notice Mapping of a hash of `gameType || rootClaim || extraData` to the deployed `IDisputeGame` clone (where
    //          `||` denotes concatenation).
    mapping(Hash => GameId) internal _disputeGames;

    /// @notice An append-only array of disputeGames that have been created. Used by offchain game solvers to
    ///         efficiently track dispute games.
    GameId[] internal _disputeGameList;

    /// @notice Constructs a new DisputeGameFactory contract.
    constructor() OwnableUpgradeable() {
        initialize(address(0));
    }

    /// @notice Initializes the contract.
    /// @param _owner The owner of the contract.
    function initialize(address _owner) public initializer {
        __Ownable_init();
        _transferOwnership(_owner);
    }

    /// @inheritdoc IDisputeGameFactory
    function gameCount() external view returns (uint256 gameCount_) {
        gameCount_ = _disputeGameList.length;
    }

    /// @inheritdoc IDisputeGameFactory
    function games(
        GameType _gameType,
        Claim _rootClaim,
        bytes calldata _extraData
    )
        external
        view
        returns (IDisputeGame proxy_, Timestamp timestamp_)
    {
        Hash uuid = getGameUUID(_gameType, _rootClaim, _extraData);
        (, Timestamp timestamp, address proxy) = _disputeGames[uuid].unpack();
        (proxy_, timestamp_) = (IDisputeGame(proxy), timestamp);
    }

    /// @inheritdoc IDisputeGameFactory
    function gameAtIndex(uint256 _index)
        external
        view
        returns (GameType gameType_, Timestamp timestamp_, IDisputeGame proxy_)
    {
        (GameType gameType, Timestamp timestamp, address proxy) = _disputeGameList[_index].unpack();
        (gameType_, timestamp_, proxy_) = (gameType, timestamp, IDisputeGame(proxy));
    }

    /// @inheritdoc IDisputeGameFactory
    function create(
        GameType _gameType,
        Claim _rootClaim,
        bytes calldata _extraData
    )
        external
        payable
        returns (IDisputeGame proxy_)
    {
        // Grab the implementation contract for the given `GameType`.
        IDisputeGame impl = gameImpls[_gameType];

        // If there is no implementation to clone for the given `GameType`, revert.
        if (address(impl) == address(0)) revert NoImplementation(_gameType);

        // If the required initialization bond is not met, revert.
        if (msg.value != initBonds[_gameType]) revert IncorrectBondAmount();

        // Get the hash of the parent block.
        bytes32 parentHash = blockhash(block.number - 1);

        // Clone the implementation contract and initialize it with the given parameters.
        //
        // CWIA Calldata Layout:
        // ┌──────────────┬────────────────────────────────────┐
        // │    Bytes     │            Description             │
        // ├──────────────┼────────────────────────────────────┤
        // │ [0, 20)      │ Game creator address               │
        // │ [20, 52)     │ Root claim                         │
        // │ [52, 84)     │ Parent block hash at creation time │
        // │ [84, 84 + n) │ Extra data (opaque)                │
        // └──────────────┴────────────────────────────────────┘
        proxy_ = IDisputeGame(address(impl).clone(abi.encodePacked(msg.sender, _rootClaim, parentHash, _extraData)));
        proxy_.initialize{ value: msg.value }();

        // Compute the unique identifier for the dispute game.
        Hash uuid = getGameUUID(_gameType, _rootClaim, _extraData);

        // If a dispute game with the same UUID already exists, revert.
        if (GameId.unwrap(_disputeGames[uuid]) != bytes32(0)) revert GameAlreadyExists(uuid);

        // Pack the game ID.
        GameId id = LibGameId.pack(_gameType, Timestamp.wrap(uint64(block.timestamp)), address(proxy_));

        // Store the dispute game id in the mapping & emit the `DisputeGameCreated` event.
        _disputeGames[uuid] = id;
        _disputeGameList.push(id);
        emit DisputeGameCreated(address(proxy_), _gameType, _rootClaim);
    }

    /// @inheritdoc IDisputeGameFactory
    function getGameUUID(
        GameType _gameType,
        Claim _rootClaim,
        bytes calldata _extraData
    )
        public
        pure
        returns (Hash uuid_)
    {
        uuid_ = Hash.wrap(keccak256(abi.encode(_gameType, _rootClaim, _extraData)));
    }

    /// @inheritdoc IDisputeGameFactory
    function findLatestGames(
        GameType _gameType,
        uint256 _start,
        uint256 _n
    )
        external
        view
        returns (GameSearchResult[] memory games_)
    {
        // If the `_start` index is greater than or equal to the game array length or `_n == 0`, return an empty array.
        if (_start >= _disputeGameList.length || _n == 0) return games_;

        // Allocate enough memory for the full array, but start the array's length at `0`. We may not use all of the
        // memory allocated, but we don't know ahead of time the final size of the array.
        assembly {
            games_ := mload(0x40)
            mstore(0x40, add(games_, add(0x20, shl(0x05, _n))))
        }

        // Perform a reverse linear search for the `_n` most recent games of type `_gameType`.
        for (uint256 i = _start; i >= 0 && i <= _start;) {
            GameId id = _disputeGameList[i];
            (GameType gameType, Timestamp timestamp, address proxy) = id.unpack();

            if (gameType.raw() == _gameType.raw()) {
                // Increase the size of the `games_` array by 1.
                // SAFETY: We can safely lazily allocate memory here because we pre-allocated enough memory for the max
                //         possible size of the array.
                assembly {
                    mstore(games_, add(mload(games_), 0x01))
                }

                bytes memory extraData = IDisputeGame(proxy).extraData();
                Claim rootClaim = IDisputeGame(proxy).rootClaim();
                games_[games_.length - 1] = GameSearchResult({
                    index: i,
                    metadata: id,
                    timestamp: timestamp,
                    rootClaim: rootClaim,
                    extraData: extraData
                });
                if (games_.length >= _n) break;
            }

            unchecked {
                i--;
            }
        }
    }

    /// @inheritdoc IDisputeGameFactory
    function setImplementation(GameType _gameType, IDisputeGame _impl) external onlyOwner {
        gameImpls[_gameType] = _impl;
        emit ImplementationSet(address(_impl), _gameType);
    }

    /// @inheritdoc IDisputeGameFactory
    function setInitBond(GameType _gameType, uint256 _initBond) external onlyOwner {
        initBonds[_gameType] = _initBond;
        emit InitBondUpdated(_gameType, _initBond);
    }
}