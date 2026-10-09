/**
 * What a score allows: from `good` up the code counts as ossified, about a
 * year without a critical change; below `warning`, a critical change landed
 * within roughly the last five weeks. Mirrors OSSIFICATION_SCORE_BANDS in
 * @l2beat/shared, whose CommonJS build the browser cannot import;
 * ossificationScoreBands.test.ts keeps the two equal.
 */
export const OSSIFICATION_SCORE_BANDS = { good: 80, warning: 50 } as const
