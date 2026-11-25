import { definePrivacyRisks } from '../../common/privacyRisks'

export const zkApiRiskSummary = definePrivacyRisks({
  stolen: [
    'the owner pauses withdrawals until notes expire and anyone sweeps them to its treasury.',
    'the single-party [trusted setup](#trusted-setups) secrets or a circuit flaw allow forged withdrawal proofs.',
    'malicious wallet code reads the note secret.',
  ],
  lost: [
    'the note secret or the latest signed balance is lost.',
    'a note expires before withdrawal.',
  ],
  frozen: [
    'the operator withholds a signed balance and cancels the escape with the request it received.',
  ],
  privacy: [
    {
      text: 'the operator ties a request to its deposit, since few active notes cover its budget tier.',
      see: ['privilegedInsider'],
    },
    {
      text: 'prompts identify the user to OpenRouter or the model provider.',
      see: ['privilegedInsider'],
    },
    {
      text: 'the operator keeps request transcripts and indexer logs, which later tie requests to deposits.',
      see: ['privilegedInsider'],
    },
  ],
})
