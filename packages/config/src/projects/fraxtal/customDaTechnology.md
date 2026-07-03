## Architecture
FraxtalDA is a custom data availability solution built by the Fraxtal team. 
The data is posted by the OP batcher to three separate locations: AWS, IPFS, and Cloudflare R2. 
The IPFS hash is then submitted to the onchain inbox contract on Ethereum.
FraxtalDA relies on a single DA endpoint to manage data posting between the three different locations. 

![FraxtalDA](/images/da-layer-technology/fraxtalDA/FraxtalDA.png#center)

The sequencer attests to data availability by posting an IPFS hash to an onchain inbox contract on Ethereum. L2 nodes derive the L2 chain from the L1 by reading transactions commitments from this sequencer inbox.
When reading from the inbox, the op-node verifies that the commitment hash is a valid IPFS CID. If the data corresponding to the hash is missing from IPFS, the op-node will halt, preventing further derivation of the L2 chain. 

## DA Bridge
The SequencerInbox only stores IPFS hash commitments posted by the sequencer. It is not possible to verify blob inclusion against the data commitments onchain.
Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.There is no committee attesting to the availability of the data. For L2 chain derivation, the system relies on sequencer commitments to an L1 onchain inbox. See DA layer technology section for more details.
