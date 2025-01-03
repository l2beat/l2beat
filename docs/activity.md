# How to add activity tracking for existing project? ?

## Introduction

Within L2BEAT💗 we have an [Activity](https://l2beat.com/scaling/activity) tab which tracks activity
of scaling solutions. 'Activity' in this context refers to the amount of transactions that occur on
each chain. Configuring activity tracking for different projects is straightforward, especially for
those that support eth_getBlock RPC methods. This configuration process is managed individually for
each project through their respective .ts (TypeScript) files.

## Guide

If you want to add starkex type project, go to the [next section](#starkex-type-project)

1. Find RPC endpoint for a project you want to add. Try to write directly to project to obtain a
   private node access. If you can't, you can use a public node or RPC provider e.g. QuickNode.

2. Next you need to test your RPC locally. Use `cast` for this. If you do not have it yet, just
   install it by running `curl -L https://foundry.paradigm.xyz | bash` in terminal. After
   installing, run these 2 commands and check if you get a response:

   - `cast block-number -r <rpc-url>`
   - `cast block -r <rpc-url>`

If you get a response, you are good to go. If not, try to find another RPC. If you can't find another,
you need to talk to devs to handle this case.

3. Next step is to fill activity config in project config file. Add `config.transactionApi` property
   and fill it:

   - `type` (required): set it as `'rpc'`
   - `url` (optional): only set it if you want to use public RPC, if you are using private do not
     set it here, in next step I will show you where to put it
   - `callsPerMinute` (optional): in most of the cases 200 would be enough
   - `timeout` (optional): timeout property for provider, you do not have to set it up in most cases
   - `startBlock` (optional): if you want to start from specific block, set it here
   - `assessCount` (optional): custom function to assess count of transactions in block

4. (Only if you are using private RPC) - if you are using private RPC do not fill in the `url`
   property in previous step. Instead, go to `config.production.ts` and `config.local.ts` in
   `backend` folder to configure it. Add `activity.projects.<projectId>` property(projectId has to
   match projectId in project config file) and fill it:

```
        <projectId>: {
          type: 'rpc',
          callsPerMinute: env.integer('ACTIVITY_<PROJECT_ID>_CALLS'),
          url: env.string('ACTIVITY_<PROJECT_ID>_URL'),
        },
```

    After that, remember to add these variables to the Heroku config vars before merging them into the main branch

### Starkex type project

1. Go to this page:
   https://app.swaggerhub.com/apis-docs/StarkExBI/StarkExAggregations/0.3#/Queries/post_aggregations_count
   and check if your project is listed in `product` array in endpoint description section. If it is,
   you can go to the next step. If not, you need to talk to starkex devs to add support for your
   project.

2. Next step is to fill activity config in project config file. Add `config.transactionApi` property
   and fill it:

   - `type` (required): set it as `'starkex'`
   - `product` (required): set it for your project `product` property from swaggerhub
   - `sinceTimestamp` (required): from which timestamp you want to start fetching data
   - `resyncLastDays` (required): set it to 7

## Test locally

1. Set up your backend according to the instructions in the [README](../packages/backend/README.md).

2. Add `ACTIVITY_ENABLED=true` to your `.env` file. Also add `STARKEX_API_KEY` which is required. If
   you are using private RPC, you also need to add `ACTIVITY_<PROJECT_ID>_URL`.

3. Run `pnpm start:dev` in the `packages/backend` directory and wait till whole activity is synced.

4. Go to `packages/frontend`, set `DATABASE_URL` to your local database url and run `pnpm dev` to start frontend and check if activity is
   displayed correctly.
