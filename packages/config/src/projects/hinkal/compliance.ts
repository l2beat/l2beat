import { definePrivacyCompliance } from '../../common/privacyCompliance'
import { REFERENCE_APP } from './adversaries'

// @hinkal/common 0.4.1, the SDK the extension bundles.
const SDK = 'https://unpkg.com/@hinkal/common@0.4.1/common/src/'

export const hinkalCompliance = definePrivacyCompliance({
  description:
    "Hinkal's [documentation](https://hinkal-team.gitbook.io/hinkal/security-and-compliance/compliance) says it screens every deposit with Merkle Science and keeps re-screening depositors with Chainalysis. A depositor flagged later loses private transfers and can only withdraw publicly, to the address that deposited. The screening runs on Hinkal's servers, and the contracts check no addresses. Each relayed spend sends the relayer the commitments, amounts and nullifiers of its notes, and the relayer can refuse it. With the enclave key Hinkal can group the notes of each account, without the user's consent.",
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Hinkal can decrypt every note with its enclave key and group each account's notes, with no record the user can check.",
      sources: [
        {
          title: 'Every note is sealed to the recipient and to ENCLAVE_PUBKEY',
          url: `${SDK}data-structures/crypto-keys/encryptDecryptUtxo.mjs`,
          checked: '2026-11-24',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 2,
      text: "Hinkal's servers screen every deposit and can keep a flagged one out of the private balance.",
      sources: [
        {
          title: 'Compliance: deposits are screened before they become private',
          url: 'https://hinkal-team.gitbook.io/hinkal/security-and-compliance/compliance',
          checked: '2026-11-27',
        },
      ],
    },
    {
      ladder: 'privacy',
      rung: 3,
      text: "Hinkal's servers keep re-screening depositors, and a flagged depositor can then only withdraw publicly.",
      sources: [
        {
          title: 'Compliance: flagged depositors lose private transfers',
          url: 'https://hinkal-team.gitbook.io/hinkal/security-and-compliance/compliance',
          checked: '2026-11-27',
        },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: "Hinkal's relayers can refuse a spend, since the extension submits only through them.",
      sources: [
        {
          title:
            'Relay requests carry the commitments, amounts and nullifiers of the spent notes',
          url: `${SDK}functions/pre-transaction/buildCommitmentValidationData.mjs`,
          checked: '2026-11-24',
        },
        {
          title: 'Hinkal Wallet 0.0.65 sends every transaction to a relayer',
          url: REFERENCE_APP.url,
          checked: '2026-11-26',
        },
      ],
    },
  ],
  curatedList: true,
})
