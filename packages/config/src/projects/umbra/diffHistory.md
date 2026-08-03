Generated with discovered.json: 0x2096d62532c4c010ca9456daec2771c365a72df0

# Diff at Mon, 03 Aug 2026 10:26:34 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1785499067

## Description

Initial discovery of Umbra contracts

## Initial discovery

```diff
+   Status: CREATED
    contract StealthKeyRegistry (eth:0x31fe56609C65Cd0C510E7125f051D440424D38f3) [N/A]
    +++ description: Public registry that maps an Ethereum address to its two secp256k1 stealth public keys: a spending key used to derive a fresh stealth address, and a viewing key used to encrypt the transfer metadata for the recipient.
```

```diff
+   Status: CREATED
    contract Umbra (eth:0xFb2dc580Eed955B528407b4d36FfaFe3da685401) [N/A]
    +++ description: Main entry point of the Umbra protocol, routing all ETH and ERC-20 stealth payments. On send, it emits an Announcement event that the recipient scans to detect the payment. ETH is forwarded directly to a fresh stealth address, ERC-20s are escrowed in this smart contract.
```
