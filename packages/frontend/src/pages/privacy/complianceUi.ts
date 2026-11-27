/** Copy of the Compliance section, shared by the HTML and the markdown page. */
export const COMPLIANCE = {
  sectionId: 'compliance',
  title: 'Compliance',
  disclosureLabel: 'What you can prove',
  noDisclosure:
    'No proof tool. Nothing we found lets a user prove anything about their own funds without exiting.',
  verifiableWithoutOperator: 'Verifiable without the operator',
  notVerifiableWithoutOperator: 'Needs trust in the operator',
  singleVerifier: 'Shown to one verifier only',
  notSingleVerifier: 'Not limited to one verifier',
  requirementsLabel: 'Compliance requirements it can meet',
} as const

/**
 * The rating covers one app, the same reference app as the Privacy section,
 * together with the protocol it uses. A different app can screen differently.
 */
export function getComplianceIntro(appLabel: string | undefined) {
  const subject = appLabel
    ? `Rated for ${appLabel}, the reference app, and the protocol it uses`
    : 'Rated for the protocol'
  return `${subject}: who can see or block a user's funds for compliance reasons. Each ladder shows the worst such power. Other apps can screen differently.`
}
