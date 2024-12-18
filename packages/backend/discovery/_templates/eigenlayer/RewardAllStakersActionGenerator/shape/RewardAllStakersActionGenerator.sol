// SPDX-License-Identifier: Unknown
pragma solidity 0.8.26;

interface IHopperActionGenerator {
    /**
     * HopperAction
     *
     * Represents an action that the hopper can do, *acting as itself* in an un-delegated way.
     * An action is specified by the target contract address, along with its call data.
     * The call data is the ABI encoded 4-byte function selector followed by the serialized
     * parameters of it's methods.
     *
     * The hopper's design does not support delegated calls, message values (ETH transfers)
     * nor the ability to understand, store, or otherwise use any return values.
     *
     * A hopper can be programmed *once* with a set of actions that are to be executed
     * for *each* initiation of the hopper's behavior.
     *
     * WARNING: If for any reason any of a hopper's actions revert during execution the
     *          hopper could be "attacked," "bricked," or otherwise rendered inoperable 
     *          until the expiration period, depending on the trust model with the target
     *          contracts.
     */ 
    struct HopperAction {
        address target;
        bytes   callData;
    }

    /**
     * generateHopperActions()
     *
     * Hoppers can call this function to generate a list of hopper actions, given its logic.
     * This method takes a hopper address instead of assuming the calling function is always the hopper itself,
     * which also enables proper "simulation" as well.
     *
     * This interface purposefully does not take the full hopper configuration because it should be
     * considered stateless or otherwise immutable logic for trustless operation.
     *
     * @param hopper      the address of the ITokenHopper you want to generate actions for.
     * @param hopperToken the contract address of the token that is loaded into the hopper.
     *
     * @return a list of hopper actions that are presumably to be executed by the hopper in the same transaction.
     */
    function generateHopperActions(address hopper, address hopperToken) external view returns(HopperAction[] memory); 
}

contract RewardAllStakersActionGenerator is IHopperActionGenerator {

    // one week in seconds. used in the RewardsCoordinator and as a duration in this contract
    uint32 public immutable CALCULATION_INTERVAL_SECONDS;

    // the single RewardsCoordinator contract for EigenLayer
    IRewardsCoordinator public immutable rewardsCoordinator;
    // the bEIGEN token contract
    IERC20 public immutable bEIGEN;
    // the EIGEN token contract
    IERC20 public immutable EIGEN;

    // configuration set at construction, used in RewardsSubmissions
    IRewardsCoordinator.StrategyAndMultiplier[][2] public strategiesAndMultipliers;
    uint256[2] public amounts;

    // timestamps used for special logic for the first submission
    // defines the fixed start time of the first submission
    uint32 public firstSubmissionStartTimestamp;
    // defines the time period after which the special first submission logic will cease
    uint256 public firstSubmissionTriggerCutoff;

    constructor(
        IRewardsCoordinator _rewardsCoordinator,
        uint32 _firstSubmissionStartTimestamp,
        uint256 _firstSubmissionTriggerCutoff,
        uint256[2] memory _amounts,
        IRewardsCoordinator.StrategyAndMultiplier[][2] memory _strategiesAndMultipliers,
        IERC20 _bEIGEN,
        IERC20 _EIGEN
    )
    {
        require(address(_rewardsCoordinator) != address(0),
            "RewardAllStakersActionGenerator: rewardsCoordinator cannot be zero address");
        require(address(_bEIGEN) != address(0),
            "RewardAllStakersActionGenerator: bEIGEN cannot be zero address");
        require(address(_EIGEN) != address(0),
            "RewardAllStakersActionGenerator: EIGEN cannot be zero address");
        CALCULATION_INTERVAL_SECONDS = _rewardsCoordinator.CALCULATION_INTERVAL_SECONDS();
        // RewardsSubmissions must start at a multiple of CALCULATION_INTERVAL_SECONDS
        require(_firstSubmissionStartTimestamp % CALCULATION_INTERVAL_SECONDS == 0,
            "RewardAllStakersActionGenerator: RewardsSubmissions must start at a multiple of CALCULATION_INTERVAL_SECONDS");

        rewardsCoordinator = _rewardsCoordinator;

        firstSubmissionStartTimestamp = _firstSubmissionStartTimestamp;
        firstSubmissionTriggerCutoff = _firstSubmissionTriggerCutoff;

        amounts = _amounts;

        for (uint256 i = 0; i < _strategiesAndMultipliers.length; ++i) {
            require(_strategiesAndMultipliers[i].length != 0,
                "RewardAllStakersActionGenerator: empty strategies array not allowed");
            address currAddress = address(0);
            for (uint256 j = 0; j < _strategiesAndMultipliers[i].length; ++j) {
                require(
                    currAddress < address(_strategiesAndMultipliers[i][j].strategy),
                    "RewardAllStakersActionGenerator: strategies must be in ascending order for submission"
                );
                currAddress = address(_strategiesAndMultipliers[i][j].strategy);

                strategiesAndMultipliers[i].push(
                    IRewardsCoordinator.StrategyAndMultiplier({
                        strategy: _strategiesAndMultipliers[i][j].strategy,
                        multiplier: _strategiesAndMultipliers[i][j].multiplier
                    })
                );
            }
        }

        bEIGEN = _bEIGEN;
        EIGEN = _EIGEN;
    }

    function generateHopperActions(address hopper, address /*hopperToken*/) external view returns (HopperAction[] memory) {
        HopperAction[] memory actions = new HopperAction[](5); 

        uint256 totalAmount;
        uint32 startTimestamp;
        uint32 duration;
        uint256[2] memory amountsToUse;

        require(uint32(block.timestamp) >= firstSubmissionStartTimestamp,
            "RewardAllStakersActionGenerator: block.timestamp < firstSubmissionStartTimestamp");

        // special logic for first submission
        if (block.timestamp < firstSubmissionTriggerCutoff) {
            uint32 multiple = (uint32(block.timestamp) - firstSubmissionStartTimestamp) / CALCULATION_INTERVAL_SECONDS + 1;
            duration = CALCULATION_INTERVAL_SECONDS * multiple;

            startTimestamp = firstSubmissionStartTimestamp;

            amountsToUse[0] = amounts[0] * multiple;
            amountsToUse[1] = amounts[1] * multiple;
        // normal logic for all others
        } else {
            duration = CALCULATION_INTERVAL_SECONDS;

            // find the correct startTimestamp.
            // RewardsSubmissions must start at a multiple of CALCULATION_INTERVAL_SECONDS
            uint32 calculationIntervalNumber = uint32(block.timestamp) / CALCULATION_INTERVAL_SECONDS;
            // round to the latest completed calculation interval to find the start
            startTimestamp = (calculationIntervalNumber * CALCULATION_INTERVAL_SECONDS);

            amountsToUse[0] = amounts[0];
            amountsToUse[1] = amounts[1];
        }

        // HopperAction memory rewardsSubmissions;
        // rewardsSubmissions.target = rewardsCoordinator;
        IRewardsCoordinator.RewardsSubmission[] memory rewardsSubmissions = new IRewardsCoordinator.RewardsSubmission[](2);
        for (uint256 i = 0; i < 2; ++i) {
            rewardsSubmissions[i] = IRewardsCoordinator.RewardsSubmission({
                strategiesAndMultipliers: strategiesAndMultipliers[i],
                token: EIGEN,
                amount: amountsToUse[i],
                startTimestamp: startTimestamp,
                duration: duration
            });
            totalAmount += amountsToUse[i];
        }

        // 0) mint new tokens
        actions[0] = HopperAction({
            target: address(bEIGEN),
            callData: abi.encodeWithSignature("mint(address,uint256)", hopper, totalAmount)
        });

        // 1) approve the bEIGEN token for transfer so it can be wrapped
        actions[1] = HopperAction({
            target: address(bEIGEN),
            callData: abi.encodeWithSelector(IERC20.approve.selector, address(EIGEN), totalAmount)
        });

        // 2) wrap the bEIGEN token to receive EIGEN
        actions[2] = HopperAction({
            target: address(EIGEN),
            callData: abi.encodeWithSignature("wrap(uint256)", totalAmount)
        });

        // 3) Set the proper aggregate allowance on the coordinator for the hopper
        actions[3] = HopperAction({
            target: address(EIGEN),
            callData: abi.encodeWithSelector(IERC20.approve.selector, rewardsCoordinator, totalAmount)
        });

        // 4) Call the reward coordinator's ForAll API, serializing the submission array as calldata.
        actions[4] = HopperAction({
            target: address(rewardsCoordinator),
            callData: abi.encodeWithSelector(IRewardsCoordinator.createRewardsForAllEarners.selector, rewardsSubmissions)
        });

        // return array of hopper actions
        return actions; 

    }
}