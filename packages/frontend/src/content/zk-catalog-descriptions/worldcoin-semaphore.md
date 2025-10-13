Worldcoin uses two types of circuits: Semaphore to prove the inclusion of a WorldId in the anonymity set, and the Semaphore Merkle Tree Batcher (SMTB) to efficiently insert or delete users from the Semaphore Merkle trees.

## Semaphore

Worldcoin uses two semaphore anonymity sets, one called 'orb' (OpWorldID_One), used for verified humans, and the other called 'phone' (OpWorldID_Zero) for verified unique devices. More information can be found [here](https://docs.world.org/world-id/concepts). The two contracts have the same source code and contain multiple verification keys for multiple semaphore verifiers of different sizes, going from size 16 to 32. Currently, only the ones with size 30 are used. An example of a semaphore verification transaction can be found [here](https://app.blocksec.com/explorer/tx/optimism/0xfe3821e05483c290300d9da497fcf9720e3a7369a1b483786faa28fd694ce2b7?line=8).

The circuit is written in circom and the keys are generated using the snarkjs library. The semaphore artifacts can be found [here](https://semaphore.pse.dev/).

### Verification process

The procedure is explained for the semaphore circuit of size 30. While, as mentioned, the verifier contains the verification keys for all semaphore sizes from 16 to 32, the verification is always called with size 30 as the param is hardcoded, which can be verified [here](https://optimistic.etherscan.io/address/0xB3E7771a6e2d7DD8C0666042B7a07C39b938eb7d#code#F2#L24) for OPWorldID_One and [here](https://optimistic.etherscan.io/address/0x42FF98C4E85212a5D31358ACbFe76a621b50fC02#code#F2#L26) for OPWorldID_Zero. To verify that the value 30 is actually the one used it is sufficient to look at one transaction for each of them. A script that semi-automatically performs the verification process from this point on can be found [here](https://github.com/lucadonnoh/WLD-vkeys-verifier/tree/main). If you perform the verification manually, make sure to install the needed tools with the correct versions, as the verification fails with the latest ones.

![Semaphore verification process](/images/zk-catalog/semaphore-verification.png)

**From the .circom to the .r1cs file**: the circom version used in the original verification key generation process is non-deterministic, meaning that a different r1cs file is generated every time the circom file is compiled. A workaround is currently being investigated.

**From the .r1cs to the onchain verification keys**: download the corresponding r1cs file from the semaphore artifacts. This can be done manually or with the following command:

`curl https://storage.googleapis.com/trustedsetup-a86f4.appspot.com/semaphore/semaphore30/semaphore30.r1cs -o semaphore30.r1cs`

Then, download the corresponding PPOT:

`curl https://storage.googleapis.com/trustedsetup-a86f4.appspot.com/ptau/pot14_final.ptau -o pot14_final.ptau`

Finally, we need to download the claimed verification keys:

`curl https://storage.googleapis.com/trustedsetup-a86f4.appspot.com/semaphore/semaphore30/semaphore30_final.zkey -o semaphore30_final.zkey`

Now we can run snarkjs to verify that the claimed verification keys have been indeed generated from the r1cs and the PPOT:

`snarkjs zkv semaphore30.r1cs pot14_final.ptau semaphore30_final.zkey`

If the verification is successful, the output will be `ZKey Ok!`.

We can now extract the verification keys from the zkey file:

`snarkjs zkev semaphore30_final.zkey verification_key30.json`

Now it's time to compare the onchain verification keys to the generated ones. Download the corresponding onchain verifier either manually or using the following command using [Foundry](https://book.getfoundry.sh/):

`cast etherscan-source 0x3D40F9b177aFb9BF7e41999FFaF5aBA6cb3847eF --etherscan-api-key "${ETHERSCAN_API_KEY}" --chain optimism > SemaphoreVerifier.sol`

The `_getVerificationKey` function shows how the verification keys are fetched. In particular, the `alpha1`, `beta2` and `gamma2` values are hardcoded in the function (because size-independent) while the `delta2` and `IC` values are fetched from the `VK_POINTS` array depending on the size.
