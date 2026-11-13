/**
 * The small stage badge's size (`SmallStageBadge`), for the other badges in
 * the summary's compact tables, so a row's badges match and stay calm.
 */
const COMPACT_BADGE_CLASS_NAME =
  'inline-flex h-5 items-center whitespace-nowrap rounded-sm py-0 text-label-value-12 md:text-label-value-12'

/** "No data" in the table's quiet grey, not the badge's blue. */
export const COMPACT_NO_DATA_CLASS_NAME = `${COMPACT_BADGE_CLASS_NAME} border-divider bg-surface-secondary font-normal text-secondary dark:border-divider dark:bg-surface-secondary`

/**
 * The reasons a project is in Others, in red. No colour token keeps 12px text
 * at AA on the table's red and amber row highlights, so these are darker in
 * the light and lighter in the dark than `text-negative`. In the dark the
 * badge is only an outline: any red fill takes the text under AA.
 */
export const COMPACT_REASON_BADGE_CLASS_NAME = `${COMPACT_BADGE_CLASS_NAME} bg-negative/[0.08] text-[#bd0000] dark:bg-transparent dark:text-[#ff6666] dark:ring-1 dark:ring-negative/40 dark:ring-inset`
