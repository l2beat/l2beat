import { definePrivacyCompliance } from '../../common/privacyCompliance'

const WRAPPER =
  'https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol'

export const zamaCwCompliance = definePrivacyCompliance({
  description:
    "Each token's owner, controlled by the multisigs, can block users and check them against the underlying token's denylist, as cUSDC does with USDC's blacklist. It can also appoint a pauser that halts the token, and observers that decrypt all of its balances and amounts. No token has a pauser or an observer. ConfidentialSwap has its own compliance address, set at deployment. Issuers of underlying tokens like USDC can freeze a token's whole escrow.",
  disclosure: {
    level: 3,
    text: "Zama's open SDK lets a user delegate decryption of one token's balances, revocably and with an expiry.",
    verifiableWithoutOperator: false,
    singleVerifier: true,
    sources: [
      {
        title: 'SDK delegation',
        url: 'https://github.com/zama-ai/sdk/blob/main/docs/gitbook/src/reference/sdk/delegation.md',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 5,
      text: "Each token's owner, controlled by the governance multisigs, can appoint observers that decrypt all its balances and amounts.",
      sources: [
        {
          title: 'addObserver: only the owner',
          url: `${WRAPPER}#L306`,
        },
        {
          title: 'Observer gets a wildcard delegation without expiration',
          url: `${WRAPPER}#L395-L403`,
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    {
      ladder: 'funds',
      rung: 4,
      text: "Each token's owner, controlled by the governance multisigs, can block users, which freezes their balances, and cUSDC mirrors USDC's blacklist.",
      sources: [
        {
          title: 'blockUser: only the owner',
          url: `${WRAPPER}#L228-L231`,
        },
        {
          title: 'Blocked users can neither transfer nor unwrap',
          url: `${WRAPPER}#L420-L491`,
        },
        { contract: 'ConfidentialUSDCWrapper' },
      ],
    },
  ],
  curatedList: true,
})
