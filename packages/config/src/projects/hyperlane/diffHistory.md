Generated with discovered.json: 0xf2e5d73c3b0d34592298c5a16204caea96edf789

# Diff at Fri, 10 Oct 2025 09:52:09 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a91384a270a047b2514885e053feff1edc24f495 block: 1759932778
- current timestamp: 1760089860

## Description

ms change.

## Watched changes

```diff
    contract GnosisSafe (eth:0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      values.$members.4:
-        "eth:0x0fCe5cd3FB6F3b3FB7f0f707070A0A7e2442f444"
+        "eth:0x544bDcBb88F2756000De227580aaad7376f3794E"
    }
```

Generated with discovered.json: 0x6161930e4f5dd08acd24cd10d15d966faee801c0

# Diff at Wed, 08 Oct 2025 14:15:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@36fbb0e5eb9fa07c58f97370d929eaabfcd6c5ff block: 1759405968
- current timestamp: 1759932778

## Description

domainrouting upgraded.

## Watched changes

```diff
-   Status: DELETED
    contract PausableIsm (eth:0x3AeDf2e41Cf6B83b053e530Ee43Ae7467ff89EC4)
    +++ description: None
```

```diff
    contract Hyperlane Multisig (eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xff641195EF1A21784CC2346Cce932cA3192A6A78","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

```diff
    contract Mailbox (eth:0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0xc8d069e65753a4a4faDf959908305D633542F56F"
+        "eth:0xf5b0e5Dbc75982a44025253612F98fbab146D161"
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (eth:0xc8d069e65753a4a4faDf959908305D633542F56F)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract PausableIsm (eth:0x162C202229268970f06480BeeD0E8a82725a5b60)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (eth:0xf5b0e5Dbc75982a44025253612F98fbab146D161)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x162C202229268970f06480BeeD0E8a82725a5b60,eth:0xff641195EF1A21784CC2346Cce932cA3192A6A78] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (eth:0xff641195EF1A21784CC2346Cce932cA3192A6A78)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

## Source code changes

```diff
./src/projects/hyperlane/{.flat@1759405968 => .flat}/PausableIsm.sol   | 3 ++-
 .../StaticAggregationIsm_default.sol}                                  | 0
 2 files changed, 2 insertions(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759405968 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (eth:0xc8d069e65753a4a4faDf959908305D633542F56F) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x3AeDf2e41Cf6B83b053e530Ee43Ae7467ff89EC4,eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0x3AeDf2e41Cf6B83b053e530Ee43Ae7467ff89EC4","eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0xe7790f59201a65abf635cf9c10767a3c6a181124

# Diff at Thu, 02 Oct 2025 11:55:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2339b21fd06a7b8f8e031bb84af10cd0096cf422 block: 1758116721
- current timestamp: 1759405968

## Description

new domains added (also requires replacing the upstream isms because they are immutable).

## Watched changes

```diff
-   Status: DELETED
    contract PausableIsm (eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
    contract Hyperlane Multisig (eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (eth:0x9e7D21eC266Ffb43B7A7770557002002Cf52B128)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    EOA  (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259","description":"pause and unpause the ISM.","role":".owner"}]
    }
```

```diff
    contract Mailbox (eth:0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x9e7D21eC266Ffb43B7A7770557002002Cf52B128"
+        "eth:0xc8d069e65753a4a4faDf959908305D633542F56F"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract PausableIsm (eth:0x3AeDf2e41Cf6B83b053e530Ee43Ae7467ff89EC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (eth:0xc8d069e65753a4a4faDf959908305D633542F56F)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x3AeDf2e41Cf6B83b053e530Ee43Ae7467ff89EC4,eth:0x8Ab6706533d50767Deca905E1C11619cb3e1E8E9] ISM contracts successfully verify a message.
```

## Source code changes

```diff
./src/projects/hyperlane/{.flat@1758116721 => .flat}/PausableIsm.sol    | 2 +-
 .../StaticAggregationIsm.sol => .flat/StaticAggregationIsm_default.sol} | 0
 2 files changed, 1 insertion(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1758116721 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (eth:0x9e7D21eC266Ffb43B7A7770557002002Cf52B128) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259,eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259","eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0xcfc2513278b1a6c03443082e7fe282306845b4e8

# Diff at Wed, 17 Sep 2025 13:46:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@826dd36404e9c33731dc0255e96251d8d8999c20 block: 1757660887
- current timestamp: 1758116721

## Description

Multisig key rotation.

## Watched changes

```diff
    contract HyperlaneMultisig (eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      values.$members.0:
+        "eth:0x47Bbac4147c330c8FAD542d1A52f1bB97716826b"
      values.$members.1:
-        "eth:0x5dd9a0814022A61777938263308EBB336174f13D"
    }
```

Generated with discovered.json: 0xb289314fd297155555bbe71557ad5277540e26c9

# Diff at Fri, 12 Sep 2025 07:14:37 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2848a07919ddccf9d9ca1c6779dbcc184bdeb3b3 block: 1757342440
- current timestamp: 1757660887

## Description

PausableIsm: package version bump, no other changes (https://disco.l2beat.com/diff/eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17/eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259)

(other contracts were changed as a consequence of the pausableIsm upgrade)

## Watched changes

```diff
-   Status: DELETED
    contract PausableIsm (eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (eth:0x33F1A13044C7BC52DdB80dE103D2FfefEfd009DD)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Hyperlane Multisig (eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.1.from:
-        "eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f"
+        "eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902"
    }
```

```diff
    EOA  (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259","description":"pause and unpause the ISM.","role":".owner"}]
    }
```

```diff
    contract Mailbox (eth:0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x33F1A13044C7BC52DdB80dE103D2FfefEfd009DD"
+        "eth:0x9e7D21eC266Ffb43B7A7770557002002Cf52B128"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract PausableIsm (eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (eth:0x9e7D21eC266Ffb43B7A7770557002002Cf52B128)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x2D9c8c9632F5d1CAd8032F50589248B269d3b259,eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (eth:0xDf03dcB6972074F74A38bf849Ee0F95EA39dA902)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

## Source code changes

```diff
./src/projects/hyperlane/{.flat@1757342440 => .flat}/PausableIsm.sol    | 2 +-
 .../StaticAggregationIsm.sol => .flat/StaticAggregationIsm_default.sol} | 0
 2 files changed, 1 insertion(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1757342440 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (eth:0x33F1A13044C7BC52DdB80dE103D2FfefEfd009DD) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17,eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17","eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0x43a2ac8b8c37dd33647c57332c4e3f72f918651b

# Diff at Mon, 08 Sep 2025 15:40:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@48f0161c75908020b4454ff29490575d534b39f4 block: 1756805138
- current timestamp: 1757342440

## Description

single signer change in the multisigs: 0xEa83086a62617A7228ce4206FAe2ea8b0ab23513 -> 0x5450447aeE7B544c462C9352bEF7cAD049B0C2Dc
can only be decoded from the bytecode (added to disco hardcoded)

## Watched changes

```diff
-   Status: DELETED
    contract StaticAggregationIsm (eth:0x35d6a5C163310369EBb3d4917f58D6D86A77cA06)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Hyperlane Multisig (eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x7B1B5876033dde77B913ab973833623CA439B112","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract PausableIsm (eth:0x639E38eB9FBDEb1E0DfB463c680b24A31799A3b3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (eth:0x7B1B5876033dde77B913ab973833623CA439B112)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: None
```

```diff
    contract Mailbox (eth:0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x35d6a5C163310369EBb3d4917f58D6D86A77cA06"
+        "eth:0x33F1A13044C7BC52DdB80dE103D2FfefEfd009DD"
    }
```

```diff
-   Status: DELETED
    contract StaticMessageIdMultisigIsm (eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PausableIsm (eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (eth:0x17d9C293Bc6EBeDE84BB1F1de9061C2df10B622c)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract StaticMessageIdMultisigIsm (eth:0x23BB2C56F6767B4E2fD882c62097Ce91Ab3F6724)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (eth:0x33F1A13044C7BC52DdB80dE103D2FfefEfd009DD)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x0e80C192a0c6a930F8f7170bDCCE31786BB5DC17,eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (eth:0xEAa7Fa6c93D91892aaE84E11c0648B0FF3AD541f)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (eth:0xfE7990a48Eb8d74407fF258e874040738F8602EB)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [eth:0x17d9C293Bc6EBeDE84BB1F1de9061C2df10B622c,eth:0x23BB2C56F6767B4E2fD882c62097Ce91Ab3F6724] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

## Source code changes

```diff
./src/projects/hyperlane/{.flat@1756805138 => .flat}/PausableIsm.sol    | 2 +-
 .../StaticAggregationIsm_default.sol}                                   | 0
 .../StaticAggregationIsm_eclipse.sol}                                   | 0
 3 files changed, 1 insertion(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1756805138 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_eclipse"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e","eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"]
      values.threshold:
-        1
      fieldMeta.modules:
-        {"severity":"HIGH"}
    }
```

```diff
    contract StaticMerkleRootMultisigIsm (eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: None
      description:
-        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages."
      values.threshold:
-        3
      values.validators:
-        ["eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"]
      values.validatorsAndThreshold:
-        [["eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"],3]
      fieldMeta:
-        {"validators":{"severity":"HIGH"},"validatorsAndThreshold":{"description":"Validators and threshold of a random USDC message from Eclipse to Ethereum."}}
    }
```

```diff
    contract StaticMessageIdMultisigIsm (eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: None
      description:
-        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time."
      values.threshold:
-        3
      values.validators:
-        ["eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"]
      values.validatorsAndThreshold:
-        [["eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"],3]
      fieldMeta:
-        {"validators":{"severity":"HIGH"},"validatorsAndThreshold":{"description":"Validators and threshold of a random USDC message from Eclipse to Ethereum."}}
    }
```

Generated with discovered.json: 0xe9ddfb2dacbdb53e82d3a475564a64f4f4b80347

# Diff at Tue, 02 Sep 2025 09:26:56 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1144aeaf984988c003c97be3791eeda76896f8ca block: 1755858507
- current timestamp: 1756805138

## Description

ms member change.

## Watched changes

```diff
    contract GnosisSafe (eth:0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      values.$members.4:
-        "eth:0xcb3bD5d7C40844fb599c14413F281A0241C45DFB"
+        "eth:0x0fCe5cd3FB6F3b3FB7f0f707070A0A7e2442f444"
    }
```

Generated with discovered.json: 0xdd9cdfa9ecb9e74fb20f520b28c6f31e3ca21412

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xae020d75c290de5a42a693304bbc38b974899cb8

# Diff at Fri, 22 Aug 2025 10:29:06 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@327d3bb5142b362f1fe9c0439f30f84c5e1ffb30 block: 1755156535
- current timestamp: 1755858507

## Description

Change in defaultIsm, source code is exactly the same.

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0.from:
-        "eth:0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6"
+        "eth:0x7B1B5876033dde77B913ab973833623CA439B112"
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_default (0x71D66dC022a235B4976A9379a17e13449CB6b6B9)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6,eth:0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60] ISM contracts successfully verify a message.
```

```diff
-   Status: DELETED
    contract PausableIsm (0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
    EOA  (0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions:
-        [{"permission":"interact","from":"eth:0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60","description":"pause and unpause the ISM.","role":".owner"}]
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x71D66dC022a235B4976A9379a17e13449CB6b6B9"
+        "eth:0x35d6a5C163310369EBb3d4917f58D6D86A77cA06"
    }
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm (0x35d6a5C163310369EBb3d4917f58D6D86A77cA06)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract PausableIsm (0x639E38eB9FBDEb1E0DfB463c680b24A31799A3b3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x7B1B5876033dde77B913ab973833623CA439B112)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

## Source code changes

```diff
.../hyperlane/ethereum/{.flat@1755156535 => .flat}/PausableIsm.sol      | 2 +-
 .../StaticAggregationIsm_default.sol => .flat/StaticAggregationIsm.sol} | 0
 2 files changed, 1 insertion(+), 1 deletion(-)
```

Generated with discovered.json: 0x7704a76c5609e983e09456da8d5bd321fa6645d3

# Diff at Thu, 14 Aug 2025 07:32:57 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@200c2747a4a049cdea3746f37927303721bc165b block: 1753093127
- current timestamp: 1755156535

## Description

minimal diff in the PausableIsm (version change): https://disco.l2beat.com/diff/eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728/eth:0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60

two ms members switched.

## Watched changes

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      values.$members.5:
-        "eth:0x2C073004A6e4f37377F848193d6433260Ebe9b99"
+        "eth:0x97a1b7D1B6D52CACf4B6754f144fd6E404790346"
      values.$members.6:
-        "eth:0xFae231524539698f1D136d7b21E3B4144CDbF2a3"
+        "eth:0x3247FC16763c340EeFc1e60eda172ef9Db7c96B6"
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xe154Ec552E545274fe41e510950BaD7cab022755","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
    EOA  (0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions.0.from:
-        "eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728"
+        "eth:0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60"
    }
```

```diff
-   Status: DELETED
    contract PausableIsm (0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70"
+        "eth:0x71D66dC022a235B4976A9379a17e13449CB6b6B9"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0xe154Ec552E545274fe41e510950BaD7cab022755)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x71D66dC022a235B4976A9379a17e13449CB6b6B9)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x47dD9cA89efCBE8fbB2Dbb93A514B124C22856C6,eth:0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract PausableIsm (0x8047Ac910670E8596CA57Bf7F7ddB8a706079c60)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

## Source code changes

```diff
.../hyperlane/ethereum/{.flat@1753093127 => .flat}/PausableIsm.sol      | 2 +-
 .../StaticAggregationIsm.sol => .flat/StaticAggregationIsm_default.sol} | 0
 2 files changed, 1 insertion(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1753093127 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728,eth:0xe154Ec552E545274fe41e510950BaD7cab022755] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728","eth:0xe154Ec552E545274fe41e510950BaD7cab022755"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0x988777e9aaefb712999447e3dd5f34129ff25a45

# Diff at Mon, 21 Jul 2025 10:25:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c89d5207a278197d1d4bfd60ac8e37852accba7c block: 22923900
- current block number: 22966922

## Description

[PausableIsm](https://disco.l2beat.com/diff/eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33/eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728) and default [StaticAggregationIsm](https://disco.l2beat.com/diff/eth:0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1/eth:0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70) upgraded with a single line change (PACKAGE_VERSION bumped).

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x2eA653968633b1c91d35f62821fc019158B214dC)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0x2eA653968633b1c91d35f62821fc019158B214dC","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0xe154Ec552E545274fe41e510950BaD7cab022755","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    EOA  (0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions.0.from:
-        "eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33"
+        "eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1"
+        "eth:0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70"
    }
```

```diff
-   Status: DELETED
    contract PausableIsm (0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x427Af5b61CdEbf660123C1c3fA9CAa83756E1B70)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728,eth:0xe154Ec552E545274fe41e510950BaD7cab022755] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract PausableIsm (0xBa32ca8BcD3AEd8bd5d9CB93B9967580C53aD728)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0xe154Ec552E545274fe41e510950BaD7cab022755)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

## Source code changes

```diff
.../hyperlane/ethereum/{.flat@22923900 => .flat}/PausableIsm.sol        | 2 +-
 .../StaticAggregationIsm.sol => .flat/StaticAggregationIsm_default.sol} | 0
 2 files changed, 1 insertion(+), 1 deletion(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22923900 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x2eA653968633b1c91d35f62821fc019158B214dC,eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0x2eA653968633b1c91d35f62821fc019158B214dC","eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0x8a93accee15762a5dabb3200655d3b6a8076c1de

# Diff at Tue, 15 Jul 2025 10:33:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fe7c3b2343ca7836e6a947e456ab91a6f0f6f592 block: 22866629
- current block number: 22923900

## Description

New default ISM, pausableISM verified. No changes for the risks.

created templates for some more contracts.

## Watched changes

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x2eA653968633b1c91d35f62821fc019158B214dC","description":"manage the domain -> ISM contract mapping.","role":".owner"}
      receivedPermissions.1:
-        {"permission":"interact","from":"eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8","description":"manage the domain -> ISM contract mapping.","role":".owner"}
    }
```

```diff
    EOA  (0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33","description":"pause and unpause the ISM.","role":".owner"}]
    }
```

```diff
-   Status: DELETED
    contract  (0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50)
    +++ description: None
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "eth:0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
+        "eth:0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x2eA653968633b1c91d35f62821fc019158B214dC)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x69d39cd0B60d47460F30f0bD5200f9C46E924Ce1)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0x2eA653968633b1c91d35f62821fc019158B214dC,eth:0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract PausableIsm (0xcCBC73C251bCcAa5fEF457BDD404B0fb2a776B33)
    +++ description: Simple ISM that implements `verify()` and returns true if not paused, false otherwise. This allows its owner (eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) to pause any system for which this ISMs verification is needed.
```

## Source code changes

```diff
.../hyperlane/ethereum/.flat/PausableIsm.sol       | 241 +++++++++++++++++++++
 .../StaticAggregationIsm_default.sol}              |   0
 2 files changed, 241 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22866629 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50","eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"]
      values.threshold:
-        2
    }
```

```diff
    contract  (0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      template:
+        "hyperlane/Mailbox"
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract DomainRoutingIsm (0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      fieldMeta.module.description:
+        "the module that is routed to for the origin chain Eclipse."
      template:
+        "hyperlane/DomainRoutingIsm"
    }
```

Generated with discovered.json: 0xd599b0ef5edb94e58473cb8798f9d746a0d203bb

# Diff at Mon, 14 Jul 2025 12:45:11 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22866629
- current block number: 22866629

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22866629 (main branch discovery), not current.

```diff
    EOA  (0x003DDD9eEAb62013b7332Ab4CC6B10077a8ca961) {
    +++ description: None
      address:
-        "0x003DDD9eEAb62013b7332Ab4CC6B10077a8ca961"
+        "eth:0x003DDD9eEAb62013b7332Ab4CC6B10077a8ca961"
    }
```

```diff
    contract StaticAggregationIsm_default (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message.
      address:
-        "0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
+        "eth:0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message."
+        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message."
      values.modules.0:
-        "0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
+        "eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
      values.modules.1:
-        "0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+        "eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+++ description: The modules and threshold of a random bridging tx from eclipse to ethereum.
      values.modulesAndThreshold.0.1:
-        "0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+        "eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+++ description: The modules and threshold of a random bridging tx from eclipse to ethereum.
      values.modulesAndThreshold.0.0:
-        "0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
+        "eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
      implementationNames.0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e:
-        "StaticAggregationIsm"
      implementationNames.eth:0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e:
+        "StaticAggregationIsm"
    }
```

```diff
    EOA  (0x2C073004A6e4f37377F848193d6433260Ebe9b99) {
    +++ description: None
      address:
-        "0x2C073004A6e4f37377F848193d6433260Ebe9b99"
+        "eth:0x2C073004A6e4f37377F848193d6433260Ebe9b99"
    }
```

```diff
    EOA  (0x2f43Ac3cD6A22E4Ba20d3d18d116b1f9420eD84B) {
    +++ description: None
      address:
-        "0x2f43Ac3cD6A22E4Ba20d3d18d116b1f9420eD84B"
+        "eth:0x2f43Ac3cD6A22E4Ba20d3d18d116b1f9420eD84B"
    }
```

```diff
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08) {
    +++ description: None
      address:
-        "0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
+        "eth:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
      values.owner:
-        "0xCEA8039076E35a825854c5C2f85659430b06ec96"
+        "eth:0xCEA8039076E35a825854c5C2f85659430b06ec96"
      implementationNames.0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08:
-        "ProxyAdmin"
      implementationNames.eth:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc) {
    +++ description: None
      address:
-        "0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+        "eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      address:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x478be6076f31E9666123B9721D0B6631baD944AF"
+        "eth:0x478be6076f31E9666123B9721D0B6631baD944AF"
      values.$members.1:
-        "0x5dd9a0814022A61777938263308EBB336174f13D"
+        "eth:0x5dd9a0814022A61777938263308EBB336174f13D"
      values.$members.2:
-        "0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
+        "eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
      values.$members.3:
-        "0x5b73A98165778BCCE72979B4EE3faCdb31728b8E"
+        "eth:0x5b73A98165778BCCE72979B4EE3faCdb31728b8E"
      values.$members.4:
-        "0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
+        "eth:0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
      values.$members.5:
-        "0x3b7f8f68A4FD0420FeA2F42a1eFc53422f205599"
+        "eth:0x3b7f8f68A4FD0420FeA2F42a1eFc53422f205599"
      values.$members.6:
-        "0x003DDD9eEAb62013b7332Ab4CC6B10077a8ca961"
+        "eth:0x003DDD9eEAb62013b7332Ab4CC6B10077a8ca961"
      values.$members.7:
-        "0xd00d6A31485C93c597D1d8231eeeE0ed17B9844B"
+        "eth:0xd00d6A31485C93c597D1d8231eeeE0ed17B9844B"
      values.$members.8:
-        "0x483fd7284A696343FEc0819DDF2cf7E06E8A06E5"
+        "eth:0x483fd7284A696343FEc0819DDF2cf7E06E8A06E5"
      implementationNames.0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x3b548E88BA3259A6f45DEeA91449cdda5cF164b3) {
    +++ description: None
      address:
-        "0x3b548E88BA3259A6f45DEeA91449cdda5cF164b3"
+        "eth:0x3b548E88BA3259A6f45DEeA91449cdda5cF164b3"
    }
```

```diff
    EOA  (0x3b7f8f68A4FD0420FeA2F42a1eFc53422f205599) {
    +++ description: None
      address:
-        "0x3b7f8f68A4FD0420FeA2F42a1eFc53422f205599"
+        "eth:0x3b7f8f68A4FD0420FeA2F42a1eFc53422f205599"
    }
```

```diff
    EOA  (0x3d97E13A1D2bb4C9cE9EA9d424D83d3638F052ad) {
    +++ description: None
      address:
-        "0x3d97E13A1D2bb4C9cE9EA9d424D83d3638F052ad"
+        "eth:0x3d97E13A1D2bb4C9cE9EA9d424D83d3638F052ad"
    }
```

```diff
    EOA  (0x3DE2da610996eA5A72B9Af7cB8740caC48A9329f) {
    +++ description: None
      address:
-        "0x3DE2da610996eA5A72B9Af7cB8740caC48A9329f"
+        "eth:0x3DE2da610996eA5A72B9Af7cB8740caC48A9329f"
    }
```

```diff
    EOA  (0x478be6076f31E9666123B9721D0B6631baD944AF) {
    +++ description: None
      address:
-        "0x478be6076f31E9666123B9721D0B6631baD944AF"
+        "eth:0x478be6076f31E9666123B9721D0B6631baD944AF"
    }
```

```diff
    EOA  (0x483fd7284A696343FEc0819DDF2cf7E06E8A06E5) {
    +++ description: None
      address:
-        "0x483fd7284A696343FEc0819DDF2cf7E06E8A06E5"
+        "eth:0x483fd7284A696343FEc0819DDF2cf7E06E8A06E5"
    }
```

```diff
    EOA  (0x4A4e996Dd8F36Dcf46b30A7F97877da922323EEb) {
    +++ description: None
      address:
-        "0x4A4e996Dd8F36Dcf46b30A7F97877da922323EEb"
+        "eth:0x4A4e996Dd8F36Dcf46b30A7F97877da922323EEb"
    }
```

```diff
    EOA  (0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97) {
    +++ description: None
      address:
-        "0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+        "eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
    }
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      address:
-        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
+        "eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d"
+        "eth:0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d"
      values.$members.1:
-        "0x3b548E88BA3259A6f45DEeA91449cdda5cF164b3"
+        "eth:0x3b548E88BA3259A6f45DEeA91449cdda5cF164b3"
      values.$members.2:
-        "0x861FC61a961F8AFDf115B8DE274101B9ECea2F26"
+        "eth:0x861FC61a961F8AFDf115B8DE274101B9ECea2F26"
      values.$members.3:
-        "0x82950a6356316272dF1928C72F5F0A44D9673c88"
+        "eth:0x82950a6356316272dF1928C72F5F0A44D9673c88"
      values.$members.4:
-        "0x9F500DF92175b2Ac36F8d443382B219d211D354A"
+        "eth:0x9F500DF92175b2Ac36F8d443382B219d211D354A"
      values.$members.5:
-        "0x2C073004A6e4f37377F848193d6433260Ebe9b99"
+        "eth:0x2C073004A6e4f37377F848193d6433260Ebe9b99"
      values.$members.6:
-        "0xFae231524539698f1D136d7b21E3B4144CDbF2a3"
+        "eth:0xFae231524539698f1D136d7b21E3B4144CDbF2a3"
      values.$members.7:
-        "0x2f43Ac3cD6A22E4Ba20d3d18d116b1f9420eD84B"
+        "eth:0x2f43Ac3cD6A22E4Ba20d3d18d116b1f9420eD84B"
      values.$members.8:
-        "0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
+        "eth:0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
      values.$members.9:
-        "0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
+        "eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
      implementationNames.0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      address:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      values.$admin:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.$implementation:
-        "0x7A294add0Ec417E6AA99541B4A2F1c92590E846a"
+        "eth:0x7A294add0Ec417E6AA99541B4A2F1c92590E846a"
      values.$pastUpgrades.0.2.0:
-        "0x7A294add0Ec417E6AA99541B4A2F1c92590E846a"
+        "eth:0x7A294add0Ec417E6AA99541B4A2F1c92590E846a"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      values.wrappedToken:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      implementationNames.0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7A294add0Ec417E6AA99541B4A2F1c92590E846a:
-        "HypERC20Collateral"
      implementationNames.eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7A294add0Ec417E6AA99541B4A2F1c92590E846a:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0x5b73A98165778BCCE72979B4EE3faCdb31728b8E) {
    +++ description: None
      address:
-        "0x5b73A98165778BCCE72979B4EE3faCdb31728b8E"
+        "eth:0x5b73A98165778BCCE72979B4EE3faCdb31728b8E"
    }
```

```diff
    EOA  (0x5dd9a0814022A61777938263308EBB336174f13D) {
    +++ description: None
      address:
-        "0x5dd9a0814022A61777938263308EBB336174f13D"
+        "eth:0x5dd9a0814022A61777938263308EBB336174f13D"
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      address:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "eth:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      values.$admin:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.$implementation:
-        "0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7"
+        "eth:0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7"
      values.$pastUpgrades.0.2.0:
-        "0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7"
+        "eth:0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      values.wrappedToken:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      implementationNames.0x647C621CEb36853Ef6A907E397Adf18568E70543:
-        "TransparentUpgradeableProxy"
      implementationNames.0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7:
-        "HypERC20Collateral"
      implementationNames.eth:0x647C621CEb36853Ef6A907E397Adf18568E70543:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x4F2A0cC6015A33C04F6d09aDa657A03A953388e7:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0x6B1d3f8882fCA07416184D68f2906d0C3725a4aA) {
    +++ description: None
      address:
-        "0x6B1d3f8882fCA07416184D68f2906d0C3725a4aA"
+        "eth:0x6B1d3f8882fCA07416184D68f2906d0C3725a4aA"
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      address:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.owner:
-        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
+        "eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      implementationNames.0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659:
-        "ProxyAdmin"
      implementationNames.eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659:
+        "ProxyAdmin"
    }
```

```diff
    EOA  (0x7C96179df8619E49B389784ECDBBcA7090a5D08F) {
    +++ description: None
      address:
-        "0x7C96179df8619E49B389784ECDBBcA7090a5D08F"
+        "eth:0x7C96179df8619E49B389784ECDBBcA7090a5D08F"
    }
```

```diff
    EOA  (0x7f03DFC538Df4f6893D6f1AE3089eafF8924D898) {
    +++ description: None
      address:
-        "0x7f03DFC538Df4f6893D6f1AE3089eafF8924D898"
+        "eth:0x7f03DFC538Df4f6893D6f1AE3089eafF8924D898"
    }
```

```diff
    EOA  (0x82950a6356316272dF1928C72F5F0A44D9673c88) {
    +++ description: None
      address:
-        "0x82950a6356316272dF1928C72F5F0A44D9673c88"
+        "eth:0x82950a6356316272dF1928C72F5F0A44D9673c88"
    }
```

```diff
    EOA  (0x861FC61a961F8AFDf115B8DE274101B9ECea2F26) {
    +++ description: None
      address:
-        "0x861FC61a961F8AFDf115B8DE274101B9ECea2F26"
+        "eth:0x861FC61a961F8AFDf115B8DE274101B9ECea2F26"
    }
```

```diff
    EOA  (0x95A2115018b84cfe0630C16CCA277E1569a84BEf) {
    +++ description: None
      address:
-        "0x95A2115018b84cfe0630C16CCA277E1569a84BEf"
+        "eth:0x95A2115018b84cfe0630C16CCA277E1569a84BEf"
    }
```

```diff
    EOA  (0x9eaC7114D1a1EaBc4732A886795cFD9E6E35843f) {
    +++ description: None
      address:
-        "0x9eaC7114D1a1EaBc4732A886795cFD9E6E35843f"
+        "eth:0x9eaC7114D1a1EaBc4732A886795cFD9E6E35843f"
    }
```

```diff
    EOA  (0x9F500DF92175b2Ac36F8d443382B219d211D354A) {
    +++ description: None
      address:
-        "0x9F500DF92175b2Ac36F8d443382B219d211D354A"
+        "eth:0x9F500DF92175b2Ac36F8d443382B219d211D354A"
    }
```

```diff
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780) {
    +++ description: None
      address:
-        "0x9Fca159607687AE26367d66166e680A930af0780"
+        "eth:0x9Fca159607687AE26367d66166e680A930af0780"
      values.owner:
-        "0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
+        "eth:0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
      implementationNames.0x9Fca159607687AE26367d66166e680A930af0780:
-        "ProxyAdmin"
      implementationNames.eth:0x9Fca159607687AE26367d66166e680A930af0780:
+        "ProxyAdmin"
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
      address:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
+        "eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
+        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
+++ severity: HIGH
      values.modules.0:
-        "0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+++ severity: HIGH
      values.modules.1:
-        "0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+        "eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+++ description: The modules and threshold of a random bridging tx from eclipse to ethereum.
      values.modulesAndThreshold.0.1:
-        "0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+        "eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+++ description: The modules and threshold of a random bridging tx from eclipse to ethereum.
      values.modulesAndThreshold.0.0:
-        "0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
      implementationNames.0xA2d8EBB801c632517Ff35b97Dea0685abc41494c:
-        "StaticAggregationIsm"
      implementationNames.eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c:
+        "StaticAggregationIsm"
    }
```

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      address:
-        "0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
+        "eth:0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xaC011Fe273794Ab1E07538CFA8099f2599103F64"
+        "eth:0xaC011Fe273794Ab1E07538CFA8099f2599103F64"
      values.$members.1:
-        "0xe8eA8990643A0431E4B28F7F7f6878aaB88fE424"
+        "eth:0xe8eA8990643A0431E4B28F7F7f6878aaB88fE424"
      values.$members.2:
-        "0x3d97E13A1D2bb4C9cE9EA9d424D83d3638F052ad"
+        "eth:0x3d97E13A1D2bb4C9cE9EA9d424D83d3638F052ad"
      values.$members.3:
-        "0xEd700310D77BfBC3D2d962d11254861a6748cb3e"
+        "eth:0xEd700310D77BfBC3D2d962d11254861a6748cb3e"
      values.$members.4:
-        "0x7f03DFC538Df4f6893D6f1AE3089eafF8924D898"
+        "eth:0x7f03DFC538Df4f6893D6f1AE3089eafF8924D898"
      values.$members.5:
-        "0xF3385420ffaae12CF719B3D4AbB4f1122A2873F8"
+        "eth:0xF3385420ffaae12CF719B3D4AbB4f1122A2873F8"
      values.$members.6:
-        "0x6B1d3f8882fCA07416184D68f2906d0C3725a4aA"
+        "eth:0x6B1d3f8882fCA07416184D68f2906d0C3725a4aA"
      implementationNames.0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba) {
    +++ description: None
      address:
-        "0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
+        "eth:0xa7ECcdb9Be08178f896c26b7BbD8C3D4E844d9Ba"
    }
```

```diff
    EOA  (0xaC011Fe273794Ab1E07538CFA8099f2599103F64) {
    +++ description: None
      address:
-        "0xaC011Fe273794Ab1E07538CFA8099f2599103F64"
+        "eth:0xaC011Fe273794Ab1E07538CFA8099f2599103F64"
    }
```

```diff
    contract UnknownIsm (0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50) {
    +++ description: None
      address:
-        "0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
+        "eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50"
      implementationNames.0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50:
-        ""
      implementationNames.eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50:
+        ""
    }
```

```diff
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
      address:
-        "0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+        "eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896"
+++ severity: HIGH
      values.validators.0:
-        "0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+        "eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+++ severity: HIGH
      values.validators.1:
-        "0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+        "eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+++ severity: HIGH
      values.validators.2:
-        "0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+        "eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+++ severity: HIGH
      values.validators.3:
-        "0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+        "eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.3:
-        "0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+        "eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.2:
-        "0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+        "eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.1:
-        "0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+        "eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.0:
-        "0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+        "eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
      implementationNames.0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896:
-        "StaticMerkleRootMultisigIsm"
      implementationNames.eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896:
+        "StaticMerkleRootMultisigIsm"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      address:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.$admin:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.$implementation:
-        "0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455"
+        "eth:0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455"
      values.$pastUpgrades.0.2.0:
-        "0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455"
+        "eth:0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455"
      values.defaultHook:
-        "0x571f1435613381208477ac5d6974310d88AC7cB7"
+        "eth:0x571f1435613381208477ac5d6974310d88AC7cB7"
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
+        "eth:0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
      values.owner:
-        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
+        "eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      values.requiredHook:
-        "0x8B05BF30F6247a90006c5837eA63C7905D79e6d8"
+        "eth:0x8B05BF30F6247a90006c5837eA63C7905D79e6d8"
      implementationNames.0xc005dc82818d67AF737725bD4bf75435d065D239:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455:
-        "Mailbox"
      implementationNames.eth:0xc005dc82818d67AF737725bD4bf75435d065D239:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7b4D881c122a5e61adCFfb56A2e3CE9927D53455:
+        "Mailbox"
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      address:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "eth:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      values.$admin:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.$implementation:
-        "0x5ADdEB216C6dB923b4DE9449A27120da9F399021"
+        "eth:0x5ADdEB216C6dB923b4DE9449A27120da9F399021"
      values.$pastUpgrades.0.2.0:
-        "0x5ADdEB216C6dB923b4DE9449A27120da9F399021"
+        "eth:0x5ADdEB216C6dB923b4DE9449A27120da9F399021"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      values.wrappedToken:
-        "0x19e099B7aEd41FA52718D780dDA74678113C0b32"
+        "eth:0x19e099B7aEd41FA52718D780dDA74678113C0b32"
      implementationNames.0xc2495f3183F043627CAECD56dAaa726e3B2D9c09:
-        "TransparentUpgradeableProxy"
      implementationNames.0x5ADdEB216C6dB923b4DE9449A27120da9F399021:
-        "HypERC20Collateral"
      implementationNames.eth:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x5ADdEB216C6dB923b4DE9449A27120da9F399021:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA) {
    +++ description: None
      address:
-        "0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
+        "eth:0xc3E966E79eF1aA4751221F55fB8A36589C24C0cA"
    }
```

```diff
    EOA  (0xcb3bD5d7C40844fb599c14413F281A0241C45DFB) {
    +++ description: None
      address:
-        "0xcb3bD5d7C40844fb599c14413F281A0241C45DFB"
+        "eth:0xcb3bD5d7C40844fb599c14413F281A0241C45DFB"
    }
```

```diff
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      address:
-        "0xCEA8039076E35a825854c5C2f85659430b06ec96"
+        "eth:0xCEA8039076E35a825854c5C2f85659430b06ec96"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x95A2115018b84cfe0630C16CCA277E1569a84BEf"
+        "eth:0x95A2115018b84cfe0630C16CCA277E1569a84BEf"
      values.$members.1:
-        "0x4A4e996Dd8F36Dcf46b30A7F97877da922323EEb"
+        "eth:0x4A4e996Dd8F36Dcf46b30A7F97877da922323EEb"
      values.$members.2:
-        "0x3DE2da610996eA5A72B9Af7cB8740caC48A9329f"
+        "eth:0x3DE2da610996eA5A72B9Af7cB8740caC48A9329f"
      values.$members.3:
-        "0x7C96179df8619E49B389784ECDBBcA7090a5D08F"
+        "eth:0x7C96179df8619E49B389784ECDBBcA7090a5D08F"
      values.$members.4:
-        "0xcb3bD5d7C40844fb599c14413F281A0241C45DFB"
+        "eth:0xcb3bD5d7C40844fb599c14413F281A0241C45DFB"
      values.$members.5:
-        "0x9eaC7114D1a1EaBc4732A886795cFD9E6E35843f"
+        "eth:0x9eaC7114D1a1EaBc4732A886795cFD9E6E35843f"
      implementationNames.0xCEA8039076E35a825854c5C2f85659430b06ec96:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xCEA8039076E35a825854c5C2f85659430b06ec96:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xd00d6A31485C93c597D1d8231eeeE0ed17B9844B) {
    +++ description: None
      address:
-        "0xd00d6A31485C93c597D1d8231eeeE0ed17B9844B"
+        "eth:0xd00d6A31485C93c597D1d8231eeeE0ed17B9844B"
    }
```

```diff
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c) {
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
      address:
-        "0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
+        "eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
      values.$admin:
-        "0x9Fca159607687AE26367d66166e680A930af0780"
+        "eth:0x9Fca159607687AE26367d66166e680A930af0780"
      values.$implementation:
-        "0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e"
+        "eth:0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e"
      values.$pastUpgrades.0.2.0:
-        "0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e"
+        "eth:0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
+        "eth:0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e"
      values.wrappedToken:
-        "0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6"
+        "eth:0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6"
      implementationNames.0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c:
-        "TransparentUpgradeableProxy"
      implementationNames.0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e:
-        "HypERC20Collateral"
      implementationNames.eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x7e076Bff164B31c0D053Fe0C17fF3125d8deeF4e:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d) {
    +++ description: None
      address:
-        "0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d"
+        "eth:0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d"
    }
```

```diff
    contract DomainRoutingIsm (0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      address:
-        "0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+        "eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
+        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      values.$implementation:
-        "0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67"
+        "eth:0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67"
+++ severity: HIGH
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
+        "eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
+++ severity: HIGH
      values.owner:
-        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
+        "eth:0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      implementationNames.0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8:
-        "DomainRoutingIsm"
      implementationNames.0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67:
-        "DomainRoutingIsm"
      implementationNames.eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8:
+        "DomainRoutingIsm"
      implementationNames.eth:0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67:
+        "DomainRoutingIsm"
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      address:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      values.$admin:
-        "0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      values.$implementation:
-        "0xe8CC4FF9203196A90734d2C4328B83775486163C"
+        "eth:0xe8CC4FF9203196A90734d2C4328B83775486163C"
      values.$pastUpgrades.0.2.0:
-        "0xe8CC4FF9203196A90734d2C4328B83775486163C"
+        "eth:0xe8CC4FF9203196A90734d2C4328B83775486163C"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "eth:0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      values.wrappedToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xe1De9910fe71cC216490AC7FCF019e13a34481D7:
-        "TransparentUpgradeableProxy"
      implementationNames.0xe8CC4FF9203196A90734d2C4328B83775486163C:
-        "HypERC20Collateral"
      implementationNames.eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0xe8CC4FF9203196A90734d2C4328B83775486163C:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0xe8eA8990643A0431E4B28F7F7f6878aaB88fE424) {
    +++ description: None
      address:
-        "0xe8eA8990643A0431E4B28F7F7f6878aaB88fE424"
+        "eth:0xe8eA8990643A0431E4B28F7F7f6878aaB88fE424"
    }
```

```diff
    EOA  (0xEa83086a62617A7228ce4206FAe2ea8b0ab23513) {
    +++ description: None
      address:
-        "0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+        "eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
    }
```

```diff
    EOA  (0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0) {
    +++ description: None
      address:
-        "0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+        "eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
    }
```

```diff
    EOA  (0xEd700310D77BfBC3D2d962d11254861a6748cb3e) {
    +++ description: None
      address:
-        "0xEd700310D77BfBC3D2d962d11254861a6748cb3e"
+        "eth:0xEd700310D77BfBC3D2d962d11254861a6748cb3e"
    }
```

```diff
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2) {
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
      address:
-        "0xef899e92DA472E014bE795Ecce948308958E25A2"
+        "eth:0xef899e92DA472E014bE795Ecce948308958E25A2"
      values.$admin:
-        "0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
+        "eth:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
      values.$implementation:
-        "0x0371AE4960FC4Dd8ef08464080331573D386D6b4"
+        "eth:0x0371AE4960FC4Dd8ef08464080331573D386D6b4"
      values.$pastUpgrades.0.2.0:
-        "0x0371AE4960FC4Dd8ef08464080331573D386D6b4"
+        "eth:0x0371AE4960FC4Dd8ef08464080331573D386D6b4"
      values.hook:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.interchainSecurityModule:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.mailbox:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      values.owner:
-        "0xCEA8039076E35a825854c5C2f85659430b06ec96"
+        "eth:0xCEA8039076E35a825854c5C2f85659430b06ec96"
      values.wrappedToken:
-        "0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88"
+        "eth:0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88"
      implementationNames.0xef899e92DA472E014bE795Ecce948308958E25A2:
-        "TransparentUpgradeableProxy"
      implementationNames.0x0371AE4960FC4Dd8ef08464080331573D386D6b4:
-        "HypERC20Collateral"
      implementationNames.eth:0xef899e92DA472E014bE795Ecce948308958E25A2:
+        "TransparentUpgradeableProxy"
      implementationNames.eth:0x0371AE4960FC4Dd8ef08464080331573D386D6b4:
+        "HypERC20Collateral"
    }
```

```diff
    EOA  (0xF3385420ffaae12CF719B3D4AbB4f1122A2873F8) {
    +++ description: None
      address:
-        "0xF3385420ffaae12CF719B3D4AbB4f1122A2873F8"
+        "eth:0xF3385420ffaae12CF719B3D4AbB4f1122A2873F8"
    }
```

```diff
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
      address:
-        "0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+++ severity: HIGH
      values.validators.0:
-        "0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+        "eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+++ severity: HIGH
      values.validators.1:
-        "0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+        "eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+++ severity: HIGH
      values.validators.2:
-        "0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+        "eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+++ severity: HIGH
      values.validators.3:
-        "0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+        "eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.3:
-        "0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+        "eth:0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.2:
-        "0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+        "eth:0xEa83086a62617A7228ce4206FAe2ea8b0ab23513"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.1:
-        "0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+        "eth:0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97"
+++ description: Validators and threshold of a random USDC message from Eclipse to Ethereum.
      values.validatorsAndThreshold.0.0:
-        "0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
+        "eth:0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc"
      implementationNames.0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e:
-        "StaticMessageIdMultisigIsm"
      implementationNames.eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e:
+        "StaticMessageIdMultisigIsm"
    }
```

```diff
    EOA  (0xFae231524539698f1D136d7b21E3B4144CDbF2a3) {
    +++ description: None
      address:
-        "0xFae231524539698f1D136d7b21E3B4144CDbF2a3"
+        "eth:0xFae231524539698f1D136d7b21E3B4144CDbF2a3"
    }
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [eth:0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A)
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543)
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,eth:0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239)
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09)
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c)
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to eth:0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7)
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2)
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

Generated with discovered.json: 0x472d075f54cd3da26b23135e954c3c7ea7c33c67

# Diff at Mon, 07 Jul 2025 10:10:04 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e14d0e7854e89216af68a73ca3af8ff0419a05e2 block: 22823856
- current block number: 22866629

## Description

signer change.

## Watched changes

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      values.$members.6:
-        "0xe7Ad7d90639A565FE3A6F68A41AD0B095f631F39"
      values.$threshold:
-        4
+        3
      values.multisigThreshold:
-        "4 of 8 (50%)"
+        "3 of 7 (43%)"
    }
```

Generated with discovered.json: 0x19dab1e0a9ddd0bc5dd3d332a534456c68489f00

# Diff at Fri, 04 Jul 2025 12:19:03 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22823856
- current block number: 22823856

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823856 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm_default (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message.
      receivedPermissions.0.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
    }
```

```diff
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xef899e92DA472E014bE795Ecce948308958E25A2"
+        "eth:0xef899e92DA472E014bE795Ecce948308958E25A2"
    }
```

```diff
    EOA  (0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.1.from:
-        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "eth:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.2.from:
-        "ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "eth:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.3.from:
-        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
    }
```

```diff
    EOA  (0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
    }
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.1.from:
-        "ethereum:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
+        "eth:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      receivedPermissions.2.from:
-        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      receivedPermissions.3.from:
-        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "eth:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      receivedPermissions.4.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      receivedPermissions.5.from:
-        "ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "eth:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
      receivedPermissions.6.from:
-        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
+        "eth:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "eth:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "eth:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      directlyReceivedPermissions.2.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "eth:0xc005dc82818d67AF737725bD4bf75435d065D239"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "eth:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "eth:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
    }
```

```diff
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
+        "eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
    }
```

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
+        "eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x9Fca159607687AE26367d66166e680A930af0780"
+        "eth:0x9Fca159607687AE26367d66166e680A930af0780"
      receivedPermissions.1.from:
-        "ethereum:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
+        "eth:0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x9Fca159607687AE26367d66166e680A930af0780"
+        "eth:0x9Fca159607687AE26367d66166e680A930af0780"
    }
```

```diff
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xef899e92DA472E014bE795Ecce948308958E25A2"
+        "eth:0xef899e92DA472E014bE795Ecce948308958E25A2"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
+        "eth:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
      receivedPermissions.1.from:
-        "ethereum:0xef899e92DA472E014bE795Ecce948308958E25A2"
+        "eth:0xef899e92DA472E014bE795Ecce948308958E25A2"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
+        "eth:0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"
    }
```

```diff
    EOA  (0xEa83086a62617A7228ce4206FAe2ea8b0ab23513) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
    }
```

```diff
    EOA  (0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
+        "eth:0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e"
    }
```

Generated with discovered.json: 0x08a7b696c74bc58e54890b5909a70ada849891d6

# Diff at Thu, 03 Jul 2025 10:57:02 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@fa3b82adfb9dedeb2acea8fde7b79e65d59fb2b6 block: 22823856
- current block number: 22823856

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823856 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm_default (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message.
      description:
-        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
+        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50,0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8] ISM contracts successfully verify a message."
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
      description:
-        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
+        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
    }
```

Generated with discovered.json: 0xd782d212e5151fe80d1fd2e9351623fa13f689b6

# Diff at Tue, 01 Jul 2025 10:41:26 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6dae2e2c6da3c994ad2a4e3a50e7430960cb763e block: 22730993
- current block number: 22823856

## Description

1 MS signer changed, 1 removed.

## Watched changes

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      values.$members.3:
-        "0x0F753619d5CAd05C6e0cDFA5f992914Ee22E1e89"
+        "0xEd700310D77BfBC3D2d962d11254861a6748cb3e"
      values.$members.5:
-        "0x070165FA21c612FE7f1Be90Bc16D0fd11574C0cA"
      values.multisigThreshold:
-        "4 of 9 (44%)"
+        "4 of 8 (50%)"
    }
```

Generated with discovered.json: 0x6697f49c3260f746390d8e822bbf4c03fdcb0d14

# Diff at Wed, 18 Jun 2025 11:30:19 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22567365
- current block number: 22730993

## Description

New defaultISM and DomainRouting contracts without source changes (only state, new chains).

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x4085486acE416fce164f578b6e56eFC96dcf6e2E)
    +++ description: None
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09","role":"admin","via":[{"address":"ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5.from:
-        "ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.3.from:
-        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.from:
-        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "ethereum:0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8"
      receivedPermissions.1.role:
-        "admin"
+        ".owner"
      receivedPermissions.1.via:
-        [{"address":"ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.1.description:
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0xB9E1E26Cb8bBc1830Ef49b2f6A60a47e44b06E4F)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0xB9E1E26Cb8bBc1830Ef49b2f6A60a47e44b06E4F"
+        "0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e"
    }
```

```diff
-   Status: DELETED
    contract  (0xE08367b408C4E17aA517593ffff9fe291b396a69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x1AB8c76BAD3829B46b738B61cC941b22bE82C16e)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xB82118FFB9AaC2A8462B10E585c2E7d9094d2C50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0xdc210018B5ff5fdB6Fe66827EffcfdA81f879cc8)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567365 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x4085486acE416fce164f578b6e56eFC96dcf6e2E) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.6:
-        {"permission":"upgrade","from":"ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09","role":"admin","via":[{"address":"ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "ethereum:0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.4.from:
-        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.3.from:
-        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "ethereum:0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.2.from:
-        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "ethereum:0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "ethereum:0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.1.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.1.role:
-        ".owner"
+        "admin"
      receivedPermissions.1.via:
+        [{"address":"ethereum:0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.0.from:
-        "ethereum:0x4085486acE416fce164f578b6e56eFC96dcf6e2E"
+        "ethereum:0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.0.description:
-        "manage the domain -> ISM contract mapping."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract StaticAggregationIsm (0xB9E1E26Cb8bBc1830Ef49b2f6A60a47e44b06E4F) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      values.modules:
-        ["0x4085486acE416fce164f578b6e56eFC96dcf6e2E","0xE08367b408C4E17aA517593ffff9fe291b396a69"]
      values.threshold:
-        2
    }
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract  (0xE08367b408C4E17aA517593ffff9fe291b396a69) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

Generated with discovered.json: 0x0be55f4f8c30da2bc3fff50768e814bdb86cc73f

# Diff at Wed, 11 Jun 2025 10:34:57 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9d1575fea6364921032f9ded0a049bdf9fc57604 block: 22567365
- current block number: 22567365

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22567365 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x4085486acE416fce164f578b6e56eFC96dcf6e2E) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      sourceHashes.1:
+        "0x124560aaa9d0270a185fdedc92cf52b43177f3c5c5550ca5f57d4db83988bcf0"
      proxyType:
-        "immutable"
+        "EIP1167 proxy"
      values.$immutable:
-        true
      values.$implementation:
+        "0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67"
      implementationNames.0xBbaDB49B1fD1A0574C8D2B0589Cd9b8A79452e67:
+        "DomainRoutingIsm"
    }
```

Generated with discovered.json: 0xe8924b2bf737f3a4421e3ff4dd119c073e393634

# Diff at Mon, 26 May 2025 14:18:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d675d0bd208eadc685b2cb489512b83f62c0890e block: 22323047
- current block number: 22567365

## Description

New default ism, no significant changes.

## Watched changes

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.6:
+        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","role":"admin","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.3.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.2.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.1.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.1.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0x4085486acE416fce164f578b6e56eFC96dcf6e2E"
      receivedPermissions.1.role:
-        "admin"
+        ".owner"
      receivedPermissions.1.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.1.description:
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xb7d55490065c157352b2a560bb3eFf5d5c548563)
    +++ description: None
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751"
+        "0xB9E1E26Cb8bBc1830Ef49b2f6A60a47e44b06E4F"
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x4085486acE416fce164f578b6e56eFC96dcf6e2E)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xB9E1E26Cb8bBc1830Ef49b2f6A60a47e44b06E4F)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xE08367b408C4E17aA517593ffff9fe291b396a69)
    +++ description: None
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22323047 (main branch discovery), not current.

```diff
    contract Hyperlane Multisig (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "Hyperlane Multisig"
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","role":"admin","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.3.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.1.description:
-        "manage the domain -> ISM contract mapping."
      receivedPermissions.1.role:
-        ".owner"
+        "admin"
      receivedPermissions.1.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
    }
```

```diff
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract  (0xb7d55490065c157352b2a560bb3eFf5d5c548563) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract StaticAggregationIsm (0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      values.modules:
-        ["0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944","0xb7d55490065c157352b2a560bb3eFf5d5c548563"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0x8d0086506535fe3beebf9b7b59b135352b53c3a4

# Diff at Fri, 23 May 2025 09:40:57 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22323047
- current block number: 22323047

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22323047 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    EOA  (0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.3.role:
+        ".owner"
      receivedPermissions.2.role:
+        ".owner"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    contract GnosisSafe (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7) {
    +++ description: None
      receivedPermissions.6.role:
+        "admin"
      receivedPermissions.5.role:
+        "admin"
      receivedPermissions.4.role:
+        "admin"
      receivedPermissions.3.role:
+        "admin"
      receivedPermissions.2.role:
+        "admin"
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    contract StaticAggregationIsm_default (0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      receivedPermissions.0.role:
+        ".defaultIsm"
    }
```

```diff
    EOA  (0xEa83086a62617A7228ce4206FAe2ea8b0ab23513) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

```diff
    EOA  (0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0) {
    +++ description: None
      receivedPermissions.0.role:
+        ".validators"
    }
```

Generated with discovered.json: 0x2906b512f8787bfd800fa8f3ebf29cd82ee2be6c

# Diff at Tue, 29 Apr 2025 08:19:04 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22323047
- current block number: 22323047

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22323047 (main branch discovery), not current.

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","description":"manage the domain -> ISM contract mapping.","via":[]}]
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions:
-        [{"permission":"interact","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","description":"change the default ISM and hooks for this chain that are used for all connected contracts that do not override them.","via":[]},{"permission":"interact","to":"0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751","description":"verify messages for destination contracts that do not specify a custom ISM.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c) {
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e","via":[{"address":"0x9Fca159607687AE26367d66166e680A930af0780"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}]
    }
```

```diff
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2) {
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
      issuedPermissions:
-        [{"permission":"interact","to":"0xCEA8039076E35a825854c5C2f85659430b06ec96","description":"change the ISM and hooks, whitelist new routes and update destination fees.","via":[]},{"permission":"upgrade","to":"0xCEA8039076E35a825854c5C2f85659430b06ec96","via":[{"address":"0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08"}]}]
    }
```

```diff
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
      issuedPermissions:
-        [{"permission":"validateBridge2","to":"0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc","via":[]},{"permission":"validateBridge2","to":"0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97","via":[]},{"permission":"validateBridge2","to":"0xEa83086a62617A7228ce4206FAe2ea8b0ab23513","via":[]},{"permission":"validateBridge2","to":"0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0","via":[]}]
    }
```

Generated with discovered.json: 0x7aab1fcae3f6fd561d1708cb9783b33df61d4c01

# Diff at Tue, 22 Apr 2025 12:16:20 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@60b07eece04f1a17d258d39ff1adffbef4174f23 block: 22187330
- current block number: 22323047

## Description

New ISMs, no validation changes for eclipse.

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620)
    +++ description: None
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.9:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.8:
-        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.7:
-        {"permission":"upgrade","from":"0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.6:
-        {"permission":"upgrade","from":"0xc2495f3183F043627CAECD56dAaa726e3B2D9c09","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.5:
-        {"permission":"upgrade","from":"0x647C621CEb36853Ef6A907E397Adf18568E70543","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.4:
-        {"permission":"interact","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","description":"change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."}
      directlyReceivedPermissions:
-        [{"permission":"act","from":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.2.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751"
      issuedPermissions.1.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "verify messages for destination contracts that do not specify a custom ISM."
      issuedPermissions.0.to:
-        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
      issuedPermissions.0.description:
-        "verify messages for destination contracts that do not specify a custom ISM."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
+        "0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751"
      values.owner:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      issuedPermissions.1.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7"
    }
```

```diff
-   Status: DELETED
    contract  (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x562Dfaac27A84be6C96273F5c9594DA1681C0DA7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x630011A3e7Dc73fE6aA9F95C7549F0bAaaa46944)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xb7d55490065c157352b2a560bb3eFf5d5c548563)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xD56421450D656c0e9bDea3EEdb29Cee3D9c24751)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

## Source code changes

```diff
.../GnosisSafe.sol                                 |  953 ++++++++++++++
 .../GnosisSafeProxy.p.sol                          |   35 +
 .../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 5 files changed, 2595 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187330 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "manage the domain -> ISM contract mapping."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
    }
```

```diff
    contract StaticAggregationIsm (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      values.modules:
-        ["0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620","0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075"]
      values.threshold:
-        2
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract  (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

Generated with discovered.json: 0x057c152a2765cbb9ea3b3a3c754b4f7ea4685376

# Diff at Thu, 10 Apr 2025 14:42:33 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@f38a3c9bf359344e4c4cd3006f58271cb8f78d15 block: 22187330
- current block number: 22187330

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22187330 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm_default (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620,0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
    }
```

Generated with discovered.json: 0x85e36eaf7f20a51742108b0294367ffd5da6d2fb

# Diff at Thu, 03 Apr 2025 09:10:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22123446
- current block number: 22187330

## Description

core isms updated, eclipse-specific stay the same.

## Watched changes

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x0115b6ea2933C11540079E55E16A940fd9856c83)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.7.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.6.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446)
    +++ description: None
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
      issuedPermissions.1.description:
-        "verify messages for destination contracts that do not specify a custom ISM."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      issuedPermissions.0.to:
-        "0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6"
+        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
      issuedPermissions.0.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "verify messages for destination contracts that do not specify a custom ISM."
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+        "0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77"
    }
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x59f2ba715A3d4bA4beC4e7ea7988eC3c579ecE77)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x0AfaF0f0097246e0aA2a53F3d049D5E6FE75b620,0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xEE9b1fbB0453dcD55DD155438Ef8DA902C5D5075)
    +++ description: None
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22123446 (main branch discovery), not current.

```diff
    contract StaticAggregationIsm (0x0115b6ea2933C11540079E55E16A940fd9856c83) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4,0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4","0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446"]
      values.threshold:
-        2
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.3.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.2.from:
-        "0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
    contract  (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

Generated with discovered.json: 0x8c4d7d163cc32685f33e18d345152dac8c38d162

# Diff at Tue, 25 Mar 2025 11:01:18 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b4a04714c0219993c2a83e7714e82e32f8a106ba block: 21880791
- current block number: 22123446

## Description

ISMs upgraded. Security config unchanged.

## Watched changes

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.7.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.6.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.4.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.4.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.3.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4"
      receivedPermissions.2.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "manage the domain -> ISM contract mapping."
    }
```

```diff
-   Status: DELETED
    contract  (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+        "0x0115b6ea2933C11540079E55E16A940fd9856c83"
    }
```

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x0115b6ea2933C11540079E55E16A940fd9856c83)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4,0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x4b01Dd6031084f45D77096c1A4F9E933dD7864e4)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0xb73AB36eF1566A36E116ba9ccC07277eE1d7C446)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xc005dc82818d67AF737725bD4bf75435d065D239","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.8.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.7.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.3.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.2.from:
-        "0xc72f634784EA020b703E11e88582Beb5903792b9"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.2.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
    contract  (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
    contract StaticAggregationIsm (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835","0xc72f634784EA020b703E11e88582Beb5903792b9"]
      values.threshold:
-        2
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x5de36f6992b9663de49dade5b19b045b10233eb6

# Diff at Wed, 19 Mar 2025 13:04:50 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21880791
- current block number: 21880791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract undefined (0x3571223e745dC0fCbDEFa164C9B826B90c0d2DAc) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x4d4629F5bfeABe66Edc7A78da26Ef5273C266f97) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xEa83086a62617A7228ce4206FAe2ea8b0ab23513) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0xebB52D7eaa3ff7A5A6260bfe5111CE52D57401d0) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x100f5c842b2d8b6ecd6182e44058e2dbed0dca9f

# Diff at Tue, 04 Mar 2025 10:39:16 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21880791
- current block number: 21880791

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21880791 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08) {
    +++ description: None
      sinceBlock:
+        21128399
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      sinceBlock:
+        18978558
    }
```

```diff
    contract UnknownIsm (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835) {
    +++ description: None
      sinceBlock:
+        21876325
    }
```

```diff
    contract StaticAggregationIsm_default (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message.
      sinceBlock:
+        21876328
    }
```

```diff
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A) {
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21092922
    }
```

```diff
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543) {
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21092900
    }
```

```diff
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659) {
    +++ description: None
      sinceBlock:
+        16271449
    }
```

```diff
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780) {
    +++ description: None
      sinceBlock:
+        21271791
    }
```

```diff
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c) {
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
      sinceBlock:
+        20742981
    }
```

```diff
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e) {
    +++ description: None
      sinceBlock:
+        13805677
    }
```

```diff
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
      sinceBlock:
+        20742978
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      sinceBlock:
+        18422582
    }
```

```diff
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09) {
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        20785910
    }
```

```diff
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9) {
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
      sinceBlock:
+        21876321
    }
```

```diff
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96) {
    +++ description: None
      sinceBlock:
+        19459281
    }
```

```diff
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c) {
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21271799
    }
```

```diff
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7) {
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        20785718
    }
```

```diff
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2) {
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
      sinceBlock:
+        21128407
    }
```

```diff
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
      sinceBlock:
+        20742975
    }
```

Generated with discovered.json: 0x2aacb4b3b45af51ed19fddac263e2826cdab5baf

# Diff at Wed, 19 Feb 2025 13:56:30 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@90e939c93581cd5b2e00d23bb3ba08dde38932e8 block: 21816462
- current block number: 21880791

## Description

New routing ISMs deployed without affecting the watched security config (eclipse), disco config updated.

## Watched changes

```diff
-   Status: DELETED
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b)
    +++ description: None
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      receivedPermissions.10:
+        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.8.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.7.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.6.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.5.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.5.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.5.via:
-        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.5.description:
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.4.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0xc72f634784EA020b703E11e88582Beb5903792b9"
      receivedPermissions.4.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "manage the domain -> ISM contract mapping."
      severity:
+        "HIGH"
    }
```

```diff
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239) {
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
      issuedPermissions.1.to:
-        "0xd27fe5631533a193776A61B600809a73256eF9a7"
+        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
+++ description: The default ISM contract that is used for all destination contracts that do not override it.
      values.defaultIsm:
-        "0xd27fe5631533a193776A61B600809a73256eF9a7"
+        "0x57e1787fbdCCf7516721DC621CE17C45509cc2DB"
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm (0xd27fe5631533a193776A61B600809a73256eF9a7)
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0x57e1787fbdCCf7516721DC621CE17C45509cc2DB)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x3ed820384Dd2Af9b937803bdE6aE5F7a5689D835,0xc72f634784EA020b703E11e88582Beb5903792b9] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0xc72f634784EA020b703E11e88582Beb5903792b9)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

## Source code changes

```diff
.../StaticAggregationIsm_default.sol}              |    0
 .../.flat/StaticAggregationIsm_eclipse.sol         |  229 ++++
 .../ethereum/.flat/StaticMerkleRootMultisigIsm.sol | 1378 ++++++++++++++++++++
 3 files changed, 1607 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21816462 (main branch discovery), not current.

```diff
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405) {
    +++ description: None
      description:
-        "ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse."
      issuedPermissions:
-        [{"permission":"interact","to":"0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6","description":"manage the domain -> ISM contract mapping.","via":[]}]
      values.module:
-        "0xA2d8EBB801c632517Ff35b97Dea0685abc41494c"
      fieldMeta:
-        {"owner":{"severity":"HIGH"},"module":{"severity":"HIGH"}}
    }
```

```diff
    contract  (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b) {
    +++ description: None
      name:
-        "UnknownIsm"
+        ""
    }
```

```diff
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6) {
    +++ description: None
      severity:
-        "HIGH"
      receivedPermissions.10:
-        {"permission":"upgrade","from":"0xe1De9910fe71cC216490AC7FCF019e13a34481D7","via":[{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]}
      receivedPermissions.9.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.8.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.7.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.6.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.5.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.5.from:
-        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.5.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.5.via:
+        [{"address":"0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659"}]
      receivedPermissions.4.from:
-        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
+        "0xe1De9910fe71cC216490AC7FCF019e13a34481D7"
      receivedPermissions.3.from:
-        "0xc005dc82818d67AF737725bD4bf75435d065D239"
+        "0xc2495f3183F043627CAECD56dAaa726e3B2D9c09"
      receivedPermissions.3.description:
-        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
      receivedPermissions.2.from:
-        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
+        "0xc005dc82818d67AF737725bD4bf75435d065D239"
      receivedPermissions.2.description:
-        "change the ISM and hooks, whitelist new routes and update destination fees."
+        "change the default ISM and hooks for this chain that are used for all connected contracts that do not override them."
      receivedPermissions.1.from:
-        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
+        "0x647C621CEb36853Ef6A907E397Adf18568E70543"
      receivedPermissions.0.from:
-        "0x011a0D839e043D74c1073337DBf449ac47b82405"
+        "0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A"
      receivedPermissions.0.description:
-        "manage the domain -> ISM contract mapping."
+        "change the ISM and hooks, whitelist new routes and update destination fees."
    }
```

```diff
-   Status: DELETED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
-   Status: DELETED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
```

```diff
    contract StaticAggregationIsm (0xd27fe5631533a193776A61B600809a73256eF9a7) {
    +++ description: This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message.
      name:
-        "StaticAggregationIsm_default"
+        "StaticAggregationIsm"
      description:
-        "This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x011a0D839e043D74c1073337DBf449ac47b82405,0x26a3D8C5b70abb99828997b94D53d3c193A0F24b] ISM contracts successfully verify a message."
+        "This specific Interchain Security Model (ISM) contract is a simple 't of n' module that verifies that a threshold of t out of n ISM contracts successfully verified a message."
      values.modules:
-        ["0x011a0D839e043D74c1073337DBf449ac47b82405","0x26a3D8C5b70abb99828997b94D53d3c193A0F24b"]
      values.threshold:
-        2
    }
```

Generated with discovered.json: 0xe15df813d52d414c3cf9a7e9ef950c6bb747eb6e

# Diff at Mon, 10 Feb 2025 13:45:16 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2b0c549e9be2ec1627969531e2ff05c01d31a788 block: 21808054
- current block number: 21816462

## Description

Add description to explain the differences between the two multisigs that can be used.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21808054 (main branch discovery), not current.

```diff
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896) {
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages.
      description:
-        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time."
+        "An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time. In addition, this ISM also verifies the presence of the given bridge message ID in a merkle tree of bridge messages. Newer validator-signed checkpoints can thus be used to verify older messages, which prevents the validators from censoring specific bridge messages."
    }
```

Generated with discovered.json: 0xb96ca09ceb1ec8cb97c9551db7056e11394d3075

# Diff at Sun, 09 Feb 2025 14:57:27 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21808054

## Description

Initial discovery: Token bridge with lane-specific configurable security and chain-specific default security configs.

## Initial discovery

```diff
+   Status: CREATED
    contract DomainRoutingIsm (0x011a0D839e043D74c1073337DBf449ac47b82405)
    +++ description: ISM contract that delegates message verification to other ISMs based on the origin of the message. Currently routing to 0xA2d8EBB801c632517Ff35b97Dea0685abc41494c for the origin Eclipse.
```

```diff
+   Status: CREATED
    contract UnknownIsm (0x26a3D8C5b70abb99828997b94D53d3c193A0F24b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x2FFC8e94edDda8356f6b66aa035B42b20CF24A08)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HyperlaneMultisig (0x3965AC3D295641E452E0ea896a086A9cD7C6C5b6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x5B4e223DE74ef8c3218e66EEcC541003CAB3121A)
    +++ description: Escrow for WBTC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0x647C621CEb36853Ef6A907E397Adf18568E70543)
    +++ description: Escrow for USDT that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x75EE15Ee1B4A75Fa3e2fDF5DF3253c25599cc659)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9Fca159607687AE26367d66166e680A930af0780)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_eclipse (0xA2d8EBB801c632517Ff35b97Dea0685abc41494c)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 1 out of the [0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e,0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896] ISM contracts successfully verify a message. It is an example ISM currently configured for the message origin Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xA52Fd396891E7A74b641a2Cb1A6999Fcf56B077e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticMerkleRootMultisigIsm (0xbdf8DBfBe22D06ae7A3a9efFC669Ee32D0B99896)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

```diff
+   Status: CREATED
    contract Mailbox (0xc005dc82818d67AF737725bD4bf75435d065D239)
    +++ description: The Mailbox contract is deployed on each chain and is used as a central Endpoint of the Hyperlane protocol to dispatch outgoing or process incoming messages.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xc2495f3183F043627CAECD56dAaa726e3B2D9c09)
    +++ description: Escrow for tETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xCEA8039076E35a825854c5C2f85659430b06ec96)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StaticAggregationIsm_default (0xd27fe5631533a193776A61B600809a73256eF9a7)
    +++ description: This specific Interchain Security Module (ISM) contract is a simple 't of n' module that checks that a threshold of 2 out of the [0x011a0D839e043D74c1073337DBf449ac47b82405,0x26a3D8C5b70abb99828997b94D53d3c193A0F24b] ISM contracts successfully verify a message.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xd34FE1685c28A68Bb4B8fAaadCb2769962AE737c)
    +++ description: Escrow for apxETH that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xe1De9910fe71cC216490AC7FCF019e13a34481D7)
    +++ description: Escrow for USDC that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract HypERC20Collateral (0xef899e92DA472E014bE795Ecce948308958E25A2)
    +++ description: Escrow for weETHs that is bridged from Ethereum to Eclipse.
```

```diff
+   Status: CREATED
    contract StaticMessageIdMultisigIsm (0xF6419b2d603f7D00C383FE8b43E75DD6C0C1D63e)
    +++ description: An ISM contract that verifies if a threshold of 3 validators signed a message. The validator set is immutably defined at deployment time.
```

