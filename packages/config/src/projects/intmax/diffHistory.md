Generated with discovered.json: 0x14aadfac0e4a728ac261c767bb8055b2bde989e9

# Diff at Tue, 02 Sep 2025 11:43:14 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@a1c1980a59e1040a5ec42c06890371ce5f315602 block: 1755850487
- current timestamp: 1756812807

## Description

A `.transfer` has been turned into a `.call`. Nothing more.

## Watched changes

```diff
    contract Liquidity (eth:0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      sourceHashes.1:
-        "0x317092e18b9969dafe50d31933b2ce36261479b3a6832281c652af1125e002ee"
+        "0xe050f1745884847699cff3db5506410a82629972bb6fd8a52199442b01351485"
      values.$implementation:
-        "eth:0x4fd8BF5f45832a007448fcDE29049919F8cf6D0d"
+        "eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA"
      values.$pastUpgrades.2:
+        ["2025-08-30T13:25:23.000Z","0x93f7c96b159e82cd555266aa0451fb2d3a7eb8475edf83f66a15fa617de1eca0",["eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA"]]
      values.$upgradeCount:
-        2
+        3
      implementationNames.eth:0x4fd8BF5f45832a007448fcDE29049919F8cf6D0d:
-        "Liquidity"
      implementationNames.eth:0xD31F61281A4b262aEa79cbBE09A436975a8b63EA:
+        "Liquidity"
    }
```

## Source code changes

```diff
.../{.flat@1755850487 => .flat}/Liquidity/Liquidity.sol     | 13 ++++++++++++-
 1 file changed, 12 insertions(+), 1 deletion(-)
```

Generated with discovered.json: 0x887b021c9947830808a20b2b748167b198bdce18

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0xa266a51ee11a5916d9fc64bfb8635926afcc2a49

# Diff at Fri, 22 Aug 2025 08:15:58 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@3d329dea47533f39a2d068e0d1659b75a5fa8cef block: 1754909083
- current timestamp: 1755850487

## Description

- [Claim diff](https://disco.l2beat.com/diff/scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548/scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA): added a "circuit digest", needs further investigation.
- [Withdrawal diff](https://disco.l2beat.com/diff/scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3/scr:0x614ef91D1971A4dB458ABde03c62247afc57A753): also added the circuit digest. Needs further investigation.
- The two verifiers have now be replaced by a single PlonkVerifier contract, which is used by both Claim and Withdrawal contracts. Once again, needs further investigation.

## Watched changes

```diff
-   Status: DELETED
    contract WithdrawalPlonkVerifier (0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734)
    +++ description: None
```

```diff
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5) {
    +++ description: None
      sourceHashes.1:
-        "0xe45dd30cce4dd4d2fbbdcaf6165fb2e148035a2e139b6b671cee3e56c8d4f4c0"
+        "0xdf0969ba7c2284c214c510f2d058375ac28bbfc0eca15673bed761979f32647e"
      values.$implementation:
-        "scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548"
+        "scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA"
      values.$pastUpgrades.1:
+        ["2025-08-16T05:42:09.000Z","0xcb1b6cb53aeb3e3946facae2aa425a1b82068dcdeb41deeaaacae2948c3e4f3a",["scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA"]]
      values.$upgradeCount:
-        1
+        2
      values.claimVerifier:
-        "scr:0xaBA5fD516B665C12d7577Db36831474ac16aEe0a"
+        "scr:0x1d38545a33740Ab3480d9035bB3126914404423d"
      values.circuitDigest:
+        "7333968704277044365911105813294038499737090437135973260233960671933432682220"
      implementationNames.scr:0x1899bF9D0e40Dd1bB6C3CCF2123A0Bd1DE0F0548:
-        "Claim"
      implementationNames.scr:0x5216C8D0F2188a91aD07Fe4F334F220b2F7b59EA:
+        "Claim"
    }
```

```diff
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      sourceHashes.1:
-        "0x89b2cb04df88855ad4b770af6142b4e15034008b3b07a28ee1397052af0bb787"
+        "0xa0c1878c4a72a8a9f029a05bac051e29d9c4e7ee5711c74e323d1e00a8a489eb"
      values.$implementation:
-        "scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3"
+        "scr:0x614ef91D1971A4dB458ABde03c62247afc57A753"
      values.$pastUpgrades.1:
+        ["2025-08-16T05:42:09.000Z","0xcb1b6cb53aeb3e3946facae2aa425a1b82068dcdeb41deeaaacae2948c3e4f3a",["scr:0x614ef91D1971A4dB458ABde03c62247afc57A753"]]
      values.$upgradeCount:
-        1
+        2
      values.withdrawalVerifier:
-        "scr:0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734"
+        "scr:0x1d38545a33740Ab3480d9035bB3126914404423d"
      values.circuitDigest:
+        "10639849666975086414110868463771120369189468607622759510754735453420311446140"
      implementationNames.scr:0xDFC6EB6642FEAF99629c6629b2f7dC7eB9F1a0A3:
-        "Withdrawal"
      implementationNames.scr:0x614ef91D1971A4dB458ABde03c62247afc57A753:
+        "Withdrawal"
    }
```

```diff
-   Status: DELETED
    contract ClaimPlonkVerifier (0xaBA5fD516B665C12d7577Db36831474ac16aEe0a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PlonkVerifier (0x1d38545a33740Ab3480d9035bB3126914404423d)
    +++ description: A wrapper verifier that can check both withdrawal zk proofs to exit from INTMAX network and zk proofs for claiming rewards of the privacy mining program.
```

## Source code changes

```diff
.../{.flat@1754909083 => .flat}/Claim/Claim.sol    |   36 +-
 .../ClaimPlonkVerifier.sol => /dev/null            | 1840 --------------------
 .../projects/intmax/scroll/.flat/PlonkVerifier.sol | 1319 ++++++++++++++
 .../Withdrawal/Withdrawal.sol                      |   33 +-
 .../WithdrawalPlonkVerifier.sol => /dev/null       | 1840 --------------------
 5 files changed, 1371 insertions(+), 3697 deletions(-)
```

Generated with discovered.json: 0x40cdd85ceb684d62332ada750e1f11a2eac6b24b

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- chain: scroll
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

Added description to Contribution contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0x65bf705945a876349908fe3269eeadd2c58a602e

# Diff at Mon, 11 Aug 2025 10:52:35 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@32817e35c9fe0ba1a1c24a734c37d91068b1565d block: 1754378270
- current timestamp: 1754909083

## Description

config: ignore some vals in watch mode, add description for contribution contract.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754378270 (main branch discovery), not current.

```diff
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2) {
    +++ description: Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...).
      description:
+        "Records a set of 'contribution' actions by saving addresses with a tag of their action (e.g. propose blocks, claim withdrawals, deposit...)."
    }
```

Generated with discovered.json: 0xfea1029ed46c0758c6e6cb976d43a4fde0b82b81

# Diff at Tue, 05 Aug 2025 07:17:58 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378270

## Description

Added descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754295529 (main branch discovery), not current.

```diff
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e) {
    +++ description: Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract.
      description:
+        "Main rollup contract used to submit blocks and process deposits. It saves block hashes to be then referenced by the Withdrawal contract."
    }
```

```diff
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449) {
    +++ description: Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals.
      description:
+        "Contract handling withdrawal requests, which require a validity proof of sufficient balance. It tracks amount of funds already withdrawn to prevent double withdrawals."
    }
```

Generated with discovered.json: 0xd910381437ce057b4a96883cad106762af7ca351

# Diff at Tue, 05 Aug 2025 07:17:57 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@79ef116bb03dfe870ed23d81b625544ae3a617a6 block: 1754295529
- current timestamp: 1754378270

## Description

Added descriptions.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754295529 (main branch discovery), not current.

```diff
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E) {
    +++ description: Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS.
      description:
+        "Contract that connects INTMAX deposits to the Predicate AVS that ultimately checks AML requirements. It stores a policy ID to be then referenced by the Predicate AVS."
    }
```

```diff
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3) {
    +++ description: Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check.
      description:
+        "Entry point of the project. Handles deposits, withdrawals, and the communication from and to the main rollup contract on Scroll. Deposits are gated by an AML check."
    }
```

Generated with discovered.json: 0x6d973104ebb03d14919aea82bf28f2d88044c16a

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- chain: scroll
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract WithdrawalPlonkVerifier (0x1858C9e118DbBc70b15Be40BE3fc1EbB062f5734)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Rollup (0x1c88459D014e571c332BF9199aD2D35C93219A2e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Claim (0x22ac649b3229eC099C32D790e9e46FbA2CE6C9A5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x42Fe7Db60c4C70eBb7597dB9a0959F9fCa0114af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Withdrawal (0x86B06D2604D9A6f9760E8f691F86d5B2a7C9c449)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 2 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ClaimPlonkVerifier (0xaBA5fD516B665C12d7577Db36831474ac16aEe0a)
    +++ description: None
```

Generated with discovered.json: 0xbba2961125fdd21445f0710fd366f0c2125562df

# Diff at Mon, 04 Aug 2025 08:18:56 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1754295529

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract PredicatePermitter (0x11D58231A79D866674EaAa043Fdaeae9A3dF4c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    EOA  (0x38f6001e8ac11240f903CBa56aFF72A1425ae371)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Contribution (0x4c614C7BB9420caA1F19cB2C58B00864f2125Ce2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x7153803C06d6a36D6d91aEB3C1ed8e5b934Df601)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 1 (0xA3C2a579af4cF3853172058e5c76d273DC1542DD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract INTMAX Multisig 3 (0xe147e23753505e2C83b5f9ef229a9B7e7B3F50Ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquidity (0xF65e73aAc9182e353600a916a6c7681F810f79C3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PredicateServiceManager (0xf6f4A30EeF7cf51Ed4Ee1415fB3bFDAf3694B0d2)
    +++ description: None
```

