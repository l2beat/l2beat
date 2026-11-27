import { definePrivacyCompliance } from '../../common/privacyCompliance'

// zk.money Desktop v0.13.0, the reference client, as in adversaries.ts.
const ZKMONEY_REPO =
  'https://github.com/aztec-labs-eng/zkmoney-public/blob/516d90660400aee97166376ba69c5b61ce82a7e4/'
const OXIDE = `${ZKMONEY_REPO}vendor/oxide/`

const RELAYER_SCREENING = {
  title: 'The relayer blocks operations that touch a listed address',
  url: `${OXIDE}yarn-project/oxide-relayer/src/l1_operations/submitter.ts#L213-L221`,
}

export const zkMoneyV6Compliance = definePrivacyCompliance({
  description:
    "The assessed wallet screens withdrawal recipients through Predicate, via zk.money, and stops when screening fails. The relayer screens token movements against OFAC and optionally Predicate, and self-submitted sweeps and withdrawals skip it.\n\nThe name resolver screens deposit addresses and funders against OFAC before notifying the recipient on L2. A blocked payment leaves funds at an address unknown to the wallet. Recovery requires the recipient's own tooling to re-derive it and authorization from their L1 account. Screening happens only in these offchain services.",
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Aztec Labs' default name resolver derives each deposit address, so it knows the recipient; this covers only payments to names.",
      sources: [
        {
          title: 'The resolver derives addresses paid through a name',
          url: `${ZKMONEY_REPO}packages/front-core/src/oxide/resolverPayments.ts#L196-L197`,
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 2,
      text: 'The zk.money wallet, its relayer and the name resolver refuse deposits from addresses that OFAC or Predicate screening flags.',
      sources: [
        {
          title: 'The wallet screens the depositing account',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/features/deposit/DepositFromWalletModal/DepositFromWalletModal.tsx#L234`,
        },
        RELAYER_SCREENING,
        {
          title: 'The resolver screens deposit addresses and their funders',
          url: `${OXIDE}yarn-project/watcher-lib/src/sanctions/composite_sipa_screener.ts`,
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: 'The zk.money wallet and its relayer refuse withdrawals to addresses that OFAC or Predicate screening flags.',
      sources: [
        {
          title: 'The wallet screens the recipient before burning',
          url: `${ZKMONEY_REPO}packages/web-wallet/src/features/withdraw/withdrawGateway.ts#L573-L581`,
        },
        RELAYER_SCREENING,
      ],
    },
  ],
  curatedList: true,
})
