import { definePrivacyRisks } from '../../common/privacyRisks'

export const fluidkeyRiskSummary = definePrivacyRisks({
  stolen: [
    "the closed-source app is malicious or hacked and steals the user's spending keys.",
    "Privy's code or key share is compromised, for accounts created with a Google, Apple, email or Farcaster login on the web.",
    "a Fluidkey signer returns an attacker's address when a payer looks up a Fluidkey name.",
    "Fluidkey's server builds a transfer to another recipient, and the app signs it when the user confirms a send.",
  ],
  lost: [
    'a user loses the login, wallet, PIN or backup needed to recover the spending key.',
    "Fluidkey's server gives out a wrong address, for example one built with a different Safe setup, and the user's keys cannot withdraw from it.",
    'an auto-earn vault loses funds or blocks withdrawals, or a service used by Hide Trail keeps the funds.',
  ],
  privacy: [
    {
      text: 'Fluidkey, or anyone who obtains its records, uses the viewing keys to link all Safes of every account.',
      see: ['privilegedInsider'],
    },
    {
      text: 'Fluidkey changes its closed-source app to send account data to outside services.',
      see: ['privilegedInsider'],
    },
    {
      text: "Alchemy, behind Fluidkey's proxy, groups the Safes the app shows for each account.",
      see: ['networkObserver'],
    },
    {
      text: "a payer looks up the user's name through a public RPC, which then sees the name and the new Safe.",
      see: ['networkObserver'],
    },
    {
      text: 'a user takes Hide Trail and Houdini or the exchanges link the route from their records.',
      see: ['privilegedInsider'],
    },
    {
      text: "Fluidkey's relayer marks every spend as a Fluidkey account's.",
      see: ['chainAnalyst'],
    },
  ],
})
