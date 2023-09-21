import React from 'react'

export function RequestTokenBox() {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 bg-gradient-to-r from-[#7E41CC66] via-[#FF46C066] to-[#EE2C0166] py-6 px-10 text-lg md:mx-4 md:flex-row md:rounded-xl">
      <div className="font-semibold">
        Can't find a token you're looking for?
      </div>
      <a
        className="font-bold tracking-wide underline"
        href="https://forms.gle/fQFsC5g1LgG5z12T7"
        target="_blank"
      >
        Request it here
      </a>
    </div>
  )
}
