import { definePrivacyRisks } from '../../common/privacyRisks'

export const cloakedRiskSummary = definePrivacyRisks({
  stolen: [
    'the closed-source app is malicious or compromised and exfiltrates spending keys.',
    "Cloaked's ENS signer or the owner of clkd.eth points a Cloaked name to an attacker's payment address.",
    "the email inbox or Web3Auth is compromised, which restores an email user's spending key.",
  ],
  lost: [
    'a user loses the passkey and encrypted backup, or the wallet and PIN, needed to re-derive the spending key.',
    'the service and the app derive different address data and a payment reaches an address whose key the user cannot recreate.',
  ],
  privacy: [
    {
      text: "Cloaked, or anyone who obtains its records now or later, uses the viewing keys to link every account's addresses.",
      see: ['privilegedInsider'],
    },
    {
      text: "Cloaked's relayers and fee Safe mark every spend as a Cloaked user's.",
      see: ['chainAnalyst'],
    },
    {
      text: 'Cloaked changes its closed-source app to send account data to third parties.',
      see: ['privilegedInsider'],
    },
    {
      text: "Cloaked's RPC providers, such as Alchemy, group each account's addresses from its servers' requests.",
      see: ['networkObserver'],
    },
    {
      text: "a payer looks up the user's name through a public RPC, which then sees the name and the new address.",
      see: ['networkObserver'],
    },
    {
      text: 'a user relies on the Incognito balance, whose relay keeps the link between deposit and withdrawal.',
      see: ['privilegedInsider'],
    },
  ],
})
