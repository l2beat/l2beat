/** Summary table column tooltips, also quoted by the methodology page. */
export const PRIVACY_COLUMN_DESCRIPTIONS = {
  trustedSetup:
    "Trusted setup used by the project's proving system and its risk.",
  exitWindow:
    'Time users have to withdraw before a malicious upgrade can take effect.',
  walkawayTest:
    'The walkaway test says whether users can still fully use the protocol if every centralized participant disappears.',
  reproducibility:
    'Whether all source code needed to audit the protocol and participate in it is published and can be used locally.',
} as const
