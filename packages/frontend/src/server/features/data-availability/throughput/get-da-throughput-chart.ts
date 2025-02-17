import { UnixTime } from '@l2beat/shared-pure'
import { keyBy } from 'lodash'
import { z } from 'zod'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

interface DaThroughputDataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

export const DaThroughputChartParams = z.object({
  range: DaThroughputTimeRange,
})
export type DaThroughputChartParams = z.infer<typeof DaThroughputChartParams>

const data: Record<DaThroughputTimeRange, DaThroughputDataPoint[]> = {
  '30d': [],
  '90d': [],
  '180d': [],
  max: [],
}

export function getDaThroughputChart(
  params: DaThroughputChartParams,
): DaThroughputDataPoint[] {
  if (data[params.range].length === 0) {
    data[params.range] = getMockDaThroughputChartData(params)
  }
  return data[params.range]
}

function getMockDaThroughputChartData({
  range,
}: DaThroughputChartParams): DaThroughputDataPoint[] {
  const now = mockEthereumData.at(-1)!.date
  const days = range === 'max' ? 365 : parseInt(range)
  const from = UnixTime.max(now.add(-days, 'days'), mockEthereumData[0]!.date)

  const timestamps = generateTimestamps([from, now], 'daily')
  const groupedEthereumData = keyBy(mockEthereumData, (data) =>
    data.date.toNumber(),
  )
  return timestamps.map((timestamp) => {
    // Generate random but somewhat realistic values
    const ethereum = groupedEthereumData[timestamp.toNumber()]?.value ?? 0
    const celestia = ethereum * Math.max(21 * Math.random(), 1)
    const avail = ethereum * 1.5 * Math.random()

    return {
      timestamp: timestamp.toNumber(),
      ethereum: Math.round(ethereum),
      celestia: Math.round(celestia),
      avail: Math.round(avail),
    }
  })
}

const mockEthereumData = [
  {
    date: UnixTime.fromDate(new Date('2024-03-13T00:00:00Z')),
    value: 198836224,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-01T00:00:00Z')),
    value: 92930048,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-14T00:00:00Z')),
    value: 1458044928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-01T00:00:00Z')),
    value: 2479751168,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-15T00:00:00Z')),
    value: 953286656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-02T00:00:00Z')),
    value: 2802188288,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-16T00:00:00Z')),
    value: 879624192,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-12T00:00:00Z')),
    value: 1381629952,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-22T00:00:00Z')),
    value: 1236008960,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-17T00:00:00Z')),
    value: 833224704,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-03T00:00:00Z')),
    value: 2796683264,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-18T00:00:00Z')),
    value: 822607872,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-19T00:00:00Z')),
    value: 890372096,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-04T00:00:00Z')),
    value: 2247360512,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-20T00:00:00Z')),
    value: 980287488,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-23T00:00:00Z')),
    value: 1269694464,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-21T00:00:00Z')),
    value: 898629632,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-05T00:00:00Z')),
    value: 1904738304,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-22T00:00:00Z')),
    value: 870580224,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-27T00:00:00Z')),
    value: 1765933056,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-23T00:00:00Z')),
    value: 826015744,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-06T00:00:00Z')),
    value: 1348206592,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-24T00:00:00Z')),
    value: 805699584,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-24T00:00:00Z')),
    value: 1290534912,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-25T00:00:00Z')),
    value: 916193280,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-07T00:00:00Z')),
    value: 1312686080,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-26T00:00:00Z')),
    value: 1068630016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-27T00:00:00Z')),
    value: 1877082112,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-13T00:00:00Z')),
    value: 1440743424,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-28T00:00:00Z')),
    value: 2764570624,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-08T00:00:00Z')),
    value: 1325400064,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-29T00:00:00Z')),
    value: 2801664000,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-25T00:00:00Z')),
    value: 1374420992,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-09T00:00:00Z')),
    value: 1442709504,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-30T00:00:00Z')),
    value: 2791178240,
  },
  {
    date: UnixTime.fromDate(new Date('2024-03-31T00:00:00Z')),
    value: 2797338624,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-07T00:00:00Z')),
    value: 2287730688,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-14T00:00:00Z')),
    value: 1489502208,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-26T00:00:00Z')),
    value: 1382285312,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-10T00:00:00Z')),
    value: 1390411776,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-11T00:00:00Z')),
    value: 1897791488,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-28T00:00:00Z')),
    value: 2067005440,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-27T00:00:00Z')),
    value: 1236271104,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-12T00:00:00Z')),
    value: 1983250432,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-13T00:00:00Z')),
    value: 1246625792,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-15T00:00:00Z')),
    value: 1334575104,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-28T00:00:00Z')),
    value: 1221984256,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-14T00:00:00Z')),
    value: 1373896704,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-15T00:00:00Z')),
    value: 1366425600,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-16T00:00:00Z')),
    value: 1422131200,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-29T00:00:00Z')),
    value: 1396703232,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-17T00:00:00Z')),
    value: 1329463296,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-30T00:00:00Z')),
    value: 1455161344,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-18T00:00:00Z')),
    value: 1254359040,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-16T00:00:00Z')),
    value: 1434845184,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-19T00:00:00Z')),
    value: 1151860736,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-01T00:00:00Z')),
    value: 1378484224,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-20T00:00:00Z')),
    value: 1094844416,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-29T00:00:00Z')),
    value: 2300706816,
  },
  {
    date: UnixTime.fromDate(new Date('2024-04-21T00:00:00Z')),
    value: 1097990144,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-17T00:00:00Z')),
    value: 1489108992,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-02T00:00:00Z')),
    value: 1449787392,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-15T00:00:00Z')),
    value: 2347237376,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-03T00:00:00Z')),
    value: 1451098112,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-08T00:00:00Z')),
    value: 2140012544,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-18T00:00:00Z')),
    value: 1387659264,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-04T00:00:00Z')),
    value: 1301151744,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-30T00:00:00Z')),
    value: 2205679616,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-05T00:00:00Z')),
    value: 1272971264,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-19T00:00:00Z')),
    value: 1402863616,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-06T00:00:00Z')),
    value: 1438384128,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-07T00:00:00Z')),
    value: 1672609792,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-08T00:00:00Z')),
    value: 1576402944,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-20T00:00:00Z')),
    value: 1477443584,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-09T00:00:00Z')),
    value: 1747714048,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-31T00:00:00Z')),
    value: 2222981120,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-21T00:00:00Z')),
    value: 1641414656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-10T00:00:00Z')),
    value: 1596719104,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-11T00:00:00Z')),
    value: 1352925184,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-21T00:00:00Z')),
    value: 2814509056,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-09T00:00:00Z')),
    value: 2252079104,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-22T00:00:00Z')),
    value: 1629224960,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-01T00:00:00Z')),
    value: 2133852160,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-23T00:00:00Z')),
    value: 1656487936,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-24T00:00:00Z')),
    value: 1624637440,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-02T00:00:00Z')),
    value: 2087583744,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-25T00:00:00Z')),
    value: 1530396672,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-16T00:00:00Z')),
    value: 2208169984,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-10T00:00:00Z')),
    value: 2336620544,
  },
  {
    date: UnixTime.fromDate(new Date('2024-05-26T00:00:00Z')),
    value: 1503920128,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-03T00:00:00Z')),
    value: 2290483200,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-25T00:00:00Z')),
    value: 2562326528,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-04T00:00:00Z')),
    value: 2365194240,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-11T00:00:00Z')),
    value: 2443313152,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-05T00:00:00Z')),
    value: 2443968512,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-06T00:00:00Z')),
    value: 2473197568,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-17T00:00:00Z')),
    value: 2595749888,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-12T00:00:00Z')),
    value: 2448949248,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-22T00:00:00Z')),
    value: 2571239424,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-13T00:00:00Z')),
    value: 2481061888,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-18T00:00:00Z')),
    value: 2557345792,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-14T00:00:00Z')),
    value: 2437939200,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-28T00:00:00Z')),
    value: 2467430400,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-19T00:00:00Z')),
    value: 2505834496,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-26T00:00:00Z')),
    value: 2692087808,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-23T00:00:00Z')),
    value: 2589851648,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-20T00:00:00Z')),
    value: 2721316864,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-24T00:00:00Z')),
    value: 2657222656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-30T00:00:00Z')),
    value: 2283405312,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-27T00:00:00Z')),
    value: 2574909440,
  },
  {
    date: UnixTime.fromDate(new Date('2024-06-29T00:00:00Z')),
    value: 2280390656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-04T00:00:00Z')),
    value: 2563112960,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-03T00:00:00Z')),
    value: 2546597888,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-02T00:00:00Z')),
    value: 2669674496,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-05T00:00:00Z')),
    value: 2568093696,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-06T00:00:00Z')),
    value: 2499411968,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-07T00:00:00Z')),
    value: 2427060224,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-08T00:00:00Z')),
    value: 2673606656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-09T00:00:00Z')),
    value: 2760638464,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-10T00:00:00Z')),
    value: 2490892288,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-11T00:00:00Z')),
    value: 2190344192,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-12T00:00:00Z')),
    value: 547880960,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-13T00:00:00Z')),
    value: 2080636928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-14T00:00:00Z')),
    value: 2384723968,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-15T00:00:00Z')),
    value: 2325479424,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-16T00:00:00Z')),
    value: 2290876416,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-15T00:00:00Z')),
    value: 2538471424,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-06T00:00:00Z')),
    value: 2018377728,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-17T00:00:00Z')),
    value: 2292449280,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-13T00:00:00Z')),
    value: 2407661568,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-18T00:00:00Z')),
    value: 2461270016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-19T00:00:00Z')),
    value: 2337800192,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-14T00:00:00Z')),
    value: 2186412032,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-20T00:00:00Z')),
    value: 2315649024,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-06T00:00:00Z')),
    value: 1794113536,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-24T00:00:00Z')),
    value: 2017067008,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-21T00:00:00Z')),
    value: 2262171648,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-15T00:00:00Z')),
    value: 2178547712,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-22T00:00:00Z')),
    value: 2404253696,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-07T00:00:00Z')),
    value: 1949958144,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-23T00:00:00Z')),
    value: 2534801408,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-16T00:00:00Z')),
    value: 2169372672,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-24T00:00:00Z')),
    value: 2571501568,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-25T00:00:00Z')),
    value: 2529034240,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-17T00:00:00Z')),
    value: 2182086656,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-26T00:00:00Z')),
    value: 2379350016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-08T00:00:00Z')),
    value: 1912209408,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-27T00:00:00Z')),
    value: 2328887296,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-18T00:00:00Z')),
    value: 2209480704,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-28T00:00:00Z')),
    value: 2196897792,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-29T00:00:00Z')),
    value: 2356019200,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-19T00:00:00Z')),
    value: 2165571584,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-30T00:00:00Z')),
    value: 2230321152,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-09T00:00:00Z')),
    value: 2016804864,
  },
  {
    date: UnixTime.fromDate(new Date('2024-07-31T00:00:00Z')),
    value: 2259681280,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-20T00:00:00Z')),
    value: 2374238208,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-01T00:00:00Z')),
    value: 2357592064,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-25T00:00:00Z')),
    value: 1976172544,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-02T00:00:00Z')),
    value: 2450259968,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-21T00:00:00Z')),
    value: 2355232768,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-03T00:00:00Z')),
    value: 2192048128,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-10T00:00:00Z')),
    value: 2068316160,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-04T00:00:00Z')),
    value: 2146566144,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-22T00:00:00Z')),
    value: 2229141504,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-05T00:00:00Z')),
    value: 2290745344,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-07T00:00:00Z')),
    value: 1944715264,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-06T00:00:00Z')),
    value: 2507931648,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-23T00:00:00Z')),
    value: 2212757504,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-07T00:00:00Z')),
    value: 2355888128,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-11T00:00:00Z')),
    value: 2157707264,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-08T00:00:00Z')),
    value: 2353266688,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-24T00:00:00Z')),
    value: 2212364288,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-09T00:00:00Z')),
    value: 2266365952,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-10T00:00:00Z')),
    value: 2115502080,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-26T00:00:00Z')),
    value: 1994915840,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-11T00:00:00Z')),
    value: 2201092096,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-25T00:00:00Z')),
    value: 534642688,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-12T00:00:00Z')),
    value: 2416574464,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-12T00:00:00Z')),
    value: 2067005440,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-26T00:00:00Z')),
    value: 2119303168,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-30T00:00:00Z')),
    value: 2813329408,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-27T00:00:00Z')),
    value: 2158362624,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-22T00:00:00Z')),
    value: 2637037568,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-13T00:00:00Z')),
    value: 2015494144,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-28T00:00:00Z')),
    value: 2430599168,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-27T00:00:00Z')),
    value: 2088108032,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-29T00:00:00Z')),
    value: 2279342080,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-14T00:00:00Z')),
    value: 1903951872,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-30T00:00:00Z')),
    value: 2095579136,
  },
  {
    date: UnixTime.fromDate(new Date('2024-08-31T00:00:00Z')),
    value: 1867644928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-08T00:00:00Z')),
    value: 2037383168,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-15T00:00:00Z')),
    value: 1935933440,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-01T00:00:00Z')),
    value: 1929117696,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-02T00:00:00Z')),
    value: 2066874368,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-28T00:00:00Z')),
    value: 2019033088,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-16T00:00:00Z')),
    value: 1962672128,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-03T00:00:00Z')),
    value: 1992032256,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-04T00:00:00Z')),
    value: 1959133184,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-17T00:00:00Z')),
    value: 1894383616,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-05T00:00:00Z')),
    value: 2008154112,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-16T00:00:00Z')),
    value: 2499936256,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-29T00:00:00Z')),
    value: 1954807808,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-18T00:00:00Z')),
    value: 1972895744,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-09T00:00:00Z')),
    value: 1990590464,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-30T00:00:00Z')),
    value: 2047868928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-19T00:00:00Z')),
    value: 2085748736,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-20T00:00:00Z')),
    value: 2187722752,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-01T00:00:00Z')),
    value: 2014183424,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-21T00:00:00Z')),
    value: 2138177536,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-22T00:00:00Z')),
    value: 2012479488,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-10T00:00:00Z')),
    value: 2422734848,
  },
  {
    date: UnixTime.fromDate(new Date('2024-09-23T00:00:00Z')),
    value: 2097283072,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-02T00:00:00Z')),
    value: 2163998720,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-03T00:00:00Z')),
    value: 2190737408,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-17T00:00:00Z')),
    value: 2529034240,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-11T00:00:00Z')),
    value: 2214330368,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-04T00:00:00Z')),
    value: 2099380224,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-05T00:00:00Z')),
    value: 1914437632,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-27T00:00:00Z')),
    value: 2410545152,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-23T00:00:00Z')),
    value: 2572156928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-12T00:00:00Z')),
    value: 2107244544,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-18T00:00:00Z')),
    value: 2348417024,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-13T00:00:00Z')),
    value: 2190082048,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-14T00:00:00Z')),
    value: 2298085376,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-09T00:00:00Z')),
    value: 2821718016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-19T00:00:00Z')),
    value: 1922695168,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-24T00:00:00Z')),
    value: 2552102912,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-20T00:00:00Z')),
    value: 2057961472,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-05T00:00:00Z')),
    value: 2863529984,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-28T00:00:00Z')),
    value: 2592210944,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-21T00:00:00Z')),
    value: 2186674176,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-25T00:00:00Z')),
    value: 2624847872,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-31T00:00:00Z')),
    value: 2821718016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-26T00:00:00Z')),
    value: 2561015808,
  },
  {
    date: UnixTime.fromDate(new Date('2024-10-29T00:00:00Z')),
    value: 2817916928,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-02T00:00:00Z')),
    value: 2749890560,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-04T00:00:00Z')),
    value: 2778726400,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-01T00:00:00Z')),
    value: 2819227648,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-03T00:00:00Z')),
    value: 2853306368,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-06T00:00:00Z')),
    value: 2791833600,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-08T00:00:00Z')),
    value: 2756313088,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-07T00:00:00Z')),
    value: 2777415680,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-10T00:00:00Z')),
    value: 2861957120,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-11T00:00:00Z')),
    value: 2824470528,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-12T00:00:00Z')),
    value: 2778726400,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-14T00:00:00Z')),
    value: 2801270784,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-13T00:00:00Z')),
    value: 2760507392,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-15T00:00:00Z')),
    value: 2866020352,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-16T00:00:00Z')),
    value: 2831417344,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-17T00:00:00Z')),
    value: 2813984768,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-18T00:00:00Z')),
    value: 2800222208,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-19T00:00:00Z')),
    value: 2807562240,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-30T00:00:00Z')),
    value: 2802450432,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-20T00:00:00Z')),
    value: 2792488960,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-22T00:00:00Z')),
    value: 2785280000,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-21T00:00:00Z')),
    value: 2847539200,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-14T00:00:00Z')),
    value: 2848849920,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-22T00:00:00Z')),
    value: 2824601600,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-23T00:00:00Z')),
    value: 2855534592,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-23T00:00:00Z')),
    value: 2804809728,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-24T00:00:00Z')),
    value: 2855403520,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-24T00:00:00Z')),
    value: 2790522880,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-25T00:00:00Z')),
    value: 2810052608,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-15T00:00:00Z')),
    value: 2812542976,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-26T00:00:00Z')),
    value: 2818572288,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-25T00:00:00Z')),
    value: 2816606208,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-27T00:00:00Z')),
    value: 2788950016,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-28T00:00:00Z')),
    value: 2807037952,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-31T00:00:00Z')),
    value: 2809528320,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-29T00:00:00Z')),
    value: 2643460096,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-26T00:00:00Z')),
    value: 2826043392,
  },
  {
    date: UnixTime.fromDate(new Date('2024-11-30T00:00:00Z')),
    value: 2864971776,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-16T00:00:00Z')),
    value: 2819489792,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-27T00:00:00Z')),
    value: 2812542976,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-01T00:00:00Z')),
    value: 2789605376,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-02T00:00:00Z')),
    value: 2844524544,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-28T00:00:00Z')),
    value: 2816606208,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-03T00:00:00Z')),
    value: 2761162752,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-04T00:00:00Z')),
    value: 2885419008,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-17T00:00:00Z')),
    value: 2819358720,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-05T00:00:00Z')),
    value: 2809266176,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-29T00:00:00Z')),
    value: 2830368768,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-06T00:00:00Z')),
    value: 2810970112,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-07T00:00:00Z')),
    value: 2798649344,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-30T00:00:00Z')),
    value: 2813853696,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-08T00:00:00Z')),
    value: 2803105792,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-18T00:00:00Z')),
    value: 2797862912,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-09T00:00:00Z')),
    value: 2832465920,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-31T00:00:00Z')),
    value: 2740322304,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-10T00:00:00Z')),
    value: 2834825216,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-01T00:00:00Z')),
    value: 2818179072,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-11T00:00:00Z')),
    value: 2738618368,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-01T00:00:00Z')),
    value: 2786590720,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-12T00:00:00Z')),
    value: 2873360384,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-19T00:00:00Z')),
    value: 2796814336,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-13T00:00:00Z')),
    value: 2822504448,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-02T00:00:00Z')),
    value: 2758017024,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-14T00:00:00Z')),
    value: 2799828992,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-15T00:00:00Z')),
    value: 2835742720,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-03T00:00:00Z')),
    value: 2808348672,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-16T00:00:00Z')),
    value: 2816344064,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-02T00:00:00Z')),
    value: 2822635520,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-20T00:00:00Z')),
    value: 2849112064,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-17T00:00:00Z')),
    value: 2762997760,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-04T00:00:00Z')),
    value: 2837184512,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-18T00:00:00Z')),
    value: 2844393472,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-19T00:00:00Z')),
    value: 2813460480,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-05T00:00:00Z')),
    value: 2644639744,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-20T00:00:00Z')),
    value: 2805858304,
  },
  {
    date: UnixTime.fromDate(new Date('2024-12-21T00:00:00Z')),
    value: 2805465088,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-21T00:00:00Z')),
    value: 2818572288,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-06T00:00:00Z')),
    value: 2886991872,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-07T00:00:00Z')),
    value: 2809659392,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-22T00:00:00Z')),
    value: 2822373376,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-08T00:00:00Z')),
    value: 2826305536,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-03T00:00:00Z')),
    value: 2827747328,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-09T00:00:00Z')),
    value: 2794455040,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-23T00:00:00Z')),
    value: 2794455040,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-10T00:00:00Z')),
    value: 2815950848,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-11T00:00:00Z')),
    value: 2822635520,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-12T00:00:00Z')),
    value: 2809921536,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-24T00:00:00Z')),
    value: 2844393472,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-13T00:00:00Z')),
    value: 2801926144,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-25T00:00:00Z')),
    value: 2790522880,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-26T00:00:00Z')),
    value: 2789736448,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-27T00:00:00Z')),
    value: 2875981824,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-28T00:00:00Z')),
    value: 2805202944,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-05T00:00:00Z')),
    value: 429654016,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-06T00:00:00Z')),
    value: 429654016,
  },
  {
    date: UnixTime.fromDate(new Date('2025-01-29T00:00:00Z')),
    value: 2801532928,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-04T00:00:00Z')),
    value: 582221824,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-08T00:00:00Z')),
    value: 985530368,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-12T00:00:00Z')),
    value: 1145438208,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-11T00:00:00Z')),
    value: 558235648,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-07T00:00:00Z')),
    value: 1003487232,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-10T00:00:00Z')),
    value: 1134559232,
  },
  {
    date: UnixTime.fromDate(new Date('2025-02-09T00:00:00Z')),
    value: 1035075584,
  },
].sort((a, b) => a.date.toNumber() - b.date.toNumber())
