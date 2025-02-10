// SPDX-License-Identifier: Unknown
pragma solidity 0.8.19;

library MetaProxy {
    bytes32 private constant PREFIX =
        hex"600b380380600b3d393df3363d3d373d3d3d3d60368038038091363936013d73";
    bytes13 private constant SUFFIX = hex"5af43d3d93803e603457fd5bf3";

    function bytecode(address _implementation, bytes memory _metadata)
        internal
        pure
        returns (bytes memory)
    {
        return
            abi.encodePacked(
                PREFIX,
                bytes20(_implementation),
                SUFFIX,
                _metadata,
                _metadata.length
            );
    }

    function metadata() internal pure returns (bytes memory) {
        bytes memory data;
        assembly {
            let posOfMetadataSize := sub(calldatasize(), 32)
            let size := calldataload(posOfMetadataSize)
            let dataPtr := sub(posOfMetadataSize, size)
            data := mload(64)
            // increment free memory pointer by metadata size + 32 bytes (length)
            mstore(64, add(data, add(size, 32)))
            mstore(data, size)
            let memPtr := add(data, 32)
            calldatacopy(memPtr, dataPtr, size)
        }
        return data;
    }
}

interface IInterchainSecurityModule {
    enum Types {
        UNUSED,
        ROUTING,
        AGGREGATION,
        LEGACY_MULTISIG,
        MERKLE_ROOT_MULTISIG,
        MESSAGE_ID_MULTISIG,
        NULL, // used with relayer carrying no metadata
        CCIP_READ
    }

    /**
     * @notice Returns an enum that represents the type of security model
     * encoded by this ISM.
     * @dev Relayers infer how to fetch and format metadata.
     */
    function moduleType() external view returns (uint8);

    /**
     * @notice Defines a security model responsible for verifying interchain
     * messages based on the provided metadata.
     * @param _metadata Off-chain metadata provided by a relayer, specific to
     * the security model encoded by the module (e.g. validator signatures)
     * @param _message Hyperlane encoded interchain message
     * @return True if the message was verified
     */
    function verify(bytes calldata _metadata, bytes calldata _message)
        external
        returns (bool);
}

interface IAggregationIsm is IInterchainSecurityModule {
    /**
     * @notice Returns the set of modules responsible for verifying _message
     * and the number of modules that must verify
     * @dev Can change based on the content of _message
     * @param _message Hyperlane formatted interchain message
     * @return modules The array of ISM addresses
     * @return threshold The number of modules needed to verify
     */
    function modulesAndThreshold(bytes calldata _message)
        external
        view
        returns (address[] memory modules, uint8 threshold);
}

library AggregationIsmMetadata {
    uint256 private constant RANGE_SIZE = 4;

    /**
     * @notice Returns whether or not metadata was provided for the ISM at
     * `_index`
     * @dev Callers must ensure _index is less than the number of metadatas
     * provided
     * @param _metadata Encoded Aggregation ISM metadata
     * @param _index The index of the ISM to check for metadata for
     * @return Whether or not metadata was provided for the ISM at `_index`
     */
    function hasMetadata(bytes calldata _metadata, uint8 _index)
        internal
        pure
        returns (bool)
    {
        (uint32 _start, ) = _metadataRange(_metadata, _index);
        return _start > 0;
    }

    /**
     * @notice Returns the metadata provided for the ISM at `_index`
     * @dev Callers must ensure _index is less than the number of metadatas
     * provided
     * @dev Callers must ensure `hasMetadata(_metadata, _index)`
     * @param _metadata Encoded Aggregation ISM metadata
     * @param _index The index of the ISM to return metadata for
     * @return The metadata provided for the ISM at `_index`
     */
    function metadataAt(bytes calldata _metadata, uint8 _index)
        internal
        pure
        returns (bytes calldata)
    {
        (uint32 _start, uint32 _end) = _metadataRange(_metadata, _index);
        return _metadata[_start:_end];
    }

    /**
     * @notice Returns the range of the metadata provided for the ISM at
     * `_index`, or zeroes if not provided
     * @dev Callers must ensure _index is less than the number of metadatas
     * provided
     * @param _metadata Encoded Aggregation ISM metadata
     * @param _index The index of the ISM to return metadata range for
     * @return The range of the metadata provided for the ISM at `_index`, or
     * zeroes if not provided
     */
    function _metadataRange(bytes calldata _metadata, uint8 _index)
        private
        pure
        returns (uint32, uint32)
    {
        uint256 _start = (uint32(_index) * RANGE_SIZE * 2);
        uint256 _mid = _start + RANGE_SIZE;
        uint256 _end = _mid + RANGE_SIZE;
        return (
            uint32(bytes4(_metadata[_start:_mid])),
            uint32(bytes4(_metadata[_mid:_end]))
        );
    }
}

abstract contract AbstractAggregationIsm is IAggregationIsm {
    // ============ Constants ============

    // solhint-disable-next-line const-name-snakecase
    uint8 public constant moduleType =
        uint8(IInterchainSecurityModule.Types.AGGREGATION);

    // ============ Virtual Functions ============
    // ======= OVERRIDE THESE TO IMPLEMENT =======

    /**
     * @notice Returns the set of ISMs responsible for verifying _message
     * and the number of ISMs that must verify
     * @dev Can change based on the content of _message
     * @param _message Hyperlane formatted interchain message
     * @return modules The array of ISM addresses
     * @return threshold The number of ISMs needed to verify
     */
    function modulesAndThreshold(bytes calldata _message)
        public
        view
        virtual
        returns (address[] memory, uint8);

    // ============ Public Functions ============

    /**
     * @notice Requires that m-of-n ISMs verify the provided interchain message.
     * @param _metadata ABI encoded module metadata (see AggregationIsmMetadata.sol)
     * @param _message Formatted Hyperlane message (see Message.sol).
     */
    function verify(bytes calldata _metadata, bytes calldata _message)
        public
        returns (bool)
    {
        (address[] memory _isms, uint8 _threshold) = modulesAndThreshold(
            _message
        );
        uint256 _count = _isms.length;
        for (uint8 i = 0; i < _count; i++) {
            if (!AggregationIsmMetadata.hasMetadata(_metadata, i)) continue;
            IInterchainSecurityModule _ism = IInterchainSecurityModule(
                _isms[i]
            );
            require(
                _ism.verify(
                    AggregationIsmMetadata.metadataAt(_metadata, i),
                    _message
                ),
                "!verify"
            );
            _threshold -= 1;
        }
        require(_threshold == 0, "!threshold");
        return true;
    }
}

contract StaticAggregationIsm is AbstractAggregationIsm {
    // ============ Public Functions ============

    /**
     * @notice Returns the set of ISMs responsible for verifying _message
     * and the number of ISMs that must verify
     * @dev Can change based on the content of _message
     * @return modules The array of ISM addresses
     * @return threshold The number of ISMs needed to verify
     */
    function modulesAndThreshold(bytes calldata)
        public
        view
        virtual
        override
        returns (address[] memory, uint8)
    {
        return abi.decode(MetaProxy.metadata(), (address[], uint8));
    }
}