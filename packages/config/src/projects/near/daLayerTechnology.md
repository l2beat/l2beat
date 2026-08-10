## Architecture

![Near architecture](/images/da-layer-technology/near/architecture.png#center)

## Near Nightshade

### Consensus
NEAR's Nightshade consensus operates a Proof-of-Stake (PoS) system that enables parallel processing of transactions through a sharded architecture. As with any PoS system, validators are required to lock a stake to be eligible for block production and attestations.
The main differentiator of the NEAR blockchain is that its blocks do not contain actual transactions but rather block headers of separate blockchains, known as shards.
The ***main chain*** can contain many shards, and the current NEAR implementation supports 9 shards.


![Near Shards](/images/da-layer-technology/near/nearShards.png#center)



Each shard is composed of chunks, which are equivalent to standard blockchain blocks.
Essentially, the state of the main chain is split into n shards, and only the shards block headers end up being part of the main chain.


![Near Chunks](/images/da-layer-technology/near/nearChunks.png#center)



Becoming a block producer requires locking (staking) a certain amount of tokens, currently around 11,000 NEAR. Staking operates through a threshold PoS mechanism, where a user’s stake must exceed the protocol's seat price—determined by the total NEAR tokens staked by other validators—in order to become a validator. The largest stakers at the beginning of a particular epoch are selected as block producers for that epoch. Each block producer is randomly assigned a certain number of shards to manage.  
Before the epoch starts, the block producer downloads the state of the shard(s) they are assigned to (they have 1 epoch to complete this download). Throughout the epoch, they collect transactions that affect their assigned shard(s) and apply them to the state. NEAR nodes have an automatic 'garbage collection' routine that deletes the state of previous shards after five epochs, freeing up unused storage.
Within an epoch (12 hours), the main chain block and shard block production schedule is determined by a randomness seed generated at the beginning of the epoch. For each block height, a main chain block producer is assigned.  
Validators participate in several validation rounds within the epoch. For each round, one validator in each shard is chosen to be the chunk producer, and one validator from the entire set is chosen to be the block producer. Validators can serve as both block and chunk producers, but they maintain separate stakes for these roles.
The shard block producer is responsible for producing the part of the block related to their shard, known as a chunk. The chunk contains the list of transactions for the shard to be included in the block, as well as the Merkle root of the resulting state. Each main chain block contains either one or zero chunks per shard, depending on whether the shard can keep up with the main chain block production speed.


![Near Validators](/images/da-layer-technology/near/nearValidators.png#center)



A block on the main chain will only contain a small header of the chunk, composed of the Merkle root of all applied transactions and the Merkle root of the final state. When a block producer generates a chunk, they also produce an associated state witness, which is necessary for executing the chunk.

Chunk producers maintain the full state of their shard. Validators, on the other hand, do not maintain the state of any shard locally; instead, they download and verify all the block headers. They validate chunks using the state witness created by the chunk producers.

### Data Availability
Since only shard chunk producers maintain the shard state (while main chain validators do not), and main chain block producers need to attest to the chunk headers, data availability of the shard data must be ensured.

After a block producer creates a chunk, they generate an erasure-coded version of it using Reed-Solomon encoding. The extended chunk is then split into multiple parts, which are distributed to all main chain validators.

![Near Erasure Coding](/images/da-layer-technology/near/nearErasureCoding.png)


A block producer will not process a main chain block if they do not have the corresponding chunk sample for at least one chunk included in the block, or if they are unable to reconstruct the entire chunk for any shard for which they maintain the state.

For a particular chunk to be considered available, it is sufficient that [mainChainBlockProducer/nOfShards] + 1 of the block producers possess their respective parts and are able to serve them. As long as the number of malicious actors does not exceed one-third of the validators (block producers), any chain built by more than half of the block producers will have all its chunks available.

![Near Erasure Distribution](/images/da-layer-technology/near/nearErasureDistribution.png)



### Finality
Finality is determined by a modified Doomslug finality gadget. A block is considered final after two consecutive blocks are built on the same fork, making the block that is two blocks behind (t-2) final. Reverting a finalized block would require slashing at least one-third of the total stake.

## L2s Data Availability
A rollup can utilize a dedicated Data Availability (DA) smart contract on a NEAR shard, known as a Blob Store contract, where it posts data as standard NEAR transactions. All transactions are converted into Receipts, and depending on their actions, some receipts may be processed over two blocks.
Regarding data retrieval, full nodes prune Receipts after 3 epochs (approximately 36 hours). Once the pruning window expires, the data remains accessible only through archive nodes.
