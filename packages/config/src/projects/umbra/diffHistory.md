Generated with discovered.json: 0x43eac8955664e90e2dcda29e72b3591cbc4064e2

# Diff at Mon, 17 Aug 2026 09:46:02 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e15ee9ab50a72bce8c9055a32fc94661b3b947e2 block: 1785499067
- current timestamp: 1786959877

## Description

7702 delegation.

## Watched changes

```diff
    EOA  (eth:0xb4435399AB53D6136C9AEEBb77a0120620b117F9) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0xb4435399AB53D6136C9AEEBb77a0120620b117F9","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0x9962d46a78b1e6906da83f5bd75621a608112e6b851709d6504888d73d532e1c","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

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
