import { definePrivacyCompliance } from '../../common/privacyCompliance'

const PPOI_DOCS = {
  title: 'Private Proofs of Innocence',
  url: 'https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence',
  checked: '2026-11-27',
}

export const railgunCompliance = definePrivacyCompliance({
  description:
    "Screening happens offchain. A [PPoI](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence) proves that a note descends only from shields a list provider accepted. The default list screens shields with Chainalysis's sanctions API. Broadcasters on Ethereum require a PPoI, and a transaction the user submits directly skips the check.",
  disclosure: {
    level: 5,
    text: 'RailOxide exports a view-only key that shows the whole history and all future activity, and cannot be revoked.',
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'RailOxide key export',
        url: 'https://github.com/triamazikamno/railoxide/blob/v0.3.0-rc.2/bins/wallet/src/root/key_export.rs#L540-L548',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 3,
      text: 'A list provider can exclude notes, and broadcasters then refuse them.',
      sources: [PPOI_DOCS],
    },
    {
      ladder: 'funds',
      rung: 2,
      text: 'Broadcasters refuse excluded notes, but the user can always unshield them in a transaction they send themselves.',
      sources: [{ contract: 'RailgunSmartWallet', title: 'Unshield' }],
    },
  ],
  curatedList: true,
})
