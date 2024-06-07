import {
  type DaBridge,
  type DaLayer,
  type DacBridge,
  type OnChainDaBridge,
} from '@l2beat/config'

type Sentiment = 'green' | 'yellow' | 'red'

type WithSentiment = {
  value: string
  description?: string
  sentiment: Sentiment
}

export type DaRiskView = {
  economicSecurity: WithSentiment
  fraudDetection: WithSentiment
  attestationSecurity: WithSentiment
  exitWindow: WithSentiment
  accessability: WithSentiment
}

export function getDaRiskView(layer: DaLayer, bridge: DaBridge): DaRiskView {
  const fraudDetection = getFraudDetection(layer)

  if (bridge.type === 'NoBridge') {
    return {
      economicSecurity: { value: 'No bridge', sentiment: 'red' },
      fraudDetection,
      attestationSecurity: { value: 'Not verified', sentiment: 'red' },
      exitWindow: { value: 'None', sentiment: 'red' },
      accessability: { value: 'External', sentiment: 'red' },
    }
  }

  return {
    economicSecurity: getEconomicSecurity(layer),
    fraudDetection,
    attestationSecurity: getAttestationSecurity(bridge),
    exitWindow: getExitWindow(bridge),
    accessability: getAccessibility(bridge),
  }
}

export function getEconomicSecurity(
  layer: DaLayer /*, totalValueSecured: bigint, slashableFunds: bigint */,
): WithSentiment {
  if (layer.type === 'DAC') {
    return {
      value: 'None',
      sentiment: 'red',
    }
  }

  const { economicSecurity } = layer.risks

  // if totalValueSecured > slashableFunds - yellow sentiment once we have metrics
  // in place
  if (
    economicSecurity.type ===
    'OnchainQuantifiable' /** && totalValueSecured <= slashableFunds */
  ) {
    return {
      value: 'Staked assets',
      sentiment: 'green',
    }
  }

  if (economicSecurity.type === 'OffchainVerifiable') {
    return {
      value: 'Public Committee',
      sentiment: 'yellow',
    }
  }

  // Unknown
  return {
    value: 'Unknown',
    sentiment: 'red',
  }
}

export function getFraudDetection(layer: DaLayer): WithSentiment {
  if (layer.type === 'DAC') {
    return {
      value: 'None',
      sentiment: 'red',
    }
  }

  const { fraudDetection } = layer.risks

  if (
    fraudDetection.type === 'DAS with block reconstruction' ||
    fraudDetection.type === 'DAS with no block reconstruction'
  ) {
    return {
      value: fraudDetection.type,
      sentiment: fraudDetection.erasureCoding ? 'green' : 'yellow',
    }
  }

  if (fraudDetection.type === 'Erasure coding proof') {
    return {
      value: 'Erasure Coding Proof',
      sentiment: 'red',
    }
  }

  // No fraud detection
  return {
    value: 'None',
    sentiment: 'red',
  }
}

// TODO: Include whether commitment frequency has been satisfied
export function getAttestationSecurity(
  bridge: DacBridge | OnChainDaBridge,
): WithSentiment {
  if (bridge.type === 'DAC') {
    return {
      value: 'Not verified',
      sentiment: 'red',
    }
  }

  const { attestations, accessability } = bridge.risks

  if (accessability.type === 'Enshrined') {
    return {
      value: 'Enshrined',
      sentiment: 'green',
    }
  }

  if (
    attestations.type === 'SigVerified' ||
    attestations.type === 'SigVerifiedZK'
  ) {
    const value =
      attestations.type === 'SigVerified'
        ? 'Signatures verified'
        : 'Signatures verified (ZK-Proof)'
    return {
      value,
      sentiment: attestations.areSignersTracked ? 'green' : 'yellow',
    }
  }

  // Not satisfied
  return {
    value: 'Not verified',
    sentiment: 'red',
  }
}

export function getExitWindow(
  bridge: DacBridge | OnChainDaBridge,
): WithSentiment {
  if (bridge.type === 'DAC') {
    return {
      value: 'None',
      sentiment: 'red',
    }
  }

  const { exitWindow } = bridge.risks
  const delayInDays = toDays(exitWindow.delay)

  const ONE_DAY_SECONDS = 24 * 60 * 60
  const THIRTY_DAYS_SECONDS = 30 * ONE_DAY_SECONDS
  const SEVEN_DAYS_SECONDS = 7 * ONE_DAY_SECONDS

  if (
    exitWindow.party === 'Immutable' ||
    (exitWindow.party === 'SecurityCouncil' &&
      exitWindow.delay >= THIRTY_DAYS_SECONDS)
  ) {
    return {
      value: `${delayInDays} days`,
      sentiment: 'green',
    }
  }

  if (
    exitWindow.party === 'SecurityCouncil' &&
    exitWindow.delay >= SEVEN_DAYS_SECONDS &&
    exitWindow.delay < THIRTY_DAYS_SECONDS
  ) {
    return {
      value: `SC ${delayInDays} days`,
      sentiment: 'yellow',
    }
  }

  if (
    exitWindow.party === 'EOA' &&
    exitWindow.delay >= SEVEN_DAYS_SECONDS &&
    exitWindow.delay < THIRTY_DAYS_SECONDS
  ) {
    return {
      value: `${delayInDays} days`,
      sentiment: 'yellow',
    }
  }

  // Irrelevant delay or no timelock
  const value =
    exitWindow.delay < SEVEN_DAYS_SECONDS ? `${delayInDays} days` : 'No delay'

  return {
    value,
    sentiment: 'red',
  }
}

function getAccessibility(bridge: DacBridge | OnChainDaBridge): WithSentiment {
  if (bridge.type === 'DAC') {
    return {
      value: 'External',
      sentiment: 'red',
    }
  }

  const { accessability } = bridge.risks

  if (accessability.type === 'Enshrined') {
    return {
      value: 'Enshrined',
      sentiment: 'green',
    }
  }

  return {
    value: 'External',
    sentiment: 'red',
  }
}

function toDays(seconds: number): number {
  return Math.floor(seconds / (24 * 60 * 60))
}
