# How to add new activity module for existing project? A thread 🧵👇🏽

1. Find a RPC for a project you want to add activity module for. Try to write directly to project to
   obtain a private node access. If you can't, you can use a public node.

2. Next you need to test your RPC locally. Use `Cast` for this. If you do not have it yet, just
   install it by running `curl -L https://foundry.paradigm.xyz | bash` in terminal. After
   installing, run these 2 commands and check if you get a response:

   - `cast block-number -r <rpc-url>`
   - `cast block -r <rpc-url>`

If you get a response, you are good to go. If not, try to find another RPC. If you can't another,
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

    After that, remember to add these variables to the Heroku config vars before merging them into the master branch
