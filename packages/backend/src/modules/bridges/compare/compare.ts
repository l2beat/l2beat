async function extractDetailedPairs() {
  // Use fetch instead of cheerio
  const response = await fetch(
    'https://explorer.range.org/transactions?max=100000000&b=across&sn=eth,base,arb1,oeth&dn=eth,arb1,base,oeth&tt=CROSSCHAIN&l=100',
  )

  const htmlContent = await response.text()

  // More detailed regex that captures sender_network as well
  const detailedPairRegex =
    /\\"sender_network\\":\\"([^\\"]*)\\".+?\\"sender_tx_hash\\":\\"([^\\"]*)\\".+?\\"receiver_network\\":\\"([^\\"]*)\\".+?\\"receiver_tx_hash\\":\\"([^\\"]*)\\"/g

  const matches = Array.from(htmlContent.matchAll(detailedPairRegex))

  console.log(`Found ${matches.length} detailed sender-receiver pairs:`)

  const pairs = matches.map((match, index) => {
    return {
      index: index + 1,
      senderNetwork: match[1],
      senderHash: match[2] || '(empty)',
      receiverNetwork: match[3],
      receiverHash: match[4] || '(empty)',
      hasSenderHash: match[2]?.length > 0,
      hasReceiverHash: match[4]?.length > 0,
    }
  })

  pairs.forEach((pair) => {
    console.log(`\nPair ${pair.index}:`)
    console.log(`  ${pair.senderNetwork} -> ${pair.receiverNetwork}`)
    console.log(`  Sender Hash: ${pair.senderHash}`)
    console.log(`  Receiver Hash: ${pair.receiverHash}`)
  })

  return pairs
}

extractDetailedPairs().catch(console.error)
