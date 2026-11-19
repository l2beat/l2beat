import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const GOV =
  'https://github.com/theinterfold/the-interfold-governance/blob/870c40599fdb0e8dd73e225aa2dab44ac06477e5/'
// Its two ballot verifiers compile byte for byte to the deployed ones (solc 0.8.28,
// 1 optimizer run, paris), so a re-pin must keep that true.
const CRISP =
  'https://github.com/theinterfold/CRISP/blob/35dbda14c4026510ba91e15d700399df115900ab/'
const INTERFOLD =
  'https://github.com/theinterfold/interfold/blob/c2a28ae6b277aa72a62c34c07142bfadf7c4b4e1/'

/**
 * @param decryptionThreshold committee members that can rebuild the BFV secret key, asserted against discovery
 * @param committeeMembers members of the smallest committee Interfold allows, from discovery
 * @param minimumDecryptionThreshold the same for the smallest committee size governance can allow
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
        sources: [
          {
            title: 'Random weight against subset-sum matching',
            url: `${GOV}app/plugins/crispVoting/utils/ballotWeight.ts#L36-L55`,
          },
          {
            title: 'Interfold: the public result can show how a voter voted',
            url: `${INTERFOLD}docs/pages/governance.mdx#L246-L248`,
          },
        ],
      },
      networkObserver: {
        sentiment: 'good',
        exposureShort:
          'The ballot leaves the browser only as ciphertext with its proof, so traffic shows at most that the user sent a ballot.',
        exposureContinued:
          "The app sends ballots to the CRISP server and reads the chain through it, falling back to an RPC proxy on Interfold's host.",
        sources: [
          {
            title: 'Chain reads go to the CRISP server first',
            url: `${GOV}app/constants.ts#L70-L82`,
          },
          {
            title: 'Ballots are sent to the CRISP server',
            url: `${GOV}app/plugins/crispVoting/hooks/useCrispServer.ts#L700-L712`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: `Any ${decryptionThreshold} of the ${committeeMembers} ciphernodes in a vote's committee can combine their key shares and decrypt every ballot of that vote.`,
        exposureContinued: `Operators are unnamed, and one party can take several seats through several bond-owner addresses. The Interfold multisigs can instantly lower the minimum committee of future votes to ${minimumCommitteeMembers} members, ${minimumDecryptionThreshold} of whom decrypt. They can also swap the program that sums future ballots for one that outputs a single ballot to decrypt. Interfold can change its hosted app to leak the choice before encryption.`,
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
          'Whoever breaks elliptic-curve cryptography learns at least what the chain analyst sees: the totals can show how a voter with outsized weight voted.',
        exposureContinued:
          'Ballots and key shares rest on lattice assumptions with no known quantum attack, and a recovered wallet key opens no past ballot. Whether the zero-knowledge ballot proofs still hide the vote after such a break is unverified.',
        sources: [
          {
            title: 'Key shares are BFV-encrypted to each recipient',
            url: `${INTERFOLD}docs/pages/internals/dkg.mdx#L54`,
          },
          {
            title: 'The ballot verifier is a zero-knowledge Honk verifier',
            url: `${CRISP}packages/crisp-contracts/contracts/verifiers/CRISPOnchainVerifier.sol#L2485`,
          },
        ],
      },
    },
    advice: [
      {
        name: 'Vote',
        text: 'Keep the random weight on, which blurs your exact voting power in the totals.',
        against: ['chainAnalyst'],
      },
    ],
  })
}
