/**
 * The five risks of a scaling project's rosette, in the order the website
 * draws them. The public API lists them in the same order, under the same
 * names.
 */
export const SCALING_RISKS = [
  { key: 'sequencerFailure', name: 'Sequencer Failure' },
  { key: 'stateValidation', name: 'State Validation' },
  { key: 'dataAvailability', name: 'Data Availability' },
  { key: 'exitWindow', name: 'Exit Window' },
  { key: 'proposerFailure', name: 'Proposer Failure' },
] as const
