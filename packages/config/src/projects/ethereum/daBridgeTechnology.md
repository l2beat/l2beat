## Enshrined Bridge
    The DA bridge on Ethereum is enshrined, meaning that blob data is directly accessible on the consensus layer, with data availability guaranteed by the network's inherent consensus rules. 
    If a block contains unavailable data, full nodes will reject it, causing the chain to fork away from that block. This ensures data availability without requiring additional trust assumptions. 
    In contrast, external DA providers must rely on data availability attestations from the external validator set, introducing an extra layer of trust on the majority of validators.
