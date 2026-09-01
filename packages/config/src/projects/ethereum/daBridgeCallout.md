Unlike non-enshrined DA bridges, it does not place any honesty
assumption on an external committee that provides data availability
attestations to the DA bridge. From the rollup perspective,
Ethereum's canonical chain cannot contain unavailable data
commitments as full nodes self-verify the data availability of each
block, discarding blocks with unavailable data. The rollup state
validating bridge has access to all the data, as it is posted on chain.
