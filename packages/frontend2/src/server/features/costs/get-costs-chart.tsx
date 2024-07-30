import { type CostsUnit } from '../scaling/get-scaling-costs-entries'
interface Response {
  types: ['timestamp', 'total', 'overhead', 'calldata', 'compute', 'blobs']
  data: [number, number, number, number, number, number | undefined][]
}

export function getCostsChart(range: string, unit: CostsUnit): Response {
  return {
    types: ['timestamp', 'total', 'overhead', 'calldata', 'compute', 'blobs'],
    data: [
      [1686789327, 100, 200, 300, 400, undefined],
      [1686797983, 100, 200, 300, 400, undefined],
      [1686803347, 100, 200, 300, 400, undefined],
      [1686808343, 100, 200, 300, 400, undefined],
      [1686812627, 100, 200, 300, 400, undefined],
      [1686818598, 100, 200, 300, 400, undefined],
      [1686823292, 100, 200, 300, 400, undefined],
      [1686827695, 100, 200, 300, 400, undefined],
      [1686833213, 100, 200, 300, 400, undefined],
      [1686838304, 100, 200, 300, 400, undefined],
      [1686842708, 100, 200, 300, 400, undefined],
    ],
  }
}
