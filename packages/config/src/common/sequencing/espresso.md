Integration with Espresso sequencing. 
In addition to providing regular pre-confirmations, the sequencer publishes blocks to the Espresso Network.
The integration expects the transaction batch poster to run inside a Trusted Execution Environment (TEE), and it is programmed to verify batch inclusion in a Espresso Network block before publishing it to the host chain.
However, the confirmations provided by Espresso Network are additive, and the batch poster can skip Espresso inclusion checks should the Espresso Network be down or unavailable.
To ensure the batch poster is running inside a TEE, the SequencerInbox contract on the host chain was updated so that the data posting function also includes a TEE attestation as input (a "quote" / signature) that is verified onchain by the EspressoTEEVerifier for each batch transaction. 
The verifier checks whether the signature originates from inside the TEE and reverts if unsuccessful.
