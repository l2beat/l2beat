Generated with discovered.json: 0xf132c6937499679bdab268e9d0cb198e3b6955d6

# Diff at Fri, 09 Aug 2024 10:12:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      values.$multisigThreshold:
-        "4 of 6 (67%)"
      values.getOwners:
-        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.getThreshold:
-        4
      values.$members:
+        ["0xd08b294dBD8Bc760c57AbdEC26515Da626511B40","0xD8DbDb15e91596c50A72E77d95dbC866ebdA8238","0x284C633962F2386590E934c4fBD2D3EafA0944A3","0x042d200e5375204F022570361f3913b245488091","0x66Ed79Ee4865c1cb4574b42d467C7Fee28bB4D59","0x5b27b9279251904AaF2127463eeFf91E0037F725"]
      values.$threshold:
+        4
      values.multisigThreshold:
+        "4 of 6 (67%)"
    }
```

Generated with discovered.json: 0x8ee9736a55585664c0c57b21401881a26aacf907

# Diff at Tue, 30 Jul 2024 11:16:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20016207
- current block number: 20016207

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20016207 (main branch discovery), not current.

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
      fieldMeta:
+        {"nonce":{"severity":"MEDIUM","description":"Watch out for txs concerning the prelaunch vault and swell L2 launch"}}
    }
```

Generated with discovered.json: 0xd27154564d17a85a983339e3252fc37fe7df0563

# Diff at Tue, 04 Jun 2024 04:55:37 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@706706295a49487100a144276621ec14caf86806 block: 19873897
- current block number: 20016207

## Description

A timelock transaction is queued by the SwellMultisig to support the Lyra-associated token weETHC for staking in the swell prelaunch escrow.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        109
+        110
    }
```

Generated with discovered.json: 0x55b7dacb1f6b507abd00e02b14fa8d1fcf0d6aa8

# Diff at Wed, 15 May 2024 07:31:04 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@6f5171cf9179f1cc9ea0379d73057884dd330078 block: 19859664
- current block number: 19873897

## Description

The timelock tx explained in the update below is executed.

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin functions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        108
+        109
    }
```

Generated with discovered.json: 0xe81a0b6dc8ed608bd7b05dfef62949a59623169a

# Diff at Mon, 13 May 2024 07:41:01 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@142cacbaef1c026127ab0d88f45c576741b3a345 block: 19794895
- current block number: 19859664

## Description

A timelock transaction is queued to whitelist (`supportToken(address,(bool,bool))`) the following tokens on Wednesday, 15 May 2024 04:00:00 GMT:

- sDAI (savings dai)
- wstUSDT (stusdt.io)
- liquidUSD (Ether.fi)
- apxETH (Dinero)
- pxETH (Dinero)

## Watched changes

```diff
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90) {
    +++ description: Can queue transactions in the swell L2 prelaunch vault's timelock among other admin fucntions in the swell ecosystem
+++ description: Watch out for txs concerning the prelaunch vault and swell L2 launch
+++ severity: MEDIUM
      values.nonce:
-        107
+        108
    }
```

Generated with discovered.json: 0xaa1dd18f19c72836f6b4087c23b82a0cab0f6b45

# Diff at Sat, 04 May 2024 06:16:59 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 19794895

## Description

Initial config for the Pre-launch phase of swell. There are two main contracts:
- Zap: Non-escrowing entry contract that wraps ETH, eETH or stETH and deposits them into the Vault. It is immutable and has no owner functions.
- SwellL2PrelaunchVault: Escrow that can hold predefined ERC-20s and nothing more. It is immutable and owner functions (`rescueERC20()`) are currently proxied with a 2d timelock in front of the SwellMultisig.


## Initial discovery

```diff
+   Status: CREATED
    contract SwellMultisig (0x20fDF47509C5eFC0e1101e3CE443691781C17F90)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SwellL2PrelaunchVault (0x38D43a6Cb8DA0E855A42fB6b0733A0498531d774)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Zap (0xBD9fc4FdB07e46a69349101E862e82aa002aDe0d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCa2DF225ba3c4743E02611EC423FaAC311dEEEd4)
    +++ description: None
```
