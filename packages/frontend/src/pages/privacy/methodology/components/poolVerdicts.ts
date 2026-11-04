import type { PrivacyAdversarySentiment } from '@l2beat/config'
import type { Lens, PoolDesign } from './poolLensScene'

export interface PoolVerdict {
  sentiment: PrivacyAdversarySentiment
  sees: string
  /** The earlier adversary this verdict comes from, when it is worse. */
  inheritedFrom?: Lens
}

const SEVERITY: Record<PrivacyAdversarySentiment, number> = {
  good: 0,
  warning: 1,
  bad: 2,
}

/**
 * The verdicts follow from the pool's design and, for the chain analyst,
 * from the share of withdrawals timing gives away (`caughtShare`). The
 * public observer, chain analyst and future adversary see the same public
 * data with increasing ability, so each one is at least as bad as the one
 * before.
 */
export function getPoolVerdicts(
  design: PoolDesign,
  caughtShare: number,
): Record<Lens, PoolVerdict> {
  const publicObserver: PoolVerdict = design.linksDeposit
    ? {
        sentiment: 'bad',
        sees: 'Each withdrawal can be linked to the deposit it spends, so anyone can follow the link.',
      }
    : {
        sentiment: 'good',
        sees: 'Every deposit and every withdrawal, but nothing that ties one to the other.',
      }

  const chainAnalyst = atLeast(
    publicObserver,
    'publicObserver',
    timing(caughtShare),
    'Every link the public observer can follow, at least.',
  )

  const futureAdversary = atLeast(
    chainAnalyst,
    'chainAnalyst',
    design.ellipticCurves
      ? {
          sentiment: 'bad',
          sees: 'The archived pool, years later: the elliptic-curve keys on each note break, and every link comes out.',
        }
      : {
          sentiment: 'good',
          sees: 'The archived pool, years later, but the post-quantum protection on each note still holds.',
        },
    'Everything the chain analyst finds today, at least.',
  )

  return {
    publicObserver,
    chainAnalyst,
    networkObserver: design.publicRpc
      ? {
          sentiment: 'bad',
          sees: "The user's own IP on both the deposit and the withdrawal request, so the two are linked.",
        }
      : {
          sentiment: 'good',
          sees: 'Every request, each through a different Tor exit, so none points back to a sender.',
        },
    privilegedInsider: design.viewingKeys
      ? {
          sentiment: 'bad',
          sees: 'The inside of the pool: it holds viewing keys, so every coin keeps its owner.',
        }
      : {
          sentiment: 'good',
          sees: 'The pool it runs, but with no viewing keys the coins inside are grey to it too.',
        },
    futureAdversary,
  }
}

function timing(caughtShare: number): PoolVerdict {
  const inHundred = Math.round(caughtShare * 100)
  if (caughtShare < 0.01) {
    return {
      sentiment: 'good',
      sees: 'Timing, but enough coins are always waiting: fewer than 1 in 100 withdrawals stands out.',
    }
  }
  return {
    sentiment: caughtShare < 0.25 ? 'warning' : 'bad',
    sees: `Timing. Too few coins are waiting for about ${inHundred} in 100 withdrawals, which gives their deposits away.`,
  }
}

/** `own`, unless the earlier adversary's verdict is worse. */
function atLeast(
  before: PoolVerdict,
  beforeLens: Lens,
  own: PoolVerdict,
  inheritedSees: string,
): PoolVerdict {
  if (SEVERITY[before.sentiment] <= SEVERITY[own.sentiment]) return own
  return {
    sentiment: before.sentiment,
    sees: inheritedSees,
    inheritedFrom: beforeLens,
  }
}
