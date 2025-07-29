Generated with discovered.json: 0x5fcf78102bd86db6c30c2e625325d940cd29227e

# Diff at Mon, 14 Jul 2025 12:45:08 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22208402
- current block number: 22208402

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    EOA  (0x000000000000000000000000000000000000dEaD) {
    +++ description: None
      address:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
    }
```

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      address:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.addressManager:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      values.owner:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
+        "eth:0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      implementationNames.0x081A54442Af40a26Ae453Da0F044a49Aa3314453:
-        "ProxyAdmin"
      implementationNames.eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453:
+        "ProxyAdmin"
    }
```

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      address:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x7f65D6C6CBd3cd796B969583Bb66B6b40f1eA6f3"
+        "eth:0x7f65D6C6CBd3cd796B969583Bb66B6b40f1eA6f3"
      values.l2TokenBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.messenger:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.MESSENGER:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000010"
+        "eth:0x4200000000000000000000000000000000000010"
      values.superchainConfig:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      implementationNames.0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C:
-        "L1ChugSplashProxy"
      implementationNames.0x7f65D6C6CBd3cd796B969583Bb66B6b40f1eA6f3:
-        "L1StandardBridge"
      implementationNames.eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C:
+        "L1ChugSplashProxy"
      implementationNames.eth:0x7f65D6C6CBd3cd796B969583Bb66B6b40f1eA6f3:
+        "L1StandardBridge"
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      address:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "eth:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE"
+        "eth:0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE"
      values.$pastUpgrades.0.2.0:
-        "0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE"
+        "eth:0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE"
      values.bridge:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      values.BRIDGE:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      implementationNames.0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083:
-        "Proxy"
      implementationNames.0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE:
-        "OptimismMintableERC20Factory"
      implementationNames.eth:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083:
+        "Proxy"
      implementationNames.eth:0x8d25eE2a806642f7272bad8e5e18CBd79eE5BdcE:
+        "OptimismMintableERC20Factory"
    }
```

```diff
    EOA  (0x42Cc463b4C74cdC341e882d109f1BEE79CE7328b) {
    +++ description: None
      address:
-        "0x42Cc463b4C74cdC341e882d109f1BEE79CE7328b"
+        "eth:0x42Cc463b4C74cdC341e882d109f1BEE79CE7328b"
    }
```

```diff
    EOA  (0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9) {
    +++ description: None
      address:
-        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
+        "eth:0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
    }
```

```diff
    EOA  (0x4FACE9ec6237C04a22d434989Beb30b43055886D) {
    +++ description: None
      address:
-        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
+        "eth:0x4FACE9ec6237C04a22d434989Beb30b43055886D"
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      address:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5"
+        "eth:0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5"
      values.$pastUpgrades.0.2.0:
-        "0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5"
+        "eth:0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5"
+++ severity: HIGH
      values.challenger:
-        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
+        "eth:0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
      values.CHALLENGER:
-        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
+        "eth:0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
+++ severity: HIGH
      values.proposer:
-        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
+        "eth:0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      values.PROPOSER:
-        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
+        "eth:0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      implementationNames.0x53C64d7c9a28911203Ba4BE2a6cA58254184920a:
-        "Proxy"
      implementationNames.0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5:
-        "L2OutputOracle"
      implementationNames.eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a:
+        "Proxy"
      implementationNames.eth:0x8a9f35a100B11B71b79969c0527e1d3Cec8A24d5:
+        "L2OutputOracle"
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      address:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "eth:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0xdF9164F7e66704f5B01a31ace233767946e82F76"
+        "eth:0xdF9164F7e66704f5B01a31ace233767946e82F76"
      values.$pastUpgrades.0.2.0:
-        "0xdF9164F7e66704f5B01a31ace233767946e82F76"
+        "eth:0xdF9164F7e66704f5B01a31ace233767946e82F76"
      values.messenger:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.MESSENGER:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.OTHER_BRIDGE:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.otherBridge:
-        "0x4200000000000000000000000000000000000014"
+        "eth:0x4200000000000000000000000000000000000014"
      values.superchainConfig:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      implementationNames.0x6345b54426A5B80A377d07C97672331Bda3432e6:
-        "Proxy"
      implementationNames.0xdF9164F7e66704f5B01a31ace233767946e82F76:
-        "L1ERC721Bridge"
      implementationNames.eth:0x6345b54426A5B80A377d07C97672331Bda3432e6:
+        "Proxy"
      implementationNames.eth:0xdF9164F7e66704f5B01a31ace233767946e82F76:
+        "L1ERC721Bridge"
    }
```

```diff
    EOA  (0x652b0ee2F6727e3627328E170Fa2373B50E81601) {
    +++ description: None
      address:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
+        "eth:0x652b0ee2F6727e3627328E170Fa2373B50E81601"
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      address:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x0351c7341AAe6A69487eb007AA37159BD6878285"
+        "eth:0x0351c7341AAe6A69487eb007AA37159BD6878285"
      values.$pastUpgrades.0.2.0:
-        "0x0351c7341AAe6A69487eb007AA37159BD6878285"
+        "eth:0x0351c7341AAe6A69487eb007AA37159BD6878285"
      values.batcherHash:
-        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
+        "eth:0xd668A64E69ef82026deB46491BFCd28ba14024C8"
      values.batchInbox:
-        "0xFf00000000000000000000000000000000000aD9"
+        "eth:0xFf00000000000000000000000000000000000aD9"
      values.l1CrossDomainMessenger:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.l1ERC721Bridge:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "eth:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      values.l1StandardBridge:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      values.l2OutputOracle:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      values.optimismMintableERC20Factory:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "eth:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      values.optimismPortal:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      values.owner:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
+        "eth:0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      values.sequencerInbox:
-        "0xFf00000000000000000000000000000000000aD9"
+        "eth:0xFf00000000000000000000000000000000000aD9"
      values.unsafeBlockSigner:
-        "0x42Cc463b4C74cdC341e882d109f1BEE79CE7328b"
+        "eth:0x42Cc463b4C74cdC341e882d109f1BEE79CE7328b"
      implementationNames.0x8C467dAC40f01DFA83666F39108992a0635faeD9:
-        "Proxy"
      implementationNames.0x0351c7341AAe6A69487eb007AA37159BD6878285:
-        "SystemConfig"
      implementationNames.eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9:
+        "Proxy"
      implementationNames.eth:0x0351c7341AAe6A69487eb007AA37159BD6878285:
+        "SystemConfig"
    }
```

```diff
    EOA  (0xA1D6a47973D55FD4F6432B370CE5381fB24A3094) {
    +++ description: None
      address:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
+        "eth:0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
    }
```

```diff
    EOA  (0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7) {
    +++ description: None
      address:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
    }
```

```diff
    EOA  (0xaC79765A73eB9dcBd3c427181E6819902AE25b48) {
    +++ description: None
      address:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
    }
```

```diff
    EOA  (0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2) {
    +++ description: None
      address:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      address:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D"
+        "eth:0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D"
      values.$pastUpgrades.0.2.0:
-        "0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D"
+        "eth:0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D"
      values.guardian:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
+        "eth:0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      implementationNames.0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0:
-        "Proxy"
      implementationNames.0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D:
-        "SuperchainConfig"
      implementationNames.eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0:
+        "Proxy"
      implementationNames.eth:0x04b259e2a4D3D0B961A3b099861AaEeA6BF39e6D:
+        "SuperchainConfig"
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      address:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      values.owner:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      implementationNames.0xCD749A3e59543B31658b725136Ef3616bE7001bc:
-        "AddressManager"
      implementationNames.eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc:
+        "AddressManager"
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      address:
-        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "eth:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162"
+        "eth:0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162"
      values.$pastUpgrades.0.2.0:
-        "0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162"
+        "eth:0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162"
      values.owner:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
+        "eth:0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      implementationNames.0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6:
-        "Proxy"
      implementationNames.0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162:
-        "DataAvailabilityChallenge"
      implementationNames.eth:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6:
+        "Proxy"
      implementationNames.eth:0xcEEF52d78DD47b80Cf7d4f19bef646b644A43162:
+        "DataAvailabilityChallenge"
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      address:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF"
+        "eth:0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF"
      values.$pastUpgrades.0.2.0:
-        "0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF"
+        "eth:0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF"
      values.guardian:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
+        "eth:0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      values.GUARDIAN:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
+        "eth:0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      values.L2_ORACLE:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      values.l2Oracle:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      values.l2Sender:
-        "0x000000000000000000000000000000000000dEaD"
+        "eth:0x000000000000000000000000000000000000dEaD"
      values.superchainConfig:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      values.SYSTEM_CONFIG:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      values.systemConfig:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      implementationNames.0xd2726bde3D07645faf5aD7cCF15C94817B3556D6:
-        "Proxy"
      implementationNames.0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF:
-        "OptimismPortal"
      implementationNames.eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6:
+        "Proxy"
      implementationNames.eth:0x03783fe183B68De1Ae3673Cb098039F58Ca49BaF:
+        "OptimismPortal"
    }
```

```diff
    EOA  (0xd668A64E69ef82026deB46491BFCd28ba14024C8) {
    +++ description: None
      address:
-        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
+        "eth:0xd668A64E69ef82026deB46491BFCd28ba14024C8"
    }
```

```diff
    EOA  (0xe707673F66496fEa136B4AcC00Ce1c4430f9b138) {
    +++ description: None
      address:
-        "0xe707673F66496fEa136B4AcC00Ce1c4430f9b138"
+        "eth:0xe707673F66496fEa136B4AcC00Ce1c4430f9b138"
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      address:
-        "0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      values.$admin:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      values.$implementation:
-        "0xa537c425181C252eD396592BD2f0Cafbebb6D163"
+        "eth:0xa537c425181C252eD396592BD2f0Cafbebb6D163"
      values.$pastUpgrades.0.2.0:
-        "0xa537c425181C252eD396592BD2f0Cafbebb6D163"
+        "eth:0xa537c425181C252eD396592BD2f0Cafbebb6D163"
      values.OTHER_MESSENGER:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.otherMessenger:
-        "0x4200000000000000000000000000000000000007"
+        "eth:0x4200000000000000000000000000000000000007"
      values.portal:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      values.PORTAL:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      values.ResolvedDelegateProxy_addressManager:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      values.superchainConfig:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      implementationNames.0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B:
-        "ResolvedDelegateProxy"
      implementationNames.0xa537c425181C252eD396592BD2f0Cafbebb6D163:
-        "L1CrossDomainMessenger"
      implementationNames.eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B:
+        "ResolvedDelegateProxy"
      implementationNames.eth:0xa537c425181C252eD396592BD2f0Cafbebb6D163:
+        "L1CrossDomainMessenger"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      address:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
+        "eth:0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
+        "eth:0xB5b01E638CEF6AE50462A487d70005D6fe85eCf2"
      values.$members.1:
-        "0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
+        "eth:0xaC79765A73eB9dcBd3c427181E6819902AE25b48"
      values.$members.2:
-        "0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
+        "eth:0xa8AC7D03BEb92Fa3E6030AEB21629D00Ffb66dD7"
      values.$members.3:
-        "0xe707673F66496fEa136B4AcC00Ce1c4430f9b138"
+        "eth:0xe707673F66496fEa136B4AcC00Ce1c4430f9b138"
      implementationNames.0xf040a7A04e914E1b4383C04359D03Ab5F12E7828:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xf040a7A04e914E1b4383C04359D03Ab5F12E7828:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0xFf00000000000000000000000000000000000aD9) {
    +++ description: None
      address:
-        "0xFf00000000000000000000000000000000000aD9"
+        "eth:0xFf00000000000000000000000000000000000aD9"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828)
    +++ description: None
```

Generated with discovered.json: 0x202ddd3f1bc29a12ce0b7964e42be57cbb1501e3

# Diff at Mon, 14 Jul 2025 08:02:44 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@0dc82cd5064c9c6dc9fb20e2291a8bb6b2048e27 block: 22208402
- current block number: 22208402

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
      description:
-        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa."
+        "A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa."
    }
```

Generated with discovered.json: 0x1b7e0abd3892f7122cd63a962d0506c8c51e4ef5

# Diff at Fri, 04 Jul 2025 12:19:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22208402
- current block number: 22208402

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.0.from:
-        "ethereum:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "eth:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      directlyReceivedPermissions.3.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.4.from:
-        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "eth:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.6.from:
-        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "eth:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.8.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.9.from:
-        "ethereum:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
    }
```

```diff
    EOA  (0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.1.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
    }
```

```diff
    EOA  (0x4FACE9ec6237C04a22d434989Beb30b43055886D) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.1.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
    }
```

```diff
    EOA  (0x652b0ee2F6727e3627328E170Fa2373B50E81601) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.1.from:
-        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "eth:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
    }
```

```diff
    EOA  (0xA1D6a47973D55FD4F6432B370CE5381fB24A3094) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.1.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.2.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
    }
```

```diff
    EOA  (0xd668A64E69ef82026deB46491BFCd28ba14024C8) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.0.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.0.from:
-        "ethereum:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "eth:0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      receivedPermissions.1.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.1.from:
-        "ethereum:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "eth:0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.2.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.2.from:
-        "ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "eth:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      receivedPermissions.3.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.3.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "eth:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.4.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.4.from:
-        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "eth:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.5.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.5.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "eth:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.6.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.6.from:
-        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "eth:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.7.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.7.from:
-        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "eth:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.8.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.8.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "eth:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.9.via.0.address:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      receivedPermissions.9.from:
-        "ethereum:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
+        "eth:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
      directlyReceivedPermissions.0.from:
-        "ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
+        "eth:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
    }
```

Generated with discovered.json: 0x2e5225325f11911801b900e9913ee53a074b0d08

# Diff at Mon, 16 Jun 2025 08:42:01 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e1208475abce20cea1768d2e4878c03350c1b7c9 block: 22208402
- current block number: 22208402

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083","role":"admin"}
      directlyReceivedPermissions.8.from:
-        "ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.7.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.6.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.5.from:
-        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.4.from:
-        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.3.from:
-        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.2.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "ethereum:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      values.$admin:
+        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.9:
+        {"permission":"upgrade","from":"ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083","role":"admin","via":[{"address":"ethereum:0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}
      receivedPermissions.8.from:
-        "ethereum:0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
+        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.7.from:
-        "ethereum:0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
+        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.6.from:
-        "ethereum:0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
+        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.5.from:
-        "ethereum:0x6345b54426A5B80A377d07C97672331Bda3432e6"
+        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.4.from:
-        "ethereum:0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
+        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.3.from:
-        "ethereum:0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
+        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.2.from:
-        "ethereum:0x8C467dAC40f01DFA83666F39108992a0635faeD9"
+        "ethereum:0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B"
    }
```

Generated with discovered.json: 0xd65a3c6c8360bc69d17b9e42d36d11911d532e10

# Diff at Fri, 30 May 2025 06:59:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a4d8c436027d17df0f9b76843cd6deb1888fa381 block: 22208402
- current block number: 22208402

## Description

config: change comment about eip1559 fee val

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      fieldMeta.eip1559Denominator:
+        {"description":"volatility param: lower denominator -> quicker fee changes on L2"}
    }
```

Generated with discovered.json: 0x9240cb5000e193c5f83c754817e3f44a89b24931

# Diff at Fri, 23 May 2025 09:40:57 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22208402
- current block number: 22208402

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.8.role:
+        "admin"
      directlyReceivedPermissions.7.role:
+        "admin"
      directlyReceivedPermissions.6.role:
+        "admin"
      directlyReceivedPermissions.5.role:
+        "admin"
      directlyReceivedPermissions.4.role:
+        "admin"
      directlyReceivedPermissions.3.role:
+        "admin"
      directlyReceivedPermissions.2.role:
+        "admin"
      directlyReceivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.from:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      directlyReceivedPermissions.1.role:
+        ".$admin"
      directlyReceivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      directlyReceivedPermissions.0.from:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"challenge","from":"0x53C64d7c9a28911203Ba4BE2a6cA58254184920a","role":".CHALLENGER"}
      receivedPermissions.0.role:
+        ".challenger"
    }
```

```diff
    EOA  (0x4FACE9ec6237C04a22d434989Beb30b43055886D) {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"propose","from":"0x53C64d7c9a28911203Ba4BE2a6cA58254184920a","role":".proposer"}
      receivedPermissions.0.role:
+        ".PROPOSER"
    }
```

```diff
    EOA  (0x652b0ee2F6727e3627328E170Fa2373B50E81601) {
    +++ description: None
      receivedPermissions.1.role:
+        ".owner"
      receivedPermissions.0.role:
+        ".owner"
    }
```

```diff
    EOA  (0xA1D6a47973D55FD4F6432B370CE5381fB24A3094) {
    +++ description: None
      receivedPermissions.2:
+        {"permission":"guard","from":"0xd2726bde3D07645faf5aD7cCF15C94817B3556D6","role":".GUARDIAN"}
      receivedPermissions.1.role:
+        ".guardian"
      receivedPermissions.0.role:
+        ".guardian"
    }
```

```diff
    EOA  (0xd668A64E69ef82026deB46491BFCd28ba14024C8) {
    +++ description: None
      receivedPermissions.0.role:
+        ".batcherHash"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.8.role:
+        "admin"
      receivedPermissions.7.role:
+        "admin"
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
      receivedPermissions.1.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.1.from:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.1.description:
-        "set and change address mappings."
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
      receivedPermissions.1.role:
+        ".$admin"
      receivedPermissions.0.permission:
-        "upgrade"
+        "interact"
      receivedPermissions.0.from:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      receivedPermissions.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
+        "set and change address mappings."
      receivedPermissions.0.role:
+        ".owner"
      directlyReceivedPermissions.0.role:
+        ".owner"
    }
```

Generated with discovered.json: 0x9c2a1cc9a6ac1a43edf90ffae1a09b86d6501dfc

# Diff at Tue, 29 Apr 2025 08:19:03 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22208402
- current block number: 22208402

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22208402 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9","via":[]},{"permission":"propose","to":"0x4FACE9ec6237C04a22d434989Beb30b43055886D","via":[]},{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x652b0ee2F6727e3627328E170Fa2373B50E81601","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0xd668A64E69ef82026deB46491BFCd28ba14024C8","via":[]},{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0xA1D6a47973D55FD4F6432B370CE5381fB24A3094","via":[]},{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","description":"set and change address mappings.","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions:
-        [{"permission":"interact","to":"0x652b0ee2F6727e3627328E170Fa2373B50E81601","description":"can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure.","via":[]},{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0xA1D6a47973D55FD4F6432B370CE5381fB24A3094","via":[]},{"permission":"upgrade","to":"0xf040a7A04e914E1b4383C04359D03Ab5F12E7828","via":[{"address":"0x081A54442Af40a26Ae453Da0F044a49Aa3314453"}]}]
    }
```

Generated with discovered.json: 0x140bf322864db81a6de61adfbc6ec1a93916aec4

# Diff at Thu, 27 Mar 2025 11:14:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@8cc2e36080df3a74dfd8475d41c64f46203f5218 block: 21235441
- current block number: 21235441

## Description

ARCHIVED.
NOTE 25/04/09: Upgraded to an unverified bridge contract and [withdrew all remaining funds](https://etherscan.io/tx/0x0d5111c670dce75cb206d7f0976ed2c2f0ba03e465eda6fbdbb0ce06392c4a9b).

Config related: add guardian description details, hide some noisy values, hide AddressManager as spam cat, add proposer / challenger to permissioned opfp chains.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      category:
+        {"name":"Spam","priority":-1}
    }
```

Generated with discovered.json: 0x5f44661c820663b7534f027489acae7e88a379f6

# Diff at Wed, 19 Mar 2025 13:04:46 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@e950b6e93c84855ee2ec1740913b7b4c994b9ae2 block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract undefined (0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

```diff
    contract undefined (0x4FACE9ec6237C04a22d434989Beb30b43055886D) {
    +++ description: None
      severity:
-        "HIGH"
    }
```

Generated with discovered.json: 0x76d60958ab9338989d0f5beb9f9165a5096f6a04

# Diff at Tue, 04 Mar 2025 11:25:45 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@be38e12d3ff947ca8de40f3a23a9ba1875a54f5a block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isSomeTxsLengthEqualToCelestiaDAExample:
-        false
      values.opStackDA.isUsingCelestia:
+        false
    }
```

Generated with discovered.json: 0x18dba6d1a5cf356a27aea6b4d85031c218b5eb69

# Diff at Tue, 04 Mar 2025 10:39:12 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      sinceBlock:
+        20031092
    }
```

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      sinceBlock:
+        20031107
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      sinceBlock:
+        20031109
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      sinceBlock:
+        20031112
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      sinceBlock:
+        20031110
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      sinceBlock:
+        20031106
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      sinceBlock:
+        20031095
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      sinceBlock:
+        20031091
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      sinceBlock:
+        20031101
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      sinceBlock:
+        20031105
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      sinceBlock:
+        20031108
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      sinceBlock:
+        20031090
    }
```

Generated with discovered.json: 0xaed7da699c192b7469fe984c9e894c972c51b4f6

# Diff at Wed, 26 Feb 2025 10:32:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@18513668f913fbe57a197f43655b19111df0e627 block: 21235441
- current block number: 21235441

## Description

config related: added categories for all opstack, op stack and polygoncdk stack templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      category:
+        {"name":"Canonical Bridges","priority":2}
    }
```

Generated with discovered.json: 0x306b427d1cfcb2c8dfcc32bb433106d751fecbac

# Diff at Fri, 21 Feb 2025 14:07:26 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d219f271711b2cf7a164e3443bead5e4957d13a8 block: 21235441
- current block number: 21235441

## Description

Config related: Change some severities and add templates.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      fieldMeta.proposer:
+        {"severity":"HIGH"}
      fieldMeta.challenger:
+        {"severity":"HIGH"}
      fieldMeta.deletedOutputs:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0x7ac41dea43d522844456cc6c7432b936803a8429

# Diff at Fri, 21 Feb 2025 08:59:30 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1cf9ec35847912163c4b663a633e258a434c0bca block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      categories:
-        ["Gateways&Escrows"]
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      categories:
-        ["Upgrades&Governance"]
    }
```

```diff
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B) {
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
      categories:
-        ["Core"]
    }
```

Generated with discovered.json: 0xa35fbfbb17654d52ffa0ddfd4a3313c91c7a16b2

# Diff at Mon, 10 Feb 2025 19:04:00 GMT:

- author: Michał Podsiadły (<michal.podsiadly@l2beat.com>)
- comparing to: main@3756adff7c1ac86d8af3374a90a75c1999aae2b3 block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      values.opStackDA.isUsingEigenDA:
+        false
    }
```

Generated with discovered.json: 0xa1caf380818608eda6297ff2166ff3653050c627

# Diff at Tue, 04 Feb 2025 12:31:28 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@145553eed7ba44636411ecb25e4099728acd02f9 block: 21235441
- current block number: 21235441

## Description

Rename 'configure' permission to 'interact'

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.0.permission:
-        "configure"
+        "interact"
    }
```

Generated with discovered.json: 0xcfcaaab272ce2fe9521df7028334c0a36279de1c

# Diff at Mon, 20 Jan 2025 11:09:33 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21235441
- current block number: 21235441

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453) {
    +++ description: None
      directlyReceivedPermissions.8.target:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.8.from:
+        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      directlyReceivedPermissions.7.target:
-        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.7.from:
+        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      directlyReceivedPermissions.6.target:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.6.from:
+        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      directlyReceivedPermissions.5.target:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.5.from:
+        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      directlyReceivedPermissions.4.target:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.4.from:
+        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      directlyReceivedPermissions.3.target:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.3.from:
+        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      directlyReceivedPermissions.2.target:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      directlyReceivedPermissions.2.from:
+        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      directlyReceivedPermissions.1.target:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.1.from:
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      directlyReceivedPermissions.0.target:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.0.from:
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
    }
```

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "upgrading the bridge implementation can give access to all funds escrowed therein."
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.description:
+        "upgrading the bridge implementation can give access to all funds escrowed therein."
    }
```

```diff
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
    }
```

```diff
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions.2.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.target:
-        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      issuedPermissions.1.to:
+        "0x4FACE9ec6237C04a22d434989Beb30b43055886D"
      issuedPermissions.0.target:
-        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
      issuedPermissions.0.to:
+        "0x4d9D11fF877aCD0918CF467B14cE4C3d8F1b97d9"
    }
```

```diff
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
    }
```

```diff
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions.2.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.2.via.0.delay:
-        0
      issuedPermissions.2.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.target:
-        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
      issuedPermissions.1.to:
+        "0xd668A64E69ef82026deB46491BFCd28ba14024C8"
      issuedPermissions.0.target:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.to:
+        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.description:
+        "it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system."
    }
```

```diff
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      issuedPermissions.0.to:
+        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
    }
```

```diff
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions.0.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.via.0.delay:
-        0
      issuedPermissions.0.via.0.description:
-        "set and change address mappings."
      issuedPermissions.0.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.description:
+        "set and change address mappings."
    }
```

```diff
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6) {
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.to:
+        "0x652b0ee2F6727e3627328E170Fa2373B50E81601"
      issuedPermissions.0.description:
+        "can upgrade the parameters of DA challenges like the bond size or refund percentages, potentially making challenges infeasable or insecure."
    }
```

```diff
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions.1.target:
-        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.1.via.0.delay:
-        0
      issuedPermissions.1.to:
+        "0xf040a7A04e914E1b4383C04359D03Ab5F12E7828"
      issuedPermissions.0.target:
-        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
      issuedPermissions.0.to:
+        "0xA1D6a47973D55FD4F6432B370CE5381fB24A3094"
    }
```

```diff
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828) {
    +++ description: None
      receivedPermissions.8.target:
-        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.8.from:
+        "0xd2726bde3D07645faf5aD7cCF15C94817B3556D6"
      receivedPermissions.7.target:
-        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.7.from:
+        "0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6"
      receivedPermissions.6.target:
-        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.6.from:
+        "0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0"
      receivedPermissions.5.target:
-        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.5.from:
+        "0x8C467dAC40f01DFA83666F39108992a0635faeD9"
      receivedPermissions.4.target:
-        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.4.from:
+        "0x6345b54426A5B80A377d07C97672331Bda3432e6"
      receivedPermissions.3.target:
-        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.3.from:
+        "0x53C64d7c9a28911203Ba4BE2a6cA58254184920a"
      receivedPermissions.2.target:
-        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      receivedPermissions.2.from:
+        "0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083"
      receivedPermissions.1.target:
-        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.1.from:
+        "0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C"
      receivedPermissions.0.target:
-        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      receivedPermissions.0.from:
+        "0xCD749A3e59543B31658b725136Ef3616bE7001bc"
      directlyReceivedPermissions.0.target:
-        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
      directlyReceivedPermissions.0.from:
+        "0x081A54442Af40a26Ae453Da0F044a49Aa3314453"
    }
```

Generated with discovered.json: 0x4afdcef136dc21f930a744954b7ee00aa7d2491e

# Diff at Wed, 08 Jan 2025 09:01:30 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@deefa974378c2cd6b74f061e1f5a494bbbe1d63a block: 21235441
- current block number: 21235441

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21235441 (main branch discovery), not current.

```diff
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      description:
-        "The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token."
+        "The main entry point to deposit ERC20 tokens from host chain to this chain."
    }
```

Generated with discovered.json: 0x5a8b4b3276f73ea8f15defaf1ba19c122454c46f

# Diff at Tue, 19 Nov 2024 15:24:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 21222656

## Description

OP stack in alt-DA mode, not using EigenDA currently (judging from the DA-service byte in the tx data commitments). Thus BasementDA with DA challenges. Challenges must be respected in the L2 node's derivation rule, which is not clear here, but we assume they use the standard node like xterio, redstone, cyber.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (0x081A54442Af40a26Ae453Da0F044a49Aa3314453)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x2321F7982Af3cBbA1Ab9D426ae7fe595E1CF427C)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain. This contract can store any token.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x34B4AcC9e4523Cc6bbfC367B9034121c447b4083)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0x53C64d7c9a28911203Ba4BE2a6cA58254184920a)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x6345b54426A5B80A377d07C97672331Bda3432e6)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x8C467dAC40f01DFA83666F39108992a0635faeD9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0xB83831efA1Cc1bFF0c29ed0d8df1943F834442A0)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract AddressManager (0xCD749A3e59543B31658b725136Ef3616bE7001bc)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract DataAvailabilityChallenge (0xd1fe2EEb5637b0F78BfcEd9186ebE716aC73DEb6)
    +++ description: The DataAvailabilityChallenge contract is used to challenge the full availability of data behind commimted transaction data hashes. See the technology section for more details.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xd2726bde3D07645faf5aD7cCF15C94817B3556D6)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0xea6390d969aacd4BA217F6b4614dDAE4bdDb1B3B)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GmMultisig (0xf040a7A04e914E1b4383C04359D03Ab5F12E7828)
    +++ description: None
```
