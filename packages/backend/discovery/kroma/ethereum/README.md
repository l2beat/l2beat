# To run the tests do the following:

- [If you didn't already install foundry, do it](https://book.getfoundry.sh/getting-started/installation).
- `export RPC_URL=<your rpc url>`
- `forge test`

# To run the state root propose script, do:

By default the script runs against Sepolia testnet. Please consult the source code to run
against mainnet.

- `export MY_PRIVATE_KEY=0x.....`
- `export MY_ADDRESS=0x.....`
- `pnpm run-kroma-propose-script <RPC_URL>` - make sure RPC_URL is for the network you're running it on

# To run the ProposeRoot.s.sol script:

As per [documentation](https://book.getfoundry.sh/tutorials/solidity-scripting):

> Solidity scripting is a way to declaratively deploy contracts using Solidity,
> instead of using the more limiting and less user-friendly forge create. [...]
> they are run on the fast Foundry EVM backend, which provides dry-run
> capabilities.

Foundry scripting is very limiting and I suggest using TypeScript (with
ethers/viem and e.g. TypeChain). Otherwise you won't be able to use loops with
delays, polling, integration with 3rd party systems (Discord message) etc.

See documentation here:

- https://book.getfoundry.sh/tutorials/solidity-scripting
- https://book.getfoundry.sh/reference/forge/forge-script

- `export RPC_URL=<your rpc url>`
- `export MY_PRIVATE_KEY=0x.....`
- `export MY_ADDRESS=0x.....`
- `forge script script/ProposeRoot.s.sol:ProposeRoot --rpc-url $RPC_URL --broadcast`
  - the `--broadcast` parameter is actually the one that broadcasts transaction
  - if you omit `--broadcast` it will run against some temporary local fork, see:
    https://book.getfoundry.sh/tutorials/solidity-scripting

# If you want to explicitly run the script against a local fork:

- `anvil --fork-url <RPC_URL>`
  - it will start and show address and port it's listening on
- when running `forge script` pass the anvil's address:port, usually `127.0.0.1:8545`
