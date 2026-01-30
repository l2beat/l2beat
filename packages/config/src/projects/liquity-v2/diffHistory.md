Generated with discovered.json: 0x3b727589b92dc3e6ef7eee1aa8da2df2beab23bb

# Diff at Thu, 15 Jan 2026 16:21:32 GMT:

- author: emduc (<emilien.duc@gmail.com>)
- comparing to: main@42bd5117e4f2f8a35278f5e74f74db22eece11da block: 1767889765
- current timestamp: 1768493880

## Description

Discovery rerun on the same block number with only config-related changes.

## Watched changes

```diff
    contract SortedTroves (eth:0x14d8d8011dF2b396Ed2bbC4959bb73250324F386) {
    +++ description: None
      values.getSize:
-        27
+        26
      values.size:
-        27
+        26
    }
```

```diff
    contract BorrowerOperations (eth:0x24179CD81c9e782A4096035f7eC97fB8B783e007) {
    +++ description: None
      values.getEntireSystemColl:
-        "78295688045359011759093"
+        "77898061772842602270572"
      values.getEntireSystemDebt:
-        "35053586202751244296508749"
+        "34544154161539642862528277"
    }
```

```diff
-   Status: DELETED
    contract InstaIndex (eth:0x2971AdFa57b20E5a416aE5a708A8655A9c74f723)
    +++ description: None
```

```diff
    contract BorrowerOperations (eth:0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65) {
    +++ description: None
      values.getEntireBranchColl:
-        "5659982911621459116481"
+        "5548286765080221190186"
      values.getEntireBranchDebt:
-        "9337626550679712301239062"
+        "9305276814578577947312259"
    }
```

```diff
    contract PriceFeed (eth:0x4c517D4e2C851CA76d7eC94B805269Df0f2201De) {
    +++ description: None
      values.lastGoodPrice:
-        "3089890000000000000000"
+        "3310005500000000000000"
    }
```

```diff
    contract LQTYStaking (eth:0x4f9Fbb3f1E99B56e0Fe2892e623Ed36A76Fc605d) {
    +++ description: None
      values.F_ETH:
-        185312696805556
+        185349653961372
      values.F_LUSD:
-        "601243055115755398736"
+        "601243080399395067374"
      values.totalLQTYStaked:
-        "52934994272891242554992454"
+        "53185362622915502591451660"
    }
```

```diff
    contract ActivePool (eth:0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0) {
    +++ description: None
      values.aggBatchManagementFees:
-        "12612108211660208634"
+        "33914275101104076288"
      values.aggRecordedDebt:
-        "25150749228991174302806740"
+        "24781948030279115504551847"
      values.aggWeightedBatchManagementFeeSum:
-        "23690051058522512203098418000000000000000"
+        "23363193019159989040377678000000000000000"
      values.aggWeightedDebtSum:
-        "1251670875264886817704765362850869402660368"
+        "1234284343883093831558283856577765044211486"
      values.calcPendingAggBatchManagementFee:
-        "60874777320472802477"
+        "66195713554286635615"
      values.calcPendingAggInterest:
-        "357688290458116438393"
+        "124931368140374033180"
      values.calcPendingSPYield:
-        "268266217843587328794"
+        "93698526105280524885"
      values.getBoldDebt:
-        "25151180404167164552256244"
+        "24782173071635911269296930"
      values.getCollBalance:
-        "25496181342780215977788"
+        "25378183572677775054848"
      values.lastAggBatchManagementFeesUpdateTime:
-        1767808727
+        1768404527
      values.lastAggUpdateTime:
-        1767880751
+        1768490687
    }
```

```diff
    contract StabilityPool (eth:0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF) {
    +++ description: None
      values.getCollBalance:
-        "11117048137926165179"
+        "10846565926263626510"
      values.getEntireBranchColl:
-        "5659982911621459116481"
+        "5548286765080221190186"
      values.getEntireBranchDebt:
-        "9337626550679712301239062"
+        "9305276814578577947312259"
      values.getTotalBoldDeposits:
-        "7893115117687308113021690"
+        "7682322430852708660055686"
      values.getYieldGainsOwed:
-        "25374873389814576258313"
+        "26590937596338200134116"
      values.scaleToB.0:
-        "88090682883291160949110841232029094"
+        "88699825028214515803444464134974985"
    }
```

```diff
    contract EACAggregatorProxy (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) {
    +++ description: None
      values.latestAnswer:
-        308989000000
+        331000550000
      values.latestRound:
-        "129127208515966884540"
+        "129127208515966884791"
      values.latestRoundData.roundId:
-        "129127208515966884540"
+        "129127208515966884791"
      values.latestRoundData.answer:
-        308989000000
+        331000550000
      values.latestRoundData.startedAt:
-        1767887159
+        1768493226
      values.latestRoundData.updatedAt:
-        1767887183
+        1768493243
      values.latestRoundData.answeredInRound:
-        "129127208515966884540"
+        "129127208515966884791"
      values.latestTimestamp:
-        1767887183
+        1768493243
    }
```

```diff
    contract LUSD Stablecoin Token (eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0) {
    +++ description: None
      values.totalSupply:
-        "35053586202751244296508749"
+        "34544154161539642862528277"
    }
```

```diff
    contract BoldToken (eth:0x6440f144b7e50D6a8439336510312d2F54beB01D) {
    +++ description: None
      values.totalSupply:
-        "39553294081739913889741160"
+        "39350436766585040845192275"
    }
```

```diff
    contract StabilityPool (eth:0x66017D22b0f8556afDd19FC67041899Eb65a21bb) {
    +++ description: None
      values.getTotalLUSDDeposits:
-        "15050827826054936135949818"
+        "15051508213900676696467501"
      values.lastLQTYError:
-        "11234885881451074186081670"
+        "12184979471027362524701532"
    }
```

```diff
    contract TroveManager (eth:0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A) {
    +++ description: None
      values.getEntireBranchColl:
-        "5659982911621459116481"
+        "5548286765080221190186"
      values.getEntireBranchDebt:
-        "9337626550679712301239062"
+        "9305276814578577947312259"
      values.getTroveFromTroveIdsArray.1:
-        "36572313505823119409194884506402659067884390987044935437185486298474616237407"
+        "77612571269156022689161594097310745651225474039037620215296829419000244586697"
      values.getTroveIdsCount:
-        106
+        101
    }
```

```diff
    contract AccessControlledOCR2Aggregator (eth:0x7d4E742018fb52E48b08BE73d041C18B21de6Fb5) {
    +++ description: None
      values.latestConfigDigestAndEpoch.epoch:
-        88738
+        92108
      values.linkAvailableForPayment:
-        "961522046247033498119"
+        0
    }
```

```diff
    contract Governance (eth:0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1) {
    +++ description: None
      values.boldAccrued:
-        "12573292967503455427620"
+        "12317154317885534266655"
      values.epoch:
-        36
+        37
      values.epochStart:
-        1767830400
+        1768435200
      values.getLatestVotingThreshold:
-        "13623666908590327454824818392923"
+        "14044006243447413731809652574280"
      values.getTotalVotesAndState.snapshot.votes:
-        "681183345429516372741240919646195"
+        "702200312172370686590482628714049"
      values.getTotalVotesAndState.snapshot.forEpoch:
-        35
+        36
      values.getTotalVotesAndState.state.countedVoteLQTY:
-        "35561263125756768790024936"
+        "35790820543972942742082576"
      values.getTotalVotesAndState.state.countedVoteOffset:
-        "62185098682940860014723876059668756"
+        "62591523551679955046034141284761510"
      values.globalState.countedVoteLQTY:
-        "35561263125756768790024936"
+        "35790820543972942742082576"
      values.globalState.countedVoteOffset:
-        "62185098682940860014723876059668756"
+        "62591523551679955046034141284761510"
      values.secondsWithinEpoch:
-        59363
+        58679
      values.votesSnapshot.votes:
-        "681183345429516372741240919646195"
+        "702200312172370686590482628714049"
      values.votesSnapshot.forEpoch:
-        35
+        36
    }
```

```diff
    contract Tellor Tributes Token (eth:0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0) {
    +++ description: None
      values.getLastNewValueById.1.0:
-        3095315000
+        3321153749
      values.getNewCurrentVariables._c:
-        "0x8d1ed5a70af53d569e9c1f82dee78f15b181d0ed7703f0b97f86daa19c5f1970"
+        "0x78f55b957fe44a588f0d9a939e201e07c32b47da9e39363311fd9bd129500281"
      values.getNewValueCountbyRequestId.1:
-        225087
+        229213
      values.totalSupply:
-        "2821366731908415894910075"
+        "2822339597158415894910073"
    }
```

```diff
-   Status: DELETED
    contract InstaDefaultImplementation (eth:0x8F4a8675Ea3a069D1D8280Bd19B802430f8F53be)
    +++ description: None
```

```diff
    contract SortedTroves (eth:0x8FdD3fbFEb32b28fb73555518f8b361bCeA741A6) {
    +++ description: None
      values.data.tail:
-        "eth:0xD4caCac8791e8556862b2f644FB0782328dd910D"
+        "eth:0x3e4488729874be67Bf4826B543Bf083b8139817E"
      values.data.size:
-        120
+        115
      values.getLast:
-        "eth:0xD4caCac8791e8556862b2f644FB0782328dd910D"
+        "eth:0x3e4488729874be67Bf4826B543Bf083b8139817E"
      values.getSize:
-        120
+        115
    }
```

```diff
    contract ActivePool (eth:0x9074D72cc82DaD1e13E454755Aa8f144c479532F) {
    +++ description: None
      values.aggBatchManagementFees:
-        "29088407327922463343"
+        "15442099982594411299"
      values.aggRecordedDebt:
-        "5065041436371597027689372"
+        "5263328919732550432228835"
      values.aggWeightedBatchManagementFeeSum:
-        "11729346594480392936850225750000000000000"
+        "12531727142111607084436137750000000000000"
      values.aggWeightedDebtSum:
-        "47371776128426120769350598761367237082610"
+        "48152185884177249274444954665593849599492"
      values.calcPendingAggBatchManagementFee:
-        "3436680699296005541"
+        "64856933356111098918"
      values.calcPendingAggInterest:
-        "13879858302468840561"
+        "12642697207032839422"
      values.calcPendingSPYield:
-        "10409893726851630420"
+        "9482022905274629566"
      values.getBoldDebt:
-        "5065087841317926714998817"
+        "5263421861463096170578474"
      values.getCollBalance:
-        "4246959822339412522278"
+        "4352125544647987218794"
      values.lastAggBatchManagementFeesUpdateTime:
-        1767880523
+        1768330667
      values.lastAggUpdateTime:
-        1767880523
+        1768485599
    }
```

```diff
    contract StabilityPool (eth:0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B) {
    +++ description: None
      values.getEntireBranchColl:
-        "25496181342780215977788"
+        "25378183572677775054848"
      values.getEntireBranchDebt:
-        "25151180404167164552256244"
+        "24782173071635911269296930"
      values.getTotalBoldDeposits:
-        "19456452376323296032784164"
+        "19186843259928877633185862"
      values.getYieldGainsOwed:
-        "46242456171390007118663"
+        "46590901900975392481993"
      values.scaleToB.0:
-        "49647053777319381999186134640785186"
+        "50449908319442691503210540527599956"
    }
```

```diff
    contract SortedTroves (eth:0xA25269E41BD072513849F2E64Ad221e84f3063F4) {
    +++ description: None
      values.getSize:
-        95
+        91
      values.size:
-        95
+        91
    }
```

```diff
    contract TroveManager (eth:0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22) {
    +++ description: None
      values.getEntireBranchColl:
-        "25496181342780215977788"
+        "25378183572677775054848"
      values.getEntireBranchDebt:
-        "25151180404167164552256244"
+        "24782173071635911269296930"
    }
```

```diff
    contract TroveManager (eth:0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2) {
    +++ description: None
      values.baseRate:
-        1006988
+        8276483257307213
      values.getBorrowingRate:
-        5000000001006988
+        "13276483257307213"
      values.getBorrowingRateWithDecay:
-        5000000000073559
+        5748643725779965
      values.getEntireSystemColl:
-        "78295688045359011759093"
+        "77898061772842602270572"
      values.getEntireSystemDebt:
-        "35053586202751244296508749"
+        "34544154161539642862528277"
      values.getRedemptionRate:
-        5000000001006988
+        "13276483257307213"
      values.getRedemptionRateWithDecay:
-        5000000000073559
+        5748643725779965
      values.getTroveOwnersCount:
-        120
+        115
      values.lastFeeOperationTime:
-        1767726635
+        1768344071
      values.totalStakes:
-        "78295688045359011759093"
+        "77898061772842602270572"
    }
```

```diff
    contract BorrowerOperations (eth:0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3) {
    +++ description: None
      values.getEntireBranchColl:
-        "25496181342780215977788"
+        "25378183572677775054848"
      values.getEntireBranchDebt:
-        "25151180404167164552256244"
+        "24782173071635911269296930"
    }
```

```diff
    contract TellorCaller (eth:0xAd430500ECDa11E38C9bCB08a702274b94641112) {
    +++ description: None
      values.getTellorCurrentValue.0.2:
-        1767888707
+        1768492955
      values.getTellorCurrentValue.0.1:
-        3095315000
+        3321153749
    }
```

```diff
    contract TroveManager (eth:0xb2B2ABEb5C357a234363FF5D180912D319e3e19e) {
    +++ description: None
      values.getEntireBranchColl:
-        "4246959822339412522278"
+        "4352125544647987218794"
      values.getEntireBranchDebt:
-        "5065087841317926714998817"
+        "5263421861463096170578474"
      values.getTroveIdsCount:
-        32
+        31
    }
```

```diff
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) {
    +++ description: None
      values.totalSupply:
-        "2588806649908121864025623"
+        "2489200993760154903361767"
    }
```

```diff
-   Status: DELETED
    contract InstaImplementations (eth:0xCBA828153d3a85b30B5b912e1f2daCac5816aE9D)
    +++ description: None
```

```diff
    contract StabilityPool (eth:0xd442E41019B7F5C4dD78F50dc03726C446148695) {
    +++ description: None
      values.getEntireBranchColl:
-        "4246959822339412522278"
+        "4352125544647987218794"
      values.getEntireBranchDebt:
-        "5065087841317926714998817"
+        "5263421861463096170578474"
      values.getTotalBoldDeposits:
-        "2180403098123104991254949"
+        "2093473238608036097315158"
      values.getYieldGainsOwed:
-        "4741249019405799978706"
+        "5059055226337995700193"
      values.scaleToB.0:
-        "38225475671359528399022051689547103"
+        "38568920687875652309101892390047373"
    }
```

```diff
-   Status: DELETED
    contract InstaAccountV2 (eth:0xD4caCac8791e8556862b2f644FB0782328dd910D)
    +++ description: None
```

```diff
    contract CommunityIssuance (eth:0xD8c9D9071123a059C6E0A945cF0e0c82b508d816) {
    +++ description: None
      values.totalLQTYIssued:
-        "30823265530278927456000000"
+        "30838809219285572256000000"
    }
```

```diff
    contract ActivePool (eth:0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F) {
    +++ description: None
      values.getETH:
-        "78295688045359011759093"
+        "77898061772842602270572"
      values.getLUSDDebt:
-        "35053586202751244296508749"
+        "34544154161539642862528277"
    }
```

```diff
    contract BorrowerOperations (eth:0xe8119fC02953B27a1b48D2573855738485A17329) {
    +++ description: None
      values.getEntireBranchColl:
-        "4246959822339412522278"
+        "4352125544647987218794"
      values.getEntireBranchDebt:
-        "5065087841317926714998817"
+        "5263421861463096170578474"
    }
```

```diff
    contract ActivePool (eth:0xeB5A8C825582965f1d84606E078620a84ab16AfE) {
    +++ description: None
      values.aggBatchManagementFees:
-        "313593840031904982"
+        "418585971156087998"
      values.aggRecordedDebt:
-        "9337503416377142559245048"
+        "9305159816573374908411593"
      values.aggWeightedBatchManagementFeeSum:
-        "eth:0x9569231212085570679307000500000000000000"
+        "eth:0x9545014622235086093391841500000000000000"
      values.aggWeightedDebtSum:
-        "339752005304882085136850175904070059542001"
+        "337623197509823166007263300036818808267862"
      values.calcPendingAggBatchManagementFee:
-        "3364524216121410696"
+        "27934059155102757666"
      values.calcPendingAggInterest:
-        "119456184513588678336"
+        "88645360076780055002"
      values.calcPendingSPYield:
-        "89592138385191508752"
+        "66484020057585041251"
      values.getBoldDebt:
-        "9337626550679712301239062"
+        "9305276814578577947312259"
      values.getCollBalance:
-        "5659982911621459116481"
+        "5548286765080221190186"
      values.lastAggBatchManagementFeesUpdateTime:
-        1767878675
+        1768401587
      values.lastAggUpdateTime:
-        1767878675
+        1768485599
    }
```

```diff
    contract CollateralRegistry (eth:0xf949982B91C8c61e952B3bA942cbbfaef5386684) {
    +++ description: None
      values.baseRate:
-        916507145087885
+        8922910960521244
      values.getRedemptionRate:
-        5916507145087885
+        "13922910960521244"
      values.getRedemptionRateForRedeemedAmount.0:
-        5002750028866270
+        5068777000049254
      values.getRedemptionRateForRedeemedAmount.1:
-        5002750028866270
+        5068777000049254
      values.getRedemptionRateForRedeemedAmount.2:
-        5002750028866270
+        5068777000049254
      values.getRedemptionRateForRedeemedAmount.3:
-        5002750028866270
+        5068777000049254
      values.getRedemptionRateForRedeemedAmount.4:
-        5002750028866270
+        5068777000049254
      values.getRedemptionRateWithDecay:
-        5002750028866270
+        5068777000049254
      values.lastFeeOperationTime:
-        1767708719
+        1768342259
    }
```

```diff
+   Status: CREATED
    contract  (eth:0x13cE2ABB82D2484F7aC55a02dd0f5c5e4dd6B5Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x260260c3B1AFF1ED9E45e355Ff4D05BEEdD5efeb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x90cdBBb44143b87883287589c29Eb869FC906E91)
    +++ description: None
```

## Source code changes

```diff
.../InstaAccountV2.p.sol => /dev/null              |  65 -----
 .../InstaAccountV2/InstaAccountV2.sol => /dev/null |  65 -----
 .../InstaDefaultImplementation.sol => /dev/null    | 322 ---------------------
 .../InstaImplementations.sol => /dev/null          |  70 -----
 .../.flat@1767889765/InstaIndex.sol => /dev/null   | 194 -------------
 5 files changed, 716 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1767889765 (main branch discovery), not current.

```diff
    contract BorrowerOperations (eth:0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65) {
    +++ description: None
      values.defaultPool:
+        "eth:0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0"
      values.troveManager:
+        "eth:0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A"
    }
```

Generated with discovered.json: 0x3dcea4f5cb2b356ada2fb8e00f120f38ea7909d1

# Diff at Mon, 08 Dec 2025 01:31:29 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1765157363

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract  (eth:0x13cE2ABB82D2484F7aC55a02dd0f5c5e4dd6B5Fa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves (eth:0x14d8d8011dF2b396Ed2bbC4959bb73250324F386)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT (eth:0x1A0FC0b843aFD9140267D25d4E575Cb37a838013)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0x21f73D42Eb58Ba49dDB685dc29D3bF5c0f0373CA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0x2291F52bddc937b5B840d15E551e1DA8C80c2B3c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations (eth:0x24179CD81c9e782A4096035f7eC97fB8B783e007)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BolderCashProxy (eth:0x25BC01FD5a01B1864A7dBADDb05BfEd642340dA2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x260260c3B1AFF1ED9E45e355Ff4D05BEEdD5efeb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DSProxyCache (eth:0x271293c67E2D3140a0E9381EfF1F9b01E07B0795)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ConfirmedTransactionModule (eth:0x2e1B5a40Edc922bCE489668b11749B8eAbd67f6b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LockupContractFactory (eth:0x2eBeF24dA09489218Ba2BECb01867F6DaAeDcD4B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetadataNFT (eth:0x3400874305E1547020fb8e80eAF1308B757171Af)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DSGuard (eth:0x3421ffcB20E26382A383B90f729B902403638b9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetadataNFT (eth:0x362f822dF79790C8077e61110484Fffa48F682A1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations (eth:0x372ABD1810eAF23Cb9D941BbE7596DFb2c46BC65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PriceFeed (eth:0x4c517D4e2C851CA76d7eC94B805269Df0f2201De)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LQTYStaking (eth:0x4f9Fbb3f1E99B56e0Fe2892e623Ed36A76Fc605d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BolderCashProxy (eth:0x50Bc019abdb9951602BC4fE92947d3c15d5e45Df)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool (eth:0x531a8f99c70D6A56A7CEe02d6B4281650d7919a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool (eth:0x5721cbbd64fc7Ae3Ef44A0A3F9a790A9264Cf9BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultPool (eth:0x5cc5ceFD034Fdc4728D487a72Ca58A410CDdCD6b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x5CcA549ca706C39D68156e5E0a72CcBC95f563d0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EACAggregatorProxy (eth:0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LUSD Stablecoin Token (eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleWriteAccessController (eth:0x641B698aD1C6E503470520B0EeCb472c0589dfE6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BoldToken (eth:0x6440f144b7e50D6a8439336510312d2F54beB01D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UserProxy (eth:0x65f9A98009Aecaa3fc8A3A83FEF44e2b6931A7b2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool (eth:0x66017D22b0f8556afDd19FC67041899Eb65a21bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LQTY Token (eth:0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BolderCashProxy (eth:0x75bC01bF1e21ed33915777c131b62BB13B5F2552)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT (eth:0x7ae430E25b67f19B431e1D1Dc048a5BCF24C0873)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager (eth:0x7bcb64B2c9206a5B699eD43363f6F98D4776Cf5A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AccessControlledOCR2Aggregator (eth:0x7d4E742018fb52E48b08BE73d041C18B21de6Fb5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (eth:0x807DEf5E7d057DF05C796F4bc75C3Fe82Bd6EeE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetReader (eth:0x84087689B0D6a8A8f11C297e9e7f8De99f398258)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves (eth:0x84eb85a8C25049255614F0536Bea8F31682e86F1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveNFT (eth:0x857aECeBF75f1012DC18E15020C97096aeA31b04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x884Acfa4593a6FdbA0a9373007E48Ea9AF881C42)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Tellor Tributes Token (eth:0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultPool (eth:0x896a3F03176f05CFbb4f006BfCd8723F2B0D741C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves (eth:0x8FdD3fbFEb32b28fb73555518f8b361bCeA741A6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool (eth:0x9074D72cc82DaD1e13E454755Aa8f144c479532F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0x90cdBBb44143b87883287589c29Eb869FC906E91)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool (eth:0x9502b7c397E9aa22FE9dB7EF7DAF21cD2AEBe56B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MetadataNFT (eth:0x9B36C3B16299D68c79F174df7e728E35b6AF4A12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SimpleWriteAccessController (eth:0x9db83CEf9f68b63989E4E82D65D549e7fF2aCda9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DSProxy (eth:0xA1CbA1fCEf2CD7379f74fEec9a7d8B17d430cc6f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SortedTroves (eth:0xA25269E41BD072513849F2E64Ad221e84f3063F4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager (eth:0xA2895d6A3bf110561Dfe4b71cA539d84e1928B22)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager (eth:0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetReader (eth:0xa5224865040034A9f8E5C60e0a616c9c8A63f237)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations (eth:0xa741A32f9dcFe6aDBa088fD0f97e90742d7d5DA3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TellorCaller (eth:0xAd430500ECDa11E38C9bCB08a702274b94641112)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TroveManager (eth:0xb2B2ABEb5C357a234363FF5D180912D319e3e19e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xb8a9faDA75c6d891fB77a7988Ff9BaD9e485Ca1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped Ether Token (eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FixedAssetReader (eth:0xcC77baf5706BDf7CFA7FefD5337833e2e1fd0d8e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StabilityPool (eth:0xd442E41019B7F5C4dD78F50dc03726C446148695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultPool (eth:0xD4558240d50C2E219a21c9d25afD513Bb6e5B1A0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DefaultPool (eth:0xD796e1648526400386CC4d12FA05E5F11e6a22A1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CommunityIssuance (eth:0xD8c9D9071123a059C6E0A945cF0e0c82b508d816)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool (eth:0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BatchManagerProxy (eth:0xe707784292289be3Aa0Fb6f9D33d420291f98695)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BorrowerOperations (eth:0xe8119fC02953B27a1b48D2573855738485A17329)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ActivePool (eth:0xeB5A8C825582965f1d84606E078620a84ab16AfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DSProxy (eth:0xf309Ac4c07Be9c93d7a14b5B74e94F7aC29E8eCE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (eth:0xf4a3fE99227F6060e4C1c62b557EEE050B6483E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CollateralRegistry (eth:0xf949982B91C8c61e952B3bA942cbbfaef5386684)
    +++ description: None
```
