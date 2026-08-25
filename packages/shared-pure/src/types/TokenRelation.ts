/**
 * The `plugin` value of a manually added `TokenRelation`.
 *
 * Interop plugins are observers — kebab-case identifiers declared by plugin
 * classes in the backend — and a relation's `plugin` column names the observer
 * whose transfer evidence produced it. A relation a human added through
 * token-UI has no such observer, so it carries this sentinel instead. Never
 * name a real interop plugin `manual`.
 *
 * The sentinel is a row-level marker: any reader can select or exclude manual
 * relations on the `plugin` column alone, without opening the `transfer`
 * evidence JSON (which for manual relations holds a `{ kind: 'manual', ... }`
 * object rather than a sample interop transfer).
 * See docs/mdbook/specs/l2b_specs/token_db/token_relations.md.
 */
export const MANUAL_RELATION_PLUGIN = 'manual'
