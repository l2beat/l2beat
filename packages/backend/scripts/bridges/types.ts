import { z } from 'zod'

export type RangeStats = z.infer<typeof RangeStatsResponse>
export const RangeStatsResponse = z.object({
  totalTransactions: z.number(),
  totalUsd: z.number(),
  denomSums: z.array(
    z.object({
      denom: z.string(),
      total: z.number(),
      totalUsd: z.number(),
    }),
  ),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  protocol: z.string(),
  // networkStats: z.object({
  //     "latestSends": [
  //         {
  //             "network": "base",
  //             "timestamp": "2025-06-11T23:49:15.000Z",
  //             "senderNetwork": "base",
  //             "receiverNetwork": "pol",
  //             "amount": 106.535008,
  //             "denom": "axlUSDC",
  //             "usd": 106.402052310016
  //         },
  //         {
  //             "network": "bnb",
  //             "timestamp": "2025-06-11T23:52:06.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "eth",
  //             "amount": 4999.334958,
  //             "denom": "axlUSDC",
  //             "usd": 4993.0957879724165
  //         },
  //         {
  //             "network": "arb1",
  //             "timestamp": "2025-06-11T23:41:58.000Z",
  //             "senderNetwork": "arb1",
  //             "receiverNetwork": "pol",
  //             "amount": 179.118377,
  //             "denom": "axlUSDC",
  //             "usd": 178.894837265504
  //         },
  //         {
  //             "network": "eth",
  //             "timestamp": "2025-06-11T23:55:47.000Z",
  //             "senderNetwork": "eth",
  //             "receiverNetwork": "bnb",
  //             "amount": 4999.334958,
  //             "denom": "USDC",
  //             "usd": 4998.335091008401
  //         },
  //         {
  //             "network": "imx",
  //             "timestamp": "2025-06-11T23:51:09.000Z",
  //             "senderNetwork": "imx",
  //             "receiverNetwork": "pol",
  //             "amount": 7.2404,
  //             "denom": "axlUSDC",
  //             "usd": 7.2313639808
  //         },
  //         {
  //             "network": "pol",
  //             "timestamp": "2025-06-11T23:42:41.000Z",
  //             "senderNetwork": "pol",
  //             "receiverNetwork": "base",
  //             "amount": 179.371345,
  //             "denom": "axlUSDC",
  //             "usd": 179.14748956143998
  //         },
  //         {
  //             "network": "osmosis-1",
  //             "timestamp": "2025-06-11T23:58:38.000Z",
  //             "senderNetwork": "osmosis-1",
  //             "receiverNetwork": "pol",
  //             "amount": 4.102426,
  //             "denom": "axlUSDC",
  //             "usd": 4.097306172352
  //         },
  //         {
  //             "network": "optimism",
  //             "timestamp": "2025-06-11T23:22:15.000Z",
  //             "senderNetwork": "optimism",
  //             "receiverNetwork": "moonbeam",
  //             "amount": 22365.118915,
  //             "denom": "axlUSDC",
  //             "usd": 22337.20724659408
  //         },
  //         {
  //             "network": "ftm",
  //             "timestamp": "2025-06-11T23:14:47.000Z",
  //             "senderNetwork": "ftm",
  //             "receiverNetwork": "avax",
  //             "amount": 4076.113535,
  //             "denom": "USDC",
  //             "usd": 4075.298312293
  //         },
  //         {
  //             "network": "avax",
  //             "timestamp": "2025-06-11T23:44:52.000Z",
  //             "senderNetwork": "avax",
  //             "receiverNetwork": "optimism",
  //             "amount": 606.806043,
  //             "denom": "axlUSDC",
  //             "usd": 606.048749058336
  //         },
  //         {
  //             "network": "linea",
  //             "timestamp": "2025-06-11T21:29:14.000Z",
  //             "senderNetwork": "linea",
  //             "receiverNetwork": "arb1",
  //             "amount": 1036.116365,
  //             "denom": "axlUSDC",
  //             "usd": 1034.8232917764801
  //         },
  //         {
  //             "network": "axelar-dojo-1",
  //             "timestamp": "2025-06-11T20:27:47.000Z",
  //             "senderNetwork": "axelar-dojo-1",
  //             "receiverNetwork": "bnb",
  //             "amount": 999879,
  //             "denom": "AXL",
  //             "usd": 474473.581749
  //         },
  //         {
  //             "network": "mantle",
  //             "timestamp": "2025-06-11T23:57:02.000Z",
  //             "senderNetwork": "mantle",
  //             "receiverNetwork": "eth",
  //             "amount": 1200,
  //             "denom": "CAI",
  //             "usd": 0
  //         },
  //         {
  //             "network": "celo",
  //             "timestamp": "2025-06-11T22:31:59.000Z",
  //             "senderNetwork": "celo",
  //             "receiverNetwork": "optimism",
  //             "amount": 4.958224,
  //             "denom": "axlUSDC",
  //             "usd": 4.952036136448
  //         },
  //         {
  //             "network": "blast",
  //             "timestamp": "2025-06-11T22:45:11.000Z",
  //             "senderNetwork": "blast",
  //             "receiverNetwork": "base",
  //             "amount": 771.138591,
  //             "denom": "axlUSDC",
  //             "usd": 770.176210038432
  //         },
  //         {
  //             "network": "centrifuge",
  //             "timestamp": "2025-06-11T23:44:36.000Z",
  //             "senderNetwork": "centrifuge",
  //             "receiverNetwork": "eth",
  //             "amount": 1217.2311700105881,
  //             "denom": "wCFG",
  //             "usd": 0
  //         },
  //         {
  //             "network": "fraxtal",
  //             "timestamp": "2025-06-11T23:34:59.000Z",
  //             "senderNetwork": "fraxtal",
  //             "receiverNetwork": "arb1",
  //             "amount": 3.290468,
  //             "denom": "axlUSDC",
  //             "usd": 3.286361495936
  //         },
  //         {
  //             "network": "ssc-1",
  //             "timestamp": "2025-06-11T20:45:08.000Z",
  //             "senderNetwork": "ssc-1",
  //             "receiverNetwork": "arb1",
  //             "amount": 1921.852398,
  //             "denom": "axlUSDC",
  //             "usd": 1919.453926207296
  //         },
  //         {
  //             "network": "moonbeam",
  //             "timestamp": "2025-06-11T23:13:36.000Z",
  //             "senderNetwork": "moonbeam",
  //             "receiverNetwork": "eth",
  //             "amount": 0.713132,
  //             "denom": "axlUSDC",
  //             "usd": 0.712242011264
  //         },
  //         {
  //             "network": "neutron-1",
  //             "timestamp": "2025-06-11T23:20:26.000Z",
  //             "senderNetwork": "neutron-1",
  //             "receiverNetwork": "bnb",
  //             "amount": 24.350482,
  //             "denom": "axlUSDC",
  //             "usd": 24.320092598463997
  //         }
  //     ],
  //     "latestReceives": [
  //         {
  //             "network": "bnb",
  //             "timestamp": "2025-06-11T23:55:47.000Z",
  //             "senderNetwork": "eth",
  //             "receiverNetwork": "bnb",
  //             "amount": 4999.334958,
  //             "denom": "USDC",
  //             "usd": 4998.335091008401
  //         },
  //         {
  //             "network": "pol",
  //             "timestamp": "2025-06-11T23:58:38.000Z",
  //             "senderNetwork": "osmosis-1",
  //             "receiverNetwork": "pol",
  //             "amount": 4.102426,
  //             "denom": "axlUSDC",
  //             "usd": 4.097306172352
  //         },
  //         {
  //             "network": "arb1",
  //             "timestamp": "2025-06-11T23:37:37.000Z",
  //             "senderNetwork": "pol",
  //             "receiverNetwork": "arb1",
  //             "amount": 179.19191,
  //             "denom": "axlUSDC",
  //             "usd": 178.96827849632
  //         },
  //         {
  //             "network": "base",
  //             "timestamp": "2025-06-11T23:51:21.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "base",
  //             "amount": 35228448.83475685,
  //             "denom": "cantbelief",
  //             "usd": 0
  //         },
  //         {
  //             "network": "eth",
  //             "timestamp": "2025-06-11T23:57:02.000Z",
  //             "senderNetwork": "mantle",
  //             "receiverNetwork": "eth",
  //             "amount": 1200,
  //             "denom": "CAI",
  //             "usd": 0
  //         },
  //         {
  //             "network": "optimism",
  //             "timestamp": "2025-06-11T23:44:52.000Z",
  //             "senderNetwork": "avax",
  //             "receiverNetwork": "optimism",
  //             "amount": 606.806043,
  //             "denom": "axlUSDC",
  //             "usd": 606.048749058336
  //         },
  //         {
  //             "network": "imx",
  //             "timestamp": "2025-06-11T23:26:00.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "imx",
  //             "amount": 1500.066858,
  //             "denom": "axlUSDC",
  //             "usd": 1498.1947745612158
  //         },
  //         {
  //             "network": "axelar-dojo-1",
  //             "timestamp": "2025-06-11T22:27:08.000Z",
  //             "senderNetwork": "pol",
  //             "receiverNetwork": "axelar-dojo-1",
  //             "amount": 0,
  //             "denom": "",
  //             "usd": 0
  //         },
  //         {
  //             "network": "mantle",
  //             "timestamp": "2025-06-11T23:45:41.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "mantle",
  //             "amount": 3000.081462,
  //             "denom": "axlUSDC",
  //             "usd": 2996.337360335424
  //         },
  //         {
  //             "network": "ftm",
  //             "timestamp": "2025-06-11T23:26:28.000Z",
  //             "senderNetwork": "arb1",
  //             "receiverNetwork": "ftm",
  //             "amount": 0.277022,
  //             "denom": "axlUSDC",
  //             "usd": 0.276676276544
  //         },
  //         {
  //             "network": "avax",
  //             "timestamp": "2025-06-11T23:35:11.000Z",
  //             "senderNetwork": "pol",
  //             "receiverNetwork": "avax",
  //             "amount": 896.865142,
  //             "denom": "axlUSDC",
  //             "usd": 895.745854302784
  //         },
  //         {
  //             "network": "osmosis-1",
  //             "timestamp": "2025-06-11T23:37:03.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "osmosis-1",
  //             "amount": 2.953773,
  //             "denom": "axlUSDC",
  //             "usd": 2.9500866912959998
  //         },
  //         {
  //             "network": "linea",
  //             "timestamp": "2025-06-11T23:30:11.000Z",
  //             "senderNetwork": "bnb",
  //             "receiverNetwork": "linea",
  //             "amount": 699.808278,
  //             "denom": "axlUSDC",
  //             "usd": 698.934917269056
  //         },
  //         {
  //             "network": "blast",
  //             "timestamp": "2025-06-11T23:15:53.000Z",
  //             "senderNetwork": "avax",
  //             "receiverNetwork": "blast",
  //             "amount": 66.998886,
  //             "denom": "axlUSDC",
  //             "usd": 66.915271390272
  //         },
  //         {
  //             "network": "fraxtal",
  //             "timestamp": "2025-06-11T22:12:00.000Z",
  //             "senderNetwork": "arb1",
  //             "receiverNetwork": "fraxtal",
  //             "amount": 935.20901,
  //             "denom": "axlUSDC",
  //             "usd": 934.04186915552
  //         },
  //         {
  //             "network": "celo",
  //             "timestamp": "2025-06-11T23:37:43.000Z",
  //             "senderNetwork": "base",
  //             "receiverNetwork": "celo",
  //             "amount": 1298.921147,
  //             "denom": "axlUSDC",
  //             "usd": 1297.300093408544
  //         },
  //         {
  //             "network": "filecoin",
  //             "timestamp": "2025-06-11T16:28:47.000Z",
  //             "senderNetwork": "eth",
  //             "receiverNetwork": "filecoin",
  //             "amount": 3000,
  //             "denom": "USDC",
  //             "usd": 2999.4
  //         },
  //         {
  //             "network": "ssc-1",
  //             "timestamp": "2025-06-11T22:44:33.000Z",
  //             "senderNetwork": "base",
  //             "receiverNetwork": "ssc-1",
  //             "amount": 8514.092943,
  //             "denom": "axlUSDC",
  //             "usd": 8503.467355007135
  //         },
  //         {
  //             "network": "moonbeam",
  //             "timestamp": "2025-06-11T23:22:15.000Z",
  //             "senderNetwork": "optimism",
  //             "receiverNetwork": "moonbeam",
  //             "amount": 22365.118915,
  //             "denom": "axlUSDC",
  //             "usd": 22337.20724659408
  //         },
  //         {
  //             "network": "scr",
  //             "timestamp": "2025-06-11T13:14:15.000Z",
  //             "senderNetwork": "linea",
  //             "receiverNetwork": "scr",
  //             "amount": 1088.45484,
  //             "denom": "axlUSDC",
  //             "usd": 1087.0964483596802
  //         }
  //     ]
  // })
})

export type RangeError = z.infer<typeof RangeErrorResponse>
export const RangeErrorResponse = z.object({
  message: z.array(z.string()),
  error: z.string(),
  statusCode: z.number(),
})
