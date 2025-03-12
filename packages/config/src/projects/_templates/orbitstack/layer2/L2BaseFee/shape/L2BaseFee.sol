// SPDX-License-Identifier: Unknown
pragma solidity 0.8.16;

function uncheckedInc(uint256 x) pure returns (uint256) {
    unchecked {
        return x + 1;
    }
}

function hashWeights(uint256[] memory weights) pure returns (bytes32 res) {
    assembly ("memory-safe") {
        // same as keccak256(abi.encodePacked(weights))
        // save gas since the array is already in the memory
        // we skip the first 32 bytes (length) and hash the next length * 32 bytes
        res := keccak256(add(weights, 32), mul(mload(weights), 32))
    }
}

function hashAddresses(address[] memory addresses) pure returns (bytes32 res) {
    assembly ("memory-safe") {
        // same as keccak256(abi.encodePacked(addresses))
        // save gas since the array is already in the memory
        // we skip the first 32 bytes (length) and hash the next length * 32 bytes
        res := keccak256(add(addresses, 32), mul(mload(addresses), 32))
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
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
}

contract RewardDistributor is Ownable {
    /// @notice Amount of gas forwarded to each transfer call.
    /// @dev The recipient group is assumed to be a known group of contracts that won't consume more than this amount.
    uint256 public constant PER_RECIPIENT_GAS = 100_000;

    /// @notice The maximum number of addresses that may be recipients.
    /// @dev This ensures that all sends may always happen within a block.
    uint64 public constant MAX_RECIPIENTS = 64;

    /// @notice Hash of concat'ed recipient group.
    bytes32 public currentRecipientGroup;
    /// @notice Hash of concat'ed recipient weights.
    bytes32 public currentRecipientWeights;

    /// @notice The recipient couldn't receive rewards, so fallback to owner was triggered.
    event OwnerRecieved(address indexed owner, address indexed recipient, uint256 value);

    /// @notice Address successfully received rewards.
    event RecipientRecieved(address indexed recipient, uint256 value);

    /// @notice New recipients have been set
    event RecipientsUpdated(bytes32 recipientGroup, address[] recipients, bytes32 recipientWeights, uint256[] weights);

    /// @notice It is assumed that all recipients are able to receive eth when called with value but no data
    /// @param recipients Addresses to receive rewards.
    /// @param weights Weights of each recipient in basis points.
    constructor(address[] memory recipients, uint256[] memory weights) Ownable() {
        setRecipients(recipients, weights);
    }

    /// @notice allows eth to be deposited into this contract
    /// @dev this contract is expected to handle ether appearing in its balance as well as an explicit deposit
    receive() external payable {}

    /**
     * @notice Distributes previous rewards then updates the recipients to a new group.
     * @param currentRecipients Group of addresses that will receive their final rewards.
     * @param currentWeights Weights of the final rewards.
     * @param newRecipients Group of addresses that will receive future rewards.
     * @param newWeights Weights of the future rewards.
     */
    function distributeAndUpdateRecipients(
        address[] memory currentRecipients,
        uint256[] memory currentWeights,
        address[] memory newRecipients,
        uint256[] memory newWeights
    ) external onlyOwner {
        distributeRewards(currentRecipients, currentWeights);
        setRecipients(newRecipients, newWeights);
    }

    /**
     * @notice Sends rewards to the current group of recipients.
     * @dev The remainder will be kept in the contract.
     * @param recipients Group of addresses to receive rewards.
     * @param weights Weights of each recipient in basis points.
     */
    function distributeRewards(address[] memory recipients, uint256[] memory weights) public {
        if (recipients.length == 0) {
            revert EmptyRecipients();
        }

        if (recipients.length != weights.length) {
            revert InputLengthMismatch();
        }

        bytes32 recipientGroup = hashAddresses(recipients);
        if (recipientGroup != currentRecipientGroup) {
            revert InvalidRecipientGroup(currentRecipientGroup, recipientGroup);
        }

        bytes32 recipientWeights = hashWeights(weights);
        if (recipientWeights != currentRecipientWeights) {
            revert InvalidRecipientWeights(currentRecipientWeights, recipientWeights);
        }

        // calculate individual reward
        uint256 rewards = address(this).balance;
        // the reminder will be kept in the contract
        uint256 rewardPerBps = rewards / BASIS_POINTS;
        if (rewardPerBps == 0) {
            revert NoFundsToDistribute();
        }
        for (uint256 r; r < recipients.length; r = uncheckedInc(r)) {
            uint256 individualRewards;
            unchecked {
                // we know weights <= BASIS_POINTS
                individualRewards = rewardPerBps * weights[r];
            }
            // send the funds
            // if the recipient reentry to steal funds, the contract will not have sufficient
            // funds and revert when trying to send fund to the next recipient
            // if the recipient is the last, it doesn't matter since there are no extra fund to steal
            (bool success,) = recipients[r].call{value: individualRewards, gas: PER_RECIPIENT_GAS}("");

            // if the funds failed to send we send them to the owner for safe keeping
            // then the owner will have the opportunity to distribute them out of band
            if (success) {
                emit RecipientRecieved(recipients[r], individualRewards);
            } else {
                // cache owner in memory
                address _owner = owner();
                (bool ownerSuccess,) = _owner.call{value: individualRewards}("");
                // if this is the case then revert and sort it out
                // it's important that this fail in order to preserve the accounting in this contract.
                // if we dont fail here we enable a re-entrancy attack
                if (!ownerSuccess) {
                    revert OwnerFailedRecieve(_owner, recipients[r], individualRewards);
                }
                emit OwnerRecieved(_owner, recipients[r], individualRewards);
            }
        }
    }

    /**
     * @notice Validates and sets the group of recipient addresses. It is assumed that all recipients are able to receive eth
     * @dev We enforce a max number of recipients to ensure the distribution of rewards fits within a block.
     * @param recipients Group of addresses that will receive future rewards.
     * @param weights Weights of each recipient in basis points.
     */
    function setRecipients(address[] memory recipients, uint256[] memory weights) private {
        if (recipients.length == 0) {
            revert EmptyRecipients();
        }
        if (recipients.length != weights.length) {
            revert InputLengthMismatch();
        }
        if (recipients.length > MAX_RECIPIENTS) {
            // it is expected that all sends may happen within the block gas limit
            revert TooManyRecipients();
        }

        // validate that the total weight is 100%
        uint256 totalWeight = 0;
        for (uint256 i; i < weights.length; i = uncheckedInc(i)) {
            totalWeight += weights[i];
        }
        if (totalWeight != BASIS_POINTS) {
            revert InvalidTotalWeight(totalWeight);
        }

        // create a committment to the recipient group and update current
        bytes32 recipientGroup = hashAddresses(recipients);
        currentRecipientGroup = recipientGroup;

        // create a committment to the recipient weights and update current
        bytes32 recipientWeights = hashWeights(weights);
        currentRecipientWeights = recipientWeights;

        emit RecipientsUpdated(recipientGroup, recipients, recipientWeights, weights);
    }
}