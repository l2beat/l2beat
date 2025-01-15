This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How to add new chain to UOPS explorer?

1. `packages/uops-dashboard/src/chains.ts`
- add entry to `ChainId`
- add entry to `SUPPORTED_CHAINS`
2. `packages/uops-dashboard/src/server/clients/apiUrls.ts`
- add entry to `API_URLS`
- [optional] add entry to `SCAN_URLS` to see contract names in explorer

### How to test newly added chain?

1. Run `pnpmn dev` & open [local instance](http://localhost:3000)
2. Select this new chain & explore latest block
3. Check links: block, tx, contract
4. Go to [stats](http://localhost:3000/stats)
5. Explore last 100 blocks
6. [optional] If in steps 2 & 5 you did not see any UOPS: manually go to `0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789` on the explorer and find block number when it was invoked
