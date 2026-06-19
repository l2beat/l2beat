Nightshade is a sharding-based, Proof-of-Stake (PoS) consensus protocol enabling parallel transaction processing.
Near Nightshade has one single main chain producing blocks. Main chain blocks do not contain actual transactions, but they include one chunk header for each shard, where
a chunk is the equivalent of a block in a standard, non-shared blockchain. At the beginning of the epoch, both the block and chunk production schedule
are randomly generated. For each block on the main chain, and for every shard, one of the assigned chunk producers is responsible to produce the part of the main chain block
related to the shard, and share the chunk header with the network. Finality is determined by the NFG (Nightshade finality gadget), and after 2 consecutive blocks are built on the same fork the t-2 block is considered final.
Reverting a finalized block will require at least 1/3 of the total stake to be slashed.
