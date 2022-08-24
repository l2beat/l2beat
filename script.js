const { writeFile } = require("fs/promises");
const fetch = require("node-fetch");
const { tokenList } = require("@l2beat/config");

main();
async function main() {
  const res = await fetch(
    "https://bridgeapi.anyswap.exchange/v4/tokenlistv4/1"
  );
  const json = await res.json();

  const escrows = [];

  for (const [key, token] of Object.entries(json)) {
    for (const [id, chain] of Object.entries(token.destChains)) {
      for (const [hash, spec] of Object.entries(chain)) {
        if (spec.type === "swapin") {
          escrows.push({
            tokenName: token.name,
            tokenSymbol: token.symbol,
            tokenAddress: token.address,
            chainId: id,
            escrowAddress: spec.DepositAddress,
          });
        }
      }
    }
  }

  const groupedEscrowMap = new Map();
  for (const escrow of escrows) {
    const groupedEntry = groupedEscrowMap.get(escrow.escrowAddress) ?? {
      chainId: escrow.chainId,
      tokens: [],
    };
    groupedEscrowMap.set(escrow.escrowAddress, groupedEntry);
    if (escrow.chainId !== groupedEntry.chainId) {
      console.log({ escrow, groupedEntry });
      throw new Error("Duplicate chainId");
    }
    const token = tokenList.find(
      (x) => x.address?.toLowerCase() === escrow.tokenAddress.toLowerCase()
    );
    if (token) {
      groupedEntry.tokens.push(token.symbol);
    } else {
      groupedEntry.tokens.push({
        unknown: true,
        name: escrow.tokenName,
        address: escrow.tokenAddress,
      });
    }
  }

  const groupedEscrows = [...groupedEscrowMap.entries()].map(
    ([address, entry]) => ({
      address,
      chainId: entry.chainId,
      tokens: entry.tokens,
    })
  );

  writeFile("escrows.json", JSON.stringify(groupedEscrows, null, 2));
}
