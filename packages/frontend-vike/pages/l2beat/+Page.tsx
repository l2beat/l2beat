import { useState } from 'react'
import { useData } from '../../renderer/useData'
import { getActivityProjectsData } from '../../utils/get-activity-data'
import './code.css'

export { Page }

function Page() {
  const data = useData<Awaited<ReturnType<typeof getActivityProjectsData>>>()

  const [metric, setMetric] = useState<'uops' | 'tps'>('uops')
  const [sortConfig, setSortConfig] = useState<{
    column: 'project' | 'pastDay' | 'max' | 'count'
    direction: 'asc' | 'desc'
  }>({ column: 'pastDay', direction: 'desc' })

  const sortData = (entries: [string, (typeof data)[string]][]) => {
    return [...entries].sort((a, b) => {
      const [aId, aData] = a
      const [bId, bData] = b

      switch (sortConfig.column) {
        case 'project':
          return sortConfig.direction === 'asc'
            ? aId.localeCompare(bId)
            : bId.localeCompare(aId)
        case 'pastDay':
          return sortConfig.direction === 'asc'
            ? aData[metric].pastDayCount - bData[metric].pastDayCount
            : bData[metric].pastDayCount - aData[metric].pastDayCount
        case 'max':
          return sortConfig.direction === 'asc'
            ? aData[metric].maxCount.value - bData[metric].maxCount.value
            : bData[metric].maxCount.value - aData[metric].maxCount.value
        case 'count':
          return sortConfig.direction === 'asc'
            ? aData[metric].summedCount - bData[metric].summedCount
            : bData[metric].summedCount - aData[metric].summedCount
      }
    })
  }

  const handleSort = (column: typeof sortConfig.column) => {
    setSortConfig((current) => ({
      column,
      direction:
        current.column === column && current.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  return (
    <>
      <h1>L2BEAT</h1>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 border-b p-4">
          <div className="flex gap-0.5">
            <input
              id="uops"
              type="radio"
              value="uops"
              checked={metric === 'uops'}
              onChange={() => setMetric('uops')}
            />
            <label htmlFor="uops">UOPS</label>
          </div>
          <div className="flex gap-0.5">
            <input
              id="tps"
              type="radio"
              value="tps"
              checked={metric === 'tps'}
              onChange={() => setMetric('tps')}
            />
            <label htmlFor="tps">TPS</label>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort('project')}
                className="cursor-pointer"
              >
                Project{' '}
                {sortConfig.column === 'project' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('pastDay')}
                className="cursor-pointer"
              >
                Past day {metric === 'uops' ? 'UOPS' : 'TPS'}{' '}
                {sortConfig.column === 'pastDay' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('max')} className="cursor-pointer">
                Max {metric === 'uops' ? 'UOPS' : 'TPS'}{' '}
                {sortConfig.column === 'max' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('count')}
                className="cursor-pointer"
              >
                30D Count{' '}
                {sortConfig.column === 'count' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortData(Object.entries(data)).map(([id, d]) => {
              return (
                <tr className="text-center hover:bg-blue-100" key={id}>
                  <td>{id}</td>
                  <td>{d[metric].pastDayCount.toFixed(2)}</td>
                  <td>{d[metric].maxCount.value.toFixed(2)}</td>
                  <td>{d[metric].summedCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
