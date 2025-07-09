import type { ProjectTechnologyChoice } from '../types'

export const ESPRESSO: ProjectTechnologyChoice = {
  name: 'Espresso TEE sequencer',
  description: `Integration with Espresso sequencing. 
        In addition to providing regular pre-confirmations, the sequencer publishes blocks to the Espresso Network.
        The integration expects the transaction batch poster to run inside a Trusted Execution Environment (TEE), and it is programmed to verify batch inclusion in a Espresso Network block before publishing it to the host chain.
        However, the confirmations provided by Espresso Network are additive, and the batch poster can skip Espresso inclusion checks should the Espresso Network be down or unavailable.
        To ensure the batch poster is running inside a TEE, the SequencerInbox contract on the host chain was updated so that the data posting function also includes a TEE attestation as input (a "quote" / signature) that is verified onchain by the EspressoTEEVerifier for each batch transaction. 
        The verifier checks whether the signature originates from inside the TEE and reverts if unsuccessful.`,
  references: [
    {
      url: 'https://github.com/EspressoSystems/nitro-espresso-integration/blob/7ddcc6c036fa05cc47560552c85f30b5adedf32c/arbnode/batch_poster.go#L574',
      title: 'Nitro Espresso Integration',
    },
    {
      url: 'https://gramine.readthedocs.io/en/stable/sgx-intro.html#:~:text=The%20SGX%20quote%20is%20a%20signed%20report%20that%20contains%20the%20enclave%20measurement%20and%20the%20signer%20measurement%20of%20the%20enclave%20and%20the%20signer%20of%20the%20signer%20process%20that%20created%20the%20report.',
      title: 'SGX Quote',
    },
  ],
  risks: [
    // Liveness attack, but there is forced inclusion to bypass it
    {
      category: 'Withdrawals can be delayed if',
      text: 'the owner of EspressoTEEVerifier updates the contract verification values (enclave hash, signer) and it is no longer possible to verify the TEE quote.',
    },
  ],
}
