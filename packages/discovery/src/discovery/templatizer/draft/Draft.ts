/**
 * The draft: the model's reply for one contract, the part of
 * `template.jsonc` it adds.
 *
 * It has the shape of the template file itself, so the model writes what
 * the researcher reviews and V1's own schema checks it. A field entry may
 * also carry `reason`, one sentence on why the field is there; that is not
 * a template key, so it is taken out and written as a comment above the
 * field.
 */
export interface Draft {
  /** The partial template, `reason` taken out of every field entry. */
  additions: Record<string, unknown>
  /** Field name → the model's reason, written above what is added for it. */
  reasons: Record<string, string>
}
