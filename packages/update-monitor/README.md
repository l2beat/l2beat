# Upgrade monitor

Verifies permissioned addresses against the blockchain.

To run please use `yarn start`. Display help with `yarn start --help`.

## How to add a new project ?

### Step 1: Discovery

1. inside `src/projects` create your project's folder with the files:

   1. `constants.ts` where you specify addresses of the contracts, see example [starknet](src/projects/starknet/constants.ts)
   2. `index.ts` with the async function responsible for setting up the discovery engine, see example [starknet](src/projects/starknet/index.ts)

2. Add your project to discover script [here](src/commands/discover.ts)

3. run `yarn start discover [project]`

4. Discovery Engine will generate file with values from ABI calls inside `dist/discovery` and ABI per-contract in the folder `dist/discovery/abi/[contractAddress].json`

5. Copy your discovered ABI file to `abi/[project]` folder, I recommend renaming it from contract's address to the human readable name

6. Run `yarn typechain`

7. Typechain will generate Typescript typings inside `/src/typechain`

### Step 2: Getting values

Now we can create getter for the values, see example function `getStarkNetParameters` in [starknet](src/projects/starknet/index.ts)

1. Create getter for given contract's values, see example [starknet](src/proj/../projects/starknet/contracts/starknet.ts)

2. Add your getter to the "main getter" inside `index.ts`, see example [starknet](src/projects/starknet/index.ts)

3. Run `yarn start [project]`

4. Script will generate file `dist/[project].json` with fetched values

### Step 3: Verifying parameters
