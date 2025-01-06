// SPDX-License-Identifier: Unknown
pragma solidity 0.8.19;

library Messages {
    function messageHash(
        uint8 kind,
        address sender,
        uint64 blockNumber,
        uint64 timestamp,
        uint256 inboxSeqNum,
        uint256 baseFeeL1,
        bytes32 messageDataHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    kind,
                    sender,
                    blockNumber,
                    timestamp,
                    inboxSeqNum,
                    baseFeeL1,
                    messageDataHash
                )
            );
    }

    function accumulateInboxMessage(bytes32 prevAcc, bytes32 message)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(prevAcc, message));
    }
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

struct NamespaceMerkleProof {
    // List of side nodes to verify and calculate tree.
    NamespaceNode[] sideNodes;
    // The key of the leaf to verify.
    uint256 key;
    // The number of leaves in the tree
    uint256 numLeaves;
}

function leafDigest(
    Namespace memory namespace,
    bytes memory data
) pure returns (NamespaceNode memory) {
    bytes32 digest = sha256(
        abi.encodePacked(Constants.LEAF_PREFIX, namespace.toBytes(), data)
    );
    NamespaceNode memory node = NamespaceNode(namespace, namespace, digest);
    return node;
}

function namespaceNodeEquals(
    NamespaceNode memory first,
    NamespaceNode memory second
) pure returns (bool) {
    return
        first.min.equalTo(second.min) &&
        first.max.equalTo(second.max) &&
        (first.digest == second.digest);
}

function namespaceMin(
    Namespace memory l,
    Namespace memory r
) pure returns (Namespace memory) {
    if (l.lessThan(r)) {
        return l;
    } else {
        return r;
    }
}

function PARITY_SHARE_NAMESPACE() pure returns (Namespace memory) {
    return
        Namespace(
            0xFF,
            0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
        );
}

function namespaceMax(
    Namespace memory l,
    Namespace memory r
) pure returns (Namespace memory) {
    if (l.greaterThan(r)) {
        return l;
    } else {
        return r;
    }
}

function nodeDigest(
    NamespaceNode memory l,
    NamespaceNode memory r
) pure returns (NamespaceNode memory) {
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

struct NamespaceMerkleMultiproof {
    // The beginning key of the leaves to verify.
    uint256 beginKey;
    // The ending key of the leaves to verify.
    uint256 endKey;
    // List of side nodes to verify and calculate tree.
    NamespaceNode[] sideNodes;
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
        } else if (
            proof.sideNodes.length + heightOffset !=
            pathLengthFromKey(proof.key, proof.numLeaves)
        ) {
            return false;
        }

        // Check key is in tree
        if (proof.key >= proof.numLeaves) {
            return false;
        }
        // Handle case where proof is empty: i.e, only one leaf exists, so verify hash(data) is root
        if (proof.sideNodes.length == 0) {
            if (proof.numLeaves == 1) {
                return namespaceNodeEquals(root, node);
            } else {
                return false;
            }
        }

        // The case where inner node is actually the root of a tree with more than one node is not relevant
        // to our use case, since the only case where an inner node is the root of the tree is when the tree
        // has only one inner node. So, there is no need to handle that case.

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

            uint256 subTreeStartIndex = (proof.key / (1 << height)) *
                (1 << height);
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
            if (proof.key - subTreeStartIndex < (1 << (height - 1))) {
                node = nodeDigest(
                    node,
                    proof.sideNodes[height - heightOffset - 1]
                );
            } else {
                node = nodeDigest(
                    proof.sideNodes[height - heightOffset - 1],
                    node
                );
            }

            height += 1;
        }

        // Determine if the next hash belongs to an orphan that was elevated. This
        // is the case IFF 'stableEnd' (the last index of the largest full subtree)
        // is equal to the number of leaves in the Merkle tree.
        if (stableEnd != proof.numLeaves - 1) {
            if (proof.sideNodes.length <= height - heightOffset - 1) {
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
        NamespaceNode[] memory leftSubtrees = new NamespaceNode[](
            proof.sideNodes.length
        );

        for (
            uint256 i = 0;
            leafIndex != proof.beginKey && i < proof.sideNodes.length;
            ++i
        ) {
            uint256 subtreeSize = _nextSubtreeSize(leafIndex, proof.beginKey);
            leftSubtrees[i] = proof.sideNodes[i];
            leafIndex += subtreeSize;
        }

        // estimate the leaf size of the subtree containing the proof range
        uint256 proofRangeSubtreeEstimate = _getSplitPoint(proof.endKey) * 2;
        if (proofRangeSubtreeEstimate < 1) {
            proofRangeSubtreeEstimate = 1;
        }

        (NamespaceNode memory rootHash, uint256 proofHead, , ) = _computeRoot(
            proof,
            leafNodes,
            0,
            proofRangeSubtreeEstimate,
            0,
            0
        );
        for (uint256 i = proofHead; i < proof.sideNodes.length; ++i) {
            rootHash = nodeDigest(rootHash, proof.sideNodes[i]);
        }

        return namespaceNodeEquals(rootHash, root);
    }

    /// @notice Returns the size of the subtree adjacent to `begin` that does
    /// not overlap `end`.
    /// @param begin Begin index, inclusive.
    /// @param end End index, exclusive.
    function _nextSubtreeSize(
        uint256 begin,
        uint256 end
    ) private pure returns (uint256) {
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
                return
                    _popLeavesIfNonEmpty(
                        leafNodes,
                        headLeaves,
                        leafNodes.length,
                        headProof
                    );
            }

            // if current range does not overlap with proof range,
            // pop and return a proof node (leaf) if present,
            // else return nil because leaf doesn't exist
            return
                _popProofIfNonEmpty(
                    proof.sideNodes,
                    headProof,
                    end,
                    headLeaves
                );
        }

        // if current range does not overlap with proof range,
        // pop and return a proof node if present,
        // else return nil because subtree doesn't exist
        if (end <= proof.beginKey || begin >= proof.endKey) {
            return
                _popProofIfNonEmpty(
                    proof.sideNodes,
                    headProof,
                    end,
                    headLeaves
                );
        }

        // Recursively get left and right subtree
        uint256 k = _getSplitPoint(end - begin);
        (
            NamespaceNode memory left,
            uint256 newHeadProofLeft,
            uint256 newHeadLeavesLeft,

        ) = _computeRoot(
                proof,
                leafNodes,
                begin,
                begin + k,
                headProof,
                headLeaves
            );
        (
            NamespaceNode memory right,
            uint256 newHeadProof,
            uint256 newHeadLeaves,
            bool rightIsNil
        ) = _computeRoot(
                proof,
                leafNodes,
                begin + k,
                end,
                newHeadProofLeft,
                newHeadLeavesLeft
            );

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
    function _popLeavesIfNonEmpty(
        NamespaceNode[] memory nodes,
        uint256 headLeaves,
        uint256 end,
        uint256 headProof
    ) private pure returns (NamespaceNode memory, uint256, uint256, bool) {
        (
            NamespaceNode memory node,
            uint256 newHead,
            bool isNil
        ) = _popIfNonEmpty(nodes, headLeaves, end);
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
    function _popProofIfNonEmpty(
        NamespaceNode[] memory nodes,
        uint256 headProof,
        uint256 end,
        uint256 headLeaves
    ) private pure returns (NamespaceNode memory, uint256, uint256, bool) {
        (
            NamespaceNode memory node,
            uint256 newHead,
            bool isNil
        ) = _popIfNonEmpty(nodes, headProof, end);
        return (node, newHead, headLeaves, isNil);
    }

    /// @notice Pop from an array slice if it's not empty.
    /// @param nodes Entire array.
    /// @param head Head of array slice.
    /// @param end End of array slice.
    /// @return _ Popped node.
    /// @return _ New head of array slice.
    /// @return _ If the popped node is "nil."
    function _popIfNonEmpty(
        NamespaceNode[] memory nodes,
        uint256 head,
        uint256 end
    ) private pure returns (NamespaceNode memory, uint256, bool) {
        if (nodes.length == 0 || head >= nodes.length || head >= end) {
            NamespaceNode memory node;
            return (node, head, true);
        }
        return (nodes[head], head + 1, false);
    }
}

struct DataRootTuple {
    // Celestia block height the data root was included in.
    // Genesis block is height = 0.
    // First queryable block is height = 1.
    uint256 height;
    // Data root.
    bytes32 dataRoot;
}

struct AttestationProof {
    // the attestation nonce that commits to the data root tuple.
    uint256 tupleRootNonce;
    // the data root tuple that was committed to.
    DataRootTuple tuple;
    // the binary merkle proof of the tuple to the commitment.
    BinaryMerkleProof proof;
}

struct BinaryMerkleProof {
    // List of side nodes to verify and calculate tree.
    bytes32[] sideNodes;
    // The key of the leaf to verify.
    uint256 key;
    // The number of leaves in the tree
    uint256 numLeaves;
}

function getStartingBit(uint256 numLeaves) pure returns (uint256 startingBit) {
    // Determine height of the left subtree. This is the maximum path length, so all paths start at this offset from the right-most bit
    startingBit = 0;
    while ((1 << startingBit) < numLeaves) {
        startingBit += 1;
    }
    return Constants.MAX_HEIGHT - startingBit;
}

function pathLengthFromKey(
    uint256 key,
    uint256 numLeaves
) pure returns (uint256 pathLength) {
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
        return
            1 +
            pathLengthFromKey(
                key - numLeavesLeftSubTree,
                numLeaves - numLeavesLeftSubTree
            );
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
    function verify(
        bytes32 root,
        BinaryMerkleProof memory proof,
        bytes memory data
    ) internal pure returns (bool, ErrorCodes) {
        // Check proof is correct length for the key it is proving
        if (proof.numLeaves <= 1) {
            if (proof.sideNodes.length != 0) {
                return (false, ErrorCodes.InvalidNumberOfSideNodes);
            }
        } else if (
            proof.sideNodes.length !=
            pathLengthFromKey(proof.key, proof.numLeaves)
        ) {
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

        (bytes32 computedHash, ErrorCodes error) = computeRootHash(
            proof.key,
            proof.numLeaves,
            digest,
            proof.sideNodes
        );

        if (error != ErrorCodes.NoError) {
            return (false, error);
        }

        return (computedHash == root, ErrorCodes.NoError);
    }

    /// @notice Use the leafHash and innerHashes to get the root merkle hash.
    /// If the length of the innerHashes slice isn't exactly correct, the result is nil.
    /// Recursive impl.
    function computeRootHash(
        uint256 key,
        uint256 numLeaves,
        bytes32 leafHash,
        bytes32[] memory sideNodes
    ) private pure returns (bytes32, ErrorCodes) {
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
        bytes32[] memory sideNodesLeft = slice(
            sideNodes,
            0,
            sideNodes.length - 1
        );
        ErrorCodes error;
        if (key < numLeft) {
            bytes32 leftHash;
            (leftHash, error) = computeRootHash(
                key,
                numLeft,
                leafHash,
                sideNodesLeft
            );
            if (error != ErrorCodes.NoError) {
                return (leafHash, error);
            }
            return (
                nodeDigest(leftHash, sideNodes[sideNodes.length - 1]),
                ErrorCodes.NoError
            );
        }
        bytes32 rightHash;
        (rightHash, error) = computeRootHash(
            key - numLeft,
            numLeaves - numLeft,
            leafHash,
            sideNodesLeft
        );
        if (error != ErrorCodes.NoError) {
            return (leafHash, error);
        }
        return (
            nodeDigest(sideNodes[sideNodes.length - 1], rightHash),
            ErrorCodes.NoError
        );
    }

    /// @notice creates a slice of bytes32 from the data slice of bytes32 containing the elements
    /// that correspond to the provided range.
    /// It selects a half-open range which includes the begin element, but excludes the end one.
    /// @param _data The slice that we want to select data from.
    /// @param _begin The beginning of the range (inclusive).
    /// @param _end The ending of the range (exclusive).
    /// @return _ the sliced data.
    function slice(
        bytes32[] memory _data,
        uint256 _begin,
        uint256 _end
    ) internal pure returns (bytes32[] memory) {
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
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifySharesToDataRootTupleRoot(
        IDAOracle _bridge,
        SharesProof memory _sharesProof
    ) internal view returns (bool, ErrorCodes) {
        // checking that the data root was committed to by the Blobstream smart contract.
        (bool success, ErrorCodes errorCode) = verifyMultiRowRootsToDataRootTupleRoot(
            _bridge,
            _sharesProof.rowRoots,
            _sharesProof.rowProofs,
            _sharesProof.attestationProof
        );
        if (!success) {
            return (false, errorCode);
        }

        (bool valid, ErrorCodes error) = verifySharesToDataRootTupleRootProof(
            _sharesProof.data,
            _sharesProof.shareProofs,
            _sharesProof.namespace,
            _sharesProof.rowRoots,
            _sharesProof.rowProofs,
            _sharesProof.attestationProof.tuple.dataRoot
        );

        return (valid, error);
    }

    /// @notice Verifies the shares to data root tuple root proof.
    /// NOTE: This doesn't authenticate the proof to Blobstream. It only verifies if the proof is valid.
    /// @param _data The data that needs to proven.
    /// @param _shareProofs The share to the row roots proof.
    /// @param _namespace The namespace of the shares.
    /// @param _rowRoots The row roots where the shares belong.
    /// @param _rowProofs The proofs of the rowRoots to the data root.
    /// @param _root The data root of the block that contains the shares.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifySharesToDataRootTupleRootProof(
        bytes[] memory _data,
        NamespaceMerkleMultiproof[] memory _shareProofs,
        Namespace memory _namespace,
        NamespaceNode[] memory _rowRoots,
        BinaryMerkleProof[] memory _rowProofs,
        bytes32 _root
    ) internal pure returns (bool, ErrorCodes) {
        // verifying the row root to data root tuple root proof.
        (bool success, ErrorCodes errorCode) = verifyMultiRowRootsToDataRootTupleRootProof(
            _rowRoots,
            _rowProofs,
            _root
        );
        if (!success) {
            return (false, errorCode);
        }

        // checking that the shares were committed to by the rows roots.
        if (_shareProofs.length != _rowRoots.length) {
            return (false, ErrorCodes.UnequalShareProofsAndRowRootsNumber);
        }

        uint256 numberOfSharesInProofs = 0;
        for (uint256 i = 0; i < _shareProofs.length; i++) {
            numberOfSharesInProofs += _shareProofs[i].endKey - _shareProofs[i].beginKey;
        }

        if (_data.length != numberOfSharesInProofs) {
            return (false, ErrorCodes.UnequalDataLengthAndNumberOfSharesProofs);
        }

        uint256 cursor = 0;
        for (uint256 i = 0; i < _shareProofs.length; i++) {
            uint256 sharesUsed = _shareProofs[i].endKey - _shareProofs[i].beginKey;
            (bytes[] memory s, ErrorCodes err) = slice(_data, cursor, cursor + sharesUsed);
            if (err != ErrorCodes.NoError) {
                return (false, err);
            }
            if (!NamespaceMerkleTree.verifyMulti(_rowRoots[i], _shareProofs[i], _namespace, s)) {
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
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyRowRootToDataRootTupleRoot(
        IDAOracle _bridge,
        NamespaceNode memory _rowRoot,
        BinaryMerkleProof memory _rowProof,
        AttestationProof memory _attestationProof
    ) internal view returns (bool, ErrorCodes) {
        // checking that the data root was committed to by the Blobstream smart contract
        if (
            !_bridge.verifyAttestation(
                _attestationProof.tupleRootNonce,
                _attestationProof.tuple,
                _attestationProof.proof
            )
        ) {
            return (false, ErrorCodes.InvalidDataRootTupleToDataRootTupleRootProof);
        }

        (bool valid, ErrorCodes error) = verifyRowRootToDataRootTupleRootProof(
            _rowRoot,
            _rowProof,
            _attestationProof.tuple.dataRoot
        );

        return (valid, error);
    }

    /// @notice Verifies that a row/column root proof, from a Celestia block, to the data root tuple root.
    /// NOTE: This doesn't authenticate the proof to Blobstream. It only verifies if the proof is valid.
    /// @param _rowRoot The row/column root to be proven.
    /// @param _rowProof The proof of the row/column root to the data root.
    /// @param _root The data root of the block that contains the row.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyRowRootToDataRootTupleRootProof(
        NamespaceNode memory _rowRoot,
        BinaryMerkleProof memory _rowProof,
        bytes32 _root
    ) internal pure returns (bool, ErrorCodes) {
        bytes memory rowRoot = abi.encodePacked(
            _rowRoot.min.toBytes(),
            _rowRoot.max.toBytes(),
            _rowRoot.digest
        );
        (bool valid, ) = BinaryMerkleTree.verify(_root, _rowProof, rowRoot);
        if (!valid) {
            return (false, ErrorCodes.InvalidRowToDataRootProof);
        }

        return (true, ErrorCodes.NoError);
    }

    /// @notice Verifies that a set of rows/columns, from a Celestia block, were committed to by the Blobstream smart contract.
    /// @param _bridge The Blobstream smart contract instance.
    /// @param _rowRoots The set of row/column roots to be proved.
    /// @param _rowProofs The set of proofs of the _rowRoots in the same order.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyMultiRowRootsToDataRootTupleRoot(
        IDAOracle _bridge,
        NamespaceNode[] memory _rowRoots,
        BinaryMerkleProof[] memory _rowProofs,
        AttestationProof memory _attestationProof
    ) internal view returns (bool, ErrorCodes) {
        // checking that the data root was committed to by the Blobstream smart contract
        if (
            !_bridge.verifyAttestation(
                _attestationProof.tupleRootNonce,
                _attestationProof.tuple,
                _attestationProof.proof
            )
        ) {
            return (false, ErrorCodes.InvalidDataRootTupleToDataRootTupleRootProof);
        }

        // checking that the rows roots commit to the data root.
        (bool valid, ErrorCodes error) = verifyMultiRowRootsToDataRootTupleRootProof(
            _rowRoots,
            _rowProofs,
            _attestationProof.tuple.dataRoot
        );

        return (valid, error);
    }

    /// @notice Verifies the proof a set of rows/columns, from a Celestia block, to their corresponding data root.
    /// NOTE: This doesn't authenticate the proof to Blobstream. It only verifies if the proof is valid.
    /// @param _rowRoots The set of row/column roots to be proved.
    /// @param _rowProofs The set of proofs of the _rowRoots in the same order.
    /// @param _root The data root of the block that contains the rows.
    /// @return `true` if the proof is valid, `false` otherwise.
    /// @return an error code if the proof is invalid, ErrorCodes.NoError otherwise.
    function verifyMultiRowRootsToDataRootTupleRootProof(
        NamespaceNode[] memory _rowRoots,
        BinaryMerkleProof[] memory _rowProofs,
        bytes32 _root
    ) internal pure returns (bool, ErrorCodes) {
        // checking that the rows roots commit to the data root.
        if (_rowProofs.length != _rowRoots.length) {
            return (false, ErrorCodes.UnequalRowProofsAndRowRootsNumber);
        }

        for (uint256 i = 0; i < _rowProofs.length; i++) {
            bytes memory rowRoot = abi.encodePacked(
                _rowRoots[i].min.toBytes(),
                _rowRoots[i].max.toBytes(),
                _rowRoots[i].digest
            );
            (bool valid, ) = BinaryMerkleTree.verify(_root, _rowProofs[i], rowRoot);
            if (!valid) {
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
    function computeSquareSizeFromRowProof(
        BinaryMerkleProof memory _proof
    ) internal pure returns (uint256, ErrorCodes) {
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
    function computeSquareSizeFromShareProof(
        NamespaceMerkleMultiproof memory _proof
    ) internal pure returns (uint256) {
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
    function slice(
        bytes[] memory _data,
        uint256 _begin,
        uint256 _end
    ) internal pure returns (bytes[] memory, ErrorCodes) {
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

library CelestiaBatchVerifier {
    /// @dev The heights in the batch data and proof do not match
    error MismatchedHeights();

    /// @dev The attestation and or row root proof was invalid
    error InvalidProof();

    /// @title Result
    /// @notice Enumerates the possible outcomes for data verification processes.
    /// @dev Provides a standardized way to represent the verification status of data.
    enum Result {
        /// @dev Indicates the data has been verified to exist within Blobstream.
        IN_BLOBSTREAM,
        /// @dev Represents a situation where the batch data has been proven to be incorrect. Or BlobstreamX was frozen
        COUNTERFACTUAL_COMMITMENT,
        /// @dev The height for the batch data has not been committed to by Blobstream yet.
        UNDECIDED
    }

    /**
     * @notice Given some batch data with the structre of `BlobPointer`, verifyBatch validates:
     * 1. The Celestia Height for the batch data is in blobsream.
     * 2. The user supplied proof's data root exists in Blobstream.
     * 2. The the data root from the batch data and the valid user supplied proof match, and the
     *    span of shares for the batch data is available (i.e the start + length of a blob does not
     *    go outside the bounds of the origianal celestia data square for the given height)
     *
     * Rationale:
     * Validators possess the preimages for the data root and row roots, making it necessary only to verify
     * the existence and the length (span) of the index and blob length.
     * This ensures the data published by the batch poster is available.
     */
    function verifyBatch(address _blobstream, bytes calldata _data) internal view returns (Result) {
        IBlobstreamX blobstreamX = IBlobstreamX(_blobstream);

        uint64 height = uint64(bytes8(_data[0:8]));

        // If the height is to far into the future (1000 blocks), return COUNTERFACTUAL_COMMITMENT
        // because the batch poster is trying to stall
        if (height > (blobstreamX.latestBlock() + 1000)) return Result.COUNTERFACTUAL_COMMITMENT;

        // Otherwise return undecided, as the commitment still needs to be relayed to Blobstream
        if (height > blobstreamX.latestBlock()) return Result.UNDECIDED;

        (
            ,
            NamespaceNode memory namespaceNode,
            BinaryMerkleProof memory proof,
            AttestationProof memory attestationProof
        ) = abi.decode(_data[88:], (address, NamespaceNode, BinaryMerkleProof, AttestationProof));

        (
            bool valid,
            uint256 proofHeight,
            bytes32 proofDataRoot,
            BinaryMerkleProof memory rowProof
        ) = verifyProof(_blobstream, namespaceNode, proof, attestationProof);

        // revert, because for a given height that has been confirmed to exist in Blobstream,
        // there has to be a valid proof
        // if (!valid) revert InvalidProof();
        if (!valid) revert("INVALID_PROOF");
        // check height against the one in the batch data, if they do not match,
        // revert, because the user supplied proof does not verify against
        // the batch's celestia height.
        // if (height != proofHeight) revert MismatchedHeights();
        if (height != proofHeight) revert("MismatchedHeights");

        // check the data root in the proof against the one in the batch data.
        // if they do not match, its a counterfactual commitment, because
        // 1. the user supplied proof proves the height was relayed to Blobstream
        //    (we know the height is valid because it's less than or equal to the latest block)
        // 2. the data root from the batch data does not exist at the height the batch poster claimed
        //    to have posted to.
        // NOTE: a celestia batch has the data root (32 bytes) at index 56
        if (bytes32(_data[56:88]) != proofDataRoot) return Result.COUNTERFACTUAL_COMMITMENT;

        // Calculate size of the Original Data Square (ODS)
        (uint256 squareSize, ) = DAVerifier.computeSquareSizeFromRowProof(rowProof);

        if (squareSize == 0) return Result.COUNTERFACTUAL_COMMITMENT;
        // Check that the start + length posted by the batch poster is not out of bounds
        // otherwise return counterfactual commitment
        // NOTE: a celestia batch has the start (8 bytes) and length (8 bytes) at index 8 - 24
        // we also substract 1 to account for the shares length including the start share
        // thus letting us correctly calculate the end index
        if (
            (uint64(bytes8(_data[8:16])) + uint64(bytes8(_data[16:24])) - 1) >=
            squareSize * squareSize
        ) return Result.COUNTERFACTUAL_COMMITMENT;

        // At this point, there has been:
        // 1. A succesfull proof that shows the height and data root the batch poster included
        //    in the batch data exist in Blobstream.
        // 2. A proof that the sequence the batch poster included in the batch data is inside
        //    of the data square (remember, any valid row root proof can show this is true)
        // 3. No deadlocks or incorrect counter factual commitments have been made, since:
        //    - If the height in the batch is less than the latest height in blobstrea,
        //      a valid attestation + row proof must exist for it
        //    - we have shown that the batch poster did not lie about the data root and height,
        //      nor about the span being in the bounds of the square. Thus, validators have
        //      access to the data through the preimage oracle
        return Result.IN_BLOBSTREAM;
    }

    function verifyProof(
        address _blobstream,
        NamespaceNode memory _rowRoot,
        BinaryMerkleProof memory _rowProof,
        AttestationProof memory _attestationProof
    )
        public
        view
        returns (
            bool isValid,
            uint256 proofHeight,
            bytes32 proofDataRoot,
            BinaryMerkleProof memory rowProof
        )
    {
        (bool valid, DAVerifier.ErrorCodes errorCode) = DAVerifier.verifyRowRootToDataRootTupleRoot(
            IDAOracle(_blobstream),
            _rowRoot,
            _rowProof,
            _attestationProof
        );

        return (valid, _attestationProof.tuple.height, _attestationProof.tuple.dataRoot, _rowProof);
    }
}

library Deserialize {
    function u8(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (uint8 ret, uint256 offset)
    {
        offset = startOffset;
        ret = uint8(proof[offset]);
        offset++;
    }

    function u16(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (uint16 ret, uint256 offset)
    {
        offset = startOffset;
        for (uint256 i = 0; i < 16 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u32(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (uint32 ret, uint256 offset)
    {
        offset = startOffset;
        for (uint256 i = 0; i < 32 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u64(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (uint64 ret, uint256 offset)
    {
        offset = startOffset;
        for (uint256 i = 0; i < 64 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function u256(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (uint256 ret, uint256 offset)
    {
        offset = startOffset;
        for (uint256 i = 0; i < 256 / 8; i++) {
            ret <<= 8;
            ret |= uint8(proof[offset]);
            offset++;
        }
    }

    function b32(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (bytes32 ret, uint256 offset)
    {
        offset = startOffset;
        uint256 retInt;
        (retInt, offset) = u256(proof, offset);
        ret = bytes32(retInt);
    }

    function boolean(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (bool ret, uint256 offset)
    {
        offset = startOffset;
        ret = uint8(proof[offset]) != 0;
        offset++;
    }

    function value(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (Value memory val, uint256 offset)
    {
        offset = startOffset;
        uint8 typeInt = uint8(proof[offset]);
        offset++;
        require(typeInt <= uint8(ValueLib.maxValueType()), "BAD_VALUE_TYPE");
        uint256 contents;
        (contents, offset) = u256(proof, offset);
        val = Value({valueType: ValueType(typeInt), contents: contents});
    }

    function valueStack(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (ValueStack memory stack, uint256 offset)
    {
        offset = startOffset;
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        uint256 provedLength;
        (provedLength, offset) = u256(proof, offset);
        Value[] memory proved = new Value[](provedLength);
        for (uint256 i = 0; i < proved.length; i++) {
            (proved[i], offset) = value(proof, offset);
        }
        stack = ValueStack({proved: ValueArray(proved), remainingHash: remainingHash});
    }

    function multiStack(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (MultiStack memory multistack, uint256 offset)
    {
        offset = startOffset;
        bytes32 inactiveStackHash;
        (inactiveStackHash, offset) = b32(proof, offset);
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        multistack = MultiStack({
            inactiveStackHash: inactiveStackHash,
            remainingHash: remainingHash
        });
    }

    function instructions(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (Instruction[] memory code, uint256 offset)
    {
        offset = startOffset;
        uint8 count;
        (count, offset) = u8(proof, offset);
        code = new Instruction[](count);

        for (uint256 i = 0; i < uint256(count); i++) {
            uint16 opcode;
            uint256 data;
            (opcode, offset) = u16(proof, offset);
            (data, offset) = u256(proof, offset);
            code[i] = Instruction({opcode: opcode, argumentData: data});
        }
    }

    function stackFrame(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (StackFrame memory window, uint256 offset)
    {
        offset = startOffset;
        Value memory returnPc;
        bytes32 localsMerkleRoot;
        uint32 callerModule;
        uint32 callerModuleInternals;
        (returnPc, offset) = value(proof, offset);
        (localsMerkleRoot, offset) = b32(proof, offset);
        (callerModule, offset) = u32(proof, offset);
        (callerModuleInternals, offset) = u32(proof, offset);
        window = StackFrame({
            returnPc: returnPc,
            localsMerkleRoot: localsMerkleRoot,
            callerModule: callerModule,
            callerModuleInternals: callerModuleInternals
        });
    }

    function stackFrameWindow(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (StackFrameWindow memory window, uint256 offset)
    {
        offset = startOffset;
        bytes32 remainingHash;
        (remainingHash, offset) = b32(proof, offset);
        StackFrame[] memory proved;
        if (proof[offset] != 0) {
            offset++;
            proved = new StackFrame[](1);
            (proved[0], offset) = stackFrame(proof, offset);
        } else {
            offset++;
            proved = new StackFrame[](0);
        }
        window = StackFrameWindow({proved: proved, remainingHash: remainingHash});
    }

    function moduleMemory(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (ModuleMemory memory mem, uint256 offset)
    {
        offset = startOffset;
        uint64 size;
        uint64 maxSize;
        bytes32 root;
        (size, offset) = u64(proof, offset);
        (maxSize, offset) = u64(proof, offset);
        (root, offset) = b32(proof, offset);
        mem = ModuleMemory({size: size, maxSize: maxSize, merkleRoot: root});
    }

    function module(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (Module memory mod, uint256 offset)
    {
        offset = startOffset;
        bytes32 globalsMerkleRoot;
        ModuleMemory memory mem;
        bytes32 tablesMerkleRoot;
        bytes32 functionsMerkleRoot;
        bytes32 extraHash;
        uint32 internalsOffset;
        (globalsMerkleRoot, offset) = b32(proof, offset);
        (mem, offset) = moduleMemory(proof, offset);
        (tablesMerkleRoot, offset) = b32(proof, offset);
        (functionsMerkleRoot, offset) = b32(proof, offset);
        (extraHash, offset) = b32(proof, offset);
        (internalsOffset, offset) = u32(proof, offset);
        mod = Module({
            globalsMerkleRoot: globalsMerkleRoot,
            moduleMemory: mem,
            tablesMerkleRoot: tablesMerkleRoot,
            functionsMerkleRoot: functionsMerkleRoot,
            extraHash: extraHash,
            internalsOffset: internalsOffset
        });
    }

    function globalState(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (GlobalState memory state, uint256 offset)
    {
        offset = startOffset;

        // using constant ints for array size requires newer solidity
        bytes32[2] memory bytes32Vals;
        uint64[2] memory u64Vals;

        for (uint8 i = 0; i < GlobalStateLib.BYTES32_VALS_NUM; i++) {
            (bytes32Vals[i], offset) = b32(proof, offset);
        }
        for (uint8 i = 0; i < GlobalStateLib.U64_VALS_NUM; i++) {
            (u64Vals[i], offset) = u64(proof, offset);
        }
        state = GlobalState({bytes32Vals: bytes32Vals, u64Vals: u64Vals});
    }

    function machine(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (Machine memory mach, uint256 offset)
    {
        offset = startOffset;
        {
            MachineStatus status;
            {
                uint8 statusU8;
                (statusU8, offset) = u8(proof, offset);
                if (statusU8 == 0) {
                    status = MachineStatus.RUNNING;
                } else if (statusU8 == 1) {
                    status = MachineStatus.FINISHED;
                } else if (statusU8 == 2) {
                    status = MachineStatus.ERRORED;
                } else if (statusU8 == 3) {
                    status = MachineStatus.TOO_FAR;
                } else {
                    revert("UNKNOWN_MACH_STATUS");
                }
            }
            ValueStack memory values;
            ValueStack memory internalStack;
            MultiStack memory valuesMulti;
            StackFrameWindow memory frameStack;
            MultiStack memory framesMulti;
            (values, offset) = valueStack(proof, offset);
            (valuesMulti, offset) = multiStack(proof, offset);
            (internalStack, offset) = valueStack(proof, offset);
            (frameStack, offset) = stackFrameWindow(proof, offset);
            (framesMulti, offset) = multiStack(proof, offset);
            mach = Machine({
                status: status,
                valueStack: values,
                valueMultiStack: valuesMulti,
                internalStack: internalStack,
                frameStack: frameStack,
                frameMultiStack: framesMulti,
                globalStateHash: bytes32(0), // filled later
                moduleIdx: 0, // filled later
                functionIdx: 0, // filled later
                functionPc: 0, // filled later
                recoveryPc: bytes32(0), // filled later
                modulesRoot: bytes32(0) // filled later
            });
        }
        (mach.globalStateHash, offset) = b32(proof, offset);
        (mach.moduleIdx, offset) = u32(proof, offset);
        (mach.functionIdx, offset) = u32(proof, offset);
        (mach.functionPc, offset) = u32(proof, offset);
        (mach.recoveryPc, offset) = b32(proof, offset);
        (mach.modulesRoot, offset) = b32(proof, offset);
    }

    function merkleProof(bytes calldata proof, uint256 startOffset)
        internal
        pure
        returns (MerkleProof memory merkle, uint256 offset)
    {
        offset = startOffset;
        uint8 length;
        (length, offset) = u8(proof, offset);
        bytes32[] memory counterparts = new bytes32[](length);
        for (uint8 i = 0; i < length; i++) {
            (counterparts[i], offset) = b32(proof, offset);
        }
        merkle = MerkleProof(counterparts);
    }
}

library ModuleMemoryLib {
    using MerkleProofLib for MerkleProof;

    uint256 private constant LEAF_SIZE = 32;

    function hash(ModuleMemory memory mem) internal pure returns (bytes32) {
        return ModuleMemoryCompactLib.hash(mem);
    }

    function proveLeaf(
        ModuleMemory memory mem,
        uint256 leafIdx,
        bytes calldata proof,
        uint256 startOffset
    )
        internal
        pure
        returns (
            bytes32 contents,
            uint256 offset,
            MerkleProof memory merkle
        )
    {
        offset = startOffset;
        (contents, offset) = Deserialize.b32(proof, offset);
        (merkle, offset) = Deserialize.merkleProof(proof, offset);
        bytes32 recomputedRoot = merkle.computeRootFromMemory(leafIdx, contents);
        require(recomputedRoot == mem.merkleRoot, "WRONG_MEM_ROOT");
    }

    function isValidLeaf(ModuleMemory memory mem, uint256 pointer) internal pure returns (bool) {
        return pointer + 32 <= mem.size && pointer % LEAF_SIZE == 0;
    }

    function pullLeafByte(bytes32 leaf, uint256 idx) internal pure returns (uint8) {
        require(idx < LEAF_SIZE, "BAD_PULL_LEAF_BYTE_IDX");
        // Take into account that we are casting the leaf to a big-endian integer
        uint256 leafShift = (LEAF_SIZE - 1 - idx) * 8;
        return uint8(uint256(leaf) >> leafShift);
    }

    // loads a big-endian value from memory
    function load(
        ModuleMemory memory mem,
        uint256 start,
        uint256 width,
        bytes calldata proof,
        uint256 proofOffset
    )
        internal
        pure
        returns (
            bool err,
            uint256 value,
            uint256 offset
        )
    {
        if (start + width > mem.size) {
            return (true, 0, proofOffset);
        }

        uint256 lastProvedLeafIdx = ~uint256(0);
        bytes32 lastProvedLeafContents;
        uint256 readValue;
        for (uint256 i = 0; i < width; i++) {
            uint256 idx = start + i;
            uint256 leafIdx = idx / LEAF_SIZE;
            if (leafIdx != lastProvedLeafIdx) {
                (lastProvedLeafContents, proofOffset, ) = proveLeaf(
                    mem,
                    leafIdx,
                    proof,
                    proofOffset
                );
                lastProvedLeafIdx = leafIdx;
            }
            uint256 indexWithinLeaf = idx % LEAF_SIZE;
            readValue |= uint256(pullLeafByte(lastProvedLeafContents, indexWithinLeaf)) << (i * 8);
        }
        return (false, readValue, proofOffset);
    }
}

library ModuleMemoryCompactLib {
    function hash(ModuleMemory memory mem) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Memory:", mem.size, mem.maxSize, mem.merkleRoot));
    }
}

library ModuleLib {
    using ModuleMemoryCompactLib for ModuleMemory;

    function hash(Module memory mod) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Module:",
                    mod.globalsMerkleRoot,
                    mod.moduleMemory.hash(),
                    mod.tablesMerkleRoot,
                    mod.functionsMerkleRoot,
                    mod.extraHash,
                    mod.internalsOffset
                )
            );
    }
}

library Instructions {
    uint16 internal constant UNREACHABLE = 0x00;
    uint16 internal constant NOP = 0x01;
    uint16 internal constant RETURN = 0x0F;
    uint16 internal constant CALL = 0x10;
    uint16 internal constant CALL_INDIRECT = 0x11;
    uint16 internal constant LOCAL_GET = 0x20;
    uint16 internal constant LOCAL_SET = 0x21;
    uint16 internal constant GLOBAL_GET = 0x23;
    uint16 internal constant GLOBAL_SET = 0x24;

    uint16 internal constant I32_LOAD = 0x28;
    uint16 internal constant I64_LOAD = 0x29;
    uint16 internal constant F32_LOAD = 0x2A;
    uint16 internal constant F64_LOAD = 0x2B;
    uint16 internal constant I32_LOAD8_S = 0x2C;
    uint16 internal constant I32_LOAD8_U = 0x2D;
    uint16 internal constant I32_LOAD16_S = 0x2E;
    uint16 internal constant I32_LOAD16_U = 0x2F;
    uint16 internal constant I64_LOAD8_S = 0x30;
    uint16 internal constant I64_LOAD8_U = 0x31;
    uint16 internal constant I64_LOAD16_S = 0x32;
    uint16 internal constant I64_LOAD16_U = 0x33;
    uint16 internal constant I64_LOAD32_S = 0x34;
    uint16 internal constant I64_LOAD32_U = 0x35;

    uint16 internal constant I32_STORE = 0x36;
    uint16 internal constant I64_STORE = 0x37;
    uint16 internal constant F32_STORE = 0x38;
    uint16 internal constant F64_STORE = 0x39;
    uint16 internal constant I32_STORE8 = 0x3A;
    uint16 internal constant I32_STORE16 = 0x3B;
    uint16 internal constant I64_STORE8 = 0x3C;
    uint16 internal constant I64_STORE16 = 0x3D;
    uint16 internal constant I64_STORE32 = 0x3E;

    uint16 internal constant MEMORY_SIZE = 0x3F;
    uint16 internal constant MEMORY_GROW = 0x40;

    uint16 internal constant DROP = 0x1A;
    uint16 internal constant SELECT = 0x1B;
    uint16 internal constant I32_CONST = 0x41;
    uint16 internal constant I64_CONST = 0x42;
    uint16 internal constant F32_CONST = 0x43;
    uint16 internal constant F64_CONST = 0x44;
    uint16 internal constant I32_EQZ = 0x45;
    uint16 internal constant I32_RELOP_BASE = 0x46;
    uint16 internal constant IRELOP_EQ = 0;
    uint16 internal constant IRELOP_NE = 1;
    uint16 internal constant IRELOP_LT_S = 2;
    uint16 internal constant IRELOP_LT_U = 3;
    uint16 internal constant IRELOP_GT_S = 4;
    uint16 internal constant IRELOP_GT_U = 5;
    uint16 internal constant IRELOP_LE_S = 6;
    uint16 internal constant IRELOP_LE_U = 7;
    uint16 internal constant IRELOP_GE_S = 8;
    uint16 internal constant IRELOP_GE_U = 9;
    uint16 internal constant IRELOP_LAST = IRELOP_GE_U;

    uint16 internal constant I64_EQZ = 0x50;
    uint16 internal constant I64_RELOP_BASE = 0x51;

    uint16 internal constant I32_UNOP_BASE = 0x67;
    uint16 internal constant IUNOP_CLZ = 0;
    uint16 internal constant IUNOP_CTZ = 1;
    uint16 internal constant IUNOP_POPCNT = 2;
    uint16 internal constant IUNOP_LAST = IUNOP_POPCNT;

    uint16 internal constant I32_ADD = 0x6A;
    uint16 internal constant I32_SUB = 0x6B;
    uint16 internal constant I32_MUL = 0x6C;
    uint16 internal constant I32_DIV_S = 0x6D;
    uint16 internal constant I32_DIV_U = 0x6E;
    uint16 internal constant I32_REM_S = 0x6F;
    uint16 internal constant I32_REM_U = 0x70;
    uint16 internal constant I32_AND = 0x71;
    uint16 internal constant I32_OR = 0x72;
    uint16 internal constant I32_XOR = 0x73;
    uint16 internal constant I32_SHL = 0x74;
    uint16 internal constant I32_SHR_S = 0x75;
    uint16 internal constant I32_SHR_U = 0x76;
    uint16 internal constant I32_ROTL = 0x77;
    uint16 internal constant I32_ROTR = 0x78;

    uint16 internal constant I64_UNOP_BASE = 0x79;

    uint16 internal constant I64_ADD = 0x7C;
    uint16 internal constant I64_SUB = 0x7D;
    uint16 internal constant I64_MUL = 0x7E;
    uint16 internal constant I64_DIV_S = 0x7F;
    uint16 internal constant I64_DIV_U = 0x80;
    uint16 internal constant I64_REM_S = 0x81;
    uint16 internal constant I64_REM_U = 0x82;
    uint16 internal constant I64_AND = 0x83;
    uint16 internal constant I64_OR = 0x84;
    uint16 internal constant I64_XOR = 0x85;
    uint16 internal constant I64_SHL = 0x86;
    uint16 internal constant I64_SHR_S = 0x87;
    uint16 internal constant I64_SHR_U = 0x88;
    uint16 internal constant I64_ROTL = 0x89;
    uint16 internal constant I64_ROTR = 0x8A;

    uint16 internal constant I32_WRAP_I64 = 0xA7;
    uint16 internal constant I64_EXTEND_I32_S = 0xAC;
    uint16 internal constant I64_EXTEND_I32_U = 0xAD;

    uint16 internal constant I32_REINTERPRET_F32 = 0xBC;
    uint16 internal constant I64_REINTERPRET_F64 = 0xBD;
    uint16 internal constant F32_REINTERPRET_I32 = 0xBE;
    uint16 internal constant F64_REINTERPRET_I64 = 0xBF;

    uint16 internal constant I32_EXTEND_8S = 0xC0;
    uint16 internal constant I32_EXTEND_16S = 0xC1;
    uint16 internal constant I64_EXTEND_8S = 0xC2;
    uint16 internal constant I64_EXTEND_16S = 0xC3;
    uint16 internal constant I64_EXTEND_32S = 0xC4;

    uint16 internal constant INIT_FRAME = 0x8002;
    uint16 internal constant ARBITRARY_JUMP = 0x8003;
    uint16 internal constant ARBITRARY_JUMP_IF = 0x8004;
    uint16 internal constant MOVE_FROM_STACK_TO_INTERNAL = 0x8005;
    uint16 internal constant MOVE_FROM_INTERNAL_TO_STACK = 0x8006;
    uint16 internal constant DUP = 0x8008;
    uint16 internal constant CROSS_MODULE_CALL = 0x8009;
    uint16 internal constant CALLER_MODULE_INTERNAL_CALL = 0x800A;
    uint16 internal constant CROSS_MODULE_FORWARD = 0x800B;
    uint16 internal constant CROSS_MODULE_INTERNAL_CALL = 0x800C;

    uint16 internal constant GET_GLOBAL_STATE_BYTES32 = 0x8010;
    uint16 internal constant SET_GLOBAL_STATE_BYTES32 = 0x8011;
    uint16 internal constant GET_GLOBAL_STATE_U64 = 0x8012;
    uint16 internal constant SET_GLOBAL_STATE_U64 = 0x8013;

    uint16 internal constant READ_PRE_IMAGE = 0x8020;
    uint16 internal constant READ_INBOX_MESSAGE = 0x8021;
    uint16 internal constant HALT_AND_SET_FINISHED = 0x8022;
    uint16 internal constant LINK_MODULE = 0x8023;
    uint16 internal constant UNLINK_MODULE = 0x8024;

    uint16 internal constant NEW_COTHREAD = 0x8030;
    uint16 internal constant POP_COTHREAD = 0x8031;
    uint16 internal constant SWITCH_COTHREAD = 0x8032;

    uint256 internal constant INBOX_INDEX_SEQUENCER = 0;
    uint256 internal constant INBOX_INDEX_DELAYED = 1;

    function hash(Instruction[] memory code) internal pure returns (bytes32) {
        // To avoid quadratic expense, we declare a `bytes` early and populate its contents.
        bytes memory data = new bytes(13 + 1 + 34 * code.length);
        assembly {
            // Represents the string "Instructions:", which we place after the length word.
            mstore(
                add(data, 32),
                0x496e737472756374696f6e733a00000000000000000000000000000000000000
            )
        }

        // write the instruction count
        uint256 offset = 13;
        data[offset] = bytes1(uint8(code.length));
        offset++;

        // write each instruction
        for (uint256 i = 0; i < code.length; i++) {
            Instruction memory inst = code[i];
            data[offset] = bytes1(uint8(inst.opcode >> 8));
            data[offset + 1] = bytes1(uint8(inst.opcode));
            offset += 2;
            uint256 argumentData = inst.argumentData;
            assembly {
                mstore(add(add(data, 32), offset), argumentData)
            }
            offset += 32;
        }
        return keccak256(data);
    }
}

library MerkleProofLib {
    using ModuleLib for Module;
    using ValueLib for Value;

    function computeRootFromValue(
        MerkleProof memory proof,
        uint256 index,
        Value memory leaf
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, leaf.hash(), "Value merkle tree:");
    }

    function computeRootFromInstructions(
        MerkleProof memory proof,
        uint256 index,
        Instruction[] memory code
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, Instructions.hash(code), "Instruction merkle tree:");
    }

    function computeRootFromFunction(
        MerkleProof memory proof,
        uint256 index,
        bytes32 codeRoot
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Function:", codeRoot));
        return computeRootUnsafe(proof, index, h, "Function merkle tree:");
    }

    function computeRootFromMemory(
        MerkleProof memory proof,
        uint256 index,
        bytes32 contents
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Memory leaf:", contents));
        return computeRootUnsafe(proof, index, h, "Memory merkle tree:");
    }

    function computeRootFromElement(
        MerkleProof memory proof,
        uint256 index,
        bytes32 funcTypeHash,
        Value memory val
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Table element:", funcTypeHash, val.hash()));
        return computeRootUnsafe(proof, index, h, "Table element merkle tree:");
    }

    function computeRootFromTable(
        MerkleProof memory proof,
        uint256 index,
        uint8 tableType,
        uint64 tableSize,
        bytes32 elementsRoot
    ) internal pure returns (bytes32) {
        bytes32 h = keccak256(abi.encodePacked("Table:", tableType, tableSize, elementsRoot));
        return computeRootUnsafe(proof, index, h, "Table merkle tree:");
    }

    function computeRootFromModule(
        MerkleProof memory proof,
        uint256 index,
        Module memory mod
    ) internal pure returns (bytes32) {
        return computeRootUnsafe(proof, index, mod.hash(), "Module merkle tree:");
    }

    // WARNING: leafHash must be computed in such a way that it cannot be a non-leaf hash.
    function computeRootUnsafe(
        MerkleProof memory proof,
        uint256 index,
        bytes32 leafHash,
        string memory prefix
    ) internal pure returns (bytes32 h) {
        h = leafHash;
        for (uint256 layer = 0; layer < proof.counterparts.length; layer++) {
            if (index & 1 == 0) {
                h = keccak256(abi.encodePacked(prefix, h, proof.counterparts[layer]));
            } else {
                h = keccak256(abi.encodePacked(prefix, proof.counterparts[layer], h));
            }
            index >>= 1;
        }
        require(index == 0, "PROOF_TOO_SHORT");
    }

    function growToNewRoot(
        bytes32 root,
        uint256 leaf,
        bytes32 hash,
        bytes32 zero,
        string memory prefix
    ) internal pure returns (bytes32) {
        bytes32 h = hash;
        uint256 node = leaf;
        while (node > 1) {
            h = keccak256(abi.encodePacked(prefix, h, zero));
            zero = keccak256(abi.encodePacked(prefix, zero, zero));
            node >>= 1;
        }
        return keccak256(abi.encodePacked(prefix, root, h));
    }
}

struct MerkleProof {
    bytes32[] counterparts;
}

library StackFrameLib {
    using ValueLib for Value;

    function hash(StackFrame memory frame) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Stack frame:",
                    frame.returnPc.hash(),
                    frame.localsMerkleRoot,
                    frame.callerModule,
                    frame.callerModuleInternals
                )
            );
    }

    function hash(StackFrameWindow memory window) internal pure returns (bytes32 h) {
        h = window.remainingHash;
        for (uint256 i = 0; i < window.proved.length; i++) {
            h = keccak256(abi.encodePacked("Stack frame stack:", hash(window.proved[i]), h));
        }
    }

    function peek(StackFrameWindow memory window) internal pure returns (StackFrame memory) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        return window.proved[0];
    }

    function pop(StackFrameWindow memory window) internal pure returns (StackFrame memory frame) {
        require(window.proved.length == 1, "BAD_WINDOW_LENGTH");
        frame = window.proved[0];
        window.proved = new StackFrame[](0);
    }

    function push(StackFrameWindow memory window, StackFrame memory frame) internal pure {
        StackFrame[] memory newProved = new StackFrame[](window.proved.length + 1);
        for (uint256 i = 0; i < window.proved.length; i++) {
            newProved[i] = window.proved[i];
        }
        newProved[window.proved.length] = frame;
        window.proved = newProved;
    }

    function overwrite(StackFrameWindow memory window, bytes32 root) internal pure {
        window.remainingHash = root;
        delete window.proved;
    }
}

library ValueLib {
    function hash(Value memory val) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("Value:", val.valueType, val.contents));
    }

    function maxValueType() internal pure returns (ValueType) {
        return ValueType.INTERNAL_REF;
    }

    function assumeI32(Value memory val) internal pure returns (uint32) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I32, "NOT_I32");
        require(uintval < (1 << 32), "BAD_I32");
        return uint32(uintval);
    }

    function assumeI64(Value memory val) internal pure returns (uint64) {
        uint256 uintval = uint256(val.contents);
        require(val.valueType == ValueType.I64, "NOT_I64");
        require(uintval < (1 << 64), "BAD_I64");
        return uint64(uintval);
    }

    function newRefNull() internal pure returns (Value memory) {
        return Value({valueType: ValueType.REF_NULL, contents: 0});
    }

    function newI32(uint32 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I32, contents: uint256(x)});
    }

    function newI64(uint64 x) internal pure returns (Value memory) {
        return Value({valueType: ValueType.I64, contents: uint256(x)});
    }

    function newBoolean(bool x) internal pure returns (Value memory) {
        if (x) {
            return newI32(uint32(1));
        } else {
            return newI32(uint32(0));
        }
    }

    function newPc(
        uint32 funcPc,
        uint32 func,
        uint32 module
    ) internal pure returns (Value memory) {
        uint256 data = 0;
        data |= funcPc;
        data |= uint256(func) << 32;
        data |= uint256(module) << 64;
        return Value({valueType: ValueType.INTERNAL_REF, contents: data});
    }
}

library ValueArrayLib {
    function get(ValueArray memory arr, uint256 index) internal pure returns (Value memory) {
        return arr.inner[index];
    }

    function set(
        ValueArray memory arr,
        uint256 index,
        Value memory val
    ) internal pure {
        arr.inner[index] = val;
    }

    function length(ValueArray memory arr) internal pure returns (uint256) {
        return arr.inner.length;
    }

    function push(ValueArray memory arr, Value memory val) internal pure {
        Value[] memory newInner = new Value[](arr.inner.length + 1);
        for (uint256 i = 0; i < arr.inner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        newInner[arr.inner.length] = val;
        arr.inner = newInner;
    }

    function pop(ValueArray memory arr) internal pure returns (Value memory popped) {
        popped = arr.inner[arr.inner.length - 1];
        Value[] memory newInner = new Value[](arr.inner.length - 1);
        for (uint256 i = 0; i < newInner.length; i++) {
            newInner[i] = arr.inner[i];
        }
        arr.inner = newInner;
    }
}

library ValueStackLib {
    using ValueLib for Value;
    using ValueArrayLib for ValueArray;

    function hash(ValueStack memory stack) internal pure returns (bytes32 h) {
        h = stack.remainingHash;
        uint256 len = stack.proved.length();
        for (uint256 i = 0; i < len; i++) {
            h = keccak256(abi.encodePacked("Value stack:", stack.proved.get(i).hash(), h));
        }
    }

    function peek(ValueStack memory stack) internal pure returns (Value memory) {
        uint256 len = stack.proved.length();
        return stack.proved.get(len - 1);
    }

    function pop(ValueStack memory stack) internal pure returns (Value memory) {
        return stack.proved.pop();
    }

    function push(ValueStack memory stack, Value memory val) internal pure {
        return stack.proved.push(val);
    }

    function overwrite(ValueStack memory stack, bytes32 root) internal pure {
        stack.remainingHash = root;
        delete stack.proved;
    }
}

library MultiStackLib {
    bytes32 internal constant NO_STACK_HASH = ~bytes32(0);

    function hash(
        MultiStack memory multi,
        bytes32 activeStackHash,
        bool cothread
    ) internal pure returns (bytes32) {
        require(activeStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_ACTIVE");
        if (cothread) {
            require(multi.inactiveStackHash != NO_STACK_HASH, "MULTISTACK_NOSTACK_MAIN");
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        multi.inactiveStackHash,
                        activeStackHash,
                        multi.remainingHash
                    )
                );
        } else {
            return
                keccak256(
                    abi.encodePacked(
                        "multistack:",
                        activeStackHash,
                        multi.inactiveStackHash,
                        multi.remainingHash
                    )
                );
        }
    }

    function setEmpty(MultiStack memory multi) internal pure {
        multi.inactiveStackHash = NO_STACK_HASH;
        multi.remainingHash = 0;
    }

    function pushNew(MultiStack memory multi) internal pure {
        if (multi.inactiveStackHash != NO_STACK_HASH) {
            multi.remainingHash = keccak256(
                abi.encodePacked("cothread:", multi.inactiveStackHash, multi.remainingHash)
            );
        }
        multi.inactiveStackHash = 0;
    }
}

library MachineLib {
    using StackFrameLib for StackFrameWindow;
    using ValueStackLib for ValueStack;
    using MultiStackLib for MultiStack;

    bytes32 internal constant NO_RECOVERY_PC = ~bytes32(0);

    function hash(Machine memory mach) internal pure returns (bytes32) {
        // Warning: the non-running hashes are replicated in Challenge
        if (mach.status == MachineStatus.RUNNING) {
            bytes32 valueMultiHash = mach.valueMultiStack.hash(
                mach.valueStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes32 frameMultiHash = mach.frameMultiStack.hash(
                mach.frameStack.hash(),
                mach.recoveryPc != NO_RECOVERY_PC
            );
            bytes memory preimage = abi.encodePacked(
                "Machine running:",
                valueMultiHash,
                mach.internalStack.hash(),
                frameMultiHash,
                mach.globalStateHash,
                mach.moduleIdx,
                mach.functionIdx,
                mach.functionPc,
                mach.recoveryPc,
                mach.modulesRoot
            );
            return keccak256(preimage);
        } else if (mach.status == MachineStatus.FINISHED) {
            return keccak256(abi.encodePacked("Machine finished:", mach.globalStateHash));
        } else if (mach.status == MachineStatus.ERRORED) {
            return keccak256(abi.encodePacked("Machine errored:"));
        } else if (mach.status == MachineStatus.TOO_FAR) {
            return keccak256(abi.encodePacked("Machine too far:"));
        } else {
            revert("BAD_MACH_STATUS");
        }
    }

    function switchCoThreadStacks(Machine memory mach) internal pure {
        bytes32 newActiveValue = mach.valueMultiStack.inactiveStackHash;
        bytes32 newActiveFrame = mach.frameMultiStack.inactiveStackHash;
        if (
            newActiveFrame == MultiStackLib.NO_STACK_HASH ||
            newActiveValue == MultiStackLib.NO_STACK_HASH
        ) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        mach.frameMultiStack.inactiveStackHash = mach.frameStack.hash();
        mach.valueMultiStack.inactiveStackHash = mach.valueStack.hash();
        mach.frameStack.overwrite(newActiveFrame);
        mach.valueStack.overwrite(newActiveValue);
    }

    function setPcFromData(Machine memory mach, uint256 data) internal pure returns (bool) {
        if (data >> 96 != 0) {
            return false;
        }

        mach.functionPc = uint32(data);
        mach.functionIdx = uint32(data >> 32);
        mach.moduleIdx = uint32(data >> 64);
        return true;
    }

    function setPcFromRecovery(Machine memory mach) internal pure returns (bool) {
        if (!setPcFromData(mach, uint256(mach.recoveryPc))) {
            return false;
        }
        mach.recoveryPc = NO_RECOVERY_PC;
        return true;
    }

    function setRecoveryFromPc(Machine memory mach, uint32 offset) internal pure returns (bool) {
        if (mach.recoveryPc != NO_RECOVERY_PC) {
            return false;
        }

        uint256 result;
        result = uint256(mach.moduleIdx) << 64;
        result = result | (uint256(mach.functionIdx) << 32);
        result = result | uint256(mach.functionPc + offset - 1);
        mach.recoveryPc = bytes32(result);
        return true;
    }

    function setPc(Machine memory mach, Value memory pc) internal pure {
        if (pc.valueType == ValueType.REF_NULL) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (pc.valueType != ValueType.INTERNAL_REF) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (!setPcFromData(mach, pc.contents)) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
    }
}

library GlobalStateLib {
    uint16 internal constant BYTES32_VALS_NUM = 2;
    uint16 internal constant U64_VALS_NUM = 2;

    function hash(GlobalState memory state) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "Global state:",
                    state.bytes32Vals[0],
                    state.bytes32Vals[1],
                    state.u64Vals[0],
                    state.u64Vals[1]
                )
            );
    }

    function getBlockHash(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[0];
    }

    function getSendRoot(GlobalState memory state) internal pure returns (bytes32) {
        return state.bytes32Vals[1];
    }

    function getInboxPosition(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[0];
    }

    function getPositionInMessage(GlobalState memory state) internal pure returns (uint64) {
        return state.u64Vals[1];
    }

    function isEmpty(GlobalState calldata state) internal pure returns (bool) {
        return (state.bytes32Vals[0] == bytes32(0) &&
            state.bytes32Vals[1] == bytes32(0) &&
            state.u64Vals[0] == 0 &&
            state.u64Vals[1] == 0);
    }
}

struct GlobalState {
    bytes32[2] bytes32Vals;
    uint64[2] u64Vals;
}

struct ExecutionContext {
    uint256 maxInboxMessagesRead;
    IBridge bridge;
}

enum MachineStatus {
    RUNNING,
    FINISHED,
    ERRORED,
    TOO_FAR
}

struct ValueArray {
    Value[] inner;
}

struct ValueStack {
    ValueArray proved;
    bytes32 remainingHash;
}

struct MultiStack {
    bytes32 inactiveStackHash; // NO_STACK_HASH if no stack, 0 if empty stack
    bytes32 remainingHash; // 0 if less than 2 cothreads exist
}

enum ValueType {
    I32,
    I64,
    F32,
    F64,
    REF_NULL,
    FUNC_REF,
    INTERNAL_REF
}

struct Value {
    ValueType valueType;
    uint256 contents;
}

struct StackFrame {
    Value returnPc;
    bytes32 localsMerkleRoot;
    uint32 callerModule;
    uint32 callerModuleInternals;
}

struct StackFrameWindow {
    StackFrame[] proved;
    bytes32 remainingHash;
}

struct Machine {
    MachineStatus status;
    ValueStack valueStack;
    MultiStack valueMultiStack;
    ValueStack internalStack;
    StackFrameWindow frameStack;
    MultiStack frameMultiStack;
    bytes32 globalStateHash;
    uint32 moduleIdx;
    uint32 functionIdx;
    uint32 functionPc;
    bytes32 recoveryPc;
    bytes32 modulesRoot;
}

struct ModuleMemory {
    uint64 size;
    uint64 maxSize;
    bytes32 merkleRoot;
}

struct Module {
    bytes32 globalsMerkleRoot;
    ModuleMemory moduleMemory;
    bytes32 tablesMerkleRoot;
    bytes32 functionsMerkleRoot;
    bytes32 extraHash;
    uint32 internalsOffset;
}

struct Instruction {
    uint16 opcode;
    uint256 argumentData;
}

abstract contract IOneStepProver {
    function executeOneStep(
        ExecutionContext memory execCtx,
        Machine calldata mach,
        Module calldata mod,
        Instruction calldata instruction,
        bytes calldata proof
    ) external view virtual returns (Machine memory result, Module memory resultMod);
}

contract OneStepProverHostIo is IOneStepProver {
    using GlobalStateLib for GlobalState;
    using MachineLib for Machine;
    using MerkleProofLib for MerkleProof;
    using ModuleMemoryLib for ModuleMemory;
    using MultiStackLib for MultiStack;
    using ValueLib for Value;
    using ValueStackLib for ValueStack;
    using StackFrameLib for StackFrameWindow;
    using CelestiaBatchVerifier for address;

    uint256 private constant LEAF_SIZE = 32;
    uint256 private constant INBOX_NUM = 2;
    uint64 private constant INBOX_HEADER_LEN = 40;
    uint64 private constant DELAYED_HEADER_LEN = 112 + 1;

    // Header Bytes
    bytes1 public constant CELESTIA_MESSAGE_HEADER_FLAG = 0x63;

    // Blobstream contract (address on Arbitrum One Sepolia, MAKE SURE TO CHANGE FOR CORRESPONDING SETTLEMENT LAYER PRIOR TO DEPLOYMENT)
    address public constant BLOBSTREAM = 0xA83ca7775Bc2889825BcDeDfFa5b758cf69e8794;

    function setLeafByte(bytes32 oldLeaf, uint256 idx, uint8 val) internal pure returns (bytes32) {
        require(idx < LEAF_SIZE, "BAD_SET_LEAF_BYTE_IDX");
        // Take into account that we are casting the leaf to a big-endian integer
        uint256 leafShift = (LEAF_SIZE - 1 - idx) * 8;
        uint256 newLeaf = uint256(oldLeaf);
        newLeaf &= ~(0xFF << leafShift);
        newLeaf |= uint256(val) << leafShift;
        return bytes32(newLeaf);
    }

    function executeGetOrSetBytes32(
        Machine memory mach,
        Module memory mod,
        GlobalState memory state,
        Instruction calldata inst,
        bytes calldata proof
    ) internal pure {
        uint256 ptr = mach.valueStack.pop().assumeI32();
        uint32 idx = mach.valueStack.pop().assumeI32();

        if (idx >= GlobalStateLib.BYTES32_VALS_NUM) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (!mod.moduleMemory.isValidLeaf(ptr)) {
            mach.status = MachineStatus.ERRORED;
            return;
        }

        uint256 leafIdx = ptr / LEAF_SIZE;
        uint256 proofOffset = 0;
        bytes32 startLeafContents;
        MerkleProof memory merkleProof;
        (startLeafContents, proofOffset, merkleProof) = mod.moduleMemory.proveLeaf(
            leafIdx,
            proof,
            proofOffset
        );

        if (inst.opcode == Instructions.GET_GLOBAL_STATE_BYTES32) {
            mod.moduleMemory.merkleRoot = merkleProof.computeRootFromMemory(
                leafIdx,
                state.bytes32Vals[idx]
            );
        } else if (inst.opcode == Instructions.SET_GLOBAL_STATE_BYTES32) {
            state.bytes32Vals[idx] = startLeafContents;
        } else {
            revert("BAD_GLOBAL_STATE_OPCODE");
        }
    }

    function executeGetU64(Machine memory mach, GlobalState memory state) internal pure {
        uint32 idx = mach.valueStack.pop().assumeI32();

        if (idx >= GlobalStateLib.U64_VALS_NUM) {
            mach.status = MachineStatus.ERRORED;
            return;
        }

        mach.valueStack.push(ValueLib.newI64(state.u64Vals[idx]));
    }

    function executeSetU64(Machine memory mach, GlobalState memory state) internal pure {
        uint64 val = mach.valueStack.pop().assumeI64();
        uint32 idx = mach.valueStack.pop().assumeI32();

        if (idx >= GlobalStateLib.U64_VALS_NUM) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        state.u64Vals[idx] = val;
    }

    uint256 internal constant BLS_MODULUS =
        52435875175126190479447740508185965837690552500527637822603658699938581184513;
    uint256 internal constant PRIMITIVE_ROOT_OF_UNITY =
        10238227357739495823651030575849232062558860180284477541189508159991286009131;

    // Computes b**e % m
    // Really pure but the Solidity compiler sees the staticcall and requires view
    function modExp256(uint256 b, uint256 e, uint256 m) internal view returns (uint256) {
        bytes memory modExpInput = abi.encode(32, 32, 32, b, e, m);
        (bool modexpSuccess, bytes memory modExpOutput) = address(0x05).staticcall(modExpInput);
        require(modexpSuccess, "MODEXP_FAILED");
        require(modExpOutput.length == 32, "MODEXP_WRONG_LENGTH");
        return uint256(bytes32(modExpOutput));
    }

    function executeReadPreImage(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory mod,
        Instruction calldata inst,
        bytes calldata proof
    ) internal view {
        uint256 preimageOffset = mach.valueStack.pop().assumeI32();
        uint256 ptr = mach.valueStack.pop().assumeI32();
        if (preimageOffset % 32 != 0 || ptr + 32 > mod.moduleMemory.size || ptr % LEAF_SIZE != 0) {
            mach.status = MachineStatus.ERRORED;
            return;
        }

        uint256 leafIdx = ptr / LEAF_SIZE;
        uint256 proofOffset = 0;
        bytes32 leafContents;
        MerkleProof memory merkleProof;
        (leafContents, proofOffset, merkleProof) = mod.moduleMemory.proveLeaf(
            leafIdx,
            proof,
            proofOffset
        );

        bytes memory extracted;
        uint8 proofType = uint8(proof[proofOffset]);
        proofOffset++;
        // These values must be kept in sync with `arbitrator/arbutil/src/types.rs`
        // and `arbutil/preimage_type.go` (both in the nitro repo).
        if (inst.argumentData == 0) {
            // The machine is asking for a keccak256 preimage

            if (proofType == 0) {
                bytes calldata preimage = proof[proofOffset:];
                require(keccak256(preimage) == leafContents, "BAD_PREIMAGE");

                uint256 preimageEnd = preimageOffset + 32;
                if (preimageEnd > preimage.length) {
                    preimageEnd = preimage.length;
                }
                extracted = preimage[preimageOffset:preimageEnd];
            } else {
                // TODO: support proving via an authenticated contract
                revert("UNKNOWN_PREIMAGE_PROOF");
            }
        } else if (inst.argumentData == 1) {
            // The machine is asking for a sha2-256 preimage

            require(proofType == 0, "UNKNOWN_PREIMAGE_PROOF");
            bytes calldata preimage = proof[proofOffset:];
            require(sha256(preimage) == leafContents, "BAD_PREIMAGE");

            uint256 preimageEnd = preimageOffset + 32;
            if (preimageEnd > preimage.length) {
                preimageEnd = preimage.length;
            }
            extracted = preimage[preimageOffset:preimageEnd];
        } else if (inst.argumentData == 2) {
            // The machine is asking for an Ethereum versioned hash preimage

            require(proofType == 0, "UNKNOWN_PREIMAGE_PROOF");

            // kzgProof should be a valid input to the EIP-4844 point evaluation precompile at address 0x0A.
            // It should prove the preimageOffset/32'th word of the machine's requested KZG commitment.
            bytes calldata kzgProof = proof[proofOffset:];

            require(bytes32(kzgProof[:32]) == leafContents, "KZG_PROOF_WRONG_HASH");

            uint256 fieldElementsPerBlob;
            uint256 blsModulus;
            {
                (bool success, bytes memory kzgParams) = address(0x0A).staticcall(kzgProof);
                require(success, "INVALID_KZG_PROOF");
                require(kzgParams.length > 0, "KZG_PRECOMPILE_MISSING");
                (fieldElementsPerBlob, blsModulus) = abi.decode(kzgParams, (uint256, uint256));
            }

            // With a hardcoded PRIMITIVE_ROOT_OF_UNITY, we can only support this BLS modulus.
            // It may be worth in the future supporting arbitrary BLS moduli, but we would likely need to
            // validate a user-supplied root of unity.
            require(blsModulus == BLS_MODULUS, "UNKNOWN_BLS_MODULUS");

            // If preimageOffset is greater than or equal to the blob size, leave extracted empty and call it here.
            if (preimageOffset < fieldElementsPerBlob * 32) {
                // We need to compute what point the polynomial should be evaluated at to get the right part of the preimage.
                // KZG commitments use a bit reversal permutation to order the roots of unity.
                // To account for that, we reverse the bit order of the index.
                uint256 bitReversedIndex = 0;
                // preimageOffset was required to be 32 byte aligned above
                uint256 tmp = preimageOffset / 32;
                for (uint256 i = 1; i < fieldElementsPerBlob; i <<= 1) {
                    bitReversedIndex <<= 1;
                    if (tmp & 1 == 1) {
                        bitReversedIndex |= 1;
                    }
                    tmp >>= 1;
                }

                // First, we get the root of unity of order 2**fieldElementsPerBlob.
                // We start with a root of unity of order 2**32 and then raise it to
                // the power of (2**32)/fieldElementsPerBlob to get root of unity we need.
                uint256 rootOfUnityPower = (1 << 32) / fieldElementsPerBlob;
                // Then, we raise the root of unity to the power of bitReversedIndex,
                // to retrieve this word of the KZG commitment.
                rootOfUnityPower *= bitReversedIndex;
                // z is the point the polynomial is evaluated at to retrieve this word of data
                uint256 z = modExp256(PRIMITIVE_ROOT_OF_UNITY, rootOfUnityPower, blsModulus);
                require(bytes32(kzgProof[32:64]) == bytes32(z), "KZG_PROOF_WRONG_Z");

                extracted = kzgProof[64:96];
            }
        } else {
            revert("UNKNOWN_PREIMAGE_TYPE");
        }

        for (uint256 i = 0; i < extracted.length; i++) {
            leafContents = setLeafByte(leafContents, i, uint8(extracted[i]));
        }

        mod.moduleMemory.merkleRoot = merkleProof.computeRootFromMemory(leafIdx, leafContents);

        mach.valueStack.push(ValueLib.newI32(uint32(extracted.length)));
    }

    function validateSequencerInbox(
        ExecutionContext calldata execCtx,
        uint64 msgIndex,
        bytes calldata message
    ) internal view returns (bool) {
        // need to check where exactly does proof offset usually land, see how we can get get rid of the length delimiter
        // also review delayed message inbox issue Ottersect reported.
        require(message.length >= INBOX_HEADER_LEN, "BAD_SEQINBOX_PROOF");

        uint64 afterDelayedMsg;
        (afterDelayedMsg, ) = Deserialize.u64(message, 32);
        bytes32 messageHash = keccak256(message);
        bytes32 beforeAcc;
        bytes32 delayedAcc;

        if (msgIndex > 0) {
            beforeAcc = execCtx.bridge.sequencerInboxAccs(msgIndex - 1);
        }
        if (afterDelayedMsg > 0) {
            delayedAcc = execCtx.bridge.delayedInboxAccs(afterDelayedMsg - 1);
        }
        bytes32 acc = keccak256(abi.encodePacked(beforeAcc, messageHash, delayedAcc));
        require(acc == execCtx.bridge.sequencerInboxAccs(msgIndex), "BAD_SEQINBOX_MESSAGE");
        return true;
    }

    function validateDelayedInbox(
        ExecutionContext calldata execCtx,
        uint64 msgIndex,
        bytes calldata message
    ) internal view returns (bool) {
        require(message.length >= DELAYED_HEADER_LEN, "BAD_DELAYED_PROOF");

        bytes32 beforeAcc;

        if (msgIndex > 0) {
            beforeAcc = execCtx.bridge.delayedInboxAccs(msgIndex - 1);
        }

        bytes32 messageDataHash = keccak256(message[DELAYED_HEADER_LEN:]);
        bytes1 kind = message[0];
        uint256 sender;
        (sender, ) = Deserialize.u256(message, 1);

        bytes32 messageHash = keccak256(
            abi.encodePacked(kind, uint160(sender), message[33:DELAYED_HEADER_LEN], messageDataHash)
        );
        bytes32 acc = Messages.accumulateInboxMessage(beforeAcc, messageHash);

        require(acc == execCtx.bridge.delayedInboxAccs(msgIndex), "BAD_DELAYED_MESSAGE");
        return true;
    }

    function validateDaProof(bytes calldata proof, uint256 offset) internal view returns (uint256) {
        // NOTE: the offset points to 40 bytes after the proof offset, which should point to a
        // batch header flag for a sequencer inbox message
        uint256 proofEnd;

        if (proof[0] & CELESTIA_MESSAGE_HEADER_FLAG != 0) {
            CelestiaBatchVerifier.Result result = CelestiaBatchVerifier.verifyBatch(
                BLOBSTREAM,
                proof[1:]
            );

            if (result == CelestiaBatchVerifier.Result.UNDECIDED) revert("BLOBSTREAM_UNDECIDED");

            // if its a counterfactual commitment, we replace the batch data with an empty batch
            if (result == CelestiaBatchVerifier.Result.COUNTERFACTUAL_COMMITMENT) {
                // this would slice the array into an empty batch
                proofEnd = offset;
            }

            if (result == CelestiaBatchVerifier.Result.IN_BLOBSTREAM) {
                // remove Celestia DA proof from proof
                // add 88 for the 88 bytes in a celestia batch
                // (the offset at this point already includes the batch header)
                proofEnd = offset + 89;
            }
        }

        return proofEnd;
    }

    function executeReadInboxMessage(
        ExecutionContext calldata execCtx,
        Machine memory mach,
        Module memory mod,
        Instruction calldata inst,
        bytes calldata proof
    ) internal view {
        uint256 messageOffset = mach.valueStack.pop().assumeI32();
        uint256 ptr = mach.valueStack.pop().assumeI32();
        uint256 msgIndex = mach.valueStack.pop().assumeI64();
        if (
            inst.argumentData == Instructions.INBOX_INDEX_SEQUENCER &&
            msgIndex >= execCtx.maxInboxMessagesRead
        ) {
            mach.status = MachineStatus.TOO_FAR;
            return;
        }

        if (ptr + 32 > mod.moduleMemory.size || ptr % LEAF_SIZE != 0) {
            mach.status = MachineStatus.ERRORED;
            return;
        }

        uint256 leafIdx = ptr / LEAF_SIZE;
        uint256 proofOffset = 0;
        bytes32 leafContents;
        MerkleProof memory merkleProof;
        (leafContents, proofOffset, merkleProof) = mod.moduleMemory.proveLeaf(
            leafIdx,
            proof,
            proofOffset
        );
        {
            // TODO: support proving via an authenticated contract
            require(proof[proofOffset] == 0, "UNKNOWN_INBOX_PROOF");
            proofOffset++;

            uint256 proofEnd = proof.length;

            function(ExecutionContext calldata, uint64, bytes calldata)
                internal
                view
                returns (bool) inboxValidate;

            bool success;
            if (inst.argumentData == Instructions.INBOX_INDEX_SEQUENCER) {
                inboxValidate = validateSequencerInbox;
                if (proof[proofOffset + 40] & CELESTIA_MESSAGE_HEADER_FLAG != 0) {
                    proofEnd = validateDaProof(proof[proofOffset + 40:], proofOffset + 40);
                }
            } else if (inst.argumentData == Instructions.INBOX_INDEX_DELAYED) {
                inboxValidate = validateDelayedInbox;
            } else {
                mach.status = MachineStatus.ERRORED;
                return;
            }
            success = inboxValidate(execCtx, uint64(msgIndex), proof[proofOffset:proofEnd]);
            if (!success) {
                mach.status = MachineStatus.ERRORED;
                return;
            }
        }

        require(proof.length >= proofOffset, "BAD_MESSAGE_PROOF");
        uint256 messageLength = proof.length - proofOffset;

        uint32 i = 0;
        for (; i < 32 && messageOffset + i < messageLength; i++) {
            leafContents = setLeafByte(
                leafContents,
                i,
                uint8(proof[proofOffset + messageOffset + i])
            );
        }

        mod.moduleMemory.merkleRoot = merkleProof.computeRootFromMemory(leafIdx, leafContents);
        mach.valueStack.push(ValueLib.newI32(i));
    }

    function executeHaltAndSetFinished(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory,
        Instruction calldata,
        bytes calldata
    ) internal pure {
        mach.status = MachineStatus.FINISHED;
    }

    function isPowerOfTwo(uint256 value) internal pure returns (bool) {
        return value != 0 && (value & (value - 1) == 0);
    }

    function proveLastLeaf(
        Machine memory mach,
        uint256 offset,
        bytes calldata proof
    )
        internal
        pure
        returns (uint256 leaf, MerkleProof memory leafProof, MerkleProof memory zeroProof)
    {
        string memory prefix = "Module merkle tree:";
        bytes32 root = mach.modulesRoot;

        {
            Module memory leafModule;
            uint32 leaf32;
            (leafModule, offset) = Deserialize.module(proof, offset);
            (leaf32, offset) = Deserialize.u32(proof, offset);
            (leafProof, offset) = Deserialize.merkleProof(proof, offset);
            leaf = uint256(leaf32);

            bytes32 compRoot = leafProof.computeRootFromModule(leaf, leafModule);
            require(compRoot == root, "WRONG_ROOT_FOR_LEAF");
        }

        // if tree is unbalanced, check that the next leaf is 0
        bool balanced = isPowerOfTwo(leaf + 1);
        if (balanced) {
            require(1 << leafProof.counterparts.length == leaf + 1, "WRONG_LEAF");
        } else {
            (zeroProof, offset) = Deserialize.merkleProof(proof, offset);
            bytes32 compRoot = zeroProof.computeRootUnsafe(leaf + 1, 0, prefix);
            require(compRoot == root, "WRONG_ROOT_FOR_ZERO");
        }

        return (leaf, leafProof, zeroProof);
    }

    function executeLinkModule(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory mod,
        Instruction calldata,
        bytes calldata proof
    ) internal pure {
        string memory prefix = "Module merkle tree:";
        bytes32 root = mach.modulesRoot;

        uint256 pointer = mach.valueStack.pop().assumeI32();
        if (!mod.moduleMemory.isValidLeaf(pointer)) {
            mach.status = MachineStatus.ERRORED;
            return;
        }
        (bytes32 userMod, uint256 offset, ) = mod.moduleMemory.proveLeaf(
            pointer / LEAF_SIZE,
            proof,
            0
        );

        (uint256 leaf, , MerkleProof memory zeroProof) = proveLastLeaf(mach, offset, proof);

        bool balanced = isPowerOfTwo(leaf + 1);
        if (balanced) {
            mach.modulesRoot = MerkleProofLib.growToNewRoot(root, leaf + 1, userMod, 0, prefix);
        } else {
            mach.modulesRoot = zeroProof.computeRootUnsafe(leaf + 1, userMod, prefix);
        }

        mach.valueStack.push(ValueLib.newI32(uint32(leaf + 1)));
    }

    function executeUnlinkModule(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory,
        Instruction calldata,
        bytes calldata proof
    ) internal pure {
        string memory prefix = "Module merkle tree:";

        (uint256 leaf, MerkleProof memory leafProof, ) = proveLastLeaf(mach, 0, proof);

        bool shrink = isPowerOfTwo(leaf);
        if (shrink) {
            mach.modulesRoot = leafProof.counterparts[leafProof.counterparts.length - 1];
        } else {
            mach.modulesRoot = leafProof.computeRootUnsafe(leaf, 0, prefix);
        }
    }

    function executeGlobalStateAccess(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory mod,
        Instruction calldata inst,
        bytes calldata proof
    ) internal pure {
        uint16 opcode = inst.opcode;

        GlobalState memory state;
        uint256 proofOffset = 0;
        (state, proofOffset) = Deserialize.globalState(proof, proofOffset);
        require(state.hash() == mach.globalStateHash, "BAD_GLOBAL_STATE");

        if (
            opcode == Instructions.GET_GLOBAL_STATE_BYTES32 ||
            opcode == Instructions.SET_GLOBAL_STATE_BYTES32
        ) {
            executeGetOrSetBytes32(mach, mod, state, inst, proof[proofOffset:]);
        } else if (opcode == Instructions.GET_GLOBAL_STATE_U64) {
            executeGetU64(mach, state);
        } else if (opcode == Instructions.SET_GLOBAL_STATE_U64) {
            executeSetU64(mach, state);
        } else {
            revert("INVALID_GLOBALSTATE_OPCODE");
        }

        mach.globalStateHash = state.hash();
    }

    function executeNewCoThread(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory,
        Instruction calldata,
        bytes calldata
    ) internal pure {
        if (mach.recoveryPc != MachineLib.NO_RECOVERY_PC) {
            // cannot create new cothread from inside cothread
            mach.status = MachineStatus.ERRORED;
            return;
        }
        mach.frameMultiStack.pushNew();
        mach.valueMultiStack.pushNew();
    }

    function provePopCothread(MultiStack memory multi, bytes calldata proof) internal pure {
        uint256 proofOffset = 0;
        bytes32 newInactiveCoThread;
        bytes32 newRemaining;
        (newInactiveCoThread, proofOffset) = Deserialize.b32(proof, proofOffset);
        (newRemaining, proofOffset) = Deserialize.b32(proof, proofOffset);
        if (newInactiveCoThread == MultiStackLib.NO_STACK_HASH) {
            require(newRemaining == bytes32(0), "WRONG_COTHREAD_EMPTY");
            require(multi.remainingHash == bytes32(0), "WRONG_COTHREAD_EMPTY");
        } else {
            require(
                keccak256(abi.encodePacked("cothread:", newInactiveCoThread, newRemaining)) ==
                    multi.remainingHash,
                "WRONG_COTHREAD_POP"
            );
        }
        multi.remainingHash = newRemaining;
        multi.inactiveStackHash = newInactiveCoThread;
    }

    function executePopCoThread(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory,
        Instruction calldata,
        bytes calldata proof
    ) internal pure {
        if (mach.recoveryPc != MachineLib.NO_RECOVERY_PC) {
            // cannot pop cothread from inside cothread
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (mach.frameMultiStack.inactiveStackHash == MultiStackLib.NO_STACK_HASH) {
            // cannot pop cothread if there isn't one
            mach.status = MachineStatus.ERRORED;
            return;
        }
        provePopCothread(mach.valueMultiStack, proof);
        provePopCothread(mach.frameMultiStack, proof[64:]);
    }

    function executeSwitchCoThread(
        ExecutionContext calldata,
        Machine memory mach,
        Module memory,
        Instruction calldata inst,
        bytes calldata
    ) internal pure {
        if (mach.frameMultiStack.inactiveStackHash == MultiStackLib.NO_STACK_HASH) {
            // cannot switch cothread if there isn't one
            mach.status = MachineStatus.ERRORED;
            return;
        }
        if (inst.argumentData == 0) {
            if (mach.recoveryPc == MachineLib.NO_RECOVERY_PC) {
                // switching to main thread, from main thread
                mach.status = MachineStatus.ERRORED;
                return;
            }
            mach.recoveryPc = MachineLib.NO_RECOVERY_PC;
        } else {
            if (mach.recoveryPc != MachineLib.NO_RECOVERY_PC) {
                // switching from cothread to cothread
                mach.status = MachineStatus.ERRORED;
                return;
            }
            mach.setRecoveryFromPc(uint32(inst.argumentData));
        }
        mach.switchCoThreadStacks();
    }

    function executeOneStep(
        ExecutionContext calldata execCtx,
        Machine calldata startMach,
        Module calldata startMod,
        Instruction calldata inst,
        bytes calldata proof
    ) external view override returns (Machine memory mach, Module memory mod) {
        mach = startMach;
        mod = startMod;

        uint16 opcode = inst.opcode;

        function(
            ExecutionContext calldata,
            Machine memory,
            Module memory,
            Instruction calldata,
            bytes calldata
        ) internal view impl;

        if (
            opcode >= Instructions.GET_GLOBAL_STATE_BYTES32 &&
            opcode <= Instructions.SET_GLOBAL_STATE_U64
        ) {
            impl = executeGlobalStateAccess;
        } else if (opcode == Instructions.READ_PRE_IMAGE) {
            impl = executeReadPreImage;
        } else if (opcode == Instructions.READ_INBOX_MESSAGE) {
            impl = executeReadInboxMessage;
        } else if (opcode == Instructions.HALT_AND_SET_FINISHED) {
            impl = executeHaltAndSetFinished;
        } else if (opcode == Instructions.LINK_MODULE) {
            impl = executeLinkModule;
        } else if (opcode == Instructions.UNLINK_MODULE) {
            impl = executeUnlinkModule;
        } else if (opcode == Instructions.NEW_COTHREAD) {
            impl = executeNewCoThread;
        } else if (opcode == Instructions.POP_COTHREAD) {
            impl = executePopCoThread;
        } else if (opcode == Instructions.SWITCH_COTHREAD) {
            impl = executeSwitchCoThread;
        } else {
            revert("INVALID_MEMORY_OPCODE");
        }

        impl(execCtx, mach, mod, inst, proof);
    }
}