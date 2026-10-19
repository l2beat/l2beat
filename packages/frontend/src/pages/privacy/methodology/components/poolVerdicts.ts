import type { PrivacyAdversarySentiment } from '@l2beat/config'
import type { Lens, PoolDesign } from './poolLensScene'

export interface PoolVerdict {
  /** Undefined until the simulation has run long enough to tell. */
  sentiment: PrivacyAdversarySentiment | undefined
  sees: string
}

/** Withdrawals the chain analyst needs to watch before it can judge. */
const MIN_SAMPLES = 6

const SEVERITY: Record<PrivacyAdversarySentiment, number> = {
  good: 0,
  warning: 1,
  bad: 2,
}

/**
 * The verdicts follow from the pool's design and, for the chain analyst,
 * from how many withdrawals timing actually caught. The public observer,
 * chain analyst and future adversary see the same public data with
 * increasing ability, so each one is at least as bad as the one before.
 */
export function getPoolVerdicts(
  design: PoolDesign,
  outcomes: boolean[],
): Record<Lens, PoolVerdict> {
  const publicObserver: PoolVerdict = design.namesDeposit
    ? {
        sentiment: 'bad',
        sees: 'Each withdrawal names the deposit it spends, so anyone can follow the link.',
      }
    : {
        sentiment: 'good',
        sees: 'Every deposit and every withdrawal, but nothing that ties one to the other.',
      }

  const chainAnalyst = atLeast(publicObserver, timing(outcomes), {
    sees: 'Every link the public observer can follow, at least.',
  })

  const futureAdversary = atLeast(
    chainAnalyst,
    design.ellipticCurves
      ? {
          sentiment: 'bad',
          sees: 'The archived pool, years later: the elliptic-curve keys on each note break, and every link comes out.',
        }
      : {
          sentiment: 'good',
          sees: 'The archived pool, years later, but the post-quantum protection on each note still holds.',
        },
    { sees: 'Everything the chain analyst finds today, at least.' },
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

function timing(outcomes: boolean[]): PoolVerdict {
  if (outcomes.length < MIN_SAMPLES) {
    return {
      sentiment: undefined,
      sees: `Timing. ${outcomes.length} of ${MIN_SAMPLES} withdrawals watched so far.`,
    }
  }
  const caught = outcomes.filter(Boolean).length
  const share = `${caught} of the last ${outcomes.length} withdrawals`
  if (caught === 0) {
    return {
      sentiment: 'good',
      sees: `Timing, but enough coins are always waiting: ${share} stood out.`,
    }
  }
  return {
    sentiment: caught * 4 <= outcomes.length ? 'warning' : 'bad',
    sees: `Timing. Too few coins were waiting for ${share}, which gave their deposits away.`,
  }
}

/** `own`, unless `before` is worse, which then explains it. */
function atLeast(
  before: PoolVerdict,
  own: PoolVerdict,
  inherited: { sees: string },
): PoolVerdict {
  // Unknown before means unknown here, unless this one is already the worst.
  if (before.sentiment === undefined && own.sentiment !== 'bad') {
    return { sentiment: undefined, sees: before.sees }
  }
  if (
    before.sentiment &&
    (own.sentiment === undefined ||
      SEVERITY[before.sentiment] > SEVERITY[own.sentiment])
  ) {
    return { sentiment: before.sentiment, sees: inherited.sees }
  }
  return own
}
