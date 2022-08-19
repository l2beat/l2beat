import { providers, utils } from 'ethers'

const abi = new utils.Interface([
  'function balanceOf(address _owner) public view returns (uint256 balance)',
])

const provider = new providers.AlchemyProvider('mainnet')


const f = abi.encodeFunctionData('balanceOf', ['0x17c14D2c404D167802b16C450d3c99F88F2c4F4d'])
console.log(f)