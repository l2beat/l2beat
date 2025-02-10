// SPDX-License-Identifier: Unknown
pragma solidity 0.8.9;

library NodeLib {
    /**
     * @notice Initialize a Node
     * @param _stateHash Initial value of stateHash
     * @param _challengeHash Initial value of challengeHash
     * @param _confirmData Initial value of confirmData
     * @param _prevNum Initial value of prevNum
     * @param _deadlineBlock Initial value of deadlineBlock
     * @param _nodeHash Initial value of nodeHash
     */
    function createNode(
        bytes32 _stateHash,
        bytes32 _challengeHash,
        bytes32 _confirmData,
        uint64 _prevNum,
        uint64 _deadlineBlock,
        bytes32 _nodeHash
    ) internal view returns (Node memory) {
        Node memory node;
        node.stateHash = _stateHash;
        node.challengeHash = _challengeHash;
        node.confirmData = _confirmData;
        node.prevNum = _prevNum;
        node.deadlineBlock = _deadlineBlock;
        node.noChildConfirmedBeforeBlock = _deadlineBlock;
        node.createdAtBlock = uint64(block.number);
        node.nodeHash = _nodeHash;
        return node;
    }

    /**
     * @notice Update child properties
     * @param number The child number to set
     */
    function childCreated(Node storage self, uint64 number) internal {
        if (self.firstChildBlock == 0) {
            self.firstChildBlock = uint64(block.number);
        }
        self.latestChildNumber = number;
    }

    /**
     * @notice Update the child confirmed deadline
     * @param deadline The new deadline to set
     */
    function newChildConfirmDeadline(Node storage self, uint64 deadline) internal {
        self.noChildConfirmedBeforeBlock = deadline;
    }

    /**
     * @notice Check whether the current block number has met or passed the node's deadline
     */
    function requirePastDeadline(Node memory self) internal view {
        require(block.number >= self.deadlineBlock, "BEFORE_DEADLINE");
    }

    /**
     * @notice Check whether the current block number has met or passed deadline for children of this node to be confirmed
     */
    function requirePastChildConfirmDeadline(Node memory self) internal view {
        require(block.number >= self.noChildConfirmedBeforeBlock, "CHILD_TOO_RECENT");
    }
}

struct Node {
    // Hash of the state of the chain as of this node
    bytes32 stateHash;
    // Hash of the data that can be challenged
    bytes32 challengeHash;
    // Hash of the data that will be committed if this node is confirmed
    bytes32 confirmData;
    // Index of the node previous to this one
    uint64 prevNum;
    // Deadline at which this node can be confirmed
    uint64 deadlineBlock;
    // Deadline at which a child of this node can be confirmed
    uint64 noChildConfirmedBeforeBlock;
    // Number of stakers staked on this node. This includes real stakers and zombies
    uint64 stakerCount;
    // Number of stakers staked on a child node. This includes real stakers and zombies
    uint64 childStakerCount;
    // This value starts at zero and is set to a value when the first child is created. After that it is constant until the node is destroyed or the owner destroys pending nodes
    uint64 firstChildBlock;
    // The number of the latest child of this node to be created
    uint64 latestChildNumber;
    // The block number when this node was created
    uint64 createdAtBlock;
    // A hash of all the data needed to determine this node's validity, to protect against reorgs
    bytes32 nodeHash;
}

contract ValidatorUtils {
    using NodeLib for Node;

    enum ConfirmType {
        NONE,
        VALID,
        INVALID
    }

    enum NodeConflictType {
        NONE,
        FOUND,
        INDETERMINATE,
        INCOMPLETE
    }

    struct NodeConflict {
        NodeConflictType ty;
        uint64 node1;
        uint64 node2;
    }

    function findStakerConflict(
        IRollupCore rollup,
        address staker1,
        address staker2,
        uint256 maxDepth
    ) external view returns (NodeConflict memory) {
        uint64 staker1NodeNum = rollup.latestStakedNode(staker1);
        uint64 staker2NodeNum = rollup.latestStakedNode(staker2);
        return findNodeConflict(rollup, staker1NodeNum, staker2NodeNum, maxDepth);
    }

    function checkDecidableNextNode(IRollupUserAbs rollup) external view returns (ConfirmType) {
        try ValidatorUtils(address(this)).requireConfirmable(rollup) {
            return ConfirmType.VALID;
        } catch {}

        try ValidatorUtils(address(this)).requireRejectable(rollup) {
            return ConfirmType.INVALID;
        } catch {
            return ConfirmType.NONE;
        }
    }

    function requireRejectable(IRollupCore rollup) external view {
        IRollupUser(address(rollup)).requireUnresolvedExists();
        uint64 firstUnresolvedNode = rollup.firstUnresolvedNode();
        Node memory node = rollup.getNode(firstUnresolvedNode);
        if (node.prevNum == rollup.latestConfirmed()) {
            // Verify the block's deadline has passed
            require(block.number >= node.deadlineBlock, "BEFORE_DEADLINE");
            rollup.getNode(node.prevNum).requirePastChildConfirmDeadline();

            // Verify that no staker is staked on this node
            require(
                node.stakerCount ==
                    IRollupUser(address(rollup)).countStakedZombies(firstUnresolvedNode),
                "HAS_STAKERS"
            );
        }
    }

    function requireConfirmable(IRollupUserAbs rollup) external view {
        rollup.requireUnresolvedExists();

        uint256 stakerCount = rollup.stakerCount();
        // There is at least one non-zombie staker
        require(stakerCount > 0, "NO_STAKERS");

        uint64 firstUnresolved = rollup.firstUnresolvedNode();
        Node memory node = rollup.getNode(firstUnresolved);

        // Verify the block's deadline has passed
        node.requirePastDeadline();

        // Check that prev is latest confirmed
        assert(node.prevNum == rollup.latestConfirmed());

        Node memory prevNode = rollup.getNode(node.prevNum);
        prevNode.requirePastChildConfirmDeadline();

        uint256 zombiesStakedOnOtherChildren = rollup.countZombiesStakedOnChildren(node.prevNum) -
            rollup.countStakedZombies(firstUnresolved);
        require(
            prevNode.childStakerCount == node.stakerCount + zombiesStakedOnOtherChildren,
            "NOT_ALL_STAKED"
        );
    }

    function refundableStakers(IRollupCore rollup) external view returns (address[] memory) {
        uint256 stakerCount = rollup.stakerCount();
        address[] memory stakers = new address[](stakerCount);
        uint256 latestConfirmed = rollup.latestConfirmed();
        uint256 index = 0;
        for (uint64 i = 0; i < stakerCount; i++) {
            address staker = rollup.getStakerAddress(i);
            uint256 latestStakedNode = rollup.latestStakedNode(staker);
            if (latestStakedNode <= latestConfirmed && rollup.currentChallenge(staker) == 0) {
                stakers[index] = staker;
                index++;
            }
        }
        assembly {
            mstore(stakers, index)
        }
        return stakers;
    }

    function latestStaked(IRollupCore rollup, address staker)
        external
        view
        returns (uint64, Node memory)
    {
        uint64 num = rollup.latestStakedNode(staker);
        if (num == 0) {
            num = rollup.latestConfirmed();
        }
        Node memory node = rollup.getNode(num);
        return (num, node);
    }

    function stakedNodes(IRollupCore rollup, address staker)
        external
        view
        returns (uint64[] memory)
    {
        uint64[] memory nodes = new uint64[](100000);
        uint256 index = 0;
        for (uint64 i = rollup.latestConfirmed(); i <= rollup.latestNodeCreated(); i++) {
            if (rollup.nodeHasStaker(i, staker)) {
                nodes[index] = i;
                index++;
            }
        }
        // Shrink array down to real size
        assembly {
            mstore(nodes, index)
        }
        return nodes;
    }

    function findNodeConflict(
        IRollupCore rollup,
        uint64 node1,
        uint64 node2,
        uint256 maxDepth
    ) public view returns (NodeConflict memory) {
        uint64 firstUnresolvedNode = rollup.firstUnresolvedNode();
        uint64 node1Prev = rollup.getNode(node1).prevNum;
        uint64 node2Prev = rollup.getNode(node2).prevNum;

        for (uint256 i = 0; i < maxDepth; i++) {
            if (node1 == node2) {
                return NodeConflict(NodeConflictType.NONE, node1, node2);
            }
            if (node1Prev == node2Prev) {
                return NodeConflict(NodeConflictType.FOUND, node1, node2);
            }
            if (node1Prev < firstUnresolvedNode && node2Prev < firstUnresolvedNode) {
                return NodeConflict(NodeConflictType.INDETERMINATE, 0, 0);
            }
            if (node1Prev < node2Prev) {
                node2 = node2Prev;
                node2Prev = rollup.getNode(node2).prevNum;
            } else {
                node1 = node1Prev;
                node1Prev = rollup.getNode(node1).prevNum;
            }
        }
        return NodeConflict(NodeConflictType.INCOMPLETE, 0, 0);
    }

    function getStakers(
        IRollupCore rollup,
        uint64 startIndex,
        uint64 max
    ) public view returns (address[] memory, bool hasMore) {
        uint256 maxStakers = rollup.stakerCount();
        if (startIndex + max <= maxStakers) {
            maxStakers = startIndex + max;
            hasMore = true;
        }

        address[] memory stakers = new address[](maxStakers);
        for (uint64 i = 0; i < maxStakers; i++) {
            stakers[i] = rollup.getStakerAddress(startIndex + i);
        }
        return (stakers, hasMore);
    }

    function timedOutChallenges(
        IRollupCore rollup,
        uint64 startIndex,
        uint64 max
    ) external view returns (uint64[] memory, bool hasMore) {
        (address[] memory stakers, bool hasMoreStakers) = getStakers(rollup, startIndex, max);
        uint64[] memory challenges = new uint64[](stakers.length);
        uint256 index = 0;
        IChallengeManager challengeManager = rollup.challengeManager();
        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint64 challengeIndex = rollup.currentChallenge(staker);
            if (
                challengeIndex != NO_CHAL_INDEX &&
                challengeManager.isTimedOut(challengeIndex) &&
                challengeManager.currentResponder(challengeIndex) == staker
            ) {
                challenges[index++] = challengeIndex;
            }
        }
        // Shrink array down to real size
        assembly {
            mstore(challenges, index)
        }
        return (challenges, hasMoreStakers);
    }

    // Worst case runtime of O(depth), as it terminates if it switches paths.
    function areUnresolvedNodesLinear(IRollupCore rollup) external view returns (bool) {
        uint256 end = rollup.latestNodeCreated();
        for (uint64 i = rollup.firstUnresolvedNode(); i <= end; i++) {
            if (i > 0 && rollup.getNode(i).prevNum != i - 1) {
                return false;
            }
        }
        return true;
    }
}