import { getScalingActivityEntries } from '~/server/features/scaling/get-scaling-activity-entries'
import { ScalingActivityTable } from './_components/table/scaling-activity-table'

export default async function Page() {
  const entries = await getScalingActivityEntries()

  return (
    <>
      <ScalingActivityTable entries={entries} />
    </>
  )
}
