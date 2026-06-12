import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const RELAY_DETAILED_DESCRIPTION = `
# Architecture
Relay is an intent-based, non-minting bridge. A user requests a route from the [Relay API](https://docs.relay.link/references/api/api_guides/bridging-integration-guide) and deposits their funds to simple smart contract or EOA on the source chain, and a solver fronts liquidity on the destination chain before settling back against the user's source-side payment. The destination transaction is a regular transfer, swap, or contract call made by the solver from their own pre-positioned liquidity.

After a solver fills the user on the destination chain, the solver asks the centralized Relay Oracle to verify the source payment and destination fill. The Oracle reads chain data offchain and returns an attestation. The solver submits that attestation to the \`RelayOracle\` on the Relay Chain, which updates the \`RelayHub\`: the deposit is represented as Hub balance and that balance is transferred to the solver. Solvers then withdraw accumulated Hub balances through the \`Allocator\`, which produces a signed withdrawal payload accepted by the target-chain \`Depository.execute(CallRequest, signature)\`.

# Crosschain oracle and validation
The destination-chain user outcome depends on the solver filling correctly and quickly, while settlement depends on Relay's centralized Oracle. Incorrect attestations can misattribute balances on the Hub and steal funds. The 'Allocator', which is the signing part of the relay oracle, uses the MPC signing framework on the NEAR blockchain.

# Refunds
There are no onchain mechanisms for refunds, making them fully depend on the good will of solvers and the relay admins.

# Monitoring
Relay provides an [explorer](https://relay.link/transactions) and an [API](https://docs.relay.link/references/api/overview) to monitor transactions. There is a sovereign rollup on Celestia called 'relay chain' that acts as a ledger for the protocol's crosschain accounting.
`

export const relay: BaseProject = {
  id: ProjectId('relay'),
  slug: 'relay',
  name: 'Relay',
  shortName: undefined,
  aliases: ['Reservoir'],
  addedAt: UnixTime(1769070497),
  interopConfig: {
    description:
      'Intent-based centralized EOA bridge optimised for speed, multichain and multiasset support.',
    detailedDescription: RELAY_DETAILED_DESCRIPTION,
    plugins: [
      {
        plugin: 'relay',
        bridgeType: 'nonMinting',
      },
    ],
    type: 'intent',
  },
}
