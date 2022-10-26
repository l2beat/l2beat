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

   - if your script is stuck at some method there probably is a need to skip it by providing configuration parameter `skipMethods`, see example [arbitrum](src/projects/arbitrum/index.ts)

4. Discovery Engine will generate file with values(discovered by calling all possible read methods) inside `dist/discovery` and ABI per-contract in the folder `dist/discovery/abi/[contractAddress].json`

5. Copy your discovered ABI file to `abi/[project]` folder, I recommend renaming it from contract's address to the human readable name

6. Run `yarn typechain`

7. Typechain will generate Typescript typings inside `/src/typechain`

### Step 2: Getting values

In this step we will create a function that will be called when running `yarn start [project]`, this will result in saving output of this function into `dist/[project].json`. You can put everything inside `index.ts`, but I recommend splitting it by-contract, so you create getters for every contract and later in `index.ts` you create aggregate call. Let's see the simple flow of this process:

1. Create folder `src/projects/[project]/contracts` and inside put a getter for given contract's values, see example [starknet](src/proj/../projects/starknet/contracts/starknet.ts)

2. Add your getter to the "main getter" inside `index.ts`, see example [starknet](src/projects/starknet/index.ts)

3. Run `yarn start [project]`

4. Script will generate file `dist/[project].json` with fetched values

### Step 3: Verifying parameters
