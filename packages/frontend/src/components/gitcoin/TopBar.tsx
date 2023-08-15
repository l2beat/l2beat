import React from 'react'

export function GitcoinTopBar() {
  return (
    <a
      className="TopBar-Gitcoin flex hidden flex-col items-center justify-center bg-[#0d0533] p-2 text-center text-xs font-bold text-white md:flex-row md:space-x-5 md:text-sm"
      // href="<fill me in soon>"
      // target="_blank"
    >
      <p>We are taking part in Gitcoin Grants 18!</p>
      <span>
        <span className="underline decoration-solid underline-offset-2 transition-colors ease-in-out hover:text-[#16ebb4]">
          {/* Donate here */}
          Coming soon
        </span>
        {/* <ArrowRightIcon className="ml-1 inline-block fill-current" /> */}
      </span>
    </a>
  )
}
