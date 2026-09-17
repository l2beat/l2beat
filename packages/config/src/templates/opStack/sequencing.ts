import { formatSeconds } from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { SEQUENCING_SPEC } from '../../common'
import type { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type {
  ProjectCentralizedSequencingSpec,
  ProjectSequencingTechnologyChoice,
  ReferenceLink,
  TableReadyValue,
} from '../../types'
import { readMarkdown } from '../../utils/readMarkdown'
import {
  getFaultDisputeGameName,
  getFraudProofType,
  getOpStackBondScalingFactor,
  getOpStackMaxCumulativeClockExtension,
  getOptimismPortal,
  getOracleChallengePeriod,
  getPermissionlessGameBond,
  type OpStackGameContext,
} from './faultDisputeGame'

export interface OpStackCentralizedSequencingConfig {
  hardcoded: OpStackCentralizedSequencingHardcoded
  description: string
  trustedPreconfirmationDescription: string
  sequencer: TableReadyValue
  censorshipResistance: string
  references: ReferenceLink[]
}

/** The subset of HARDCODED.<CHAIN> a centralized OP Stack sequencing spec needs. */
export interface OpStackCentralizedSequencingHardcoded {
  L2_BLOCK_TIME_SECONDS: number
  FLASHBLOCK_INTERVAL_MILLISECONDS: number
  SEQUENCING_WINDOW_BLOCKS: number
  MAX_DEPOSIT_CALLDATA_BYTES: number
}

export function getOpStackCentralizedSequencingSpec({
  discovery,
  hardcoded,
  trustedPreconfirmationDescription,
  sequencer,
  exitDelay,
  exitEconomics,
}: {
  discovery: ProjectDiscovery
  hardcoded: OpStackCentralizedSequencingHardcoded
  trustedPreconfirmationDescription: string
  sequencer: TableReadyValue
  exitDelay: TableReadyValue
  exitEconomics: TableReadyValue
}): ProjectCentralizedSequencingSpec {
  const {
    L2_BLOCK_TIME_SECONDS: l2BlockTimeSeconds,
    FLASHBLOCK_INTERVAL_MILLISECONDS: flashblockIntervalMilliseconds,
    SEQUENCING_WINDOW_BLOCKS: sequencingWindowBlocks,
    MAX_DEPOSIT_CALLDATA_BYTES: maxDepositCalldataBytes,
  } = hardcoded
  const sequencingWindowSeconds =
    sequencingWindowBlocks * HARDCODED.ETHEREUM.BLOCK_TIME_SECONDS
  const depositResourceLimit = discovery.getContractValue<{
    maxResourceLimit: number
  }>('SystemConfig', 'resourceConfig').maxResourceLimit
  const minimumDepositGasWithoutData = discovery.getContractValue<number>(
    'OptimismPortal2',
    'minimumGasLimitZeroBytes',
  )
  const minimumDepositGasWithOneByte = discovery.getContractValue<number>(
    'OptimismPortal2',
    'minimumGasLimitOneByte',
  )
  const minimumDepositGasPerByte =
    minimumDepositGasWithOneByte - minimumDepositGasWithoutData

  return {
    type: 'centralized',
    trustedPreconfirmation: {
      value: `${flashblockIntervalMilliseconds} ms`,
      secondLine: `${l2BlockTimeSeconds} s L2 block time`,
      description: trustedPreconfirmationDescription,
      orderHint: flashblockIntervalMilliseconds / 1_000,
    },
    trustedOrdering: {
      value: 'Dynamic priority auction',
      secondLine: 'Fee order per Flashblock',
      description: `For each ${flashblockIntervalMilliseconds} ms build loop, the centralized builder selects available transactions by priority fee. Transactions committed to an earlier Flashblock are not reordered when a higher-fee transaction arrives later, so arrival time also affects ordering. This policy is not enforced by the derivation rules.`,
    },
    sequencer,
    realtimeCensorshipResistance:
      SEQUENCING_SPEC.NO_REALTIME_CENSORSHIP_RESISTANCE(),
    forcedInclusion: {
      value: 'Automatic derivation',
      secondLine: '1 L1 tx: portal deposit',
      sentiment: 'good',
      description:
        'The user submits one Ethereum transaction to the OptimismPortal which is automatically derived by conforming nodes.',
    },
    inclusionDelay: {
      value: formatSeconds(sequencingWindowSeconds, { fullUnit: true }),
      secondLine: `${sequencingWindowBlocks.toLocaleString('en-US')} L1 blocks`,
      sentiment: 'good',
      description:
        'The static sequencing window is measured in Ethereum blocks.',
      orderHint: sequencingWindowBlocks,
    },
    inclusionMechanics: {
      value: '1 L1 Tx',
      secondLine: 'Address alias',
      description: `Forced inclusion creates an L1-originated deposit transaction rather than submitting the original signed L2 transaction. Its calldata is capped at ${maxDepositCalldataBytes.toLocaleString('en-US')} bytes, its minimum L2 gas limit is ${minimumDepositGasWithoutData.toLocaleString('en-US')} plus ${minimumDepositGasPerByte.toLocaleString('en-US')} gas per calldata byte, and deposits share a metered ${depositResourceLimit.toLocaleString('en-US')} gas resource limit per Ethereum block. L1 contract callers use an aliased address on L2.`,
    },
    exitDelay,
    exitEconomics,
  }
}

export function getOpStackCentralizedSequencing(
  templateVars: OpStackGameContext,
  config: OpStackCentralizedSequencingConfig,
): ProjectSequencingTechnologyChoice {
  const sequencingWindowSeconds =
    config.hardcoded.SEQUENCING_WINDOW_BLOCKS *
    HARDCODED.ETHEREUM.BLOCK_TIME_SECONDS
  const { exitDelay, exitEconomics } = getCentralizedSequencingExit(
    templateVars,
    config.hardcoded,
    sequencingWindowSeconds,
  )

  return {
    name: 'Transactions are ordered by a centralized sequencer',
    description: config.description,
    sequencingSpec: getOpStackCentralizedSequencingSpec({
      discovery: templateVars.discovery,
      hardcoded: config.hardcoded,
      trustedPreconfirmationDescription:
        config.trustedPreconfirmationDescription,
      sequencer: config.sequencer,
      exitDelay,
      exitEconomics,
    }),
    censorshipResistance: config.censorshipResistance,
    references: config.references,
    risks: [],
  }
}

// Worst-case exit after forced inclusion. Keyed on the same fraud-proof type
// that drives state validation, so a respected-game-type change fails loudly
// here instead of rendering stale numbers.
function getCentralizedSequencingExit(
  templateVars: OpStackGameContext,
  hardcoded: OpStackCentralizedSequencingHardcoded,
  sequencingWindowSeconds: number,
): { exitDelay: TableReadyValue; exitEconomics: TableReadyValue } {
  const fraudProofType = getFraudProofType(templateVars)
  const proofMaturityDelaySeconds =
    templateVars.discovery.getContractValue<number>(
      'OptimismPortal2',
      'proofMaturityDelaySeconds',
    )
  const disputeGameFinalityDelaySeconds =
    templateVars.discovery.getContractValue<number>(
      'OptimismPortal2',
      'disputeGameFinalityDelaySeconds',
    )

  switch (fraudProofType) {
    case 'Permissionless': {
      const faultDisputeGame = getFaultDisputeGameName(templateVars)
      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        faultDisputeGame,
        'maxClockDuration',
      )
      const clockExtension = templateVars.discovery.getContractValue<number>(
        faultDisputeGame,
        'clockExtension',
      )
      const gameMaxDepth = templateVars.discovery.getContractValue<number>(
        faultDisputeGame,
        'maxGameDepth',
      )
      const maxClockExtension = getOpStackMaxCumulativeClockExtension(
        gameMaxDepth,
        clockExtension,
        getOracleChallengePeriod(templateVars),
      )
      // MAX_CLOCK_DURATION caps each team's chess clock, not the whole game.
      const maxGameDuration = maxClockDuration * 2 + maxClockExtension
      const stateFinalizationDelaySeconds =
        maxGameDuration + disputeGameFinalityDelaySeconds
      const worstCaseExitDelaySeconds =
        sequencingWindowSeconds + stateFinalizationDelaySeconds
      const bondScalingFactor = getOpStackBondScalingFactor(gameMaxDepth)
      const initialBondEther = Number(
        formatEther(getPermissionlessGameBond(templateVars)),
      ).toLocaleString('en-US')

      return {
        exitDelay: {
          value: formatSeconds(worstCaseExitDelaySeconds, { fullUnit: true }),
          secondLine: `${formatSeconds(sequencingWindowSeconds)} inclusion + ${formatSeconds(stateFinalizationDelaySeconds)} state`,
          description: readMarkdown(
            'templates/opStack/sequencingExitDelayFaultProof.md',
            {
              maxGameDuration: formatSeconds(maxGameDuration, {
                fullUnit: true,
              }),
              maxClockDuration: formatSeconds(maxClockDuration, {
                fullUnit: true,
              }),
              maxClockExtension: formatSeconds(maxClockExtension, {
                fullUnit: true,
              }),
              finalityAirGap: formatSeconds(disputeGameFinalityDelaySeconds, {
                fullUnit: true,
              }),
              proofMaturityDelay: formatSeconds(proofMaturityDelaySeconds, {
                fullUnit: true,
              }),
            },
          ),
          orderHint: worstCaseExitDelaySeconds,
        },
        exitEconomics: {
          value: `${initialBondEther} ETH`,
          secondLine: `Favors attacker ${bondScalingFactor.toFixed(2)}×`,
          description: `Self-proposing the state needed for an exit starts with a ${initialBondEther} ETH bond. If challenged, the user must defend it with progressively larger bonds: each counterclaim costs ${bondScalingFactor.toFixed(2)} times the claim it counters, favoring the attacker in a capital-exhaustion attack.`,
        },
      }
    }
    case 'AggregateProof': {
      const slowFinalizationDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          'AggregateVerifier',
          'SLOW_FINALIZATION_DELAY',
        )
      const blockInterval = templateVars.discovery.getContractValue<number>(
        'AggregateVerifier',
        'BLOCK_INTERVAL',
      )
      const checkpointIntervalSeconds =
        blockInterval * hardcoded.L2_BLOCK_TIME_SECONDS
      const portal = getOptimismPortal(templateVars)
      const respectedGameType = templateVars.discovery.getContractValue<number>(
        portal.name ?? portal.address,
        'respectedGameType',
      )
      const initialBondEther = Number(
        formatEther(
          templateVars.discovery.getContractValue<string>(
            'DisputeGameFactory',
            `initBondGame${respectedGameType}`,
          ),
        ),
      ).toLocaleString('en-US')
      const stateFinalizationDelaySeconds = Math.max(
        proofMaturityDelaySeconds,
        slowFinalizationDelaySeconds + disputeGameFinalityDelaySeconds,
      )
      const worstCaseExitDelaySeconds =
        sequencingWindowSeconds +
        checkpointIntervalSeconds +
        stateFinalizationDelaySeconds

      return {
        exitDelay: {
          value: formatSeconds(worstCaseExitDelaySeconds, { fullUnit: true }),
          secondLine: `${formatSeconds(sequencingWindowSeconds)} inclusion + ${formatSeconds(checkpointIntervalSeconds)} + ${formatSeconds(stateFinalizationDelaySeconds)} state`,
          description: readMarkdown(
            'templates/opStack/sequencingExitDelayAggregateProof.md',
            {
              slowFinalizationDelay: formatSeconds(
                slowFinalizationDelaySeconds,
                { fullUnit: true },
              ),
              finalityAirGap: formatSeconds(disputeGameFinalityDelaySeconds, {
                fullUnit: true,
              }),
              proofMaturityDelay: formatSeconds(proofMaturityDelaySeconds, {
                fullUnit: true,
              }),
            },
          ),
          orderHint: worstCaseExitDelaySeconds,
        },
        exitEconomics: {
          value: `${initialBondEther} ETH`,
          secondLine: 'ZK proof required',
          description: `Self-proposing the state needed for an exit requires a valid ZK proof and a ${initialBondEther} ETH bond for one ${blockInterval.toLocaleString('en-US')}-block checkpoint.`,
        },
      }
    }
    default:
      throw new Error(
        `Centralized sequencing exit derivation is not implemented for fraud proof type ${fraudProofType}`,
      )
  }
}
