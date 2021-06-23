import { Features } from './features'

export const Technologies = {
  OptimisticRollup: [
    Features.Withdrawal.Proved(),
    Features.State.FraudProofs(),
    Features.Settlement.Delayed(),
    Features.Data.OnChain(),
  ],
  ZkRollup: [
    Features.Withdrawal.Proved(),
    Features.State.ValidityProofs(),
    Features.Settlement.AfterProof(),
    Features.Data.OnChain(),
  ],
  Validium: [
    Features.Withdrawal.Proved(),
    Features.State.ValidityProofs(),
    Features.Settlement.AfterProof(),
    Features.Data.OffChain(),
  ],
  Volition: [
    Features.Withdrawal.Proved(),
    Features.State.ValidityProofs(),
    Features.Settlement.AfterProof(),
    Features.Data.Flexible(),
  ],
  Plasma: [
    Features.Withdrawal.Proved(),
    Features.State.FraudProofs(),
    Features.Settlement.Delayed(),
    Features.Data.OffChain(),
    Features.MassExit.Remedied(),
  ],
  Sidechain: [Features.Withdrawal.Signed(), Features.State.Unchecked()],
  Commitchain: [
    Features.Withdrawal.Proved(),
    Features.State.Unchecked(),
    Features.Data.OffChain(),
  ],
}
