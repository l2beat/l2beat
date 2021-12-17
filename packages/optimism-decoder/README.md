# Optimism decoder

## Encoding scheme

```
METHOD ID:
4 bytes     Method id: appendSequencerBatch()

HEADER:
5 bytes     (???) shouldStartAtElement
3 bytes     (???) totalElementsToAppend
3 bytes     number of contexts

CONTEXT HEADER: (repeated for every context)
3 bytes     sequencer transaction count
3 bytes     queue transaction count
5 bytes     timestamp
5 bytes     block number

TRANSACTION: (repeated for every sequencer transaction in all contexts)
3 bytes     transaction size in bytes
variable    raw ethereum transaction
```
