export function PentagonRosetteSkeleton() {
  return (
    <div className="shrink-0 size-[272px] mt-auto flex items-center justify-center ">
      <svg
        width="198"
        height="188"
        viewBox="0 0 198 188"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // Easiest way to move the center of the pentagon to the center of the div
        // If any issues arise, we can think about other ways to do it
        className="-translate-y-[5.28%]"
      >
        <path
          d="M96.8716 2.00712C98.1411 1.08625 99.8589 1.08625 101.128 2.00712L195.424 70.4045C196.697 71.3276 197.229 72.9658 196.743 74.4607L160.728 185.122C160.242 186.615 158.85 187.625 157.281 187.625H40.7193C39.1495 187.625 37.7581 186.615 37.2723 185.122L1.25718 74.4607C0.77064 72.9658 1.30318 71.3276 2.57579 70.4045L96.8716 2.00712Z"
          fill="#323539"
          className="animate-pulse fill-gray-100 dark:fill-zinc-900"
        />
      </svg>
    </div>
  )
}
