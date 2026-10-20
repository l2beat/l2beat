Generated with discovered.json: 0x20d74b5fbe94af99f6baa27f99a3d72b7e9a5586

# Diff at Tue, 20 Oct 2026 08:59:34 GMT:

- id: 4d55ae4b
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@9417c9f8ea024cc7ebc3d153bed576e95746815a block: 1790947041
- current timestamp: 1790947041

## Description

The EigenDA cert verifier router RISE's range program verifies DA certificates against (hokulea's EigenLabs address fetcher maps mainnet to EigenDA's canonical router) is now referenced from the shared-eigenda module.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790947041 (main branch discovery), not current.

```diff
    external contract (eth:0x002721B4790d97dC140a049936aA710152Ba92D5) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656","description":"can add and remove strategies","role":".owner"},{"permission":"interact","from":"eth:0x1be7258230250Bc6a4548F8D59d576a87D216C12","description":"can add cert verifiers to the router, changing which contract validates DA certificates from a chosen block onwards.","role":".owner"},{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can transfer ownership of the contract, update the metadata URI, set reward initiator and set batch confirmer","role":".owner"},{"permission":"interact","from":"eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15","description":"can add blob versions with their coding parameters, which define what the cert verifiers accept as a valid blob.","role":".owner"},{"permission":"upgrade","from":"eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x1be7258230250Bc6a4548F8D59d576a87D216C12","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]},{"permission":"upgrade","from":"eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15","role":"admin","via":[{"address":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x8247EF5705d3345516286B72bFE6D690197C2E99","role":".owner"}]
    }
```

```diff
    external contract (eth:0x0c431C66F4dE941d089625E5B423D00707977060) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry"}]
    }
```

```diff
    external contract (eth:0x178eeeA9E0928dA2153A1d7951FBe30CF8371b8A) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can create rewards submissions.","role":".rewardsInitiator"}]
    }
```

```diff
    external contract (eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806","role":".pausers"}]
    }
```

```diff
    external contract (eth:0x2E158da11961426E2A1Cc9e79f40244486b6845C) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0x338477FfaF63c04AC06048787f910671eC914B34) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E","description":"can eject DA operators from a quorum.","role":".ejectors"}]
    }
```

```diff
    external contract (eth:0x347660a632B0Aac5B70dCd5e6C3444a7C933a137) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0c431C66F4dE941d089625E5B423D00707977060","role":".pausers"},{"permission":"act","from":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444","role":".owner"},{"permission":"act","from":"eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806","role":".pausers"},{"permission":"interact","from":"eth:0x0fCE0A591D96BB76883323eF555867111E2050a9","description":"change the beacon implementation.","role":".owner"}]
    }
```

```diff
    external contract (eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75","role":"admin"}]
    }
```

```diff
    external contract (eth:0x454Ef2f69f91527856E06659f92a66f464C1ca4e) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can confirm batches to the DA bridge.","role":".batchConfirmers"}]
    }
```

```diff
    external contract (eth:0x45dcD05251F3327EcCd4766a9264DBDAab3A4065) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0x461854d84Ee845F905e0eCf6C288DDEEb4A9533F) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0fCE0A591D96BB76883323eF555867111E2050a9","description":"change the beacon implementation.","role":".owner","via":[{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"interact","from":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","description":"executes scheduled operations after the delay","role":".executors"},{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"interact","from":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","description":"executes scheduled operations after the delay","role":".executors"},{"permission":"upgrade","from":"eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x132b466d9d5723531F68797519DfED701aC2C749","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75","role":"admin","via":[{"address":"eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9"},{"address":"eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d"},{"address":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","delay":2073600}]},{"permission":"upgrade","from":"eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xAe60d8180437b5C34bB956822ac2710972584473","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","delay":2073600,"role":".proposers"},{"permission":"act","from":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000,"role":".proposers"}]
    }
```

```diff
    external contract (eth:0x5050389572f2d220ad927CcbeA0D406831012390) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0c431C66F4dE941d089625E5B423D00707977060","role":".pausers"},{"permission":"act","from":"eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806","role":".pausers"}]
    }
```

```diff
    external contract (eth:0x57af860e3a1C16641CDDDa92898266D2df7Dfa71) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0x5A49Bf6c5690E22dFff3eB37F7dd18254eC361ED) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can confirm batches to the DA bridge.","role":".batchConfirmers"}]
    }
```

```diff
    external contract (eth:0x7474E1D80E844e6EdB430841DeEF702a6B747863) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0x8247EF5705d3345516286B72bFE6D690197C2E99) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x006124Ae7976137266feeBFb3F4D2BE4C073139D","role":"admin"},{"permission":"upgrade","from":"eth:0x00A5Fd09F6CeE6AE9C8b0E5e33287F7c82880505","role":"admin"},{"permission":"upgrade","from":"eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656","role":"admin"},{"permission":"upgrade","from":"eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E","role":"admin"},{"permission":"upgrade","from":"eth:0x1be7258230250Bc6a4548F8D59d576a87D216C12","role":"admin"},{"permission":"upgrade","from":"eth:0x5a3eD432f2De9645940333e4474bBAAB8cf64cf2","role":"admin"},{"permission":"upgrade","from":"eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad","role":"admin"},{"permission":"upgrade","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","role":"admin"},{"permission":"upgrade","from":"eth:0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05","role":"admin"},{"permission":"upgrade","from":"eth:0xBd35a7a1CDeF403a6a99e4E8BA0974D198455030","role":"admin"},{"permission":"upgrade","from":"eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B","role":"admin"},{"permission":"upgrade","from":"eth:0xdb4c89956eEa6F606135E7d366322F2bDE609F15","role":"admin"}]
    }
```

```diff
    external contract (eth:0x8642473a123FE33b0aaE90bD8604eA1029417236) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E","description":"can eject DA operators from a quorum.","role":".ejectors"}]
    }
```

```diff
    external contract (eth:0x8ED83c6Bb12E441Ca2C3a544F525d4a3Fb6484D8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can confirm batches to the DA bridge.","role":".batchConfirmers"}]
    }
```

```diff
    external contract (eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"upgrade","from":"eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6","role":"admin"},{"permission":"upgrade","from":"eth:0x132b466d9d5723531F68797519DfED701aC2C749","role":"admin"},{"permission":"upgrade","from":"eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF","role":"admin"},{"permission":"upgrade","from":"eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff","role":"admin"},{"permission":"upgrade","from":"eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2","role":"admin"},{"permission":"upgrade","from":"eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5","role":"admin"},{"permission":"upgrade","from":"eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129","role":"admin"},{"permission":"upgrade","from":"eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2","role":"admin"},{"permission":"upgrade","from":"eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A","role":"admin"},{"permission":"upgrade","from":"eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A","role":"admin"},{"permission":"upgrade","from":"eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc","role":"admin"},{"permission":"upgrade","from":"eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4","role":"admin"},{"permission":"upgrade","from":"eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5","role":"admin"},{"permission":"upgrade","from":"eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02","role":"admin"},{"permission":"upgrade","from":"eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647","role":"admin"},{"permission":"upgrade","from":"eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84","role":"admin"},{"permission":"upgrade","from":"eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda","role":"admin"},{"permission":"upgrade","from":"eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184","role":"admin"},{"permission":"upgrade","from":"eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A","role":"admin"},{"permission":"upgrade","from":"eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6","role":"admin"},{"permission":"upgrade","from":"eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338","role":"admin"},{"permission":"upgrade","from":"eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b","role":"admin"},{"permission":"upgrade","from":"eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D","role":"admin"},{"permission":"upgrade","from":"eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39","role":"admin"},{"permission":"upgrade","from":"eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d","role":"admin"},{"permission":"upgrade","from":"eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059","role":"admin"},{"permission":"upgrade","from":"eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7","role":"admin"},{"permission":"upgrade","from":"eth:0xAe60d8180437b5C34bB956822ac2710972584473","role":"admin"},{"permission":"upgrade","from":"eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25","role":"admin"},{"permission":"upgrade","from":"eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83","role":"admin"},{"permission":"upgrade","from":"eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F","role":"admin"}]
    }
```

```diff
    external contract (eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9","role":".owner"}]
    }
```

```diff
    external contract (eth:0x9b2C61521AF4AB9f4BE25297838F72a56462B578) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
    external contract (eth:0xBE1685C81aA44FF9FB319dD389addd9374383e90) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0fCE0A591D96BB76883323eF555867111E2050a9","description":"change the beacon implementation.","role":".owner","via":[{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"interact","from":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","description":"can cancel scheduled operations","role":".cancellers"},{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"}]},{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"interact","from":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","description":"can cancel scheduled operations","role":".cancellers"},{"permission":"upgrade","from":"eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x132b466d9d5723531F68797519DfED701aC2C749","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75","role":"admin","via":[{"address":"eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9"},{"address":"eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d"},{"address":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","delay":2073600}]},{"permission":"upgrade","from":"eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xAe60d8180437b5C34bB956822ac2710972584473","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]},{"permission":"upgrade","from":"eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"},{"address":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x0c431C66F4dE941d089625E5B423D00707977060","role":".pausers"},{"permission":"act","from":"eth:0x738130BC8eADe1Bc65A9c056DEa636835896bc53","delay":2073600,"role":".proposers"},{"permission":"act","from":"eth:0xB8765ed72235d279c3Fb53936E4606db0Ef12806","role":".pausers"},{"permission":"act","from":"eth:0xC06Fd4F821eaC1fF1ae8067b36342899b57BAa2d","delay":864000,"role":".proposers"}]
    }
```

```diff
    external contract (eth:0xD2Ee81Cf07B12140C793FcE5B26313CDd9d78eA8) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x130d8EA0052B45554e4C99079B84df292149Bd5E","description":"can eject DA operators from a quorum.","role":".ejectors"}]
    }
```

```diff
    external contract (eth:0xF3d7C0D52fF8f4CF74A3CD9C53778516f4235bE9) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x78cb05379a3b66E5227f2C1496432D7FFE794Fad","description":"Can disperse EigenDA blobs to the EigenDA node operators.","role":".dispersers"}]
    }
```

```diff
    external contract (eth:0xFEA47018D632A77bA579846c840d5706705Dc598) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0fCE0A591D96BB76883323eF555867111E2050a9","description":"change the beacon implementation.","role":".owner","via":[{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x132b466d9d5723531F68797519DfED701aC2C749","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x135DDa560e946695d6f155dACaFC6f1F25C1F5AF","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x25E5F8B1E7aDf44518d35D5B2271f114e081f0E5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x27a84740FdDed5B7D66d9bb6E5d1DEA6eb0C0129","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x298aFB19A105D59E74658C4C334Ff360BadE6dd2","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x3F55654b2b2b86bB11bE2f72657f9C33bf88120A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x54f4bC6bDEbe479173a2bbDc31dD7178408A57A4","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x5557E1fE3068A1e823cE5Dcd052c6C352E2617B5","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x57ba429517c3473B6d34CA9aCd56c0e735b94c02","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x5e4C39Ad7A3E881585e383dB9827EB4811f6F647","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x619F988b4EA2f896ED068d84cE6F52550d6acE84","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x7750d328b314EfFa365A0402CcfD489B80B0adda","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x7CA911E83dabf90C90dD3De5411a10F1A6112184","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x83E9115d334D248Ce39a6f36144aEaB5b3456e75","role":"admin","via":[{"address":"eth:0x3f5Ab2D4418d38568705bFd6672630fCC3435CC9"},{"address":"eth:0x942eaF324971440384e4cA0ffA39fC3bb369D67d"}]},{"permission":"upgrade","from":"eth:0x858646372CC42E1A627fcE94aa7A7033e7CF075A","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x9376A5863F2193cdE13e1aB7c678F22554E2Ea2b","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x93c4b944D05dfe6df7645A86cd2206016c51564D","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xa4C637e0F704745D182e4D38cAb7E7485321d059","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xaCB55C530Acdb2849e6d4f36992Cd8c9D50ED8F7","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xAe60d8180437b5C34bB956822ac2710972584473","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xd0930ee96D07de4F9d493c259232222e46B6EC25","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]},{"permission":"upgrade","from":"eth:0xeDA3CAd031c0cf367cF3f517Ee0DC98F9bA80C8F","role":"admin","via":[{"address":"eth:0x8b9566AdA63B64d1E1dcF1418b43fd1433b72444"},{"address":"eth:0x369e6F597e22EaB55fFb173C6d9cD234BD699111"}]}]
    }
```

```diff
    external contract (eth:0xe0550117Cb066D3b330eBd764B0d75D3BA378734) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0BAAc79acD45A023E19345c352d8a7a83C4e5656","description":"can approve the replacement of churned operators from a quorum","role":".churnApprover"}]
    }
```

```diff
    external contract (eth:0xe8437B66E834B7CdC90cC5D98B8DD6e636b37D7a) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0xD160e6C1543f562fc2B0A5bf090aED32640Ec55B","description":"Can store and serve both unencoded blobs as well as encoded chunks.","role":".relayers"}]
    }
```

```diff
    external contract (eth:0xfD636E8EB3839cE82A58936b795043Da7DB0c734) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x870679E138bCdf293b7Ff14dD44b70FC97e12fc0","description":"can pause the DA bridge","role":".pauserRegistry","via":[{"address":"eth:0x0c431C66F4dE941d089625E5B423D00707977060"},{"address":"eth:0x5050389572f2d220ad927CcbeA0D406831012390"}]}]
    }
```

```diff
+   Status: CREATED
    external contract EigenDACertVerifierRouter (eth:0x1be7258230250Bc6a4548F8D59d576a87D216C12)
    +++ description: None
```

Generated with discovered.json: 0x58a11c42d49034fc96f80792f73336418becb7e0

# Diff at Fri, 16 Oct 2026 09:37:50 GMT:

- id: e7b22fe2
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e45e14a922cef8b526f3f802ae97d6b7542cacb7 block: 1790947041
- current timestamp: 1790947041

## Description

Ossification review: ASR opsuccinct pointers without severity, template severities (role holders MEDIUM).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1790947041 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"MEDIUM"}}
    }
```

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      fieldMeta.$admin.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.disputeGameFactory:
-        {"severity":"HIGH"}
      fieldMeta.systemConfig:
-        {"severity":"HIGH"}
      fieldMeta.RespectedGameString:
+        {"severity":"HIGH"}
    }
```

```diff
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta.$admin.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.owner.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

```diff
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"MEDIUM"}}
    }
```

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Feature flags enabled with setFeature, as bytes32-encoded names (ETH_LOCKBOX, CUSTOM_GAS_TOKEN, INTEROP).
+++ severity: HIGH
      values.enabledFeatures:
+        []
      fieldMeta.owner:
+        {"severity":"MEDIUM"}
      fieldMeta.enabledFeatures:
+        {"severity":"HIGH","description":"Feature flags enabled with setFeature, as bytes32-encoded names (ETH_LOCKBOX, CUSTOM_GAS_TOKEN, INTEROP)."}
      fieldMeta.isCustomGasToken:
+        {"severity":"HIGH"}
    }
```

```diff
    contract AddressManager (eth:0xdE3a0F0122f702e018e04C6D0824B724E8Be8e16) [opstack/AddressManager] {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      fieldMeta:
+        {"owner":{"severity":"MEDIUM"}}
    }
```

Generated with discovered.json: 0xf12d98f038e4ea29e1fcab6c1f037e421ffcb2a5

# Diff at Mon, 05 Oct 2026 12:05:43 GMT:

- id: 4385f853
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@57aafc8ffcefd343a09bd846b1a2ef0f63b2bae3 block: 1785249452
- current timestamp: 1790947041

## Description

SystemConfig `gasLimit` raised from `1500000000` to `2250000000` (+50%).

## Watched changes

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
+++ description: Gas limit for blocks on L2.
+++ severity: LOW
      values.gasLimit:
-        1500000000
+        2250000000
    }
```

Generated with discovered.json: 0x114f4c48dbd6f4aff60fe62c754ce85dc3d130fb

# Diff at Sun, 04 Oct 2026 05:55:36 GMT:

- id: 897363d1
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d93c5b9cfdcdcc765058a84ce4841fd148b2ec6d block: 1785249452
- current timestamp: 1785249452

## Description

Ossification review: critical flags and field severities.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      fieldMeta.retirementTimestamp.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

```diff
    contract AccessManager (eth:0xF90a72FC295DBEf2fD27629Fda4B98Fd3E842d17) [succinct/OPSuccinct/AccessManager] {
    +++ description: Contract managing access control for proposers and challengers in OPSuccinct.
      fieldMeta.owner.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.challengers.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.proposers.severity:
-        "HIGH"
+        "MEDIUM"
    }
```

Generated with discovered.json: 0x8920d34bb2b5d01241b0ebab9ab790d511afda27

# Diff at Wed, 30 Sep 2026 22:47:38 GMT:

- id: cc6a0965
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@65e15aefbf807aa6fcdc89f1109068adc7f4c0e7 block: 1785249452
- current timestamp: 1785249452

## Description

Config-only rerun on the same block number. The OP Stack templates now label the Upgrade 20 super dispute game types, 9 and 5, in the respected game type mapping. No onchain state changed.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      usedTypes.0.arg.9:
+        "SuperFaultDisputeGame"
      usedTypes.0.arg.5:
+        "SuperPermissionedDisputeGame"
    }
```

```diff
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
      usedTypes.0.arg.9:
+        "SuperFaultDisputeGame"
      usedTypes.0.arg.5:
+        "SuperPermissionedDisputeGame"
    }
```

Generated with discovered.json: 0x4af7062c99306a996411eed4f36c2e50126e2a0e

# Diff at Tue, 29 Sep 2026 17:46:59 GMT:

- id: 9fa99172
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@97882e49075dda3a0b6c2f78b8e10cde49a7b97a block: 1785249452
- current timestamp: 1785249452

## Description

Config: add the DisputeGameFactory owner permission to the shared templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract Rise ProxyAdminOwner Multisig (eth:0x9196464e3F828A50233C20732fa6898F4317002c) [GnosisSafe] {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3","description":"set the dispute game implementation and initial bond for any game type.","role":".owner"}
    }
```

Generated with discovered.json: 0xa0866ca593e7894e3b793519d62d6ec1e11a9dc3

# Diff at Wed, 23 Sep 2026 05:49:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1785249452
- current timestamp: 1785249452

## Description

Refresh config-derived discovery metadata at the main-branch block.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      fieldMeta.superchainConfig:
-        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds:
-        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds_fmt.severity:
-        "HIGH"
    }
```

```diff
    contract L1StandardBridge (eth:0x553257678Dd11a6668a92934AAB005e420c6535A) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      fieldMeta.superchainConfig:
-        {"severity":"HIGH"}
      fieldMeta.systemConfig:
-        {"severity":"HIGH"}
      fieldMeta.messenger:
-        {"severity":"HIGH"}
      fieldMeta.MESSENGER:
-        {"severity":"HIGH"}
      fieldMeta.otherBridge:
-        {"severity":"HIGH"}
      fieldMeta.OTHER_BRIDGE:
-        {"severity":"HIGH"}
      fieldMeta.l2TokenBridge:
-        {"severity":"HIGH"}
      fieldMeta.$admin:
-        {"severity":"HIGH"}
    }
```

```diff
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta.permissionedGameArgs:
-        {"severity":"HIGH"}
    }
```

```diff
    contract Rise ProxyAdminOwner Multisig (eth:0x9196464e3F828A50233C20732fa6898F4317002c) [GnosisSafe] {
    +++ description: None
      receivedPermissions.4.role:
-        ".$admin"
+        "admin"
      receivedPermissions.4.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
      fieldMeta.$admin:
-        {"severity":"HIGH"}
      fieldMeta.disputeGameFactory:
-        {"severity":"HIGH"}
      fieldMeta.systemConfig:
-        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
-        {"severity":"HIGH"}
      fieldMeta.proofMaturityDelaySeconds:
-        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds:
-        {"severity":"HIGH"}
      fieldMeta.respectedGameType:
-        {"severity":"HIGH"}
    }
```

```diff
    contract SuperchainConfig (eth:0xB786207A1EdfC724c1d507335f403F53fd9E79d6) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      fieldMeta.$admin:
-        {"severity":"HIGH"}
      fieldMeta.pauseExpiry:
-        {"severity":"HIGH"}
      fieldMeta.pauseExpiryFmt:
-        {"severity":"HIGH"}
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xC0de1d9B1cD2Caf782355C66a6A8e5948e63c9c6) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      fieldMeta.ResolvedDelegateProxy_addressManager:
-        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
-        {"severity":"HIGH"}
      fieldMeta.systemConfig:
-        {"severity":"HIGH"}
      fieldMeta.portal:
-        {"severity":"HIGH"}
      fieldMeta.PORTAL:
-        {"severity":"HIGH"}
      fieldMeta.otherMessenger:
-        {"severity":"HIGH"}
      fieldMeta.OTHER_MESSENGER:
-        {"severity":"HIGH"}
      fieldMeta.$admin:
-        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
-        {"addressManager":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
      directlyReceivedPermissions.3.role:
-        ".$admin"
+        "admin"
      directlyReceivedPermissions.3.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.$admin:
-        {"severity":"HIGH"}
      fieldMeta.owner:
-        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
-        {"severity":"HIGH"}
      fieldMeta.disputeGameFactory:
-        {"severity":"HIGH"}
      fieldMeta.optimismPortal:
-        {"severity":"HIGH"}
      fieldMeta.l1CrossDomainMessenger:
-        {"severity":"HIGH"}
      fieldMeta.l1StandardBridge:
-        {"severity":"HIGH"}
      fieldMeta.delayedWETH:
-        {"severity":"HIGH"}
      fieldMeta.batchInbox:
-        {"severity":"HIGH"}
      fieldMeta.gasPayingToken:
-        {"severity":"HIGH"}
      fieldMeta.resourceConfig:
-        {"severity":"HIGH"}
    }
```

```diff
    contract AddressManager (eth:0xdE3a0F0122f702e018e04C6D0824B724E8Be8e16) [opstack/AddressManager] {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      fieldMeta:
-        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract DelayedWETH (eth:0xf758C3bf7a4E2ad513B371B40c4Bd9A0E9716CF1) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      fieldMeta:
-        {"$admin":{"severity":"HIGH"},"delay":{"severity":"HIGH"},"config":{"severity":"HIGH"},"systemConfig":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract AccessManager (eth:0xF90a72FC295DBEf2fD27629Fda4B98Fd3E842d17) [succinct/OPSuccinct/AccessManager] {
    +++ description: Contract managing access control for proposers and challengers in OPSuccinct.
      fieldMeta.DISPUTE_GAME_FACTORY:
-        {"severity":"HIGH"}
      fieldMeta.isProposalPermissionlessMode:
-        {"severity":"HIGH"}
      fieldMeta.FALLBACK_TIMEOUT:
-        {"severity":"HIGH"}
      fieldMeta.FALLBACK_TIMEOUT_fmt.severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0xf33cdabc7ad0be9376bafd816e189fbf64053d5b

# Diff at Mon, 21 Sep 2026 07:13:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@cb454ea5283bcf30e392f86e07ac240d516636b4 block: 1785249452
- current timestamp: 1785249452

## Description

ossification re-review: pause-role holders are identity, not mechanism (HIGH -> MEDIUM)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      fieldMeta.disputeGameFinalityDelaySeconds_fmt.severity:
+        "HIGH"
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.retirementTimestamp:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFactory:
+        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
+        {"severity":"HIGH"}
      fieldMeta.systemConfig:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds:
+        {"severity":"HIGH"}
      fieldMeta.paused:
+        {"severity":"MEDIUM"}
    }
```

```diff
    contract L1StandardBridge (eth:0x553257678Dd11a6668a92934AAB005e420c6535A) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      fieldMeta.superchainConfig:
+        {"severity":"HIGH"}
      fieldMeta.systemConfig:
+        {"severity":"HIGH"}
      fieldMeta.messenger:
+        {"severity":"HIGH"}
      fieldMeta.MESSENGER:
+        {"severity":"HIGH"}
      fieldMeta.otherBridge:
+        {"severity":"HIGH"}
      fieldMeta.OTHER_BRIDGE:
+        {"severity":"HIGH"}
      fieldMeta.l2TokenBridge:
+        {"severity":"HIGH"}
      fieldMeta.paused:
+        {"severity":"MEDIUM"}
    }
```

```diff
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.permissionedGameArgs:
+        {"severity":"HIGH"}
    }
```

```diff
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
      fieldMeta.anchorStateRegistry:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFactory:
+        {"severity":"HIGH"}
      fieldMeta.systemConfig:
+        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
+        {"severity":"HIGH"}
      fieldMeta.ethLockbox:
+        {"severity":"HIGH"}
      fieldMeta.proofMaturityDelaySeconds:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFinalityDelaySeconds:
+        {"severity":"HIGH"}
    }
```

```diff
    contract SuperchainConfig (eth:0xB786207A1EdfC724c1d507335f403F53fd9E79d6) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.pauseExpiry:
+        {"severity":"HIGH"}
      fieldMeta.pauseExpiryFmt:
+        {"severity":"HIGH"}
      fieldMeta.guardian:
+        {"severity":"MEDIUM"}
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xC0de1d9B1cD2Caf782355C66a6A8e5948e63c9c6) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      fieldMeta.ResolvedDelegateProxy_addressManager:
+        {"severity":"HIGH"}
      fieldMeta.superchainConfig:
+        {"severity":"HIGH"}
      fieldMeta.systemConfig:
+        {"severity":"HIGH"}
      fieldMeta.portal:
+        {"severity":"HIGH"}
      fieldMeta.PORTAL:
+        {"severity":"HIGH"}
      fieldMeta.otherMessenger:
+        {"severity":"HIGH"}
      fieldMeta.OTHER_MESSENGER:
+        {"severity":"HIGH"}
      fieldMeta.paused:
+        {"severity":"MEDIUM"}
    }
```

```diff
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.superchainConfig:
+        {"severity":"HIGH"}
      fieldMeta.disputeGameFactory:
+        {"severity":"HIGH"}
      fieldMeta.optimismPortal:
+        {"severity":"HIGH"}
      fieldMeta.l1CrossDomainMessenger:
+        {"severity":"HIGH"}
      fieldMeta.l1StandardBridge:
+        {"severity":"HIGH"}
      fieldMeta.delayedWETH:
+        {"severity":"HIGH"}
      fieldMeta.batchInbox:
+        {"severity":"HIGH"}
      fieldMeta.gasPayingToken:
+        {"severity":"HIGH"}
      fieldMeta.resourceConfig:
+        {"severity":"HIGH"}
      fieldMeta.paused:
+        {"severity":"MEDIUM"}
    }
```

```diff
    contract DelayedWETH (eth:0xf758C3bf7a4E2ad513B371B40c4Bd9A0E9716CF1) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      fieldMeta.delay:
+        {"severity":"HIGH"}
      fieldMeta.config:
+        {"severity":"HIGH"}
      fieldMeta.systemConfig:
+        {"severity":"HIGH"}
    }
```

```diff
    contract AccessManager (eth:0xF90a72FC295DBEf2fD27629Fda4B98Fd3E842d17) [succinct/OPSuccinct/AccessManager] {
    +++ description: Contract managing access control for proposers and challengers in OPSuccinct.
      fieldMeta.FALLBACK_TIMEOUT_fmt.severity:
+        "HIGH"
      fieldMeta.DISPUTE_GAME_FACTORY:
+        {"severity":"HIGH"}
      fieldMeta.isProposalPermissionlessMode:
+        {"severity":"HIGH"}
      fieldMeta.FALLBACK_TIMEOUT:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x2018435f2bd3d63fc829c9b3833effb3da2e4abe

# Diff at Fri, 18 Sep 2026 10:17:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d903624f4bbcd7c3db85ae1858dfd3303fa28c5c block: 1785249452
- current timestamp: 1785249452

## Description

critical contracts and severities for the ossification perimeter

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle] {
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
      critical:
+        true
    }
```

```diff
    contract PermissionedDisputeGame (eth:0x2e7758aAD2B6D3D1Fd2C937D9B322378fC644633) [opstack/PermissionedDisputeGame] {
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
      fieldMeta.absolutePrestateDecoded.description:
-        "Prestate tag for known prestates."
+        "Prestate tag for known prestates. On clones-with-immutable-args implementations this reads 0 from the bare impl; the authoritative prestate lives in the DisputeGameFactory gameArgs (HIGH-watched there)."
      critical:
+        true
    }
```

```diff
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct] {
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
      critical:
+        true
    }
```

```diff
    contract L1StandardBridge (eth:0x553257678Dd11a6668a92934AAB005e420c6535A) [opstack/L1StandardBridge] {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS] {
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
      critical:
+        true
    }
```

```diff
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory] {
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
      fieldMeta.owner:
+        {"severity":"HIGH"}
      fieldMeta.wethFromDGF:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2] {
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
      fieldMeta.paused.severity:
-        "HIGH"
+        "MEDIUM"
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract SuperchainConfig (eth:0xB786207A1EdfC724c1d507335f403F53fd9E79d6) [opstack/SuperchainConfigFake_expiry] {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
      fieldMeta.paused.severity:
-        "HIGH"
+        "MEDIUM"
      critical:
+        true
    }
```

```diff
    contract L1CrossDomainMessenger (eth:0xC0de1d9B1cD2Caf782355C66a6A8e5948e63c9c6) [opstack/L1CrossDomainMessenger] {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.$admin:
+        {"severity":"HIGH"}
      fieldMeta.batcherHash:
+        {"severity":"LOW"}
      fieldMeta.owner:
+        {"severity":"HIGH"}
      critical:
+        true
    }
```

```diff
    contract AddressManager (eth:0xdE3a0F0122f702e018e04C6D0824B724E8Be8e16) [opstack/AddressManager] {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      critical:
+        true
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract DelayedWETH (eth:0xf758C3bf7a4E2ad513B371B40c4Bd9A0E9716CF1) [opstack/DelayedWETH] {
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
      critical:
+        true
      fieldMeta:
+        {"$admin":{"severity":"HIGH"},"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x0b90d9207cfed346d010b5b318c45d5bec8ca1e6

# Diff at Mon, 07 Sep 2026 08:37:58 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@25578f132c6c06c4de07ab98ad602d8239829c04 block: 1785249452
- current timestamp: 1785249452

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
    external contract (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x397A5f7f3dBd538f23DE225B51f532c34448dA9B","description":"affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","role":".owner"},{"permission":"interact","from":"eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e","description":"affect the liveness and safety of the gateway - can transfer ownership, add and freeze verifier routes.","role":".owner"}]
    }
```

Generated with discovered.json: 0xf527e3d6367b300afcc3743f9bcd34e367e94270

# Diff at Thu, 30 Jul 2026 11:25:16 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@582e1a34fd1cba95db9957343b373cd84374dd99 block: 1785249452
- current timestamp: 1785249452

## Description

Make shared-sp1 use entrypoints and rediscover

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1785249452 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
    reference SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e) {
    +++ description: None
      type:
-        "Contract"
+        "Reference"
      template:
-        "succinct/SP1VerifierGateway"
      sourceHashes:
-        ["0xf67f0dc1760fe9589909a16bfef47f76d6dfa71427e034d759a3d8da88a42645"]
      proxyType:
-        "immutable"
      description:
-        "This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract."
      deployerAddress:
-        "eth:0xDEd0000E32f8F40414d3ab3a830f735a3553E18e"
      sinceTimestamp:
-        1720099223
      sinceBlock:
-        20233410
      values:
-        {"$immutable":true,"activeVerifiers":[{"selector":"0xd4e8ecd2","verifier":"eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"},{"selector":"0xbb1a6f29","verifier":"eth:0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C"},{"selector":"0x5a093a2f","verifier":"eth:0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A"}],"allVerifiers":[{"selector":"0x801c66ac","verifier":"eth:0xfE2bb0Ad7F2c44Bd1289234Af08aD6FDEC0d54a2"},{"selector":"0x8c5bc5e4","verifier":"eth:0x331b350dDA287d0A65ce43103984CD44cb4Da9f0"},{"selector":"0xfedc1fcc","verifier":"eth:0x36B353776AF6EF3A2bD707049e783F52c4209017"},{"selector":"0xc430ff7f","verifier":"eth:0xc350F063C13a3Ca21331610fe159E697a5c9c2FB"},{"selector":"0xc865c1b6","verifier":"eth:0x6B6A7Ded061567d8A56279801DEA5cFB79be5bFc"},{"selector":"0x4aca240a","verifier":"eth:0x1764C29FBd94865198588f10FC75D4f6636d158d"},{"selector":"0x09069090","verifier":"eth:0x6A87EFd4e6B2Db1ed73129A8b9c51aaA583d49e3"},{"selector":"0x54bdcae3","verifier":"eth:0xd2832Cf1fC8bA210FfABF62Db9A8781153131d16"},{"selector":"0x1b34fe11","verifier":"eth:0xE00a3cBFC45241b33c0A44C78e26168CBc55EC63"},{"selector":"0xd4e8ecd2","verifier":"eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459"},{"selector":"0xbb1a6f29","verifier":"eth:0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C"},{"selector":"0x5a093a2f","verifier":"eth:0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A"}],"owner":"eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878"}
      fieldMeta:
-        {"activeVerifiers":{"description":"Verifiers that are routed to by their selector and not frozen."},"allVerifiers":{"description":"All verifiers that were ever routed to by this gateway."}}
      targetType:
+        "Contract"
      targetProject:
+        "shared-sp1"
    }
```

```diff
-   Status: DELETED
    contract SP1Verifier (eth:0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v6.0.0).
```

```diff
-   Status: DELETED
    contract SP1Verifier (eth:0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A) [shared-sp1/SP1Verifier]
    +++ description: None
```

```diff
-   Status: DELETED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) [GnosisSafe]
    +++ description: None
```

Generated with discovered.json: 0x86d72bb4d41300f4f38f908d96898ea2dc2d04ab

# Diff at Tue, 28 Jul 2026 14:38:38 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@fb0b50e4a7f7900d17e186f908b2b3ca3e977527 block: 1784537565
- current timestamp: 1785249452

## Description

SystemConfig: `batcherHash` rotated (`0x499a…8A41` → `0x0aE4…67d`); new batch submitter key.

## Watched changes

```diff
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig] {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.batcherHash:
-        "eth:0x499a15427F46685A362Dab7886A491FEfDf68A41"
+        "eth:0x0aE4b35f7F5efeB4c651684e1BCa12993dcBb67d"
    }
```

Generated with discovered.json: 0x7a401b2debf7d39a38e0f3a4353e8158bf439c4f

# Diff at Mon, 20 Jul 2026 08:54:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1784537565

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x01A6274B9607ac024e8c191E491d0b25ad14c217) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Rise Guardian Multisig (eth:0x03B85FAa108C10F6EFfec1d91954DE99dA32FB46) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x2e7758aAD2B6D3D1Fd2C937D9B322378fC644633) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e) [succinct/SP1VerifierGateway]
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x553257678Dd11a6668a92934AAB005e420c6535A) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v6.0.0).
```

```diff
+   Status: CREATED
    contract Rise ProxyAdminOwner Multisig (eth:0x9196464e3F828A50233C20732fa6898F4317002c) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0xB786207A1EdfC724c1d507335f403F53fd9E79d6) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract OPSuccinctFaultDisputeGame (eth:0xBf60dBc272833cD25f0426983c3175C32C8E5A7a) [succinct/OPSuccinct/OPSuccinctFaultDisputeGame]
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xC0de1d9B1cD2Caf782355C66a6A8e5948e63c9c6) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A) [shared-sp1/SP1Verifier]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xdE3a0F0122f702e018e04C6D0824B724E8Be8e16) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xE2B9526277DcD2B27222Df760D6427213AC9dbb8) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xf758C3bf7a4E2ad513B371B40c4Bd9A0E9716CF1) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AccessManager (eth:0xF90a72FC295DBEf2fD27629Fda4B98Fd3E842d17) [succinct/OPSuccinct/AccessManager]
    +++ description: Contract managing access control for proposers and challengers in OPSuccinct.
```
