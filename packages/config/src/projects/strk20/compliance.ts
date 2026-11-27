import { definePrivacyCompliance } from '../../common/privacyCompliance'

// PRIVACY-0.14.3-RC.8. The deployed pool and shadow account anonymizer rebuild from it.
const SNP =
  'https://github.com/starkware-libs/starknet-privacy/blob/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/'

export const strk20Compliance = definePrivacyCompliance({
  description:
    "Every deposit from a Starknet address needs a fresh signature from the pool's screener key. The wallet's prover requests it from a [screening service](https://github.com/starkware-libs/starknet-privacy/tree/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/elliptic-proxy), which checks the address with Elliptic and serves only its credentialed partners. Governance sets a screening policy per helper contract. Five helpers are exempt, among them the CCTP bridge, so USDC bridged in from other chains skips screening. The auditor key is one public key in the pool's storage. Who holds the screener and auditor private keys is not visible onchain, and governance can replace either key at once.",
  powers: [
    {
      ladder: 'privacy',
      rung: 2,
      text: 'The holder of the screener key must sign every deposit from a Starknet address, after an Elliptic check.',
      sources: [
        {
          title: 'Deposits require a screening attestation',
          url: SNP + 'packages/privacy/src/interface.cairo#L530-L545',
        },
        {
          title: 'Screening service that checks addresses with Elliptic',
          url: 'https://github.com/starkware-libs/starknet-privacy/tree/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/elliptic-proxy',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 5,
      text: "The unknown holder of the auditor key can decrypt every user's viewing key, and governance can replace it at once.",
      sources: [
        {
          title: 'Viewing key escrowed to the auditor key onchain',
          url: SNP + 'packages/privacy/src/objects.cairo#L43-L53',
        },
        {
          title: 'set_auditor_public_key: only the security governor',
          url: SNP + 'packages/privacy/src/interface.cairo#L790-L820',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    {
      ladder: 'funds',
      rung: 1,
      text: 'No key or role approves withdrawals: the pool pays out to any address without a screener signature.',
      sources: [
        {
          title: 'Transfers and withdrawals carry no screening attestation',
          url: SNP + 'packages/privacy/src/interface.cairo#L444-L449',
        },
      ],
    },
  ],
  curatedList: true,
})
