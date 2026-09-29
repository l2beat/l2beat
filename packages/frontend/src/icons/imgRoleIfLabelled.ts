/**
 * An unlabelled role="img" is announced as an unnamed graphic, so icons only
 * claim the role when a label is given and are hidden as decoration otherwise.
 */
export function imgRoleIfLabelled(label: string | undefined) {
  return label ? { role: 'img' } : { 'aria-hidden': true }
}
