// SPDX-License-Identifier: Unknown
pragma solidity 0.8.16;

abstract contract ReentrancyGuard {
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
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
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
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

contract Owned {
    address public owner;
    address public nominatedOwner;

    constructor (address _owner) {
        require(_owner != address(0), "Owner address cannot be 0");
        owner = _owner;
        emit OwnerChanged(address(0), _owner);
    }

    function nominateNewOwner(address _owner) external onlyOwner {
        nominatedOwner = _owner;
        emit OwnerNominated(_owner);
    }

    function acceptOwnership() external {
        require(msg.sender == nominatedOwner, "You must be nominated before you can accept ownership");
        emit OwnerChanged(owner, nominatedOwner);
        owner = nominatedOwner;
        nominatedOwner = address(0);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the contract owner may perform this action");
        _;
    }

    event OwnerNominated(address newOwner);
    event OwnerChanged(address oldOwner, address newOwner);
}

contract OperatorRegistry is Owned {

    struct Validator {
        bytes pubKey;
        bytes signature;
        bytes32 depositDataRoot;
    }

    Validator[] validators; // Array of unused / undeposited validators that can be used at a future time
    bytes curr_withdrawal_pubkey; // Pubkey for ETH 2.0 withdrawal creds. If you change it, you must empty the validators array
    address public timelock_address;

    constructor(address _owner, address _timelock_address, bytes memory _withdrawal_pubkey) Owned(_owner) {
        timelock_address = _timelock_address;
        curr_withdrawal_pubkey = _withdrawal_pubkey;
    }

    modifier onlyByOwnGov() {
        require(msg.sender == timelock_address || msg.sender == owner, "Not owner or timelock");
        _;
    }

    /// @notice Add a new validator
    /** @dev You should verify offchain that the validator is indeed valid before adding it
        Reason we don't do that here is for gas */
    function addValidator(Validator calldata validator) public onlyByOwnGov {
        validators.push(validator);
        emit ValidatorAdded(validator.pubKey, curr_withdrawal_pubkey);
    }

    /// @notice Add multiple new validators in one function call
    /** @dev You should verify offchain that the validators are indeed valid before adding them
        Reason we don't do that here is for gas */
    function addValidators(Validator[] calldata validatorArray) external onlyByOwnGov {
        uint arrayLength = validatorArray.length;
        for (uint256 i = 0; i < arrayLength; ++i) {
            addValidator(validatorArray[i]);
        }
    }

    /// @notice Swap the location of one validator with another
    function swapValidator(uint256 from_idx, uint256 to_idx) public onlyByOwnGov {
        // Get the original values
        Validator memory fromVal = validators[from_idx];
        Validator memory toVal = validators[to_idx];

        // Set the swapped values
        validators[to_idx] = fromVal;
        validators[from_idx] = toVal;

        emit ValidatorsSwapped(fromVal.pubKey, toVal.pubKey, from_idx, to_idx);
    }

    /// @notice Remove validators from the end of the validators array, in case they were added in error
    function popValidators(uint256 times) public onlyByOwnGov {
        // Loop through and remove validator entries at the end
        for (uint256 i = 0; i < times; ++i) {
            validators.pop();
        }

        emit ValidatorsPopped(times);
    }

    /** @notice Remove a validator from the array. If dont_care_about_ordering is true,  
        a swap and pop will occur instead of a more gassy loop */ 
    function removeValidator(uint256 remove_idx, bool dont_care_about_ordering) public onlyByOwnGov {
        // Get the pubkey for the validator to remove (for informational purposes)
        bytes memory removed_pubkey = validators[remove_idx].pubKey;

        // Less gassy to swap and pop
        if (dont_care_about_ordering){
            // Swap the (validator to remove) with the (last validator in the array)
            swapValidator(remove_idx, validators.length - 1);

            // Pop off the validator to remove, which is now at the end of the array
            validators.pop();
        }
        // More gassy, loop
        else {
            // Save the original validators
            Validator[] memory original_validators = validators;

            // Clear the original validators list
            delete validators;

            // Fill the new validators array with all except the value to remove
            for (uint256 i = 0; i < original_validators.length; ++i) {
                if (i != remove_idx) {
                    validators.push(original_validators[i]);
                }
            }
        }

        emit ValidatorRemoved(removed_pubkey, remove_idx, dont_care_about_ordering);
    }

    // Internal
    /// @dev Remove the last validator from the validators array and return its information
    function getNextValidator()
        internal
        returns (
            bytes memory pubKey,
            bytes memory withdrawalCredentials,
            bytes memory signature,
            bytes32 depositDataRoot
        )
    {
        // Make sure there are free validators available
        uint numVals = numValidators();
        require(numVals != 0, "Validator stack is empty");

        // Pop the last validator off the array
        Validator memory popped = validators[numVals - 1];
        validators.pop();

        // Return the validator's information
        pubKey = popped.pubKey;
        withdrawalCredentials = curr_withdrawal_pubkey;
        signature = popped.signature;
        depositDataRoot = popped.depositDataRoot;
    }

    /// @notice Return the information of the i'th validator in the registry
    function getValidator(uint i) 
        view
        external
        returns (
            bytes memory pubKey,
            bytes memory withdrawalCredentials,
            bytes memory signature,
            bytes32 depositDataRoot
        )
    {
        Validator memory v = validators[i];

        // Return the validator's information
        pubKey = v.pubKey;
        withdrawalCredentials = curr_withdrawal_pubkey;
        signature = v.signature;
        depositDataRoot = v.depositDataRoot;
    }

    /// @notice Returns a Validator struct of the given inputs to make formatting addValidator inputs easier
    function getValidatorStruct(
        bytes memory pubKey, 
        bytes memory signature, 
        bytes32 depositDataRoot
    ) external pure returns (Validator memory) {
        return Validator(pubKey, signature, depositDataRoot);
    }

    /// @notice Requires empty validator stack as changing withdrawal creds invalidates signature
    /// @dev May need to call clearValidatorArray() first
    function setWithdrawalCredential(bytes memory _new_withdrawal_pubkey) external onlyByOwnGov {
        require(numValidators() == 0, "Clear validator array first");
        curr_withdrawal_pubkey = _new_withdrawal_pubkey;

        emit WithdrawalCredentialSet(_new_withdrawal_pubkey);
    }

    /// @notice Empties the validator array
    /// @dev Need to do this before setWithdrawalCredential()
    function clearValidatorArray() external onlyByOwnGov {
        delete validators;

        emit ValidatorArrayCleared();
    }

    /// @notice Returns the number of validators
    function numValidators() public view returns (uint256) {
        return validators.length;
    }

    /// @notice Set the timelock contract
    function setTimelock(address _timelock_address) external onlyByOwnGov {
        require(_timelock_address != address(0), "Zero address detected");
        timelock_address = _timelock_address;
        emit TimelockChanged(_timelock_address);
    }

    event TimelockChanged(address timelock_address);
    event WithdrawalCredentialSet(bytes _withdrawalCredential);
    event ValidatorAdded(bytes pubKey, bytes withdrawalCredential);
    event ValidatorArrayCleared();
    event ValidatorRemoved(bytes pubKey, uint256 remove_idx, bool dont_care_about_ordering);
    event ValidatorsPopped(uint256 times);
    event ValidatorsSwapped(bytes from_pubKey, bytes to_pubKey, uint256 from_idx, uint256 to_idx);
    event KeysCleared();
}

contract frxETHMinter is OperatorRegistry, ReentrancyGuard {    
    uint256 public constant DEPOSIT_SIZE = 32 ether; // ETH 2.0 minimum deposit size
    uint256 public constant RATIO_PRECISION = 1e6; // 1,000,000 

    uint256 public withholdRatio; // What we keep and don't deposit whenever someone submit()'s ETH
    uint256 public currentWithheldETH; // Needed for internal tracking
    mapping(bytes => bool) public activeValidators; // Tracks validators (via their pubkeys) that already have 32 ETH in them

    IDepositContract public immutable depositContract; // ETH 2.0 deposit contract
    frxETH public immutable frxETHToken;
    IsfrxETH public immutable sfrxETHToken;

    bool public submitPaused;
    bool public depositEtherPaused;

    constructor(
        address depositContractAddress, 
        address frxETHAddress, 
        address sfrxETHAddress, 
        address _owner, 
        address _timelock_address,
        bytes memory _withdrawalCredential
    ) OperatorRegistry(_owner, _timelock_address, _withdrawalCredential) {
        depositContract = IDepositContract(depositContractAddress);
        frxETHToken = frxETH(frxETHAddress);
        sfrxETHToken = IsfrxETH(sfrxETHAddress);
        withholdRatio = 0; // No ETH is withheld initially
        currentWithheldETH = 0;
    }

    /// @notice Mint frxETH and deposit it to receive sfrxETH in one transaction
    /** @dev Could try using EIP-712 / EIP-2612 here in the future if you replace this contract,
        but you might run into msg.sender vs tx.origin issues with the ERC4626 */
    function submitAndDeposit(address recipient) external payable returns (uint256 shares) {
        // Give the frxETH to this contract after it is generated
        _submit(address(this));

        // Approve frxETH to sfrxETH for staking
        frxETHToken.approve(address(sfrxETHToken), msg.value);

        // Deposit the frxETH and give the generated sfrxETH to the final recipient
        uint256 sfrxeth_recieved = sfrxETHToken.deposit(msg.value, recipient);
        require(sfrxeth_recieved > 0, 'No sfrxETH was returned');

        return sfrxeth_recieved;
    }

    /// @notice Mint frxETH to the recipient using sender's funds. Internal portion
    function _submit(address recipient) internal nonReentrant {
        // Initial pause and value checks
        require(!submitPaused, "Submit is paused");
        require(msg.value != 0, "Cannot submit 0");

        // Give the sender frxETH
        frxETHToken.minter_mint(recipient, msg.value);

        // Track the amount of ETH that we are keeping
        uint256 withheld_amt = 0;
        if (withholdRatio != 0) {
            withheld_amt = (msg.value * withholdRatio) / RATIO_PRECISION;
            currentWithheldETH += withheld_amt;
        }

        emit ETHSubmitted(msg.sender, recipient, msg.value, withheld_amt);
    }

    /// @notice Mint frxETH to the sender depending on the ETH value sent
    function submit() external payable {
        _submit(msg.sender);
    }

    /// @notice Mint frxETH to the recipient using sender's funds
    function submitAndGive(address recipient) external payable {
        _submit(recipient);
    }

    /// @notice Fallback to minting frxETH to the sender
    receive() external payable {
        _submit(msg.sender);
    }

    /// @notice Deposit batches of ETH to the ETH 2.0 deposit contract
    /// @dev Usually a bot will call this periodically
    /// @param max_deposits Used to prevent gassing out if a whale drops in a huge amount of ETH. Break it down into batches.
    function depositEther(uint256 max_deposits) external nonReentrant {
        // Initial pause check
        require(!depositEtherPaused, "Depositing ETH is paused");

        // See how many deposits can be made. Truncation desired.
        uint256 numDeposits = (address(this).balance - currentWithheldETH) / DEPOSIT_SIZE;
        require(numDeposits > 0, "Not enough ETH in contract");

        uint256 loopsToUse = numDeposits;
        if (max_deposits == 0) loopsToUse = numDeposits;
        else if (numDeposits > max_deposits) loopsToUse = max_deposits;

        // Give each deposit chunk to an empty validator
        for (uint256 i = 0; i < loopsToUse; ++i) {
            // Get validator information
            (
                bytes memory pubKey,
                bytes memory withdrawalCredential,
                bytes memory signature,
                bytes32 depositDataRoot
            ) = getNextValidator(); // Will revert if there are not enough free validators

            // Make sure the validator hasn't been deposited into already, to prevent stranding an extra 32 eth
            // until withdrawals are allowed
            require(!activeValidators[pubKey], "Validator already has 32 ETH");

            // Deposit the ether in the ETH 2.0 deposit contract
            depositContract.deposit{value: DEPOSIT_SIZE}(
                pubKey,
                withdrawalCredential,
                signature,
                depositDataRoot
            );

            // Set the validator as used so it won't get an extra 32 ETH
            activeValidators[pubKey] = true;

            emit DepositSent(pubKey, withdrawalCredential);
        }
    }

    /// @param newRatio of ETH that is sent to deposit contract vs withheld, 1e6 precision
    /// @notice An input of 1e6 results in 100% of Eth deposited, 0% withheld
    function setWithholdRatio(uint256 newRatio) external onlyByOwnGov {
        require (newRatio <= RATIO_PRECISION, "Ratio cannot surpass 100%");
        withholdRatio = newRatio;
        emit WithholdRatioSet(newRatio);
    }

    /// @notice Give the withheld ETH to the "to" address
    function moveWithheldETH(address payable to, uint256 amount) external onlyByOwnGov {
        require(amount <= currentWithheldETH, "Not enough withheld ETH in contract");
        currentWithheldETH -= amount;

        (bool success,) = payable(to).call{ value: amount }("");
        require(success, "Invalid transfer");

        emit WithheldETHMoved(to, amount);
    }

    /// @notice Toggle allowing submites
    function togglePauseSubmits() external onlyByOwnGov {
        submitPaused = !submitPaused;

        emit SubmitPaused(submitPaused);
    }

    /// @notice Toggle allowing depositing ETH to validators
    function togglePauseDepositEther() external onlyByOwnGov {
        depositEtherPaused = !depositEtherPaused;

        emit DepositEtherPaused(depositEtherPaused);
    }

    /// @notice For emergencies if something gets stuck
    function recoverEther(uint256 amount) external onlyByOwnGov {
        (bool success,) = address(owner).call{ value: amount }("");
        require(success, "Invalid transfer");

        emit EmergencyEtherRecovered(amount);
    }

    /// @notice For emergencies if someone accidentally sent some ERC20 tokens here
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyByOwnGov {
        require(IERC20(tokenAddress).transfer(owner, tokenAmount), "recoverERC20: Transfer failed");

        emit EmergencyERC20Recovered(tokenAddress, tokenAmount);
    }

    event EmergencyEtherRecovered(uint256 amount);
    event EmergencyERC20Recovered(address tokenAddress, uint256 tokenAmount);
    event ETHSubmitted(address indexed sender, address indexed recipient, uint256 sent_amount, uint256 withheld_amt);
    event DepositEtherPaused(bool new_status);
    event DepositSent(bytes indexed pubKey, bytes withdrawalCredential);
    event SubmitPaused(bool new_status);
    event WithheldETHMoved(address indexed to, uint256 amount);
    event WithholdRatioSet(uint256 newRatio);
}