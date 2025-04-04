// SPDX-License-Identifier: Unknown
pragma solidity 0.8.22;

library RLPEncode {
    /*
     * Internal functions
     */

    /**
     * @dev RLP encodes a byte string.
     * @param self The byte string to encode.
     * @return The RLP encoded string in bytes.
     */
    function encodeBytes(
        bytes memory self
    ) internal pure returns (bytes memory) {
        bytes memory encoded;
        if (self.length == 1 && uint8(self[0]) <= 128) {
            encoded = self;
        } else {
            encoded = concat(encodeLength(self.length, 128), self);
        }
        return encoded;
    }

    /**
     * @dev RLP encodes a list of RLP encoded byte byte strings.
     * @param self The list of RLP encoded byte strings.
     * @return The RLP encoded list of items in bytes.
     */
    function encodeList(
        bytes[] memory self
    ) internal pure returns (bytes memory) {
        bytes memory list = flatten(self);
        return concat(encodeLength(list.length, 192), list);
    }

    /**
     * @dev RLP encodes a string.
     * @param self The string to encode.
     * @return The RLP encoded string in bytes.
     */
    function encodeString(
        string memory self
    ) internal pure returns (bytes memory) {
        return encodeBytes(bytes(self));
    }

    /**
     * @dev RLP encodes an address.
     * @param self The address to encode.
     * @return The RLP encoded address in bytes.
     */
    function encodeAddress(address self) internal pure returns (bytes memory) {
        bytes memory inputBytes;
        assembly {
            let m := mload(0x40)
            mstore(
                add(m, 20),
                xor(0x140000000000000000000000000000000000000000, self)
            )
            mstore(0x40, add(m, 52))
            inputBytes := m
        }
        return encodeBytes(inputBytes);
    }

    /**
     * @dev RLP encodes a uint.
     * @param self The uint to encode.
     * @return The RLP encoded uint in bytes.
     */
    function encodeUint(uint256 self) internal pure returns (bytes memory) {
        return encodeBytes(toBinary(self));
    }

    /**
     * @dev RLP encodes an int.
     * @param self The int to encode.
     * @return The RLP encoded int in bytes.
     */
    function encodeInt(int256 self) internal pure returns (bytes memory) {
        return encodeUint(uint256(self));
    }

    /**
     * @dev RLP encodes a bool.
     * @param self The bool to encode.
     * @return The RLP encoded bool in bytes.
     */
    function encodeBool(bool self) internal pure returns (bytes memory) {
        bytes memory encoded = new bytes(1);
        encoded[0] = (self ? bytes1(0x01) : bytes1(0x80));
        return encoded;
    }

    /*
     * Private functions
     */

    /**
     * @dev Encode the first byte, followed by the `len` in binary form if `length` is more than 55.
     * @param len The length of the string or the payload.
     * @param offset 128 if item is string, 192 if item is list.
     * @return RLP encoded bytes.
     */
    function encodeLength(
        uint256 len,
        uint256 offset
    ) private pure returns (bytes memory) {
        bytes memory encoded;
        if (len < 56) {
            encoded = new bytes(1);
            encoded[0] = bytes32(len + offset)[31];
        } else {
            uint256 lenLen;
            uint256 i = 1;
            while (len / i != 0) {
                lenLen++;
                i *= 256;
            }

            encoded = new bytes(lenLen + 1);
            encoded[0] = bytes32(lenLen + offset + 55)[31];
            for (i = 1; i <= lenLen; i++) {
                encoded[i] = bytes32((len / (256 ** (lenLen - i))) % 256)[31];
            }
        }
        return encoded;
    }

    /**
     * @dev Encode integer in big endian binary form with no leading zeroes.
     * @notice TODO: This should be optimized with assembly to save gas costs.
     * @param _x The integer to encode.
     * @return RLP encoded bytes.
     */
    function toBinary(uint256 _x) private pure returns (bytes memory) {
        bytes memory b = new bytes(32);
        assembly {
            mstore(add(b, 32), _x)
        }
        uint256 i = 0;
        for (; i < 32; i++) {
            if (b[i] != 0) {
                break;
            }
        }
        bytes memory res = new bytes(32 - i);
        for (uint256 j = 0; j < res.length; j++) {
            res[j] = b[i++];
        }
        return res;
    }

    /**
     * @dev Copies a piece of memory to another location.
     * @notice From: https://github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol.
     * @param _dest Destination location.
     * @param _src Source location.
     * @param _len Length of memory to copy.
     */
    function memcpy(uint256 _dest, uint256 _src, uint256 _len) private pure {
        uint256 dest = _dest;
        uint256 src = _src;
        uint256 len = _len;

        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        uint256 mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }

    /**
     * @dev Flattens a list of byte strings into one byte string.
     * @notice From: https://github.com/sammayo/solidity-rlp-encoder/blob/master/RLPEncode.sol.
     * @param _list List of byte strings to flatten.
     * @return The flattened byte string.
     */
    function flatten(bytes[] memory _list) private pure returns (bytes memory) {
        if (_list.length == 0) {
            return new bytes(0);
        }

        uint256 len;
        uint256 i = 0;
        for (; i < _list.length; i++) {
            len += _list[i].length;
        }

        bytes memory flattened = new bytes(len);
        uint256 flattenedPtr;
        assembly {
            flattenedPtr := add(flattened, 0x20)
        }

        for (i = 0; i < _list.length; i++) {
            bytes memory item = _list[i];

            uint256 listPtr;
            assembly {
                listPtr := add(item, 0x20)
            }

            memcpy(flattenedPtr, listPtr, item.length);
            flattenedPtr += _list[i].length;
        }

        return flattened;
    }

    /**
     * @dev Concatenates two bytes.
     * @notice From: https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol.
     * @param _preBytes First byte string.
     * @param _postBytes Second byte string.
     * @return Both byte string combined.
     */
    function concat(
        bytes memory _preBytes,
        bytes memory _postBytes
    ) private pure returns (bytes memory) {
        bytes memory tempBytes;

        assembly {
            tempBytes := mload(0x40)

            let length := mload(_preBytes)
            mstore(tempBytes, length)

            let mc := add(tempBytes, 0x20)
            let end := add(mc, length)

            for {
                let cc := add(_preBytes, 0x20)
            } lt(mc, end) {
                mc := add(mc, 0x20)
                cc := add(cc, 0x20)
            } {
                mstore(mc, mload(cc))
            }

            length := mload(_postBytes)
            mstore(tempBytes, add(length, mload(tempBytes)))

            mc := end
            end := add(mc, length)

            for {
                let cc := add(_postBytes, 0x20)
            } lt(mc, end) {
                mc := add(mc, 0x20)
                cc := add(cc, 0x20)
            } {
                mstore(mc, mload(cc))
            }

            mstore(
                0x40,
                and(
                    add(add(end, iszero(add(length, mload(_preBytes)))), 31),
                    not(31)
                )
            )
        }

        return tempBytes;
    }
}

struct NamespaceMerkleProof {
    // List of side nodes to verify and calculate tree.
    NamespaceNode[] sideNodes;
    // The key of the leaf to verify.
    uint256 key;
    // The number of leaves in the tree
    uint256 numLeaves;
}

function leafDigest(Namespace memory namespace, bytes memory data) pure returns (NamespaceNode memory) {
    bytes32 digest = sha256(abi.encodePacked(Constants.LEAF_PREFIX, namespace.toBytes(), data));
    NamespaceNode memory node = NamespaceNode(namespace, namespace, digest);
    return node;
}

function namespaceNodeEquals(NamespaceNode memory first, NamespaceNode memory second) pure returns (bool) {
    return first.min.equalTo(second.min) && first.max.equalTo(second.max) && (first.digest == second.digest);
}

function namespaceMin(Namespace memory l, Namespace memory r) pure returns (Namespace memory) {
    if (l.lessThan(r)) {
        return l;
    } else {
        return r;
    }
}

function PARITY_SHARE_NAMESPACE() pure returns (Namespace memory) {
    return Namespace(0xFF, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
}

function namespaceMax(Namespace memory l, Namespace memory r) pure returns (Namespace memory) {
    if (l.greaterThan(r)) {
        return l;
    } else {
        return r;
    }
}

function nodeDigest(NamespaceNode memory l, NamespaceNode memory r) pure returns (NamespaceNode memory) {
    Namespace memory min = namespaceMin(l.min, r.min);
    Namespace memory max;
    if (l.min.equalTo(PARITY_SHARE_NAMESPACE())) {
        max = PARITY_SHARE_NAMESPACE();
    } else if (r.min.equalTo(PARITY_SHARE_NAMESPACE())) {
        max = l.max;
    } else {
        max = namespaceMax(l.max, r.max);
    }

    bytes32 digest = sha256(
        abi.encodePacked(
            Constants.NODE_PREFIX,
            l.min.toBytes(),
            l.max.toBytes(),
            l.digest,
            r.min.toBytes(),
            r.max.toBytes(),
            r.digest
        )
    );

    NamespaceNode memory node = NamespaceNode(min, max, digest);
    return node;
}

library NamespaceMerkleTree {
    /// @notice Verify if element exists in Merkle tree, given data, proof, and root.
    /// @param root The root of the tree in which the given leaf is verified.
    /// @param proof Namespace Merkle proof for the leaf.
    /// @param namespace Namespace of the leaf.
    /// @param data The data of the leaf to verify.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @dev proof.numLeaves is necessary to determine height of subtree containing the data to prove.
    function verify(
        NamespaceNode memory root,
        NamespaceMerkleProof memory proof,
        Namespace memory namespace,
        bytes memory data
    ) internal pure returns (bool) {
        // A sibling at height 1 is created by getting the leafDigest of the original data.
        NamespaceNode memory node = leafDigest(namespace, data);

        // Since we're verifying a leaf, height parameter is 1.
        return verifyInner(root, proof, node, 1);
    }

    /// @notice Verify if inner node exists in Merkle tree, given node, proof, and root.
    /// @param root The root of the tree in which the given leaf is verified.
    /// @param proof Namespace Merkle proof for the leaf.
    /// proof.key is any key in the subtree rooted at the inner node.
    /// @param node The inner node to verify.
    /// @param startingHeight Starting height of the proof.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @dev proof.numLeaves is necessary to determine height of subtree containing the data to prove.
    function verifyInner(
        NamespaceNode memory root,
        NamespaceMerkleProof memory proof,
        NamespaceNode memory node,
        uint256 startingHeight
    ) internal pure returns (bool) {
        // Check starting height is at least 1
        if (startingHeight < 1) {
            return false;
        }
        uint256 heightOffset = startingHeight - 1;

        // Check proof is correct length for the key it is proving
        if (proof.numLeaves <= 1) {
            if (proof.sideNodes.length != 0) {
                return false;
            }
        } else if (proof.sideNodes.length + heightOffset != pathLengthFromKey(proof.key, proof.numLeaves)) {
            return false;
        }

        // Check key is in tree
        if (proof.key >= proof.numLeaves) {
            return false;
        }
        // Handle case where proof is empty: i.e, only one leaf exists, so verify hash(data) is root
        // TODO handle case where inner node is actually the root of a tree with more than one node
        if (proof.sideNodes.length == 0) {
            if (proof.numLeaves == 1) {
                return namespaceNodeEquals(root, node);
            } else {
                return false;
            }
        }

        uint256 height = startingHeight;
        uint256 stableEnd = proof.key;

        // While the current subtree (of height 'height') is complete, determine
        // the position of the next sibling using the complete subtree algorithm.
        // 'stableEnd' tells us the ending index of the last full subtree. It gets
        // initialized to 'key' because the first full subtree was the
        // subtree of height 1, created above (and had an ending index of
        // 'key').

        while (true) {
            // Determine if the subtree is complete. This is accomplished by
            // rounding down the key to the nearest 1 << 'height', adding 1
            // << 'height', and comparing the result to the number of leaves in the
            // Merkle tree.

            uint256 subTreeStartIndex = (proof.key / (1 << height)) * (1 << height);
            uint256 subTreeEndIndex = subTreeStartIndex + (1 << height) - 1;

            // If the Merkle tree does not have a leaf at index
            // 'subTreeEndIndex', then the subtree of the current height is not
            // a complete subtree.
            if (subTreeEndIndex >= proof.numLeaves) {
                break;
            }
            stableEnd = subTreeEndIndex;

            // Determine if the key is in the first or the second half of
            // the subtree.
            if (proof.sideNodes.length + heightOffset <= height - 1) {
                return false;
            }
            if (proof.key - subTreeStartIndex < (1 << (height - heightOffset - 1))) {
                node = nodeDigest(node, proof.sideNodes[height - heightOffset - 1]);
            } else {
                node = nodeDigest(proof.sideNodes[height - heightOffset - 1], node);
            }

            height += 1;
        }

        // Determine if the next hash belongs to an orphan that was elevated. This
        // is the case IFF 'stableEnd' (the last index of the largest full subtree)
        // is equal to the number of leaves in the Merkle tree.
        if (stableEnd != proof.numLeaves - 1) {
            if (proof.sideNodes.length <= height - 1) {
                return false;
            }
            node = nodeDigest(node, proof.sideNodes[height - heightOffset - 1]);
            height += 1;
        }
        // All remaining elements in the proof set will belong to a left sibling.
        while (height - heightOffset - 1 < proof.sideNodes.length) {
            node = nodeDigest(proof.sideNodes[height - heightOffset - 1], node);
            height += 1;
        }

        return namespaceNodeEquals(root, node);
    }

    /// @notice Verify if contiguous elements exists in Merkle tree, given leaves, mutliproof, and root.
    /// @param root The root of the tree in which the given leaves are verified.
    /// @param proof Namespace Merkle multiproof for the leaves.
    /// @param namespace Namespace of the leaves. All leaves must have the same namespace.
    /// @param data The leaves to verify. Note: leaf data must be the _entire_ share (including namespace prefixing).
    /// @return `true` if the proof is valid, `false` otherwise.
    function verifyMulti(
        NamespaceNode memory root,
        NamespaceMerkleMultiproof memory proof,
        Namespace memory namespace,
        bytes[] memory data
    ) internal pure returns (bool) {
        // Hash all the leaves to get leaf nodes.
        NamespaceNode[] memory nodes = new NamespaceNode[](data.length);
        for (uint256 i = 0; i < data.length; ++i) {
            nodes[i] = leafDigest(namespace, data[i]);
        }

        // Verify inclusion of leaf nodes.
        return verifyMultiHashes(root, proof, nodes);
    }

    /// @notice Verify if contiguous leaf hashes exists in Merkle tree, given leaf nodes, multiproof, and root.
    /// @param root The root of the tree in which the given leaf nodes are verified.
    /// @param proof Namespace Merkle multiproof for the leaves.
    /// @param leafNodes The leaf nodes to verify.
    /// @return `true` if the proof is valid, `false` otherwise.
    function verifyMultiHashes(
        NamespaceNode memory root,
        NamespaceMerkleMultiproof memory proof,
        NamespaceNode[] memory leafNodes
    ) internal pure returns (bool) {
        uint256 leafIndex = 0;
        NamespaceNode[] memory leftSubtrees = new NamespaceNode[](proof.sideNodes.length);

        for (uint256 i = 0; leafIndex != proof.beginKey && i < proof.sideNodes.length; ++i) {
            uint256 subtreeSize = _nextSubtreeSize(leafIndex, proof.beginKey);
            leftSubtrees[i] = proof.sideNodes[i];
            leafIndex += subtreeSize;
        }

        // estimate the leaf size of the subtree containing the proof range
        uint256 proofRangeSubtreeEstimate = _getSplitPoint(proof.endKey) * 2;
        if (proofRangeSubtreeEstimate < 1) {
            proofRangeSubtreeEstimate = 1;
        }

        (NamespaceNode memory rootHash, uint256 proofHead,,) =
            _computeRoot(proof, leafNodes, 0, proofRangeSubtreeEstimate, 0, 0);
        for (uint256 i = proofHead; i < proof.sideNodes.length; ++i) {
            rootHash = nodeDigest(rootHash, proof.sideNodes[i]);
        }

        return namespaceNodeEquals(rootHash, root);
    }

    /// @notice Returns the size of the subtree adjacent to `begin` that does
    /// not overlap `end`.
    /// @param begin Begin index, inclusive.
    /// @param end End index, exclusive.
    function _nextSubtreeSize(uint256 begin, uint256 end) private pure returns (uint256) {
        uint256 ideal = _bitsTrailingZeroes(begin);
        uint256 max = _bitsLen(end - begin) - 1;
        if (ideal > max) {
            return 1 << max;
        }
        return 1 << ideal;
    }

    /// @notice Returns the number of trailing zero bits in `x`; the result is
    /// 256 for `x` == 0.
    /// @param x Number.
    function _bitsTrailingZeroes(uint256 x) private pure returns (uint256) {
        uint256 mask = 1;
        uint256 count = 0;

        while (x != 0 && mask & x == 0) {
            count++;
            x >>= 1;
        }

        return count;
    }

    /// @notice Computes the NMT root recursively.
    /// @param proof Namespace Merkle multiproof for the leaves.
    /// @param leafNodes Leaf nodes for which inclusion is proven.
    /// @param begin Begin index, inclusive.
    /// @param end End index, exclusive.
    /// @param headProof Internal detail: head of proof sidenodes array. Used for recursion. Set to `0` on first call.
    /// @param headLeaves Internal detail: head of leaves array. Used for recursion. Set to `0` on first call.
    /// @return _ Subtree root.
    /// @return _ New proof sidenodes array head. Used for recursion.
    /// @return _ New leaves array head. Used for recursion.
    /// @return _ If the subtree root is "nil."
    function _computeRoot(
        NamespaceMerkleMultiproof memory proof,
        NamespaceNode[] memory leafNodes,
        uint256 begin,
        uint256 end,
        uint256 headProof,
        uint256 headLeaves
    ) private pure returns (NamespaceNode memory, uint256, uint256, bool) {
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
        (NamespaceNode memory left, uint256 newHeadProofLeft, uint256 newHeadLeavesLeft,) =
            _computeRoot(proof, leafNodes, begin, begin + k, headProof, headLeaves);
        (NamespaceNode memory right, uint256 newHeadProof, uint256 newHeadLeaves, bool rightIsNil) =
            _computeRoot(proof, leafNodes, begin + k, end, newHeadProofLeft, newHeadLeavesLeft);

        // only right leaf/subtree can be non-existent
        if (rightIsNil == true) {
            return (left, newHeadProof, newHeadLeaves, false);
        }
        NamespaceNode memory hash = nodeDigest(left, right);
        return (hash, newHeadProof, newHeadLeaves, false);
    }

    /// @notice Pop from the leaf nodes array slice if it's not empty.
    /// @param nodes Entire leaf nodes array.
    /// @param headLeaves Head of leaf nodes array slice.
    /// @param end End of leaf nodes array slice.
    /// @param headProof Used only to return for recursion.
    /// @return _ Popped node.
    /// @return _ Head of proof sidenodes array slice (unchanged).
    /// @return _ New head of leaf nodes array slice.
    /// @return _ If the popped node is "nil."
    function _popLeavesIfNonEmpty(NamespaceNode[] memory nodes, uint256 headLeaves, uint256 end, uint256 headProof)
        private
        pure
        returns (NamespaceNode memory, uint256, uint256, bool)
    {
        (NamespaceNode memory node, uint256 newHead, bool isNil) = _popIfNonEmpty(nodes, headLeaves, end);
        return (node, headProof, newHead, isNil);
    }

    /// @notice Pop from the proof sidenodes array slice if it's not empty.
    /// @param nodes Entire proof sidenodes array.
    /// @param headLeaves Head of proof sidenodes array slice.
    /// @param end End of proof sidenodes array slice.
    /// @param headProof Used only to return for recursion.
    /// @return _ Popped node.
    /// @return _ New head of proof sidenodes array slice.
    /// @return _ Head of proof sidenodes array slice (unchanged).
    /// @return _ If the popped node is "nil."
    function _popProofIfNonEmpty(NamespaceNode[] memory nodes, uint256 headProof, uint256 end, uint256 headLeaves)
        private
        pure
        returns (NamespaceNode memory, uint256, uint256, bool)
    {
        (NamespaceNode memory node, uint256 newHead, bool isNil) = _popIfNonEmpty(nodes, headProof, end);
        return (node, newHead, headLeaves, isNil);
    }

    /// @notice Pop from an array slice if it's not empty.
    /// @param nodes Entire array.
    /// @param head Head of array slice.
    /// @param end End of array slice.
    /// @return _ Popped node.
    /// @return _ New head of array slice.
    /// @return _ If the popped node is "nil."
    function _popIfNonEmpty(NamespaceNode[] memory nodes, uint256 head, uint256 end)
        private
        pure
        returns (NamespaceNode memory, uint256, bool)
    {
        if (nodes.length == 0 || head >= nodes.length || head >= end) {
            NamespaceNode memory node;
            return (node, head, true);
        }
        return (nodes[head], head + 1, false);
    }
}

function getStartingBit(uint256 numLeaves) pure returns (uint256 startingBit) {
    // Determine height of the left subtree. This is the maximum path length, so all paths start at this offset from the right-most bit
    startingBit = 0;
    while ((1 << startingBit) < numLeaves) {
        startingBit += 1;
    }
    return Constants.MAX_HEIGHT - startingBit;
}

function pathLengthFromKey(uint256 key, uint256 numLeaves) pure returns (uint256 pathLength) {
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
    /// @notice Verify if element exists in Merkle tree, given data, proof, and root.
    /// @param root The root of the tree in which verify the given leaf.
    /// @param proof Binary Merkle proof for the leaf.
    /// @param data The data of the leaf to verify.
    /// @return `true` is proof is valid, `false` otherwise.
    /// @dev proof.numLeaves is necessary to determine height of subtree containing the data to prove.
    function verify(bytes32 root, BinaryMerkleProof memory proof, bytes memory data) internal pure returns (bool) {
        // Check proof is correct length for the key it is proving
        if (proof.numLeaves <= 1) {
            if (proof.sideNodes.length != 0) {
                return false;
            }
        } else if (proof.sideNodes.length != pathLengthFromKey(proof.key, proof.numLeaves)) {
            return false;
        }

        // Check key is in tree
        if (proof.key >= proof.numLeaves) {
            return false;
        }

        // A sibling at height 1 is created by getting the hash of the data to prove.
        bytes32 digest = leafDigest(data);

        // Null proof is only valid if numLeaves = 1
        // If so, just verify hash(data) is root
        if (proof.sideNodes.length == 0) {
            if (proof.numLeaves == 1) {
                return (root == digest);
            } else {
                return false;
            }
        }

        bytes32 computedHash = computeRootHash(proof.key, proof.numLeaves, digest, proof.sideNodes);

        return (computedHash == root);
    }

    /// @notice Use the leafHash and innerHashes to get the root merkle hash.
    /// If the length of the innerHashes slice isn't exactly correct, the result is nil.
    /// Recursive impl.
    function computeRootHash(uint256 key, uint256 numLeaves, bytes32 leafHash, bytes32[] memory sideNodes)
        private
        pure
        returns (bytes32)
    {
        if (numLeaves == 0) {
            revert("cannot call computeRootHash with 0 number of leaves");
        }
        if (numLeaves == 1) {
            if (sideNodes.length != 0) {
                revert("unexpected inner hashes");
            }
            return leafHash;
        }
        if (sideNodes.length == 0) {
            revert("expected at least one inner hash");
        }
        uint256 numLeft = _getSplitPoint(numLeaves);
        bytes32[] memory sideNodesLeft = slice(sideNodes, 0, sideNodes.length - 1);
        if (key < numLeft) {
            bytes32 leftHash = computeRootHash(key, numLeft, leafHash, sideNodesLeft);
            return nodeDigest(leftHash, sideNodes[sideNodes.length - 1]);
        }
        bytes32 rightHash = computeRootHash(key - numLeft, numLeaves - numLeft, leafHash, sideNodesLeft);
        return nodeDigest(sideNodes[sideNodes.length - 1], rightHash);
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

library DAVerifier {
    /////////////////
    // Error codes //
    /////////////////

    enum ErrorCodes {
        NoError,
        /// @notice The shares to the rows proof is invalid.
        InvalidSharesToRowsProof,
        /// @notice The rows to the data root proof is invalid.
        InvalidRowsToDataRootProof,
        /// @notice The row to the data root proof is invalid.
        InvalidRowToDataRootProof,
        /// @notice The data root tuple to the data root tuple roof proof is invalid.
        InvalidDataRootTupleToDataRootTupleRootProof,
        /// @notice The number of share proofs isn't equal to the number of rows roots.
        UnequalShareProofsAndRowRootsNumber,
        /// @notice The number of rows proofs isn't equal to the number of rows roots.
        UnequalRowProofsAndRowRootsNumber,
        /// @notice The verifier data length isn't equal to the number of shares in the shares proofs.
        UnequalDataLengthAndNumberOfSharesProofs,
        /// @notice The number of leaves in the binary merkle proof is not divisible by 4.
        InvalidNumberOfLeavesInProof,
        /// @notice The provided range is invalid.
        InvalidRange,
        /// @notice The provided range is out of bounds.
        OutOfBoundsRange
    }

    ///////////////
    // Functions //
    ///////////////

    /// @notice Verifies that the shares, which were posted to Celestia, were committed to by the Blobstream smart contract.
    /// @param _bridge The Blobstream smart contract instance.
    /// @param _sharesProof The proof of the shares to the data root tuple root.
    /// @param _root The data root of the block that contains the shares.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifySharesToDataRootTupleRoot(IDAOracle _bridge, SharesProof memory _sharesProof, bytes32 _root)
        internal
        view
        returns (bool, ErrorCodes)
    {
        // checking that the data root was committed to by the Blobstream smart contract.
        (bool success, ErrorCodes errorCode) = verifyMultiRowRootsToDataRootTupleRoot(
            _bridge, _sharesProof.rowRoots, _sharesProof.rowProofs, _sharesProof.attestationProof, _root
        );
        if (!success) {
            return (false, errorCode);
        }

        // checking that the shares were committed to by the rows roots.
        if (_sharesProof.shareProofs.length != _sharesProof.rowRoots.length) {
            return (false, ErrorCodes.UnequalShareProofsAndRowRootsNumber);
        }

        uint256 numberOfSharesInProofs = 0;
        for (uint256 i = 0; i < _sharesProof.shareProofs.length; i++) {
            numberOfSharesInProofs += _sharesProof.shareProofs[i].endKey - _sharesProof.shareProofs[i].beginKey;
        }

        if (_sharesProof.data.length != numberOfSharesInProofs) {
            return (false, ErrorCodes.UnequalDataLengthAndNumberOfSharesProofs);
        }

        uint256 cursor = 0;
        for (uint256 i = 0; i < _sharesProof.shareProofs.length; i++) {
            uint256 sharesUsed = _sharesProof.shareProofs[i].endKey - _sharesProof.shareProofs[i].beginKey;
            (bytes[] memory s, ErrorCodes err) = slice(_sharesProof.data, cursor, cursor + sharesUsed);
            if (err != ErrorCodes.NoError) {
                return (false, err);
            }
            if (
                !NamespaceMerkleTree.verifyMulti(
                    _sharesProof.rowRoots[i], _sharesProof.shareProofs[i], _sharesProof.namespace, s
                )
            ) {
                return (false, ErrorCodes.InvalidSharesToRowsProof);
            }
            cursor += sharesUsed;
        }

        return (true, ErrorCodes.NoError);
    }

    /// @notice Verifies that a row/column root, from a Celestia block, was committed to by the Blobstream smart contract.
    /// @param _bridge The Blobstream smart contract instance.
    /// @param _rowRoot The row/column root to be proven.
    /// @param _rowProof The proof of the row/column root to the data root.
    /// @param _root The data root of the block that contains the row.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyRowRootToDataRootTupleRoot(
        IDAOracle _bridge,
        NamespaceNode memory _rowRoot,
        BinaryMerkleProof memory _rowProof,
        AttestationProof memory _attestationProof,
        bytes32 _root
    ) internal view returns (bool, ErrorCodes) {
        // checking that the data root was committed to by the Blobstream smart contract
        if (
            !_bridge.verifyAttestation(
                _attestationProof.tupleRootNonce, _attestationProof.tuple, _attestationProof.proof
            )
        ) {
            return (false, ErrorCodes.InvalidDataRootTupleToDataRootTupleRootProof);
        }

        bytes memory rowRoot = abi.encodePacked(_rowRoot.min.toBytes(), _rowRoot.max.toBytes(), _rowRoot.digest);
        if (!BinaryMerkleTree.verify(_root, _rowProof, rowRoot)) {
            return (false, ErrorCodes.InvalidRowToDataRootProof);
        }

        return (true, ErrorCodes.NoError);
    }

    /// @notice Verifies that a set of rows/columns, from a Celestia block, were committed to by the Blobstream smart contract.
    /// @param _bridge The Blobstream smart contract instance.
    /// @param _rowRoots The set of row/column roots to be proved.
    /// @param _rowProofs The set of proofs of the _rowRoots in the same order.
    /// @param _root The data root of the block that contains the rows.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyMultiRowRootsToDataRootTupleRoot(
        IDAOracle _bridge,
        NamespaceNode[] memory _rowRoots,
        BinaryMerkleProof[] memory _rowProofs,
        AttestationProof memory _attestationProof,
        bytes32 _root
    ) internal view returns (bool, ErrorCodes) {
        // checking that the data root was committed to by the Blobstream smart contract
        if (
            !_bridge.verifyAttestation(
                _attestationProof.tupleRootNonce, _attestationProof.tuple, _attestationProof.proof
            )
        ) {
            return (false, ErrorCodes.InvalidDataRootTupleToDataRootTupleRootProof);
        }

        // checking that the rows roots commit to the data root.
        if (_rowProofs.length != _rowRoots.length) {
            return (false, ErrorCodes.UnequalRowProofsAndRowRootsNumber);
        }

        for (uint256 i = 0; i < _rowProofs.length; i++) {
            bytes memory rowRoot =
                abi.encodePacked(_rowRoots[i].min.toBytes(), _rowRoots[i].max.toBytes(), _rowRoots[i].digest);
            if (!BinaryMerkleTree.verify(_root, _rowProofs[i], rowRoot)) {
                return (false, ErrorCodes.InvalidRowsToDataRootProof);
            }
        }

        return (true, ErrorCodes.NoError);
    }

    /// @notice computes the Celestia block square size from a row/column root to data root binary merkle proof.
    /// Note: the provided proof is not authenticated to the Blobstream smart contract. It is the user's responsibility
    /// to verify that the proof is valid and was successfully committed to using
    //  the `DAVerifier.verifyRowRootToDataRootTupleRoot()` method
    /// Note: the minimum square size is 1. Thus, we don't expect the proof to have number of leaves equal to 0.
    /// @param _proof The proof of the row/column root to the data root.
    /// @return The square size of the corresponding block.
    /// @return an error code if the _proof is invalid, Errors.NoError otherwise.
    function computeSquareSizeFromRowProof(BinaryMerkleProof memory _proof)
        internal
        pure
        returns (uint256, ErrorCodes)
    {
        if (_proof.numLeaves % 4 != 0) {
            return (0, ErrorCodes.InvalidNumberOfLeavesInProof);
        }
        // we divide the number of leaves of the proof by 4 because the rows/columns tree is constructed
        // from the extended block row roots and column roots.
        return (_proof.numLeaves / 4, ErrorCodes.NoError);
    }

    /// @notice computes the Celestia block square size from a shares to row/column root proof.
    /// Note: the provided proof is not authenticated to the Blobstream smart contract. It is the user's responsibility
    /// to verify that the proof is valid and that the shares were successfully committed to using
    /// the `DAVerifier.verifySharesToDataRootTupleRoot()` method.
    /// Note: the minimum square size is 1. Thus, we don't expect the proof not to contain any side node.
    /// @param _proof The proof of the shares to the row/column root.
    /// @return The square size of the corresponding block.
    function computeSquareSizeFromShareProof(NamespaceMerkleMultiproof memory _proof) internal pure returns (uint256) {
        uint256 extendedSquareRowSize = 2 ** _proof.sideNodes.length;
        // we divide the extended square row size by 2 because the square size is the
        // the size of the row of the original square size.
        return extendedSquareRowSize / 2;
    }

    /// @notice creates a slice of bytes from the data slice of bytes containing the elements
    /// that correspond to the provided range.
    /// It selects a half-open range which includes the begin element, but excludes the end one.
    /// @param _data The slice that we want to select data from.
    /// @param _begin The beginning of the range (inclusive).
    /// @param _end The ending of the range (exclusive).
    /// @return _ the sliced data.
    function slice(bytes[] memory _data, uint256 _begin, uint256 _end)
        internal
        pure
        returns (bytes[] memory, ErrorCodes)
    {
        if (_begin > _end) {
            return (_data, ErrorCodes.InvalidRange);
        }
        if (_begin > _data.length || _end > _data.length) {
            return (_data, ErrorCodes.OutOfBoundsRange);
        }
        bytes[] memory out = new bytes[](_end - _begin);
        for (uint256 i = _begin; i < _end; i++) {
            out[i - _begin] = _data[i];
        }
        return (out, ErrorCodes.NoError);
    }
}

struct NamespaceMerkleMultiproof {
    // The beginning key of the leaves to verify.
    uint256 beginKey;
    // The ending key of the leaves to verify.
    uint256 endKey;
    // List of side nodes to verify and calculate tree.
    NamespaceNode[] sideNodes;
}

struct Namespace {
    // The namespace version.
    bytes1 version;
    // The namespace ID.
    bytes28 id;
}

struct NamespaceNode {
    // Minimum namespace.
    Namespace min;
    // Maximum namespace.
    Namespace max;
    // Node value.
    bytes32 digest;
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

struct AttestationProof {
    // the attestation nonce that commits to the data root tuple.
    uint256 tupleRootNonce;
    // the data root tuple that was committed to.
    DataRootTuple tuple;
    // the binary merkle proof of the tuple to the commitment.
    BinaryMerkleProof proof;
}

struct SharesProof {
    // The shares that were committed to.
    bytes[] data;
    // The shares proof to the row roots. If the shares span multiple rows, we will have multiple nmt proofs.
    NamespaceMerkleMultiproof[] shareProofs;
    // The namespace of the shares.
    Namespace namespace;
    // The rows where the shares belong. If the shares span multiple rows, we will have multiple rows.
    NamespaceNode[] rowRoots;
    // The proofs of the rowRoots to the data root.
    BinaryMerkleProof[] rowProofs;
    // The proof of the data root tuple to the data root tuple root that was posted to the Blobstream contract.
    AttestationProof attestationProof;
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
}

abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    /// @custom:storage-location erc7201:openzeppelin.storage.Ownable
    struct OwnableStorage {
        address _owner;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Ownable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant OwnableStorageLocation = 0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300;

    function _getOwnableStorage() private pure returns (OwnableStorage storage $) {
        assembly {
            $.slot := OwnableStorageLocation
        }
    }

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    function __Ownable_init(address initialOwner) internal onlyInitializing {
        __Ownable_init_unchained(initialOwner);
    }

    function __Ownable_init_unchained(address initialOwner) internal onlyInitializing {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
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
        OwnableStorage storage $ = _getOwnableStorage();
        return $._owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
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
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        OwnableStorage storage $ = _getOwnableStorage();
        address oldOwner = $._owner;
        $._owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract Initializable {
    /**
     * @dev Storage of the initializable contract.
     *
     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
     * when using with upgradeable contracts.
     *
     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
     */
    struct InitializableStorage {
        /**
         * @dev Indicates that the contract has been initialized.
         */
        uint64 _initialized;
        /**
         * @dev Indicates that the contract is in the process of being initialized.
         */
        bool _initializing;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;

    /**
     * @dev The contract is already initialized.
     */
    error InvalidInitialization();

    /**
     * @dev The contract is not initializing.
     */
    error NotInitializing();

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint64 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
     * production.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        // Cache values to avoid duplicated sloads
        bool isTopLevelCall = !$._initializing;
        uint64 initialized = $._initialized;

        // Allowed calls:
        // - initialSetup: the contract is not in the initializing state and no previous version was
        //                 initialized
        // - construction: the contract is initialized at version 1 (no reininitialization) and the
        //                 current contract is just being deployed
        bool initialSetup = initialized == 0 && isTopLevelCall;
        bool construction = initialized == 1 && address(this).code.length == 0;

        if (!initialSetup && !construction) {
            revert InvalidInitialization();
        }
        $._initialized = 1;
        if (isTopLevelCall) {
            $._initializing = true;
        }
        _;
        if (isTopLevelCall) {
            $._initializing = false;
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
     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint64 version) {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing || $._initialized >= version) {
            revert InvalidInitialization();
        }
        $._initialized = version;
        $._initializing = true;
        _;
        $._initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        _checkInitializing();
        _;
    }

    /**
     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
     */
    function _checkInitializing() internal view virtual {
        if (!_isInitializing()) {
            revert NotInitializing();
        }
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
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing) {
            revert InvalidInitialization();
        }
        if ($._initialized != type(uint64).max) {
            $._initialized = type(uint64).max;
            emit Initialized(type(uint64).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint64) {
        return _getInitializableStorage()._initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _getInitializableStorage()._initializing;
    }

    /**
     * @dev Returns a pointer to the storage namespace.
     */
    // solhint-disable-next-line var-name-mixedcase
    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
        assembly {
            $.slot := INITIALIZABLE_STORAGE
        }
    }
}

interface IERC1822Proxiable {
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

library StorageSlot {
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

library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

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
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}

library ERC1967Utils {
    // We re-declare ERC-1967 events here because they can't be used directly from IERC1967.
    // This will be fixed in Solidity 0.8.21. At that point we should remove these events.
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

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1.
     */
    // solhint-disable-next-line private-vars-leading-underscore
    bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev The `implementation` of the proxy is invalid.
     */
    error ERC1967InvalidImplementation(address implementation);

    /**
     * @dev The `admin` of the proxy is invalid.
     */
    error ERC1967InvalidAdmin(address admin);

    /**
     * @dev The `beacon` of the proxy is invalid.
     */
    error ERC1967InvalidBeacon(address beacon);

    /**
     * @dev An upgrade function sees `msg.value > 0` that may be lost.
     */
    error ERC1967NonPayable();

    /**
     * @dev Returns the current implementation address.
     */
    function getImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        if (newImplementation.code.length == 0) {
            revert ERC1967InvalidImplementation(newImplementation);
        }
        StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Performs implementation upgrade with additional setup call if data is nonempty.
     * This function is payable only if the setup call is performed, otherwise `msg.value` is rejected
     * to avoid stuck value in the contract.
     *
     * Emits an {IERC1967-Upgraded} event.
     */
    function upgradeToAndCall(address newImplementation, bytes memory data) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);

        if (data.length > 0) {
            Address.functionDelegateCall(newImplementation, data);
        } else {
            _checkNonPayable();
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1.
     */
    // solhint-disable-next-line private-vars-leading-underscore
    bytes32 internal constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Returns the current admin.
     *
     * TIP: To get this value clients can read directly from the storage slot shown below (specified by EIP1967) using
     * the https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call.
     * `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`
     */
    function getAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        if (newAdmin == address(0)) {
            revert ERC1967InvalidAdmin(address(0));
        }
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {IERC1967-AdminChanged} event.
     */
    function changeAdmin(address newAdmin) internal {
        emit AdminChanged(getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is the keccak-256 hash of "eip1967.proxy.beacon" subtracted by 1.
     */
    // solhint-disable-next-line private-vars-leading-underscore
    bytes32 internal constant BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Returns the current beacon.
     */
    function getBeacon() internal view returns (address) {
        return StorageSlot.getAddressSlot(BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        if (newBeacon.code.length == 0) {
            revert ERC1967InvalidBeacon(newBeacon);
        }

        StorageSlot.getAddressSlot(BEACON_SLOT).value = newBeacon;

        address beaconImplementation = IBeacon(newBeacon).implementation();
        if (beaconImplementation.code.length == 0) {
            revert ERC1967InvalidImplementation(beaconImplementation);
        }
    }

    /**
     * @dev Change the beacon and trigger a setup call if data is nonempty.
     * This function is payable only if the setup call is performed, otherwise `msg.value` is rejected
     * to avoid stuck value in the contract.
     *
     * Emits an {IERC1967-BeaconUpgraded} event.
     *
     * CAUTION: Invoking this function has no effect on an instance of {BeaconProxy} since v5, since
     * it uses an immutable beacon without looking at the value of the ERC-1967 beacon slot for
     * efficiency.
     */
    function upgradeBeaconToAndCall(address newBeacon, bytes memory data) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);

        if (data.length > 0) {
            Address.functionDelegateCall(IBeacon(newBeacon).implementation(), data);
        } else {
            _checkNonPayable();
        }
    }

    /**
     * @dev Reverts if `msg.value` is not zero. It can be used to avoid `msg.value` stuck in the contract
     * if an upgrade doesn't perform an initialization call.
     */
    function _checkNonPayable() private {
        if (msg.value > 0) {
            revert ERC1967NonPayable();
        }
    }
}

abstract contract UUPSUpgradeable is Initializable, IERC1822Proxiable {
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    address private immutable __self = address(this);

    /**
     * @dev The version of the upgrade interface of the contract. If this getter is missing, both `upgradeTo(address)`
     * and `upgradeToAndCall(address,bytes)` are present, and `upgradeTo` must be used if no function should be called,
     * while `upgradeToAndCall` will invoke the `receive` function if the second argument is the empty byte string.
     * If the getter returns `"5.0.0"`, only `upgradeToAndCall(address,bytes)` is present, and the second argument must
     * be the empty byte string if no function should be called, making it impossible to invoke the `receive` function
     * during an upgrade.
     */
    string public constant UPGRADE_INTERFACE_VERSION = "5.0.0";

    /**
     * @dev The call is from an unauthorized context.
     */
    error UUPSUnauthorizedCallContext();

    /**
     * @dev The storage `slot` is unsupported as a UUID.
     */
    error UUPSUnsupportedProxiableUUID(bytes32 slot);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        _checkProxy();
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        _checkNotDelegated();
        _;
    }

    function __UUPSUpgradeable_init() internal onlyInitializing {
    }

    function __UUPSUpgradeable_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate the implementation's compatibility when performing an upgrade.
     *
     * IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual notDelegated returns (bytes32) {
        return ERC1967Utils.IMPLEMENTATION_SLOT;
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
        _upgradeToAndCallUUPS(newImplementation, data);
    }

    /**
     * @dev Reverts if the execution is not performed via delegatecall or the execution
     * context is not of a proxy with an ERC1967-compliant implementation pointing to self.
     * See {_onlyProxy}.
     */
    function _checkProxy() internal view virtual {
        if (
            address(this) == __self || // Must be called through delegatecall
            ERC1967Utils.getImplementation() != __self // Must be called through an active proxy
        ) {
            revert UUPSUnauthorizedCallContext();
        }
    }

    /**
     * @dev Reverts if the execution is performed via delegatecall.
     * See {notDelegated}.
     */
    function _checkNotDelegated() internal view virtual {
        if (address(this) != __self) {
            // Must not be called through delegatecall
            revert UUPSUnauthorizedCallContext();
        }
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;

    /**
     * @dev Performs an implementation upgrade with a security check for UUPS proxies, and additional setup call.
     *
     * As a security check, {proxiableUUID} is invoked in the new implementation, and the return value
     * is expected to be the implementation slot in ERC1967.
     *
     * Emits an {IERC1967-Upgraded} event.
     */
    function _upgradeToAndCallUUPS(address newImplementation, bytes memory data) private {
        try IERC1822Proxiable(newImplementation).proxiableUUID() returns (bytes32 slot) {
            if (slot != ERC1967Utils.IMPLEMENTATION_SLOT) {
                revert UUPSUnsupportedProxiableUUID(slot);
            }
            ERC1967Utils.upgradeToAndCall(newImplementation, data);
        } catch {
            // The implementation is not UUPS
            revert ERC1967Utils.ERC1967InvalidImplementation(newImplementation);
        }
    }
}

contract ChainOracle is UUPSUpgradeable, OwnableUpgradeable {
    /// @notice The Canonical State Chain contract.
    ICanonicalStateChain public canonicalStateChain;

    /// @notice The Data Availability Oracle contract.
    IDAOracle public daOracle;

    /// @notice The RLP Reader contract.
    IRLPReader public rlpReader;

    /// @notice The SharesProof struct.
    /// @param start - The start index of the shares in the block.
    /// @param end - The end index of the shares in the block.
    struct ShareRange {
        uint256 start;
        uint256 end;
    }

    /// @notice An L2 Header.
    /// @param parentHash - The hash of the parent block.
    /// @param uncleHash - The hash of the uncle block.
    /// @param beneficiary - The address of the beneficiary.
    /// @param stateRoot - The state root hash.
    /// @param transactionsRoot - The transactions root hash.
    /// @param receiptsRoot - The receipts root hash.
    /// @param logsBloom - The logs bloom filter.
    /// @param difficulty - The difficulty of the block.
    /// @param number - The block number.
    /// @param gasLimit - The gas limit of the block.
    /// @param gasUsed - The gas used in the block.
    /// @param timestamp - The timestamp of the block.
    /// @param extraData - The extra data of the block.
    /// @param mixHash - The mix hash of the block.
    /// @param nonce - The nonce of the block.
    struct L2Header {
        bytes32 parentHash;
        bytes32 uncleHash;
        address beneficiary;
        bytes32 stateRoot;
        bytes32 transactionsRoot;
        bytes32 receiptsRoot;
        bytes logsBloom;
        uint256 difficulty;
        uint256 number;
        uint256 gasLimit;
        uint256 gasUsed;
        uint256 timestamp;
        bytes extraData;
        bytes32 mixHash;
        uint256 nonce;
    }

    /// @notice A Legacy Transaction.
    /// @param nonce - The nonce of the transaction.
    /// @param gasPrice - The gas price of the transaction.
    /// @param gas - The gas limit of the transaction.
    /// @param to - The address of the recipient.
    /// @param value - The value of the transaction.
    /// @param data - The data of the transaction.
    /// @param r - The r value of the signature.
    /// @param s - The s value of the signature.
    /// @param v - The v value of the signature.
    struct LegacyTx {
        uint64 nonce;
        uint256 gasPrice;
        uint64 gas;
        address to;
        uint256 value;
        bytes data;
        uint256 r;
        uint256 s;
        uint256 v;
    }

    /// @notice A Deposit Transaction.
    /// @param chainId - The chain ID of the transaction.
    /// @param nonce - The nonce of the transaction.
    /// @param gasPrice - The gas price of the transaction.
    /// @param gas - The gas limit of the transaction.
    /// @param to - The address of the recipient.
    /// @param value - The value of the transaction.
    /// @param data - The data of the transaction.
    /// @param r - The r value of the signature.
    /// @param s - The s value of the signature.
    /// @param v - The v value of the signature.
    struct DepositTx {
        uint256 chainId;
        uint64 nonce;
        uint256 gasPrice;
        uint64 gas;
        address to;
        uint256 value;
        bytes data;
        uint256 r;
        uint256 s;
        uint256 v;
    }

    /// @notice Stores shares that are provided to the contract.
    mapping(bytes32 => bytes[]) public shares;

    /// @notice Stores headers that are provided to the contract.
    mapping(bytes32 => L2Header) public headers;

    /// @notice Stores transactions that are provided to the contract.
    mapping(bytes32 => DepositTx) public transactions;

    /// @notice Stores the sharekey to rblock mapping.
    /// @dev a special mapping of sharekey to rblock
    mapping(bytes32 => bytes32) private _sharekeyToRblock;

    /// @notice Stores the header to rblock mapping.
    mapping(bytes32 => bytes32) public headerToRblock;

    /// @notice This function is a special internal function that's part of
    ///         the UUPS upgradeable contract's lifecycle. When you want to
    ///         upgrade the contract to a new version, _authorizeUpgrade is
    ///         called to check whether the upgrade is authorized, thus
    ///         preventing anyone from just upgrading the contract.
    /// @dev Only the owner can call this function.
    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @notice Initializes the contract with the canonical state chain, the data
    ///         availability oracle, and the RLP reader.
    /// @param _canonicalStateChain - The address of the canonical state chain.
    /// @param _daOracle - The address of the data availability oracle.
    /// @param _rlpReader - The address of the RLP reader.
    function initialize(
        address _canonicalStateChain,
        address _daOracle,
        address _rlpReader
    ) public initializer {
        __Ownable_init(msg.sender);
        canonicalStateChain = ICanonicalStateChain(_canonicalStateChain);
        daOracle = IDAOracle(_daOracle);
        rlpReader = IRLPReader(_rlpReader);
    }

    /// @notice Loads some shares that were uploaded to the Data
    ///         Availability layer. It verifies the shares are included in a
    ///         given rblock (bundle) and stores them in the contract.
    /// @param _rblock - The rblock (bundle) that the shares are related to.
    /// @param _pointer - The pointer to the shares in the rblock.
    /// @param _proof - The proof that the shares are available and part of the
    ///               rblocks dataroot commitment.
    /// @return The share key that the shares are stored under.
    function provideShares(
        bytes32 _rblock,
        uint8 _pointer,
        SharesProof memory _proof
    ) public returns (bytes32) {
        // 1. Load the rblock (bundle) from the canonical state chain.
        ICanonicalStateChain.Header memory rHead = canonicalStateChain
            .getHeaderByHash(_rblock);
        require(rHead.epoch > 0, "rblock not found");
        require(
            rHead.celestiaPointers[_pointer].height ==
                _proof.attestationProof.tuple.height,
            "rblock height mismatch"
        );

        // 2. verify shares are valid
        (bool verified, ) = DAVerifier.verifySharesToDataRootTupleRoot(
            daOracle,
            _proof,
            _proof.attestationProof.tuple.dataRoot
        );
        require(verified, "shares not verified");

        (uint256 squaresize, ) = DAVerifier.computeSquareSizeFromRowProof(
            _proof.rowProofs[0]
        );

        // check that the share index is within the celestia pointer range.
        uint64 shareStart = rHead.celestiaPointers[_pointer].shareStart;
        uint64 shareEnd = shareStart +
            rHead.celestiaPointers[_pointer].shareLen;
        uint256 shareIndexInRow = _proof.shareProofs[0].beginKey;
        uint256 shareIndexInRowMajorOrder = shareIndexInRow +
            squaresize *
            _proof.rowProofs[0].key;
        require(
            shareIndexInRowMajorOrder >= shareStart &&
                shareIndexInRowMajorOrder < shareEnd,
            "provided share must be within the celestia pointer range"
        );

        // 3. create a share by hashing the rblock and shares
        bytes32 shareKey = ShareKey(_rblock, _proof.data);

        // 4. store the shares
        shares[shareKey] = _proof.data;

        // 5. store the sharekey to rblock
        _sharekeyToRblock[shareKey] = _rblock;

        return shareKey;
    }

    /// @notice Decodes the shares into an L2 header and stores it
    ///         in the contract.
    /// @param _shareKey - The share key that the header is related to.
    /// @param _range - The range of the shares that contain the header.
    /// @return The hash of the header.
    function provideHeader(
        bytes32 _shareKey,
        ShareRange[] calldata _range
    ) public returns (bytes32) {
        bytes[] storage shareData = shares[_shareKey];
        require(shareData.length > 0, "share not found");

        // 1. Decode the RLP header.
        L2Header memory header = decodeRLPHeader(
            extractData(shareData, _range)
        );
        require(header.number > 0, "header number is 0");

        // 2. Hash the header.
        bytes32 headerHash = hashHeader(header);

        // 3. Store the header.
        require(headers[headerHash].number == 0, "header already exists");
        headers[headerHash] = header;

        // 4. Store the header to rblock
        headerToRblock[headerHash] = _sharekeyToRblock[_shareKey];

        return headerHash;
    }

    /// @notice Decodes the shares into a transaction and stores it
    ///         in the contract.
    /// @param _shareKey - The share key that the transaction is related to.
    /// @param _range - The range of the shares that contain the transaction.
    /// @return The hash of the transaction.
    function provideLegacyTx(
        bytes32 _shareKey,
        ShareRange[] calldata _range
    ) public returns (bytes32) {
        bytes[] storage shareData = shares[_shareKey];
        require(shareData.length > 0, "share not found");

        // 1. Extract the RLP transaction from the shares.
        bytes memory rlpTx = extractData(shareData, _range);

        // 2. Decode the RLP transaction.
        LegacyTx memory ltx = decodeLegacyTx(rlpTx);

        // 3. Hash the transaction.
        bytes32 txHash = keccak256(rlpTx);

        // 4. Store the transaction.
        require(transactions[txHash].nonce == 0, "transaction already exists");
        transactions[txHash] = DepositTx({
            chainId: 0,
            nonce: ltx.nonce,
            gasPrice: ltx.gasPrice,
            gas: ltx.gas,
            to: ltx.to,
            value: ltx.value,
            data: ltx.data,
            r: ltx.r,
            s: ltx.s,
            v: ltx.v
        });

        return txHash;
    }

    /// @notice Calulates the share key from the rblock and share data.
    /// @param _rblock - The rblock that the shares are related to.
    /// @param _shareData - The share data.
    /// @return The share key.
    function ShareKey(
        bytes32 _rblock,
        bytes[] memory _shareData
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_rblock, _shareData));
    }

    /// TODO: Move to a library
    /// @notice Extracts the data from the shares using the range.
    /// @param raw - The raw data.
    /// @param ranges - The ranges of the data.
    /// @return The extracted data.
    function extractData(
        bytes[] memory raw,
        ShareRange[] memory ranges
    ) public pure returns (bytes memory) {
        // figure out the length of the data
        uint256 length = 0;
        for (uint i = 0; i < ranges.length; i++) {
            ShareRange memory r = ranges[i];
            length += r.end - r.start;
        }

        // copy the data using the ranges
        bytes memory data = new bytes(length);
        uint256 index = 0;
        for (uint i = 0; i < ranges.length; i++) {
            ShareRange memory r = ranges[i];

            // Ensure that the range is valid for the corresponding raw data
            require(r.end <= raw[i].length, "Invalid range");

            for (uint j = r.start; j < r.end; j++) {
                data[index] = raw[i][j];
                index++;
            }
        }

        return data;
    }

    /// @notice Decodes an RLP header into the Header struct.
    /// @param _data - The RLP encoded header.
    /// @return The decoded header.
    function decodeRLPHeader(
        bytes memory _data
    ) public view returns (L2Header memory) {
        (
            bytes32 parentHash,
            bytes32 sha3Uncles,
            address coinbase,
            bytes32 stateRoot,
            bytes32 transactionsRoot,
            bytes32 receiptsRoot,
            uint difficulty,
            uint number,
            uint gasLimit,
            uint gasUsed,
            uint timestamp,
            uint nonce
        ) = rlpReader.toBlockHeader(_data);
        L2Header memory header = L2Header({
            parentHash: parentHash,
            uncleHash: sha3Uncles,
            beneficiary: coinbase,
            stateRoot: stateRoot,
            transactionsRoot: transactionsRoot,
            receiptsRoot: receiptsRoot,
            logsBloom: bytes(
                abi.encodePacked(
                    bytes32(0),
                    bytes32(0),
                    bytes32(0),
                    bytes32(0),
                    bytes32(0),
                    bytes32(0),
                    bytes32(0),
                    bytes32(0)
                )
            ),
            difficulty: difficulty,
            number: number,
            gasLimit: gasLimit,
            gasUsed: gasUsed,
            timestamp: timestamp,
            extraData: bytes(""),
            mixHash: bytes32(0),
            nonce: nonce
        });
        return header;
    }

    /// @notice Hashes an Ethereum header in the same way that it is hashed on Ethereum.
    /// @param _header - The header to hash.
    /// @return The hash of the header.
    function hashHeader(L2Header memory _header) public pure returns (bytes32) {
        bytes[] memory list = new bytes[](15);
        list[0] = RLPEncode.encodeBytes(abi.encodePacked(_header.parentHash));
        list[1] = RLPEncode.encodeBytes(abi.encodePacked(_header.uncleHash));
        list[2] = RLPEncode.encodeAddress(_header.beneficiary);
        list[3] = RLPEncode.encodeBytes(abi.encodePacked(_header.stateRoot));
        list[4] = RLPEncode.encodeBytes(
            abi.encodePacked(_header.transactionsRoot)
        );
        list[5] = RLPEncode.encodeBytes(abi.encodePacked(_header.receiptsRoot));
        list[6] = RLPEncode.encodeBytes(_header.logsBloom);
        list[7] = RLPEncode.encodeUint(_header.difficulty);
        list[8] = RLPEncode.encodeUint(_header.number);
        list[9] = RLPEncode.encodeUint(_header.gasLimit);
        list[10] = RLPEncode.encodeUint(_header.gasUsed);
        list[11] = RLPEncode.encodeUint(_header.timestamp);
        list[12] = RLPEncode.encodeBytes(_header.extraData);
        list[13] = RLPEncode.encodeBytes(abi.encodePacked(_header.mixHash));
        list[14] = RLPEncode.encodeUint(_header.nonce);
        return keccak256(RLPEncode.encodeList(list));
    }

    /// @notice Decodes a legacy transaction from RLP encoded data.
    /// @param _data - The RLP encoded transaction.
    /// @return The decoded transaction.
    function decodeLegacyTx(
        bytes memory _data
    ) public view returns (LegacyTx memory) {
        (
            uint nonce,
            uint gasPrice,
            uint gasLimit,
            address to,
            uint value,
            bytes memory data,
            uint v,
            uint r,
            uint s
        ) = rlpReader.toLegacyTx(_data);

        LegacyTx memory ltx = LegacyTx({
            nonce: uint64(nonce),
            gasPrice: gasPrice,
            gas: uint64(gasLimit),
            to: to,
            value: value,
            data: data,
            r: uint256(r),
            s: uint256(s),
            v: v
        });

        return ltx;
    }

    /// @notice Decodes a deposit transaction from RLP encoded data.
    /// @param _data - The RLP encoded transaction.
    /// @return The decoded transaction.
    function decodeDepositTx(
        bytes memory _data
    ) public view returns (DepositTx memory) {
        (
            uint256 chainId,
            uint nonce,
            uint gasPrice,
            uint gasLimit,
            address to,
            uint value,
            bytes memory data,
            uint8 v,
            bytes32 r,
            bytes32 s
        ) = rlpReader.toDepositTx(_data);
        DepositTx memory dtx = DepositTx({
            chainId: chainId,
            nonce: uint64(nonce),
            gasPrice: gasPrice,
            gas: uint64(gasLimit),
            to: to,
            value: value,
            data: data,
            r: uint256(r),
            s: uint256(s),
            v: v
        });
        return dtx;
    }

    /// @notice Returns the header for a given header hash.
    /// @param _headerHash - The hash of the header.
    /// @return The header.
    function getHeader(
        bytes32 _headerHash
    ) public view returns (L2Header memory) {
        return headers[_headerHash];
    }

    /// @notice Returns the transaction for a given transaction hash.
    /// @param _txHash - The hash of the transaction.
    /// @return The transaction.
    function getTransaction(
        bytes32 _txHash
    ) public view returns (DepositTx memory) {
        return transactions[_txHash];
    }

    /// @notice Sets the RLPReader contract address.
    /// @param _rlpReader - The new RLPReader address.
    /// @dev Only the owner can call this function.
    function setRLPReader(address _rlpReader) public onlyOwner {
        rlpReader = IRLPReader(_rlpReader);
    }

    /// @notice Sets the data availability oracle contract address.
    /// @param _daOracle The new data availability oracle address.
    /// @dev Only the owner can call this function.
    function setDAOracle(address _daOracle) public onlyOwner {
        daOracle = IDAOracle(_daOracle);
    }

    uint256[50] private __gap;
}