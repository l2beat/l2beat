/** In a .ts file so the server-side markdown can use it without bundling React components. */
export const PRIVACY_WALKAWAY_TEST_TOOLTIPS = {
  passed:
    'This protocol passes the walkaway test: users can still fully use it if every centralized participant disappears.',
  notPassed:
    'This protocol fails the walkaway test: users cannot fully use it if every centralized participant disappears.',
} as const
