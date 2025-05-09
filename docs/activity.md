# How to add activity tracking for existing project? ?

## Introduction

Within L2BEAT💗 we have an [Activity](https://l2beat.com/scaling/activity) tab which tracks activity
of scaling solutions. 'Activity' in this context refers to the amount of user operations and transactions that occur on
each chain. Configuring activity tracking for different projects is straightforward, especially for
those that support eth_getBlock RPC methods. This configuration process is managed individually for
each project through their respective .ts (TypeScript) files.

## Guide

If you want to add a StarkEx type of project, go to the [next section](#starkex-type-project)

1. Find RPC endpoint for a project you want to add. Try to write directly to project to obtain a
   private node access. If you can't, you can use a public node or RPC provider e.g. QuickNode.

2. Next you need to test your RPC locally. Use `cast` for this. If you do not have it yet, just
   install it by running `curl -L https://foundry.paradigm.xyz | bash` in terminal. After
   installing, run these 2 commands and check if you get a response:

   - `cast block-number -r <rpc-url>`
   - `cast block -r <rpc-url>`

If you get a response, you are good to go. If not, try to find another RPC. If you can't find another,
you need to talk to devs to handle this case.

3. Next step is to fill a chain config in project config file. Add `chainConfig.apis` property
   and fill it:

   - `type` (required): set it as `'rpc'`
   - `url` (required): only set it if you want to use public RPC, if you are using private do not
     set it here, in next step I will show you where to put it
   - `callsPerMinute` (optional): in most of the cases 200 would be enough

The `chainConfig` also needs a `name` and `chainId`. If you're adding a Starknet-based project, have the `chainId` as `undefined`.

4. Next, you have to add activity-specific config. Add `config.activityConfig` property and fill it:

    - `type`: set it as `'block'`, unless it's a StarkEx project
    - `startBlock` (optional): if you want to start from specific block, set it here, in most cases it's block 1
    - `assessCount` (optional): custom function to assess count of transactions in block - applies to projects that have some system transactions, like OP Stack or Orbit chains.
  

4. (Only if you are using private RPC) - if you are using private RPC, fill in the `url`
   property with something like `https://replace.me`. After that, remember to add these variables to the Heroku config vars before merging them into the main branch. If you're an external contributor, contact the team.

### Starkex type project

1. Go to this page:
   https://app.swaggerhub.com/apis-docs/StarkExBI/StarkExAggregations/0.3#/Queries/post_aggregations_count
   and check if your project is listed in `product` array in endpoint description section. If it is,
   you can go to the next step. If not, you need to talk to starkex devs to add support for your
   project.

2. In project config file add `chainConfig` property
   and fill it:

   - `name` (required): set it as the project Id
   - `chainId` (required): set it as `undefined`
   - `apis` (required): set the `type` as `starkex` and the `product` as the product Id from the Swagger docs

3. Next step is to fill activity config in project config file. Add `config.activityConfig` property
   and fill it:

   - `type` (required): set it as `'day'`
   - `sinceTimestamp` (required): from which timestamp you want to start fetching data
   - `resyncLastDays` (required): set it to 7

## Test locally

1. Set up your backend according to the instructions in the [README](../packages/backend/README.md).

2. Add `ACTIVITY_ENABLED=true` to your `.env` file. Also add `STARKEX_API_KEY` which is required. If
   you are using private RPC, you also need to add `ACTIVITY_<PROJECT_ID>_URL`.

3. Run `pnpm start:dev` in the `packages/backend` directory and wait till whole activity is synced.

4. Go to `packages/frontend`, set `DATABASE_URL` to your local database url and run `pnpm dev` to start frontend and check if activity is
   displayed correctly.
