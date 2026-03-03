Generated with discovered.json: 0x44cd358cec70a670fb84792a76ed5defad37bba6

# Diff at Tue, 03 Mar 2026 10:05:10 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@55155f296ca2a5300f99eb2f8aa264ed51893f2d block: 1759781222
- current timestamp: 1759781222

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759781222 (main branch discovery), not current.

```diff
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      values.getLastProcessingRefSlot:
-        12743999
      template:
+        "tokens/Lido/ValidatorsExitBusOracle"
    }
```

```diff
    contract Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0xB314D4A76C457c93150d308787939063F4Cc67E0","role":"admin"}
    }
```

```diff
    contract CSFeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) {
    +++ description: None
      values.getConsensusReport:
-        {"hash":"0x742312ede76447c95b1a1f9ddfdabc1c02a7fd0fcd2a332c1dcd8221d89cc16c","refSlot":12672479,"processingDeadlineTime":1761312971,"processingStarted":true}
      values.getLastProcessingRefSlot:
-        12672479
      template:
+        "tokens/Lido/CSFeeOracle"
    }
```

```diff
    contract CSAccounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      values.getActualLockedBond:
-        [0,0,0,0,0]
      values.getBond:
-        ["13280448660295532030","25826627859852877247","8015475175151572667","2851511178601980838","16237439667328342654"]
      values.getBondCurve:
-        [[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]]]
      values.getBondCurveId:
-        [2,2,2,1,1]
      values.getBondShares:
-        ["10924814826882310705","21245602026627142420","6593721663922635237","2345721323116679800","13357306380663207248"]
      values.getBondSummary:
-        [["13280448660295532030","13200000000000000000"],["25826627859852877247","24900000000000000000"],["8015475175151572667","8000000000000000000"],["2851511178601980838","2800000000000000000"],["16237439667328342654","15800000000000000000"]]
      values.getBondSummaryShares:
-        [["10924814826882310705","10858635834042479300"],["21245602026627142420","20483335777852858680"],["6593721663922635237","6580991414571199576"],["2345721323116679800","2303346995099919851"],["13357306380663207248","12997458043778119162"]]
      values.getClaimableBondShares:
-        ["66178992839831405","762266248774283740","12730249351435661","42374328016759949","359848336885088086"]
      values.getCurveInfo:
-        [[[[1,"2400000000000000000","2400000000000000000"],[2,"3700000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]]]
      values.getLockedBondInfo:
-        [[0,0],[0,0],[0,0],[0,0],[0,0]]
      values.getUnbondedKeysCount:
-        [0,0,0,0,0]
      values.getUnbondedKeysCountToEject:
-        [0,0,0,0,0]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"SET_BOND_CURVE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xC52fC3081123073078698F1EAc2f1Dc7Bd71880f","eth:0xB314D4A76C457c93150d308787939063F4Cc67E0"]},"0xb5dffea014b759c493d63b1edaceb942631d6468998125e1b4fe427c99082134":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"MANAGE_BOND_CURVES_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"PAUSE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x7914b5a1539b97Bd0bbd155757F25FD79A522d24","eth:0xE1686C2E90eb41a48356c1cC7FaA17629af3ADB3"]},"RESUME_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x7914b5a1539b97Bd0bbd155757F25FD79A522d24"]}}
      errors:
-        {"getActualLockedBond":"Processing error occurred.","getBond":"Processing error occurred.","getBondCurve":"Processing error occurred.","getBondCurveId":"Processing error occurred.","getBondShares":"Processing error occurred.","getBondSummary":"Processing error occurred.","getBondSummaryShares":"Processing error occurred.","getClaimableBondShares":"Processing error occurred.","getLockedBondInfo":"Processing error occurred.","getUnbondedKeysCount":"Processing error occurred.","getUnbondedKeysCountToEject":"Processing error occurred."}
      template:
+        "tokens/Lido/CSAccounting"
    }
```

```diff
    contract AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      values.getLastProcessingRefSlot:
-        12743999
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"MANAGE_CONSENSUS_VERSION_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]}}
      template:
+        "tokens/Lido/AccountingOracle"
    }
```

```diff
    contract ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      values.getEVMScriptRegistry:
-        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getInitializationBlock:
-        11473216
      values.permissions.eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb_0x0b719b33c83b8e5d300c521cb8b54ae9bd933996a14bef8c2f4e0285d2d2400a:
-        {"app":"eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb","role":"CREATE_PERMISSIONS_ROLE","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249_0xf5a08927c847d7a29dc35e105208dbde5ce951392105d712761cc5d17440e2ff:
-        {"app":"eth:0xf73a1260d222f447210581DDf212D915c09a3249","role":"0xf5a08927c847d7a29dc35e105208dbde5ce951392105d712761cc5d17440e2ff","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c_0xcebf517aa4440d1d125e0355aae64401211d0848a23c02cc5d29a14822580ba4:
-        {"app":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","role":"0xcebf517aa4440d1d125e0355aae64401211d0848a23c02cc5d29a14822580ba4","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c_0xb421f7ad7646747f3051c50c0b8e2377839296cd4973e27f63821d73e390338f:
-        {"app":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","role":"0xb421f7ad7646747f3051c50c0b8e2377839296cd4973e27f63821d73e390338f","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c_0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c:
-        {"app":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","role":"0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86_0x563165d3eae48bcb0a092543ca070d989169c98357e9a1b324ec5da44bab75fd:
-        {"app":"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86","role":"0x563165d3eae48bcb0a092543ca070d989169c98357e9a1b324ec5da44bab75fd","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86_0x30597dd103acfaef0649675953d9cb22faadab7e9d9ed57acc1c429d04b80777:
-        {"app":"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86","role":"0x30597dd103acfaef0649675953d9cb22faadab7e9d9ed57acc1c429d04b80777","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86_0x5de467a460382d13defdc02aacddc9c7d6605d6d4e0b8bd2f70732cae8ea17bc:
-        {"app":"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86","role":"0x5de467a460382d13defdc02aacddc9c7d6605d6d4e0b8bd2f70732cae8ea17bc","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e_0xad15e7261800b4bb73f1b69d3864565ffb1fd00cb93cf14fe48da8f1f2149f39:
-        {"app":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","role":"0xad15e7261800b4bb73f1b69d3864565ffb1fd00cb93cf14fe48da8f1f2149f39","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e_0xda3972983e62bdf826c4b807c4c9c2b8a941e1f83dfa76d53d6aeac11e1be650:
-        {"app":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","role":"0xda3972983e62bdf826c4b807c4c9c2b8a941e1f83dfa76d53d6aeac11e1be650","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e_0xe7dcd7275292e064d090fbc5f3bd7995be23b502c1fed5cd94cfddbbdcd32bbc:
-        {"app":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","role":"0xe7dcd7275292e064d090fbc5f3bd7995be23b502c1fed5cd94cfddbbdcd32bbc","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xf73a1260d222f447210581DDf212D915c09a3249"]}
      values.permissions.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5_0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754:
-        {"app":"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5","role":"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5_0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6:
-        {"app":"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5","role":"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"]}
      values.permissions.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5_0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8:
-        {"app":"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5","role":"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}
      values.permissions.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433_0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6:
-        {"app":"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433","role":"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433_0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8:
-        {"app":"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433","role":"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433_0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754:
-        {"app":"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433","role":"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754","manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433_0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee:
-        {"app":"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433","role":"0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee","manager":"eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977","entityCount":83}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249_0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686:
-        {"app":"eth:0xf73a1260d222f447210581DDf212D915c09a3249","role":"0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249_0x95ffc68daedf1eb334cfcd22ee24a5eeb5a8e58aa40679f2ad247a84140f8d6e:
-        {"app":"eth:0xf73a1260d222f447210581DDf212D915c09a3249","role":"0x95ffc68daedf1eb334cfcd22ee24a5eeb5a8e58aa40679f2ad247a84140f8d6e","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86_0xd35e458bacdd5343c2f050f574554b2f417a8ea38d6a9a65ce2225dbe8bb9a9d:
-        {"app":"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86","role":"0xd35e458bacdd5343c2f050f574554b2f417a8ea38d6a9a65ce2225dbe8bb9a9d","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86_0xd79730e82bfef7d2f9639b9d10bf37ebb662b22ae2211502a00bdf7b2cc3a23a:
-        {"app":"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86","role":"0xd79730e82bfef7d2f9639b9d10bf37ebb662b22ae2211502a00bdf7b2cc3a23a","manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb:
+        {"CREATE_PERMISSIONS_ROLE":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249:
+        {"ASSIGN_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"MINT_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"REVOKE_VESTINGS_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c:
+        {"EXECUTE_ROLE":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]},"RUN_SCRIPT_ROLE":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]},"TRANSFER_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86"]}}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86:
+        {"EXECUTE_PAYMENTS_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"MANAGE_PAYMENTS_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"CREATE_PAYMENTS_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"CHANGE_PERIOD_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"CHANGE_BUDGETS_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e:
+        {"MODIFY_QUORUM_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"MODIFY_SUPPORT_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"CREATE_VOTES_ROLE":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xf73a1260d222f447210581DDf212D915c09a3249"]}}
      values.permissions.eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5:
+        {"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"]},"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}}
      values.permissions.eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433:
+        {"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee":{"manager":"eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977","entityCount":83}}
    }
```

```diff
    contract CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f) {
    +++ description: None
      template:
+        "tokens/Lido/CSStrikes"
    }
```

```diff
    contract CSFeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      values.distributedShares:
-        ["196458706200864250","505224116619211946",0,"25599846018515934",0]
      values.getHistoricalDistributionData:
-        [[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0]]
      values.logCid:
-        "QmPPFkydgtnwMBDF6nZZaU5nnqy3csbKts3UfRRgWXreEu"
      values.treeCid:
-        "QmQMPFA42KXn115k1c2qC9AyXKV45JKcaB1svMGQ7ZvCqz"
      errors:
-        {"distributedShares":"Processing error occurred.","getHistoricalDistributionData":"Processing error occurred."}
      template:
+        "tokens/Lido/CSFeeDistributor"
    }
```

```diff
    contract TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B) {
    +++ description: None
      template:
+        "tokens/Lido/TriggerableWithdrawalsGateway"
    }
```

```diff
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      values.getAllNodeOperatorDigests:
-        [[[0,true,[0,0,0,0,0,1720,8629,1771]],[1,false,[1,0,0,0,0,1000,1000,0]],[2,true,[0,0,0,0,0,4022,10931,2069]],[3,true,[0,0,0,0,0,3628,10537,1463]],[4,true,[0,0,0,0,0,2273,9182,1318]],[5,true,[0,0,0,0,0,3874,10783,2217]],[6,true,[0,0,0,0,0,3577,10486,514]],[7,true,[0,0,0,0,0,3542,10451,549]],[8,true,[0,0,0,0,0,10157,10579,0]],[9,true,[0,0,0,0,0,3565,10474,526]],[10,true,[0,0,0,0,0,3553,10462,538]],[11,true,[0,0,0,0,0,3563,10472,528]],[12,false,[1,0,0,0,0,2300,2300,0]],[13,true,[0,0,0,0,0,3487,10396,604]],[14,true,[0,0,0,0,0,3173,10082,918]],[15,true,[0,0,0,0,0,3562,10471,529]],[16,true,[0,0,0,0,0,3459,10368,632]],[17,true,[0,0,0,0,0,3272,10181,419]],[18,true,[0,0,0,0,0,3486,10395,605]],[19,true,[0,0,0,0,0,11711,18621,1380]],[20,true,[0,0,0,0,0,3485,10394,606]],[21,true,[0,0,0,0,0,2470,9379,122]],[22,true,[0,0,0,0,0,2485,9394,1606]],[23,true,[0,0,0,0,0,3484,10393,607]],[24,true,[0,0,0,0,0,3480,10389,1611]],[25,true,[0,0,0,0,0,3480,10389,111]],[26,true,[0,0,0,0,0,3477,10386,614]],[27,true,[0,0,0,0,0,3272,10181,2919]],[28,true,[0,0,0,0,0,3479,10388,612]],[29,true,[0,0,0,0,0,3478,10387,2613]],[30,true,[0,0,0,0,0,1729,8639,3943]],[31,true,[0,0,0,0,0,2171,9081,169]],[32,true,[0,0,0,0,0,2455,9365,335]],[33,true,[0,0,0,0,0,1708,8618,2382]],[34,true,[0,0,0,0,0,2465,9375,1625]],[35,true,[0,0,0,0,0,1708,8618,3382]],[36,true,[0,0,0,0,0,8991,12757,3234]],[37,true,[0,0,0,0,0,2263,9173,2827]],[38,true,[0,0,0,0,0,2465,9375,625]]],[[0,true,[0,0,0,0,0,0,80,0]],[1,true,[0,0,0,0,0,0,80,0]],[2,true,[0,0,0,0,0,0,80,0]],[3,true,[0,0,0,0,0,0,80,0]],[4,true,[0,0,0,0,0,0,80,0]],[5,true,[0,0,0,0,0,0,80,0]],[6,true,[0,0,0,0,0,0,80,0]],[7,true,[0,0,0,0,0,0,80,0]],[8,true,[0,0,0,0,0,0,80,0]],[9,true,[0,0,0,0,0,0,80,0]],[10,true,[0,0,0,0,0,0,80,0]],[11,true,[0,0,0,0,0,0,80,0]],[12,true,[0,0,0,0,0,0,80,0]],[13,true,[0,0,0,0,0,0,80,0]],[14,true,[0,0,0,0,0,0,80,0]],[15,true,[0,0,0,0,0,0,80,0]],[16,true,[0,0,0,0,0,0,80,0]],[17,true,[0,0,0,0,0,0,80,0]],[18,true,[0,0,0,0,0,0,80,0]],[19,true,[0,0,0,0,0,0,80,0]],[20,true,[0,0,0,0,0,0,80,0]],[21,true,[0,0,0,0,0,0,80,0]],[22,true,[0,0,0,0,0,0,80,0]],[23,true,[0,0,0,0,0,0,80,0]],[24,true,[0,0,0,0,0,80,160,0]],[25,true,[0,0,0,0,0,0,80,0]],[26,true,[0,0,0,0,0,0,80,0]],[27,true,[0,0,0,0,0,0,80,0]],[28,true,[0,0,0,0,0,0,80,0]],[29,true,[0,0,0,0,0,0,80,0]],[30,true,[0,0,0,0,0,0,80,0]],[31,true,[0,0,0,0,0,60,140,0]],[32,true,[0,0,0,0,0,0,80,0]],[33,true,[0,0,0,0,0,5,85,0]],[34,true,[0,0,0,0,0,0,80,0]],[35,true,[0,0,0,0,0,0,80,0]],[36,true,[0,0,0,0,0,80,80,0]],[37,true,[0,0,0,0,0,0,80,0]],[38,true,[0,0,0,0,0,0,500,0]],[39,true,[0,0,0,0,0,0,500,0]],[40,true,[0,0,0,0,0,0,500,0]],[41,true,[0,0,0,0,0,0,500,0]],[42,true,[0,0,0,0,0,374,874,0]],[43,true,[0,0,0,0,0,0,500,0]],[44,true,[0,0,0,0,0,0,500,0]],[45,true,[0,0,0,0,0,0,500,0]],[46,true,[0,0,0,0,0,0,500,0]],[47,true,[0,0,0,0,0,0,500,0]],[48,true,[0,0,0,0,0,0,80,0]],[49,true,[0,0,0,0,0,0,80,0]],[50,true,[0,0,0,0,0,0,80,0]],[51,true,[0,0,0,0,0,0,80,0]],[52,true,[0,0,0,0,0,0,80,0]],[53,true,[0,0,0,0,0,0,80,0]],[54,true,[0,0,0,0,0,0,80,0]],[55,true,[0,0,0,0,0,0,80,0]],[56,true,[0,0,0,0,0,0,80,0]],[57,true,[0,0,0,0,0,0,80,0]],[58,true,[0,0,0,0,0,0,80,0]],[59,true,[0,0,0,0,0,0,80,0]],[60,true,[0,0,0,0,0,0,80,0]],[61,true,[0,0,0,0,0,0,80,0]],[62,true,[0,0,0,0,0,0,80,0]],[63,true,[0,0,0,0,0,0,80,0]],[64,true,[0,0,0,0,0,0,80,0]],[65,true,[0,0,0,0,0,0,80,0]],[66,true,[0,0,0,0,0,0,80,0]],[67,true,[0,0,0,0,0,0,78,2]],[68,true,[0,0,0,0,0,0,78,2]],[69,true,[0,0,0,0,0,0,78,2]],[70,true,[0,0,0,0,0,0,78,2]],[71,true,[0,0,0,0,0,0,78,2]],[72,true,[0,0,0,0,0,0,78,2]],[73,true,[0,0,0,0,0,0,78,2]],[74,true,[0,0,0,0,0,0,77,3]],[75,true,[0,0,0,0,0,0,77,3]],[76,true,[0,0,0,0,0,0,77,3]],[77,true,[0,0,0,0,0,0,77,3]],[78,true,[0,0,0,0,0,0,77,3]],[79,true,[0,0,0,0,0,0,77,3]],[80,true,[0,0,0,0,0,0,77,3]],[81,true,[0,0,0,0,0,0,77,3]]],[[0,true,[0,0,0,0,0,0,6,4]],[1,true,[0,0,0,0,0,0,19,0]],[2,true,[0,0,0,0,0,0,5,1]],[3,true,[0,0,0,0,0,0,2,0]],[4,true,[0,0,0,0,0,0,12,0]],[5,true,[0,0,0,0,0,0,12,0]],[6,true,[0,0,0,0,0,0,12,0]],[7,true,[0,0,0,0,0,0,1,2]],[8,true,[0,0,0,0,0,0,1,0]],[9,true,[0,0,0,0,0,0,12,0]],[10,true,[0,0,0,0,0,0,1,0]],[11,true,[0,0,0,0,0,0,8,0]],[12,true,[0,0,0,0,0,0,7,0]],[13,true,[0,0,0,0,0,0,12,0]],[14,true,[0,0,0,0,0,0,1,0]],[15,true,[0,0,0,0,0,0,1,0]],[16,true,[0,0,0,0,0,0,1,0]],[17,true,[0,0,0,0,0,0,9,0]],[18,true,[0,0,0,0,0,0,4,0]],[19,true,[0,0,0,0,0,0,12,4]],[20,true,[0,0,0,0,0,0,242,0]],[21,true,[0,0,0,0,0,0,12,0]],[22,true,[0,0,0,0,0,0,100,0]],[23,true,[0,0,0,0,0,0,16,0]],[24,true,[0,0,0,0,0,0,12,0]],[25,true,[0,0,0,0,0,0,24,4]],[26,true,[0,0,0,0,0,1,1,0]],[27,true,[0,0,0,0,0,0,70,0]],[28,true,[0,0,0,0,0,0,12,0]],[29,true,[0,0,0,0,0,0,70,0]],[30,true,[0,0,0,0,0,0,2,0]],[31,true,[0,0,0,0,0,0,70,0]],[32,true,[0,0,0,0,0,0,70,0]],[33,true,[0,0,0,0,0,1,1,0]],[34,true,[0,0,0,0,0,8,16,0]],[35,true,[0,0,0,0,0,0,304,133]],[36,true,[0,0,0,0,0,12,12,0]],[37,true,[0,0,0,0,0,0,15,1]],[38,true,[0,0,0,0,0,0,4,0]],[39,true,[0,0,0,0,0,0,12,0]],[40,true,[0,0,0,0,0,0,32,0]],[41,true,[0,0,0,0,0,0,1,0]],[42,true,[0,0,0,0,0,0,1,0]],[43,true,[0,0,0,0,0,0,16,0]],[44,true,[0,0,0,0,0,0,1,0]],[45,true,[0,0,0,0,0,1,1,0]],[46,true,[0,0,0,0,0,0,12,4]],[47,true,[0,0,0,0,0,1,6,0]],[48,true,[0,0,0,0,0,0,12,0]],[49,true,[0,0,0,0,0,0,12,4]],[50,true,[0,0,0,0,0,0,12,1]],[51,true,[0,0,0,0,0,0,1,0]],[52,true,[0,0,0,0,0,0,2,0]],[53,true,[0,0,0,0,0,0,12,0]],[54,true,[0,0,0,0,0,0,16,0]],[55,true,[0,0,0,0,0,0,12,0]],[56,true,[0,0,0,0,0,0,12,0]],[57,true,[0,0,0,0,0,1,1,0]],[58,true,[0,0,0,0,0,0,12,4]],[59,true,[0,0,0,0,0,0,12,0]],[60,true,[0,0,0,0,0,5,5,0]],[61,true,[0,0,0,0,0,0,2,0]],[62,true,[0,0,0,0,0,0,8,0]],[63,true,[0,0,0,0,0,1,1,0]],[64,true,[0,0,0,0,0,12,12,0]],[65,true,[0,0,0,0,0,0,13,0]],[66,true,[0,0,0,0,0,0,5,0]],[67,true,[0,0,0,0,0,0,3,0]],[68,true,[0,0,0,0,0,0,89,0]],[69,true,[0,0,0,0,0,0,2,8]],[70,true,[0,0,0,0,0,0,12,0]],[71,true,[0,0,0,0,0,6,12,0]],[72,true,[0,0,0,0,0,0,1,0]],[73,true,[0,0,0,0,0,3,3,0]],[74,true,[0,0,0,0,0,0,5,0]],[75,true,[0,0,0,0,0,1,1,0]],[76,true,[0,0,0,0,0,5,5,0]],[77,true,[0,0,0,0,0,0,12,0]],[78,true,[0,0,0,0,0,3,3,0]],[79,true,[0,0,0,0,0,0,13,3]],[80,true,[0,0,0,0,0,0,28,0]],[81,true,[0,0,0,0,0,0,12,19]],[82,true,[0,0,0,0,0,0,12,0]],[83,true,[0,0,0,0,0,0,4,1]],[84,true,[0,0,0,0,0,0,10,0]],[85,true,[0,0,0,0,0,0,1,0]],[86,true,[0,0,0,0,0,12,12,0]],[87,true,[0,0,0,0,0,0,20,0]],[88,true,[0,0,0,0,0,0,1,0]],[89,true,[0,0,0,0,0,0,12,4]],[90,true,[0,0,0,0,0,0,12,0]],[91,true,[0,0,0,0,0,0,12,0]],[92,true,[0,0,0,0,0,0,5,0]],[93,true,[0,0,0,0,0,0,12,0]],[94,true,[0,0,0,0,0,12,12,0]],[95,true,[0,0,0,0,0,0,2,0]],[96,true,[0,0,0,0,0,0,12,0]],[97,true,[0,0,0,0,0,0,12,0]],[98,true,[0,0,0,0,0,0,43,0]],[99,true,[0,0,0,0,0,0,12,3]],[100,true,[0,0,0,0,0,0,12,0]],[101,true,[0,0,0,0,0,1,1,0]],[102,true,[0,0,0,0,0,0,12,0]],[103,true,[0,0,0,0,0,0,49,1]],[104,true,[0,0,0,0,0,0,4,0]],[105,true,[0,0,0,0,0,0,239,0]],[106,true,[0,0,0,0,0,0,2,0]],[107,true,[0,0,0,0,0,0,12,0]],[108,true,[0,0,0,0,0,0,2,0]],[109,true,[0,0,0,0,0,3,3,0]],[110,true,[0,0,0,0,0,0,12,0]],[111,true,[0,0,0,0,0,0,1,0]],[112,true,[0,0,0,0,0,0,1,0]],[113,true,[0,0,0,0,0,12,12,0]],[114,true,[0,0,0,0,0,0,2,1]],[115,true,[0,0,0,0,0,0,12,0]],[116,true,[0,0,0,0,0,0,11,0]],[117,true,[0,0,0,0,0,1,1,0]],[118,true,[0,0,0,0,0,0,2,0]],[119,true,[0,0,0,0,0,0,1,0]],[120,true,[0,0,0,0,0,8,12,0]],[121,true,[0,0,0,0,0,1,1,0]],[122,true,[0,0,0,0,0,1,1,0]],[123,true,[0,0,0,0,0,0,5,0]],[124,true,[0,0,0,0,0,0,81,0]],[125,true,[0,0,0,0,0,0,12,68]],[126,true,[0,0,0,0,0,5,5,0]],[127,true,[0,0,0,0,0,11,12,15]],[128,true,[0,0,0,0,0,0,12,0]],[129,true,[0,0,0,0,0,0,16,0]],[130,true,[0,0,0,0,0,0,16,0]],[131,true,[0,0,0,0,0,6,6,0]],[132,true,[0,0,0,0,0,0,10,0]],[133,true,[0,0,0,0,0,0,12,0]],[134,true,[0,0,0,0,0,0,1,0]],[135,true,[0,0,0,0,0,4,4,0]],[136,true,[0,0,0,0,0,0,3,0]],[137,true,[0,0,0,0,0,3,3,0]],[138,true,[0,0,0,0,0,1,1,0]],[139,true,[0,0,0,0,0,12,12,0]],[140,true,[0,0,0,0,0,8,8,0]],[141,true,[0,0,0,0,0,0,12,0]],[142,true,[0,0,0,0,0,2,2,0]],[143,true,[0,0,0,0,0,0,12,0]],[144,true,[0,0,0,0,0,0,163,0]],[145,true,[0,0,0,0,0,0,1,0]],[146,true,[0,0,0,0,0,12,12,0]],[147,true,[0,0,0,0,0,0,12,0]],[148,true,[0,0,0,0,0,0,12,0]],[149,true,[0,0,0,0,0,12,12,0]],[150,true,[0,0,0,0,0,0,1,0]],[151,true,[0,0,0,0,0,0,39,1]],[152,true,[0,0,0,0,0,0,20,0]],[153,true,[0,0,0,0,0,0,2,0]],[154,true,[0,0,0,0,0,0,12,24]],[155,true,[0,0,0,0,0,12,12,0]],[156,true,[0,0,0,0,0,1,1,0]],[157,true,[0,0,0,0,0,1,1,0]],[158,true,[0,0,0,0,0,1,1,0]],[159,true,[0,0,0,0,0,0,108,0]],[160,true,[0,0,0,0,0,0,12,0]],[161,true,[0,0,0,0,0,0,6,0]],[162,true,[0,0,0,0,0,0,12,0]],[163,true,[0,0,0,0,0,0,12,0]],[164,true,[0,0,0,0,0,1,1,0]],[165,true,[0,0,0,0,0,0,1,0]],[166,true,[0,0,0,0,0,0,143,0]],[167,true,[0,0,0,0,0,21,118,0]],[168,true,[0,0,0,0,0,0,12,0]],[169,true,[0,0,0,0,0,0,12,0]],[170,true,[0,0,0,0,0,0,2,0]],[171,true,[0,0,0,0,0,0,37,0]],[172,true,[0,0,0,0,0,0,12,0]],[173,true,[0,0,0,0,0,0,1,0]],[174,true,[0,0,0,0,0,0,12,0]],[175,true,[0,0,0,0,0,0,12,0]],[176,true,[0,0,0,0,0,1,1,0]],[177,true,[0,0,0,0,0,0,1,0]],[178,true,[0,0,0,0,0,1,1,0]],[179,true,[0,0,0,0,0,1,1,0]],[180,true,[0,0,0,0,0,0,12,0]],[181,true,[0,0,0,0,0,0,5,0]],[182,true,[0,0,0,0,0,0,1,0]],[183,true,[0,0,0,0,0,0,1,0]],[184,true,[0,0,0,0,0,0,1,0]],[185,true,[0,0,0,0,0,0,12,0]],[186,true,[0,0,0,0,0,10,10,0]],[187,true,[0,0,0,0,0,0,0,0]],[188,true,[0,0,0,0,0,0,12,0]],[189,true,[0,0,0,0,0,0,8,0]],[190,true,[0,0,0,0,0,1,1,0]],[191,true,[0,0,0,0,0,0,17,0]],[192,true,[0,0,0,0,0,0,12,0]],[193,true,[0,0,0,0,0,12,12,0]],[194,true,[0,0,0,0,0,0,12,0]],[195,true,[0,0,0,0,0,0,12,0]],[196,true,[0,0,0,0,0,0,18,0]],[197,true,[0,0,0,0,0,0,27,0]],[198,true,[0,0,0,0,0,0,12,0]],[199,true,[0,0,0,0,0,0,12,0]],[200,true,[0,0,0,0,0,0,1,0]],[201,true,[0,0,0,0,0,0,22,0]],[202,true,[0,0,0,0,0,0,3,0]],[203,true,[0,0,0,0,0,0,1,0]],[204,true,[0,0,0,0,0,1,1,0]],[205,true,[0,0,0,0,0,0,37,0]],[206,true,[0,0,0,0,0,0,12,1]],[207,true,[0,0,0,0,0,0,12,4]],[208,true,[0,0,0,0,0,12,12,0]],[209,true,[0,0,0,0,0,0,3,0]],[210,true,[0,0,0,0,0,0,12,0]],[211,true,[0,0,0,0,0,0,6,0]],[212,true,[0,0,0,0,0,0,25,0]],[213,true,[0,0,0,0,0,0,3,0]],[214,true,[0,0,0,0,0,0,1,0]],[215,true,[0,0,0,0,0,0,12,0]],[216,true,[0,0,0,0,0,0,1,11]],[217,true,[0,0,0,0,0,0,12,0]],[218,true,[0,0,0,0,0,0,12,0]],[219,true,[0,0,0,0,0,0,12,0]],[220,true,[0,0,0,0,0,0,12,0]],[221,true,[0,0,0,0,0,0,92,0]],[222,true,[0,0,0,0,0,0,12,0]],[223,true,[0,0,0,0,0,1,1,0]],[224,true,[0,0,0,0,0,5,5,0]],[225,true,[0,0,0,0,0,0,6,0]],[226,true,[0,0,0,0,0,0,135,0]],[227,true,[0,0,0,0,0,0,1,0]],[228,true,[0,0,0,0,0,1,1,0]],[229,true,[0,0,0,0,0,0,12,0]],[230,true,[0,0,0,0,0,12,12,0]],[231,true,[0,0,0,0,0,0,5,0]],[232,true,[0,0,0,0,0,0,1,0]],[233,true,[0,0,0,0,0,0,12,0]],[234,true,[0,0,0,0,0,0,1,0]],[235,true,[0,0,0,0,0,0,12,0]],[236,true,[0,0,0,0,0,1,1,0]],[237,true,[0,0,0,0,0,0,12,10]],[238,true,[0,0,0,0,0,6,6,0]],[239,true,[0,0,0,0,0,0,4,5]],[240,true,[0,0,0,0,0,0,171,0]],[241,true,[0,0,0,0,0,0,5,0]],[242,true,[0,0,0,0,0,0,1,0]],[243,true,[0,0,0,0,0,0,12,0]],[244,true,[0,0,0,0,0,0,0,0]],[245,true,[0,0,0,0,0,0,12,0]],[246,true,[0,0,0,0,0,2,2,0]],[247,true,[0,0,0,0,0,0,1,0]],[248,true,[0,0,0,0,0,12,12,0]],[249,true,[0,0,0,0,0,0,12,0]],[250,true,[0,0,0,0,0,0,3,0]],[251,true,[0,0,0,0,0,0,12,0]],[252,true,[0,0,0,0,0,0,32,0]],[253,true,[0,0,0,0,0,0,1,10]],[254,true,[0,0,0,0,0,1,1,0]],[255,true,[0,0,0,0,0,0,8,0]],[256,true,[0,0,0,0,0,0,1,0]],[257,true,[0,0,0,0,0,0,24,2]],[258,true,[0,0,0,0,0,0,12,0]],[259,true,[0,0,0,0,0,0,13,0]],[260,true,[0,0,0,0,0,1,62,5]],[261,true,[0,0,0,0,0,0,1,0]],[262,true,[0,0,0,0,0,0,10,0]],[263,true,[0,0,0,0,0,0,12,0]],[264,true,[0,0,0,0,0,0,1,0]],[265,true,[0,0,0,0,0,0,1,0]],[266,true,[0,0,0,0,0,0,12,0]],[267,true,[0,0,0,0,0,0,3,0]],[268,true,[0,0,0,0,0,0,2,0]],[269,true,[0,0,0,0,0,0,5,0]],[270,true,[0,0,0,0,0,1,1,0]],[271,true,[0,0,0,0,0,0,12,0]],[272,true,[0,0,0,0,0,0,2,0]],[273,true,[0,0,0,0,0,0,152,0]],[274,true,[0,0,0,0,0,0,2,0]],[275,true,[0,0,0,0,0,0,2,0]],[276,true,[0,0,0,0,0,0,2,0]],[277,true,[0,0,0,0,0,0,2,0]],[278,true,[0,0,0,0,0,1,1,0]],[279,true,[0,0,0,0,0,12,12,0]],[280,true,[0,0,0,0,0,12,12,0]],[281,true,[0,0,0,0,0,12,12,0]],[282,true,[0,0,0,0,0,0,162,0]],[283,true,[0,0,0,0,0,4,4,0]],[284,true,[0,0,0,0,0,0,12,0]],[285,true,[0,0,0,0,0,7,7,0]],[286,true,[0,0,0,0,0,0,12,2]],[287,true,[0,0,0,0,0,0,1,0]],[288,true,[0,0,0,0,0,0,26,0]],[289,true,[0,0,0,0,0,0,1,0]],[290,true,[0,0,0,0,0,0,12,0]],[291,true,[0,0,0,0,0,0,65,15]],[292,true,[0,0,0,0,0,0,12,0]],[293,true,[0,0,0,0,0,0,10,0]],[294,true,[0,0,0,0,0,0,12,0]],[295,true,[0,0,0,0,0,0,12,3]],[296,true,[0,0,0,0,0,1,1,0]],[297,true,[0,0,0,0,0,0,12,0]],[298,true,[0,0,0,0,0,0,1,0]],[299,true,[0,0,0,0,0,0,1,0]],[300,true,[0,0,0,0,0,0,1,0]],[301,true,[0,0,0,0,0,0,4,1]],[302,true,[0,0,0,0,0,0,2,0]],[303,true,[0,0,0,0,0,0,6,0]],[304,true,[0,0,0,0,0,0,738,0]],[305,true,[0,0,0,0,0,0,12,0]],[306,true,[0,0,0,0,0,0,1,0]],[307,true,[0,0,0,0,0,0,32,0]],[308,true,[0,0,0,0,0,0,12,0]],[309,true,[0,0,0,0,0,0,8,0]],[310,true,[0,0,0,0,0,0,2,0]],[311,true,[0,0,0,0,0,0,5,0]],[312,true,[0,0,0,0,0,0,6,0]],[313,true,[0,0,0,0,0,0,1,1]],[314,true,[0,0,0,0,0,1,1,0]],[315,true,[0,0,0,0,0,0,2,0]],[316,true,[0,0,0,0,0,0,2,0]],[317,true,[0,0,0,0,0,0,3,0]],[318,true,[0,0,0,0,0,0,1,0]],[319,true,[0,0,0,0,0,0,1,0]],[320,true,[0,0,0,0,0,0,2,3]],[321,true,[0,0,0,0,0,0,3,0]],[322,true,[0,0,0,0,0,0,1,0]],[323,true,[0,0,0,0,0,0,2,0]],[324,true,[0,0,0,0,0,0,1,0]],[325,true,[0,0,0,0,0,0,12,2]],[326,true,[0,0,0,0,0,0,6,0]],[327,true,[0,0,0,0,0,0,7,3]],[328,true,[0,0,0,0,0,0,10,0]],[329,true,[0,0,0,0,0,0,12,0]],[330,true,[0,0,0,0,0,0,3,0]],[331,true,[0,0,0,0,0,0,100,0]],[332,true,[0,0,0,0,0,0,7,0]],[333,true,[0,0,0,0,0,0,400,100]],[334,true,[0,0,0,0,0,0,1,0]],[335,true,[0,0,0,0,0,12,12,0]],[336,true,[0,0,0,0,0,0,24,0]],[337,true,[0,0,0,0,0,0,1,0]],[338,true,[0,0,0,0,0,0,1,0]],[339,true,[0,0,0,0,0,0,1,0]],[340,true,[0,0,0,0,0,0,10,0]],[341,true,[0,0,0,0,0,0,16,0]],[342,true,[0,0,0,0,0,0,83,0]],[343,true,[0,0,0,0,0,35,35,0]],[344,true,[0,0,0,0,0,0,60,54]],[345,true,[0,0,0,0,0,0,24,0]],[346,true,[0,0,0,0,0,0,600,1154]],[347,true,[0,0,0,0,0,0,4,0]],[348,true,[0,0,0,0,0,0,6,0]],[349,true,[0,0,0,0,0,0,149,0]],[350,true,[0,0,0,0,0,0,0,0]],[351,true,[0,0,0,0,0,0,2,0]],[352,true,[0,0,0,0,0,0,25,0]],[353,true,[0,0,0,0,0,0,4,0]],[354,true,[0,0,0,0,0,0,12,0]],[355,true,[0,0,0,0,0,0,4,0]],[356,true,[0,0,0,0,0,0,1,0]],[357,true,[0,0,0,0,0,0,1,2]],[358,true,[0,0,0,0,0,0,4,0]],[359,true,[0,0,0,0,0,0,5,0]],[360,true,[0,0,0,0,0,0,1,0]],[361,true,[0,0,0,0,0,0,13,0]],[362,true,[0,0,0,0,0,0,1,0]],[363,true,[0,0,0,0,0,0,0,0]],[364,true,[0,0,0,0,0,0,1,0]],[365,true,[0,0,0,0,0,0,0,0]],[366,true,[0,0,0,0,0,0,1,0]],[367,true,[0,0,0,0,0,0,12,0]],[368,true,[0,0,0,0,0,0,0,0]],[369,true,[0,0,0,0,0,0,3,0]],[370,true,[0,0,0,0,0,0,1,0]],[371,true,[0,0,0,0,0,0,1,9]],[372,true,[0,0,0,0,0,0,0,0]],[373,true,[0,0,0,0,0,0,0,0]],[374,true,[0,0,0,0,0,0,0,0]],[375,true,[0,0,0,0,0,0,100,0]],[376,true,[0,0,0,0,0,0,100,0]],[377,true,[0,0,0,0,0,0,0,0]],[378,true,[0,0,0,0,0,0,1,0]],[379,true,[0,0,0,0,0,0,1,0]],[380,true,[0,0,0,0,0,0,1,0]],[381,true,[0,0,0,0,0,0,2,0]],[382,true,[0,0,0,0,0,0,0,0]],[383,true,[0,0,0,0,0,0,1,0]],[384,true,[0,0,0,0,0,0,16,0]],[385,true,[0,0,0,0,0,0,0,0]],[386,true,[0,0,0,0,0,0,2,0]],[387,true,[0,0,0,0,0,0,0,0]],[388,true,[0,0,0,0,0,0,0,0]],[389,true,[0,0,0,0,0,0,0,0]],[390,true,[0,0,0,0,0,0,1,0]],[391,true,[0,0,0,0,0,0,59,1]],[392,true,[0,0,0,0,0,0,0,0]],[393,true,[0,0,0,0,0,0,1,0]],[394,true,[0,0,0,0,0,0,1,0]],[395,true,[0,0,0,0,0,0,1,0]],[396,true,[0,0,0,0,0,0,4,0]],[397,true,[0,0,0,0,0,0,1,0]],[398,true,[0,0,0,0,0,0,12,0]],[399,true,[0,0,0,0,0,0,20,0]],[400,true,[0,0,0,0,0,0,25,0]],[401,true,[0,0,0,0,0,0,25,0]],[402,true,[0,0,0,0,0,0,1,0]],[403,true,[0,0,0,0,0,0,25,0]],[404,true,[0,0,0,0,0,0,25,0]],[405,true,[0,0,0,0,0,0,25,0]],[406,true,[0,0,0,0,0,0,25,0]],[407,true,[0,0,0,0,0,0,1,0]],[408,true,[0,0,0,0,0,0,1,0]],[409,true,[0,0,0,0,0,0,2,0]],[410,true,[0,0,0,0,0,0,0,0]],[411,true,[0,0,0,0,0,0,6,2]],[412,true,[0,0,0,0,0,0,24,0]],[413,true,[0,0,0,0,0,0,24,0]],[414,true,[0,0,0,0,0,0,1,0]],[415,true,[0,0,0,0,0,0,24,0]],[416,true,[0,0,0,0,0,0,24,0]],[417,true,[0,0,0,0,0,0,1,0]],[418,true,[0,0,0,0,0,0,2,2]],[419,true,[0,0,0,0,0,0,2,0]],[420,true,[0,0,0,0,0,0,1,0]],[421,true,[0,0,0,0,0,0,1,0]],[422,true,[0,0,0,0,0,0,153,0]],[423,true,[0,0,0,0,0,0,1,0]],[424,true,[0,0,0,0,0,0,11,0]],[425,true,[0,0,0,0,0,0,0,0]],[426,true,[0,0,0,0,0,0,1,0]],[427,true,[0,0,0,0,0,0,2,4]],[428,true,[0,0,0,0,0,0,1,0]],[429,true,[0,0,0,0,0,0,0,0]],[430,true,[0,0,0,0,0,0,1,0]],[431,true,[0,0,0,0,0,0,14,0]],[432,true,[0,0,0,0,0,0,1,11]],[433,true,[0,0,0,0,0,0,15,20]],[434,true,[0,0,0,0,0,0,0,1]],[435,true,[0,0,0,0,0,0,0,26]],[436,true,[0,0,0,0,0,0,0,0]],[437,true,[0,0,0,0,0,0,0,3]],[438,true,[0,0,0,0,0,0,0,1]],[439,true,[0,0,0,0,0,0,0,1]],[440,true,[0,0,0,0,0,0,0,3]],[441,true,[0,0,0,0,0,0,0,0]],[442,true,[0,0,0,0,0,0,0,1]],[443,true,[0,0,0,0,0,0,0,1]],[444,true,[0,0,0,0,0,0,0,0]],[445,true,[0,0,0,0,0,0,0,1]],[446,true,[0,0,0,0,0,0,0,1]],[447,true,[0,0,0,0,0,0,0,2]],[448,true,[0,0,0,0,0,0,0,1]],[449,true,[0,0,0,0,0,0,0,1]],[450,true,[0,0,0,0,0,0,0,1]],[451,true,[0,0,0,0,0,0,0,3]],[452,true,[0,0,0,0,0,0,0,189]],[453,true,[0,0,0,0,0,0,0,2]],[454,true,[0,0,0,0,0,0,0,1]],[455,true,[0,0,0,0,0,0,0,1]],[456,true,[0,0,0,0,0,0,0,3]],[457,true,[0,0,0,0,0,0,0,201]],[458,true,[0,0,0,0,0,0,0,100]],[459,true,[0,0,0,0,0,0,0,1]],[460,true,[0,0,0,0,0,0,0,3]],[461,true,[0,0,0,0,0,0,0,1]],[462,true,[0,0,0,0,0,0,0,1]],[463,true,[0,0,0,0,0,0,0,1]],[464,true,[0,0,0,0,0,0,0,15]],[465,true,[0,0,0,0,0,0,0,1]],[466,true,[0,0,0,0,0,0,0,100]]]]
      values.getDepositsAllocation:
-        [[0,[246012,10642,7979]],[1,[246012,10642,7980]],[2,[246012,10642,7981]],[3,[246012,10642,7982]],[4,[246012,10642,7983]]]
      values.getStakingModule:
-        [[1,"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5",500,500,10000,0,"curated-onchain-v1",1759238327,23476057,137469,10000,150,25],[2,"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433",800,200,400,0,"SimpleDVT",1759234931,23475776,599,444,150,25],[3,"eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F",600,400,500,0,"Community Staking",1759236359,23475895,404,625,30,25]]
      values.getStakingModuleSummary:
-        [[137469,383481,46523],[599,11241,38],[404,8383,2414]]
      values.hasStakingModule:
-        [false,true,true,true,false]
      values.accessControl:
+        {"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"0x00b1e70095ba5bacc3202c3db9faf1f7873186f0ed7b6c84e80c0018dcc6e38e":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"0x9a2f67efb89489040f2c48c3b2c38f719fba1276678d2ced3bd9049fb5edc6b2":{"adminRole":"DEFAULT_ADMIN_ROLE","members":[]},"REPORT_EXITED_VALIDATORS_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x852deD011285fe67063a08005c71a85690503Cee"]},"REPORT_REWARDS_MINTED_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"]},"STAKING_MODULE_MANAGE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]},"STAKING_MODULE_UNVETTING_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD"]},"REPORT_VALIDATOR_EXITING_STATUS_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f"]},"REPORT_VALIDATOR_EXIT_TRIGGERED_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B"]}}
      errors:
-        {"getDepositsAllocation":"Processing error occurred.","hasStakingModule":"Processing error occurred."}
      template:
+        "tokens/Lido/StakingRouter"
    }
```

```diff
+   Status: CREATED
    contract VettedGate (eth:0xB314D4A76C457c93150d308787939063F4Cc67E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GateSeal (eth:0xE1686C2E90eb41a48356c1cC7FaA17629af3ADB3)
    +++ description: None
```

Generated with discovered.json: 0xc12e27f33402a1a72eb762f60554f19b09683b98

# Diff at Mon, 06 Oct 2025 20:11:22 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1759781222

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract DepositContract (eth:0x00000000219ab540356cBB839Cbe05303d7705Fa)
    +++ description: Ethereum Beacon Chain deposit contract.
```

```diff
+   Status: CREATED
    contract  (eth:0x00000961Ef480Eb55e80D19ad83579A64c007002)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0x06325440D014e39736583c165C2963BA99fAf14E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Escrow (eth:0x165813A31446a98c84E20Dda8C101BB3C8228e1c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GateSeal (eth:0x16Dbd4B85a448bE564f1742d5c8cCdD2bB3185D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerCoreCommittee (eth:0x175742c3DDD88B0192df3EcF98f180A79cb259D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Executor (eth:0x23E0B465633FF5178808F4A75186E2F2F9537021)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimeConstraints (eth:0x2a30F5aC03187674553024296bed35Aa49749DDa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Voting (eth:0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DGRolesValidatorMainnet (eth:0x31534e3aFE219B609da3715a00a1479D2A2d7981)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (eth:0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0x3D3ba54D54bbFF40F2Dfa2A8e27bD4dE3dab2951)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract LegacyOracle (eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DGUpgradeStateVerifierMainnet (eth:0x487b764a2085ffd595D9141BAec0A766B7904786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AllowedTokensRegistry (eth:0x4AC40c34f8992bb1e5E856A448792158022551ca)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerkleDistributor (eth:0x4b3EDb22952Fb4A70140E39FB1adD05A6B49622B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSAccounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TimelockedGovernance (eth:0x553337946F2FAb8911774b20025fa776B76a7CcE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeToken (eth:0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CallsScript (eth:0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (eth:0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (eth:0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0x74836470337Ba5d2a92fe16E44AD862E28fcf9B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0x753D5167C31fBEB5b49624314d74A957Eb271709)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ResealManager (eth:0x7914b5a1539b97Bd0bbd155757F25FD79A522d24)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0x7dAdae4e1a0DB43F6bcfA75295666fc044605679)
    +++ description: None
```

```diff
+   Status: CREATED
    contract wstETH_tokenContract (eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptRegistry (eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x8772E3a2D86B9347A2688f9bc1808A6d8917760C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalQueueERC721 (eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InsuranceFund (eth:0x8B3f33234ABD88493c0Cd28De33D583B70beDe35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x8B7854488Fde088d686Ea672B6ba1A5242515f45)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (eth:0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRewards (eth:0x99ac10631F69C753DDb595D074422a0922D9056B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ImmutableDualGovernanceConfigProvider (eth:0xa1692Af6FDfdD1030E4E9c4Bc429986FA64CB5EF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Escrow (eth:0xA8F14D033f377779274Ae016584a05bF14Dccaf8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract stETH_tokenContract (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Kernel (eth:0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawalVault (eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0xb9d82E1A49f6a66E8a07260BA05Cf9Ac8a938B1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Finance (eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorExitDelayVerifier (eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0xBF048f2111497B6Df5E062811f5fC422804D4baE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleDaemonConfig (eth:0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoLocator (eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DualGovernance (eth:0xC1db28B3301331277e307FDCfF8DE28242A4486E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xC52fC3081123073078698F1EAc2f1Dc7Bd71880f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xC7792b3F2B399bB0EdF53fECDceCeB97FBEB18AF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ImmutableDualGovernanceConfigProvider (eth:0xc934E90E76449F09f2369BB85DCEa056567A327a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DualGovernance (eth:0xcdF49b058D606AD34c5789FD8c3BF8B3E54bA2db)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProtectedTimelock (eth:0xCE0425301C85c5Ea2A0873A2dEe44d78E02D2316)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Burner (eth:0xD15a672319Cf0352560eE76d9e89eAB0889046D3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpStackTokenRatePusher (eth:0xd54c1c6413caac3477AC14b2a80D5398E3c32FfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSFeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TetherToken (eth:0xdAC17F958D2ee523a2206206994597C13D831ec7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerSubCommittee (eth:0xDBfa0B8A15a503f25224fcA5F84a3853230A715C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Vyper_contract (eth:0xDC24316b9AE028F1497c275EB9192a3Ea0f67022)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerCoreCommittee (eth:0xf65614d73952Be91ce0aE7Dd9cFf25Ba15bEE2f5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenManager (eth:0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GateSeal (eth:0xf9C9fDB4A5D2AA1D836D5370AB9b28BC1847e178)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptExecutor (eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xFFe21561251c49AdccFad065C94Fb4931dF49081)
    +++ description: None
```
