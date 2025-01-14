// SPDX-License-Identifier: Unknown
pragma solidity 0.8.26;

function getStartingBit(uint256 numLeaves) pure returns (uint256 startingBit) {
    // Determine height of the left subtree. This is the maximum path length, so all paths start at this offset from the right-most bit
    startingBit = 0;
    while ((1 << startingBit) < numLeaves) {
        startingBit += 1;
    }
    return Constants.MAX_HEIGHT - startingBit;
}

function pathLengthFromKey(uint256 key, uint256 numLeaves) pure returns (uint256 pathLength) {
    if (numLeaves <= 1) {
        // if the number of leaves of the tree is 1 or 0, the path always is 0.
        return 0;
    }
    // Get the height of the left subtree. This is equal to the offset of the starting bit of the path
    pathLength = Constants.MAX_HEIGHT - getStartingBit(numLeaves);

    // Determine the number of leaves in the left subtree
    uint256 numLeavesLeftSubTree = (1 << (pathLength - 1));

    // If leaf is in left subtree, path length is full height of left subtree
    if (key <= numLeavesLeftSubTree - 1) {
        return pathLength;
    }
    // If left sub tree has only one leaf but key is not there, path has one additional step
    else if (numLeavesLeftSubTree == 1) {
        return 1;
    }
    // Otherwise, add 1 to height and recurse into right subtree
    else {
        return 1 + pathLengthFromKey(key - numLeavesLeftSubTree, numLeaves - numLeavesLeftSubTree);
    }
}

function leafDigest(bytes memory data) pure returns (bytes32 digest) {
    digest = sha256(abi.encodePacked(Constants.LEAF_PREFIX, data));
}

struct BinaryMerkleMultiproof {
    // List of side nodes to verify and calculate tree.
    bytes32[] sideNodes;
    // The (included) beginning key of the leaves to verify.
    uint256 beginKey;
    // The (excluded) ending key of the leaves to verify.
    uint256 endKey;
}

function _bitsTrailingZeroes(uint256 x) pure returns (uint256) {
    uint256 mask = 1;
    uint256 count = 0;

    while (x != 0 && mask & x == 0) {
        count++;
        x >>= 1;
    }

    return count;
}

function _nextSubtreeSize(uint256 begin, uint256 end) pure returns (uint256) {
    uint256 ideal = _bitsTrailingZeroes(begin);
    uint256 max = _bitsLen(end - begin) - 1;
    if (ideal > max) {
        return 1 << max;
    }
    return 1 << ideal;
}

function _bitsLen(uint256 x) pure returns (uint256) {
    uint256 count = 0;

    while (x != 0) {
        count++;
        x >>= 1;
    }

    return count;
}

function _getSplitPoint(uint256 x) pure returns (uint256) {
    // Note: since `x` is always an unsigned int * 2, the only way for this
    // to be violated is if the input == 0. Since the input is the end
    // index exclusive, an input of 0 is guaranteed to be invalid (it would
    // be a proof of inclusion of nothing, which is vacuous).
    require(x >= 1);

    uint256 bitLen = _bitsLen(x);
    uint256 k = 1 << (bitLen - 1);
    if (k == x) {
        k >>= 1;
    }
    return k;
}

library Constants {
    ///////////////
    // Constants //
    ///////////////

    /// @dev Maximum tree height
    uint256 internal constant MAX_HEIGHT = 256;

    /// @dev The prefixes of leaves and nodes
    bytes1 internal constant LEAF_PREFIX = 0x00;
    bytes1 internal constant NODE_PREFIX = 0x01;
}

function nodeDigest(bytes32 left, bytes32 right) pure returns (bytes32 digest) {
    digest = sha256(abi.encodePacked(Constants.NODE_PREFIX, left, right));
}

library BinaryMerkleTree {
    /////////////////
    // Error codes //
    /////////////////

    enum ErrorCodes {
        NoError,
        /// @notice The provided side nodes count is invalid for the proof.
        InvalidNumberOfSideNodes,
        /// @notice The provided proof key is not part of the tree.
        KeyNotInTree,
        /// @notice Invalid number of leaves in proof.
        InvalidNumberOfLeavesInProof,
        /// @notice The proof contains unexpected side nodes.
        UnexpectedInnerHashes,
        /// @notice The proof verification expected at least one inner hash.
        ExpectedAtLeastOneInnerHash
    }

    ///////////////
    // Functions //
    ///////////////

    /// @notice Verify if element exists in Merkle tree, given data, proof, and root.
    /// @param root The root of the tree in which verify the given leaf.
    /// @param proof Binary Merkle proof for the leaf.
    /// @param data The data of the leaf to verify.
    /// @return `true` is proof is valid, `false` otherwise.
    /// @dev proof.numLeaves is necessary to determine height of subtree containing the data to prove.
    function verify(bytes32 root, BinaryMerkleProof memory proof, bytes memory data)
        internal
        pure
        returns (bool, ErrorCodes)
    {
        // Check proof is correct length for the key it is proving
        if (proof.numLeaves <= 1) {
            if (proof.sideNodes.length != 0) {
                return (false, ErrorCodes.InvalidNumberOfSideNodes);
            }
        } else if (proof.sideNodes.length != pathLengthFromKey(proof.key, proof.numLeaves)) {
            return (false, ErrorCodes.InvalidNumberOfSideNodes);
        }

        // Check key is in tree
        if (proof.key >= proof.numLeaves) {
            return (false, ErrorCodes.KeyNotInTree);
        }

        // A sibling at height 1 is created by getting the hash of the data to prove.
        bytes32 digest = leafDigest(data);

        // Null proof is only valid if numLeaves = 1
        // If so, just verify hash(data) is root
        if (proof.sideNodes.length == 0) {
            if (proof.numLeaves == 1) {
                return (root == digest, ErrorCodes.NoError);
            } else {
                return (false, ErrorCodes.NoError);
            }
        }

        (bytes32 computedHash, ErrorCodes error) = computeRootHash(proof.key, proof.numLeaves, digest, proof.sideNodes);

        if (error != ErrorCodes.NoError) {
            return (false, error);
        }

        return (computedHash == root, ErrorCodes.NoError);
    }

    function verifyMulti(bytes32 root, BinaryMerkleMultiproof memory proof, bytes[] memory data)
        internal
        pure
        returns (bool)
    {
        bytes32[] memory nodes = new bytes32[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            nodes[i] = leafDigest(data[i]);
        }

        return verifyMultiHashes(root, proof, nodes);
    }

    function verifyMultiHashes(bytes32 root, BinaryMerkleMultiproof memory proof, bytes32[] memory leafNodes)
        internal
        pure
        returns (bool)
    {
        uint256 leafIndex = 0;
        bytes32[] memory leftSubtrees = new bytes32[](proof.sideNodes.length);

        for (uint256 i = 0; leafIndex != proof.beginKey && i < proof.sideNodes.length; ++i) {
            uint256 subtreeSize = _nextSubtreeSize(leafIndex, proof.beginKey);
            leftSubtrees[i] = proof.sideNodes[i];
            leafIndex += subtreeSize;
        }

        uint256 proofRangeSubtreeEstimate = _getSplitPoint(proof.endKey) * 2;
        if (proofRangeSubtreeEstimate < 1) {
            proofRangeSubtreeEstimate = 1;
        }

        (bytes32 rootHash, uint256 proofHead,,) =
            _computeRootMulti(proof, leafNodes, 0, proofRangeSubtreeEstimate, 0, 0);
        for (uint256 i = proofHead; i < proof.sideNodes.length; ++i) {
            rootHash = nodeDigest(rootHash, proof.sideNodes[i]);
        }

        return (rootHash == root);
    }

    function _computeRootMulti(
        BinaryMerkleMultiproof memory proof,
        bytes32[] memory leafNodes,
        uint256 begin,
        uint256 end,
        uint256 headProof,
        uint256 headLeaves
    ) private pure returns (bytes32, uint256, uint256, bool) {
        // reached a leaf
        if (end - begin == 1) {
            // if current range overlaps with proof range, pop and return a leaf
            if (proof.beginKey <= begin && begin < proof.endKey) {
                // Note: second return value is guaranteed to be `false` by
                // construction.
                return _popLeavesIfNonEmpty(leafNodes, headLeaves, leafNodes.length, headProof);
            }

            // if current range does not overlap with proof range,
            // pop and return a proof node (leaf) if present,
            // else return nil because leaf doesn't exist
            return _popProofIfNonEmpty(proof.sideNodes, headProof, end, headLeaves);
        }

        // if current range does not overlap with proof range,
        // pop and return a proof node if present,
        // else return nil because subtree doesn't exist
        if (end <= proof.beginKey || begin >= proof.endKey) {
            return _popProofIfNonEmpty(proof.sideNodes, headProof, end, headLeaves);
        }

        // Recursively get left and right subtree
        uint256 k = _getSplitPoint(end - begin);
        (bytes32 left, uint256 newHeadProofLeft, uint256 newHeadLeavesLeft,) =
            _computeRootMulti(proof, leafNodes, begin, begin + k, headProof, headLeaves);
        (bytes32 right, uint256 newHeadProof, uint256 newHeadLeaves, bool rightIsNil) =
            _computeRootMulti(proof, leafNodes, begin + k, end, newHeadProofLeft, newHeadLeavesLeft);

        // only right leaf/subtree can be non-existent
        if (rightIsNil == true) {
            return (left, newHeadProof, newHeadLeaves, false);
        }
        bytes32 hash = nodeDigest(left, right);
        return (hash, newHeadProof, newHeadLeaves, false);
    }

    function _popProofIfNonEmpty(bytes32[] memory nodes, uint256 headProof, uint256 end, uint256 headLeaves)
        private
        pure
        returns (bytes32, uint256, uint256, bool)
    {
        (bytes32 node, uint256 newHead, bool isNil) = _popIfNonEmpty(nodes, headProof, end);
        return (node, newHead, headLeaves, isNil);
    }

    function _popLeavesIfNonEmpty(bytes32[] memory nodes, uint256 headLeaves, uint256 end, uint256 headProof)
        private
        pure
        returns (bytes32, uint256, uint256, bool)
    {
        (bytes32 node, uint256 newHead, bool isNil) = _popIfNonEmpty(nodes, headLeaves, end);
        return (node, headProof, newHead, isNil);
    }

    function _popIfNonEmpty(bytes32[] memory nodes, uint256 head, uint256 end)
        private
        pure
        returns (bytes32, uint256, bool)
    {
        if (nodes.length == 0 || head >= nodes.length || head >= end) {
            bytes32 node;
            return (node, head, true);
        }
        return (nodes[head], head + 1, false);
    }

    /// @notice Use the leafHash and innerHashes to get the root merkle hash.
    /// If the length of the innerHashes slice isn't exactly correct, the result is nil.
    /// Recursive impl.
    function computeRootHash(uint256 key, uint256 numLeaves, bytes32 leafHash, bytes32[] memory sideNodes)
        private
        pure
        returns (bytes32, ErrorCodes)
    {
        if (numLeaves == 0) {
            return (leafHash, ErrorCodes.InvalidNumberOfLeavesInProof);
        }
        if (numLeaves == 1) {
            if (sideNodes.length != 0) {
                return (leafHash, ErrorCodes.UnexpectedInnerHashes);
            }
            return (leafHash, ErrorCodes.NoError);
        }
        if (sideNodes.length == 0) {
            return (leafHash, ErrorCodes.ExpectedAtLeastOneInnerHash);
        }
        uint256 numLeft = _getSplitPoint(numLeaves);
        bytes32[] memory sideNodesLeft = slice(sideNodes, 0, sideNodes.length - 1);
        ErrorCodes error;
        if (key < numLeft) {
            bytes32 leftHash;
            (leftHash, error) = computeRootHash(key, numLeft, leafHash, sideNodesLeft);
            if (error != ErrorCodes.NoError) {
                return (leafHash, error);
            }
            return (nodeDigest(leftHash, sideNodes[sideNodes.length - 1]), ErrorCodes.NoError);
        }
        bytes32 rightHash;
        (rightHash, error) = computeRootHash(key - numLeft, numLeaves - numLeft, leafHash, sideNodesLeft);
        if (error != ErrorCodes.NoError) {
            return (leafHash, error);
        }
        return (nodeDigest(sideNodes[sideNodes.length - 1], rightHash), ErrorCodes.NoError);
    }

    /// @notice creates a slice of bytes32 from the data slice of bytes32 containing the elements
    /// that correspond to the provided range.
    /// It selects a half-open range which includes the begin element, but excludes the end one.
    /// @param _data The slice that we want to select data from.
    /// @param _begin The beginning of the range (inclusive).
    /// @param _end The ending of the range (exclusive).
    /// @return _ the sliced data.
    function slice(bytes32[] memory _data, uint256 _begin, uint256 _end) internal pure returns (bytes32[] memory) {
        if (_begin > _end) {
            revert("Invalid range: _begin is greater than _end");
        }
        if (_begin > _data.length || _end > _data.length) {
            revert("Invalid range: _begin or _end are out of bounds");
        }
        bytes32[] memory out = new bytes32[](_end - _begin);
        for (uint256 i = _begin; i < _end; i++) {
            out[i - _begin] = _data[i];
        }
        return out;
    }
}

abstract contract Versioned {
    /// @dev This should be overridden by inheriting contracts.
    function VERSION() external pure virtual returns (string memory) {
        return "1.0.0";
    }
}

interface IERC1822ProxiableUpgradeable {
    /**
     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
     * address.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy.
     */
    function proxiableUUID() external view returns (bytes32);
}

interface IERC1967Upgradeable {
    /**
     * @dev Emitted when the implementation is upgraded.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Emitted when the admin account has changed.
     */
    event AdminChanged(address previousAdmin, address newAdmin);

    /**
     * @dev Emitted when the beacon is changed.
     */
    event BeaconUpgraded(address indexed beacon);
}

library StorageSlotUpgradeable {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := store.slot
        }
    }
}

abstract contract ERC1967UpgradeUpgradeable is Initializable, IERC1967Upgradeable {
    function __ERC1967Upgrade_init() internal onlyInitializing {
    }

    function __ERC1967Upgrade_init_unchained() internal onlyInitializing {
    }
    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        require(AddressUpgradeable.isContract(newImplementation), "ERC1967: new implementation is not a contract");
        StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform implementation upgrade
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Perform implementation upgrade with additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCall(address newImplementation, bytes memory data, bool forceCall) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            AddressUpgradeable.functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCallUUPS(address newImplementation, bytes memory data, bool forceCall) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlotUpgradeable.getBooleanSlot(_ROLLBACK_SLOT).value) {
            _setImplementation(newImplementation);
        } else {
            try IERC1822ProxiableUpgradeable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
            } catch {
                revert("ERC1967Upgrade: new implementation is not UUPS");
            }
            _upgradeToAndCall(newImplementation, data, forceCall);
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Returns the current admin.
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {AdminChanged} event.
     */
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
     */
    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Returns the current beacon.
     */
    function _getBeacon() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        require(AddressUpgradeable.isContract(newBeacon), "ERC1967: new beacon is not a contract");
        require(
            AddressUpgradeable.isContract(IBeaconUpgradeable(newBeacon).implementation()),
            "ERC1967: beacon implementation is not a contract"
        );
        StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value = newBeacon;
    }

    /**
     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
     *
     * Emits a {BeaconUpgraded} event.
     */
    function _upgradeBeaconToAndCall(address newBeacon, bytes memory data, bool forceCall) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);
        if (data.length > 0 || forceCall) {
            AddressUpgradeable.functionDelegateCall(IBeaconUpgradeable(newBeacon).implementation(), data);
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

abstract contract UUPSUpgradeable is Initializable, IERC1822ProxiableUpgradeable, ERC1967UpgradeUpgradeable {
    function __UUPSUpgradeable_init() internal onlyInitializing {
    }

    function __UUPSUpgradeable_init_unchained() internal onlyInitializing {
    }
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        require(address(this) != __self, "Function must be called through delegatecall");
        require(_getImplementation() == __self, "Function must be called through active proxy");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "UUPSUpgradeable: must not be called through delegatecall");
        _;
    }

    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate the implementation's compatibility when performing an upgrade.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     *
     * @custom:oz-upgrades-unsafe-allow-reachable delegatecall
     */
    function upgradeTo(address newImplementation) public virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
     * encoded in `data`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     *
     * @custom:oz-upgrades-unsafe-allow-reachable delegatecall
     */
    function upgradeToAndCall(address newImplementation, bytes memory data) public payable virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, data, true);
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
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

interface IAccessControlUpgradeable {
    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     *
     * _Available since v3.1._
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external;
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

interface IERC165Upgradeable {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

abstract contract ERC165Upgradeable is Initializable, IERC165Upgradeable {
    function __ERC165_init() internal onlyInitializing {
    }

    function __ERC165_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165Upgradeable).interfaceId;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

library MathUpgradeable {
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
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
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
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

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
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
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
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
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
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
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
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library SignedMathUpgradeable {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}

library StringsUpgradeable {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = MathUpgradeable.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toString(int256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", toString(SignedMathUpgradeable.abs(value))));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, MathUpgradeable.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
    }
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
     * Overriding this function changes the behavior of the {onlyRole} modifier.
     *
     * Format of the revert message is described in {_checkRole}.
     *
     * _Available since v4.6._
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        StringsUpgradeable.toHexString(account),
                        " is missing role ",
                        StringsUpgradeable.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(bytes32 role, address account) public virtual override {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * May emit a {RoleGranted} event.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     *
     * NOTE: This function is deprecated in favor of {_grantRole}.
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

abstract contract TimelockedUpgradeable is
    Versioned,
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    /// @notice A random constant used to identify addresses with the permission of a 'timelock'.
    /// @dev Should be set to a 'timelock' contract, which may only execute calls after being
    ///      for a certain amount of time.
    bytes32 public constant TIMELOCK_ROLE = keccak256("TIMELOCK_ROLE");
    /// @notice A random constant used to identify addresses with the permission of a 'guardian'.
    /// @dev Can be set to any address, which may execute calls immediately.
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    error OnlyTimelock(address sender);
    error OnlyGuardian(address sender);

    modifier onlyTimelock() {
        if (!hasRole(TIMELOCK_ROLE, msg.sender)) {
            revert OnlyTimelock(msg.sender);
        }
        _;
    }

    modifier onlyGuardian() {
        if (!hasRole(GUARDIAN_ROLE, msg.sender)) {
            revert OnlyGuardian(msg.sender);
        }
        _;
    }

    /// @notice Prevents the implementation contract from being initialized outside of an
    ///         upgradeable proxy.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the contract.
    /// @dev The DEFAULT_ADMIN_ROLE needs to be set but should be unused.
    function __TimelockedUpgradeable_init(address _timelock, address _guardian)
        internal
        onlyInitializing
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _timelock);
        _grantRole(TIMELOCK_ROLE, _timelock);
        _grantRole(GUARDIAN_ROLE, _guardian);
    }

    /// @notice Authorizes an upgrade for the implementation contract.
    function _authorizeUpgrade(address newImplementation) internal virtual override onlyTimelock {}
}

struct DataRootTuple {
    // Celestia block height the data root was included in.
    // Genesis block is height = 0.
    // First queryable block is height = 1.
    uint256 height;
    // Data root.
    bytes32 dataRoot;
}

struct BinaryMerkleProof {
    // List of side nodes to verify and calculate tree.
    bytes32[] sideNodes;
    // The key of the leaf to verify.
    uint256 key;
    // The number of leaves in the tree
    uint256 numLeaves;
}

interface IDAOracle {
    /// @notice Verify a Data Availability attestation.
    /// @param _tupleRootNonce Nonce of the tuple root to prove against.
    /// @param _tuple Data root tuple to prove inclusion of.
    /// @param _proof Binary Merkle tree proof that `tuple` is in the root at `_tupleRootNonce`.
    /// @return `true` is proof is valid, `false` otherwise.
    function verifyAttestation(uint256 _tupleRootNonce, DataRootTuple memory _tuple, BinaryMerkleProof memory _proof)
        external
        view
        returns (bool);
}

interface ISP1Blobstream {
    /// @notice Emits event with the new head update.
    event HeadUpdate(uint64 blockNumber, bytes32 headerHash);

    /// @notice Trusted header not found.
    error TrustedHeaderNotFound();

    /// @notice Target block for proof must be greater than latest block and less than the
    /// latest block plus the maximum number of skipped blocks.
    error TargetBlockNotInRange();

    /// @notice Contract is frozen.
    error ContractFrozen();

    /// @notice Trusted header mismatch.
    error TrustedHeaderMismatch();

    /// @notice Data commitment stored for the block range [startBlock, endBlock) with proof nonce.
    /// @param proofNonce The nonce of the proof.
    /// @param startBlock The start block of the block range.
    /// @param endBlock The end block of the block range.
    /// @param dataCommitment The data commitment for the block range.
    event DataCommitmentStored(
        uint256 proofNonce,
        uint64 indexed startBlock,
        uint64 indexed endBlock,
        bytes32 indexed dataCommitment
    );

    /// @notice Validator bitmap associated with the proof from trustedBlock to targetBlock. The uint256
    /// is encoded as a bitmap of the validators from the trustedBlock that signed off on the new header.
    /// @param trustedBlock The trusted block of the block range.
    /// @param targetBlock The target block of the block range.
    /// @param validatorBitmap The validator bitmap for the block range.
    event ValidatorBitmapEquivocation(
        uint64 trustedBlock, uint64 targetBlock, uint256 validatorBitmap
    );

    /// @notice Relayer not approved.
    error RelayerNotApproved();
}

contract SP1Blobstream is ISP1Blobstream, IDAOracle, TimelockedUpgradeable {
    /// @notice The address of the gateway contract.
    /// @dev DEPECATED: Do not use. Compatibility for upgrades from BlobstreamX.
    address public gateway_deprecated;

    /// @notice The block is the first one in the next data commitment.
    uint64 public latestBlock;

    /// @notice The maximum number of blocks that can be skipped in a single request.
    /// @dev Reflects the maximum data commitment size you can request from a Celestia node.
    uint64 public constant DATA_COMMITMENT_MAX = 10000;

    /// @notice Nonce for proof events. Must be incremented sequentially.
    uint256 public state_proofNonce;

    /// @notice Maps block heights to their header hashes.
    mapping(uint64 => bytes32) public blockHeightToHeaderHash;

    /// @notice Mapping of data commitment nonces to data commitments.
    mapping(uint256 => bytes32) public state_dataCommitments;

    /// @notice Header range function id.
    /// @dev DEPRECATED: Do not use. Compatibility for upgrades from BlobstreamX.
    bytes32 public headerRangeFunctionId_deprecated;

    /// @notice Next header function id.
    /// @dev DEPRECATED: Do not use. Compatibility for upgrades from BlobstreamX.
    bytes32 public nextHeaderFunctionId_depcrecated;

    /// @notice Indicator of if the contract is frozen.
    bool public frozen;

    /// @notice The verification key for the SP1Blobstream program.
    bytes32 public blobstreamProgramVkey;

    /// @notice The deployed SP1 verifier contract.
    ISP1Verifier public verifier;

    /// @notice Approved relayers for the contract.
    mapping(address => bool) public approvedRelayers;

    /// @notice Check the relayer is approved.
    bool public checkRelayer = false;

    struct InitParameters {
        address guardian;
        uint64 height;
        bytes32 header;
        bytes32 blobstreamProgramVkey;
        address verifier;
    }

    struct ProofOutputs {
        bytes32 trustedHeaderHash;
        bytes32 targetHeaderHash;
        bytes32 dataCommitment;
        uint64 trustedBlock;
        uint64 targetBlock;
        uint256 validatorBitmap;
    }

    /// @notice If the relayer check is enabled, only approved relayers can call the function.
    modifier onlyApprovedRelayer() {
        if (checkRelayer && !approvedRelayers[msg.sender]) {
            revert RelayerNotApproved();
        }
        _;
    }

    function VERSION() external pure override returns (string memory) {
        return "1.1.0";
    }

    /// @dev Initializes the contract.
    /// @param _params The initialization parameters.
    function initialize(InitParameters calldata _params) external initializer {
        __TimelockedUpgradeable_init(_params.guardian, _params.guardian);

        frozen = false;

        blockHeightToHeaderHash[_params.height] = _params.header;
        latestBlock = _params.height;
        blobstreamProgramVkey = _params.blobstreamProgramVkey;
        verifier = ISP1Verifier(_params.verifier);

        state_proofNonce = 1;
    }

    /// @notice Only the guardian can set the contract to a frozen state.
    function updateFreeze(bool _freeze) external onlyGuardian {
        frozen = _freeze;
    }

    /// @notice Only the guardian can update the genesis state of the light client.
    function updateGenesisState(uint32 _height, bytes32 _header) external onlyGuardian {
        blockHeightToHeaderHash[_height] = _header;
        latestBlock = _height;
    }

    /// @notice Only the guardian can update the verifier contract.
    function updateVerifier(address _verifier) external onlyGuardian {
        verifier = ISP1Verifier(_verifier);
    }

    /// @notice Only the guardian can update the program vkey.
    function updateProgramVkey(bytes32 _programVkey) external onlyGuardian {
        blobstreamProgramVkey = _programVkey;
    }

    /// @notice Set a relayer's approval status.
    function setRelayerApproval(address _relayer, bool _approved) external onlyGuardian {
        approvedRelayers[_relayer] = _approved;
    }

    /// @notice Set the relayer check.
    function setCheckRelayer(bool _checkRelayer) external onlyGuardian {
        checkRelayer = _checkRelayer;
    }

    /// @notice Commits the new header at targetBlock and the data commitment for the block range
    /// [latestBlock, targetBlock).
    /// @param proof The proof bytes for the SP1 proof.
    /// @param publicValues The public commitments from the SP1 proof.
    function commitHeaderRange(bytes calldata proof, bytes calldata publicValues)
        external
        onlyApprovedRelayer
    {
        if (frozen) {
            revert ContractFrozen();
        }

        // Parse the outputs from the committed public values associated with the proof.
        ProofOutputs memory po = abi.decode(publicValues, (ProofOutputs));

        // Proof must be linked to the current latest block in the contract.
        bytes32 trustedHeader = blockHeightToHeaderHash[latestBlock];
        if (trustedHeader == bytes32(0)) {
            revert TrustedHeaderNotFound();
        }
        if (trustedHeader != po.trustedHeaderHash) {
            revert TrustedHeaderMismatch();
        }
        if (po.targetBlock <= latestBlock || po.targetBlock - latestBlock > DATA_COMMITMENT_MAX) {
            revert TargetBlockNotInRange();
        }

        // Verify the proof with the associated public values. This will revert if proof invalid.
        verifier.verifyProof(blobstreamProgramVkey, publicValues, proof);

        emit HeadUpdate(po.targetBlock, po.targetHeaderHash);
        emit DataCommitmentStored(state_proofNonce, latestBlock, po.targetBlock, po.dataCommitment);
        emit ValidatorBitmapEquivocation(po.trustedBlock, po.targetBlock, po.validatorBitmap);

        // Store the new header and data commitment, and update the latest block and event nonce.
        blockHeightToHeaderHash[po.targetBlock] = po.targetHeaderHash;
        state_dataCommitments[state_proofNonce] = po.dataCommitment;
        state_proofNonce++;
        latestBlock = po.targetBlock;
    }

    /// @dev Verify the attestation for the given proof nonce, tuple, and proof. This is taken from
    /// the existing Blobstream contract and is used to verify the data hash for a specific block
    /// against a posted data commitment.
    function verifyAttestation(
        uint256 _proofNonce,
        DataRootTuple memory _tuple,
        BinaryMerkleProof memory _proof
    ) external view returns (bool) {
        if (frozen) {
            revert ContractFrozen();
        }

        // Note: state_proofNonce slightly differs from Blobstream.sol because it is incremented
        //   after each commit.
        if (_proofNonce == 0 || _proofNonce >= state_proofNonce) {
            return false;
        }

        // Load the tuple root at the given index from storage.
        bytes32 root = state_dataCommitments[_proofNonce];

        // Verify the proof.
        (bool isProofValid,) = BinaryMerkleTree.verify(root, _proof, abi.encode(_tuple));

        return isProofValid;
    }
}