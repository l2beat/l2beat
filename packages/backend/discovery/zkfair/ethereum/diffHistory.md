Generated with discovered.json: 0x359bc7fe2d446b6c4d4d38c75b20987ffea69dbb

# Diff at Wed, 24 Apr 2024 15:27:14 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@6a7ceb7b00aa6aba87217de183c2311e454dcd88 block: 19532302
- current block number: 19726116

## Description

The URLs on amazon aws for all 5 DAC members are changed. Their onchain addresses remain the same.

## Watched changes

```diff
    contract DataAvailabilityCommittee (0x997CfB0838544f68E59f877EDc905001456F125b) {
    +++ description: Committee attesting that data for a given dataRoot has been published. The DAC Owner can update the member set at any time.
+++ description: URL and address of the DAC member
      values.members.4.0:
-        "http://ec2-18-163-127-148.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-54-219-14-189.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.3.0:
-        "http://ec2-18-167-116-200.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-18-144-4-166.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.2.0:
-        "http://ec2-43-198-25-156.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-52-53-165-158.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.1.0:
-        "http://ec2-18-163-181-171.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-54-153-117-150.us-west-1.compute.amazonaws.com:8444"
+++ description: URL and address of the DAC member
      values.members.0.0:
-        "http://ec2-18-166-77-46.ap-east-1.compute.amazonaws.com:8444"
+        "http://ec2-13-57-35-237.us-west-1.compute.amazonaws.com:8444"
    }
```

Generated with discovered.json: 0x2d47f405a658acbfa64515a3572659d31fdc3fae

# Diff at Thu, 28 Mar 2024 11:26:29 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@21187e63b9b90823a55c461c331868a470ce17eb block: 19167749
- current block number: 19532302

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19167749 (main branch discovery), not current.

```diff
    contract BridgeAdminMultiSig (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZkFairOwner (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

```diff
    contract ZkFairAdmin (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 4 (75%)"
    }
```

Generated with discovered.json: 0xa2429a0f47ee517399aca4dfbfda0b72c5610ea8

# Diff at Fri, 12 Jan 2024 15:03:34 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@8dedac1fc64b221baf7fd1da0dd78d78b5208ffb block: 18841455
- current block number: 18991587

## Description

DataAvailabilityCommittee contract (CDKDataCommittee) became verified, exposing
addresses of committee members. This committee attests that data for a given
dataRoot has been published. The DAC Owner can update the member set at any
time.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 18841455 (main branch discovery), not current.

```diff
    contract DataAvailabilityCommittee (0x997CfB0838544f68E59f877EDc905001456F125b) {
      unverified:
-        true
      derivedName:
-        ""
+        "CDKDataCommittee"
      values:
+        {"committeeHash":"0xba409e01b8959e09c11202ce45dd3e4ac8aa7e21440e86c1e9dc924369151fca","getAmountOfMembers":5,"members":[["http://ec2-18-166-77-46.ap-east-1.compute.amazonaws.com:8444","0x033A75B6B0fc26eDf60e99c4172eB5f87E733ca2"],["http://ec2-18-163-181-171.ap-east-1.compute.amazonaws.com:8444","0x061D273bEf947BD0ef2B828526e710eEa0f297ae"],["http://ec2-43-198-25-156.ap-east-1.compute.amazonaws.com:8444","0x9231622437bD57349cC9a15CDEc5383627DEbA17"],["http://ec2-18-167-116-200.ap-east-1.compute.amazonaws.com:8444","0x9d8616545C9941138832EebC58Cb498E0ef21a13"],["http://ec2-18-163-127-148.ap-east-1.compute.amazonaws.com:8444","0xFe1da7CAd939805d4A889822357c348177a5118d"]],"owner":"0xa57c2B747193fe3F9CC8bea89103B7d76B8A0c70","requiredAmountOfSignatures":3}
    }
```

# Diff at Thu, 21 Dec 2023 14:05:42 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@

## Description

Add initial config for ZKFair.

## Watched changes

```diff
+   Status: CREATED
    contract GnosisSafe (0x0110B1B231aA3b96a94c900eb3056297526AB725) {
    }
```

```diff
+   Status: CREATED
    contract CDKValidium (0x1CbC08bf0D48b18F9f97796c61352b192d1850A5) {
    }
```

```diff
+   Status: CREATED
    contract CDKValidiumTimelock (0x52882c7564fAca480549145fAc4d0b09eD0D9c17) {
    }
```

```diff
+   Status: CREATED
    contract  (0x6dfAF52259d494C29596F5Eb16573B105693E78f) {
    }
```

```diff
+   Status: CREATED
    contract GlobalExitRoot (0x72abD6416Ea2d99ad30C86B90e7409Dc2d1ba40b) {
    }
```

```diff
+   Status: CREATED
    contract FflonkVerifier (0x769E285d2120472c3400A09684B82A842012F46d) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x8933Fa0A97f39cd38f56b1887d5cc56cF04F3A88) {
    }
```

```diff
+   Status: CREATED
    contract  (0x997CfB0838544f68E59f877EDc905001456F125b) {
    }
```

```diff
+   Status: CREATED
    contract Bridge (0x9cb4706e20A18E59a48ffa7616d700A3891e1861) {
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xb57b9101dEc7dC1635B576fFf71F2f522C970EF3) {
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xcd14BE1959928BB8c160D11817E2BE2129e2F25F) {
    }
```
