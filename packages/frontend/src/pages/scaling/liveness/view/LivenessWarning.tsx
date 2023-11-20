import React from 'react'

export function LivenessWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-xs font-medium text-black">
      Please note, the values on the page{' '}
      <span className="font-extrabold">do not</span> reflect the time to
      finality (the time it would take for your L2 transaction to be finalized
      on the L1 after it has been submitted).
    </p>
  )
}
