If you want to add a new project to ZK Catalog or update the information for an existing one, follow the steps below.

1. Find the project file in `packages/config/src/projects`.
2. Add or update the `zkCatalogInfo` object. Check already listed ZK Catalog projects for examples.
3. Add or update the catalog metadata:

   - `creator`
   - `techStack`
   - `proofSystemInfo`
   - `trustedSetups`
   - `verifierHashes`
   - `projectsForTvs` when relevant
   - `formalVerificationLinks` and `audits` when available

4. Make sure the project has the appropriate icon in `packages/frontend/static/icons`.
5. Run `pnpm test` in the `config` package and any relevant frontend checks.

Then submit a PR.
