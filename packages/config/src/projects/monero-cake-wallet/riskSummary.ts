import { definePrivacyRisks } from '../../common/privacyRisks'

export const moneroCakeWalletRiskSummary = definePrivacyRisks({
  stolen: [
    'a swap service does not pay out.',
    "a service's hot wallet is compromised during the trade.",
  ],
  frozen: [
    'a service holds the deposit pending identity verification.',
    'a service refunds minus fees and blacklists the deposit address.',
  ],
  privacy: [
    {
      text: 'a service holds a leg until the user identifies, since identities on both legs link them.',
      see: ['privilegedInsider'],
    },
    {
      text: 'one party sees both legs, like one service used twice, and finds its payout in the rings behind the exit.',
      see: ['privilegedInsider'],
    },
    {
      text: "swap services, Blink, Etherscan, Moralis, PublicNode and the Monero node see the user's IP, since Tor is off by default.",
      see: ['networkObserver'],
    },
    {
      text: 'the deposit and exit wallets open in one app session, so Moralis, Etherscan and PublicNode pair them.',
      see: ['networkObserver'],
    },
    {
      text: "an opened wallet holds a token with a remote logo, which loads outside Tor and shows Moralis the user's IP.",
      see: ['networkObserver'],
    },
    {
      text: 'elliptic-curve cryptography is broken, which reveals the real spend in every ring.',
      see: ['futureAdversary'],
    },
  ],
})
