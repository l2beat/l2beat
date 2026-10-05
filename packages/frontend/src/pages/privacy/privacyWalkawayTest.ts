/** In a .ts file so the server-side markdown can use it without bundling React components. */
export const PRIVACY_WALKAWAY_TEST_TOOLTIPS = {
  passed:
    'This protocol passes the walkaway test: users can fully use it if all centralized protocol participants disappear.',
  notPassed:
    'This protocol does not pass the walkaway test: users cannot fully use it if all centralized protocol participants disappear.',
} as const
