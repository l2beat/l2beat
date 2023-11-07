# Diff at Tue, 07 Nov 2023 09:54:03 GMT:

- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: master@bcbd5d376f2f1df169f0ac5ce430862eef6be17f

## Description

There are changes in the owners of Connext Multisig and WormholeHubConnector contracts.

## Watched changes

```diff
-   Status: DELETED
    contract Connext Multisig Member (0x278F956cde8D0816786A83Aea58dc7F76c13AD8e) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners[14]:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners[13]:
-        "0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
      values.getOwners[12]:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.11:
-        "0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
+        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.getOwners.10:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.getOwners.0:
-        "0x278F956cde8D0816786A83Aea58dc7F76c13AD8e"
+        "0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
    }
```

```diff
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
    }
```

## Source code changes

```diff
Error with git diff: warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Connext Multisig 2/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/Finder/Finder.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/GnosisSafe/proxy/Proxy.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code/VotingToken/VotingToken.sol', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'packages/backend/discovery/amarok/ethereum/.code@18263156/Connext Multisig Member/proxy/GnosisSafeProxy.sol', CRLF will be replaced by LF the next time Git touches it

```

# Diff at Mon, 02 Oct 2023 13:31:00 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: master@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
      values.getThreshold:
-        1
+        3
    }
```
