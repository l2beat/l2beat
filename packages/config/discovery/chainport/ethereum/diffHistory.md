Generated with discovered.json: 0xd23305ed5153775acdb2f744058039f45d85bf42

# Diff at Tue, 04 Mar 2025 10:39:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21744139
- current block number: 21744139

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21744139 (main branch discovery), not current.

```diff
    contract ChainportCongressMembersRegistry (0x1DeE7Be5415F6Fdcc8515cA06AE8d9aFb550aBCa) {
    +++ description: None
      sinceBlock:
+        12477538
    }
```

```diff
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    +++ description: None
      sinceBlock:
+        13938818
    }
```

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      sinceBlock:
+        12875622
    }
```

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      sinceBlock:
+        12875629
    }
```

```diff
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    +++ description: None
      sinceBlock:
+        12945363
    }
```

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
      sinceBlock:
+        12477537
    }
```

Generated with discovered.json: 0x3d68639a989344e713845ff6dc586369c92b6d21

# Diff at Fri, 31 Jan 2025 11:13:48 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@84b1296dd423a2ef9361874d922cd6911109ba10 block: 21543439
- current block number: 21744139

## Description

Proposal to transfer 4 945 441 MBDAO tokens to `0x6b779ae702A4E139039151b05bEB2730356047DA`.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        62
+        63
    }
```

Generated with discovered.json: 0x5a7b7dccee4729f6da35484409dc7b7b4377701e

# Diff at Mon, 20 Jan 2025 11:09:21 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21543439
- current block number: 21543439

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21543439 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a"
      receivedPermissions.0.from:
+        "0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a"
    }
```

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F"
      issuedPermissions.0.to:
+        "0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F"
    }
```

Generated with discovered.json: 0x77908f6e1a3a728a0bf3d25092ad5f91724d4096

# Diff at Fri, 03 Jan 2025 10:46:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21357562
- current block number: 21543439

## Description

Congress members (chainport bridge governance for e.g. upgrades) added (1  changed, one added). Quorum increased to 3/4.

## Watched changes

```diff
    contract ChainportCongressMembersRegistry (0x1DeE7Be5415F6Fdcc8515cA06AE8d9aFb550aBCa) {
    +++ description: None
      values.allMembers.3:
+        "0x38B9cf22343C417C99e9AF4Aee06897ff1A85cDd"
      values.allMembers.2:
-        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
+        "0xdd37184C6BF02Aea66Ed3eCb8fcccfeADF801609"
      values.allMembers.1:
-        "0x00040D1445683B7Ef71bf2D94CB7Fe2224Eba8d8"
+        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
      values.getAllMemberAddresses.3:
+        "0x38B9cf22343C417C99e9AF4Aee06897ff1A85cDd"
      values.getAllMemberAddresses.2:
-        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
+        "0xdd37184C6BF02Aea66Ed3eCb8fcccfeADF801609"
      values.getAllMemberAddresses.1:
-        "0x00040D1445683B7Ef71bf2D94CB7Fe2224Eba8d8"
+        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
      values.getMinimalQuorum:
-        2
+        3
      values.getNumberOfMembers:
-        3
+        4
    }
```

Generated with discovered.json: 0x1ffae2f2e0c49d3a19397c6b4b2d88c4b385e973

# Diff at Sun, 08 Dec 2024 11:46:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@59fd7a30471906b5a479f280731621e94e22f17c block: 21279513
- current block number: 21357562

## Description

Change congress member scheduled.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        61
+        62
    }
```

Generated with discovered.json: 0x1696acdb8f632b356b3afcfaa947d7f999961ac7

# Diff at Wed, 27 Nov 2024 13:53:35 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3b9391cfe483e60a1853eeae6e47b4de475aac4e block: 21078715
- current block number: 21279513

## Description

One MS signer changed.

## Watched changes

```diff
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    +++ description: None
      values.$members.2:
-        "0x00040D1445683B7Ef71bf2D94CB7Fe2224Eba8d8"
+        "0x894107B7b5051409f279E8300774B2f62Febe057"
      values.$members.1:
-        "0x894107B7b5051409f279E8300774B2f62Febe057"
+        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
      values.$members.0:
-        "0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7"
+        "0xdd37184C6BF02Aea66Ed3eCb8fcccfeADF801609"
    }
```

Generated with discovered.json: 0x63b695297e8904480f6039481c9d4530cf84b525

# Diff at Wed, 30 Oct 2024 13:20:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0a8a53530022c6c5edd257c3682a3e7f80d0c550 block: 20934226
- current block number: 21078715

## Description

New proposal 'Upgrade Side Bridge'.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        60
+        61
    }
```

Generated with discovered.json: 0xebf41eee0bf1fbc215ab5534baf1d7c7f172c0ad

# Diff at Mon, 21 Oct 2024 11:05:06 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20934226
- current block number: 20934226

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934226 (main branch discovery), not current.

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      values.$pastUpgrades.11.2:
+        ["0x118cbd7a4769846AD4928598D1f805a509Cc8c0d"]
      values.$pastUpgrades.11.1:
-        ["0x118cbd7a4769846AD4928598D1f805a509Cc8c0d"]
+        "0xc08d591a69c116934b2b0d03bf3779f1b32f3697403deb30e331d10e589a13f3"
      values.$pastUpgrades.10.2:
+        ["0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"]
      values.$pastUpgrades.10.1:
-        ["0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"]
+        "0xb30bee6d88a05f4a27f1e9941c4ee88c7c289c952b4acd5a2693c2cadf797019"
      values.$pastUpgrades.9.2:
+        ["0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"]
      values.$pastUpgrades.9.1:
-        ["0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"]
+        "0xf1b782f60c6ab7980c772b8cb62539d63b865a9fedd6927eab499764a809ea9b"
      values.$pastUpgrades.8.2:
+        ["0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"]
      values.$pastUpgrades.8.1:
-        ["0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"]
+        "0xcd6d5a9ae4fdaaa23af1843883164115154b1de1050ca366d473f9cca859c8d2"
      values.$pastUpgrades.7.2:
+        ["0x5D6F289A6A31c618A600d61984140877991E90f7"]
      values.$pastUpgrades.7.1:
-        ["0x5D6F289A6A31c618A600d61984140877991E90f7"]
+        "0x5b2d6b9765e94fb928fda2e98f1dbe2ecfe3e63284657fc5b470c27a0c67027d"
      values.$pastUpgrades.6.2:
+        ["0x77FA6b67b5fC1cC6116082981D1Db098B8980843"]
      values.$pastUpgrades.6.1:
-        ["0x77FA6b67b5fC1cC6116082981D1Db098B8980843"]
+        "0x658551e74139603df44299ecfdc949b66681304f9b60851c12183ebc71ae8dcf"
      values.$pastUpgrades.5.2:
+        ["0x6609d8d915153A18768199468c89A9B0e27581a6"]
      values.$pastUpgrades.5.1:
-        ["0x6609d8d915153A18768199468c89A9B0e27581a6"]
+        "0xaed895924fb77c7ebf637c6b0e0c8db738c66bf97de6476ac3591172e09f2884"
      values.$pastUpgrades.4.2:
+        ["0xF8EfC927502c4645d147dEE742637BaF5B4318B0"]
      values.$pastUpgrades.4.1:
-        ["0xF8EfC927502c4645d147dEE742637BaF5B4318B0"]
+        "0x444aaf1a35637a6b802aab39410a61d3b727a7dd7d83954ee9ef94ca3e8d69c0"
      values.$pastUpgrades.3.2:
+        ["0xE317bF1cf456875f37F1d1c5A63848d0Ab25653C"]
      values.$pastUpgrades.3.1:
-        ["0xE317bF1cf456875f37F1d1c5A63848d0Ab25653C"]
+        "0xd619524ecae6aa74fd5a7000d1d6b5cdfa910d2537c015e32c7a302b4a3fba2b"
      values.$pastUpgrades.2.2:
+        ["0x21AEbe5B5b7A33930b3c5c10fbd77117501a9552"]
      values.$pastUpgrades.2.1:
-        ["0x21AEbe5B5b7A33930b3c5c10fbd77117501a9552"]
+        "0xa8eceb179b5c23233ec3b5ec5fc93cd540aa6c7bf40559ec28e30adc2c193bc7"
      values.$pastUpgrades.1.2:
+        ["0xF7362aF99Cc1f48a1e50D304ed23BAf8f9Fd16f2"]
      values.$pastUpgrades.1.1:
-        ["0xF7362aF99Cc1f48a1e50D304ed23BAf8f9Fd16f2"]
+        "0xb007fc0f426a239f7a3dff9f163b4589ab076198704847e58e344538db02eefa"
      values.$pastUpgrades.0.2:
+        ["0x93307C7dE0f1B54814135f06321639A9f5c7dDFF"]
      values.$pastUpgrades.0.1:
-        ["0x93307C7dE0f1B54814135f06321639A9f5c7dDFF"]
+        "0x334505c891cfddf40c04d764d021aec63cb00ff6dc2cc8bdc0e27d33c7c159c5"
    }
```

Generated with discovered.json: 0xdcef6af168bda1d85c182c6515e2b65006972404

# Diff at Mon, 14 Oct 2024 10:50:09 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20934226
- current block number: 20934226

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934226 (main branch discovery), not current.

```diff
    contract ChainportCongressMembersRegistry (0x1DeE7Be5415F6Fdcc8515cA06AE8d9aFb550aBCa) {
    +++ description: None
      sourceHashes:
+        ["0x3a8dc61e76d801c8f238572cf0ed2aff6136a21f2b1730dff7360717e9b32db7"]
    }
```

```diff
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      sourceHashes:
+        ["0x31b987ba8db4fc147856ec1375d9df4f40d58c4dc97e16be5b38ee2e3c3cc6f9"]
    }
```

```diff
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
      sourceHashes:
+        ["0x6fc47885abd30d6674764b88e43a68f4c96a8dd3dd28c11c769a1089b41158cc"]
    }
```

Generated with discovered.json: 0xbc0a5fcca57a83e5ca93ba57e600138d1dc8d4e7

# Diff at Thu, 10 Oct 2024 09:11:08 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 20454449
- current block number: 20934226

## Description

New proposal (and execution) to unpause the unverified contract `0xd02c8a355599fee7e4f1d1d71f7a01c0108e353c`.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        59
+        60
    }
```

Generated with discovered.json: 0xdf8464b1ecc09fd1f5c660488df3f88bfdc79bea

# Diff at Tue, 01 Oct 2024 10:50:26 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20454449
- current block number: 20454449

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454449 (main branch discovery), not current.

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      values.$pastUpgrades:
+        [["2021-07-22T10:30:25.000Z",["0x93307C7dE0f1B54814135f06321639A9f5c7dDFF"]],["2021-08-03T12:38:19.000Z",["0xF7362aF99Cc1f48a1e50D304ed23BAf8f9Fd16f2"]],["2021-11-10T14:18:21.000Z",["0x21AEbe5B5b7A33930b3c5c10fbd77117501a9552"]],["2022-03-15T12:40:26.000Z",["0xE317bF1cf456875f37F1d1c5A63848d0Ab25653C"]],["2022-07-25T08:03:28.000Z",["0xF8EfC927502c4645d147dEE742637BaF5B4318B0"]],["2022-11-16T11:32:23.000Z",["0x6609d8d915153A18768199468c89A9B0e27581a6"]],["2023-04-02T08:48:23.000Z",["0x77FA6b67b5fC1cC6116082981D1Db098B8980843"]],["2023-07-10T07:49:59.000Z",["0x5D6F289A6A31c618A600d61984140877991E90f7"]],["2023-08-09T08:10:35.000Z",["0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"]],["2024-01-15T08:39:47.000Z",["0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"]],["2024-06-25T05:54:35.000Z",["0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"]],["2024-07-30T09:36:11.000Z",["0x118cbd7a4769846AD4928598D1f805a509Cc8c0d"]]]
    }
```

Generated with discovered.json: 0x5e014e40bb341f1f5fd59ba382b5f054461d6458

# Diff at Fri, 30 Aug 2024 07:51:45 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20454449
- current block number: 20454449

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454449 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0xec05527dd927375c581973617e9fe96166652249

# Diff at Fri, 23 Aug 2024 09:51:43 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20454449
- current block number: 20454449

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454449 (main branch discovery), not current.

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      values.$upgradeCount:
+        12
    }
```

Generated with discovered.json: 0x7eccdf69b9a5cc73bc79a62857325b90d1407c47

# Diff at Wed, 21 Aug 2024 10:02:28 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20454449
- current block number: 20454449

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454449 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a","via":[]}]
    }
```

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F","via":[]}]
    }
```

Generated with discovered.json: 0xf9cca159c6aa8db8ff592035d9b5a35fe7c86a10

# Diff at Fri, 09 Aug 2024 10:09:05 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20454449
- current block number: 20454449

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20454449 (main branch discovery), not current.

```diff
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0x894107B7b5051409f279E8300774B2f62Febe057","0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7","0xD2238E8c085E5059F8DFC52256530210bc7250F6"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x894107B7b5051409f279E8300774B2f62Febe057","0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7","0xD2238E8c085E5059F8DFC52256530210bc7250F6"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a"]
      assignedPermissions.upgrade:
+        ["0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a"]
    }
```

```diff
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 3 (67%)"
      values.getOwners:
-        ["0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7","0x894107B7b5051409f279E8300774B2f62Febe057","0x00040D1445683B7Ef71bf2D94CB7Fe2224Eba8d8"]
      values.getThreshold:
-        2
      values.$members:
+        ["0xbDCaAa95202A56D0c688CEE2E1260fAB2F6e4fF7","0x894107B7b5051409f279E8300774B2f62Febe057","0x00040D1445683B7Ef71bf2D94CB7Fe2224Eba8d8"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0xfc2819bb1373d8011d711450653b32f5bd973760

# Diff at Sun, 04 Aug 2024 09:59:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@14945a4ebc63b3db3867f33067f31f159fedd9a9 block: 20420404
- current block number: 20454449

## Description

The bridge was frozen by EOA (maintainer role) and unfrozen through a proposal.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        57
+        59
    }
```

Generated with discovered.json: 0x3c024b87baed4c457cb832b6529c8aeaaab5fc41

# Diff at Tue, 30 Jul 2024 15:56:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@51c652e40232eac8e60e9b31aa56f09071495fef block: 20389507
- current block number: 20420404

## Description

Upgraded implementation. (unverified contract)

## Watched changes

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      values.$implementation:
-        "0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"
+        "0x118cbd7a4769846AD4928598D1f805a509Cc8c0d"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20389507 (main branch discovery), not current.

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
      fieldMeta:
+        {"proposalCount":{"severity":"MEDIUM","description":"The amount of proposals ever created. Goes up by 1 for each proposal."}}
    }
```

Generated with discovered.json: 0xd4edabd36b47d6d04eb8b764f4fba365729e4e7a

# Diff at Fri, 26 Jul 2024 08:24:04 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20181708
- current block number: 20389507

## Description

Two scheduled transactions (the first is already executed):
1) unpause bridges
2) deploy 'LiquidityManager' ([unverified contract](https://etherscan.io/address/0xca9a74c22f0a2eb91909d59a98f48f9357499a46))

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        55
+        57
    }
```

Generated with discovered.json: 0x4fd047f7a3a415b0bb239baf3fb1480e28513eba

# Diff at Thu, 27 Jun 2024 08:04:02 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa87256215827e86de3c150df238331f18654881 block: 20175233
- current block number: 20181708

## Description

Proposed and executed a proposal to unfreeze bridges, Vault6 and unverified 0xD02c8a355599FEe7e4F1d1d71f7A01c0108E353c.

Vault6 implementation is unverified, currently no visibility on what was frozen.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        54
+        55
    }
```

Generated with discovered.json: 0xb8c06d6916518287da115de7a043ff208ec8a78a

# Diff at Wed, 26 Jun 2024 10:22:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb9200e010745e10244c0b3851b3acf21fe41f31 block: 20138458
- current block number: 20175233

## Description

Proposal from last update is executed, upgrading the Vault6 contract to a new unverified implementation.

## Watched changes

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    +++ description: None
      upgradeability.implementation:
-        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
+        "0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"
      implementations.0:
-        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
+        "0x5D9A457ce3F6ab74B7854DA7Cdc8ac5cc5bbb16C"
    }
```

Generated with discovered.json: 0xf976fdfd826637b5822d6ad01aaca6c3ef60d265

# Diff at Fri, 21 Jun 2024 06:59:57 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1ba6434de248c46d9e6b140264866a3072082af4 block: 20016116
- current block number: 20138458

## Description

New proposal: Withdraw fees from Vault 6, upgrade other unverified contracts to new unverified contracts.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        53
+        54
    }
```

Generated with discovered.json: 0x9e9cf8137ae4685c73b20e751b457741f4598a42

# Diff at Tue, 04 Jun 2024 04:37:25 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@706706295a49487100a144276621ec14caf86806 block: 19531518
- current block number: 20016116

## Description

A new proposal is made in the goveernance contract which has the description 'Unfreeze bridges' and targets a Chainport Vault (`0x763a0ca93af05ade98a52dc1e5b936b89bf8b89a`) of which the source code is unverified.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        52
+        53
    }
```

Generated with discovered.json: 0x4e1a299c85d757fb2b972b98daae67841056a93f

# Diff at Thu, 28 Mar 2024 08:48:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19467300
- current block number: 19531518

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19467300 (main branch discovery), not current.

```diff
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

```diff
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 3 (67%)"
    }
```

Generated with discovered.json: 0x8db723b5dec0e6a44d1881afc2458d6f3fd6aebf

# Diff at Tue, 19 Mar 2024 07:26:39 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@87a9df6317bf41ef2d063033dfc77d54521b9991 block: 19440568
- current block number: 19467300

## Description

A proposal was submitted and is executed. The execution emitted the Unpaused event from two unverified contracts (0xe452aB0cA5cCBeDd7A27E66C82644Cad747bb976 and 0x442bE00c47C7B1d3A972D179dc696DEd006862b8) and was externally titled: 'Unfreeze SwapClone + StableBridgeCore'

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        51
+        52
    }
```

Generated with discovered.json: 0x6c4694a51a3ccf3920314d28aac8d48e9e63e622

# Diff at Fri, 15 Mar 2024 13:13:16 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e2d7fd753a5234b8cba1b13f16353dfafe85c087 block: 19389379
- current block number: 19440568

## Description

A proposal is submitted which would change the FeeCollector, AdminFeeCollector and add a Maintainer (There are currently 6 Maintainers registered, they can at least freeze the bridges). The new maintainer has the address 0xc051b171464D77bdF47f08bC7606630F17aB0753.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        50
+        51
    }
```

Generated with discovered.json: 0x86f5a697e88e62dc3e2832bb21f5115cd2bec5e2

# Diff at Fri, 08 Mar 2024 08:53:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a10be30b5303dc6a457478efdaca424c246501ca block: 19375580
- current block number: 19389379

## Description

New proposal created and executed with the description "Change Arbitrage Settings on Main and Side Bridges".
It called `setArbitrageManagerAndLimit()` but we can't see what this is doing because the targets have unverified sources.

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
+++ description: The amount of proposals ever created. Goes up by 1 for each proposal.
+++ severity: MEDIUM
      values.proposalCount:
-        49
+        50
    }
```

Generated with discovered.json: 0x5fa08b3a2322e373062b7d84998ac427346b7e7b

# Diff at Wed, 06 Mar 2024 10:38:21 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@724fc93d9bd160395a856b93ce5016ca876c6436 block: 19118389
- current block number: 19375580

## Description

New proposal created and executed with the description "Unfreeze bridges".

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    +++ description: None
      values.proposalCount:
-        48
+        49
    }
```

Generated with discovered.json: 0x860ce22e6e5ca8d7087c013b808735c88781475f

# Diff at Tue, 30 Jan 2024 09:20:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8166c01da21cd9a7fadf2664669d7d2675512e02 block: 19062209
- current block number: 19118389

## Description

New proposal created with the description "Add 4 new maintainers".
The new maintainers are:

- 0x6d26b9efb640bf40cca1fb70b00b0fcec732ce00
- 0x097bdc9e913539b6aa0a79389ccc084b9502846a
- 0xa829446eec801483b32f5d5486374672aad7e028
- 0xdcc781ebeb5b6aa4648703202a34c46959302ed6

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        47
+        48
    }
```

Generated with discovered.json: 0x972c0ec8ccdd85cd61bd3520dbb2f78b1cab4165

# Diff at Mon, 22 Jan 2024 12:14:45 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@7755f153438c1f16773ba6733cfa3a8c8bc0a394 block: 18932447
- current block number: 19062209

## Description

Executed two proposalas 46 and 47.
The first one according to the description submitted by the Chainport Congress aims to: "Deploy Arbitrage, Upgrade Main and Side Bridge and add new Maintainer".
While the second one wants to: "Refund HODL tokens".

In the process the implementation of the Vault changed, since this contract is unverfied it's impossible to analyze what has really happened.

## Watched changes

```diff
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
      upgradeability.implementation:
-        "0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"
+        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
      implementations.0:
-        "0x4899eB3c7db4c3b31Ee412fBcf2cfbA60Ca5C568"
+        "0x2861F4FCADEB5Be5cA47D306D139ec97439FC35C"
    }
```

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        45
+        47
    }
```

## Source code changes

```diff
.../ethereum/{.code@18932447 => .code}/Vault6/implementation/meta.txt   | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

# Diff at Thu, 04 Jan 2024 07:22:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@45fa22227d0d99394ce6d0a25e40e8ceeca18cb3

## Description

New proposal was created and executed. It changes the fee collector address (to 0xdb07241c48eAd8b973A76B0bEb60a21F09BEC5e4) for the main Vault contract and a side contract (source code not available).

## Watched changes

```diff
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
      values.proposalCount:
-        44
+        45
    }
```

# Diff at Fri, 06 Oct 2023 09:11:10 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Multisig bridge. Don't want to spend too much time on it.

## Watched changes

```diff
+   Status: CREATED
    contract ChainportCongressMembersRegistry (0x1DeE7Be5415F6Fdcc8515cA06AE8d9aFb550aBCa) {
    }
```

```diff
+   Status: CREATED
    contract MultisigVault2 (0x450aD18B4442ce2972Af2a7A12439984db4Afaf9) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x63D572d781eD8D18d823462aa2a4D51d7Ac4F29F) {
    }
```

```diff
+   Status: CREATED
    contract Vault6 (0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a) {
    }
```

```diff
+   Status: CREATED
    contract MultisigVault1 (0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19) {
    }
```

```diff
+   Status: CREATED
    contract ChainportCongress (0xB6b4C7aC240b1f176c5589d064733066a83884a1) {
    }
```
