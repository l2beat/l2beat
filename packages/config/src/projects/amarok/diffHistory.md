Generated with discovered.json: 0xec6af707c5b17cd06908f39d6d0439b3e804360d

# Diff at Fri, 05 Sep 2025 09:16:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6cd15987e9ebf76a374fdd067e5e25baf948c56c block: 1756736025
- current timestamp: 1757063689

## Description

bridge paused.

## Watched changes

```diff
    contract ConnextBridge (eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      values.paused:
-        false
+        true
    }
```

Generated with discovered.json: 0xd9168a80258b5f1dc39aa2d985c86f47b4ce9259

# Diff at Mon, 01 Sep 2025 14:18:15 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7eff8455e0ad9da942f60c025235f897aa05b120 block: 1754307650
- current timestamp: 1756736025

## Description

All tokens are removed from the whitelist except for WETH, ABT and USDC. (uma related)

## Watched changes

```diff
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7) {
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
      values.getWhitelist.0:
-        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.getWhitelist.2:
-        "eth:0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
      values.getWhitelist.3:
-        "eth:0xeca82185adCE47f39c684352B0439f030f860318"
      values.getWhitelist.4:
-        "eth:0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0"
      values.getWhitelist.6:
-        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.getWhitelist.7:
-        "eth:0x758A43EE2BFf8230eeb784879CdcFF4828F2544D"
      values.getWhitelist.8:
-        "eth:0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3"
      values.getWhitelist.9:
-        "eth:0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28"
      values.getWhitelist.10:
-        "eth:0x3832d2F059E55934220881F831bE501D180671A7"
      values.getWhitelist.11:
-        "eth:0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
      values.getWhitelist.12:
-        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      values.getWhitelist.13:
-        "eth:0x0AaCfbeC6a24756c20D41914F2caba817C0d8521"
      values.getWhitelist.14:
-        "eth:0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
      values.getWhitelist.15:
-        "eth:0x514910771AF9Ca656af840dff83E8264EcF986CA"
      values.getWhitelist.16:
-        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      values.getWhitelist.17:
-        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      values.getWhitelist.18:
-        "eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      values.getWhitelist.19:
-        "eth:0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
      values.getWhitelist.20:
-        "eth:0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
      values.getWhitelist.21:
-        "eth:0xd3d2E2692501A5c9Ca623199D38826e513033a17"
      values.getWhitelist.22:
-        "eth:0x88D97d199b9ED37C29D846d00D443De980832a22"
      values.getWhitelist.23:
-        "eth:0xa117000000f279D81A1D3cc75430fAA017FA5A2e"
      values.getWhitelist.24:
-        "eth:0x0954906da0Bf32d5479e25f46056d22f08464cab"
      values.getWhitelist.25:
-        "eth:0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b"
      values.getWhitelist.26:
-        "eth:0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
      values.getWhitelist.27:
-        "eth:0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272"
      values.getWhitelist.28:
-        "eth:0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
      values.getWhitelist.29:
-        "eth:0xba100000625a3754423978a60c9317c58a424e3D"
      values.getWhitelist.30:
-        "eth:0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a"
      values.getWhitelist.31:
-        "eth:0x0000000000095413afC295d19EDeb1Ad7B71c952"
      values.getWhitelist.32:
-        "eth:0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074"
      values.getWhitelist.33:
-        "eth:0x24A6A37576377F63f194Caa5F518a60f45b42921"
      values.getWhitelist.34:
-        "eth:0xb753428af26E81097e7fD17f40c88aaA3E04902c"
      values.getWhitelist.35:
-        "eth:0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
      values.getWhitelist.36:
-        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      values.getWhitelist.37:
-        "eth:0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"
      values.getWhitelist.38:
-        "eth:0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a"
      values.getWhitelist.39:
-        "eth:0x0391D2021f89DC339F60Fff84546EA23E337750f"
      values.getWhitelist.40:
-        "eth:0x69BbE2FA02b4D90A944fF328663667DC32786385"
      values.getWhitelist.41:
-        "eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
      values.getWhitelist.42:
-        "eth:0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
      values.getWhitelist.43:
-        "eth:0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9"
      values.getWhitelist.44:
-        "eth:0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
      values.getWhitelist.45:
-        "eth:0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      values.getWhitelist.46:
-        "eth:0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
      values.getWhitelist.47:
-        "eth:0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
      values.getWhitelist.48:
-        "eth:0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F"
      values.getWhitelist.49:
-        "eth:0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
      values.getWhitelist.50:
-        "eth:0x2ba592F78dB6436527729929AAf6c908497cB200"
      values.getWhitelist.51:
-        "eth:0xC4C2614E694cF534D407Ee49F8E44D125E4681c4"
      values.getWhitelist.52:
-        "eth:0xBBc2AE13b23d715c30720F079fcd9B4a74093505"
      values.getWhitelist.53:
-        "eth:0x69e8b9528CABDA89fe846C67675B5D73d463a916"
      values.getWhitelist.54:
-        "eth:0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"
      values.getWhitelist.55:
-        "eth:0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919"
      values.getWhitelist.56:
-        "eth:0xc00e94Cb662C3520282E6f5717214004A7f26888"
      values.getWhitelist.57:
-        "eth:0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
      values.getWhitelist.58:
-        "eth:0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
      values.getWhitelist.59:
-        "eth:0xa1faa113cbE53436Df28FF0aEe54275c13B40975"
      values.getWhitelist.60:
-        "eth:0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
      values.getWhitelist.61:
-        "eth:0x408e41876cCCDC0F92210600ef50372656052a38"
      values.getWhitelist.62:
-        "eth:0xD533a949740bb3306d119CC777fa900bA034cd52"
      values.getWhitelist.63:
-        "eth:0xD291E7a03283640FDc51b121aC401383A46cC623"
      values.getWhitelist.64:
-        "eth:0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
      values.getWhitelist.65:
-        "eth:0x888888435FDe8e7d4c54cAb67f206e4199454c60"
      values.getWhitelist.66:
-        "eth:0x44564d0bd94343f72E3C8a0D22308B7Fa71DB0Bb"
      values.getWhitelist.67:
-        "eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d"
      values.getWhitelist.68:
-        "eth:0x383518188C0C6d7730D91b2c03a03C837814a899"
      values.getWhitelist.69:
-        "eth:0x875773784Af8135eA0ef43b5a374AaD105c5D39e"
      values.getWhitelist.70:
-        "eth:0x6810e776880C02933D47DB1b9fc05908e5386b96"
      values.getWhitelist.71:
-        "eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
      values.getWhitelist.72:
-        "eth:0xad32A8e6220741182940c5aBF610bDE99E737b2D"
      values.getWhitelist.73:
-        "eth:0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
      values.getWhitelist.74:
-        "eth:0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
      values.getWhitelist.75:
-        "eth:0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d"
      values.getWhitelist.76:
-        "eth:0xbEa98c05eEAe2f3bC8c3565Db7551Eb738c8CCAb"
      values.getWhitelist.77:
-        "eth:0x8888801aF4d980682e47f1A9036e589479e835C5"
      values.getWhitelist.78:
-        "eth:0x4104b135DBC9609Fc1A9490E61369036497660c8"
      values.getWhitelist.79:
-        "eth:0xfe9A29aB92522D14Fc65880d817214261D8479AE"
      values.getWhitelist.80:
-        "eth:0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83"
      values.getWhitelist.81:
-        "eth:0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
      values.getWhitelist.82:
-        "eth:0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198"
      values.getWhitelist.83:
-        "eth:0x7815bDa662050D84718B988735218CFfd32f75ea"
      values.getWhitelist.84:
-        "eth:0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
      values.getWhitelist.85:
-        "eth:0x5166E09628b696285E3A151e84FB977736a83575"
      values.getWhitelist.86:
-        "eth:0xB0e1fc65C1a741b4662B813eB787d369b8614Af1"
      values.getWhitelist.87:
-        "eth:0xbC396689893D065F41bc2C6EcbeE5e0085233447"
      values.getWhitelist.88:
-        "eth:0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7"
      values.getWhitelist.89:
-        "eth:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.getWhitelist.90:
-        "eth:0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb"
      values.getWhitelist.91:
-        "eth:0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      values.getWhitelist.92:
-        "eth:0xD34a24006b862f4E9936c506691539D6433aD297"
      values.getWhitelist.93:
-        "eth:0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
      values.getWhitelist.94:
-        "eth:0xbA8A621b4a54e61C442F5Ec623687e2a942225ef"
      values.getWhitelist.95:
-        "eth:0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F"
      values.getWhitelist.96:
-        "eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
      values.getWhitelist.97:
-        "eth:0xef5Fa9f3Dede72Ec306dfFf1A7eA0bB0A2F7046F"
      values.getWhitelist.98:
-        "eth:0xaa61D5dec73971CD4a026ef2820bB87b4a4Ed8d6"
      values.getWhitelist.99:
-        "eth:0x752Efadc0a7E05ad1BCCcDA22c141D01a75EF1e4"
      values.getWhitelist.100:
-        "eth:0xEd1480d12bE41d92F36f5f7bDd88212E381A3677"
      values.getWhitelist.101:
-        "eth:0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5"
      values.getWhitelist.102:
-        "eth:0xDC59ac4FeFa32293A95889Dc396682858d52e5Db"
      values.getWhitelist.103:
-        "eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
      values.getWhitelist.104:
-        "eth:0xa5f2211B9b8170F694421f2046281775E8468044"
      values.getWhitelist.105:
-        "eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
    }
```

```diff
    contract GnosisSafe (eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      values.$members.2:
-        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.4:
-        "eth:0x5aA748326f03C651749E7998D88647e59Ee386Bc"
      values.$members.11:
-        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$threshold:
-        5
+        4
      values.multisigThreshold:
-        "5 of 12 (42%)"
+        "4 of 9 (44%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1754307650 (main branch discovery), not current.

```diff
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7) {
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
      description:
-        "Implements a simple address whitelist for tokens that can be used as bonds and fees."
+        "A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem."
    }
```

Generated with discovered.json: 0xb10c3df567be8ce0ca7928f84a025bc8d116396a

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x2fca46acc01ecf69f18ab1f162dd8109267e6f7b

# Diff at Mon, 04 Aug 2025 11:41:00 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f7cc919a780045cf2b13d42712da413a3bff12b3 block: 1751365883
- current timestamp: 1754307650

## Description

One EOA has delegated to the Metamask 7702 delegator.

## Watched changes

```diff
    EOA  (0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0xd917081b48992d80de39a3221072d3c1b453c5b6063c39322280b45abc776792","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0x28696ab8867e779d43221f51a7ff16613520d8b5

# Diff at Mon, 14 Jul 2025 12:44:43 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22823809
- current block number: 22823809

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823809 (main branch discovery), not current.

```diff
    EOA  (0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e) {
    +++ description: None
      address:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
    }
```

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      address:
-        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
+        "eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
      values.AMB:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.home:
-        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
+        "eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
      values.MERKLE:
-        "0x28A9e7bbed277092E2431F186E1aF898962d4E92"
+        "eth:0x28A9e7bbed277092E2431F186E1aF898962d4E92"
      values.mirrorConnector:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      values.watcherManager:
-        "0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
+        "eth:0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
      implementationNames.0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc:
-        "MainnetSpokeConnector"
      implementationNames.eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc:
+        "MainnetSpokeConnector"
    }
```

```diff
    EOA  (0x048a5EcC705C280b2248aefF88fd581AbbEB8587) {
    +++ description: None
      address:
-        "0x048a5EcC705C280b2248aefF88fd581AbbEB8587"
+        "eth:0x048a5EcC705C280b2248aefF88fd581AbbEB8587"
    }
```

```diff
    EOA Relayer2 (0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2) {
    +++ description: None
      address:
-        "0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2"
+        "eth:0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2"
    }
```

```diff
    EOA  (0x0e62f9fa1F9b3E49759Dc94494F5bC37a83d1FAD) {
    +++ description: None
      address:
-        "0x0e62f9fa1F9b3E49759Dc94494F5bC37a83d1FAD"
+        "eth:0x0e62f9fa1F9b3E49759Dc94494F5bC37a83d1FAD"
    }
```

```diff
    EOA  (0x151Ea574C62b505aEe2F89f33D8c152E28A956b0) {
    +++ description: None
      address:
-        "0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
+        "eth:0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
    }
```

```diff
    EOA  (0x1660846ee9A3023034924FB02F85F632AEd66810) {
    +++ description: None
      address:
-        "0x1660846ee9A3023034924FB02F85F632AEd66810"
+        "eth:0x1660846ee9A3023034924FB02F85F632AEd66810"
    }
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 3d. The rules for proposals can be read directly from the contract values.
      address:
-        "0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
+        "eth:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
      values.avatar:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.collateral:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.escalationManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.getGuard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.guard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.optimisticOracleV3:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.target:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ZodiacModule_avatar:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ZodiacModule_guard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.ZodiacModule_target:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      implementationNames.0x172fB6b07D6aB708dd67392a09e1c40d16dA0460:
-        "OptimisticGovernor"
      implementationNames.eth:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460:
+        "OptimisticGovernor"
    }
```

```diff
    EOA  (0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05) {
    +++ description: None
      address:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
    }
```

```diff
    EOA  (0x22831e4f21cE65b33EF45df0e212b5bEbF130E5a) {
    +++ description: None
      address:
-        "0x22831e4f21cE65b33EF45df0e212b5bEbF130E5a"
+        "eth:0x22831e4f21cE65b33EF45df0e212b5bEbF130E5a"
    }
```

```diff
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    +++ description: None
      address:
-        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
+        "eth:0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
      values.AMB:
-        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
+        "eth:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
      values.mirrorConnector:
-        "0x26aC458398aE1D58B7cE254c27eeA6ad850054a1"
+        "eth:0x26aC458398aE1D58B7cE254c27eeA6ad850054a1"
      values.OPTIMISM_PORTAL:
-        "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
+        "eth:0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x23b7abe4cc664F24Eb68E80cFAdc572857799a94:
-        "OptimismHubConnector"
      implementationNames.eth:0x23b7abe4cc664F24Eb68E80cFAdc572857799a94:
+        "OptimismHubConnector"
    }
```

```diff
    contract xLayerZkHubConnector (0x279fDA9AdDB854541f0bb86733d924e28c24c625) {
    +++ description: None
      address:
-        "0x279fDA9AdDB854541f0bb86733d924e28c24c625"
+        "eth:0x279fDA9AdDB854541f0bb86733d924e28c24c625"
      values.AMB:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.mirrorConnector:
-        "0xcF627F20CdCECd11AF54143B81B4C7ae1e8D6ea1"
+        "eth:0xcF627F20CdCECd11AF54143B81B4C7ae1e8D6ea1"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x279fDA9AdDB854541f0bb86733d924e28c24c625:
-        "PolygonZkHubConnector"
      implementationNames.eth:0x279fDA9AdDB854541f0bb86733d924e28c24c625:
+        "PolygonZkHubConnector"
    }
```

```diff
    contract UpgradeBeaconProxy (0x28A9e7bbed277092E2431F186E1aF898962d4E92) {
    +++ description: None
      address:
-        "0x28A9e7bbed277092E2431F186E1aF898962d4E92"
+        "eth:0x28A9e7bbed277092E2431F186E1aF898962d4E92"
      implementationNames.0x28A9e7bbed277092E2431F186E1aF898962d4E92:
-        "UpgradeBeaconProxy"
      implementationNames.eth:0x28A9e7bbed277092E2431F186E1aF898962d4E92:
+        "UpgradeBeaconProxy"
    }
```

```diff
    EOA  (0x2bAaA41d155ad8a4126184950B31F50A1513cE25) {
    +++ description: None
      address:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    EOA  (0x2eEd1440842990Fa61F0c396f981375Fa6004131) {
    +++ description: None
      address:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "eth:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
    }
```

```diff
    EOA  (0x32D63da9F776891843C90787CEC54ADA23ABd4C2) {
    +++ description: None
      address:
-        "0x32D63da9F776891843C90787CEC54ADA23ABd4C2"
+        "eth:0x32D63da9F776891843C90787CEC54ADA23ABd4C2"
    }
```

```diff
    EOA  (0x334CE923420ff1aA4f272e92BF68013D092aE7B4) {
    +++ description: None
      address:
-        "0x334CE923420ff1aA4f272e92BF68013D092aE7B4"
+        "eth:0x334CE923420ff1aA4f272e92BF68013D092aE7B4"
    }
```

```diff
    EOA  (0x33b2aD85f7DbA818e719FB52095dC768E0eD93ec) {
    +++ description: None
      address:
-        "0x33b2aD85f7DbA818e719FB52095dC768E0eD93ec"
+        "eth:0x33b2aD85f7DbA818e719FB52095dC768E0eD93ec"
    }
```

```diff
    EOA  (0x349f3839012DB2271e1BeC68F1668471D175Adb9) {
    +++ description: None
      address:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
    }
```

```diff
    EOA  (0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5) {
    +++ description: None
      address:
-        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
+        "eth:0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    EOA  (0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e) {
    +++ description: None
      address:
-        "0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
+        "eth:0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
    }
```

```diff
    EOA  (0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06) {
    +++ description: None
      address:
-        "0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06"
+        "eth:0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06"
    }
```

```diff
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      address:
-        "0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      values.getAllRegisteredContracts.0:
-        "0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
+        "eth:0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
      values.getAllRegisteredContracts.1:
-        "0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
+        "eth:0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
      values.getAllRegisteredContracts.2:
-        "0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
+        "eth:0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
      values.getAllRegisteredContracts.3:
-        "0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
+        "eth:0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
      values.getAllRegisteredContracts.4:
-        "0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
+        "eth:0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
      values.getAllRegisteredContracts.5:
-        "0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
+        "eth:0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
      values.getAllRegisteredContracts.6:
-        "0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
+        "eth:0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
      values.getAllRegisteredContracts.7:
-        "0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
+        "eth:0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
      values.getAllRegisteredContracts.8:
-        "0xaBBee9fC7a882499162323EEB7BF6614193312e3"
+        "eth:0xaBBee9fC7a882499162323EEB7BF6614193312e3"
      values.getAllRegisteredContracts.9:
-        "0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
+        "eth:0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
      values.getAllRegisteredContracts.10:
-        "0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
+        "eth:0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
      values.getAllRegisteredContracts.11:
-        "0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
+        "eth:0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
      values.getAllRegisteredContracts.12:
-        "0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
+        "eth:0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
      values.getAllRegisteredContracts.13:
-        "0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
+        "eth:0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
      values.getAllRegisteredContracts.14:
-        "0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
+        "eth:0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
      values.getAllRegisteredContracts.15:
-        "0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
+        "eth:0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
      values.getAllRegisteredContracts.16:
-        "0xf32219331A03D99C98Adf96D43cc312353003531"
+        "eth:0xf32219331A03D99C98Adf96D43cc312353003531"
      values.getAllRegisteredContracts.17:
-        "0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
+        "eth:0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
      values.getAllRegisteredContracts.18:
-        "0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
+        "eth:0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
      values.getAllRegisteredContracts.19:
-        "0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
+        "eth:0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
      values.getAllRegisteredContracts.20:
-        "0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
+        "eth:0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
      values.getAllRegisteredContracts.21:
-        "0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
+        "eth:0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
      values.getAllRegisteredContracts.22:
-        "0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
+        "eth:0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
      values.getAllRegisteredContracts.23:
-        "0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
+        "eth:0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
      values.getAllRegisteredContracts.24:
-        "0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
+        "eth:0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
      values.getAllRegisteredContracts.25:
-        "0xa1005DB6516A097E562ad7506CF90ebb511f5604"
+        "eth:0xa1005DB6516A097E562ad7506CF90ebb511f5604"
      values.getAllRegisteredContracts.26:
-        "0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
+        "eth:0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
      values.getAllRegisteredContracts.27:
-        "0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
+        "eth:0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
      values.getAllRegisteredContracts.28:
-        "0xda0943251079eB9f517668fdB372fC6AE299D898"
+        "eth:0xda0943251079eB9f517668fdB372fC6AE299D898"
      values.getAllRegisteredContracts.29:
-        "0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
+        "eth:0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
      values.getAllRegisteredContracts.30:
-        "0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
+        "eth:0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
      values.getAllRegisteredContracts.31:
-        "0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
+        "eth:0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
      values.getAllRegisteredContracts.32:
-        "0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
+        "eth:0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
      values.getAllRegisteredContracts.33:
-        "0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
+        "eth:0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
      values.getAllRegisteredContracts.34:
-        "0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
+        "eth:0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
      values.getAllRegisteredContracts.35:
-        "0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
+        "eth:0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
      values.getAllRegisteredContracts.36:
-        "0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
+        "eth:0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
      values.getAllRegisteredContracts.37:
-        "0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
+        "eth:0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
      values.getAllRegisteredContracts.38:
-        "0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
+        "eth:0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
      values.getAllRegisteredContracts.39:
-        "0x182d5993106573A95a182AB3A77c892713fFDA56"
+        "eth:0x182d5993106573A95a182AB3A77c892713fFDA56"
      values.getAllRegisteredContracts.40:
-        "0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
+        "eth:0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
      values.getAllRegisteredContracts.41:
-        "0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
+        "eth:0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
      values.getAllRegisteredContracts.42:
-        "0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
+        "eth:0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
      values.getAllRegisteredContracts.43:
-        "0x287a1bA52e030459F163f48b2Ae468a085003A07"
+        "eth:0x287a1bA52e030459F163f48b2Ae468a085003A07"
      values.getAllRegisteredContracts.44:
-        "0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
+        "eth:0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
      values.getAllRegisteredContracts.45:
-        "0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
+        "eth:0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
      values.getAllRegisteredContracts.46:
-        "0xb33E3b8f5a172776730B0945206D6f75a2491307"
+        "eth:0xb33E3b8f5a172776730B0945206D6f75a2491307"
      values.getAllRegisteredContracts.47:
-        "0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
+        "eth:0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
      values.getAllRegisteredContracts.48:
-        "0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
+        "eth:0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
      values.getAllRegisteredContracts.49:
-        "0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
+        "eth:0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
      values.getAllRegisteredContracts.50:
-        "0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
+        "eth:0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
      values.getAllRegisteredContracts.51:
-        "0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
+        "eth:0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
      values.getAllRegisteredContracts.52:
-        "0x384e239a2B225865558774b005C3d6eC29f8cE70"
+        "eth:0x384e239a2B225865558774b005C3d6eC29f8cE70"
      values.getAllRegisteredContracts.53:
-        "0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
+        "eth:0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
      values.getAllRegisteredContracts.54:
-        "0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
+        "eth:0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
      values.getAllRegisteredContracts.55:
-        "0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
+        "eth:0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
      values.getAllRegisteredContracts.56:
-        "0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
+        "eth:0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
      values.getAllRegisteredContracts.57:
-        "0x0388f65C185a7E7D857BB142185381d97a4bc747"
+        "eth:0x0388f65C185a7E7D857BB142185381d97a4bc747"
      values.getAllRegisteredContracts.58:
-        "0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
+        "eth:0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
      values.getAllRegisteredContracts.59:
-        "0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
+        "eth:0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
      values.getAllRegisteredContracts.60:
-        "0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
+        "eth:0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
      values.getAllRegisteredContracts.61:
-        "0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
+        "eth:0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
      values.getAllRegisteredContracts.62:
-        "0xd60139B287De1408f8388f5f57fC114Fb4B03328"
+        "eth:0xd60139B287De1408f8388f5f57fC114Fb4B03328"
      values.getAllRegisteredContracts.63:
-        "0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
+        "eth:0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
      values.getAllRegisteredContracts.64:
-        "0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
+        "eth:0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
      values.getAllRegisteredContracts.65:
-        "0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
+        "eth:0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
      values.getAllRegisteredContracts.66:
-        "0x6DA66C15823cFf681DaD6963fBD325a520362958"
+        "eth:0x6DA66C15823cFf681DaD6963fBD325a520362958"
      values.getAllRegisteredContracts.67:
-        "0xb82756f9853A148A2390a08AaD30BabCDc22f068"
+        "eth:0xb82756f9853A148A2390a08AaD30BabCDc22f068"
      values.getAllRegisteredContracts.68:
-        "0xdF68acF496Db55f4A882a0371c489D739173fbEc"
+        "eth:0xdF68acF496Db55f4A882a0371c489D739173fbEc"
      values.getAllRegisteredContracts.69:
-        "0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
+        "eth:0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
      values.getAllRegisteredContracts.70:
-        "0x45788a369f3083c02b942aEa02DBa25C466a773F"
+        "eth:0x45788a369f3083c02b942aEa02DBa25C466a773F"
      values.getAllRegisteredContracts.71:
-        "0x52f83ACA94904b3590669E3525d25ec75cDFf798"
+        "eth:0x52f83ACA94904b3590669E3525d25ec75cDFf798"
      values.getAllRegisteredContracts.72:
-        "0xfDF90C4104c1dE34979235e6AE080528266a14a3"
+        "eth:0xfDF90C4104c1dE34979235e6AE080528266a14a3"
      values.getAllRegisteredContracts.73:
-        "0xb40BA94747c59d076B3c189E3A031547492013da"
+        "eth:0xb40BA94747c59d076B3c189E3A031547492013da"
      values.getAllRegisteredContracts.74:
-        "0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
+        "eth:0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
      values.getAllRegisteredContracts.75:
-        "0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
+        "eth:0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
      values.getAllRegisteredContracts.76:
-        "0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
+        "eth:0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
      values.getAllRegisteredContracts.77:
-        "0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
+        "eth:0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
      values.getAllRegisteredContracts.78:
-        "0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
+        "eth:0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
      values.getAllRegisteredContracts.79:
-        "0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
+        "eth:0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
      values.getAllRegisteredContracts.80:
-        "0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
+        "eth:0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
      values.getAllRegisteredContracts.81:
-        "0xCef85b352CCD7a446d94AEeeA02dD11622289954"
+        "eth:0xCef85b352CCD7a446d94AEeeA02dD11622289954"
      values.getAllRegisteredContracts.82:
-        "0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
+        "eth:0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
      values.getAllRegisteredContracts.83:
-        "0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
+        "eth:0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
      values.getAllRegisteredContracts.84:
-        "0x10E018C01792705BefB7A757628C2947E38B9426"
+        "eth:0x10E018C01792705BefB7A757628C2947E38B9426"
      values.getAllRegisteredContracts.85:
-        "0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
+        "eth:0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
      values.getAllRegisteredContracts.86:
-        "0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
+        "eth:0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
      values.getAllRegisteredContracts.87:
-        "0x0759883acF042A54fAb083378b0395F773A79767"
+        "eth:0x0759883acF042A54fAb083378b0395F773A79767"
      values.getAllRegisteredContracts.88:
-        "0x32F0405834C4b50be53199628C45603Cea3A28aA"
+        "eth:0x32F0405834C4b50be53199628C45603Cea3A28aA"
      values.getAllRegisteredContracts.89:
-        "0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
+        "eth:0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
      values.getAllRegisteredContracts.90:
-        "0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
+        "eth:0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
      values.getAllRegisteredContracts.91:
-        "0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
+        "eth:0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
      values.getAllRegisteredContracts.92:
-        "0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
+        "eth:0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
      values.getAllRegisteredContracts.93:
-        "0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
+        "eth:0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
      values.getAllRegisteredContracts.94:
-        "0x7FBE19088B011A9dE0e3a327D7C681028F065616"
+        "eth:0x7FBE19088B011A9dE0e3a327D7C681028F065616"
      values.getAllRegisteredContracts.95:
-        "0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
+        "eth:0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
      values.getAllRegisteredContracts.96:
-        "0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
+        "eth:0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
      values.getAllRegisteredContracts.97:
-        "0xbc044745F137D4693c2Aa823C760f855254faD42"
+        "eth:0xbc044745F137D4693c2Aa823C760f855254faD42"
      values.getAllRegisteredContracts.98:
-        "0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
+        "eth:0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
      values.getAllRegisteredContracts.99:
-        "0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
+        "eth:0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
      values.getAllRegisteredContracts.100:
-        "0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
+        "eth:0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
      values.getAllRegisteredContracts.101:
-        "0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
+        "eth:0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
      values.getAllRegisteredContracts.102:
-        "0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
+        "eth:0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
      values.getAllRegisteredContracts.103:
-        "0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
+        "eth:0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
      values.getAllRegisteredContracts.104:
-        "0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
+        "eth:0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
      values.getAllRegisteredContracts.105:
-        "0x73220345bD37C6897dA959AE6205254be5da4dD8"
+        "eth:0x73220345bD37C6897dA959AE6205254be5da4dD8"
      values.getAllRegisteredContracts.106:
-        "0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
+        "eth:0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
      values.getAllRegisteredContracts.107:
-        "0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
+        "eth:0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
      values.getAllRegisteredContracts.108:
-        "0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
+        "eth:0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
      values.getAllRegisteredContracts.109:
-        "0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
+        "eth:0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
      values.getAllRegisteredContracts.110:
-        "0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
+        "eth:0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
      values.getAllRegisteredContracts.111:
-        "0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
+        "eth:0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
      values.getAllRegisteredContracts.112:
-        "0xeE44aE0cff6E9E62F26add74784E573bD671F144"
+        "eth:0xeE44aE0cff6E9E62F26add74784E573bD671F144"
      values.getAllRegisteredContracts.113:
-        "0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
+        "eth:0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
      values.getAllRegisteredContracts.114:
-        "0xb9942AA8983d41e53b68209BeA596A6004321E77"
+        "eth:0xb9942AA8983d41e53b68209BeA596A6004321E77"
      values.getAllRegisteredContracts.115:
-        "0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
+        "eth:0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
      values.getAllRegisteredContracts.116:
-        "0x772665dce7b347A867F42bcA93587b5400Ae2576"
+        "eth:0x772665dce7b347A867F42bcA93587b5400Ae2576"
      values.getAllRegisteredContracts.117:
-        "0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
+        "eth:0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
      values.getAllRegisteredContracts.118:
-        "0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
+        "eth:0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
      values.getAllRegisteredContracts.119:
-        "0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
+        "eth:0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
      values.getAllRegisteredContracts.120:
-        "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
+        "eth:0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
      values.getAllRegisteredContracts.121:
-        "0xbD1463F02f61676d53fd183C2B19282BFF93D099"
+        "eth:0xbD1463F02f61676d53fd183C2B19282BFF93D099"
      values.getAllRegisteredContracts.122:
-        "0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
+        "eth:0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
      values.getAllRegisteredContracts.123:
-        "0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
+        "eth:0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
      values.getAllRegisteredContracts.124:
-        "0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
+        "eth:0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
      values.getAllRegisteredContracts.125:
-        "0x60E5db98d156B68bC079795096D8599d12F2DcA6"
+        "eth:0x60E5db98d156B68bC079795096D8599d12F2DcA6"
      values.getAllRegisteredContracts.126:
-        "0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
+        "eth:0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
      values.getAllRegisteredContracts.127:
-        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
+        "eth:0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
      values.getAllRegisteredContracts.128:
-        "0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
+        "eth:0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
      values.getAllRegisteredContracts.129:
-        "0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
+        "eth:0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
      values.getAllRegisteredContracts.130:
-        "0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
+        "eth:0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
      values.getAllRegisteredContracts.131:
-        "0xf35a80E4705C56Fd345E735387c3377baCcd8189"
+        "eth:0xf35a80E4705C56Fd345E735387c3377baCcd8189"
      values.getAllRegisteredContracts.132:
-        "0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
+        "eth:0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
      values.getAllRegisteredContracts.133:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.getAllRegisteredContracts.134:
-        "0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
+        "eth:0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
      values.getAllRegisteredContracts.135:
-        "0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
+        "eth:0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
      values.getAllRegisteredContracts.136:
-        "0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
+        "eth:0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
      values.getAllRegisteredContracts.137:
-        "0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
+        "eth:0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
      values.getAllRegisteredContracts.138:
-        "0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
+        "eth:0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
      values.getAllRegisteredContracts.139:
-        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
+        "eth:0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
      values.getAllRegisteredContracts.140:
-        "0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
+        "eth:0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
      values.getAllRegisteredContracts.141:
-        "0x86838871562B82C071ec57F7CA50879532678F42"
+        "eth:0x86838871562B82C071ec57F7CA50879532678F42"
      values.getAllRegisteredContracts.142:
-        "0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
+        "eth:0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
      values.getAllRegisteredContracts.143:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.getAllRegisteredContracts.144:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.getAllRegisteredContracts.145:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getAllRegisteredContracts.146:
-        "0x9B40E25dDd4518F36c50ce8AEf53Ee527419D55d"
+        "eth:0x9B40E25dDd4518F36c50ce8AEf53Ee527419D55d"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0x3e532e6222afe9Bcf02DCB87216802c75D5113aE:
-        "Registry"
      implementationNames.eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE:
+        "Registry"
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      address:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.namedAddresses.0.address:
-        "0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      values.namedAddresses.1.address:
-        "0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      values.namedAddresses.2.address:
-        "0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"
+        "eth:0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"
      values.namedAddresses.3.address:
-        "0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      values.namedAddresses.4.address:
-        "0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      values.namedAddresses.5.address:
-        "0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      values.namedAddresses.6.address:
-        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
+        "eth:0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
      values.namedAddresses.7.address:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.namedAddresses.8.address:
-        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
+        "eth:0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
      values.namedAddresses.9.address:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.namedAddresses.10.address:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0x40f941E48A552bF496B154Af6bf55725f18D77c3:
-        "Finder"
      implementationNames.eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3:
+        "Finder"
    }
```

```diff
    contract Relayer3 (0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9) {
    +++ description: None
      address:
-        "0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9"
+        "eth:0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9"
      values.ETH:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      values.gelato:
-        "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
+        "eth:0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
      values.paymentToken:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      implementationNames.0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9:
-        "Relay"
      implementationNames.eth:0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9:
+        "Relay"
    }
```

```diff
    EOA Relayer8 (0x43728A95386D64384C76Afd416Dcc8118869BA6c) {
    +++ description: None
      address:
-        "0x43728A95386D64384C76Afd416Dcc8118869BA6c"
+        "eth:0x43728A95386D64384C76Afd416Dcc8118869BA6c"
    }
```

```diff
    EOA  (0x48fda6a16dEe5954bb0989b5B581d0623b48F06A) {
    +++ description: None
      address:
-        "0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
+        "eth:0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
    }
```

```diff
    EOA  (0x49a9E7ec76Bc8fDF658d09557305170d9F01D2fA) {
    +++ description: None
      address:
-        "0x49a9E7ec76Bc8fDF658d09557305170d9F01D2fA"
+        "eth:0x49a9E7ec76Bc8fDF658d09557305170d9F01D2fA"
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      address:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
+        "eth:0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
      values.$members.1:
-        "0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06"
+        "eth:0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06"
      values.$members.2:
-        "0x334CE923420ff1aA4f272e92BF68013D092aE7B4"
+        "eth:0x334CE923420ff1aA4f272e92BF68013D092aE7B4"
      values.$members.3:
-        "0x8D09e20b835009E5320cC11E6a6F00aF451aD669"
+        "eth:0x8D09e20b835009E5320cC11E6a6F00aF451aD669"
      values.$members.4:
-        "0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933"
+        "eth:0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933"
      values.$members.5:
-        "0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5"
+        "eth:0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5"
      values.$members.6:
-        "0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1"
+        "eth:0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1"
      values.$members.7:
-        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
+        "eth:0x2eEd1440842990Fa61F0c396f981375Fa6004131"
      values.$members.8:
-        "0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b"
+        "eth:0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b"
      values.GnosisSafe_modules.0:
-        "0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
+        "eth:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
      implementationNames.0x4d50a469fc788a3c0CdC8Fd67868877dCb246625:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7) {
    +++ description: None
      address:
-        "0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7"
+        "eth:0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7"
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      address:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.governor:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.token:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      implementationNames.0x50efaC9619225d7fB4703C5872da978849B6E7cC:
-        "ProposerV2"
      implementationNames.eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC:
+        "ProposerV2"
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      address:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      values.connectors.0:
-        "0x83096c7455f24E593aaC9A7c73f849d36d3EEb82"
+        "eth:0x83096c7455f24E593aaC9A7c73f849d36d3EEb82"
      values.connectors.1:
-        "0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA"
+        "eth:0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA"
      values.connectors.2:
-        "0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d"
+        "eth:0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d"
      values.connectors.3:
-        "0x56Ab287e5c33Ee70158c951f34818bd095446255"
+        "eth:0x56Ab287e5c33Ee70158c951f34818bd095446255"
      values.connectors.4:
-        "0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A"
+        "eth:0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A"
      values.connectors.5:
-        "0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116"
+        "eth:0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116"
      values.connectors.6:
-        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
+        "eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
      values.connectors.7:
-        "0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
+        "eth:0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
      values.connectors.8:
-        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
+        "eth:0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectors.9:
-        "0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
+        "eth:0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
      values.connectors.10:
-        "0x279fDA9AdDB854541f0bb86733d924e28c24c625"
+        "eth:0x279fDA9AdDB854541f0bb86733d924e28c24c625"
      values.connectors.11:
-        "0x7ed49D0a13255802A281C08688563bd8D5f726b1"
+        "eth:0x7ed49D0a13255802A281C08688563bd8D5f726b1"
      values.connectors.12:
-        "0x7b2bE683266909A6a4068e743083dd40621d663E"
+        "eth:0x7b2bE683266909A6a4068e743083dd40621d663E"
      values.connectors.13:
-        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
+        "eth:0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
      values.MERKLE:
-        "0x7D2596D7E44b0990611d390Fbb0Bd24e64845694"
+        "eth:0x7D2596D7E44b0990611d390Fbb0Bd24e64845694"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+++ description: Contract maintaining a list of Watchers able to stop the bridge if fraud is detected.
+++ severity: HIGH
      values.watcherManager:
-        "0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
+        "eth:0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
      implementationNames.0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A:
-        "RootManager"
      implementationNames.eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A:
+        "RootManager"
    }
```

```diff
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF) {
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
      address:
-        "0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getMember.1:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.timerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.withdrawer:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
      implementationNames.0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF:
-        "Store"
      implementationNames.eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF:
+        "Store"
    }
```

```diff
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    +++ description: None
      address:
-        "0x56Ab287e5c33Ee70158c951f34818bd095446255"
+        "eth:0x56Ab287e5c33Ee70158c951f34818bd095446255"
      values.AMB:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "eth:0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      values.mirrorConnector:
-        "0xA401e30E6b7Eb50e9355a4FA8F29118d28386E33"
+        "eth:0xA401e30E6b7Eb50e9355a4FA8F29118d28386E33"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x56Ab287e5c33Ee70158c951f34818bd095446255:
-        "LineaHubConnector"
      implementationNames.eth:0x56Ab287e5c33Ee70158c951f34818bd095446255:
+        "LineaHubConnector"
    }
```

```diff
    EOA  (0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d) {
    +++ description: None
      address:
-        "0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
+        "eth:0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
    }
```

```diff
    EOA  (0x58507fed0Cb11723dFb6848c92C59Cf0BBEB9927) {
    +++ description: None
      address:
-        "0x58507fed0Cb11723dFb6848c92C59Cf0BBEB9927"
+        "eth:0x58507fed0Cb11723dFb6848c92C59Cf0BBEB9927"
    }
```

```diff
    EOA  (0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87) {
    +++ description: None
      address:
-        "0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
    }
```

```diff
    EOA  (0x5aA748326f03C651749E7998D88647e59Ee386Bc) {
    +++ description: None
      address:
-        "0x5aA748326f03C651749E7998D88647e59Ee386Bc"
+        "eth:0x5aA748326f03C651749E7998D88647e59Ee386Bc"
    }
```

```diff
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24) {
    +++ description: None
      address:
-        "0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
+        "eth:0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
      values.AMB:
-        "0x676A795fe6E43C17c668de16730c3F690FEB7120"
+        "eth:0x676A795fe6E43C17c668de16730c3F690FEB7120"
      values.mirrorConnector:
-        "0xfFe0821f1f088B16E6760EDb5d537eB2551A3a0B"
+        "eth:0xfFe0821f1f088B16E6760EDb5d537eB2551A3a0B"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      values.stateCommitmentChain:
-        "0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa"
+        "eth:0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa"
      implementationNames.0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24:
-        "MantleHubConnector"
      implementationNames.eth:0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24:
+        "MantleHubConnector"
    }
```

```diff
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    +++ description: None
      address:
-        "0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A"
+        "eth:0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A"
      values.AMB:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.mirrorConnector:
-        "0x432006CEd3BBa818e3D0d8730426B32Bb34a42aB"
+        "eth:0x432006CEd3BBa818e3D0d8730426B32Bb34a42aB"
      values.OPTIMISM_PORTAL:
-        "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
+        "eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A:
-        "OptimismHubConnector"
      implementationNames.eth:0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A:
+        "OptimismHubConnector"
    }
```

```diff
    EOA  (0x5d527765252003AceE6545416F6a9C8D15ae8402) {
    +++ description: None
      address:
-        "0x5d527765252003AceE6545416F6a9C8D15ae8402"
+        "eth:0x5d527765252003AceE6545416F6a9C8D15ae8402"
    }
```

```diff
    EOA  (0x5f4E31F4F402E368743bF29954f80f7C4655EA68) {
    +++ description: None
      address:
-        "0x5f4E31F4F402E368743bF29954f80f7C4655EA68"
+        "eth:0x5f4E31F4F402E368743bF29954f80f7C4655EA68"
    }
```

```diff
    EOA  (0x6273c0965A1dB4F8A6277d490B4fD48715a42b96) {
    +++ description: None
      address:
-        "0x6273c0965A1dB4F8A6277d490B4fD48715a42b96"
+        "eth:0x6273c0965A1dB4F8A6277d490B4fD48715a42b96"
    }
```

```diff
    EOA Relayer9 (0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6) {
    +++ description: None
      address:
-        "0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6"
+        "eth:0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6"
    }
```

```diff
    EOA  (0x63Cda9C42db542bb91a7175E38673cFb00D402b0) {
    +++ description: None
      address:
-        "0x63Cda9C42db542bb91a7175E38673cFb00D402b0"
+        "eth:0x63Cda9C42db542bb91a7175E38673cFb00D402b0"
    }
```

```diff
    EOA  (0x6892d4D1f73A65B03063B7d78174dC6350Fcc406) {
    +++ description: None
      address:
-        "0x6892d4D1f73A65B03063B7d78174dC6350Fcc406"
+        "eth:0x6892d4D1f73A65B03063B7d78174dC6350Fcc406"
    }
```

```diff
    EOA  (0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2) {
    +++ description: None
      address:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
    }
```

```diff
    EOA  (0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682) {
    +++ description: None
      address:
-        "0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
+        "eth:0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
    }
```

```diff
    EOA  (0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5) {
    +++ description: None
      address:
-        "0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5"
+        "eth:0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5"
    }
```

```diff
    EOA  (0x6FD84ba95525c4cCd218F2f16F646A08B4b0a598) {
    +++ description: None
      address:
-        "0x6FD84ba95525c4cCd218F2f16F646A08B4b0a598"
+        "eth:0x6FD84ba95525c4cCd218F2f16F646A08B4b0a598"
    }
```

```diff
    EOA  (0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9) {
    +++ description: None
      address:
-        "0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
+        "eth:0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
    }
```

```diff
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99) {
    +++ description: None
      address:
-        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
+        "eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      values.$admin:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      values.$implementation:
-        "0xb82e63585e53C47Ee83104f22c21ab1FE76F2EAE"
+        "eth:0xb82e63585e53C47Ee83104f22c21ab1FE76F2EAE"
      values.gelato:
-        "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
+        "eth:0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
      values.owner:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      implementationNames.0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99:
-        "EIP173Proxy"
      implementationNames.0xb82e63585e53C47Ee83104f22c21ab1FE76F2EAE:
-        "GelatoRelay1Balance"
      implementationNames.eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99:
+        "EIP173Proxy"
      implementationNames.eth:0xb82e63585e53C47Ee83104f22c21ab1FE76F2EAE:
+        "GelatoRelay1Balance"
    }
```

```diff
    contract RelayerProxyHub1 (0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4) {
    +++ description: None
      address:
-        "0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
+        "eth:0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
      values.connext:
-        "0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
+        "eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
      values.feeCollector:
-        "0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
+        "eth:0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
      values.gelatoRelayer:
-        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
+        "eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.proposed:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rootManager:
-        "0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1"
+        "eth:0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1"
      values.spokeConnector:
-        "0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
+        "eth:0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
      implementationNames.0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4:
-        "RelayerProxyHub"
      implementationNames.eth:0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4:
+        "RelayerProxyHub"
    }
```

```diff
    EOA  (0x76CF58cE587bC928fcc5aD895555fd040E06C61a) {
    +++ description: None
      address:
-        "0x76CF58cE587bC928fcc5aD895555fd040E06C61a"
+        "eth:0x76CF58cE587bC928fcc5aD895555fd040E06C61a"
    }
```

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    +++ description: None
      address:
-        "0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
+        "eth:0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+++ description: Permissioned set of actors who can pause certain bridge components and remove connectors.
+++ severity: LOW
      values.WATCHERS.0:
-        "0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
+        "eth:0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
+++ description: Permissioned set of actors who can pause certain bridge components and remove connectors.
+++ severity: LOW
      values.WATCHERS.1:
-        "0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
+        "eth:0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
      implementationNames.0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d:
-        "WatcherManager"
      implementationNames.eth:0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d:
+        "WatcherManager"
    }
```

```diff
    EOA  (0x79EfFa11d95931A7e1717f9Eb655eE43e35Ef265) {
    +++ description: None
      address:
-        "0x79EfFa11d95931A7e1717f9Eb655eE43e35Ef265"
+        "eth:0x79EfFa11d95931A7e1717f9Eb655eE43e35Ef265"
    }
```

```diff
    EOA  (0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933) {
    +++ description: None
      address:
-        "0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933"
+        "eth:0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933"
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      address:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.emergencyProposer:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getMember.1:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.getMember.2:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.proposer:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      implementationNames.0x7b292034084A41B9D441B71b6E3557Edd0463fa8:
-        "GovernorV2"
      implementationNames.eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8:
+        "GovernorV2"
    }
```

```diff
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E) {
    +++ description: None
      address:
-        "0x7b2bE683266909A6a4068e743083dd40621d663E"
+        "eth:0x7b2bE683266909A6a4068e743083dd40621d663E"
      values.AMB:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.mirrorConnector:
-        "0x137072F68708eb7c82edceEceCcf64D6c29C171b"
+        "eth:0x137072F68708eb7c82edceEceCcf64D6c29C171b"
      values.OPTIMISM_PORTAL:
-        "0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
+        "eth:0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x7b2bE683266909A6a4068e743083dd40621d663E:
-        "OptimismHubConnector"
      implementationNames.eth:0x7b2bE683266909A6a4068e743083dd40621d663E:
+        "OptimismHubConnector"
    }
```

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      address:
-        "0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
+        "eth:0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
      values.$implementation:
-        "0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
+        "eth:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762"
      values.$members.0:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "eth:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.$members.1:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.$members.2:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "eth:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
      values.$members.3:
-        "0xb71C02f99c42424257745827F1C2beBD7Fa1e936"
+        "eth:0xb71C02f99c42424257745827F1C2beBD7Fa1e936"
      values.$members.4:
-        "0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"
+        "eth:0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"
      implementationNames.0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A:
-        "SafeProxy"
      implementationNames.0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
-        "SafeL2"
      implementationNames.eth:0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A:
+        "SafeProxy"
      implementationNames.eth:0x29fcB43b46531BcA003ddC8FCB67FFE91900C762:
+        "SafeL2"
    }
```

```diff
    EOA  (0x7ce49752fFA7055622f444df3c69598748cb2E5f) {
    +++ description: None
      address:
-        "0x7ce49752fFA7055622f444df3c69598748cb2E5f"
+        "eth:0x7ce49752fFA7055622f444df3c69598748cb2E5f"
    }
```

```diff
    contract UpgradeBeaconProxy (0x7D2596D7E44b0990611d390Fbb0Bd24e64845694) {
    +++ description: None
      address:
-        "0x7D2596D7E44b0990611d390Fbb0Bd24e64845694"
+        "eth:0x7D2596D7E44b0990611d390Fbb0Bd24e64845694"
      implementationNames.0x7D2596D7E44b0990611d390Fbb0Bd24e64845694:
-        "UpgradeBeaconProxy"
      implementationNames.eth:0x7D2596D7E44b0990611d390Fbb0Bd24e64845694:
+        "UpgradeBeaconProxy"
    }
```

```diff
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1) {
    +++ description: None
      address:
-        "0x7ed49D0a13255802A281C08688563bd8D5f726b1"
+        "eth:0x7ed49D0a13255802A281C08688563bd8D5f726b1"
      values.AMB:
-        "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
+        "eth:0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
      values.mirrorConnector:
-        "0xB17d6F7E4be3aD02E0350b5A67474Bc9B88E49C3"
+        "eth:0xB17d6F7E4be3aD02E0350b5A67474Bc9B88E49C3"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x7ed49D0a13255802A281C08688563bd8D5f726b1:
-        "PolygonZkHubConnector"
      implementationNames.eth:0x7ed49D0a13255802A281C08688563bd8D5f726b1:
+        "PolygonZkHubConnector"
    }
```

```diff
    EOA  (0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315) {
    +++ description: None
      address:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "eth:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      address:
-        "0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
+        "eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
+        "eth:0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
      values.$members.1:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.$members.2:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.$members.3:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      implementationNames.0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    +++ description: None
      address:
-        "0x83096c7455f24E593aaC9A7c73f849d36d3EEb82"
+        "eth:0x83096c7455f24E593aaC9A7c73f849d36d3EEb82"
      values.AMB:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      values.mirrorConnector:
-        "0x5f0F58c8939565C0C553303849Bc5Bf7c530e816"
+        "eth:0x5f0F58c8939565C0C553303849Bc5Bf7c530e816"
      values.outbox:
-        "0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
+        "eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.rollup:
-        "0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
+        "eth:0x5eF0D09d1E6204141B4d37530808eD19f60FBa35"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0x83096c7455f24E593aaC9A7c73f849d36d3EEb82:
-        "ArbitrumHubConnector"
      implementationNames.eth:0x83096c7455f24E593aaC9A7c73f849d36d3EEb82:
+        "ArbitrumHubConnector"
    }
```

```diff
    EOA  (0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe) {
    +++ description: None
      address:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      address:
-        "0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
+        "eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
      values.$implementation.0:
-        "0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
+        "eth:0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
      values.$implementation.1:
-        "0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
+        "eth:0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
      values.$implementation.2:
-        "0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
+        "eth:0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
      values.$implementation.3:
-        "0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
+        "eth:0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
      values.$implementation.4:
-        "0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
+        "eth:0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
      values.$implementation.5:
-        "0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
+        "eth:0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
      values.$implementation.6:
-        "0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
+        "eth:0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
      values.$implementation.7:
-        "0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
+        "eth:0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
      values.$implementation.8:
-        "0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
+        "eth:0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
      values.$implementation.9:
-        "0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
+        "eth:0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
      values.$implementation.10:
-        "0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
+        "eth:0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
      values.$implementation.11:
-        "0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
+        "eth:0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
      values.aavePool:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.facetAddresses.0:
-        "0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
+        "eth:0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
      values.facetAddresses.1:
-        "0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
+        "eth:0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
      values.facetAddresses.2:
-        "0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
+        "eth:0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
      values.facetAddresses.3:
-        "0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
+        "eth:0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
      values.facetAddresses.4:
-        "0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
+        "eth:0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
      values.facetAddresses.5:
-        "0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
+        "eth:0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
      values.facetAddresses.6:
-        "0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
+        "eth:0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
      values.facetAddresses.7:
-        "0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
+        "eth:0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
      values.facetAddresses.8:
-        "0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
+        "eth:0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
      values.facetAddresses.9:
-        "0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
+        "eth:0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
      values.facetAddresses.10:
-        "0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
+        "eth:0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
      values.facetAddresses.11:
-        "0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
+        "eth:0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
      values.facets.0.facetAddress:
-        "0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
+        "eth:0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81"
      values.facets.1.facetAddress:
-        "0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
+        "eth:0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2"
      values.facets.2.facetAddress:
-        "0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
+        "eth:0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295"
      values.facets.3.facetAddress:
-        "0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
+        "eth:0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d"
      values.facets.4.facetAddress:
-        "0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
+        "eth:0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352"
      values.facets.5.facetAddress:
-        "0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
+        "eth:0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769"
      values.facets.6.facetAddress:
-        "0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
+        "eth:0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D"
      values.facets.7.facetAddress:
-        "0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
+        "eth:0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686"
      values.facets.8.facetAddress:
-        "0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
+        "eth:0x6369F971fd1f1f230B8584151Ed7747FF710Cc68"
      values.facets.9.facetAddress:
-        "0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
+        "eth:0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b"
      values.facets.10.facetAddress:
-        "0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
+        "eth:0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4"
      values.facets.11.facetAddress:
-        "0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
+        "eth:0x3Bcf4185443A339517aD4e580067f178d1B68E1D"
      values.lpTokenTargetAddress:
-        "0xf7DE5aCeEeE6091d1103209C337fA00D0B4b9092"
+        "eth:0xf7DE5aCeEeE6091d1103209C337fA00D0B4b9092"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.proposed:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
+++ description: This address receives the bridge fees
+++ severity: LOW
      values.relayerFeeVault:
-        "0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
+        "eth:0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
      values.RELAYERS.0:
-        "0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
+        "eth:0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4"
      values.RELAYERS.1:
-        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
+        "eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      values.RELAYERS.2:
-        "0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2"
+        "eth:0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2"
      values.RELAYERS.3:
-        "0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9"
+        "eth:0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9"
      values.RELAYERS.4:
-        "0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47"
+        "eth:0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47"
      values.RELAYERS.5:
-        "0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
+        "eth:0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
      values.RELAYERS.6:
-        "0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE"
+        "eth:0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE"
      values.RELAYERS.7:
-        "0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
+        "eth:0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
      values.RELAYERS.8:
-        "0x43728A95386D64384C76Afd416Dcc8118869BA6c"
+        "eth:0x43728A95386D64384C76Afd416Dcc8118869BA6c"
      values.RELAYERS.9:
-        "0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6"
+        "eth:0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6"
      values.RELAYERS.10:
-        "0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28"
+        "eth:0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28"
      values.RELAYERS.11:
-        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
+        "eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      values.RELAYERS.12:
-        "0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
+        "eth:0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
      values.RELAYERS.13:
-        "0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
+        "eth:0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
      values.SEQUENCERS.0:
-        "0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7"
+        "eth:0x4fFA5968857a6C8242E4A6Ded2418155D33e82E7"
      values.xAppConnectionManager:
-        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
+        "eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
      implementationNames.0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6:
-        "ConnextDiamond"
      implementationNames.0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81:
-        "TokenFacet"
      implementationNames.0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2:
-        "BridgeFacet"
      implementationNames.0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295:
-        "InboxFacet"
      implementationNames.0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d:
-        "ProposedOwnableFacet"
      implementationNames.0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352:
-        "PortalFacet"
      implementationNames.0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769:
-        "RelayerFacet"
      implementationNames.0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D:
-        "RoutersFacet"
      implementationNames.0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686:
-        "StableSwapFacet"
      implementationNames.0x6369F971fd1f1f230B8584151Ed7747FF710Cc68:
-        "SwapAdminFacet"
      implementationNames.0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b:
-        "DiamondCutFacet"
      implementationNames.0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4:
-        "DiamondInit"
      implementationNames.0x3Bcf4185443A339517aD4e580067f178d1B68E1D:
-        "DiamondLoupeFacet"
      implementationNames.eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6:
+        "ConnextDiamond"
      implementationNames.eth:0xe37d4F73ef1C85dEf2174A394f17Ac65DD3cBB81:
+        "TokenFacet"
      implementationNames.eth:0x3606b0D9c84224892C7407d4e8DCfd7E9E2126A2:
+        "BridgeFacet"
      implementationNames.eth:0x5Ccd25372A41eeB3D4E5353879Bb28213dF5a295:
+        "InboxFacet"
      implementationNames.eth:0x086B5A16D7Bd6B2955fCC7d5F9AA2a1544b67e0d:
+        "ProposedOwnableFacet"
      implementationNames.eth:0x7993Bb17D8D8A0676Cc1527f8b4CE52A2B490352:
+        "PortalFacet"
      implementationNames.eth:0xcCb64fDf1c0Cc1aac1C39E5968E82f89c1B8C769:
+        "RelayerFacet"
      implementationNames.eth:0xBe8D8Ac9a44fBa6cb7A7E02c1E6576E06C7da72D:
+        "RoutersFacet"
      implementationNames.eth:0x9AB5F562Dc2aCcCd1b80d6564B770786e38f0686:
+        "StableSwapFacet"
      implementationNames.eth:0x6369F971fd1f1f230B8584151Ed7747FF710Cc68:
+        "SwapAdminFacet"
      implementationNames.eth:0x324c5834cD3bD19c4991F4fC5b3a0Ff5257a692b:
+        "DiamondCutFacet"
      implementationNames.eth:0x44e799f47A5599f5c9158d1F2457E30A6D77aDb4:
+        "DiamondInit"
      implementationNames.eth:0x3Bcf4185443A339517aD4e580067f178d1B68E1D:
+        "DiamondLoupeFacet"
    }
```

```diff
    EOA  (0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba) {
    +++ description: None
      address:
-        "0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba"
+        "eth:0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba"
    }
```

```diff
    EOA  (0x8cb19CE8EEDF740389D428879a876A3B030B9170) {
    +++ description: None
      address:
-        "0x8cb19CE8EEDF740389D428879a876A3B030B9170"
+        "eth:0x8cb19CE8EEDF740389D428879a876A3B030B9170"
    }
```

```diff
    EOA  (0x8D09e20b835009E5320cC11E6a6F00aF451aD669) {
    +++ description: None
      address:
-        "0x8D09e20b835009E5320cC11E6a6F00aF451aD669"
+        "eth:0x8D09e20b835009E5320cC11E6a6F00aF451aD669"
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      address:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      description:
-        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
      values.executor:
-        "0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
+        "eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
      values.governor:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.token:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      implementationNames.0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748:
-        "EmergencyProposer"
      implementationNames.eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748:
+        "EmergencyProposer"
    }
```

```diff
    EOA Relayer4 (0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47) {
    +++ description: None
      address:
-        "0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47"
+        "eth:0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47"
    }
```

```diff
    EOA  (0x9584Eb0356a380b25D7ED2C14c54De58a25f2581) {
    +++ description: None
      address:
-        "0x9584Eb0356a380b25D7ED2C14c54De58a25f2581"
+        "eth:0x9584Eb0356a380b25D7ED2C14c54De58a25f2581"
    }
```

```diff
    EOA  (0x96D38b113b1bC6a21d1137676f2f05DfcAce24e8) {
    +++ description: None
      address:
-        "0x96D38b113b1bC6a21d1137676f2f05DfcAce24e8"
+        "eth:0x96D38b113b1bC6a21d1137676f2f05DfcAce24e8"
    }
```

```diff
    EOA  (0x975574980a5Da77f5C90bC92431835D91B73669e) {
    +++ description: None
      address:
-        "0x975574980a5Da77f5C90bC92431835D91B73669e"
+        "eth:0x975574980a5Da77f5C90bC92431835D91B73669e"
    }
```

```diff
    EOA  (0x97b9dcB1AA34fE5F12b728D9166ae353d1e7f5C4) {
    +++ description: None
      address:
-        "0x97b9dcB1AA34fE5F12b728D9166ae353d1e7f5C4"
+        "eth:0x97b9dcB1AA34fE5F12b728D9166ae353d1e7f5C4"
    }
```

```diff
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007) {
    +++ description: None
      address:
-        "0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
+        "eth:0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
      values.$admin:
-        "0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
+        "eth:0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
      values.$implementation:
-        "0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
+        "eth:0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
      values.gelato:
-        "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
+        "eth:0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
      values.owner:
-        "0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
+        "eth:0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
      implementationNames.0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007:
-        "EIP173ProxyWithReceive"
      implementationNames.0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78:
-        "RelayTransit"
      implementationNames.eth:0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007:
+        "EIP173ProxyWithReceive"
      implementationNames.eth:0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78:
+        "RelayTransit"
    }
```

```diff
    EOA  (0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f) {
    +++ description: None
      address:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "eth:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
    }
```

```diff
    contract MetisHubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    +++ description: None
      address:
-        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
+        "eth:0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.AMB:
-        "0x081D1101855bD523bA69A9794e0217F0DB6323ff"
+        "eth:0x081D1101855bD523bA69A9794e0217F0DB6323ff"
      values.mirrorConnector:
-        "0xbe9be105e64Ba861fE17e75c1cB622fD56eCd82D"
+        "eth:0xbe9be105e64Ba861fE17e75c1cB622fD56eCd82D"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      values.stateCommitmentChain:
-        "0xf209815E595Cdf3ed0aAF9665b1772e608AB9380"
+        "eth:0xf209815E595Cdf3ed0aAF9665b1772e608AB9380"
      implementationNames.0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa:
-        "OptimismV0HubConnector"
      implementationNames.eth:0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa:
+        "OptimismV0HubConnector"
    }
```

```diff
    EOA  (0xAabB54394E8dd61Dd70897E9c80be8de7C64A895) {
    +++ description: None
      address:
-        "0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
+        "eth:0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
    }
```

```diff
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92) {
    +++ description: None
      address:
-        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
+        "eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      values.$admin:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      values.$implementation:
-        "0xd91C07a7e8FCb1039fE326e6dE274fD0F3307350"
+        "eth:0xd91C07a7e8FCb1039fE326e6dE274fD0F3307350"
      values.gelato:
-        "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
+        "eth:0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
      values.owner:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      implementationNames.0xaBcC9b596420A9E9172FD5938620E265a0f9Df92:
-        "EIP173Proxy"
      implementationNames.0xd91C07a7e8FCb1039fE326e6dE274fD0F3307350:
-        "GelatoRelay"
      implementationNames.eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92:
+        "EIP173Proxy"
      implementationNames.eth:0xd91C07a7e8FCb1039fE326e6dE274fD0F3307350:
+        "GelatoRelay"
    }
```

```diff
    EOA  (0xade09131C6f43fe22C2CbABb759636C43cFc181e) {
    +++ description: None
      address:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
    }
```

```diff
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    +++ description: None
      address:
-        "0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA"
+        "eth:0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA"
      values.AMB:
-        "0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
+        "eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
      values.mirrorConnector:
-        "0x779D30a8BDD8f8A1cEC0292d7799350a8cCef119"
+        "eth:0x779D30a8BDD8f8A1cEC0292d7799350a8cCef119"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.refundAddress:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA:
-        "WormholeHubConnector"
      implementationNames.eth:0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA:
+        "WormholeHubConnector"
    }
```

```diff
    contract RelayerProxyHub3 (0xB4F8D176466f5F544bAd53737bffAaeA17185c05) {
    +++ description: None
      address:
-        "0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
+        "eth:0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
      values.autonolas:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.connext:
-        "0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
+        "eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
      values.feeCollector:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "eth:0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
      values.gelatoRelayer:
-        "0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
+        "eth:0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
      values.keep3r:
-        "0xeb02addCfD8B773A5FFA6B9d1FE99c566f8c44CC"
+        "eth:0xeb02addCfD8B773A5FFA6B9d1FE99c566f8c44CC"
      values.owner:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "eth:0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
      values.proposed:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.rootManager:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      values.spokeConnector:
-        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
+        "eth:0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
      implementationNames.0xB4F8D176466f5F544bAd53737bffAaeA17185c05:
-        "RelayerProxyHub"
      implementationNames.eth:0xB4F8D176466f5F544bAd53737bffAaeA17185c05:
+        "RelayerProxyHub"
    }
```

```diff
    EOA  (0xB65540bBA534E88EB4a5062D0E6519C07063b259) {
    +++ description: None
      address:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
    }
```

```diff
    EOA  (0xb71C02f99c42424257745827F1C2beBD7Fa1e936) {
    +++ description: None
      address:
-        "0xb71C02f99c42424257745827F1C2beBD7Fa1e936"
+        "eth:0xb71C02f99c42424257745827F1C2beBD7Fa1e936"
    }
```

```diff
    EOA  (0xBa11aA59645a56031fedBcCF60D4f111534f2502) {
    +++ description: None
      address:
-        "0xBa11aA59645a56031fedBcCF60D4f111534f2502"
+        "eth:0xBa11aA59645a56031fedBcCF60D4f111534f2502"
    }
```

```diff
    contract GnosisSafe (0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1) {
    +++ description: None
      address:
-        "0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1"
+        "eth:0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba"
+        "eth:0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba"
      values.$members.1:
-        "0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
+        "eth:0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
      implementationNames.0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xBE7BC00382a50A711D037eAeCAD799bb8805Dfa8) {
    +++ description: None
      address:
-        "0xBE7BC00382a50A711D037eAeCAD799bb8805Dfa8"
+        "eth:0xBE7BC00382a50A711D037eAeCAD799bb8805Dfa8"
    }
```

```diff
    EOA  (0xbe8109517300c78f2bbdC00d9EA8Cf597160017E) {
    +++ description: None
      address:
-        "0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
+        "eth:0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
    }
```

```diff
    EOA  (0xC4Ae07F276768A3b74AE8c47bc108a2aF0e40eBa) {
    +++ description: None
      address:
-        "0xC4Ae07F276768A3b74AE8c47bc108a2aF0e40eBa"
+        "eth:0xC4Ae07F276768A3b74AE8c47bc108a2aF0e40eBa"
    }
```

```diff
    EOA  (0xc770eC66052fe77ff2eF9edF9558236e2D1C41Ef) {
    +++ description: None
      address:
-        "0xc770eC66052fe77ff2eF9edF9558236e2D1C41Ef"
+        "eth:0xc770eC66052fe77ff2eF9edF9558236e2D1C41Ef"
    }
```

```diff
    EOA  (0xc82C7d826b1eD0b2A4E9A2bE72B445416f901FD1) {
    +++ description: None
      address:
-        "0xc82C7d826b1eD0b2A4E9A2bE72B445416f901FD1"
+        "eth:0xc82C7d826b1eD0b2A4E9A2bE72B445416f901FD1"
    }
```

```diff
    EOA  (0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d) {
    +++ description: None
      address:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
    }
```

```diff
    contract RelayerProxyHub2 (0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28) {
    +++ description: None
      address:
-        "0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28"
+        "eth:0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28"
      values.autonolas:
-        "0x0dC1dBD30f162A5a55E6054b692E37E4038D0E03"
+        "eth:0x0dC1dBD30f162A5a55E6054b692E37E4038D0E03"
      values.connext:
-        "0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
+        "eth:0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6"
      values.feeCollector:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.gelatoRelayer:
-        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
+        "eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      values.keep3r:
-        "0xeb02addCfD8B773A5FFA6B9d1FE99c566f8c44CC"
+        "eth:0xeb02addCfD8B773A5FFA6B9d1FE99c566f8c44CC"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.proposed:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "eth:0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
      values.rootManager:
-        "0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1"
+        "eth:0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1"
      values.spokeConnector:
-        "0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
+        "eth:0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
      implementationNames.0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28:
-        "RelayerProxyHub"
      implementationNames.eth:0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28:
+        "RelayerProxyHub"
    }
```

```diff
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570) {
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
      address:
-        "0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570:
-        "IdentifierWhitelist"
      implementationNames.eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570:
+        "IdentifierWhitelist"
    }
```

```diff
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134) {
    +++ description: None
      address:
-        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
+        "eth:0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
      implementationNames.0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134:
-        "AllowanceModule"
      implementationNames.eth:0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134:
+        "AllowanceModule"
    }
```

```diff
    EOA  (0xD7a8070F0875915dB9b9E03bD47A0b973d19130b) {
    +++ description: None
      address:
-        "0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"
+        "eth:0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"
    }
```

```diff
    EOA  (0xd839958F37f89F80c9520c2f3F4abE29168EeF1B) {
    +++ description: None
      address:
-        "0xd839958F37f89F80c9520c2f3F4abE29168EeF1B"
+        "eth:0xd839958F37f89F80c9520c2f3F4abE29168EeF1B"
    }
```

```diff
    EOA  (0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b) {
    +++ description: None
      address:
-        "0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b"
+        "eth:0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b"
    }
```

```diff
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7) {
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
      address:
-        "0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      values.getWhitelist.0:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.getWhitelist.1:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.getWhitelist.2:
-        "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
+        "eth:0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
      values.getWhitelist.3:
-        "0xeca82185adCE47f39c684352B0439f030f860318"
+        "eth:0xeca82185adCE47f39c684352B0439f030f860318"
      values.getWhitelist.4:
-        "0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0"
+        "eth:0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0"
      values.getWhitelist.5:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.getWhitelist.6:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.getWhitelist.7:
-        "0x758A43EE2BFf8230eeb784879CdcFF4828F2544D"
+        "eth:0x758A43EE2BFf8230eeb784879CdcFF4828F2544D"
      values.getWhitelist.8:
-        "0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3"
+        "eth:0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3"
      values.getWhitelist.9:
-        "0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28"
+        "eth:0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28"
      values.getWhitelist.10:
-        "0x3832d2F059E55934220881F831bE501D180671A7"
+        "eth:0x3832d2F059E55934220881F831bE501D180671A7"
      values.getWhitelist.11:
-        "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
+        "eth:0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
      values.getWhitelist.12:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      values.getWhitelist.13:
-        "0x0AaCfbeC6a24756c20D41914F2caba817C0d8521"
+        "eth:0x0AaCfbeC6a24756c20D41914F2caba817C0d8521"
      values.getWhitelist.14:
-        "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
+        "eth:0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
      values.getWhitelist.15:
-        "0x514910771AF9Ca656af840dff83E8264EcF986CA"
+        "eth:0x514910771AF9Ca656af840dff83E8264EcF986CA"
      values.getWhitelist.16:
-        "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
+        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      values.getWhitelist.17:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      values.getWhitelist.18:
-        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
+        "eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      values.getWhitelist.19:
-        "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
+        "eth:0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
      values.getWhitelist.20:
-        "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
+        "eth:0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
      values.getWhitelist.21:
-        "0xd3d2E2692501A5c9Ca623199D38826e513033a17"
+        "eth:0xd3d2E2692501A5c9Ca623199D38826e513033a17"
      values.getWhitelist.22:
-        "0x88D97d199b9ED37C29D846d00D443De980832a22"
+        "eth:0x88D97d199b9ED37C29D846d00D443De980832a22"
      values.getWhitelist.23:
-        "0xa117000000f279D81A1D3cc75430fAA017FA5A2e"
+        "eth:0xa117000000f279D81A1D3cc75430fAA017FA5A2e"
      values.getWhitelist.24:
-        "0x0954906da0Bf32d5479e25f46056d22f08464cab"
+        "eth:0x0954906da0Bf32d5479e25f46056d22f08464cab"
      values.getWhitelist.25:
-        "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b"
+        "eth:0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b"
      values.getWhitelist.26:
-        "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
+        "eth:0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
      values.getWhitelist.27:
-        "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272"
+        "eth:0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272"
      values.getWhitelist.28:
-        "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
+        "eth:0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
      values.getWhitelist.29:
-        "0xba100000625a3754423978a60c9317c58a424e3D"
+        "eth:0xba100000625a3754423978a60c9317c58a424e3D"
      values.getWhitelist.30:
-        "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a"
+        "eth:0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a"
      values.getWhitelist.31:
-        "0x0000000000095413afC295d19EDeb1Ad7B71c952"
+        "eth:0x0000000000095413afC295d19EDeb1Ad7B71c952"
      values.getWhitelist.32:
-        "0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074"
+        "eth:0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074"
      values.getWhitelist.33:
-        "0x24A6A37576377F63f194Caa5F518a60f45b42921"
+        "eth:0x24A6A37576377F63f194Caa5F518a60f45b42921"
      values.getWhitelist.34:
-        "0xb753428af26E81097e7fD17f40c88aaA3E04902c"
+        "eth:0xb753428af26E81097e7fD17f40c88aaA3E04902c"
      values.getWhitelist.35:
-        "0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
+        "eth:0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
      values.getWhitelist.36:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      values.getWhitelist.37:
-        "0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"
+        "eth:0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"
      values.getWhitelist.38:
-        "0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a"
+        "eth:0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a"
      values.getWhitelist.39:
-        "0x0391D2021f89DC339F60Fff84546EA23E337750f"
+        "eth:0x0391D2021f89DC339F60Fff84546EA23E337750f"
      values.getWhitelist.40:
-        "0x69BbE2FA02b4D90A944fF328663667DC32786385"
+        "eth:0x69BbE2FA02b4D90A944fF328663667DC32786385"
      values.getWhitelist.41:
-        "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
+        "eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
      values.getWhitelist.42:
-        "0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
+        "eth:0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
      values.getWhitelist.43:
-        "0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9"
+        "eth:0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9"
      values.getWhitelist.44:
-        "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
+        "eth:0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
      values.getWhitelist.45:
-        "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
+        "eth:0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      values.getWhitelist.46:
-        "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
+        "eth:0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
      values.getWhitelist.47:
-        "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
+        "eth:0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
      values.getWhitelist.48:
-        "0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F"
+        "eth:0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F"
      values.getWhitelist.49:
-        "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
+        "eth:0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
      values.getWhitelist.50:
-        "0x2ba592F78dB6436527729929AAf6c908497cB200"
+        "eth:0x2ba592F78dB6436527729929AAf6c908497cB200"
      values.getWhitelist.51:
-        "0xC4C2614E694cF534D407Ee49F8E44D125E4681c4"
+        "eth:0xC4C2614E694cF534D407Ee49F8E44D125E4681c4"
      values.getWhitelist.52:
-        "0xBBc2AE13b23d715c30720F079fcd9B4a74093505"
+        "eth:0xBBc2AE13b23d715c30720F079fcd9B4a74093505"
      values.getWhitelist.53:
-        "0x69e8b9528CABDA89fe846C67675B5D73d463a916"
+        "eth:0x69e8b9528CABDA89fe846C67675B5D73d463a916"
      values.getWhitelist.54:
-        "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"
+        "eth:0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"
      values.getWhitelist.55:
-        "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919"
+        "eth:0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919"
      values.getWhitelist.56:
-        "0xc00e94Cb662C3520282E6f5717214004A7f26888"
+        "eth:0xc00e94Cb662C3520282E6f5717214004A7f26888"
      values.getWhitelist.57:
-        "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
+        "eth:0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
      values.getWhitelist.58:
-        "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
+        "eth:0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
      values.getWhitelist.59:
-        "0xa1faa113cbE53436Df28FF0aEe54275c13B40975"
+        "eth:0xa1faa113cbE53436Df28FF0aEe54275c13B40975"
      values.getWhitelist.60:
-        "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
+        "eth:0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
      values.getWhitelist.61:
-        "0x408e41876cCCDC0F92210600ef50372656052a38"
+        "eth:0x408e41876cCCDC0F92210600ef50372656052a38"
      values.getWhitelist.62:
-        "0xD533a949740bb3306d119CC777fa900bA034cd52"
+        "eth:0xD533a949740bb3306d119CC777fa900bA034cd52"
      values.getWhitelist.63:
-        "0xD291E7a03283640FDc51b121aC401383A46cC623"
+        "eth:0xD291E7a03283640FDc51b121aC401383A46cC623"
      values.getWhitelist.64:
-        "0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
+        "eth:0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
      values.getWhitelist.65:
-        "0x888888435FDe8e7d4c54cAb67f206e4199454c60"
+        "eth:0x888888435FDe8e7d4c54cAb67f206e4199454c60"
      values.getWhitelist.66:
-        "0x44564d0bd94343f72E3C8a0D22308B7Fa71DB0Bb"
+        "eth:0x44564d0bd94343f72E3C8a0D22308B7Fa71DB0Bb"
      values.getWhitelist.67:
-        "0x3472A5A71965499acd81997a54BBA8D852C6E53d"
+        "eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d"
      values.getWhitelist.68:
-        "0x383518188C0C6d7730D91b2c03a03C837814a899"
+        "eth:0x383518188C0C6d7730D91b2c03a03C837814a899"
      values.getWhitelist.69:
-        "0x875773784Af8135eA0ef43b5a374AaD105c5D39e"
+        "eth:0x875773784Af8135eA0ef43b5a374AaD105c5D39e"
      values.getWhitelist.70:
-        "0x6810e776880C02933D47DB1b9fc05908e5386b96"
+        "eth:0x6810e776880C02933D47DB1b9fc05908e5386b96"
      values.getWhitelist.71:
-        "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
+        "eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
      values.getWhitelist.72:
-        "0xad32A8e6220741182940c5aBF610bDE99E737b2D"
+        "eth:0xad32A8e6220741182940c5aBF610bDE99E737b2D"
      values.getWhitelist.73:
-        "0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
+        "eth:0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
      values.getWhitelist.74:
-        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
+        "eth:0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
      values.getWhitelist.75:
-        "0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d"
+        "eth:0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d"
      values.getWhitelist.76:
-        "0xbEa98c05eEAe2f3bC8c3565Db7551Eb738c8CCAb"
+        "eth:0xbEa98c05eEAe2f3bC8c3565Db7551Eb738c8CCAb"
      values.getWhitelist.77:
-        "0x8888801aF4d980682e47f1A9036e589479e835C5"
+        "eth:0x8888801aF4d980682e47f1A9036e589479e835C5"
      values.getWhitelist.78:
-        "0x4104b135DBC9609Fc1A9490E61369036497660c8"
+        "eth:0x4104b135DBC9609Fc1A9490E61369036497660c8"
      values.getWhitelist.79:
-        "0xfe9A29aB92522D14Fc65880d817214261D8479AE"
+        "eth:0xfe9A29aB92522D14Fc65880d817214261D8479AE"
      values.getWhitelist.80:
-        "0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83"
+        "eth:0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83"
      values.getWhitelist.81:
-        "0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
+        "eth:0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
      values.getWhitelist.82:
-        "0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198"
+        "eth:0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198"
      values.getWhitelist.83:
-        "0x7815bDa662050D84718B988735218CFfd32f75ea"
+        "eth:0x7815bDa662050D84718B988735218CFfd32f75ea"
      values.getWhitelist.84:
-        "0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
+        "eth:0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
      values.getWhitelist.85:
-        "0x5166E09628b696285E3A151e84FB977736a83575"
+        "eth:0x5166E09628b696285E3A151e84FB977736a83575"
      values.getWhitelist.86:
-        "0xB0e1fc65C1a741b4662B813eB787d369b8614Af1"
+        "eth:0xB0e1fc65C1a741b4662B813eB787d369b8614Af1"
      values.getWhitelist.87:
-        "0xbC396689893D065F41bc2C6EcbeE5e0085233447"
+        "eth:0xbC396689893D065F41bc2C6EcbeE5e0085233447"
      values.getWhitelist.88:
-        "0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7"
+        "eth:0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7"
      values.getWhitelist.89:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
+        "eth:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.getWhitelist.90:
-        "0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb"
+        "eth:0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb"
      values.getWhitelist.91:
-        "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
+        "eth:0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      values.getWhitelist.92:
-        "0xD34a24006b862f4E9936c506691539D6433aD297"
+        "eth:0xD34a24006b862f4E9936c506691539D6433aD297"
      values.getWhitelist.93:
-        "0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
+        "eth:0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
      values.getWhitelist.94:
-        "0xbA8A621b4a54e61C442F5Ec623687e2a942225ef"
+        "eth:0xbA8A621b4a54e61C442F5Ec623687e2a942225ef"
      values.getWhitelist.95:
-        "0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F"
+        "eth:0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F"
      values.getWhitelist.96:
-        "0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
+        "eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
      values.getWhitelist.97:
-        "0xef5Fa9f3Dede72Ec306dfFf1A7eA0bB0A2F7046F"
+        "eth:0xef5Fa9f3Dede72Ec306dfFf1A7eA0bB0A2F7046F"
      values.getWhitelist.98:
-        "0xaa61D5dec73971CD4a026ef2820bB87b4a4Ed8d6"
+        "eth:0xaa61D5dec73971CD4a026ef2820bB87b4a4Ed8d6"
      values.getWhitelist.99:
-        "0x752Efadc0a7E05ad1BCCcDA22c141D01a75EF1e4"
+        "eth:0x752Efadc0a7E05ad1BCCcDA22c141D01a75EF1e4"
      values.getWhitelist.100:
-        "0xEd1480d12bE41d92F36f5f7bDd88212E381A3677"
+        "eth:0xEd1480d12bE41d92F36f5f7bDd88212E381A3677"
      values.getWhitelist.101:
-        "0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5"
+        "eth:0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5"
      values.getWhitelist.102:
-        "0xDC59ac4FeFa32293A95889Dc396682858d52e5Db"
+        "eth:0xDC59ac4FeFa32293A95889Dc396682858d52e5Db"
      values.getWhitelist.103:
-        "0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
+        "eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
      values.getWhitelist.104:
-        "0xa5f2211B9b8170F694421f2046281775E8468044"
+        "eth:0xa5f2211B9b8170F694421f2046281775E8468044"
      values.getWhitelist.105:
-        "0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
+        "eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
      values.getWhitelist.106:
-        "0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xdBF90434dF0B98219f87d112F37d74B1D90758c7:
-        "AddressWhitelist"
      implementationNames.eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7:
+        "AddressWhitelist"
    }
```

```diff
    EOA  (0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb) {
    +++ description: None
      address:
-        "0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
+        "eth:0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb"
    }
```

```diff
    EOA Relayer6 (0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE) {
    +++ description: None
      address:
-        "0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE"
+        "eth:0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE"
    }
```

```diff
    contract Relayer7 (0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78) {
    +++ description: None
      address:
-        "0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
+        "eth:0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78"
      values.gelato:
-        "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
+        "eth:0x3CACa7b48D0573D793d3b0279b5F0029180E83b6"
      implementationNames.0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78:
-        "RelayTransit"
      implementationNames.eth:0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78:
+        "RelayTransit"
    }
```

```diff
    contract PolygonHubConnector (0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116) {
    +++ description: None
      address:
-        "0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116"
+        "eth:0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116"
      values.AMB:
-        "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
+        "eth:0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
      values.checkpointManager:
-        "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287"
+        "eth:0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287"
      values.fxChildTunnel:
-        "0xa052EF2D4Eb460c3886B0fd687FA33D3dc8b15EE"
+        "eth:0xa052EF2D4Eb460c3886B0fd687FA33D3dc8b15EE"
      values.fxRoot:
-        "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
+        "eth:0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
      values.mirrorConnector:
-        "0xa052EF2D4Eb460c3886B0fd687FA33D3dc8b15EE"
+        "eth:0xa052EF2D4Eb460c3886B0fd687FA33D3dc8b15EE"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116:
-        "PolygonHubConnector"
      implementationNames.eth:0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116:
+        "PolygonHubConnector"
    }
```

```diff
    EOA  (0xebD4919C075417a86F19713dADe101852867A04F) {
    +++ description: None
      address:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "eth:0xebD4919C075417a86F19713dADe101852867A04F"
    }
```

```diff
    EOA  (0xEca085906cb531bdf1F87eFA85c5bE46aA5C9d2c) {
    +++ description: None
      address:
-        "0xEca085906cb531bdf1F87eFA85c5bE46aA5C9d2c"
+        "eth:0xEca085906cb531bdf1F87eFA85c5bE46aA5C9d2c"
    }
```

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      address:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
+        "eth:0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$members.1:
-        "0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
+        "eth:0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.2:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.3:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "eth:0xebD4919C075417a86F19713dADe101852867A04F"
      values.$members.4:
-        "0x5aA748326f03C651749E7998D88647e59Ee386Bc"
+        "eth:0x5aA748326f03C651749E7998D88647e59Ee386Bc"
      values.$members.5:
-        "0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
+        "eth:0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
      values.$members.6:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "eth:0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.7:
-        "0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd"
+        "eth:0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd"
      values.$members.8:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "eth:0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.9:
-        "0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
+        "eth:0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
      values.$members.10:
-        "0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
+        "eth:0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
      values.$members.11:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
+        "eth:0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.GnosisSafe_modules.0:
-        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
+        "eth:0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
      implementationNames.0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      address:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.timerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xeE3Afe347D5C74317041E2618C49534dAf887c24:
-        "SkinnyOptimisticOracle"
      implementationNames.eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24:
+        "SkinnyOptimisticOracle"
    }
```

```diff
    EOA  (0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e) {
    +++ description: None
      address:
-        "0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
+        "eth:0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
    }
```

```diff
    EOA  (0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE) {
    +++ description: None
      address:
-        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
+        "eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    }
```

```diff
    EOA  (0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd) {
    +++ description: None
      address:
-        "0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd"
+        "eth:0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd"
    }
```

```diff
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    +++ description: None
      address:
-        "0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d"
+        "eth:0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d"
      values.AMB:
-        "0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
+        "eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e"
      values.mirrorConnector:
-        "0xDF97CadbcCeE9cfdB12A3e9BB7663E6753A71a0C"
+        "eth:0xDF97CadbcCeE9cfdB12A3e9BB7663E6753A71a0C"
      values.owner:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d:
-        "GnosisHubConnector"
      implementationNames.eth:0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d:
+        "GnosisHubConnector"
    }
```

```diff
    EOA  (0xF26c772C0fF3a6036bDdAbDAbA22cf65ECa9F97c) {
    +++ description: None
      address:
-        "0xF26c772C0fF3a6036bDdAbDAbA22cf65ECa9F97c"
+        "eth:0xF26c772C0fF3a6036bDdAbDAbA22cf65ECa9F97c"
    }
```

```diff
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
    +++ description: None
      address:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "eth:0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
+        "eth:0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.$members.1:
-        "0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
+        "eth:0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315"
      values.$members.2:
-        "0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
+        "eth:0x3d7dF98257E5CEe5f032fd06a0aA510F89A19A2e"
      values.$members.3:
-        "0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
+        "eth:0x48fda6a16dEe5954bb0989b5B581d0623b48F06A"
      values.$members.4:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
+        "eth:0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      implementationNames.0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b) {
    +++ description: None
      address:
-        "0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
+        "eth:0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
      values.AMB:
-        "0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
+        "eth:0x27428DD2d3DD32A4D7f7C497eAaa23130d894911"
      values.mirrorConnector:
-        "0x397aEEEDd44f40326f9eB583a1DFB8A7A673C40B"
+        "eth:0x397aEEEDd44f40326f9eB583a1DFB8A7A673C40B"
      values.owner:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.refundAddress:
-        "0xade09131C6f43fe22C2CbABb759636C43cFc181e"
+        "eth:0xade09131C6f43fe22C2CbABb759636C43cFc181e"
      values.ROOT_MANAGER:
-        "0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
+        "eth:0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A"
      implementationNames.0xf5a3372ed529FCD0690b6013EAaE04170ec0626b:
-        "WormholeHubConnector"
      implementationNames.eth:0xf5a3372ed529FCD0690b6013EAaE04170ec0626b:
+        "WormholeHubConnector"
    }
```

```diff
    EOA  (0xf83bC4688979b13Da02CB94c76cEB169540760b5) {
    +++ description: None
      address:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "eth:0xf83bC4688979b13Da02CB94c76cEB169540760b5"
    }
```

```diff
    EOA  (0xf8d8aF083aC452b05b0D2eb4499AD900324b5754) {
    +++ description: None
      address:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
+        "eth:0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
    }
```

```diff
    contract Relayer11 (0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0) {
    +++ description: None
      address:
-        "0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
+        "eth:0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
      implementationNames.0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0:
-        "GelatoRelay1BalanceV2"
      implementationNames.eth:0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0:
+        "GelatoRelay1BalanceV2"
    }
```

```diff
    EOA  (0xFaAB88015477493cFAa5DFAA533099C590876F21) {
    +++ description: None
      address:
-        "0xFaAB88015477493cFAa5DFAA533099C590876F21"
+        "eth:0xFaAB88015477493cFAa5DFAA533099C590876F21"
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      address:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.cachedOracle:
-        "0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      values.defaultCurrency:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE:
-        "OptimisticOracleV3"
      implementationNames.eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE:
+        "OptimisticOracleV3"
    }
```

```diff
+   Status: CREATED
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460)
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 3d. The rules for proposals can be read directly from the contract values.
```

```diff
+   Status: CREATED
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94)
    +++ description: None
```

```diff
+   Status: CREATED
    contract xLayerZkHubConnector (0x279fDA9AdDB854541f0bb86733d924e28c24c625)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x28A9e7bbed277092E2431F186E1aF898962d4E92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
```

```diff
+   Status: CREATED
    contract Relayer3 (0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
```

```diff
+   Status: CREATED
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub1 (0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
```

```diff
+   Status: CREATED
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeBeaconProxy (0x7D2596D7E44b0990611d390Fbb0Bd24e64845694)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
```

```diff
+   Status: CREATED
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetisHubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub3 (0xB4F8D176466f5F544bAd53737bffAaeA17185c05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub2 (0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28)
    +++ description: None
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
```

```diff
+   Status: CREATED
    contract Relayer7 (0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonHubConnector (0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
```

```diff
+   Status: CREATED
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer11 (0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
```

Generated with discovered.json: 0x5b8deccd3b07da4c71a6e6191bb7d5d93f5f27aa

# Diff at Fri, 04 Jul 2025 13:01:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@34cb32da9aba13b54692a657031c317903866c59 block: 22823809
- current block number: 22823809

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823809 (main branch discovery), not current.

```diff
    EOA Relayer2 (0x0ae392879A228B2484D9B1F80A5D0B7080FE79C2) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

```diff
    EOA Relayer8 (0x43728A95386D64384C76Afd416Dcc8118869BA6c) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

```diff
    EOA Relayer9 (0x62B1a88CCc6BC5e6FF91FB2FCD29Ab4F819b35C6) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

```diff
    EOA Relayer4 (0x935AaAe0f5b02007c08512F0629a9d37Af2E1A47) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

```diff
    EOA Relayer6 (0xE2Fc8F14B6cEb1AD8165623E02953eDB100288bE) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

```diff
    contract Relayer11 (0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0) {
    +++ description: None
      template:
-        "amarok/Relayer"
    }
```

Generated with discovered.json: 0xaff1e3db68a20c09b30caa1c3d80346a7a5ac5ed

# Diff at Fri, 04 Jul 2025 12:18:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22823809
- current block number: 22823809

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823809 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 3d. The rules for proposals can be read directly from the contract values.
      receivedPermissions.0.via.0.address:
-        "ethereum:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      receivedPermissions.0.from:
-        "ethereum:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
+        "eth:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
+        "eth:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
    }
```

```diff
    EOA  (0x2bAaA41d155ad8a4126184950B31F50A1513cE25) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
+        "eth:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460"
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      receivedPermissions.0.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
    }
```

```diff
    EOA  (0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
+        "eth:0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007"
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      receivedPermissions.0.from:
-        "ethereum:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      receivedPermissions.1.from:
-        "ethereum:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      receivedPermissions.2.from:
-        "ethereum:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      receivedPermissions.3.from:
-        "ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      receivedPermissions.4.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      receivedPermissions.5.from:
-        "ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      receivedPermissions.6.from:
-        "ethereum:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      receivedPermissions.7.from:
-        "ethereum:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      receivedPermissions.8.from:
-        "ethereum:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      receivedPermissions.0.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
    }
```

```diff
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      receivedPermissions.0.from:
-        "ethereum:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
+        "eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      receivedPermissions.1.from:
-        "ethereum:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
+        "eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
+        "eth:0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
    }
```

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
+        "eth:0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      receivedPermissions.1.from:
-        "ethereum:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
+        "eth:0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
    }
```

Generated with discovered.json: 0xe957665b259e7cc041ba31e5cd819dd1e81c010f

# Diff at Tue, 01 Jul 2025 10:33:28 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6dae2e2c6da3c994ad2a4e3a50e7430960cb763e block: 22786874
- current block number: 22823809

## Description

config: remove unused uma contracts.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22786874 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract OptimisticOracleV2 (0xA0Ae6609447e57a42c51B50EAe921D701823FFAe)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimisticOracle (0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6)
    +++ description: None
```

Generated with discovered.json: 0x2c004217c6c3d74370364f368d24d7a729d84b02

# Diff at Thu, 26 Jun 2025 11:10:14 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@972319be3b52318c4291f3c7ce823dfda470874c block: 21629064
- current block number: 22786874

## Description

templatize UMA.

## Watched changes

```diff
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      values.getAllRegisteredContracts.146:
+        "0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
      values.getAllRegisteredContracts.145:
-        "0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
+        "0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
      values.getAllRegisteredContracts.144:
-        "0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
+        "0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
      values.getAllRegisteredContracts.143:
-        "0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
+        "0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
      values.getAllRegisteredContracts.142:
-        "0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
+        "0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
      values.getAllRegisteredContracts.141:
-        "0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
+        "0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
      values.getAllRegisteredContracts.140:
-        "0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
+        "0xb40BA94747c59d076B3c189E3A031547492013da"
      values.getAllRegisteredContracts.139:
-        "0xb40BA94747c59d076B3c189E3A031547492013da"
+        "0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
      values.getAllRegisteredContracts.138:
-        "0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
+        "0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
      values.getAllRegisteredContracts.137:
-        "0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
+        "0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
      values.getAllRegisteredContracts.136:
-        "0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
+        "0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
      values.getAllRegisteredContracts.135:
-        "0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
+        "0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
      values.getAllRegisteredContracts.134:
-        "0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
+        "0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
      values.getAllRegisteredContracts.133:
-        "0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
+        "0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
      values.getAllRegisteredContracts.132:
-        "0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
+        "0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
      values.getAllRegisteredContracts.131:
-        "0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
+        "0xb33E3b8f5a172776730B0945206D6f75a2491307"
      values.getAllRegisteredContracts.130:
-        "0xb33E3b8f5a172776730B0945206D6f75a2491307"
+        "0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
      values.getAllRegisteredContracts.129:
-        "0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
+        "0xCef85b352CCD7a446d94AEeeA02dD11622289954"
      values.getAllRegisteredContracts.128:
-        "0xCef85b352CCD7a446d94AEeeA02dD11622289954"
+        "0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
      values.getAllRegisteredContracts.127:
-        "0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
+        "0x6DA66C15823cFf681DaD6963fBD325a520362958"
      values.getAllRegisteredContracts.126:
-        "0x6DA66C15823cFf681DaD6963fBD325a520362958"
+        "0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
      values.getAllRegisteredContracts.125:
-        "0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
+        "0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
      values.getAllRegisteredContracts.124:
-        "0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
+        "0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
      values.getAllRegisteredContracts.123:
-        "0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
+        "0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
      values.getAllRegisteredContracts.122:
-        "0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
+        "0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
      values.getAllRegisteredContracts.121:
-        "0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
+        "0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
      values.getAllRegisteredContracts.120:
-        "0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
+        "0x32F0405834C4b50be53199628C45603Cea3A28aA"
      values.getAllRegisteredContracts.119:
-        "0x32F0405834C4b50be53199628C45603Cea3A28aA"
+        "0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
      values.getAllRegisteredContracts.118:
-        "0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
+        "0x772665dce7b347A867F42bcA93587b5400Ae2576"
      values.getAllRegisteredContracts.117:
-        "0x772665dce7b347A867F42bcA93587b5400Ae2576"
+        "0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
      values.getAllRegisteredContracts.116:
-        "0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
+        "0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
      values.getAllRegisteredContracts.115:
-        "0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
+        "0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
      values.getAllRegisteredContracts.114:
-        "0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
+        "0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
      values.getAllRegisteredContracts.113:
-        "0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
+        "0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
      values.getAllRegisteredContracts.112:
-        "0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
+        "0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
      values.getAllRegisteredContracts.111:
-        "0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
+        "0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
      values.getAllRegisteredContracts.110:
-        "0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
+        "0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
      values.getAllRegisteredContracts.109:
-        "0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
+        "0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
      values.getAllRegisteredContracts.108:
-        "0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
+        "0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
      values.getAllRegisteredContracts.107:
-        "0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
+        "0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
      values.getAllRegisteredContracts.106:
-        "0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
+        "0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
      values.getAllRegisteredContracts.105:
-        "0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
+        "0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
      values.getAllRegisteredContracts.104:
-        "0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
+        "0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
      values.getAllRegisteredContracts.103:
-        "0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
+        "0x45788a369f3083c02b942aEa02DBa25C466a773F"
      values.getAllRegisteredContracts.102:
-        "0x45788a369f3083c02b942aEa02DBa25C466a773F"
+        "0xdF68acF496Db55f4A882a0371c489D739173fbEc"
      values.getAllRegisteredContracts.101:
-        "0xdF68acF496Db55f4A882a0371c489D739173fbEc"
+        "0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
      values.getAllRegisteredContracts.100:
-        "0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
+        "0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
      values.getAllRegisteredContracts.99:
-        "0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
+        "0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
      values.getAllRegisteredContracts.98:
-        "0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
+        "0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
      values.getAllRegisteredContracts.97:
-        "0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
+        "0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
      values.getAllRegisteredContracts.96:
-        "0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
+        "0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
      values.getAllRegisteredContracts.95:
-        "0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
+        "0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
      values.getAllRegisteredContracts.94:
-        "0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
+        "0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
      values.getAllRegisteredContracts.93:
-        "0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
+        "0x182d5993106573A95a182AB3A77c892713fFDA56"
      values.getAllRegisteredContracts.92:
-        "0x182d5993106573A95a182AB3A77c892713fFDA56"
+        "0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
      values.getAllRegisteredContracts.91:
-        "0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
+        "0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
      values.getAllRegisteredContracts.90:
-        "0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
+        "0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
      values.getAllRegisteredContracts.89:
-        "0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
+        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getAllRegisteredContracts.88:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "0x287a1bA52e030459F163f48b2Ae468a085003A07"
      values.getAllRegisteredContracts.87:
-        "0x287a1bA52e030459F163f48b2Ae468a085003A07"
+        "0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
      values.getAllRegisteredContracts.86:
-        "0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
+        "0xa1005DB6516A097E562ad7506CF90ebb511f5604"
      values.getAllRegisteredContracts.85:
-        "0xa1005DB6516A097E562ad7506CF90ebb511f5604"
+        "0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
      values.getAllRegisteredContracts.84:
-        "0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
+        "0xb9942AA8983d41e53b68209BeA596A6004321E77"
      values.getAllRegisteredContracts.83:
-        "0xb9942AA8983d41e53b68209BeA596A6004321E77"
+        "0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
      values.getAllRegisteredContracts.82:
-        "0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
+        "0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
      values.getAllRegisteredContracts.81:
-        "0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
+        "0xbc044745F137D4693c2Aa823C760f855254faD42"
      values.getAllRegisteredContracts.80:
-        "0xbc044745F137D4693c2Aa823C760f855254faD42"
+        "0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
      values.getAllRegisteredContracts.79:
-        "0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
+        "0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
      values.getAllRegisteredContracts.78:
-        "0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
+        "0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
      values.getAllRegisteredContracts.77:
-        "0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
+        "0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
      values.getAllRegisteredContracts.76:
-        "0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
+        "0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
      values.getAllRegisteredContracts.75:
-        "0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
+        "0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
      values.getAllRegisteredContracts.74:
-        "0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
+        "0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
      values.getAllRegisteredContracts.73:
-        "0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
+        "0xbD1463F02f61676d53fd183C2B19282BFF93D099"
      values.getAllRegisteredContracts.72:
-        "0xbD1463F02f61676d53fd183C2B19282BFF93D099"
+        "0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
      values.getAllRegisteredContracts.71:
-        "0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
+        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.getAllRegisteredContracts.70:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
      values.getAllRegisteredContracts.69:
-        "0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
+        "0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
      values.getAllRegisteredContracts.68:
-        "0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
+        "0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
      values.getAllRegisteredContracts.67:
-        "0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
+        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
      values.getAllRegisteredContracts.66:
-        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
+        "0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
      values.getAllRegisteredContracts.65:
-        "0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
+        "0xf35a80E4705C56Fd345E735387c3377baCcd8189"
      values.getAllRegisteredContracts.64:
-        "0xf35a80E4705C56Fd345E735387c3377baCcd8189"
+        "0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
      values.getAllRegisteredContracts.63:
-        "0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
+        "0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
      values.getAllRegisteredContracts.62:
-        "0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
+        "0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
      values.getAllRegisteredContracts.61:
-        "0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
+        "0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
      values.getAllRegisteredContracts.60:
-        "0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
+        "0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
      values.getAllRegisteredContracts.59:
-        "0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
+        "0x10E018C01792705BefB7A757628C2947E38B9426"
      values.getAllRegisteredContracts.58:
-        "0x10E018C01792705BefB7A757628C2947E38B9426"
+        "0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
      values.getAllRegisteredContracts.57:
-        "0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
+        "0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
      values.getAllRegisteredContracts.56:
-        "0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
+        "0x0759883acF042A54fAb083378b0395F773A79767"
      values.getAllRegisteredContracts.55:
-        "0x0759883acF042A54fAb083378b0395F773A79767"
+        "0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
      values.getAllRegisteredContracts.54:
-        "0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
+        "0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
      values.getAllRegisteredContracts.53:
-        "0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
+        "0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
      values.getAllRegisteredContracts.52:
-        "0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
+        "0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
      values.getAllRegisteredContracts.51:
-        "0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
+        "0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
      values.getAllRegisteredContracts.50:
-        "0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
+        "0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
      values.getAllRegisteredContracts.49:
-        "0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
+        "0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
      values.getAllRegisteredContracts.48:
-        "0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
+        "0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
      values.getAllRegisteredContracts.47:
-        "0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
+        "0x60E5db98d156B68bC079795096D8599d12F2DcA6"
      values.getAllRegisteredContracts.46:
-        "0x60E5db98d156B68bC079795096D8599d12F2DcA6"
+        "0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
      values.getAllRegisteredContracts.45:
-        "0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
+        "0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
      values.getAllRegisteredContracts.44:
-        "0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
+        "0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
      values.getAllRegisteredContracts.43:
-        "0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
+        "0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
      values.getAllRegisteredContracts.42:
-        "0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
+        "0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
      values.getAllRegisteredContracts.41:
-        "0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
+        "0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
      values.getAllRegisteredContracts.40:
-        "0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
+        "0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
      values.getAllRegisteredContracts.39:
-        "0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
+        "0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
      values.getAllRegisteredContracts.38:
-        "0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
+        "0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
      values.getAllRegisteredContracts.37:
-        "0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
+        "0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
      values.getAllRegisteredContracts.36:
-        "0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
+        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.getAllRegisteredContracts.35:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "0x86838871562B82C071ec57F7CA50879532678F42"
      values.getAllRegisteredContracts.34:
-        "0x86838871562B82C071ec57F7CA50879532678F42"
+        "0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
      values.getAllRegisteredContracts.33:
-        "0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
+        "0xaBBee9fC7a882499162323EEB7BF6614193312e3"
      values.getAllRegisteredContracts.32:
-        "0xaBBee9fC7a882499162323EEB7BF6614193312e3"
+        "0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
      values.getAllRegisteredContracts.31:
-        "0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
+        "0xd60139B287De1408f8388f5f57fC114Fb4B03328"
      values.getAllRegisteredContracts.30:
-        "0xd60139B287De1408f8388f5f57fC114Fb4B03328"
+        "0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
      values.getAllRegisteredContracts.29:
-        "0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
+        "0xf32219331A03D99C98Adf96D43cc312353003531"
      values.getAllRegisteredContracts.28:
-        "0xf32219331A03D99C98Adf96D43cc312353003531"
+        "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
      values.getAllRegisteredContracts.27:
-        "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
+        "0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
      values.getAllRegisteredContracts.26:
-        "0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
+        "0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
      values.getAllRegisteredContracts.25:
-        "0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
+        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.getAllRegisteredContracts.24:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
      values.getAllRegisteredContracts.23:
-        "0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
+        "0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
      values.getAllRegisteredContracts.22:
-        "0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
+        "0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
      values.getAllRegisteredContracts.21:
-        "0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
+        "0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
      values.getAllRegisteredContracts.20:
-        "0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
+        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
      values.getAllRegisteredContracts.19:
-        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
+        "0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
      values.getAllRegisteredContracts.18:
-        "0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
+        "0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
      values.getAllRegisteredContracts.17:
-        "0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
+        "0x73220345bD37C6897dA959AE6205254be5da4dD8"
      values.getAllRegisteredContracts.16:
-        "0x73220345bD37C6897dA959AE6205254be5da4dD8"
+        "0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
      values.getAllRegisteredContracts.15:
-        "0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
+        "0x52f83ACA94904b3590669E3525d25ec75cDFf798"
      values.getAllRegisteredContracts.14:
-        "0x52f83ACA94904b3590669E3525d25ec75cDFf798"
+        "0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
      values.getAllRegisteredContracts.13:
-        "0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
+        "0xda0943251079eB9f517668fdB372fC6AE299D898"
      values.getAllRegisteredContracts.12:
-        "0xda0943251079eB9f517668fdB372fC6AE299D898"
+        "0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
      values.getAllRegisteredContracts.11:
-        "0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
+        "0x0388f65C185a7E7D857BB142185381d97a4bc747"
      values.getAllRegisteredContracts.10:
-        "0x0388f65C185a7E7D857BB142185381d97a4bc747"
+        "0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
      values.getAllRegisteredContracts.9:
-        "0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
+        "0x384e239a2B225865558774b005C3d6eC29f8cE70"
      values.getAllRegisteredContracts.8:
-        "0x384e239a2B225865558774b005C3d6eC29f8cE70"
+        "0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
      values.getAllRegisteredContracts.7:
-        "0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
+        "0x7FBE19088B011A9dE0e3a327D7C681028F065616"
      values.getAllRegisteredContracts.6:
-        "0x7FBE19088B011A9dE0e3a327D7C681028F065616"
+        "0xeE44aE0cff6E9E62F26add74784E573bD671F144"
      values.getAllRegisteredContracts.5:
-        "0xeE44aE0cff6E9E62F26add74784E573bD671F144"
+        "0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
      values.getAllRegisteredContracts.4:
-        "0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
+        "0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
      values.getAllRegisteredContracts.3:
-        "0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
+        "0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
      values.getAllRegisteredContracts.2:
-        "0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
+        "0xb82756f9853A148A2390a08AaD30BabCDc22f068"
      values.getAllRegisteredContracts.1:
-        "0xb82756f9853A148A2390a08AaD30BabCDc22f068"
+        "0xfDF90C4104c1dE34979235e6AE080528266a14a3"
      values.getAllRegisteredContracts.0:
-        "0xfDF90C4104c1dE34979235e6AE080528266a14a3"
+        "0x9B40E25dDd4518F36c50ce8AEf53Ee527419D55d"
    }
```

```diff
    contract OptimisticOracleV2 (0xA0Ae6609447e57a42c51B50EAe921D701823FFAe) {
    +++ description: None
      values.getCurrentTime:
-        1736934215
+        1750919915
    }
```

```diff
    contract OptimisticOracle (0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6) {
    +++ description: None
      values.getCurrentTime:
-        1736934215
+        1750919915
    }
```

## Source code changes

```diff
.../GnosisSafe-0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a}/GnosisSafe.sol | 0
 .../GnosisSafe-0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a}/Proxy.p.sol    | 0
 2 files changed, 0 insertions(+), 0 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract UMA Voting Token v1 (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828)
    +++ description: None
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 3d. The rules for proposals can be read directly from the contract values.
      values.bondFmt:
+        "2"
      values.delayFmt:
+        "3d"
      template:
+        "uma/OptimisticGovernor"
      description:
+        "Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 3d. The rules for proposals can be read directly from the contract values."
      fieldMeta:
+        {"rules":{"description":"string of rules that a proposer is accepting when posting a proposal with a bond."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460","description":"set guard, avatar, target, delay, identifier, escalationManager, bond token and amount.","role":".owner","via":[{"address":"ethereum:0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"}]}]
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      values.namedAddresses:
+        [{"name":"OptimisticOracleV3","address":"0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"},{"name":"OptimisticOracleV2","address":"0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"},{"name":"Registry","address":"0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"},{"name":"FinancialContractsAdmin","address":"0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"},{"name":"SkinnyOptimisticOracle","address":"0xeE3Afe347D5C74317041E2618C49534dAf887c24"},{"name":"OptimisticAsserter","address":"0x0000000000000000000000000000000000000000"},{"name":"Store","address":"0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"},{"name":"OptimisticOracle","address":"0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"},{"name":"IdentifierWhitelist","address":"0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"},{"name":"CollateralWhitelist","address":"0xdBF90434dF0B98219f87d112F37d74B1D90758c7"},{"name":"Oracle","address":"0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"}]
      template:
+        "uma/Finder"
      description:
+        "Maps interface names to contract addresses (UMA protocol contracts)."
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x4f7261636c650000000000000000000000000000000000000000000000000000":"Oracle","0x5265676973747279000000000000000000000000000000000000000000000000":"Registry","0x46696e616e6369616c436f6e74726163747341646d696e000000000000000000":"FinancialContractsAdmin","0x53746f7265000000000000000000000000000000000000000000000000000000":"Store","0x4964656e74696669657257686974656c69737400000000000000000000000000":"IdentifierWhitelist","0x436f6c6c61746572616c57686974656c69737400000000000000000000000000":"CollateralWhitelist","0x4f7074696d69737469634f7261636c6500000000000000000000000000000000":"OptimisticOracle","0x536b696e6e794f7074696d69737469634f7261636c6500000000000000000000":"SkinnyOptimisticOracle","0x4f7074696d69737469634f7261636c6556320000000000000000000000000000":"OptimisticOracleV2","0x4f7074696d697374696341737365727465720000000000000000000000000000":"OptimisticAsserter","0x4f7074696d69737469634f7261636c6556330000000000000000000000000000":"OptimisticOracleV3"}}]
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x172fB6b07D6aB708dd67392a09e1c40d16dA0460","description":"set guard, avatar, target, delay, identifier, escalationManager, bond token and amount.","role":".owner"}]
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      template:
+        "uma/ProposerV2"
      description:
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens."
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      category:
+        {"name":"Shared Infrastructure","priority":4}
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"propose governance actions.","role":".proposer"}]
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      values.emergencyProposer:
+        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.owner:
+        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.proposer:
+        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      template:
+        "uma/GovernorV2"
      description:
+        "Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes."
      category:
+        {"name":"Shared Infrastructure","priority":4}
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF","description":"set fees for disputes and manage all roles in the contract.","role":".owner"},{"permission":"interact","from":"ethereum:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570","description":"manage the whitelist.","role":".owner"},{"permission":"interact","from":"ethereum:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE","description":"manage registered contracts.","role":".owner"},{"permission":"interact","from":"ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748","description":"remove and slash proposals, set the bond amount and the expiry time, manage the executor address.","role":".owner"},{"permission":"interact","from":"ethereum:0xdBF90434dF0B98219f87d112F37d74B1D90758c7","description":"manage the addresses on the whitelist.","role":".owner"},{"permission":"interact","from":"ethereum:0x40f941E48A552bF496B154Af6bf55725f18D77c3","description":"manage address mappings.","role":".owner"},{"permission":"interact","from":"ethereum:0x50efaC9619225d7fB4703C5872da978849B6E7cC","description":"set the bond amount.","role":".owner"},{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"manage all roles in the contract.","role":".owner"},{"permission":"interact","from":"ethereum:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE","description":"set critical administrative parameters like default bonds, bond token, fees.","role":".owner"}]
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      name:
-        "GnosisSafe"
+        "UMA Multisig"
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748","description":"remove proposals, execute emergency proposals.","role":".executor"}]
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      values.bondFmt:
+        "5,000,000"
      values.delayFmt:
+        "10d"
      template:
+        "uma/EmergencyProposer"
      description:
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"can bypass the voting system and execute proposals immediately.","role":".emergencyProposer"}]
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      template:
+        "uma/OptimisticOracleV3"
      description:
+        "Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes."
    }
```

```diff
+   Status: CREATED
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV2 (0xA0Ae6609447e57a42c51B50EAe921D701823FFAe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticOracle (0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
```

```diff
+   Status: CREATED
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
```

Generated with discovered.json: 0x837fe7986f62259fea8e0078e6b562d014501866

# Diff at Wed, 28 May 2025 13:55:58 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@498e4fbc23b0148c96248f03ca33a8415e632b71 block: 21629064
- current block number: 21629064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract UMA Voting Token v1 (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) {
    +++ description: None
      name:
-        "VotingToken"
+        "UMA Voting Token v1"
    }
```

Generated with discovered.json: 0x328f907a17728e2eb724575691bfa48e2b4db29c

# Diff at Tue, 27 May 2025 08:26:17 GMT:

- chain: ethereum
- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@fd658a9ed4bbd45fc5705d23b1906ca057d0d8b0 block: 21629064
- current block number: 21629064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      sourceHashes.12:
-        "0x535e1a3124295865c51f088c9c1b0d4aff2003c3ed2744a9f3d8c24d059b1de2"
      sourceHashes.11:
-        "0x96019d37901a28e311eaa7c1cf12caa35106001dba2273cfd3380b89952f6108"
      sourceHashes.10:
-        "0xddff88cf097843837c49f9ed19ac3343d4f1950d3e0508e63669fbd972e4100c"
      sourceHashes.9:
-        "0xa76e155468cff4d404ed0288be360d31e5ad958e5c2608e63134e03ec1d030c4"
      sourceHashes.8:
-        "0x6f2682c1f11312a6a8d948a5cf458cd0878e0b512e4e28f28c8444fd8a4bc91b"
      sourceHashes.7:
-        "0xdbc90380d4658e61987fc156f3647d7db9f8c00d8af551f3abbd1bae5ded1e28"
      sourceHashes.6:
-        "0x9efc9e4ba3961b565b36b5d255c7be95f240531bb7ffb97a3503db6bc34a5b77"
      sourceHashes.5:
-        "0xeaf1c83d9906c268afae35bf023ae9d7861e4bcdca5969bfd3c839e07bf3ae25"
      sourceHashes.4:
-        "0xf9087df539d680461ace025dfe27bd79d2eb110215ae416303b44629d7389219"
      sourceHashes.3:
-        "0x53d627be0e3afee6df116dcbf8d5988fe3b0e0c75fac31d03ec65870d7eb688e"
      sourceHashes.2:
-        "0x8692d1c129e074dfd45ba266215947cd7415ac1620b6aeca2d04cdfd593732ad"
      sourceHashes.1:
-        "0x662d43eeaf35f8a6d80e9b833573360c1a83f418e93c65db17cf46c7b47758e8"
+        "0xddff88cf097843837c49f9ed19ac3343d4f1950d3e0508e63669fbd972e4100c"
      sourceHashes.0:
-        "0x72a9f0d6928e2ccb1a94e23690974a84ecc5be50d3be866e39469534323eebed"
+        "0xf96bb1a4f35c949f170dae66f947e46f2e78265edaf26c1131507855ed435fae"
    }
```

Generated with discovered.json: 0x96c19c667c214211f2ac6c3aef34ad30f7979924

# Diff at Fri, 23 May 2025 09:40:52 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 21629064
- current block number: 21629064

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    EOA  (0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

```diff
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      receivedPermissions.1.role:
+        "admin"
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x867b8a5042864a2e9fd61be284b16f62632e7d10

# Diff at Mon, 12 May 2025 13:18:50 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5e25d362b71032c18a3417a2307d6923e1b5a519 block: 21629064
- current block number: 21629064

## Description

replace medium severity everywhere.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      fieldMeta.watcherManager.severity:
-        "MEDIUM"
+        "HIGH"
    }
```

Generated with discovered.json: 0x0c8da6db22cb7b2e131b229eb94be3ca61f730f4

# Diff at Tue, 29 Apr 2025 08:18:59 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 21629064
- current block number: 21629064

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134","via":[{"address":"0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"}]},{"permission":"upgrade","to":"0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b","via":[]}]
    }
```

```diff
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9","via":[]}]
    }
```

```diff
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134","via":[{"address":"0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"}]},{"permission":"upgrade","to":"0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b","via":[]}]
    }
```

Generated with discovered.json: 0x8f3c3693df5e37efe5a6513fe290f34401cafaf5

# Diff at Tue, 04 Mar 2025 10:38:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21629064
- current block number: 21629064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      sinceBlock:
+        18737765
    }
```

```diff
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) {
    +++ description: None
      sinceBlock:
+        9247089
    }
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      sinceBlock:
+        18056674
    }
```

```diff
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    +++ description: None
      sinceBlock:
+        19113187
    }
```

```diff
    contract xLayerZkHubConnector (0x279fDA9AdDB854541f0bb86733d924e28c24c625) {
    +++ description: None
      sinceBlock:
+        19612628
    }
```

```diff
    contract UpgradeBeaconProxy (0x28A9e7bbed277092E2431F186E1aF898962d4E92) {
    +++ description: None
      sinceBlock:
+        16232868
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: None
      sinceBlock:
+        9247083
    }
```

```diff
    contract Relayer3 (0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9) {
    +++ description: None
      sinceBlock:
+        13588014
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      sinceBlock:
+        16235215
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: None
      sinceBlock:
+        16697363
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      sinceBlock:
+        18737740
    }
```

```diff
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    +++ description: None
      sinceBlock:
+        18737822
    }
```

```diff
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24) {
    +++ description: None
      sinceBlock:
+        19113186
    }
```

```diff
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    +++ description: None
      sinceBlock:
+        18737767
    }
```

```diff
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99) {
    +++ description: None
      sinceBlock:
+        17086720
    }
```

```diff
    contract RelayerProxyHub1 (0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4) {
    +++ description: None
      sinceBlock:
+        16233378
    }
```

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    +++ description: None
      sinceBlock:
+        18737718
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: None
      sinceBlock:
+        16697276
    }
```

```diff
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E) {
    +++ description: None
      sinceBlock:
+        19287458
    }
```

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      sinceBlock:
+        19477398
    }
```

```diff
    contract UpgradeBeaconProxy (0x7D2596D7E44b0990611d390Fbb0Bd24e64845694) {
    +++ description: None
      sinceBlock:
+        16232831
    }
```

```diff
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1) {
    +++ description: None
      sinceBlock:
+        19113185
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      sinceBlock:
+        10688070
    }
```

```diff
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    +++ description: None
      sinceBlock:
+        18737820
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      sinceBlock:
+        16233067
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: None
      sinceBlock:
+        16697394
    }
```

```diff
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007) {
    +++ description: None
      sinceBlock:
+        14628098
    }
```

```diff
    contract MetisHubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    +++ description: None
      sinceBlock:
+        19113184
    }
```

```diff
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92) {
    +++ description: None
      sinceBlock:
+        15495566
    }
```

```diff
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    +++ description: None
      sinceBlock:
+        18737801
    }
```

```diff
    contract RelayerProxyHub3 (0xB4F8D176466f5F544bAd53737bffAaeA17185c05) {
    +++ description: None
      sinceBlock:
+        18737823
    }
```

```diff
    contract GnosisSafe (0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1) {
    +++ description: None
      sinceBlock:
+        16014519
    }
```

```diff
    contract RelayerProxyHub2 (0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28) {
    +++ description: None
      sinceBlock:
+        16940236
    }
```

```diff
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134) {
    +++ description: None
      sinceBlock:
+        11144602
    }
```

```diff
    contract Relayer7 (0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78) {
    +++ description: None
      sinceBlock:
+        14628096
    }
```

```diff
    contract PolygonHubConnector (0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116) {
    +++ description: None
      sinceBlock:
+        18737808
    }
```

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      sinceBlock:
+        12735567
    }
```

```diff
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    +++ description: None
      sinceBlock:
+        18737803
    }
```

```diff
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
    +++ description: None
      sinceBlock:
+        18044793
    }
```

```diff
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b) {
    +++ description: None
      sinceBlock:
+        19113188
    }
```

```diff
    contract Relayer11 (0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0) {
    +++ description: None
      sinceBlock:
+        19120190
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: None
      sinceBlock:
+        16636058
    }
```

Generated with discovered.json: 0xc9d590d2c9e950d79965533063187b27a3888995

# Diff at Mon, 20 Jan 2025 11:09:14 GMT:

- chain: ethereum
- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21629064
- current block number: 21629064

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      directlyReceivedPermissions.0.from:
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
    }
```

```diff
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      issuedPermissions.1.to:
+        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      issuedPermissions.0.target:
-        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
    }
```

```diff
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007) {
    +++ description: None
      issuedPermissions.0.target:
-        "0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
      issuedPermissions.0.to:
+        "0x6Fde30A7F4709A1739a32A8235Af651C038CeDf9"
    }
```

```diff
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92) {
    +++ description: None
      issuedPermissions.1.target:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      issuedPermissions.1.to:
+        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      issuedPermissions.0.target:
-        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134"
    }
```

```diff
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      receivedPermissions.1.from:
+        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      receivedPermissions.0.target:
-        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      receivedPermissions.0.from:
+        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      directlyReceivedPermissions.0.target:
-        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
      directlyReceivedPermissions.0.from:
+        "0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b"
    }
```

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      receivedPermissions.1.target:
-        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      receivedPermissions.1.from:
+        "0xaBcC9b596420A9E9172FD5938620E265a0f9Df92"
      receivedPermissions.0.target:
-        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
      receivedPermissions.0.from:
+        "0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99"
    }
```

Generated with discovered.json: 0x4b7c46a103cfc7425d971c364573e5fcbc38ca91

# Diff at Mon, 20 Jan 2025 09:24:28 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@82d3b5c180381f7d2d0e30406b2ac10025d0614f block: 21629064
- current block number: 21629064

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21629064 (main branch discovery), not current.

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      fieldMeta.watcherManager.type:
+        "PERMISSION"
    }
```

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    +++ description: None
      fieldMeta.WATCHERS.type:
+        "PERMISSION"
    }
```

Generated with discovered.json: 0x928d06b615df002af069b0d831fde9c695890f54

# Diff at Wed, 15 Jan 2025 09:44:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21388078
- current block number: 21629064

## Description

Signer change in a sub-MS.

## Watched changes

```diff
    contract GnosisSafe (0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1) {
    +++ description: None
      values.$members.1:
+        "0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
      values.$members.0:
-        "0xbe8109517300c78f2bbdC00d9EA8Cf597160017E"
+        "0x8B85EA591d41F29F5c741ea22Ed6B4ad71a750ba"
      values.multisigThreshold:
-        "1 of 1 (100%)"
+        "1 of 2 (50%)"
    }
```

Generated with discovered.json: 0xc7414748081f2c9e2bf85e8c9b38dc502ab947ae

# Diff at Thu, 12 Dec 2024 18:00:37 GMT:

- chain: ethereum
- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21285509
- current block number: 21388078

## Description

Multisig threshold change, ignored lastProposeAggregateRootAt.

## Watched changes

```diff
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b) {
    +++ description: None
      values.$members.13:
-        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.12:
-        "0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
      values.$members.11:
-        "0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
+        "0x349f3839012DB2271e1BeC68F1668471D175Adb9"
      values.$members.10:
-        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
+        "0x6a0A93Cd6d6FB7a36bF6234ef4650Bf9474e7682"
      values.$members.9:
-        "0x40b46a6C2DEFdCFC1b6Cfb667CD0c024F1FfBBA9"
+        "0xAabB54394E8dd61Dd70897E9c80be8de7C64A895"
      values.$members.8:
-        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
+        "0x691C2EF68e25E620fa6cAdE2728f6aE34F37aAD2"
      values.$members.7:
-        "0xB0C2CBFfCd4C31AFFEe14993b6d48f99D285f621"
+        "0xf0c1d7d38972c117F899Ea190afd6FeEee04E5fd"
      values.$members.6:
-        "0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
+        "0x01a0A7BaAAca31AFB5b770FeFD69CE4917D9c32e"
      values.$members.5:
-        "0x6fd2072B961aCC9bd6e188f957a0FB1CEb8632dc"
+        "0xEeD1Edd7599F2991159e3Fe71CC2010E9590037e"
      values.$members.4:
-        "0xc85aC6d2fdC376F335455D4cCA30c45ED1080849"
+        "0x5aA748326f03C651749E7998D88647e59Ee386Bc"
      values.$members.3:
-        "0x5aA748326f03C651749E7998D88647e59Ee386Bc"
+        "0xebD4919C075417a86F19713dADe101852867A04F"
      values.$members.2:
-        "0xebD4919C075417a86F19713dADe101852867A04F"
+        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
      values.$members.1:
-        "0xf83bC4688979b13Da02CB94c76cEB169540760b5"
+        "0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
      values.$members.0:
-        "0x58edE8C66A15f23c61b8EadD1191FdaD904f7a87"
+        "0xB65540bBA534E88EB4a5062D0E6519C07063b259"
      values.$threshold:
-        6
+        5
      values.multisigThreshold:
-        "6 of 14 (43%)"
+        "5 of 12 (42%)"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285509 (main branch discovery), not current.

```diff
    contract RelayerProxyHub3 (0xB4F8D176466f5F544bAd53737bffAaeA17185c05) {
    +++ description: None
      values.lastProposeAggregateRootAt:
-        1732782143
    }
```

Generated with discovered.json: 0x98b4f5e84bbaff9188ce66e71b18ab07b6613d18

# Diff at Tue, 10 Dec 2024 10:36:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21285509
- current block number: 21285509

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21285509 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract Relayer3 (0x43100A190C3FeAE37Cb1f5d880e8fa8d81BE5CB9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer10 (0x75bA5Af8EFFDCFca32E1e288806d54277D1fde99)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub1 (0x75C6A865c30da54e365Cb5Def728890B3DD8BDC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer5 (0x9B077C59fDe7de5AdCeF8093Bc38B61d43FC7007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer1 (0xaBcC9b596420A9E9172FD5938620E265a0f9Df92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub3 (0xB4F8D176466f5F544bAd53737bffAaeA17185c05)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RelayerProxyHub2 (0xcDbF9D438670D19d1Fb3954Abc8a13666b302b28)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllowanceModule (0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer7 (0xe8a5eE73f3c8F1Cd55915f6Eb5Fc7df4206f3C78)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xeD5cF41b0fD6A3C564c17eE34d9D26Eafc30619b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Relayer11 (0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0)
    +++ description: None
```

Generated with discovered.json: 0x08be3bca758a6a558eaa261af2e07743cd31e7ae

# Diff at Thu, 28 Nov 2024 10:09:41 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cba708dac9336030203b425721a33c9db2b14313 block: 21234596
- current block number: 21285509

## Description

Three signers removed, ALL others changed in Connext Multisig.

## Watched changes

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      values.$members.11:
-        "0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"
      values.$members.10:
-        "0xf8d8aF083aC452b05b0D2eb4499AD900324b5754"
      values.$members.9:
-        "0x1b526192C541DE6E23D73b4Afc4b6B45A75aeAdD"
      values.$members.8:
-        "0x320CBa820f33251d480Dcb79F7a9b1cc757aC12e"
+        "0xDbDcFbA39D6ace2DaC9Cf5E8fc0Fe80a074FD81b"
      values.$members.7:
-        "0xC832bB8015762B4857459551057EB61c68B93608"
+        "0x2eEd1440842990Fa61F0c396f981375Fa6004131"
      values.$members.6:
-        "0xe4d19c67ca0E9E3888158062De24321a0B272e73"
+        "0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1"
      values.$members.4:
-        "0x43A257c61e9Ef4750e426eC0770589509469b156"
+        "0x7AE8b0D6353F0931EB9FaC0A3562fA9e4C6Ff933"
      values.$members.2:
-        "0x450BCD84a040E6975a8092114A09cD37fA140873"
+        "0x334CE923420ff1aA4f272e92BF68013D092aE7B4"
      values.$members.1:
-        "0xc840e73B856f52E5491d6016daf5C7AE5e6beECD"
+        "0x3e11aa01A7eFdD428487ae75F5F4Fe0e5CeCeF06"
      values.$threshold:
-        8
+        7
      values.multisigThreshold:
-        "8 of 12 (67%)"
+        "7 of 9 (78%)"
    }
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xBE2Ac45e75c14e9EEf9712a94Dce355f0151f5B1)
    +++ description: None
```

## Source code changes

```diff
.../GnosisSafe.sol                                 |   0
 .../Proxy.p.sol                                    |   0
 .../GnosisSafe.sol                                 | 953 +++++++++++++++++++++
 .../GnosisSafeProxy.p.sol                          |  35 +
 4 files changed, 988 insertions(+)
```

Generated with discovered.json: 0x5eee3971ab4144323b5d80fcc9ca4a630463748a

# Diff at Thu, 21 Nov 2024 07:24:43 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@de1745323b367dd0fbb18ad6c862147dd90e90b0 block: 20640712
- current block number: 21234596

## Description

Config related: new gnosisSafe template match.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640712 (main branch discovery), not current.

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      values.getOwners:
-        ["0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f","0xade09131C6f43fe22C2CbABb759636C43cFc181e","0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315","0xb71C02f99c42424257745827F1C2beBD7Fa1e936","0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"]
      values.getThreshold:
-        1
      template:
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xcf3e778e85b0bbce6938806bdcff1180b6c74580

# Diff at Fri, 18 Oct 2024 10:53:54 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20640712
- current block number: 20640712

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640712 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"}]
    }
```

Generated with discovered.json: 0x043a4fcdeb9603f1615fbe53788e59778a48b5c4

# Diff at Mon, 14 Oct 2024 10:49:12 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20640712
- current block number: 20640712

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640712 (main branch discovery), not current.

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      sourceHashes:
+        ["0xafd1330f5a43ba6b2a2db1315900ef6a75051e339fa9194fe9f671742c237a57"]
    }
```

```diff
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) {
    +++ description: None
      sourceHashes:
+        ["0x349b0f612f02a8599667c43efe1e547bf4f18a46732001b3afb6b425a87325e9"]
    }
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      sourceHashes:
+        ["0xcecd27c998c8fd83d7532693da2bdff346a1dbedbaab4744f21d2bcf1986e9de"]
    }
```

```diff
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    +++ description: None
      sourceHashes:
+        ["0xe1e1cddf981135f49c5ed0fd4a3ec66db79e2bb91e3cfea59e69f5da6ab165df"]
    }
```

```diff
    contract xLayerZkHubConnector (0x279fDA9AdDB854541f0bb86733d924e28c24c625) {
    +++ description: None
      sourceHashes:
+        ["0x8481f131a096c9d34bb43b220f73a7469f938128e441e7f5009eef26a021b104"]
    }
```

```diff
    contract UpgradeBeaconProxy (0x28A9e7bbed277092E2431F186E1aF898962d4E92) {
    +++ description: None
      sourceHashes:
+        ["0x096b81df0c8f5335503eff3f349aa3136ee8cc6a502b3929f5112ae8b164ee0a"]
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: None
      sourceHashes:
+        ["0x6b81a32a0de6b3e8ed743f089a6518d3791b0e4d373300269439642482338ddb"]
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: None
      sourceHashes:
+        ["0x28c93f7b68e31548857633c6cb61284d9d2860cc0fbbcaaede8f631d364d66a4"]
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      sourceHashes:
+        ["0x2ca55720c3cf2b2da110bcd8d47329f5a7924e3de8b3324c8b55b45f99eb94fd"]
    }
```

```diff
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    +++ description: None
      sourceHashes:
+        ["0xa7941f612635ebe90bf4c5a4dbbb4a7aff8c388f20ac06c5f881670d8554004c"]
    }
```

```diff
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24) {
    +++ description: None
      sourceHashes:
+        ["0x874db65420d6ae87b7f30ff1947bd1ee09a2498028cb98e58d43ad47ff6e936f"]
    }
```

```diff
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    +++ description: None
      sourceHashes:
+        ["0xe1e1cddf981135f49c5ed0fd4a3ec66db79e2bb91e3cfea59e69f5da6ab165df"]
    }
```

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    +++ description: None
      sourceHashes:
+        ["0x291566f24c232f7b88a3772c2a88517ba7bf4aeb4224c9053aabaa34ae92f50c"]
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: None
      sourceHashes:
+        ["0xdf7f17e5c8ba1f0103fcfaf495da624089f8bfb3d5052217537bb064ca8c60b9"]
    }
```

```diff
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E) {
    +++ description: None
      sourceHashes:
+        ["0xe1e1cddf981135f49c5ed0fd4a3ec66db79e2bb91e3cfea59e69f5da6ab165df"]
    }
```

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      sourceHashes:
+        ["0xfe0725afd3cf2e5fb7627005a6bcf13ef7e35f78034eed2211edbffdb6a9aab5","0x618c83d2fbbe19fd6f2d6ee6ee79a60e6206e48bf361eaf4812e1c1fc14b4527"]
    }
```

```diff
    contract UpgradeBeaconProxy (0x7D2596D7E44b0990611d390Fbb0Bd24e64845694) {
    +++ description: None
      sourceHashes:
+        ["0x096b81df0c8f5335503eff3f349aa3136ee8cc6a502b3929f5112ae8b164ee0a"]
    }
```

```diff
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1) {
    +++ description: None
      sourceHashes:
+        ["0x8481f131a096c9d34bb43b220f73a7469f938128e441e7f5009eef26a021b104"]
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    +++ description: None
      sourceHashes:
+        ["0xec9f14911fa9c31669685bd1b89abbfa1a6a8bdd87f11af719c41ff7ec03987e"]
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      sourceHashes:
+        ["0xddff88cf097843837c49f9ed19ac3343d4f1950d3e0508e63669fbd972e4100c","0x72a9f0d6928e2ccb1a94e23690974a84ecc5be50d3be866e39469534323eebed","0x662d43eeaf35f8a6d80e9b833573360c1a83f418e93c65db17cf46c7b47758e8","0xf9087df539d680461ace025dfe27bd79d2eb110215ae416303b44629d7389219","0xa76e155468cff4d404ed0288be360d31e5ad958e5c2608e63134e03ec1d030c4","0xeaf1c83d9906c268afae35bf023ae9d7861e4bcdca5969bfd3c839e07bf3ae25","0x8692d1c129e074dfd45ba266215947cd7415ac1620b6aeca2d04cdfd593732ad","0x53d627be0e3afee6df116dcbf8d5988fe3b0e0c75fac31d03ec65870d7eb688e","0x6f2682c1f11312a6a8d948a5cf458cd0878e0b512e4e28f28c8444fd8a4bc91b","0x535e1a3124295865c51f088c9c1b0d4aff2003c3ed2744a9f3d8c24d059b1de2","0x96019d37901a28e311eaa7c1cf12caa35106001dba2273cfd3380b89952f6108","0x9efc9e4ba3961b565b36b5d255c7be95f240531bb7ffb97a3503db6bc34a5b77","0xdbc90380d4658e61987fc156f3647d7db9f8c00d8af551f3abbd1bae5ded1e28"]
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: None
      sourceHashes:
+        ["0x435ceb597bcf7bd820f593bdbc0e3ce4d223cc2203b368911d2b29fa6bc5e048"]
    }
```

```diff
    contract MetisHubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    +++ description: None
      sourceHashes:
+        ["0x8260bb2699f6ede98283b1bd9e2d1fdd52e11144aca41b7ba56f4257cee0dd9d"]
    }
```

```diff
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    +++ description: None
      sourceHashes:
+        ["0xa4857ef08af1733cc8a6fb1ce54561fe834c6dae2d6a2be176506833af7d6f9f"]
    }
```

```diff
    contract PolygonHubConnector (0xE8cF9EbB1cFB137c692a0a4E470E257B9417d116) {
    +++ description: None
      sourceHashes:
+        ["0x801d3cc7883546ac5e0bbb1c4872555739352f0ecf116f9f317f51732c9d08f6"]
    }
```

```diff
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    +++ description: None
      sourceHashes:
+        ["0xbe5ddf3ceaa76404a16ca4237ea9850cc76d59636c8de1526fab611e7d70ae6f"]
    }
```

```diff
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b) {
    +++ description: None
      sourceHashes:
+        ["0xa4857ef08af1733cc8a6fb1ce54561fe834c6dae2d6a2be176506833af7d6f9f"]
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: None
      sourceHashes:
+        ["0xfb2c9056673690384bb615fd326655f97b80fa2a5601a15a35065b0a68186ae7"]
    }
```

Generated with discovered.json: 0xaec4a912a3d3f29861db6f1357f53e67ba7a296f

# Diff at Tue, 01 Oct 2024 10:49:35 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20640712
- current block number: 20640712

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20640712 (main branch discovery), not current.

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
    }
```

Generated with discovered.json: 0x8bff205d514a54237007fec22c001f4543d064c7

# Diff at Fri, 30 Aug 2024 10:12:23 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@78fe1115153efe3e1ba2014fd74329156dca3951 block: 20569082
- current block number: 20640712

## Description

Optimistic mode reactivated. Messages are now now passed via offchain relayers and optimistically accepted onchain.

## Watched changes

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
+++ description: When it's disabled, all roots must be passed via canonical rollup AMBs.
      values.optimisticMode:
-        false
+        true
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
+++ description: When it's disabled, all roots must be passed via canonical rollup AMBs.
      values.optimisticMode:
-        false
+        true
    }
```

Generated with discovered.json: 0xc6f0227ea0811dbe5b8dc7cebee5685c432900aa

# Diff at Tue, 20 Aug 2024 09:57:39 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5417c4717b5cefeed17cd8419a7eb2dda22d4206 block: 20317972
- current block number: 20569082

## Description

The optimistic mode is deactivated on Ethereum by a watcher (0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d) and "slow" mode is active. All roots must now be passed via canonical rollup AMBs. On their bridge UI they have this message: "Due to adjustments with routers and liquidity pools this month, transaction processing on several paths may be slower than usual."

## Watched changes

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
+++ description: When it's disabled, all roots must be passed via canonical rollup AMBs.
      values.optimisticMode:
-        true
+        false
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
+++ description: When it's disabled, all roots must be passed via canonical rollup AMBs.
      values.optimisticMode:
-        true
+        false
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317972 (main branch discovery), not current.

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      fieldMeta:
+        {"optimisticMode":{"description":"When it's disabled, all roots must be passed via canonical rollup AMBs."}}
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      fieldMeta.optimisticMode:
+        {"description":"When it's disabled, all roots must be passed via canonical rollup AMBs."}
    }
```

Generated with discovered.json: 0x96e2d3515f785039b2980c9da704f2802cbb499e

# Diff at Fri, 09 Aug 2024 10:08:27 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20317972
- current block number: 20317972

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317972 (main branch discovery), not current.

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      values.$multisigThreshold:
-        "8 of 12 (67%)"
      values.getOwners:
-        ["0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb","0xc840e73B856f52E5491d6016daf5C7AE5e6beECD","0x450BCD84a040E6975a8092114A09cD37fA140873","0x8D09e20b835009E5320cC11E6a6F00aF451aD669","0x43A257c61e9Ef4750e426eC0770589509469b156","0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5","0xe4d19c67ca0E9E3888158062De24321a0B272e73","0xC832bB8015762B4857459551057EB61c68B93608","0x320CBa820f33251d480Dcb79F7a9b1cc757aC12e","0x1b526192C541DE6E23D73b4Afc4b6B45A75aeAdD","0xf8d8aF083aC452b05b0D2eb4499AD900324b5754","0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"]
      values.getThreshold:
-        8
      values.$members:
+        ["0xdFa28361aC40679cC5D8EFa74c0421961397f2Eb","0xc840e73B856f52E5491d6016daf5C7AE5e6beECD","0x450BCD84a040E6975a8092114A09cD37fA140873","0x8D09e20b835009E5320cC11E6a6F00aF451aD669","0x43A257c61e9Ef4750e426eC0770589509469b156","0x6B44Dba00e92DD035976607CBF62bf1CC6320EC5","0xe4d19c67ca0E9E3888158062De24321a0B272e73","0xC832bB8015762B4857459551057EB61c68B93608","0x320CBa820f33251d480Dcb79F7a9b1cc757aC12e","0x1b526192C541DE6E23D73b4Afc4b6B45A75aeAdD","0xf8d8aF083aC452b05b0D2eb4499AD900324b5754","0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f"]
      values.$threshold:
+        8
      values.multisigThreshold:
+        "8 of 12 (67%)"
    }
```

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      values.$multisigThreshold:
-        "1 of 5 (20%)"
      values.$members:
+        ["0x9b903Ae440CB1f01c342466D6DB6b57A5BF98C3f","0xade09131C6f43fe22C2CbABb759636C43cFc181e","0x7fB1B8D2C4a8186426Fb12a4Ae483f0093ED2315","0xb71C02f99c42424257745827F1C2beBD7Fa1e936","0xD7a8070F0875915dB9b9E03bD47A0b973d19130b"]
      values.$threshold:
+        1
      values.multisigThreshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x0c8c2fb63020264289bcd2c2930dce88b0953261

# Diff at Tue, 30 Jul 2024 11:10:39 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b2b6471ff62871f4956541f42ec025c356c08f7e block: 20317972
- current block number: 20317972

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20317972 (main branch discovery), not current.

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      fieldMeta:
+        {"connectorsHash":{"severity":"LOW","description":"Hash of all connectors' addresses. Changes when a connector is added or removed."},"watcherManager":{"severity":"MEDIUM","description":"Contract maintaining a list of Watchers able to stop the bridge if fraud is detected."}}
    }
```

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    +++ description: None
      fieldMeta:
+        {"WATCHERS":{"severity":"LOW","description":"Permissioned set of actors who can pause certain bridge components and remove connectors."}}
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      fieldMeta:
+        {"ROUTERS":{"description":"Routers can accelerate the bridging for users by fronting liquidity (for token transfers) or a bond (for crosschain contract calls) at the destination."},"relayerFeeVault":{"severity":"LOW","description":"This address receives the bridge fees"}}
    }
```

Generated with discovered.json: 0xa4d9b32a352fab45729f1039d1720c106e0f9af8

# Diff at Tue, 16 Jul 2024 08:47:32 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4cebc868d0be9a9868d2842c2670f1974594c48e block: 20310579
- current block number: 20317972

## Description

The Base connector that was accidentally removed is re-added.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.connectors.13:
+        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
+++ description: Hash of all connectors' addresses. Changes when a connector is added or removed.
+++ severity: LOW
      values.connectorsHash:
-        "0xa4e473cfb05a7a4dfaac6b579b027ef81b1daf44179b942325dddbba59d5e587"
+        "0xe813f3a6a50b9d0b90ac54107ca8ab16dd7faba907e4de56210c710200c60755"
    }
```

```diff
+   Status: CREATED
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94)
    +++ description: None
```

## Source code changes

```diff
.../amarok/ethereum/.flat/BaseHubConnector.sol     | 1005 ++++++++++++++++++++
 1 file changed, 1005 insertions(+)
```

Generated with discovered.json: 0x32989f7cdc1a82d82ea6c20e509b400658f02e98

# Diff at Mon, 15 Jul 2024 08:01:24 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c6bae99047cf03487a19e4008cfffabf520bcf2b block: 20289729
- current block number: 20310579

## Description

After ~1 week of using canonical AMBs for message passing, optimistic mode is re-activated for the connext bridge. The connector for base is not yet reconnected.

postmorten tldr from connext telegram:
> had two false positives from our watcher, the RPC was behind in a watcher with a slightly misconfigured rpc/quorum. First one threw the system into slow mode, second one removed the base connector as it (falsely) detected fraud on the amb

## Watched changes

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      values.optimisticMode:
-        false
+        true
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.optimisticMode:
-        false
+        true
    }
```

Generated with discovered.json: 0xf0a8f5e100287de45c70f0adc9d7086e8e93ca11

# Diff at Fri, 12 Jul 2024 10:09:44 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20259771
- current block number: 20289729

## Description

One of the op stack connectors (used for Base) is removed from the list of used connectors.
The support of Base L2 is now removed from connnext/amarok/everclear.
System is still in non-optimistic mode.

## Watched changes

```diff
-   Status: DELETED
    contract BaseHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94)
    +++ description: None
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.connectors.13:
-        "0x279fDA9AdDB854541f0bb86733d924e28c24c625"
      values.connectors.10:
-        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
+        "0x279fDA9AdDB854541f0bb86733d924e28c24c625"
+++ description: Hash of all connectors' addresses. Changes when a connector is added or removed.
+++ severity: LOW
      values.connectorsHash:
-        "0xc42a577ed5d3cd88fe742888027cc407ea75817228119d14e6d19cd8e80208d6"
+        "0xa4e473cfb05a7a4dfaac6b579b027ef81b1daf44179b942325dddbba59d5e587"
    }
```

## Source code changes

```diff
.../BaseHubConnector.sol => /dev/null              | 958 ---------------------
 1 file changed, 958 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20259771 (main branch discovery), not current.

```diff
    contract NewOptimismHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    +++ description: None
      name:
-        "NewOptimismHubConnector"
+        "BaseHubConnector"
    }
```

```diff
    contract OptimismV0HubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    +++ description: None
      name:
-        "OptimismV0HubConnector"
+        "MetisHubConnector"
    }
```

Generated with discovered.json: 0xfdb6fed8b35e97461c2db907f00033d0d31fcebd

# Diff at Mon, 08 Jul 2024 05:42:55 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e192ffbc9e265fdc44012a487bab5f0859ffe881 block: 20082446
- current block number: 20259771

## Description

The optimistic mode is deactivated on the ethereum domain by a watcher (`0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d`) with other chains following (https://app.blocksec.com/explorer/tx/base/0x4c550c961192befbd22a6eff5917ffdd41c33320ada8fd9bb340306a16385aff). Frontend automatically reflects this.

This is a rare phenomenon and means that all roots must now be passed via canonical rollup AMBs. The result can be seen by looking at SpokeConnectors on the Spoke domain chains that now emit `AggregateRootReceived` (`0x84ef18531155afdb0e64ff905d67044ae3aac63a6fba4661cfd9c4c14f289bc8`) each time a root is received via AMB.
Bridging can still be fast for users, just the reconciliation for LPs(routers) and slow-bridging (execution after reconciliation) much longer now. Also refer to the [architecture diagram on excalidraw](https://app.excalidraw.com/s/1Pobo8fNXle/7KAm671eZbq).

## Watched changes

```diff
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    +++ description: None
      values.optimisticMode:
-        true
+        false
    }
```

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.optimisticMode:
-        true
+        false
    }
```

Generated with discovered.json: 0x17beec9d610530d1b14aacb886211000ec5e431d

# Diff at Mon, 10 Jun 2024 06:13:47 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@023db9216bab49e9b3ffde0e43664e3e63c60fcf block: 19911056
- current block number: 20059566

## Description

A router is added.

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
+++ description: Routers can accelerate the bridging for users by fronting liquidity (for token transfers) or a bond (for crosschain contract calls) at the destination.
      values.ROUTERS.29:
+        "0x79EfFa11d95931A7e1717f9Eb655eE43e35Ef265"
    }
```

Generated with discovered.json: 0xc22730c77acab6c4f78ebd589f671e0ed63e7898

# Diff at Mon, 20 May 2024 12:12:41 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@477e1ce9602e5cbd6b592ca2ad6cfcdb8e416b72 block: 19624596
- current block number: 19911056

## Description

A new router and a new hub are added.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.connectors.13:
+        "0x279fDA9AdDB854541f0bb86733d924e28c24c625"
+++ description: Hash of all connectors' addresses. Changes when a connector is added or removed.
+++ severity: LOW
      values.connectorsHash:
-        "0x13d3fa9798ffd60797858bd05e95cbe3c3d7ebb6ee02922f0625e12f8bcbe51c"
+        "0xc42a577ed5d3cd88fe742888027cc407ea75817228119d14e6d19cd8e80208d6"
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      values.ROUTERS.28:
+        "0xd839958F37f89F80c9520c2f3F4abE29168EeF1B"
    }
```

```diff
+   Status: CREATED
    contract xLayerZkHubConnector (0x279fDA9AdDB854541f0bb86733d924e28c24c625)
    +++ description: None
```

## Source code changes

```diff
...0x279fDA9AdDB854541f0bb86733d924e28c24c625.sol} |   0
 ...-0x7ed49D0a13255802A281C08688563bd8D5f726b1.sol | 769 +++++++++++++++++++++
 2 files changed, 769 insertions(+)
```

Generated with discovered.json: 0xe66b6789a0cadd7ee2873b545abb9cd6cf542101

# Diff at Wed, 10 Apr 2024 10:21:54 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d472f6526a98fb96aa82ff01c0dbb2a9ad638c0e block: 19531406
- current block number: 19624596

## Description

The OptimisticGovernors bond is reduced from 5 to 2 ETH. This bond has to be posted with each proposal.

## Watched changes

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
    +++ description: None
      values.bondAmount:
-        "5000000000000000000"
+        "2000000000000000000"
      values.getProposalBond:
-        "5000000000000000000"
+        "2000000000000000000"
    }
```

Generated with discovered.json: 0xe3a1c5468421a3a6936776e8fd06dd4be298a474

# Diff at Thu, 28 Mar 2024 08:27:00 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@867de6120241d47b66bf76f83c490408eb3595b0 block: 19517972
- current block number: 19531406

## Description

Update discovery to include the multisig threshold.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19517972 (main branch discovery), not current.

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
    +++ description: None
      upgradeability.threshold:
+        "8 of 12 (67%)"
    }
```

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      upgradeability.threshold:
+        "1 of 5 (20%)"
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

Generated with discovered.json: 0x00e8f6fe2ff1e801c73b28ac65367c537e9b2588

# Diff at Tue, 26 Mar 2024 10:19:30 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@e6ff14fa637ed6c3a674ff43e070f1cf65f4aa1e block: 19482562
- current block number: 19517972

## Description

One new router is added by the Connext Fee Multisig. Ignore Fee Multisig nonce.

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
      values.ROUTERS.27:
+        "0xc82C7d826b1eD0b2A4E9A2bE72B445416f901FD1"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19482562 (main branch discovery), not current.

```diff
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A) {
    +++ description: None
      values.nonce:
-        1
    }
```

Generated with discovered.json: 0x2b9a2dbfa0e1df2aabd59731d5051595c6415516

# Diff at Thu, 21 Mar 2024 10:53:07 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@3d626df8a3d129805d6a0f5894ea1a2e437970ee block: 19441852
- current block number: 19482562

## Description

Add two routers and change the relayer fee vault from the Gnosis Safe (Multisig 2) to a different one.
The new fee vault Multisig has a 1/5 threshold (old one 3/5) and only keeps 2 of the old signers.

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
    +++ description: None
+++ description: This address receives the bridge fees
+++ severity: LOW
      values.relayerFeeVault:
-        "0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378"
+        "0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A"
      values.ROUTERS.26:
+        "0xc770eC66052fe77ff2eF9edF9558236e2D1C41Ef"
      values.ROUTERS.25:
+        "0x5f4E31F4F402E368743bF29954f80f7C4655EA68"
    }
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Connext Fee Multisig (0x7bE978Cc84612E08f7844672B0E6A6F367FE2b6A)
    +++ description: None
```

## Source code changes

```diff
.../implementation/contracts/Safe.sol}             | 289 +++++++++++----------
 .../implementation/contracts/SafeL2.sol            |  74 ++++++
 .../implementation/contracts/base/Executor.sol     |  19 +-
 .../contracts/base/FallbackManager.sol             |  82 ++++++
 .../implementation/contracts/base/GuardManager.sol |  79 ++++++
 .../contracts/base/ModuleManager.sol               | 191 ++++++++++++++
 .../implementation/contracts/base/OwnerManager.sol |  96 ++++---
 .../implementation/contracts/common/Enum.sol       |  13 +
 .../common/NativeCurrencyPaymentFallback.sol       |  18 ++
 .../contracts/common/SecuredTokenTransfer.sol      |  38 +++
 .../contracts/common/SelfAuthorized.sol            |  18 ++
 .../contracts/common/SignatureDecoder.sol          |  36 +++
 .../implementation/contracts/common/Singleton.sol  |  13 +
 .../contracts/common/StorageAccessible.sol         |  14 +-
 .../contracts/external/SafeMath.sol}               |  28 +-
 .../contracts/interfaces/IERC165.sol               |  15 ++
 .../contracts/interfaces/ISignatureValidator.sol   |   6 +-
 .../Connext Fee Multisig/implementation/meta.txt   |   2 +
 .../proxy/contracts/proxies/SafeProxy.sol          |  50 ++++
 .../.code/Connext Fee Multisig/proxy/meta.txt      |   2 +
 .../implementation/contracts/GnosisSafe.sol        |   0
 .../implementation/contracts/base/Executor.sol     |   0
 .../contracts/base/FallbackManager.sol             |   0
 .../implementation/contracts/base/GuardManager.sol |   0
 .../contracts/base/ModuleManager.sol               |   0
 .../implementation/contracts/base/OwnerManager.sol |   0
 .../implementation/contracts/common/Enum.sol       |   0
 .../contracts/common/EtherPaymentFallback.sol      |   0
 .../contracts/common/SecuredTokenTransfer.sol      |   0
 .../contracts/common/SelfAuthorized.sol            |   0
 .../contracts/common/SignatureDecoder.sol          |   0
 .../implementation/contracts/common/Singleton.sol  |   0
 .../contracts/common/StorageAccessible.sol         |   0
 .../contracts/external/GnosisSafeMath.sol          |   0
 .../contracts/interfaces/ISignatureValidator.sol   |   0
 .../GnosisSafe}/implementation/meta.txt            |   0
 .../GnosisSafe}/proxy/Proxy.sol                    |   0
 .../GnosisSafe}/proxy/meta.txt                     |   0
 .../base/FallbackManager.sol => /dev/null          |  53 ----
 .../contracts/base/GuardManager.sol => /dev/null   |  50 ----
 .../contracts/base/ModuleManager.sol => /dev/null  | 133 ----------
 .../contracts/common/Enum.sol => /dev/null         |   8 -
 .../common/EtherPaymentFallback.sol => /dev/null   |  13 -
 .../common/SecuredTokenTransfer.sol => /dev/null   |  35 ---
 .../common/SelfAuthorized.sol => /dev/null         |  16 --
 .../common/SignatureDecoder.sol => /dev/null       |  36 ---
 .../contracts/common/Singleton.sol => /dev/null    |  11 -
 .../implementation/meta.txt => /dev/null           |   2 -
 .../proxy/GnosisSafeProxy.sol => /dev/null         | 155 -----------
 .../proxy/meta.txt => /dev/null                    |   2 -
 50 files changed, 886 insertions(+), 711 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19441852 (main branch discovery), not current.

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
    +++ description: None
      name:
-        "Connext Multisig 2"
+        "GnosisSafe"
    }
```

Generated with discovered.json: 0xb76dcd04bed4c034b382d58f57e071221946805c

# Diff at Wed, 13 Mar 2024 08:08:25 GMT:

- chain: ethereum
- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@800d2d30954e8bfb14ad062b9806c50997706541 block: 19317899
- current block number: 19424856

## Description

New Connector 'OptimismHubConnector' added, matches the source code of existing connector in index 4 (OP Mainnet connector).
This connector is for the op stack L2 Mode Network and now renamed to 'ModeHubConnector'.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    +++ description: None
      values.connectors[12]:
+        "0x7b2bE683266909A6a4068e743083dd40621d663E"
+++ description: Hash of all connectors' addresses. Changes when a connector is added or removed.
+++ severity: LOW
      values.connectorsHash:
-        "0x14b530936915b09786ec041c63aa2b1ec72eb6cdefd18fe41d79b92b93aa90bd"
+        "0x13d3fa9798ffd60797858bd05e95cbe3c3d7ebb6ee02922f0625e12f8bcbe51c"
    }
```

```diff
+   Status: CREATED
    contract ModeHubConnector (0x7b2bE683266909A6a4068e743083dd40621d663E)
    +++ description: None
```

## Source code changes

```diff
.../@openzeppelin/contracts/utils/Address.sol      | 244 +++++++++++++++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 ++++++++++++++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++++++
 .../messaging/connectors/HubConnector.sol          |  44 ++++
 .../messaging/connectors/optimism/BaseOptimism.sol |  28 +++
 .../connectors/optimism/OptimismHubConnector.sol   | 148 +++++++++++++
 .../messaging/connectors/optimism/lib/Types.sol    |  84 +++++++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++++++
 .../messaging/interfaces/IRootManager.sol          |  22 ++
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |  25 +++
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++++++++++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++++
 .../ethereum/.code/ModeHubConnector/meta.txt       |   2 +
 14 files changed, 1180 insertions(+)
```

Generated with discovered.json: 0xedbcbcd69c61aab19a00452e1a0f26ed281f8f56

# Diff at Tue, 27 Feb 2024 09:09:39 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@4f9617ef0b726c0af67b0e31e0d1ed434f10f1ef block: 19267405
- current block number: 19317899

## Description

Two Watcher addresses are changed.

## Watched changes

```diff
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
      values.WATCHERS.1:
-        "0x917133b1dE100E9fF8F03E24c43F9272dD6A8E99"
+        "0x151Ea574C62b505aEe2F89f33D8c152E28A956b0"
      values.WATCHERS.0:
-        "0x9c77788d761ee0347Ab550883237CeD274a0F248"
+        "0x56dD71fffD089EdAdbA8eCdaaDb94269713f8f4d"
    }
```

Generated with discovered.json: 0x76284a08ee267ddde579dbc4f104ea8865a380fa

# Diff at Tue, 20 Feb 2024 07:23:08 GMT:

- chain: ethereum
- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@308930b4cc7f93870a161e88abb1361d44caae90 block: 19176699
- current block number: 19267405

## Description

A new proposal is submitted, related to identifier update, and a new relayer is added.

## Watched changes

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
      values.numProposals:
-        198
+        199
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.RELAYERS[13]:
+        "0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0"
    }
```

Generated with discovered.json: 0x658319b9c3fe837c9e09311f58fef75b5fc7adcd

# Diff at Wed, 07 Feb 2024 13:46:24 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@70a2c5f9336d4d624160533a78c31ce52c7bbe58 block: 19126411
- current block number: 19176699

## Description

Removed ZkSyncHubConnector.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
      values.connectors[12]:
-        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectors.8:
-        "0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB"
+        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectorsHash:
-        "0x14c4bf163ae7a6600a7ae29528ef8d2fe05fb8d77cf4be6201ac10f3c92fcb2e"
+        "0x14b530936915b09786ec041c63aa2b1ec72eb6cdefd18fe41d79b92b93aa90bd"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19126411 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract ZkSyncHubConnector (0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB) {
    }
```

Generated with discovered.json: 0x3173a709fca8a83c7486e3febdd1d1700357d694

# Diff at Wed, 31 Jan 2024 12:18:08 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8530982d7716e84f0c3870f09585b94f46c2e4bc block: 18990101
- current block number: 19126411

## Description

Added six new connectors, but in reality only four of them are unique. New and
unique connectors are:

- MantleHubConnector
- ZkSyncHubConnector
- PolygonZkHubConnector
- OptimismV0HubConnector

OptimismV0 uses a pre-bedrock version of the optimism contracts. There are two
_new_ connectors that in reality are just the same code - no diff between the
new and old - from WormholeHubConnector and OptimismHubConnector.

## Watched changes

```diff
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
      values.connectors[12]:
+        "0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa"
      values.connectors[11]:
+        "0x7ed49D0a13255802A281C08688563bd8D5f726b1"
      values.connectors[10]:
+        "0x23b7abe4cc664F24Eb68E80cFAdc572857799a94"
      values.connectors[9]:
+        "0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24"
      values.connectors[8]:
+        "0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB"
      values.connectors[7]:
+        "0xf5a3372ed529FCD0690b6013EAaE04170ec0626b"
      values.connectorsHash:
-        "0xec2e6a01e97f05ecaf76a70e989737bba3d7b1e9b1409ace525f00a0ee16c137"
+        "0x14c4bf163ae7a6600a7ae29528ef8d2fe05fb8d77cf4be6201ac10f3c92fcb2e"
    }
```

```diff
+   Status: CREATED
    contract NewOptimismHubConnector (0x23b7abe4cc664F24Eb68E80cFAdc572857799a94) {
    }
```

```diff
+   Status: CREATED
    contract MantleHubConnector (0x5B0E1a507E786f0a7c11C972ad5F4dd254661e24) {
    }
```

```diff
+   Status: CREATED
    contract ZkSyncHubConnector (0x63C6c79F3E79406B62f8623881cBFD7B2Ec1E8cB) {
    }
```

```diff
+   Status: CREATED
    contract PolygonZkHubConnector (0x7ed49D0a13255802A281C08688563bd8D5f726b1) {
    }
```

```diff
+   Status: CREATED
    contract OptimismV0HubConnector (0x9Ba7D2Ab079Bd1924859e2fECDAD1bEBe5B119Fa) {
    }
```

```diff
+   Status: CREATED
    contract NewWormholeHubConnector (0xf5a3372ed529FCD0690b6013EAaE04170ec0626b) {
    }
```

## Source code changes

```diff
.../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/mantle/MantleHubConnector.sol       | 187 ++++++
 .../connectors/optimism-v0/BaseOptimismV0.sol      |  28 +
 .../connectors/optimism-v0/lib/BytesUtils.sol      | 135 ++++
 .../connectors/optimism-v0/lib/MerkleTrie.sol      | 291 +++++++++
 .../connectors/optimism-v0/lib/OVMCodec.sol        |  40 ++
 .../optimism-v0/lib/PredeployAddresses.sol         |  21 +
 .../connectors/optimism-v0/lib/RLPReader.sol       | 381 ++++++++++++
 .../optimism-v0/lib/SecureMerkleTrie.sol           |  68 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../ambs/mantle/IStateCommitmentChain.sol          | 102 +++
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../contracts/shared/libraries/TypedMemView.sol    | 687 ++++++++++++++++++++
 .../ethereum/.code/MantleHubConnector/meta.txt     |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../messaging/connectors/optimism/BaseOptimism.sol |  28 +
 .../connectors/optimism/OptimismHubConnector.sol   | 148 +++++
 .../messaging/connectors/optimism/lib/Types.sol    |  84 +++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |  25 +
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../.code/NewOptimismHubConnector/meta.txt         |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../messaging/connectors/wormhole/BaseWormhole.sol | 137 ++++
 .../connectors/wormhole/WormholeHubConnector.sol   |  69 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/wormhole/IWormholeReceiver.sol |  49 ++
 .../interfaces/ambs/wormhole/IWormholeRelayer.sol  | 691 +++++++++++++++++++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../.code/NewWormholeHubConnector/meta.txt         |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/optimism-v0/BaseOptimismV0.sol      |  28 +
 .../optimism-v0/OptimismV0HubConnector.sol         | 186 ++++++
 .../connectors/optimism-v0/lib/BytesUtils.sol      | 135 ++++
 .../connectors/optimism-v0/lib/MerkleTrie.sol      | 291 +++++++++
 .../connectors/optimism-v0/lib/OVMCodec.sol        |  40 ++
 .../optimism-v0/lib/PredeployAddresses.sol         |  21 +
 .../connectors/optimism-v0/lib/RLPReader.sol       | 381 ++++++++++++
 .../optimism-v0/lib/SecureMerkleTrie.sol           |  68 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../interfaces/ambs/optimism/OptimismAmb.sol       |  28 +
 .../ambs/optimism-v0/IStateCommitmentChain.sol     | 101 +++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../contracts/shared/libraries/TypedMemView.sol    | 687 ++++++++++++++++++++
 .../ethereum/.code/OptimismV0HubConnector/meta.txt |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/polygonzk/BasePolygonZk.sol         |  67 ++
 .../connectors/polygonzk/PolygonZkHubConnector.sol |  42 ++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../ambs/polygonzk/IBridgeMessageReceiver.sol      |   9 +
 .../ambs/polygonzk/IPolygonZkEVMBridge.sol         | 117 ++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../ethereum/.code/PolygonZkHubConnector/meta.txt  |   2 +
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts/messaging/connectors/GasCap.sol      |  61 ++
 .../messaging/connectors/HubConnector.sol          |  44 ++
 .../connectors/zksync/ZkSyncHubConnector.sol       | 138 ++++
 .../contracts/messaging/interfaces/IConnector.sol  |  64 ++
 .../messaging/interfaces/IRootManager.sol          |  22 +
 .../messaging/interfaces/ambs/zksync/IZkSync.sol   | 191 ++++++
 .../contracts/shared/ProposedOwnable.sol           | 172 +++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 ++
 .../ethereum/.code/ZkSyncHubConnector/meta.txt     |   2 +
 91 files changed, 10959 insertions(+)
```

Generated with discovered.json: 0x2205517d3479bdc0b356b55a229b76d5deb3faea

# Diff at Fri, 12 Jan 2024 10:04:41 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@29bf7dab0273e12e067979db6a3b622e6e34f64f block: 18941290
- current block number: 18990101

## Description

New router, empty at the time of discovering this

## Watched changes

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.ROUTERS[24]:
+        "0xBa11aA59645a56031fedBcCF60D4f111534f2502"
    }
```

# Diff at Fri, 05 Jan 2024 13:12:40 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9b1911b38ffdc811ae8c1518aae762bfe4831370 block: 18620064
- current block number: 18941290

## Description

This update is for the Bacco upgrade.
Read [this blog post](https://medium.com/connext/introducing-the-bacco-network-upgrade-73ad19cee9ed) before continuing to read further.

An example of Optimistic root proposal, finalization and submission into the Mainnet spoke.
A root is proposed [here](https://ethtx.info/mainnet/0x8623518d4c60d5cc85d817c3d7b17bafa24a3699756ff43d4c519dfe4e624397/).
After around 30 minutes it is [finalized](https://ethtx.info/mainnet/0x1dd1482174233218b482bcd6ccf971b52e021d5920254335fb46ea57e0e72f22/).
After some time, the root gets saved to the MainnetSpokeConnector [here](https://ethtx.info/mainnet/0x67415da90ec170de7c7138081b5446903258f0337ffe012228bbf0da8b5f6f3a/).

Any watcher can enable the Slow Mode which reverts back to the original behaviour of root propagation.
Only the owner can re-enable the optimistic mode.
There is no on-chain fraud proof, if the watcher believes that the proposed root is invalid he can put the bridge into the Slow Mode thus invalidating the proposed root.
There is no penalty (slashing) for invalidating a proposed root that is not fraudulent which allows for risk-minimized censoring.

### MainnetSpokeConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

- MainnetSpokeConnector:

Saves the aggregated root while in Optimistic Mode.
Proposing and finalizing the aggregated root is deprecated in this contract.

- SpokeConnector:

Many new similar helper functions/values as in `RootManager`.

### RootManager

- Queue: Simpler check for removedItems, bool instead of counting.
- WatcherClient: Calling `renounceOwnership` now reverts instead of doing nothing.
- WatcherManager: Calling `renounceOwnership` now reverts instead of doing nothing.
- MerkleTreeManager: Now saving leaf and nonce status. Leaves have this FSM: None -> Proven -> Processed.
- RootManager:

Now keeps track of values that are required to operate in optimistic mode.
For example: the number of blocks that watchers have to claim a dispute, the proposed root hash as well as the list of white listed proposers.
Introduced functions to add/remove proposers, set new values for minimum dispute block length and the actual dispute block length.
Optimistic proposal of a root has the following path: `proposeAggregateRoot()` -> `finalize()`.
This workflow does not require the call to `propagate()`, but if someone calls that it's going to skip the Mainnet Spoke because it would use `sendMessage()` which is intended for Slow Mode only.
To send the aggregated root while the system is in Optimistic Mode one should use `sendRootToHubSpoke()`.
As written above, any watcher can enable Slow Mode, thus invalidating the proposed root hash, but only the owner can re-enable the Optimistic Mode.

Potential for an issue, in `setMinDisputeBlocks` the owner can set the
`minDisputeBlocks` but it does not check if the new value is less-or-equal than the `disputeBlocks`.

### WatcherManager

Calling `renounceOwnership` now reverts instead of doing nothing.

### ArbitrumHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### GnosisHubConnector

Introduced a lower gas threshold that needs to be breached to send a message to Gnosis.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

### LineaHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### OptimismHubConnector

The way the message root is recovered is simplified.
I'd assume that is because Optimism restructured their message binary packing.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

### PolygonHubConnector

Adds a check to make sure that it does not process the same message root twice.
Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.

### WormholeHubConnector

Connector allows to withdraw funds with the `withdrawFunds` function, emits an `FundsWithdrawn` event.
Gas cap is now made public.

## Watched changes

```diff
-   Status: DELETED
    contract LineaHubConnector OLD (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

```diff
-   Status: DELETED
    contract GnosisHubConnector OLD (0x245F757d660C3ec65416168690431076d58d6413) {
    }
```

```diff
    contract Connext Multisig (0x4d50a469fc788a3c0CdC8Fd67868877dCb246625) {
      values.getOwners.2:
-        "0xaBcC62f573963F0B1aD9334CaEd3f4Acab8d3FEA"
+        "0x450BCD84a040E6975a8092114A09cD37fA140873"
    }
```

```diff
-   Status: DELETED
    contract OptimismHubConnector OLD (0x66a425f09cfd613d40A986B3ef800AA7604C8eeE) {
    }
```

```diff
-   Status: DELETED
    contract WormholeHubConnector OLD (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
    }
```

```diff
-   Status: DELETED
    contract WatcherManager (0x6a595E41893a5ACBA9dBf8288B92eb71106Ba7A6) {
    }
```

```diff
    contract GnosisSafe (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
      values.getOwners[3]:
+        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      values.getOwners.2:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.getOwners.1:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.getOwners.0:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    contract ConnextBridge (0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6) {
      values.RELAYERS[12]:
+        "0xB4F8D176466f5F544bAd53737bffAaeA17185c05"
      values.xAppConnectionManager:
-        "0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c"
+        "0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc"
    }
```

```diff
-   Status: DELETED
    contract PolygonHubConnector OLD (0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE) {
    }
```

```diff
-   Status: DELETED
    contract ArbitrumHubConnector OLD (0xd151C9ef49cE2d30B829a98A07767E3280F70961) {
    }
```

```diff
-   Status: DELETED
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
    }
```

```diff
-   Status: DELETED
    contract MainnetSpokeConnector (0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c) {
    }
```

```diff
+   Status: CREATED
    contract MainnetSpokeConnector (0x02fdF04AF077687CDA03Bd3162388b7972A4a1Cc) {
    }
```

```diff
+   Status: CREATED
    contract RootManager (0x523AB7424AD126809b1d7A134eb6E0ee414C9B3A) {
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x56Ab287e5c33Ee70158c951f34818bd095446255) {
    }
```

```diff
+   Status: CREATED
    contract OptimismHubConnector (0x5c2149869146DeA55cDD1CF2DD828e4e1548bb2A) {
    }
```

```diff
+   Status: CREATED
    contract WatcherManager (0x79e6E0242405A66B2dd8B96DEd3b2F0216Fd417d) {
    }
```

```diff
+   Status: CREATED
    contract ArbitrumHubConnector (0x83096c7455f24E593aaC9A7c73f849d36d3EEb82) {
    }
```

```diff
+   Status: CREATED
    contract WormholeHubConnector (0xae6B9cDE6191b710F5A18D82f751Ba52B78a99DA) {
    }
```

```diff
+   Status: CREATED
    contract GnosisHubConnector (0xF1c78967584D5E0ffF66dA103b8eb06c82EC020d) {
    }
```

## Source code changes

```diff
.../crosschain/arbitrum/LibArbitrumL1.sol          |   0
 .../@openzeppelin/contracts/crosschain/errors.sol  |   0
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/vendor/arbitrum/IBridge.sol          |   0
 .../contracts/vendor/arbitrum/IOutbox.sol          |   0
 .../contracts/messaging/connectors/Connector.sol   |  23 +
 .../messaging/connectors/HubConnector.sol          |   0
 .../connectors/arbitrum/ArbitrumHubConnector.sol   |   0
 .../contracts/messaging/interfaces/IConnector.sol  |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/arbitrum/IArbitrumInbox.sol    |   0
 .../interfaces/ambs/arbitrum/IArbitrumOutbox.sol   |   0
 .../interfaces/ambs/arbitrum/IArbitrumRollup.sol   |   0
 .../contracts/shared/ProposedOwnable.sol           |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../contracts/shared/libraries/TypedMemView.sol    |   0
 .../ethereum/.code/ArbitrumHubConnector/meta.txt   |   2 +
 .../ArbitrumHubConnector OLD/meta.txt => /dev/null |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/gnosis/GnosisBase.sol     |  29 +
 .../connectors/gnosis/GnosisHubConnector.sol       |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../messaging/interfaces/ambs/GnosisAmb.sol        |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/GnosisHubConnector/meta.txt     |   2 +
 .../GnosisHubConnector OLD/meta.txt => /dev/null   |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/linea/LineaBase.sol       |   0
 .../connectors/linea/LineaHubConnector.sol         |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../messaging/interfaces/ambs/LineaAmb.sol         |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/LineaHubConnector/meta.txt      |   2 +
 .../LineaHubConnector OLD/meta.txt => /dev/null    |   2 -
 .../contracts/messaging/MerkleTreeManager.sol      |  66 +-
 .../contracts/messaging/WatcherClient.sol          |   4 +-
 .../contracts/messaging/WatcherManager.sol         |   4 +-
 .../contracts/messaging/connectors/Connector.sol   |  23 +
 .../messaging/connectors/SpokeConnector.sol        | 508 ++++++++++++---
 .../connectors/mainnet/MainnetSpokeConnector.sol   |  83 ++-
 .../messaging/interfaces/IHubSpokeConnector.sol    |   6 +
 .../contracts/messaging/interfaces/IOutbox.sol     |   5 +
 .../contracts/messaging/libraries/SnapshotId.sol   |  25 +
 .../MainnetSpokeConnector/meta.txt                 |   2 +-
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts}/messaging/connectors/Connector.sol  |  23 +
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/optimism/BaseOptimism.sol |   0
 .../connectors/optimism/OptimismHubConnector.sol   |  14 +-
 .../messaging/connectors/optimism/lib/Types.sol    |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/optimism/IOptimismPortal.sol   |   0
 .../interfaces/ambs/optimism/OptimismAmb.sol       |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/OptimismHubConnector/meta.txt   |   2 +
 .../OptimismHubConnector OLD/meta.txt => /dev/null |   2 -
 .../shared/libraries/TypedMemView.sol => /dev/null | 687 ---------------------
 .../connectors/Connector.sol => /dev/null          | 193 ------
 .../polygon/PolygonHubConnector.sol => /dev/null   |  65 --
 .../polygon/lib/ExitPayloadReader.sol => /dev/null | 164 -----
 .../connectors/polygon/lib/Merkle.sol => /dev/null |  40 --
 .../lib/MerklePatriciaProof.sol => /dev/null       | 153 -----
 .../polygon/lib/RLPReader.sol => /dev/null         | 342 ----------
 .../tunnel/FxBaseRootTunnel.sol => /dev/null       | 180 ------
 .../PolygonHubConnector OLD/meta.txt => /dev/null  |   2 -
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/MerkleTreeManager.sol      |  66 +-
 .../contracts/messaging/RootManager.sol            | 487 ++++++++++++++-
 .../contracts/messaging/WatcherClient.sol          |   4 +-
 .../contracts/messaging/WatcherManager.sol         |   4 +-
 .../messaging/interfaces/IHubSpokeConnector.sol    |   6 +
 .../contracts/messaging/libraries/Queue.sol        |   8 +-
 .../contracts/messaging/libraries/SnapshotId.sol   |  25 +
 .../{.code@18620064 => .code}/RootManager/meta.txt |   2 +-
 .../WatcherManager/messaging/WatcherManager.sol    |   4 +-
 .../WatcherManager/meta.txt                        |   2 +-
 .../@openzeppelin/contracts/utils/Address.sol      | 244 ++++++++
 .../contracts/messaging/connectors/Connector.sol   | 216 +++++++
 .../contracts}/messaging/connectors/GasCap.sol     |   7 +-
 .../messaging/connectors/HubConnector.sol          |   0
 .../messaging/connectors/wormhole/BaseWormhole.sol |   0
 .../connectors/wormhole/WormholeHubConnector.sol   |   0
 .../contracts}/messaging/interfaces/IConnector.sol |   0
 .../messaging/interfaces/IRootManager.sol          |   0
 .../interfaces/ambs/wormhole/IWormholeReceiver.sol |   0
 .../interfaces/ambs/wormhole/IWormholeRelayer.sol  |   0
 .../contracts}/shared/ProposedOwnable.sol          |   0
 .../shared/interfaces/IProposedOwnable.sol         |   0
 .../ethereum/.code/WormholeHubConnector/meta.txt   |   2 +
 .../connectors/Connector.sol => /dev/null          | 193 ------
 .../connectors/HubConnector.sol => /dev/null       |  44 --
 .../interfaces/IConnector.sol => /dev/null         |  64 --
 .../interfaces/IRootManager.sol => /dev/null       |  22 -
 .../WormholeHubConnector OLD/meta.txt => /dev/null |   2 -
 .../shared/ProposedOwnable.sol => /dev/null        | 172 ------
 .../interfaces/IProposedOwnable.sol => /dev/null   |  42 --
 108 files changed, 2990 insertions(+), 2563 deletions(-)
```

## Config related changes

Following changes come from updates made to the config file,
not from differences found during discovery. Values are
for block 18620064 (main branch discovery), not current.

```diff
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
      name:
-        "LineaHubConnector"
+        "LineaHubConnector OLD"
    }
```

```diff
    contract OptimisticGovernor (0x172fB6b07D6aB708dd67392a09e1c40d16dA0460) {
      upgradeability.type:
-        "immutable"
+        "gnosis safe zodiac module"
      upgradeability.avatar:
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      upgradeability.target:
+        "0x4d50a469fc788a3c0CdC8Fd67868877dCb246625"
      upgradeability.guard:
+        "0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract GnosisHubConnector (0x245F757d660C3ec65416168690431076d58d6413) {
      name:
-        "GnosisHubConnector"
+        "GnosisHubConnector OLD"
    }
```

```diff
    contract OptimismHubConnector (0x66a425f09cfd613d40A986B3ef800AA7604C8eeE) {
      name:
-        "OptimismHubConnector"
+        "OptimismHubConnector OLD"
    }
```

```diff
    contract WormholeHubConnector (0x69009c6f567590d8B469dbF4C8808e8ee32b8a45) {
      name:
-        "WormholeHubConnector"
+        "WormholeHubConnector OLD"
    }
```

```diff
    contract PolygonHubConnector (0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE) {
      name:
-        "PolygonHubConnector"
+        "PolygonHubConnector OLD"
    }
```

```diff
    contract ArbitrumHubConnector (0xd151C9ef49cE2d30B829a98A07767E3280F70961) {
      name:
-        "ArbitrumHubConnector"
+        "ArbitrumHubConnector OLD"
    }
```

# Diff at Tue, 21 Nov 2023 12:24:08 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@9f0318505c4ed8d37a7f843ad157191e2e5c6ee2

## Description

Added connector for Linea.

## Watched changes

```diff
    contract RootManager (0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1) {
      values.connectors[6]:
+        "0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D"
      values.connectorsHash:
-        "0x1ab775b9545e9c3175b57958dc75c2a1cf76c3d166d0527bbf7d51fe434efa00"
+        "0x9e95f76ad984f886dd7a8431e8fa5c405fce573b4b2a4671aeb68d7464ab164b"
    }
```

```diff
+   Status: CREATED
    contract LineaHubConnector (0x076cD2B25cb1Ed7272d716bdeb4A8551CF606a3D) {
    }
```

## Source code changes

```diff
.../messaging/connectors/Connector.sol             | 193 +++++++++++++++++++++
 .../messaging/connectors/HubConnector.sol          |  44 +++++
 .../messaging/connectors/linea/LineaBase.sol       |  16 ++
 .../connectors/linea/LineaHubConnector.sol         |  73 ++++++++
 .../messaging/interfaces/IConnector.sol            |  64 +++++++
 .../messaging/interfaces/IRootManager.sol          |  22 +++
 .../messaging/interfaces/ambs/LineaAmb.sol         |  88 ++++++++++
 .../ethereum/.code/LineaHubConnector/meta.txt      |   2 +
 .../LineaHubConnector/shared/ProposedOwnable.sol   | 172 ++++++++++++++++++
 .../shared/interfaces/IProposedOwnable.sol         |  42 +++++
 10 files changed, 716 insertions(+)
```

# Diff at Tue, 07 Nov 2023 11:21:30 GMT:

- chain: ethereum
- author: Amin Latifi (<a.latifi.al@gmail.com>)
- comparing to: main@bcbd5d376f2f1df169f0ac5ce430862eef6be17f

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

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@10dbc30af490bd7af5cfca51b827ce3f10182f4d

## Watched changes

```diff
    contract Connext Multisig 2 (0xf2964cCcB7CDA9e808aaBe8DB0DDDAF7890dd378) {
      values.getThreshold:
-        1
+        3
    }
```

