import { MainPageWarning } from '~/components/main-page-warning'

export function LivenessWarning() {
  return (
    <MainPageWarning className="md:mb-3">
      Please note, the values on the page{' '}
      <span className="font-black">do not</span> reflect the time to finality
      (the time it would take for your L2 transaction to be finalized on the L1
      after it has been submitted).
    </MainPageWarning>
  )
}
