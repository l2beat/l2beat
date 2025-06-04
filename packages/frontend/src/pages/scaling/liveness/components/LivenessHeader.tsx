import { MainPageHeader } from '~/components/MainPageHeader'

export function LivenessHeader() {
  return (
    <MainPageHeader description="Liveness shows how actively different operators are posting data to Ethereum and whether there are any significant deviations from their usual submission schedule. Please note that the values on this page do not reflect the time to finality. For more details, check the Finality page.">
      Liveness
    </MainPageHeader>
  )
}
