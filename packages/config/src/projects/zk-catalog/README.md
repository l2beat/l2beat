If you want to add a new project to ZK Catalog or update the information for an existing one, follow the steps below.

### If the project is already listed on the main L2BEAT website as a Scaling project

1. Find the projectName.ts file for this project in `packages/config/src/projects`
2. Find the `proofVerification` object or, if it’s missing, add it within `stateValidation`. Check already listed projects for an example.
3. Add/update the information for the project

   - `aggregation` - set to `true` if recursive proof aggregation is used.
   - `requiredTools` - optional; add the list of required tools for performing the verification of the verifiers. A name, version, and link is required for each.
   - `verifiers` - add the list of onchain verifiers. For each you have to specify a `name`, `description`, `contractAddress`, `chainId`, and the `subVerifiers`. You can also set verified to yes/no if you have performed the procedure by yourself. Otherwise, it should be left empty.
     If the `chainId` you’re looking for is not present, add it in `packages/shared-pure/src/types/ChainId.ts`.

4. Add a detailed description - this is done by creating a markdown file in `packages/frontend/src/content/zkCatalogDescriptions`. If you want to add any images, make sure to add them in `packages/frontend/src/static/images/zk-catalog`.

### If the project is not listed on the main L2BEAT website

1. Create a new projectName.ts file in `packages/config/src/projects/other/zk-catalog`
2. Edit the .ts file with the same information as above, but also include the following properties:

```js
id: ProjectId('UNIQUE_ID_HERE'),
slug: 'unique-slug',
name: 'Project Name',
addedAt: UnixTime.fromDate(new Date('YYYY-MM-DD'))
// tags
isZkCatalog: true
// data
proofVerification: { /* The specifics from above */ }
```

3. Add a detailed description - this is done by creating a markdown file in `packages/frontend/src/content/zkCatalogDescriptions`. If you want to add any images, make sure to add them in `packages/frontend/src/static/images/zk-catalog`.
4. Update the index.ts file in `packages/config/src/projects/other/zk-catalog` to include the project
5. Add a PNG logo in `packages/frontend/src/static/icons`
6. Run `pnpm tinify-logos` in the `frontend` package

In both cases make sure to run `pnpm test` in the `config` package.
Then submit a PR.
