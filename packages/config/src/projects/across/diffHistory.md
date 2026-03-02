Generated with discovered.json: 0x59d262f19545be70dc998bae3b0b5e32063c7574

# Diff at Mon, 02 Mar 2026 08:59:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772441911

## Description

ms change.

## Initial discovery

```diff
+   Status: CREATED
    contract VotingV2 (eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac)
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
```

```diff
+   Status: CREATED
    contract Zora_Adapter (eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Soneium_Adapter (eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B)
    +++ description: This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Redstone_Adapter (eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract HubPoolStore (eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61)
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Boba_Adapter (eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossConfigStore (eth:0x3B03509645713718B78951126E0A6de6f10043f5)
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
```

```diff
+   Status: CREATED
    contract Registry (eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Finder (eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
```

```diff
+   Status: CREATED
    contract AdapterStore (eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b)
    +++ description: A helper contract for chain adapters on the hub chain that support OFT messaging. Handles token -> messenger mapping.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c)
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

```diff
+   Status: CREATED
    contract ProposerV2 (eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
```

```diff
+   Status: CREATED
    contract Ethereum_Adapter (eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (eth:0x537abE038C223066B50312474409924487D2E655)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Ink_Adapter (eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Store (eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract Linea_Adapter (eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Ethereum_SpokePool (eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5)
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b)
    +++ description: This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Alephzero_Adapter (eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Base_Adapter (eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract GovernorV2 (eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
```

```diff
+   Status: CREATED
    contract UMA Multisig (eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (eth:0x8692B776d1Ff0664177c90465038056Dc64f8991)
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
```

```diff
+   Status: CREATED
    contract DoctorWho_Adapter (eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract EmergencyProposer (eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
```

```diff
+   Status: CREATED
    contract FixedSlashSlashingLibrary (eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd)
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
```

```diff
+   Status: CREATED
    contract Solana_Adapter (eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract ZkStack_Adapter (eth:0xA374585E6062517Ee367ee5044946A6fBe17724f)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363)
    +++ description: This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Across Multisig (eth:0xB524735356985D2f267FA010D681f061DfF03715)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda)
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
```

```diff
+   Status: CREATED
    contract Monad_Adapter (eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452)
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract OP_Adapter (eth:0xE1f04404b74F996A311F13aE291849fC153578Ac)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossBondToken (ABT) (eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea)
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
```

```diff
+   Status: CREATED
    contract SkinnyOptimisticOracle (eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Mode_Adapter (eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Blast_Adapter (eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
```
