// SPDX-License-Identifier: Unknown
pragma solidity 0.8.22;

contract ChallengeL2Header is ChallengeBase {
    /// @notice The different states a L2 header challenge can be in.
    /// @param None - The L2 header challenge has not been initiated.
    /// @param Initiated - The L2 header challenge has been initiated by the challenger.
    /// @param ChallengerWon - The L2 header challenge has been won by the challenger.
    /// @param DefenderWon - The L2 header challenge has been won by the defender.
    enum L2HeaderChallengeStatus {
        None,
        Initiated,
        ChallengerWon,
        DefenderWon
    }

    /// @notice The pointer to an L2 header.
    /// @param rblock - The rblock hash of the L2 header.
    /// @param number - The number of the L2 header.
    struct L2HeaderPointer {
        bytes32 rblock;
        uint256 number;
    }

    /// @notice The data structure for an L2 header challenge.
    /// @param blockNum - The number of the L2 header being challenged.
    /// @param header - The header being challenged.
    /// @param prevHeader - The previous header.
    /// @param challengeEnd - The end of the challenge period.
    /// @param challenger - The address of the challenger.
    /// @param status - The status of the challenge.
    /// @param claimed - Whether the challenge has been claimed.
    struct L2HeaderChallenge {
        uint256 blockNum;
        L2HeaderPointer header;
        L2HeaderPointer prevHeader;
        uint256 challengeEnd;
        address challenger;
        L2HeaderChallengeStatus status;
        bool claimed;
    }

    /// @notice Emitted when an L2 header challenge is updated.
    /// @param challengeHash - The hash of the challenge.
    /// @param l2Number - The number of the L2 header being challenged.
    /// @param rblock - The rblock hash of the L2 header.
    /// @param expiry - The expiry time of the challenge.
    /// @param status - The status of the challenge.
    event L2HeaderChallengeUpdate(
        bytes32 indexed challengeHash,
        uint256 indexed l2Number,
        bytes32 rblock,
        uint256 expiry,
        L2HeaderChallengeStatus indexed status
    );

    /// @notice Stores the L2 header challenges.
    mapping(bytes32 => L2HeaderChallenge) public l2HeaderChallenges;

    /// @notice Whether the L2 header challenge is enabled.
    /// @dev Is disabled by default.
    bool public isL2HeaderChallengeEnabled;

    /// @notice Challenges an L2 header by providing the rblock number and the L2 number.
    /// @param _rblockNum - The rblock number of the L2 header.
    /// @param _l2Num - The number of the L2 header.
    /// @return The hash of the challenge.
    function challengeL2Header(
        uint256 _rblockNum,
        uint256 _l2Num
    )
        external
        payable
        mustBeCanonical(_rblockNum)
        mustBeWithinChallengeWindow(_rblockNum)
        requireChallengeFee
        returns (bytes32)
    {
        require(isL2HeaderChallengeEnabled, "L2 header challenge is disabled");

        // 1. Load the rblock and the previous rblock
        bytes32 rblockHash = chain.chain(_rblockNum);
        ICanonicalStateChain.Header memory rblock = chain.getHeaderByNum(
            _rblockNum
        );
        ICanonicalStateChain.Header memory prevRBlock = chain.getHeaderByNum(
            _rblockNum - 1
        );

        // 2. Check that this exact L2 header is not already challenged
        bytes32 challengeHash = keccak256(abi.encodePacked(rblockHash, _l2Num));
        require(
            l2HeaderChallenges[challengeHash].status ==
                L2HeaderChallengeStatus.None,
            "challenge already exists"
        );

        // 3. Check that the L2 header is within the rblock bundle range
        require(
            _l2Num > prevRBlock.l2Height && _l2Num <= rblock.l2Height,
            "L2 header must be within the rblock bundle range"
        );

        // 4. Check that the L2 header is not the first in the first rblock
        require(
            !(_rblockNum == 1 && _l2Num == prevRBlock.l2Height + 1),
            "Cannot challenge the first L2 header in the first rblock"
        );

        // 5. Create pointer to the L2 header
        L2HeaderPointer memory header = L2HeaderPointer(rblockHash, _l2Num);

        // 6. Create a pointer the previous L2 header
        L2HeaderPointer memory prevHeader = L2HeaderPointer(
            rblockHash,
            _l2Num - 1
        );

        if (_l2Num == prevRBlock.l2Height + 1) {
            // If the L2 header is the first in the rblock, then the previous header is in the previous rblock
            prevHeader = L2HeaderPointer(rblock.prevHash, prevRBlock.l2Height);
        }

        // 7. Create the challenge
        l2HeaderChallenges[challengeHash] = L2HeaderChallenge(
            _rblockNum,
            header,
            prevHeader,
            block.timestamp + challengePeriod,
            msg.sender,
            L2HeaderChallengeStatus.Initiated,
            false
        );

        // 8. Emit the challenge event
        emit L2HeaderChallengeUpdate(
            challengeHash,
            _l2Num,
            rblockHash,
            block.timestamp + challengePeriod,
            L2HeaderChallengeStatus.Initiated
        );

        return challengeHash;
    }

    /// @notice Defends an L2 header challenge by providing the L2 header and the previous L2 header.
    /// @param _challengeHash - The hash of the challenge.
    /// @param _headerHash - The hash of the L2 header.
    /// @param _headerPrevHash - The hash of the previous L2 header.
    function defendL2Header(
        bytes32 _challengeHash,
        bytes32 _headerHash,
        bytes32 _headerPrevHash
    ) external nonReentrant {
        L2HeaderChallenge storage challenge = l2HeaderChallenges[
            _challengeHash
        ];
        require(
            challenge.status == L2HeaderChallengeStatus.Initiated,
            "challenge is not in the correct state"
        );

        // 0. Check that the header and previous headers are part of the correct rblocks
        // - This prevents rolled back l2 headers from being used to defend
        require(
            chainOracle.headerToRblock(_headerHash) == challenge.header.rblock,
            "l2 header not loaded for the given rblock"
        );
        require(
            chainOracle.headerToRblock(_headerPrevHash) ==
                challenge.prevHeader.rblock,
            "previous l2 header not loaded for the given rblock"
        );

        // 1. Load the header and previous header from the ChainOracle
        IChainOracle.L2Header memory header = chainOracle.getHeader(
            _headerHash
        );
        IChainOracle.L2Header memory prevHeader = chainOracle.getHeader(
            _headerPrevHash
        );

        // 2. Check the headers has the correct number
        require(
            header.number == challenge.header.number,
            "header number does not match"
        );
        require(
            prevHeader.number == challenge.prevHeader.number,
            "previous header number does not match"
        );

        // 3. Check the blocks are sequential
        require(
            header.parentHash == _headerPrevHash,
            "header does not point to the previous header"
        );

        // 4. Check the timestamp is correct
        require(
            header.timestamp >= prevHeader.timestamp,
            "header timestamp is too late"
        );
        require(
            header.timestamp < block.timestamp,
            "header timestamp is in the future"
        );
        require(
            prevHeader.timestamp < block.timestamp,
            "previous header timestamp is the future"
        );

        // finalise the challenge
        challenge.status = L2HeaderChallengeStatus.DefenderWon;

        // emit the event
        emit L2HeaderChallengeUpdate(
            _challengeHash,
            challenge.header.number,
            challenge.header.rblock,
            challenge.challengeEnd,
            L2HeaderChallengeStatus.DefenderWon
        );
    }

    /// @notice Settles an L2 header challenge by paying out the challenger.
    /// @param _challengeHash - The hash of the challenge.
    /// @dev Can only be called after the challenge period has ended and a
    ///      defender has not responded.
    function settleL2HeaderChallenge(bytes32 _challengeHash) external {
        L2HeaderChallenge storage challenge = l2HeaderChallenges[
            _challengeHash
        ];
        require(
            challenge.status == L2HeaderChallengeStatus.Initiated,
            "challenge is not in the correct state"
        );
        require(
            block.timestamp > challenge.challengeEnd,
            "challenge period has not ended"
        );

        // finalise the challenge
        challenge.status = L2HeaderChallengeStatus.ChallengerWon;

        // rollback the block
        chain.rollback(challenge.blockNum - 1, challenge.header.rblock);

        emit L2HeaderChallengeUpdate(
            _challengeHash,
            challenge.header.number,
            challenge.header.rblock,
            challenge.challengeEnd,
            L2HeaderChallengeStatus.ChallengerWon
        );
    }

    /// @notice Returns the hash of an L2 header challenge.
    /// @param _rblockHash - The rblock hash of the L2 header.
    /// @param _l2Num - The number of the L2 header.
    function l2HeaderChallengeHash(
        bytes32 _rblockHash,
        uint256 _l2Num
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_rblockHash, _l2Num));
    }

    /// @notice Toggles the L2 header challenges on or off.
    /// @param _status - The status of the L2 header challenges.
    /// @dev Only the owner can call this function.
    function toggleL2HeaderChallenge(bool _status) external onlyOwner {
        isL2HeaderChallengeEnabled = _status;
    }

    /// @notice Allows the challender or defender to claim the reward for an L2 header challenge.
    /// @param _challengeKey - The key of the challenge.
    function claimL2HeaderChallengeReward(
        bytes32 _challengeKey
    ) external nonReentrant {
        L2HeaderChallenge storage challenge = l2HeaderChallenges[_challengeKey];
        require(
            challenge.claimed == false,
            "challenge has already been claimed"
        );
        require(
            challenge.status == L2HeaderChallengeStatus.ChallengerWon ||
                challenge.status == L2HeaderChallengeStatus.DefenderWon,
            "challenge is not in the correct state"
        );

        challenge.claimed = true;
        if (challenge.status == L2HeaderChallengeStatus.ChallengerWon) {
            (bool success, ) = challenge.challenger.call{value: challengeFee}(
                ""
            );
            require(success, "failed to pay challenger");
        } else {
            (bool success, ) = defender.call{value: challengeFee}("");
            require(success, "failed to pay defender");
        }
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

abstract contract ChallengeDataAvailability is ChallengeBase {
    /// @notice The different states a DA challenge can be in.
    /// @param None - The DA challenge has not been initiated.
    /// @param ChallengerInitiated - The DA challenge has been initiated by the challenger.
    /// @param ChallengerWon - The DA challenge has been won by the challenger.
    /// @param DefenderWon - The DA challenge has been won by the defender.
    enum ChallengeDAStatus {
        None,
        ChallengerInitiated,
        ChallengerWon,
        DefenderWon
    }

    /// @notice The data structure for a DA challenge.
    /// @param blockHash - The block hash of the block being challenged.
    /// @param blockIndex - The index of the block being challenged.
    /// @param pointerIndex - The index of the celestia pointer being challenged.
    /// @param shareIndex - The index of the share being challenged.
    /// @param challenger - The address of the challenger.
    /// @param expiry - The expiry time of the challenge.
    /// @param status - The status of the challenge.
    /// @param claimed - Whether the challenge has been claimed.
    struct ChallengeDA {
        bytes32 blockHash;
        uint256 blockIndex;
        uint8 pointerIndex;
        uint32 shareIndex;
        address challenger;
        uint256 expiry;
        ChallengeDAStatus status;
        bool claimed;
    }

    /// @notice The data structure for a DA challenge proof.
    /// @param rootNonce - The nonce of the data root.
    /// @param dataRootTuple - The data root tuple.
    /// @param proof - The binary merkle proof.
    struct ChallengeDAProof {
        uint256 rootNonce;
        DataRootTuple dataRootTuple;
        BinaryMerkleProof proof;
    }

    /// @notice Emitted when a DA challenge is updated.
    /// @param _blockHash - The block hash of the block being challenged.
    /// @param _pointerIndex - The index of the celestia pointer being challenged.
    /// @param _shareIndex - The index of the share being challenged.
    /// @param _blockIndex - The index of the block being challenged.
    /// @param _expiry - The expiry time of the challenge.
    /// @param _status - The status of the challenge.
    event ChallengeDAUpdate(
        bytes32 indexed _blockHash,
        uint256 indexed _pointerIndex,
        uint32 _shareIndex,
        uint256 _blockIndex,
        uint256 _expiry,
        ChallengeDAStatus indexed _status
    );

    /// @notice The mapping of challengeKey to challenges.
    /// @dev There should only be one challenge per blockhash-celestiapointer pair.
    mapping(bytes32 => ChallengeDA) public daChallenges;

    /// @notice The fee required to make a challenge.
    /// @dev Is disabled by default.
    bool public isDAChallengeEnabled;

    /// @notice Returns the reference key for a DA challenge.
    /// @param _blockHash - The block hash of the block being challenged.
    /// @param _pointerIndex - The index of the celestia pointer being challenged.
    /// @param _shareIndex - The index of the share being challenged.
    /// @return The reference key for the DA challenge.
    function dataRootInclusionChallengeKey(
        bytes32 _blockHash,
        uint8 _pointerIndex,
        uint32 _shareIndex
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(_blockHash, _pointerIndex, _shareIndex));
    }

    /// @notice Challenges the data root inclusion of a block.
    /// @param _blockIndex - The index of the block to challenge.
    /// @param _pointerIndex - The index of the celestia pointer to challenge.
    /// @param _shareIndex - The index of the share to challenge.
    /// @return The index of the block being challenged.
    function challengeDataRootInclusion(
        uint256 _blockIndex,
        uint8 _pointerIndex,
        uint32 _shareIndex
    )
        external
        payable
        mustBeCanonical(_blockIndex)
        mustBeWithinChallengeWindow(_blockIndex) // TODO: use custom challenge period.
        requireChallengeFee
        returns (uint256)
    {
        require(isDAChallengeEnabled, "DA challenges are disabled");

        bytes32 challengeBlockHash = chain.chain(_blockIndex);
        bytes32 challengeKey = dataRootInclusionChallengeKey(
            challengeBlockHash,
            _pointerIndex,
            _shareIndex
        );

        // check if there is already a challenge for this block.
        ChallengeDA storage challenge = daChallenges[challengeKey];
        require(
            challenge.status == ChallengeDAStatus.None,
            "challenge already exists"
        );

        ICanonicalStateChain.Header memory header = chain.getHeaderByNum(
            _blockIndex
        );

        require(
            _pointerIndex < header.celestiaPointers.length,
            "invalid pointer index"
        );
        require(
            _shareIndex >= header.celestiaPointers[_pointerIndex].shareStart &&
                _shareIndex <
                header.celestiaPointers[_pointerIndex].shareStart +
                    header.celestiaPointers[_pointerIndex].shareLen,
            "invalid share index: not in pointers range"
        );

        // create a new challenge.
        daChallenges[challengeKey] = ChallengeDA(
            challengeBlockHash,
            _blockIndex,
            _pointerIndex,
            _shareIndex,
            msg.sender,
            block.timestamp + challengePeriod,
            ChallengeDAStatus.ChallengerInitiated,
            false
        );

        emit ChallengeDAUpdate(
            challengeBlockHash,
            _pointerIndex,
            _shareIndex,
            _blockIndex,
            block.timestamp + challengePeriod,
            ChallengeDAStatus.ChallengerInitiated
        );

        return _blockIndex;
    }

    /// @notice Defends the data root inclusion of a block.
    /// @param _challengeKey - The reference key of the challenge.
    /// @param _proof - The proof of inclusion.
    function defendDataRootInclusion(
        bytes32 _challengeKey,
        SharesProof memory _proof
    ) public nonReentrant {
        ChallengeDA storage challenge = daChallenges[_challengeKey];
        ICanonicalStateChain.Header memory header = chain.getHeaderByNum(
            challenge.blockIndex
        );

        require(
            challenge.status == ChallengeDAStatus.ChallengerInitiated,
            "challenge is not in the correct state"
        );
        require(
            header.celestiaPointers[challenge.pointerIndex].height ==
                _proof.attestationProof.tuple.height,
            "invalid celestia height"
        );

        // check the namespace
        require(_proof.namespace.equalTo(daNamespace), "invalid namespace");

        // verify the provided proof is valid – this also calls verifyAttestations.
        (bool success, ) = DAVerifier.verifySharesToDataRootTupleRoot(
            daOracle,
            _proof,
            _proof.attestationProof.tuple.dataRoot
        );
        require(success, "failed to verify shares to data root tuple root");

        // calculate squaresize
        (uint256 squaresize, ) = DAVerifier.computeSquareSizeFromRowProof(
            _proof.rowProofs[0]
        );

        // check that the share index is within the celestia pointer range.
        uint256 shareIndexInRow = _proof.shareProofs[0].beginKey;
        uint256 shareIndexInRowMajorOrder = shareIndexInRow +
            squaresize *
            _proof.rowProofs[0].key;
        require(
            shareIndexInRowMajorOrder == challenge.shareIndex,
            "proof must be provided for the challenged share index"
        );

        // update the challenge.
        challenge.status = ChallengeDAStatus.DefenderWon;
        emit ChallengeDAUpdate(
            challenge.blockHash,
            challenge.pointerIndex,
            challenge.shareIndex,
            challenge.blockIndex,
            challenge.expiry,
            ChallengeDAStatus.DefenderWon
        );

        // The defender can now call claimDAChallengeReward to claim the reward.
    }

    /// @notice Settles the data root inclusion challenge in favor of the challenger
    ///         if the defender does not respond within the challenge period.
    /// @param _challengeKey - The reference key of the challenge.
    function settleDataRootInclusion(
        bytes32 _challengeKey
    ) public nonReentrant {
        ChallengeDA storage challenge = daChallenges[_challengeKey];
        require(
            challenge.status == ChallengeDAStatus.ChallengerInitiated,
            "challenge is not in the correct state"
        );
        require(
            block.timestamp > challenge.expiry,
            "challenge has not expired"
        );

        // update the challenge.
        challenge.status = ChallengeDAStatus.ChallengerWon;

        // rollback the chain.
        chain.rollback(challenge.blockIndex - 1, challenge.blockHash);

        emit ChallengeDAUpdate(
            challenge.blockHash,
            challenge.pointerIndex,
            challenge.shareIndex,
            challenge.blockIndex,
            challenge.expiry,
            ChallengeDAStatus.ChallengerWon
        );

        // The challenger can now call claimDAChallengeReward to claim the reward.
    }

    /// @notice Toggles the data availability challenges on or off.
    /// @param _status - The status of the data availability challenges.
    /// @dev Only the owner can call this function.
    function toggleDAChallenge(bool _status) external onlyOwner {
        isDAChallengeEnabled = _status;
    }

    /// @notice Claims the reward for a data root inclusion challenge.
    /// @param _challengeKey - The reference key of the challenge.
    function claimDAChallengeReward(
        bytes32 _challengeKey
    ) external nonReentrant {
        ChallengeDA storage challenge = daChallenges[_challengeKey];
        require(
            challenge.claimed == false,
            "challenge has already been claimed"
        );
        require(
            challenge.status == ChallengeDAStatus.ChallengerWon ||
                challenge.status == ChallengeDAStatus.DefenderWon,
            "challenge is not in the correct state"
        );

        challenge.claimed = true;
        if (challenge.status == ChallengeDAStatus.ChallengerWon) {
            (bool success, ) = challenge.challenger.call{value: challengeFee}(
                ""
            );
            require(success, "failed to pay challenger");
        } else {
            (bool success, ) = defender.call{value: challengeFee}("");
            require(success, "failed to pay defender");
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

abstract contract ReentrancyGuardUpgradeable is Initializable {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /// @custom:storage-location erc7201:openzeppelin.storage.ReentrancyGuard
    struct ReentrancyGuardStorage {
        uint256 _status;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant ReentrancyGuardStorageLocation = 0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    function _getReentrancyGuardStorage() private pure returns (ReentrancyGuardStorage storage $) {
        assembly {
            $.slot := ReentrancyGuardStorageLocation
        }
    }

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    function __ReentrancyGuard_init() internal onlyInitializing {
        __ReentrancyGuard_init_unchained();
    }

    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
        ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
        $._status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if ($._status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        $._status = ENTERED;
    }

    function _nonReentrantAfter() private {
        ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        $._status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        ReentrancyGuardStorage storage $ = _getReentrancyGuardStorage();
        return $._status == ENTERED;
    }
}

struct Namespace {
    // The namespace version.
    bytes1 version;
    // The namespace ID.
    bytes28 id;
}

contract ChallengeBase is
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    /// @notice Maximum age of a block that can be challenged.
    uint256 public challengeWindow;

    /// @notice The period of time that a challenge is open for.
    uint256 public challengePeriod;

    /// @notice The fee required to make a challenge.
    uint256 public challengeFee;

    /// @notice The reward for successfully challenging a block.
    uint256 public challengeReward;

    /// @notice The address of the defender.
    address public defender;

    /// @notice The address of the chain oracle.
    IChainOracle public chainOracle;

    /// @notice The address of the canonical state chain.
    ICanonicalStateChain public chain;

    /// @notice The namespace used for data availability.
    Namespace public daNamespace;

    /// @notice The address of the data availability oracle.
    IDAOracle public daOracle;

    /// @notice This function is a special internal function that's part of
    ///         the UUPS upgradeable contract's lifecycle. When you want to
    ///         upgrade the contract to a new version, _authorizeUpgrade is
    ///         called to check whether the upgrade is authorized, thus
    ///         preventing anyone from just upgrading the contract.
    /// @dev Only the owner can call this function.
    function _authorizeUpgrade(address) internal override onlyOwner {}

    /// @notice Initializes the contract with the chain, daOracle,
    ///         and chainOracle addresses.
    /// @param _chain The address of the canonical state chain.
    /// @param _daOracle The address of the data availability oracle.
    /// @param _chainOracle The address of the chain oracle.
    function __ChallengeBase_init(
        address _chain,
        address _daOracle,
        address _chainOracle
    ) internal {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        challengeWindow = 3 days;
        challengePeriod = 2 days;
        challengeFee = 1.5 ether;
        challengeReward = 0.2 ether; // unused.

        chain = ICanonicalStateChain(_chain);
        daOracle = IDAOracle(_daOracle);
        chainOracle = IChainOracle(_chainOracle);
    }

    /// @notice Ensures that the block is within the challenge window. It
    ///         is used to prevent challenges on blocks that are too old.
    /// @param index The index of the block to check.
    modifier mustBeWithinChallengeWindow(uint256 index) {
        require(index != 0, "cannot challenge genesis block");
        require(
            block.timestamp <=
                chain.headerMetadata(chain.chain(index)).timestamp +
                    challengeWindow,
            "block is too old to challenge"
        );
        _;
    }

    /// @notice Ensures that the block is within the chain.
    /// @param index The index of the block to check.
    modifier mustBeCanonical(uint256 index) {
        require(index <= chain.chainHead(), "block not in the chain yet");
        _;
    }

    /// @notice Ensures the challenger has paid the challenge fee.
    modifier requireChallengeFee() {
        require(msg.value == challengeFee, "challenge fee not paid");
        _;
    }

    /// @return The total time in seconds for a block to be finalized.
    function finalizationSeconds() external view returns (uint256) {
        return challengePeriod + challengeWindow;
    }

    /// @notice Sets the challenge window time in seconds.
    /// @param _challengeWindow The new challenge window time.
    /// @dev Only the owner can call this function.
    function setChallengeWindow(uint256 _challengeWindow) external onlyOwner {
        require(
            _challengeWindow >= 12 hours && _challengeWindow <= 3 weeks,
            "challenge window must be between 12 hours and 3 weeks"
        );
        challengeWindow = _challengeWindow;
    }

    /// @notice Sets the challenge period time in seconds.
    /// @param _challengePeriod The new challenge period time.
    /// @dev Only the owner can call this function.
    function setChallengePeriod(uint256 _challengePeriod) external onlyOwner {
        require(
            _challengePeriod >= 12 hours && _challengePeriod <= 3 weeks,
            "challenge period must be between 12 hours and 3 weeks"
        );
        challengePeriod = _challengePeriod;
    }

    /// @notice Sets the challenge fee in wei.
    /// @param _challengeFee The new challenge fee.
    /// @dev Only the owner can call this function.
    function setChallengeFee(uint256 _challengeFee) external onlyOwner {
        require(
            _challengeFee >= 0.01 ether && _challengeFee <= 10 ether,
            "challenge fee must be between 0.01 ether and 10 ether"
        );
        challengeFee = _challengeFee;
    }

    /// @notice Sets the challenge reward in wei.
    /// @param _challengeReward The new challenge reward.
    /// @dev Only the owner can call this function.
    function setChallengeReward(uint256 _challengeReward) external onlyOwner {
        require(
            _challengeReward >= 0.01 ether && _challengeReward <= 10 ether,
            "challenge reward must be between 0.01 ether and 10 ether"
        );
        challengeReward = _challengeReward;
    }

    /// @notice Sets the defender address.
    /// @param _defender The new defender address.
    /// @dev Only the owner can call this function.
    function setDefender(address _defender) external onlyOwner {
        require(_defender != address(0), "defender cannot be the zero address");
        defender = _defender;
    }

    /// @notice Sets the namespace.
    /// @param _namespace The new namespace.
    /// @dev Only the owner can call this function.
    function setDANamespace(Namespace memory _namespace) external onlyOwner {
        daNamespace = _namespace;
    }

    /// @notice Sets the data availability oracle address.
    /// @param _daOracle The new data availability oracle address.
    /// @dev Only the owner can call this function.
    function setDAOracle(address _daOracle) external onlyOwner {
        require(_daOracle != address(0), "daOracle cannot be the zero address");
        daOracle = IDAOracle(_daOracle);
    }

    uint256[50] private __gap;
}

abstract contract ChallengeHeader is ChallengeBase {
    /// @notice The reasons a header can be invalid.
    /// @param InvalidEpoch - The epoch is less than or equal to the previous epoch.
    /// @param InvalidL2Height - The l2Height is less than or equal to the previous l2Height.
    /// @param InvalidPrevHash - The prevHash is not the previous block hash.
    /// @param InvalidBundleSize - The bundle size is greater than the max bundle size.
    enum InvalidHeaderReason {
        InvalidEpoch,
        InvalidL2Height,
        InvalidPrevHash,
        InvalidBundleSize
    }

    /// @notice Emitted when a header is invalid.
    /// @param _blockIndex - The block index of the invalid header.
    /// @param _hash - The hash of the invalid header.
    /// @param _reason - The reason the header is invalid.
    event InvalidHeader(
        uint256 indexed _blockIndex,
        bytes32 indexed _hash,
        InvalidHeaderReason indexed _reason
    );

    /// @notice Whether the header challenge is enabled.
    /// @dev Is disabled by default.
    bool public isHeaderChallengeEnabled;

    /// @notice The maximum bundle size.
    uint256 public maxBundleSize;

    /// @notice Initializes the contract.
    function __ChallengeHeader_init() internal {
        maxBundleSize = 42000;
    }

    /// @notice Invalidate challenges a block header by checking that the header is valid.
    /// @param _blockIndex - The block index of the header to challenge.
    function invalidateHeader(
        uint256 _blockIndex
    )
        external
        mustBeCanonical(_blockIndex)
        mustBeWithinChallengeWindow(_blockIndex)
    {
        require(isHeaderChallengeEnabled, "header challenge is disabled");

        bytes32 _hash = chain.chain(_blockIndex);
        ICanonicalStateChain.Header memory header = chain.getHeaderByNum(
            _blockIndex
        );

        // check header validity.
        require(!_isHeaderValid(header, _hash, _blockIndex), "header is valid");

        // rollback the chain.
        chain.rollback(_blockIndex - 1, _hash);
    }

    /// @notice Checks if a header is valid.
    /// @param _header - The header to check.
    /// @param _hash - The hash of the header.
    /// @param _blockIndex - The block index of the header.
    /// @return True if the header is valid.
    function _isHeaderValid(
        ICanonicalStateChain.Header memory _header,
        bytes32 _hash,
        uint256 _blockIndex
    ) internal returns (bool) {
        // check that the blocks epoch is greater than the previous epoch.
        if (_header.epoch <= chain.getHeaderByNum(_blockIndex - 1).epoch) {
            emit InvalidHeader(
                _header.epoch,
                _hash,
                InvalidHeaderReason.InvalidEpoch
            );
            return false;
        }

        // check that the l2 height is greater than the previous l2 height.
        if (
            _header.l2Height <= chain.getHeaderByNum(_blockIndex - 1).l2Height
        ) {
            emit InvalidHeader(
                _header.epoch,
                _hash,
                InvalidHeaderReason.InvalidL2Height
            );
            return false;
        }

        // check that the prevHash is the previous block hash.
        if (_header.prevHash != chain.chain(_blockIndex - 1)) {
            emit InvalidHeader(
                _header.epoch,
                _hash,
                InvalidHeaderReason.InvalidPrevHash
            );
            return false;
        }

        // check that the bundle size is less than the max bundle size.
        if (
            _header.l2Height - chain.getHeaderByNum(_blockIndex - 1).l2Height >
            maxBundleSize
        ) {
            emit InvalidHeader(
                _header.epoch,
                _hash,
                InvalidHeaderReason.InvalidBundleSize
            );
            return false;
        }

        return true;
    }

    /// @notice Enables or disables the header challenge.
    /// @param _status - The status to set.
    /// @dev Only the owner can call this function.
    function toggleHeaderChallenge(bool _status) external onlyOwner {
        isHeaderChallengeEnabled = _status;
    }

    /// @notice Sets the maximum bundle size.
    /// @param _maxBundleSize - The new maximum bundle size.
    /// @dev Only the owner can call this function.
    function setMaxBundleSize(uint256 _maxBundleSize) external onlyOwner {
        maxBundleSize = _maxBundleSize;
    }

    uint256[50] private __gap;
}

contract Challenge is
    ChallengeHeader,
    ChallengeDataAvailability,
    ChallengeL2Header
{
    /// @notice Initializes the Challenge contract.
    /// @param _chain - The address of the chain contract.
    /// @param _daOracle - The address of the data availability oracle.
    /// @param _chainOracle - The address of the chain oracle contract.
    function initialize(
        address _chain,
        address _daOracle,
        address _chainOracle
    ) public initializer {
        __ChallengeBase_init(_chain, _daOracle, _chainOracle);

        __ChallengeHeader_init();
    }
}