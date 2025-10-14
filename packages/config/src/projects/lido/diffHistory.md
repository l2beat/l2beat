Generated with discovered.json: 0x358d290d00e1fbd5370fe1f7e869e43134636110

# Diff at Mon, 13 Oct 2025 18:38:47 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@29408b562825037e4052d55584bb4ec7c9a2d287 block: 1759786119
- current timestamp: 1759786119

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759786119 (main branch discovery), not current.

```diff
    contract Voting (eth:0x2e59A20f205bB85a89C53f1936454680651E618e) {
    +++ description: None
      values.acl:
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
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

Generated with discovered.json: 0x9f79994d06fcbbaa9948731449fb70e5194f87c7

# Diff at Thu, 09 Oct 2025 17:24:11 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@41459fd2a6c92f593a7ac7877370a1a5e03c2693 block: 1759786119
- current timestamp: 1759786119

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759786119 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.8:
+        {"permission":"upgrade","from":"eth:0xB314D4A76C457c93150d308787939063F4Cc67E0","role":"admin"}
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
      errors.getActualLockedBond:
-        "Processing error occurred."
      errors.getBond:
-        "Processing error occurred."
      errors.getBondCurve:
-        "Processing error occurred."
      errors.getBondCurveId:
-        "Processing error occurred."
      errors.getBondShares:
-        "Processing error occurred."
      errors.getBondSummary:
-        "Processing error occurred."
      errors.getBondSummaryShares:
-        "Processing error occurred."
      errors.getLockedBondInfo:
-        "Processing error occurred."
      errors.getUnbondedKeysCount:
-        "Processing error occurred."
      errors.getUnbondedKeysCountToEject:
-        "Processing error occurred."
      template:
+        "tokens/Lido/CSAccounting"
    }
```

```diff
    contract Liquid staked Ether 2.0 Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84) {
    +++ description: None
      values.acl:
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
    }
```

```diff
    contract TokenManager (eth:0xf73a1260d222f447210581DDf212D915c09a3249) {
    +++ description: None
      values.acl:
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
    }
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
    contract DGRolesValidatorMainnet (eth:0x31534e3aFE219B609da3715a00a1479D2A2d7981)
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
    contract TimelockedGovernance (eth:0x553337946F2FAb8911774b20025fa776B76a7CcE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ResealManager (eth:0x7914b5a1539b97Bd0bbd155757F25FD79A522d24)
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
    contract VettedGate (eth:0xB314D4A76C457c93150d308787939063F4Cc67E0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Finance (eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86)
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
    contract CSVerifier (eth:0xdC5FE1782B6943f318E05230d688713a560063DC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GateSeal (eth:0xE1686C2E90eb41a48356c1cC7FaA17629af3ADB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TiebreakerCoreCommittee (eth:0xf65614d73952Be91ce0aE7Dd9cFf25Ba15bEE2f5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GateSeal (eth:0xf9C9fDB4A5D2AA1D836D5370AB9b28BC1847e178)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EVMScriptExecutor (eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (eth:0xFFe21561251c49AdccFad065C94Fb4931dF49081)
    +++ description: None
```

Generated with discovered.json: 0xf2259c3e2e01292785d86a8bf01bcf552e408ed0

# Diff at Tue, 07 Oct 2025 20:39:03 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@14b55a40a9ff24c3a4b5a14df15500addfbf7d30 block: 1759786119
- current timestamp: 1759786119

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759786119 (main branch discovery), not current.

```diff
    contract ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.0xf5a08927c847d7a29dc35e105208dbde5ce951392105d712761cc5d17440e2ff:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.0x95ffc68daedf1eb334cfcd22ee24a5eeb5a8e58aa40679f2ad247a84140f8d6e:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.ASSIGN_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.MINT_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xf73a1260d222f447210581DDf212D915c09a3249.REVOKE_VESTINGS_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.0xcebf517aa4440d1d125e0355aae64401211d0848a23c02cc5d29a14822580ba4:
-        {"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.0xb421f7ad7646747f3051c50c0b8e2377839296cd4973e27f63821d73e390338f:
-        {"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.EXECUTE_ROLE:
+        {"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.RUN_SCRIPT_ROLE:
+        {"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]}
      values.permissions.eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c.TRANSFER_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.0x563165d3eae48bcb0a092543ca070d989169c98357e9a1b324ec5da44bab75fd:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.0x30597dd103acfaef0649675953d9cb22faadab7e9d9ed57acc1c429d04b80777:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.0x5de467a460382d13defdc02aacddc9c7d6605d6d4e0b8bd2f70732cae8ea17bc:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.0xd35e458bacdd5343c2f050f574554b2f417a8ea38d6a9a65ce2225dbe8bb9a9d:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.0xd79730e82bfef7d2f9639b9d10bf37ebb662b22ae2211502a00bdf7b2cc3a23a:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.EXECUTE_PAYMENTS_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.MANAGE_PAYMENTS_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.CREATE_PAYMENTS_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.CHANGE_PERIOD_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86.CHANGE_BUDGETS_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.0xad15e7261800b4bb73f1b69d3864565ffb1fd00cb93cf14fe48da8f1f2149f39:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.0xda3972983e62bdf826c4b807c4c9c2b8a941e1f83dfa76d53d6aeac11e1be650:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.0xe7dcd7275292e064d090fbc5f3bd7995be23b502c1fed5cd94cfddbbdcd32bbc:
-        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xf73a1260d222f447210581DDf212D915c09a3249"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.MODIFY_QUORUM_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.MODIFY_SUPPORT_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}
      values.permissions.eth:0x2e59A20f205bB85a89C53f1936454680651E618e.CREATE_VOTES_ROLE:
+        {"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xf73a1260d222f447210581DDf212D915c09a3249"]}
    }
```

Generated with discovered.json: 0x2c0d8c00e4b4da06dbcf79fab0290eaaae826dfc

# Diff at Mon, 06 Oct 2025 21:53:14 GMT:

- author: emduc (<emilien@defiscan.info>)
- comparing to: main@cc3d59f230257e6d276685e251e7687117e8a1ff block: 1759352818
- current timestamp: 1759786119

## Description

Provide description of changes. This section will be preserved.

## Watched changes

```diff
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e) {
    +++ description: None
      template:
-        "tokens/Lido/ValidatorsExitBusOracle"
      sourceHashes.1:
-        "0xba2e8ff1fb232454e73ee740f5c151763047d29a9c660b33be8926930334a768"
+        "0xe4c526720601a291e152819a6b6a28a60b7aa74dfc163dcdda0848713449d95d"
      values.$implementation:
-        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"
      values.$pastUpgrades.2:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"]]
      values.$upgradeCount:
-        2
+        3
      values.getConsensusReport.hash:
-        "0xe1a26edfc66e3e747193d5b88d869fa81132b3d186595f5c02d662172045e825"
+        "0x83f3618ff128c22efaca8bd362fb74f584c416e022877dfd4bdd993d57b2949b"
      values.getConsensusReport.refSlot:
-        12710399
+        12746399
      values.getConsensusReport.processingDeadlineTime:
-        1759377611
+        1759809611
      values.getConsensusVersion:
-        3
+        4
      values.getContractVersion:
-        1
+        2
      values.getProcessingState.currentFrameRefSlot:
-        12710399
+        12746399
      values.getProcessingState.processingDeadlineTime:
-        1759377611
+        1759809611
      values.getProcessingState.dataHash:
-        "0xe1a26edfc66e3e747193d5b88d869fa81132b3d186595f5c02d662172045e825"
+        "0x83f3618ff128c22efaca8bd362fb74f584c416e022877dfd4bdd993d57b2949b"
      values.proxy__getImplementation:
-        "eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c"
+        "eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94"
      values.EXIT_REQUEST_LIMIT_MANAGER_ROLE:
+        "0x9c616dd118785b2e2fccf45a4ff151a335ff7b6a84cd1c4d7fd9f97f39ea9342"
      values.EXIT_TYPE:
+        2
      values.getExitRequestLimitFullInfo:
+        {"maxExitRequestsLimit":11200,"exitsPerFrame":1,"frameDurationInSec":48,"prevExitRequestsLimit":11200,"currentExitRequestsLimit":11200}
      values.getLastProcessingRefSlot:
+        12746399
      values.getMaxValidatorsPerReport:
+        600
      values.SUBMIT_REPORT_HASH_ROLE:
+        "0x22ebb4dbafb72948800c1e1afa1688772a1a4cfc54d5ebfcec8163b1139c082e"
      implementationNames.eth:0xA89Ea51FddE660f67d1850e03C9c9862d33Bc42c:
-        "ValidatorsExitBusOracle"
      implementationNames.eth:0x905A211eD6830Cfc95643f0bE2ff64E7f3bf9b94:
+        "ValidatorsExitBusOracle"
    }
```

```diff
-   Status: DELETED
    contract CSEarlyAdoption (eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      receivedPermissions.0:
+        {"permission":"upgrade","from":"eth:0x06cd61045f958A209a0f8D746e103eCc625f4193","role":"admin"}
      receivedPermissions.6:
+        {"permission":"upgrade","from":"eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428","role":"admin"}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f","role":"admin"}
    }
```

```diff
    contract CSFeeOracle (eth:0x4D4074628678Bd302921c20573EEa1ed38DdF7FB) {
    +++ description: None
      template:
-        "tokens/Lido/CSFeeOracle"
      sourceHashes.1:
-        "0xeac43c3fd7eae13460161196e3255017b4296896629f70133974d9e26bd2b742"
+        "0xe9044668de5a790902b6bfed112ac2d764965db11a13b730c985ceff09edff4d"
      values.$implementation:
-        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"]]
      values.$upgradeCount:
-        1
+        2
      values.avgPerfLeewayBP:
-        500
      values.CONTRACT_MANAGER_ROLE:
-        "0x8135f02737a6b32709c1f229001b55183df0d6abcb3022e8bae091ad43fd9e6d"
      values.feeDistributor:
-        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getConsensusVersion:
-        2
+        3
      values.getContractVersion:
-        1
+        2
      values.proxy__getImplementation:
-        "eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E"
+        "eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97"
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getConsensusReport:
+        {"hash":"0x742312ede76447c95b1a1f9ddfdabc1c02a7fd0fcd2a332c1dcd8221d89cc16c","refSlot":12672479,"processingDeadlineTime":1761312971,"processingStarted":true}
      values.getLastProcessingRefSlot:
+        12672479
      values.STRIKES:
+        "eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f"
      implementationNames.eth:0x919ac5C6c62B6ef7B05cF05070080525a7B0381E:
-        "CSFeeOracle"
      implementationNames.eth:0xe0B234f99E413E27D9Bc31aBba9A49A3e570Da97:
+        "CSFeeOracle"
    }
```

```diff
    contract CSAccounting (eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da) {
    +++ description: None
      template:
-        "tokens/Lido/CSAccounting"
      sourceHashes.1:
-        "0xc45cf7de845f22be0dadd18370faa3a228bdaa579f0c450f4459acbef0c91c05"
+        "0xa3793b129329502d6009f7a85359b308a4c6469ce911caf16b24083bdc712519"
      values.$implementation:
-        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"]]
      values.$upgradeCount:
-        1
+        2
      values.ACCOUNTING_MANAGER_ROLE:
-        "0x40579467dba486691cc62fd8536d22c6d4dc9cdc7bc716ef2518422aa554c098"
      values.CSM:
-        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      values.getBondLockRetentionPeriod:
-        4838400
      values.MAX_BOND_LOCK_RETENTION_PERIOD:
-        31536000
      values.MAX_CURVE_LENGTH:
-        10
+        100
      values.MIN_BOND_LOCK_RETENTION_PERIOD:
-        2419200
      values.proxy__getImplementation:
-        "eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758"
+        "eth:0x6f09d2426c7405C5546413e6059F884D2D03f449"
      values.RESET_BOND_CURVE_ROLE:
-        "0xb5dffea014b759c493d63b1edaceb942631d6468998125e1b4fe427c99082134"
      values.totalBondShares:
-        "11129241451414765094819"
+        "11344232870115695050293"
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getActualLockedBond:
+        [0,0,0,0,0]
      values.getBond:
+        ["13280448660295532030","25826627859852877247","8015475175151572667","2851511178601980838","16237439667328342654"]
      values.getBondCurve:
+        [[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]]]
      values.getBondCurveId:
+        [2,2,2,1,1]
      values.getBondLockPeriod:
+        4838400
      values.getBondShares:
+        ["10924814826882310705","21245602026627142420","6593721663922635237","2345721323116679800","13357306380663207248"]
      values.getBondSummary:
+        [["13280448660295532030","13200000000000000000"],["25826627859852877247","24900000000000000000"],["8015475175151572667","8000000000000000000"],["2851511178601980838","2800000000000000000"],["16237439667328342654","15800000000000000000"]]
      values.getBondSummaryShares:
+        [["10924814826882310705","10858635834042479300"],["21245602026627142420","20483335777852858680"],["6593721663922635237","6580991414571199576"],["2345721323116679800","2303346995099919851"],["13357306380663207248","12997458043778119162"]]
      values.getClaimableBondShares:
+        ["66178992839831405","762266248774283740","12730249351435661","42374328016759949","359848336885088086"]
      values.getCurveInfo:
+        [[[[1,"2400000000000000000","2400000000000000000"],[2,"3700000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]],[[[1,"1500000000000000000","1500000000000000000"],[2,"2800000000000000000","1300000000000000000"]]]]
      values.getCurvesCount:
+        3
      values.getInitializedVersion:
+        2
      values.getLockedBondInfo:
+        [[0,0],[0,0],[0,0],[0,0],[0,0]]
      values.getUnbondedKeysCount:
+        [0,0,0,0,0]
      values.getUnbondedKeysCountToEject:
+        [0,0,0,0,0]
      values.MAX_BOND_LOCK_PERIOD:
+        31536000
      values.MIN_BOND_LOCK_PERIOD:
+        2419200
      values.MODULE:
+        "eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F"
      implementationNames.eth:0x71FCD2a6F38B644641B0F46c345Ea03Daabf2758:
-        "CSAccounting"
      implementationNames.eth:0x6f09d2426c7405C5546413e6059F884D2D03f449:
+        "CSAccounting"
      errors:
+        {"getActualLockedBond":"Processing error occurred.","getBond":"Processing error occurred.","getBondCurve":"Processing error occurred.","getBondCurveId":"Processing error occurred.","getBondShares":"Processing error occurred.","getBondSummary":"Processing error occurred.","getBondSummaryShares":"Processing error occurred.","getClaimableBondShares":"Processing error occurred.","getLockedBondInfo":"Processing error occurred.","getUnbondedKeysCount":"Processing error occurred.","getUnbondedKeysCountToEject":"Processing error occurred."}
    }
```

```diff
    contract AccountingOracle (eth:0x852deD011285fe67063a08005c71a85690503Cee) {
    +++ description: None
      template:
-        "tokens/Lido/AccountingOracle"
      sourceHashes.1:
-        "0x8eb8fe1367a0eb2d485632fc86c4e0eea79ee0a2dd3f72a2982a622b3c62f1ba"
+        "0x90b97d1cb45e9893fa400657a6d60368adbd83c194db38ea948219e3cab9fb7b"
      values.$implementation:
-        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0xE9906E543274cebcd335d2C560094089e9547e8d"
      values.$pastUpgrades.3:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0xE9906E543274cebcd335d2C560094089e9547e8d"]]
      values.$upgradeCount:
-        3
+        4
      values.getConsensusReport.hash:
-        "0xe5ccbf7ca5fb824f5bf9d9c96f6b44afe6c188b4807d4a727355d0cd8fa66395"
+        "0x25ccd3ce83a5e260d306dac3005bea00502d8235bbae818d7d6f29ba7a3f0c41"
      values.getConsensusReport.refSlot:
-        12707999
+        12743999
      values.getConsensusReport.processingDeadlineTime:
-        1759406411
+        1759838411
      values.getConsensusVersion:
-        3
+        4
      values.getContractVersion:
-        2
+        3
      values.getProcessingState.currentFrameRefSlot:
-        12707999
+        12743999
      values.getProcessingState.processingDeadlineTime:
-        1759406411
+        1759838411
      values.getProcessingState.mainDataHash:
-        "0xe5ccbf7ca5fb824f5bf9d9c96f6b44afe6c188b4807d4a727355d0cd8fa66395"
+        "0x25ccd3ce83a5e260d306dac3005bea00502d8235bbae818d7d6f29ba7a3f0c41"
      values.getProcessingState.extraDataHash:
-        "0x1cb22dd53314a9da494f51b61a09d3f9a0657c974630aebcfdaae774f2c869cb"
+        "0x6bf2d0e95113227677ac020bca4121f2a337ef57a519c29fadad5ee6a83a4786"
      values.proxy__getImplementation:
-        "eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7"
+        "eth:0xE9906E543274cebcd335d2C560094089e9547e8d"
      values.getLastProcessingRefSlot:
+        12743999
      implementationNames.eth:0x0e65898527E77210fB0133D00dd4C0E86Dc29bC7:
-        "AccountingOracle"
      implementationNames.eth:0xE9906E543274cebcd335d2C560094089e9547e8d:
+        "AccountingOracle"
    }
```

```diff
    contract WithdrawalVault (eth:0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f) {
    +++ description: None
      sourceHashes.1:
-        "0xfed378d959d7c0807be954e4650d7b087554f356d30c10c652058ea4ef14c0ca"
+        "0x02a7455341d351b5cf754695894d7496179272403e2b811db5202057c6373cad"
      values.$implementation:
-        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"]]
      values.$upgradeCount:
-        1
+        2
      values.getContractVersion:
-        1
+        2
      values.implementation:
-        "eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd"
+        "eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D"
      values.getWithdrawalRequestFee:
+        1
      values.TRIGGERABLE_WITHDRAWALS_GATEWAY:
+        "eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B"
      values.WITHDRAWAL_REQUEST:
+        "eth:0x00000961Ef480Eb55e80D19ad83579A64c007002"
      implementationNames.eth:0xCC52f17756C04bBa7E377716d7062fC36D7f69Fd:
-        "WithdrawalVault"
      implementationNames.eth:0x7D2BAa6094E1C4B60Da4cbAF4A77C3f4694fD53D:
+        "WithdrawalVault"
    }
```

```diff
    contract LidoLocator (eth:0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb) {
    +++ description: None
      sourceHashes.1:
-        "0x69f924232e2916fff05aa3d4f0cbd7fd46005b8747ebacff3ac5e16761107735"
+        "0xd9bec8b380e332257d788916e194c7e66df309019cb2e5a19afa74e31d6a1890"
      values.$implementation:
-        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"
      values.$pastUpgrades.8:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"]]
      values.$upgradeCount:
-        8
+        9
      values.proxy__getImplementation:
-        "eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3"
+        "eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf"
      values.triggerableWithdrawalsGateway:
+        "eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B"
      values.validatorExitDelayVerifier:
+        "eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f"
      implementationNames.eth:0x3ABc4764f0237923d52056CFba7E9AEBf87113D3:
-        "LidoLocator"
      implementationNames.eth:0x2C298963FB763f74765829722a1ebe0784f4F5Cf:
+        "LidoLocator"
    }
```

```diff
    contract CSFeeDistributor (eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0) {
    +++ description: None
      template:
-        "tokens/Lido/CSFeeDistributor"
      sourceHashes.1:
-        "0xd5604f959d89ec8d8a68b4679f1ac04a3e991d52f605de25f20be7f57a4e669b"
+        "0x881e365358bb714cd1d4c59279039f33010f934835d0bd8406443a9bb43c5b9f"
      values.$implementation:
-        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"]]
      values.$upgradeCount:
-        1
+        2
      values.pendingSharesToDistribute:
-        "4590346827209883877"
+        "9541314967166830003"
      values.proxy__getImplementation:
-        "eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0"
+        "eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1"
      values.totalClaimableShares:
-        "80055394793015080802"
+        "66472196352763833428"
      values.distributedShares:
+        ["196458706200864250","505224116619211946",0,"25599846018515934",0]
      values.distributionDataHistoryCount:
+        0
      values.getHistoricalDistributionData:
+        [[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0],[0,"0x0000000000000000000000000000000000000000000000000000000000000000","","",0,0]]
      values.getInitializedVersion:
+        2
      values.logCid:
+        "QmPPFkydgtnwMBDF6nZZaU5nnqy3csbKts3UfRRgWXreEu"
      values.rebateRecipient:
+        "eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"
      values.treeCid:
+        "QmQMPFA42KXn115k1c2qC9AyXKV45JKcaB1svMGQ7ZvCqz"
      implementationNames.eth:0x17Fc610ecbbAc3f99751b3B2aAc1bA2b22E444f0:
-        "CSFeeDistributor"
      implementationNames.eth:0x5DCF7cF7c6645E9E822a379dF046a8b0390251A1:
+        "CSFeeDistributor"
      errors:
+        {"distributedShares":"Processing error occurred.","getHistoricalDistributionData":"Processing error occurred."}
    }
```

```diff
    contract CSModule (eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F) {
    +++ description: None
      template:
-        "tokens/Lido/CSModule"
      sourceHashes.1:
-        "0xf761c7555657701beab5f35f2637465a03482c146dd8566d2fe486a66b790f82"
+        "0xde753d771c3a4dc27e58e529b2dfd70871547d49e71ecd3478353ec02e995aa8"
      values.$implementation:
-        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"
      values.$pastUpgrades.1:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"]]
      values.$upgradeCount:
-        1
+        2
      values.depositQueue:
-        {"head":911,"tail":1037}
      values.earlyAdoption:
-        "eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E"
      values.EL_REWARDS_STEALING_FINE:
-        "100000000000000000"
      values.getActiveNodeOperatorsCount:
-        463
+        467
      values.getNodeOperatorsCount:
-        463
+        467
      values.getStakingModuleSummary.depositableValidatorsCount:
-        2207
+        2414
      values.INITIAL_SLASHING_PENALTY:
-        "1000000000000000000"
      values.keyRemovalCharge:
-        0
      values.MAX_KEY_REMOVAL_CHARGE:
-        "100000000000000000"
      values.MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE:
-        12
      values.MODULE_MANAGER_ROLE:
-        "0x79dfcec784e591aafcf60db7db7b029a5c8b12aac4afd4e8c4eb740430405fa6"
      values.proxy__getImplementation:
-        "eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B"
+        "eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665"
      values.publicRelease:
-        true
      values.ACCOUNTING:
+        "eth:0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da"
      values.CREATE_NODE_OPERATOR_ROLE:
+        "0xc72a21b38830f4d6418a239e17db78b945cc7cfee674bac97fd596eaf0438478"
      values.DEPOSIT_SIZE:
+        "32000000000000000000"
      values.depositQueuePointers:
+        [[0,15],[0,0],[0,0],[0,0],[911,1042]]
      values.EXIT_PENALTIES:
+        "eth:0x06cd61045f958A209a0f8D746e103eCc625f4193"
      values.exitDeadlineThreshold:
+        [432000,432000,432000,345600,345600]
      values.FEE_DISTRIBUTOR:
+        "eth:0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0"
      values.getInitializedVersion:
+        2
      values.getNodeOperator:
+        [[10,0,6,10,0,4,0,0,0,8,"eth:0x50B06A4037A167073A45ab3cC895c52378B08BA8","eth:0x0000000000000000000000000000000000000000","eth:0x50B06A4037A167073A45ab3cC895c52378B08BA8","eth:0x0000000000000000000000000000000000000000",false,true],[19,0,19,19,0,0,0,0,0,0,"eth:0x556fedf2213A31c7Ab9F8bc8Db5B2254261A5B0b","eth:0x0000000000000000000000000000000000000000","eth:0x556fedf2213A31c7Ab9F8bc8Db5B2254261A5B0b","eth:0x0000000000000000000000000000000000000000",false,false],[6,0,5,6,0,1,0,0,0,2,"eth:0x4021caAb9a5621D0ccA630AD4583375590300F4B","eth:0x0000000000000000000000000000000000000000","eth:0x88792bee0d8A4c46acB7a2D8bfBef7e3A678639e","eth:0x0000000000000000000000000000000000000000",false,true],[2,0,2,2,0,0,0,0,0,0,"eth:0x22bA5CaFB5E26E6Fe51f330294209034013A5A4c","eth:0x0000000000000000000000000000000000000000","eth:0x22bA5CaFB5E26E6Fe51f330294209034013A5A4c","eth:0x0000000000000000000000000000000000000000",false,false],[12,0,12,12,0,0,0,0,0,0,"eth:0x4126e59439524C6aa971347E5d6501d33b5eE22B","eth:0x0000000000000000000000000000000000000000","eth:0x4126e59439524C6aa971347E5d6501d33b5eE22B","eth:0x0000000000000000000000000000000000000000",false,false]]
      values.getNodeOperatorIsActive:
+        [true,true,true,true,true]
      values.getNodeOperatorManagementProperties:
+        [["eth:0x50B06A4037A167073A45ab3cC895c52378B08BA8","eth:0x50B06A4037A167073A45ab3cC895c52378B08BA8",false],["eth:0x556fedf2213A31c7Ab9F8bc8Db5B2254261A5B0b","eth:0x556fedf2213A31c7Ab9F8bc8Db5B2254261A5B0b",false],["eth:0x4021caAb9a5621D0ccA630AD4583375590300F4B","eth:0x88792bee0d8A4c46acB7a2D8bfBef7e3A678639e",false],["eth:0x22bA5CaFB5E26E6Fe51f330294209034013A5A4c","eth:0x22bA5CaFB5E26E6Fe51f330294209034013A5A4c",false],["eth:0x4126e59439524C6aa971347E5d6501d33b5eE22B","eth:0x4126e59439524C6aa971347E5d6501d33b5eE22B",false]]
      values.getNodeOperatorNonWithdrawnKeys:
+        [10,19,6,2,12]
      values.getNodeOperatorOwner:
+        ["eth:0x50B06A4037A167073A45ab3cC895c52378B08BA8","eth:0x556fedf2213A31c7Ab9F8bc8Db5B2254261A5B0b","eth:0x88792bee0d8A4c46acB7a2D8bfBef7e3A678639e","eth:0x22bA5CaFB5E26E6Fe51f330294209034013A5A4c","eth:0x4126e59439524C6aa971347E5d6501d33b5eE22B"]
      values.getNodeOperatorSummary:
+        [[0,0,0,0,0,0,6,4],[0,0,0,0,0,0,19,0],[0,0,0,0,0,0,5,1],[0,0,0,0,0,0,2,0],[0,0,0,0,0,0,12,0]]
      values.getNodeOperatorTotalDepositedKeys:
+        [6,19,5,2,12]
      values.getNonce:
+        1583
      values.PARAMETERS_REGISTRY:
+        "eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428"
      values.QUEUE_LEGACY_PRIORITY:
+        4
      values.QUEUE_LOWEST_PRIORITY:
+        5
      implementationNames.eth:0x8daEa53b17a629918CDFAB785C5c74077c1D895B:
-        "CSModule"
      implementationNames.eth:0x1eB6d4da13ca9566c17F526aE0715325d7a07665:
+        "CSModule"
      errors:
+        {"depositQueuePointers":"Processing error occurred.","exitDeadlineThreshold":"Processing error occurred.","getNodeOperator":"Processing error occurred.","getNodeOperatorIsActive":"Processing error occurred.","getNodeOperatorManagementProperties":"Processing error occurred.","getNodeOperatorNonWithdrawnKeys":"Processing error occurred.","getNodeOperatorOwner":"Processing error occurred.","getNodeOperatorSummary":"Processing error occurred.","getNodeOperatorTotalDepositedKeys":"Processing error occurred."}
    }
```

```diff
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999) {
    +++ description: None
      template:
-        "tokens/Lido/StakingRouter"
      sourceHashes.1:
-        "0x503f0f420b9a496d2931807c8c9c7b3bae8e03c9d66fd0c046c0cee08657b365"
+        "0xfff62cfc156b3379b99f876fed184d721dcaa8f2c185eb5267d7f0609085e688"
      values.$implementation:
-        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x226f9265CBC37231882b7409658C18bB7738173A"
      values.$pastUpgrades.3:
+        ["2025-10-02T15:52:47.000Z","0xfff774d519ec1afd4358d4858672578437e815dc1652245a2ffb7bde1bfff2ad",["eth:0x226f9265CBC37231882b7409658C18bB7738173A"]]
      values.$upgradeCount:
-        3
+        4
      values.getAllStakingModuleDigests.0.summary.totalExitedValidators:
-        136488
+        137469
      values.getAllStakingModuleDigests.0.state.exitedValidatorsCount:
-        136488
+        137469
      values.getAllStakingModuleDigests.2.summary.depositableValidatorsCount:
-        2207
+        2414
      values.getAllStakingModuleDigests.2.state.priorityExitShareThreshold:
-        375
+        625
      values.getAllStakingModuleDigests.2.state.stakeShareLimit:
-        300
+        500
      values.getAllStakingModuleDigests.2.activeNodeOperatorsCount:
-        463
+        467
      values.getAllStakingModuleDigests.2.nodeOperatorsCount:
-        463
+        467
      values.getContractVersion:
-        2
+        3
      values.getStakingFeeAggregateDistribution.modulesFee:
-        "5150236809806711995"
+        "5150793740765512992"
      values.getStakingFeeAggregateDistribution.treasuryFee:
-        "4849763190193288003"
+        "4849206259234487005"
      values.getStakingModuleActiveValidatorsCount.0:
-        246993
+        246012
      values.getStakingModuleNonce.0:
-        16350
+        16355
      values.getStakingModuleNonce.1:
-        1016
+        1019
      values.getStakingModuleNonce.2:
-        1540
+        1583
      values.getStakingModules.0.exitedValidatorsCount:
-        136488
+        137469
      values.getStakingModules.2.priorityExitShareThreshold:
-        375
+        625
      values.getStakingModules.2.stakeShareLimit:
-        300
+        500
      values.getStakingRewardsDistribution.stakingModuleFees.0:
-        "4649472542862951501"
+        "4648173130335218963"
      values.getStakingRewardsDistribution.stakingModuleFees.1:
-        "320525273517209183"
+        "321713467330227144"
      values.getStakingRewardsDistribution.stakingModuleFees.2:
-        "180238993426551311"
+        "180907143100066885"
      values.getStakingRewardsDistribution.totalFee:
-        "9999999999999999998"
+        "9999999999999999997"
      values.proxy__getImplementation:
-        "eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA"
+        "eth:0x226f9265CBC37231882b7409658C18bB7738173A"
      values.getAllNodeOperatorDigests:
+        [[[0,true,[0,0,0,0,0,1720,8629,1771]],[1,false,[1,0,0,0,0,1000,1000,0]],[2,true,[0,0,0,0,0,4022,10931,2069]],[3,true,[0,0,0,0,0,3628,10537,1463]],[4,true,[0,0,0,0,0,2273,9182,1318]],[5,true,[0,0,0,0,0,3874,10783,2217]],[6,true,[0,0,0,0,0,3577,10486,514]],[7,true,[0,0,0,0,0,3542,10451,549]],[8,true,[0,0,0,0,0,10157,10579,0]],[9,true,[0,0,0,0,0,3565,10474,526]],[10,true,[0,0,0,0,0,3553,10462,538]],[11,true,[0,0,0,0,0,3563,10472,528]],[12,false,[1,0,0,0,0,2300,2300,0]],[13,true,[0,0,0,0,0,3487,10396,604]],[14,true,[0,0,0,0,0,3173,10082,918]],[15,true,[0,0,0,0,0,3562,10471,529]],[16,true,[0,0,0,0,0,3459,10368,632]],[17,true,[0,0,0,0,0,3272,10181,419]],[18,true,[0,0,0,0,0,3486,10395,605]],[19,true,[0,0,0,0,0,11711,18621,1380]],[20,true,[0,0,0,0,0,3485,10394,606]],[21,true,[0,0,0,0,0,2470,9379,122]],[22,true,[0,0,0,0,0,2485,9394,1606]],[23,true,[0,0,0,0,0,3484,10393,607]],[24,true,[0,0,0,0,0,3480,10389,1611]],[25,true,[0,0,0,0,0,3480,10389,111]],[26,true,[0,0,0,0,0,3477,10386,614]],[27,true,[0,0,0,0,0,3272,10181,2919]],[28,true,[0,0,0,0,0,3479,10388,612]],[29,true,[0,0,0,0,0,3478,10387,2613]],[30,true,[0,0,0,0,0,1729,8639,3943]],[31,true,[0,0,0,0,0,2171,9081,169]],[32,true,[0,0,0,0,0,2455,9365,335]],[33,true,[0,0,0,0,0,1708,8618,2382]],[34,true,[0,0,0,0,0,2465,9375,1625]],[35,true,[0,0,0,0,0,1708,8618,3382]],[36,true,[0,0,0,0,0,8991,12757,3234]],[37,true,[0,0,0,0,0,2263,9173,2827]],[38,true,[0,0,0,0,0,2465,9375,625]]],[[0,true,[0,0,0,0,0,0,80,0]],[1,true,[0,0,0,0,0,0,80,0]],[2,true,[0,0,0,0,0,0,80,0]],[3,true,[0,0,0,0,0,0,80,0]],[4,true,[0,0,0,0,0,0,80,0]],[5,true,[0,0,0,0,0,0,80,0]],[6,true,[0,0,0,0,0,0,80,0]],[7,true,[0,0,0,0,0,0,80,0]],[8,true,[0,0,0,0,0,0,80,0]],[9,true,[0,0,0,0,0,0,80,0]],[10,true,[0,0,0,0,0,0,80,0]],[11,true,[0,0,0,0,0,0,80,0]],[12,true,[0,0,0,0,0,0,80,0]],[13,true,[0,0,0,0,0,0,80,0]],[14,true,[0,0,0,0,0,0,80,0]],[15,true,[0,0,0,0,0,0,80,0]],[16,true,[0,0,0,0,0,0,80,0]],[17,true,[0,0,0,0,0,0,80,0]],[18,true,[0,0,0,0,0,0,80,0]],[19,true,[0,0,0,0,0,0,80,0]],[20,true,[0,0,0,0,0,0,80,0]],[21,true,[0,0,0,0,0,0,80,0]],[22,true,[0,0,0,0,0,0,80,0]],[23,true,[0,0,0,0,0,0,80,0]],[24,true,[0,0,0,0,0,80,160,0]],[25,true,[0,0,0,0,0,0,80,0]],[26,true,[0,0,0,0,0,0,80,0]],[27,true,[0,0,0,0,0,0,80,0]],[28,true,[0,0,0,0,0,0,80,0]],[29,true,[0,0,0,0,0,0,80,0]],[30,true,[0,0,0,0,0,0,80,0]],[31,true,[0,0,0,0,0,60,140,0]],[32,true,[0,0,0,0,0,0,80,0]],[33,true,[0,0,0,0,0,5,85,0]],[34,true,[0,0,0,0,0,0,80,0]],[35,true,[0,0,0,0,0,0,80,0]],[36,true,[0,0,0,0,0,80,80,0]],[37,true,[0,0,0,0,0,0,80,0]],[38,true,[0,0,0,0,0,0,500,0]],[39,true,[0,0,0,0,0,0,500,0]],[40,true,[0,0,0,0,0,0,500,0]],[41,true,[0,0,0,0,0,0,500,0]],[42,true,[0,0,0,0,0,374,874,0]],[43,true,[0,0,0,0,0,0,500,0]],[44,true,[0,0,0,0,0,0,500,0]],[45,true,[0,0,0,0,0,0,500,0]],[46,true,[0,0,0,0,0,0,500,0]],[47,true,[0,0,0,0,0,0,500,0]],[48,true,[0,0,0,0,0,0,80,0]],[49,true,[0,0,0,0,0,0,80,0]],[50,true,[0,0,0,0,0,0,80,0]],[51,true,[0,0,0,0,0,0,80,0]],[52,true,[0,0,0,0,0,0,80,0]],[53,true,[0,0,0,0,0,0,80,0]],[54,true,[0,0,0,0,0,0,80,0]],[55,true,[0,0,0,0,0,0,80,0]],[56,true,[0,0,0,0,0,0,80,0]],[57,true,[0,0,0,0,0,0,80,0]],[58,true,[0,0,0,0,0,0,80,0]],[59,true,[0,0,0,0,0,0,80,0]],[60,true,[0,0,0,0,0,0,80,0]],[61,true,[0,0,0,0,0,0,80,0]],[62,true,[0,0,0,0,0,0,80,0]],[63,true,[0,0,0,0,0,0,80,0]],[64,true,[0,0,0,0,0,0,80,0]],[65,true,[0,0,0,0,0,0,80,0]],[66,true,[0,0,0,0,0,0,80,0]],[67,true,[0,0,0,0,0,0,78,2]],[68,true,[0,0,0,0,0,0,78,2]],[69,true,[0,0,0,0,0,0,78,2]],[70,true,[0,0,0,0,0,0,78,2]],[71,true,[0,0,0,0,0,0,78,2]],[72,true,[0,0,0,0,0,0,78,2]],[73,true,[0,0,0,0,0,0,78,2]],[74,true,[0,0,0,0,0,0,77,3]],[75,true,[0,0,0,0,0,0,77,3]],[76,true,[0,0,0,0,0,0,77,3]],[77,true,[0,0,0,0,0,0,77,3]],[78,true,[0,0,0,0,0,0,77,3]],[79,true,[0,0,0,0,0,0,77,3]],[80,true,[0,0,0,0,0,0,77,3]],[81,true,[0,0,0,0,0,0,77,3]]],[[0,true,[0,0,0,0,0,0,6,4]],[1,true,[0,0,0,0,0,0,19,0]],[2,true,[0,0,0,0,0,0,5,1]],[3,true,[0,0,0,0,0,0,2,0]],[4,true,[0,0,0,0,0,0,12,0]],[5,true,[0,0,0,0,0,0,12,0]],[6,true,[0,0,0,0,0,0,12,0]],[7,true,[0,0,0,0,0,0,1,2]],[8,true,[0,0,0,0,0,0,1,0]],[9,true,[0,0,0,0,0,0,12,0]],[10,true,[0,0,0,0,0,0,1,0]],[11,true,[0,0,0,0,0,0,8,0]],[12,true,[0,0,0,0,0,0,7,0]],[13,true,[0,0,0,0,0,0,12,0]],[14,true,[0,0,0,0,0,0,1,0]],[15,true,[0,0,0,0,0,0,1,0]],[16,true,[0,0,0,0,0,0,1,0]],[17,true,[0,0,0,0,0,0,9,0]],[18,true,[0,0,0,0,0,0,4,0]],[19,true,[0,0,0,0,0,0,12,4]],[20,true,[0,0,0,0,0,0,242,0]],[21,true,[0,0,0,0,0,0,12,0]],[22,true,[0,0,0,0,0,0,100,0]],[23,true,[0,0,0,0,0,0,16,0]],[24,true,[0,0,0,0,0,0,12,0]],[25,true,[0,0,0,0,0,0,24,4]],[26,true,[0,0,0,0,0,1,1,0]],[27,true,[0,0,0,0,0,0,70,0]],[28,true,[0,0,0,0,0,0,12,0]],[29,true,[0,0,0,0,0,0,70,0]],[30,true,[0,0,0,0,0,0,2,0]],[31,true,[0,0,0,0,0,0,70,0]],[32,true,[0,0,0,0,0,0,70,0]],[33,true,[0,0,0,0,0,1,1,0]],[34,true,[0,0,0,0,0,8,16,0]],[35,true,[0,0,0,0,0,0,304,133]],[36,true,[0,0,0,0,0,12,12,0]],[37,true,[0,0,0,0,0,0,15,1]],[38,true,[0,0,0,0,0,0,4,0]],[39,true,[0,0,0,0,0,0,12,0]],[40,true,[0,0,0,0,0,0,32,0]],[41,true,[0,0,0,0,0,0,1,0]],[42,true,[0,0,0,0,0,0,1,0]],[43,true,[0,0,0,0,0,0,16,0]],[44,true,[0,0,0,0,0,0,1,0]],[45,true,[0,0,0,0,0,1,1,0]],[46,true,[0,0,0,0,0,0,12,4]],[47,true,[0,0,0,0,0,1,6,0]],[48,true,[0,0,0,0,0,0,12,0]],[49,true,[0,0,0,0,0,0,12,4]],[50,true,[0,0,0,0,0,0,12,1]],[51,true,[0,0,0,0,0,0,1,0]],[52,true,[0,0,0,0,0,0,2,0]],[53,true,[0,0,0,0,0,0,12,0]],[54,true,[0,0,0,0,0,0,16,0]],[55,true,[0,0,0,0,0,0,12,0]],[56,true,[0,0,0,0,0,0,12,0]],[57,true,[0,0,0,0,0,1,1,0]],[58,true,[0,0,0,0,0,0,12,4]],[59,true,[0,0,0,0,0,0,12,0]],[60,true,[0,0,0,0,0,5,5,0]],[61,true,[0,0,0,0,0,0,2,0]],[62,true,[0,0,0,0,0,0,8,0]],[63,true,[0,0,0,0,0,1,1,0]],[64,true,[0,0,0,0,0,12,12,0]],[65,true,[0,0,0,0,0,0,13,0]],[66,true,[0,0,0,0,0,0,5,0]],[67,true,[0,0,0,0,0,0,3,0]],[68,true,[0,0,0,0,0,0,89,0]],[69,true,[0,0,0,0,0,0,2,8]],[70,true,[0,0,0,0,0,0,12,0]],[71,true,[0,0,0,0,0,6,12,0]],[72,true,[0,0,0,0,0,0,1,0]],[73,true,[0,0,0,0,0,3,3,0]],[74,true,[0,0,0,0,0,0,5,0]],[75,true,[0,0,0,0,0,1,1,0]],[76,true,[0,0,0,0,0,5,5,0]],[77,true,[0,0,0,0,0,0,12,0]],[78,true,[0,0,0,0,0,3,3,0]],[79,true,[0,0,0,0,0,0,13,3]],[80,true,[0,0,0,0,0,0,28,0]],[81,true,[0,0,0,0,0,0,12,19]],[82,true,[0,0,0,0,0,0,12,0]],[83,true,[0,0,0,0,0,0,4,1]],[84,true,[0,0,0,0,0,0,10,0]],[85,true,[0,0,0,0,0,0,1,0]],[86,true,[0,0,0,0,0,12,12,0]],[87,true,[0,0,0,0,0,0,20,0]],[88,true,[0,0,0,0,0,0,1,0]],[89,true,[0,0,0,0,0,0,12,4]],[90,true,[0,0,0,0,0,0,12,0]],[91,true,[0,0,0,0,0,0,12,0]],[92,true,[0,0,0,0,0,0,5,0]],[93,true,[0,0,0,0,0,0,12,0]],[94,true,[0,0,0,0,0,12,12,0]],[95,true,[0,0,0,0,0,0,2,0]],[96,true,[0,0,0,0,0,0,12,0]],[97,true,[0,0,0,0,0,0,12,0]],[98,true,[0,0,0,0,0,0,43,0]],[99,true,[0,0,0,0,0,0,12,3]],[100,true,[0,0,0,0,0,0,12,0]],[101,true,[0,0,0,0,0,1,1,0]],[102,true,[0,0,0,0,0,0,12,0]],[103,true,[0,0,0,0,0,0,49,1]],[104,true,[0,0,0,0,0,0,4,0]],[105,true,[0,0,0,0,0,0,239,0]],[106,true,[0,0,0,0,0,0,2,0]],[107,true,[0,0,0,0,0,0,12,0]],[108,true,[0,0,0,0,0,0,2,0]],[109,true,[0,0,0,0,0,3,3,0]],[110,true,[0,0,0,0,0,0,12,0]],[111,true,[0,0,0,0,0,0,1,0]],[112,true,[0,0,0,0,0,0,1,0]],[113,true,[0,0,0,0,0,12,12,0]],[114,true,[0,0,0,0,0,0,2,1]],[115,true,[0,0,0,0,0,0,12,0]],[116,true,[0,0,0,0,0,0,11,0]],[117,true,[0,0,0,0,0,1,1,0]],[118,true,[0,0,0,0,0,0,2,0]],[119,true,[0,0,0,0,0,0,1,0]],[120,true,[0,0,0,0,0,8,12,0]],[121,true,[0,0,0,0,0,1,1,0]],[122,true,[0,0,0,0,0,1,1,0]],[123,true,[0,0,0,0,0,0,5,0]],[124,true,[0,0,0,0,0,0,81,0]],[125,true,[0,0,0,0,0,0,12,68]],[126,true,[0,0,0,0,0,5,5,0]],[127,true,[0,0,0,0,0,11,12,15]],[128,true,[0,0,0,0,0,0,12,0]],[129,true,[0,0,0,0,0,0,16,0]],[130,true,[0,0,0,0,0,0,16,0]],[131,true,[0,0,0,0,0,6,6,0]],[132,true,[0,0,0,0,0,0,10,0]],[133,true,[0,0,0,0,0,0,12,0]],[134,true,[0,0,0,0,0,0,1,0]],[135,true,[0,0,0,0,0,4,4,0]],[136,true,[0,0,0,0,0,0,3,0]],[137,true,[0,0,0,0,0,3,3,0]],[138,true,[0,0,0,0,0,1,1,0]],[139,true,[0,0,0,0,0,12,12,0]],[140,true,[0,0,0,0,0,8,8,0]],[141,true,[0,0,0,0,0,0,12,0]],[142,true,[0,0,0,0,0,2,2,0]],[143,true,[0,0,0,0,0,0,12,0]],[144,true,[0,0,0,0,0,0,163,0]],[145,true,[0,0,0,0,0,0,1,0]],[146,true,[0,0,0,0,0,12,12,0]],[147,true,[0,0,0,0,0,0,12,0]],[148,true,[0,0,0,0,0,0,12,0]],[149,true,[0,0,0,0,0,12,12,0]],[150,true,[0,0,0,0,0,0,1,0]],[151,true,[0,0,0,0,0,0,39,1]],[152,true,[0,0,0,0,0,0,20,0]],[153,true,[0,0,0,0,0,0,2,0]],[154,true,[0,0,0,0,0,0,12,24]],[155,true,[0,0,0,0,0,12,12,0]],[156,true,[0,0,0,0,0,1,1,0]],[157,true,[0,0,0,0,0,1,1,0]],[158,true,[0,0,0,0,0,1,1,0]],[159,true,[0,0,0,0,0,0,108,0]],[160,true,[0,0,0,0,0,0,12,0]],[161,true,[0,0,0,0,0,0,6,0]],[162,true,[0,0,0,0,0,0,12,0]],[163,true,[0,0,0,0,0,0,12,0]],[164,true,[0,0,0,0,0,1,1,0]],[165,true,[0,0,0,0,0,0,1,0]],[166,true,[0,0,0,0,0,0,143,0]],[167,true,[0,0,0,0,0,21,118,0]],[168,true,[0,0,0,0,0,0,12,0]],[169,true,[0,0,0,0,0,0,12,0]],[170,true,[0,0,0,0,0,0,2,0]],[171,true,[0,0,0,0,0,0,37,0]],[172,true,[0,0,0,0,0,0,12,0]],[173,true,[0,0,0,0,0,0,1,0]],[174,true,[0,0,0,0,0,0,12,0]],[175,true,[0,0,0,0,0,0,12,0]],[176,true,[0,0,0,0,0,1,1,0]],[177,true,[0,0,0,0,0,0,1,0]],[178,true,[0,0,0,0,0,1,1,0]],[179,true,[0,0,0,0,0,1,1,0]],[180,true,[0,0,0,0,0,0,12,0]],[181,true,[0,0,0,0,0,0,5,0]],[182,true,[0,0,0,0,0,0,1,0]],[183,true,[0,0,0,0,0,0,1,0]],[184,true,[0,0,0,0,0,0,1,0]],[185,true,[0,0,0,0,0,0,12,0]],[186,true,[0,0,0,0,0,10,10,0]],[187,true,[0,0,0,0,0,0,0,0]],[188,true,[0,0,0,0,0,0,12,0]],[189,true,[0,0,0,0,0,0,8,0]],[190,true,[0,0,0,0,0,1,1,0]],[191,true,[0,0,0,0,0,0,17,0]],[192,true,[0,0,0,0,0,0,12,0]],[193,true,[0,0,0,0,0,12,12,0]],[194,true,[0,0,0,0,0,0,12,0]],[195,true,[0,0,0,0,0,0,12,0]],[196,true,[0,0,0,0,0,0,18,0]],[197,true,[0,0,0,0,0,0,27,0]],[198,true,[0,0,0,0,0,0,12,0]],[199,true,[0,0,0,0,0,0,12,0]],[200,true,[0,0,0,0,0,0,1,0]],[201,true,[0,0,0,0,0,0,22,0]],[202,true,[0,0,0,0,0,0,3,0]],[203,true,[0,0,0,0,0,0,1,0]],[204,true,[0,0,0,0,0,1,1,0]],[205,true,[0,0,0,0,0,0,37,0]],[206,true,[0,0,0,0,0,0,12,1]],[207,true,[0,0,0,0,0,0,12,4]],[208,true,[0,0,0,0,0,12,12,0]],[209,true,[0,0,0,0,0,0,3,0]],[210,true,[0,0,0,0,0,0,12,0]],[211,true,[0,0,0,0,0,0,6,0]],[212,true,[0,0,0,0,0,0,25,0]],[213,true,[0,0,0,0,0,0,3,0]],[214,true,[0,0,0,0,0,0,1,0]],[215,true,[0,0,0,0,0,0,12,0]],[216,true,[0,0,0,0,0,0,1,11]],[217,true,[0,0,0,0,0,0,12,0]],[218,true,[0,0,0,0,0,0,12,0]],[219,true,[0,0,0,0,0,0,12,0]],[220,true,[0,0,0,0,0,0,12,0]],[221,true,[0,0,0,0,0,0,92,0]],[222,true,[0,0,0,0,0,0,12,0]],[223,true,[0,0,0,0,0,1,1,0]],[224,true,[0,0,0,0,0,5,5,0]],[225,true,[0,0,0,0,0,0,6,0]],[226,true,[0,0,0,0,0,0,135,0]],[227,true,[0,0,0,0,0,0,1,0]],[228,true,[0,0,0,0,0,1,1,0]],[229,true,[0,0,0,0,0,0,12,0]],[230,true,[0,0,0,0,0,12,12,0]],[231,true,[0,0,0,0,0,0,5,0]],[232,true,[0,0,0,0,0,0,1,0]],[233,true,[0,0,0,0,0,0,12,0]],[234,true,[0,0,0,0,0,0,1,0]],[235,true,[0,0,0,0,0,0,12,0]],[236,true,[0,0,0,0,0,1,1,0]],[237,true,[0,0,0,0,0,0,12,10]],[238,true,[0,0,0,0,0,6,6,0]],[239,true,[0,0,0,0,0,0,4,5]],[240,true,[0,0,0,0,0,0,171,0]],[241,true,[0,0,0,0,0,0,5,0]],[242,true,[0,0,0,0,0,0,1,0]],[243,true,[0,0,0,0,0,0,12,0]],[244,true,[0,0,0,0,0,0,0,0]],[245,true,[0,0,0,0,0,0,12,0]],[246,true,[0,0,0,0,0,2,2,0]],[247,true,[0,0,0,0,0,0,1,0]],[248,true,[0,0,0,0,0,12,12,0]],[249,true,[0,0,0,0,0,0,12,0]],[250,true,[0,0,0,0,0,0,3,0]],[251,true,[0,0,0,0,0,0,12,0]],[252,true,[0,0,0,0,0,0,32,0]],[253,true,[0,0,0,0,0,0,1,10]],[254,true,[0,0,0,0,0,1,1,0]],[255,true,[0,0,0,0,0,0,8,0]],[256,true,[0,0,0,0,0,0,1,0]],[257,true,[0,0,0,0,0,0,24,2]],[258,true,[0,0,0,0,0,0,12,0]],[259,true,[0,0,0,0,0,0,13,0]],[260,true,[0,0,0,0,0,1,62,5]],[261,true,[0,0,0,0,0,0,1,0]],[262,true,[0,0,0,0,0,0,10,0]],[263,true,[0,0,0,0,0,0,12,0]],[264,true,[0,0,0,0,0,0,1,0]],[265,true,[0,0,0,0,0,0,1,0]],[266,true,[0,0,0,0,0,0,12,0]],[267,true,[0,0,0,0,0,0,3,0]],[268,true,[0,0,0,0,0,0,2,0]],[269,true,[0,0,0,0,0,0,5,0]],[270,true,[0,0,0,0,0,1,1,0]],[271,true,[0,0,0,0,0,0,12,0]],[272,true,[0,0,0,0,0,0,2,0]],[273,true,[0,0,0,0,0,0,152,0]],[274,true,[0,0,0,0,0,0,2,0]],[275,true,[0,0,0,0,0,0,2,0]],[276,true,[0,0,0,0,0,0,2,0]],[277,true,[0,0,0,0,0,0,2,0]],[278,true,[0,0,0,0,0,1,1,0]],[279,true,[0,0,0,0,0,12,12,0]],[280,true,[0,0,0,0,0,12,12,0]],[281,true,[0,0,0,0,0,12,12,0]],[282,true,[0,0,0,0,0,0,162,0]],[283,true,[0,0,0,0,0,4,4,0]],[284,true,[0,0,0,0,0,0,12,0]],[285,true,[0,0,0,0,0,7,7,0]],[286,true,[0,0,0,0,0,0,12,2]],[287,true,[0,0,0,0,0,0,1,0]],[288,true,[0,0,0,0,0,0,26,0]],[289,true,[0,0,0,0,0,0,1,0]],[290,true,[0,0,0,0,0,0,12,0]],[291,true,[0,0,0,0,0,0,65,15]],[292,true,[0,0,0,0,0,0,12,0]],[293,true,[0,0,0,0,0,0,10,0]],[294,true,[0,0,0,0,0,0,12,0]],[295,true,[0,0,0,0,0,0,12,3]],[296,true,[0,0,0,0,0,1,1,0]],[297,true,[0,0,0,0,0,0,12,0]],[298,true,[0,0,0,0,0,0,1,0]],[299,true,[0,0,0,0,0,0,1,0]],[300,true,[0,0,0,0,0,0,1,0]],[301,true,[0,0,0,0,0,0,4,1]],[302,true,[0,0,0,0,0,0,2,0]],[303,true,[0,0,0,0,0,0,6,0]],[304,true,[0,0,0,0,0,0,738,0]],[305,true,[0,0,0,0,0,0,12,0]],[306,true,[0,0,0,0,0,0,1,0]],[307,true,[0,0,0,0,0,0,32,0]],[308,true,[0,0,0,0,0,0,12,0]],[309,true,[0,0,0,0,0,0,8,0]],[310,true,[0,0,0,0,0,0,2,0]],[311,true,[0,0,0,0,0,0,5,0]],[312,true,[0,0,0,0,0,0,6,0]],[313,true,[0,0,0,0,0,0,1,1]],[314,true,[0,0,0,0,0,1,1,0]],[315,true,[0,0,0,0,0,0,2,0]],[316,true,[0,0,0,0,0,0,2,0]],[317,true,[0,0,0,0,0,0,3,0]],[318,true,[0,0,0,0,0,0,1,0]],[319,true,[0,0,0,0,0,0,1,0]],[320,true,[0,0,0,0,0,0,2,3]],[321,true,[0,0,0,0,0,0,3,0]],[322,true,[0,0,0,0,0,0,1,0]],[323,true,[0,0,0,0,0,0,2,0]],[324,true,[0,0,0,0,0,0,1,0]],[325,true,[0,0,0,0,0,0,12,2]],[326,true,[0,0,0,0,0,0,6,0]],[327,true,[0,0,0,0,0,0,7,3]],[328,true,[0,0,0,0,0,0,10,0]],[329,true,[0,0,0,0,0,0,12,0]],[330,true,[0,0,0,0,0,0,3,0]],[331,true,[0,0,0,0,0,0,100,0]],[332,true,[0,0,0,0,0,0,7,0]],[333,true,[0,0,0,0,0,0,400,100]],[334,true,[0,0,0,0,0,0,1,0]],[335,true,[0,0,0,0,0,12,12,0]],[336,true,[0,0,0,0,0,0,24,0]],[337,true,[0,0,0,0,0,0,1,0]],[338,true,[0,0,0,0,0,0,1,0]],[339,true,[0,0,0,0,0,0,1,0]],[340,true,[0,0,0,0,0,0,10,0]],[341,true,[0,0,0,0,0,0,16,0]],[342,true,[0,0,0,0,0,0,83,0]],[343,true,[0,0,0,0,0,35,35,0]],[344,true,[0,0,0,0,0,0,60,54]],[345,true,[0,0,0,0,0,0,24,0]],[346,true,[0,0,0,0,0,0,600,1154]],[347,true,[0,0,0,0,0,0,4,0]],[348,true,[0,0,0,0,0,0,6,0]],[349,true,[0,0,0,0,0,0,149,0]],[350,true,[0,0,0,0,0,0,0,0]],[351,true,[0,0,0,0,0,0,2,0]],[352,true,[0,0,0,0,0,0,25,0]],[353,true,[0,0,0,0,0,0,4,0]],[354,true,[0,0,0,0,0,0,12,0]],[355,true,[0,0,0,0,0,0,4,0]],[356,true,[0,0,0,0,0,0,1,0]],[357,true,[0,0,0,0,0,0,1,2]],[358,true,[0,0,0,0,0,0,4,0]],[359,true,[0,0,0,0,0,0,5,0]],[360,true,[0,0,0,0,0,0,1,0]],[361,true,[0,0,0,0,0,0,13,0]],[362,true,[0,0,0,0,0,0,1,0]],[363,true,[0,0,0,0,0,0,0,0]],[364,true,[0,0,0,0,0,0,1,0]],[365,true,[0,0,0,0,0,0,0,0]],[366,true,[0,0,0,0,0,0,1,0]],[367,true,[0,0,0,0,0,0,12,0]],[368,true,[0,0,0,0,0,0,0,0]],[369,true,[0,0,0,0,0,0,3,0]],[370,true,[0,0,0,0,0,0,1,0]],[371,true,[0,0,0,0,0,0,1,9]],[372,true,[0,0,0,0,0,0,0,0]],[373,true,[0,0,0,0,0,0,0,0]],[374,true,[0,0,0,0,0,0,0,0]],[375,true,[0,0,0,0,0,0,100,0]],[376,true,[0,0,0,0,0,0,100,0]],[377,true,[0,0,0,0,0,0,0,0]],[378,true,[0,0,0,0,0,0,1,0]],[379,true,[0,0,0,0,0,0,1,0]],[380,true,[0,0,0,0,0,0,1,0]],[381,true,[0,0,0,0,0,0,2,0]],[382,true,[0,0,0,0,0,0,0,0]],[383,true,[0,0,0,0,0,0,1,0]],[384,true,[0,0,0,0,0,0,16,0]],[385,true,[0,0,0,0,0,0,0,0]],[386,true,[0,0,0,0,0,0,2,0]],[387,true,[0,0,0,0,0,0,0,0]],[388,true,[0,0,0,0,0,0,0,0]],[389,true,[0,0,0,0,0,0,0,0]],[390,true,[0,0,0,0,0,0,1,0]],[391,true,[0,0,0,0,0,0,59,1]],[392,true,[0,0,0,0,0,0,0,0]],[393,true,[0,0,0,0,0,0,1,0]],[394,true,[0,0,0,0,0,0,1,0]],[395,true,[0,0,0,0,0,0,1,0]],[396,true,[0,0,0,0,0,0,4,0]],[397,true,[0,0,0,0,0,0,1,0]],[398,true,[0,0,0,0,0,0,12,0]],[399,true,[0,0,0,0,0,0,20,0]],[400,true,[0,0,0,0,0,0,25,0]],[401,true,[0,0,0,0,0,0,25,0]],[402,true,[0,0,0,0,0,0,1,0]],[403,true,[0,0,0,0,0,0,25,0]],[404,true,[0,0,0,0,0,0,25,0]],[405,true,[0,0,0,0,0,0,25,0]],[406,true,[0,0,0,0,0,0,25,0]],[407,true,[0,0,0,0,0,0,1,0]],[408,true,[0,0,0,0,0,0,1,0]],[409,true,[0,0,0,0,0,0,2,0]],[410,true,[0,0,0,0,0,0,0,0]],[411,true,[0,0,0,0,0,0,6,2]],[412,true,[0,0,0,0,0,0,24,0]],[413,true,[0,0,0,0,0,0,24,0]],[414,true,[0,0,0,0,0,0,1,0]],[415,true,[0,0,0,0,0,0,24,0]],[416,true,[0,0,0,0,0,0,24,0]],[417,true,[0,0,0,0,0,0,1,0]],[418,true,[0,0,0,0,0,0,2,2]],[419,true,[0,0,0,0,0,0,2,0]],[420,true,[0,0,0,0,0,0,1,0]],[421,true,[0,0,0,0,0,0,1,0]],[422,true,[0,0,0,0,0,0,153,0]],[423,true,[0,0,0,0,0,0,1,0]],[424,true,[0,0,0,0,0,0,11,0]],[425,true,[0,0,0,0,0,0,0,0]],[426,true,[0,0,0,0,0,0,1,0]],[427,true,[0,0,0,0,0,0,2,4]],[428,true,[0,0,0,0,0,0,1,0]],[429,true,[0,0,0,0,0,0,0,0]],[430,true,[0,0,0,0,0,0,1,0]],[431,true,[0,0,0,0,0,0,14,0]],[432,true,[0,0,0,0,0,0,1,11]],[433,true,[0,0,0,0,0,0,15,20]],[434,true,[0,0,0,0,0,0,0,1]],[435,true,[0,0,0,0,0,0,0,26]],[436,true,[0,0,0,0,0,0,0,0]],[437,true,[0,0,0,0,0,0,0,3]],[438,true,[0,0,0,0,0,0,0,1]],[439,true,[0,0,0,0,0,0,0,1]],[440,true,[0,0,0,0,0,0,0,3]],[441,true,[0,0,0,0,0,0,0,0]],[442,true,[0,0,0,0,0,0,0,1]],[443,true,[0,0,0,0,0,0,0,1]],[444,true,[0,0,0,0,0,0,0,0]],[445,true,[0,0,0,0,0,0,0,1]],[446,true,[0,0,0,0,0,0,0,1]],[447,true,[0,0,0,0,0,0,0,2]],[448,true,[0,0,0,0,0,0,0,1]],[449,true,[0,0,0,0,0,0,0,1]],[450,true,[0,0,0,0,0,0,0,1]],[451,true,[0,0,0,0,0,0,0,3]],[452,true,[0,0,0,0,0,0,0,189]],[453,true,[0,0,0,0,0,0,0,2]],[454,true,[0,0,0,0,0,0,0,1]],[455,true,[0,0,0,0,0,0,0,1]],[456,true,[0,0,0,0,0,0,0,3]],[457,true,[0,0,0,0,0,0,0,201]],[458,true,[0,0,0,0,0,0,0,100]],[459,true,[0,0,0,0,0,0,0,1]],[460,true,[0,0,0,0,0,0,0,3]],[461,true,[0,0,0,0,0,0,0,1]],[462,true,[0,0,0,0,0,0,0,1]],[463,true,[0,0,0,0,0,0,0,1]],[464,true,[0,0,0,0,0,0,0,15]],[465,true,[0,0,0,0,0,0,0,1]],[466,true,[0,0,0,0,0,0,0,100]]]]
      values.getDepositsAllocation:
+        [[0,[246012,10642,7979]],[1,[246012,10642,7980]],[2,[246012,10642,7981]],[3,[246012,10642,7982]],[4,[246012,10642,7983]]]
      values.getStakingFeeAggregateDistributionE4Precision:
+        {"modulesFee":515,"treasuryFee":484}
      values.getStakingModule:
+        [[1,"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5",500,500,10000,0,"curated-onchain-v1",1759238327,23476057,137469,10000,150,25],[2,"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433",800,200,400,0,"SimpleDVT",1759234931,23475776,599,444,150,25],[3,"eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F",600,400,500,0,"Community Staking",1759236359,23475895,404,625,30,25]]
      values.getStakingModuleSummary:
+        [[137469,383481,46523],[599,11241,38],[404,8383,2414]]
      values.hasStakingModule:
+        [false,true,true,true,false]
      values.REPORT_VALIDATOR_EXIT_TRIGGERED_ROLE:
+        "0x0766e72e5c008b3df8129fb356d9176eef8544f6241e078b7d61aff604f8812b"
      values.REPORT_VALIDATOR_EXITING_STATUS_ROLE:
+        "0xbe1bd143a0dde8a867d58aab054bfdb25250951665c4570e39abc3b3de3c2d6c"
      implementationNames.eth:0x89eDa99C0551d4320b56F82DDE8dF2f8D2eF81aA:
-        "StakingRouter"
      implementationNames.eth:0x226f9265CBC37231882b7409658C18bB7738173A:
+        "StakingRouter"
      errors:
+        {"getDepositsAllocation":"Processing error occurred.","hasStakingModule":"Processing error occurred."}
    }
```

```diff
    contract DepositSecurityModule (eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD) {
    +++ description: None
      values.getGuardians.2:
-        "eth:0x14D5d5B71E048d2D75a39FfC5B407e3a3AB6F314"
+        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
      values.getGuardians.5:
-        "eth:0xd4EF84b638B334699bcf5AF4B0410B8CCD71943f"
+        "eth:0x6d22aE126eB2c37F67a1391B37FF4f2863e61389"
    }
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
    contract CSExitPenalties (eth:0x06cd61045f958A209a0f8D746e103eCc625f4193)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSParametersRegistry (eth:0x9D28ad303C90DF524BA960d7a2DAC56DcC31e428)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSStrikes (eth:0xaa328816027F2D32B9F56d190BC9Fa4A5C07637f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorExitDelayVerifier (eth:0xbDb567672c867DB533119C2dcD4FB9d8b44EC82f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEjector (eth:0xc72b58aa02E0e98cF8A4a0E9Dce75e763800802C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TriggerableWithdrawalsGateway (eth:0xDC00116a0D3E064427dA2600449cfD2566B3037B)
    +++ description: None
```

## Source code changes

```diff
.../AccountingOracle/AccountingOracle.sol          |  102 +-
 .../CSAccounting/CSAccounting.sol                  | 2530 +++++++--------
 .../CSEarlyAdoption.sol => /dev/null               |  299 --
 .../src/projects/lido/.flat/CSEjector.sol          | 1776 +++++++++++
 .../lido/.flat/CSExitPenalties/CSExitPenalties.sol | 1830 +++++++++++
 .../.flat/CSExitPenalties/OssifiableProxy.p.sol    |  619 ++++
 .../CSFeeDistributor/CSFeeDistributor.sol          |  377 ++-
 .../CSFeeOracle/CSFeeOracle.sol                    |  311 +-
 .../CSModule/CSModule.sol                          | 3001 ++++++++++--------
 .../CSParametersRegistry/CSParametersRegistry.sol  | 3348 ++++++++++++++++++++
 .../CSParametersRegistry/OssifiableProxy.p.sol     |  619 ++++
 .../projects/lido/.flat/CSStrikes/CSStrikes.sol    | 1489 +++++++++
 .../lido/.flat/CSStrikes/OssifiableProxy.p.sol     |  619 ++++
 .../LidoLocator/LidoLocator.sol                    |    6 +
 .../StakingRouter/StakingRouter.sol                |  253 +-
 .../lido/.flat/TriggerableWithdrawalsGateway.sol   | 1291 ++++++++
 .../lido/.flat/ValidatorExitDelayVerifier.sol      |  667 ++++
 .../ValidatorsExitBusOracle.sol                    | 1121 +++++--
 .../WithdrawalVault/WithdrawalVault.sol            |  146 +-
 19 files changed, 16723 insertions(+), 3681 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759352818 (main branch discovery), not current.

```diff
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c) {
    +++ description: Custom role-based operations entrypoint for Lido.
      values.acl:
+        "eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb"
    }
```

```diff
-   Status: DELETED
    contract NodeOperatorsRegistry (eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
    contract ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb) {
    +++ description: None
      values.getEVMScriptRegistry:
-        "eth:0x853cc0D5917f49B57B8e9F89e491F5E18919093A"
      values.getInitializationBlock:
-        11473216
      values.permissions:
+        {"eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb":{"CREATE_PERMISSIONS_ROLE":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}},"eth:0xf73a1260d222f447210581DDf212D915c09a3249":{"0xf5a08927c847d7a29dc35e105208dbde5ce951392105d712761cc5d17440e2ff":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0x95ffc68daedf1eb334cfcd22ee24a5eeb5a8e58aa40679f2ad247a84140f8d6e":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}},"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c":{"0xcebf517aa4440d1d125e0355aae64401211d0848a23c02cc5d29a14822580ba4":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]},"0xb421f7ad7646747f3051c50c0b8e2377839296cd4973e27f63821d73e390338f":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x23E0B465633FF5178808F4A75186E2F2F9537021"]},"0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86"]}},"eth:0xB9E5CBB9CA5b0d659238807E84D0176930753d86":{"0x563165d3eae48bcb0a092543ca070d989169c98357e9a1b324ec5da44bab75fd":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0x30597dd103acfaef0649675953d9cb22faadab7e9d9ed57acc1c429d04b80777":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0x5de467a460382d13defdc02aacddc9c7d6605d6d4e0b8bd2f70732cae8ea17bc":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0xd35e458bacdd5343c2f050f574554b2f417a8ea38d6a9a65ce2225dbe8bb9a9d":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0xd79730e82bfef7d2f9639b9d10bf37ebb662b22ae2211502a00bdf7b2cc3a23a":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]}},"eth:0x2e59A20f205bB85a89C53f1936454680651E618e":{"0xad15e7261800b4bb73f1b69d3864565ffb1fd00cb93cf14fe48da8f1f2149f39":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0xda3972983e62bdf826c4b807c4c9c2b8a941e1f83dfa76d53d6aeac11e1be650":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0x2e59A20f205bB85a89C53f1936454680651E618e"]},"0xe7dcd7275292e064d090fbc5f3bd7995be23b502c1fed5cd94cfddbbdcd32bbc":{"manager":"eth:0x2e59A20f205bB85a89C53f1936454680651E618e","entities":["eth:0xf73a1260d222f447210581DDf212D915c09a3249"]}},"eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5":{"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999"]},"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c"]}},"eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433":{"0xbb75b874360e0bfd87f964eadd8276d8efb7c942134fc329b513032d0803e0c6":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999","eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x78523850fdd761612f46e844cf5a16bda6b3151d6ae961fd7e8e7b92bfbca7f8":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x07b39e0faf2521001ae4e58cb9ffd3840a63e205d288dc9c93c3774f0d794754":{"manager":"eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c","entities":["eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977"]},"0x75abc64490e17b40ea1e66691c3eb493647b24430b358bd87ec3e5127f1621ee":{"manager":"eth:0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977","entityCount":83}}}
    }
```

```diff
-   Status: DELETED
    contract NodeOperatorsRegistry (eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Voting (eth:0x2e59A20f205bB85a89C53f1936454680651E618e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido DAO Token (eth:0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MiniMeTokenFactory (eth:0x909d05F384D0663eD4BE59863815aB43b4f347Ec)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenManager (eth:0xf73a1260d222f447210581DDf212D915c09a3249)
    +++ description: None
```

Generated with discovered.json: 0x0702025a47bd58fdbd15cb05a665c2178edfb65c

# Diff at Wed, 01 Oct 2025 21:10:59 GMT:

- author: emduc (<emilien@defiscan.info>)
- current timestamp: 1759352818

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
    contract ValidatorsExitBusOracle (eth:0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LidoExecutionLayerRewardsVault (eth:0x388C818CA8B9251b393131C08a736A67ccB19297)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CSEarlyAdoption (eth:0x3D5148ad93e2ae5DedD1f7A8B3C19E7F67F90c0E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lido Dao Agent (eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c)
    +++ description: Custom role-based operations entrypoint for Lido.
```

```diff
+   Status: CREATED
    contract LegacyOracle (eth:0x442af784A788A5bd6F42A01Ebe9F287a871243fb)
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
    contract NodeOperatorsRegistry (eth:0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OracleReportSanityChecker (eth:0x6232397ebac4f5772e53285B26c47914E9461E75)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HashConsensus (eth:0x71093efF8D8599b5fA340D665Ad60fA7C80688e4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Wrapped liquid staked Ether 2.0 Token (eth:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0)
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
    contract WithdrawalQueueERC721 (eth:0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EIP712StETH (eth:0x8F73e4C2A6D852bb4ab2A45E6a9CF5715b3228B7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ACL (eth:0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Liquid staked Ether 2.0 Token (eth:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84)
    +++ description: None
```

```diff
+   Status: CREATED
    contract NodeOperatorsRegistry (eth:0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433)
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
    contract CSModule (eth:0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenRateNotifier (eth:0xe6793B9e4FbA7DE0ee833F9D02bba7DB5EB27823)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakingRouter (eth:0xFdDf38947aFB03C621C71b06C9C70bce73f12999)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositSecurityModule (eth:0xfFA96D84dEF2EA035c7AB153D8B991128e3d72fD)
    +++ description: None
```
