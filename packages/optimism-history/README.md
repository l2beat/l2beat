# Optimism history

Lists history of addresses stored in libAddressManager via querying `AddressSet` event. Assumes following libAddressManagers:

```
optimism: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
boba: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
metis: '0x918778e825747a892b17C66fe7D24C618262867d',
nahmii: '0x7934915C03eA2E2C4D69c269F45598B738ddee08',
```

Information retrieved from libAddressManager is stored in localcache which is used on subsequent usage.

Each resolved address is checked with Etherscan if it is a contract or EOA. It also check verification status.

As the libAddressManager stores hashes of names (instead of full names), names are fetched by looking at the method invocation which is rn only possible when `setAddress()` was called directly. If it is part of a bigger transaction, the name may not be properly displayed.

## Usage

`yarn start [network]`

## Example output

On March 9th 2022
`yarn start nahmii`
produced the following output:

```
2021-09-27   NVM_L2CrossDomainMessenger                 0x0000000000000000000000000000000000000000 -> 0x4200000000000000000000000000000000000007 <EOA 42000000>
2021-09-27   NVM_DecompressionPrecompileAddress         0x0000000000000000000000000000000000000000 -> 0x4200000000000000000000000000000000000005 <EOA 42000000>
2021-09-27   NVM_Sequencer                              0x0000000000000000000000000000000000000000 -> 0x44Ef162dc605B89d65a06A84482E1561cDD0000b <EOA 44Ef162d>
2021-09-27   NVM_Proposer                               0x0000000000000000000000000000000000000000 -> 0x44Ef162dc605B89d65a06A84482E1561cDD0000b <EOA 44Ef162d>
2021-09-27   NVM_L2BatchMessageRelayer                  0x0000000000000000000000000000000000000000 -> 0x44Ef162dc605B89d65a06A84482E1561cDD0000b <EOA 44Ef162d>
2021-09-27   NVM_ChainStorageContainer-message-queue    0x0000000000000000000000000000000000000000 -> 0x72dDa4F7d131035F523728F11FAe0D7ccbA67128 <Unverified 72dDa4F7>
2021-09-27   NVM_MessageQueue                           0x0000000000000000000000000000000000000000 -> 0xAC92b09965B6AAc33Dd43f3Ce752aD79b74Ddb94 NVM_MessageQueue
2021-09-27   NVM_L1CrossDomainMessenger                 0x0000000000000000000000000000000000000000 -> 0x0e14f07BCdCacEC46677DFf02685f049A7c3928C NVM_L1CrossDomainMessenger
2021-09-27   Proxy__NVM_L1CrossDomainMessenger          0x0000000000000000000000000000000000000000 -> 0x01dF38E20738c58aF8141504aa6C88013d3D6C5A Lib_ResolvedDelegateProxy
2021-09-27   NVM_FraudVerifier                          0x0000000000000000000000000000000000000000 -> 0xC0E090e6988FF9d5C471a2106A2cb176b4949E6C <Unverified C0E090e6>
2021-09-27   NVM_L1MultiMessageRelayer                  0x0000000000000000000000000000000000000000 -> 0xE7B3C7B34a3328d73782522424A9724A39FCEB8C <Unverified E7B3C7B3>
2021-09-27   Proxy__NVM_L1StandardBridge                0x0000000000000000000000000000000000000000 -> 0x2fCE9b92a64c1DDf14a1A9E5Ec6D4e4C7C9F4Fdd L1ChugSplashProxy
```
