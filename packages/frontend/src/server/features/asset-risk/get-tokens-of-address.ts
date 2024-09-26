import { Address, createPublicClient, getAddress, Hex, http, parseAbiItem, PublicClient, zeroAddress } from "viem";
import generatedJson from '@l2beat/config/src/tokens/generated.json'
import { AssetId, ChainId, EthereumAddress } from "@l2beat/shared-pure";
import { chainConverter } from "@l2beat/config";
import { getChain } from "./utils/chains";

type Token = Omit<(typeof generatedJson.tokens)[number], 'address'> & {
    address?: Hex
} & { id: AssetId }

export async function getTokensOfAddress(address: string) {
    const groupedTokens = Object.entries(
        generatedJson.tokens.reduce<Record<number, Token[]>>((acc, token) => {
            const { chainId, address } = token

            if (!acc[chainId]) {
                acc[chainId] = []
            }
            acc[chainId]?.push({
                ...token,
                id: AssetId.create(
                    chainConverter.toName(ChainId(token.chainId)),
                    address ? EthereumAddress(address) : 'native',
                ),
                address: address ? getAddress(address) : undefined
            })

            return acc
        }, {}),
    ).map(([chainId, arr]) => [Number(chainId), arr] as const)

    const chains = Array.from(new Set(groupedTokens.map(([chainId]) => chainId)))

    const tokens = (
        await Promise.all(
            chains.map<Promise<[number, Address[]]>>(async (chainId) => {
                const chain = getChain(chainId)
                if (!chain) return []

                const client = createPublicClient({
                    chain,
                    transport: http(),
                })

                const blockNumber = await client.getBlockNumber()
                const logs = await getAllLogs(client as any, zeroAddress, 0n, blockNumber)
                const tokens = new Set<Address>()
                for (const log of logs) {
                    tokens.add(log.address)
                }

                return [chainId, Array.from(tokens)] as [number, Address[]]
            })))

    return tokens;
}

async function getAllLogsInner(client: PublicClient, address: Address, fromBlock: bigint, toBlock: bigint, mode?: "from" | "to") {
    console.log("Getting logs from", fromBlock, "to", toBlock, "mode", mode)
    return await client.getLogs({
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
        args: {
            from: mode === "from" ? address : null,
            to: mode === "to" ? address : null,
        },
        fromBlock,
        toBlock
    })
}

async function getAllLogs(client: PublicClient, address: Address, fromBlock: bigint, toBlock: bigint, mode?: "from" | "to"): ReturnType<typeof getAllLogsInner> {
    if (!mode) {
        return Promise.all([
            await getAllLogs(client, address, fromBlock, toBlock, "from"),
            await getAllLogs(client, address, fromBlock, toBlock, "to")
        ]).then((logs) => logs.flat());
    }

    try {
        return await getAllLogsInner(client, address, fromBlock, toBlock, mode)
    } catch (e) {
        const half = (fromBlock + toBlock) / 2n
        return [
            ...(await getAllLogs(client, address, fromBlock, half, mode)),
            ...(await getAllLogs(client, address, half + 1n, toBlock, mode))
        ]
    }
}