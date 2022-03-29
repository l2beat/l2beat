# Optimism decoder

Decodes Ethereum L1 `appendSequencerBatch()` transaction and outputs all L2 transactions that have been submitted in the batch.

Set your `ALCHEMY_API_KEY` for RPC endpoint before running the program.

`Usage: yarn start [txhash]`

## Example usage

Optimism OVM 2.0

```

yarn start 0xd74125855bda2ee25d89e67e1fd537e4573f898b84f76dea7fee3c777cf1d854
yarn start 0x82d4965f687faf9424bf55086f01fa61643ba2468cffa6a4bf860d2ba8a623e8
yarn start 0xcc393344a29da4291f79a0cfb35ece2cc8501e859b524ba13515e985ce7a367a
```

Optimism OVM 1.0

```
yarn start 0xee381396fdc483890ab31bf6c2d4d6d6d8da76b08e7112f64e1f7bc12991db37
```

Metis

```
yarn start 0xa979f1fa90b4ecf41a0eaf8109b4ce121025c350e1326988445e9724ed34f570
```

Boba

```
yarn start 0x55e01e7c1ca89701540f441b0e26286a773a54ef391eae77ebdc7d73387a3c2b
```

## Encoding scheme

```
METHOD ID:
4 bytes     Method id: appendSequencerBatch()

HEADER:
32 bytes    (ONLY PRESENT IN METIS) chain id
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
