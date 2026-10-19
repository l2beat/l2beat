import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const GOV =
  'https://github.com/theinterfold/the-interfold-governance/blob/28b03a8b529dfa7491f01229724391665f06bd95/'
const CRISP =
  'https://github.com/theinterfold/CRISP/blob/35dbda14c4026510ba91e15d700399df115900ab/'
const INTERFOLD =
  'https://github.com/theinterfold/interfold/blob/c2a28ae6b277aa72a62c34c07142bfadf7c4b4e1/'

/**
 * @param decryptionThreshold committee members that can rebuild the BFV secret key, asserted against discovery
 * @param committeeMembers members of the committee a DAO vote requests, from discovery
 * @param minimumDecryptionThreshold the same for the smallest committee size governance can select
 * @param minimumCommitteeMembers members of the smallest committee size, from discovery
 */
export function interfoldAdversaries(
  decryptionThreshold: number,
  committeeMembers: number,
  minimumDecryptionThreshold: number,
  minimumCommitteeMembers: number,
) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides which option each voter chose. Every address that receives a ballot, its voting power, the timing and the totals per option are public.',
    },
    fieldDescriptions: {
      linkage:
        "Which option a voter chose: the link between a voter's address and their ballot.",
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'Ballots stay encrypted, and only the totals per option are decrypted.',
        exposureContinued:
          'A mask looks like a vote, so an input to an address does not prove that its owner voted.',
        sources: [
          {
            contract: 'CRISPProgram',
            title: 'Inputs carry only a commitment to the ciphertext',
          },
          {
            title: 'Votes, updates and masks share one circuit',
            url: `${CRISP}circuits/bin/crisp_onchain/src/main.nr#L28-L58`,
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'warning',
        exposureShort:
          'Voting power is public, so the totals per option can reveal how a voter with outsized weight voted.',
        exposureContinued:
          "A voter whose weight exceeds the totals of all but one option can only have chosen that one. The app's random weight blurs exact matches among smaller voters.",
        advice: 'Keep the random weight on.',
        sources: [
          {
            title: 'Random weight against subset-sum matching',
            url: `${GOV}app/plugins/crispVoting/utils/ballotWeight.ts#L36-L55`,
          },
          {
            title: 'Interfold: the public result can show how a voter voted',
            url: `${INTERFOLD}docs/pages/governance.mdx#L237-L270`,
          },
        ],
      },
      networkObserver: {
        sentiment: 'good',
        exposureShort:
          'The ballot leaves the browser only as ciphertext with its proof, so traffic shows at most that the user sent a ballot.',
        exposureContinued:
          'The app reads the chain through the CRISP server and sends ballots to it, so these requests reach no third party. WalletConnect runs with analytics off.',
        sources: [
          {
            title: 'Chain reads go to the CRISP server first',
            url: `${GOV}app/constants.ts#L70-L82`,
          },
          {
            title: 'Ballots are sent to the CRISP server',
            url: `${GOV}app/plugins/crispVoting/hooks/useCrispServer.ts#L700-L712`,
          },
          {
            title: 'WalletConnect analytics disabled',
            url: `${GOV}app/context/index.tsx#L32`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: `Any ${decryptionThreshold} of the ${committeeMembers} ciphernodes in a vote's committee can combine their key shares and decrypt every ballot of that vote.`,
        exposureContinued: `Operators are unnamed, and the lottery limits only each bond-owner address to one seat. The Interfold multisigs can instantly shrink future committees to ${minimumCommitteeMembers} members, ${minimumDecryptionThreshold} of whom decrypt, and Interfold's hosted app sees the choice before encrypting it.`,
        sources: [
          {
            title:
              'Interfold: T + 1 colluding members decrypt individual ballots',
            url: `${INTERFOLD}docs/pages/governance.mdx#L244-L245`,
          },
          {
            title: 'Committee sizes and decryption thresholds (T + 1)',
            url: `${INTERFOLD}packages/interfold-contracts/contracts/lib/ActiveCryptoConfig.sol#L29-L42`,
          },
          {
            contract: 'CiphernodeRegistry',
            title: 'One seat per bond owner',
          },
          { section: 'upgrades-and-governance' },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposureShort:
          'Archived ballots rest on lattice assumptions with no known quantum attack, so a break adds nothing to what the totals show.',
        exposureContinued:
          "A recovered wallet key can replace a voter's ballot in an open vote but opens no past one. The contracts that verify ballot proofs are unverified, so whether the proofs hide the vote cannot be checked.",
        sources: [
          {
            title: 'Key shares are BFV-encrypted and never published',
            url: `${INTERFOLD}docs/pages/internals/dkg.mdx#L764-L772`,
          },
          {
            contract: 'CrispOnchainBallotVerifier',
            title: 'Unverified ballot proof verifier',
          },
        ],
      },
    },
  })
}
