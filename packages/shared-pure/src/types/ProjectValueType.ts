export type ProjectValueType =
  | 'PROJECT' // Sum of all tokens for project
  | 'PROJECT_WA' // Without Associated
  | 'SUMMARY' // Sum of tokens but without double-count e.g. L2 tokens in L3 escrow on this L2. Used for calculating aggregate chart for whole scaling ecosystem
  | 'SUMMARY_WA' // Without Associated
