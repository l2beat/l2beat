# Upgrade monitor

Verifies permissioned addresses against the blockchain.

Currently it relies on git to show the diff between previous and current values.

To use this system please set the following variable in your `.env` file:

```
ALCHEMY_API_KEY=<your_key_here>
```

# Running

You can actually make the script only run for specific projects by naming them
in the arguments. Examples:

- `yarn start` - processes all projects
- `yarn start zkSync` - only processes zkSync
- `yarn start zkSpace1 zkSpace2` - processes both zkSpace1 and zkSpace2
