import type { Step2Payload } from './step-2'
import type { Step3Payload } from './step-3'

type Props = {
  state: {
    step1: boolean
    step2: Step2Payload
    step3: Step3Payload
  }
}

export function Step4(props: Props) {
  return (
    <div className="flex size-full items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase text-purple-100">
          The best choice for you:
        </div>
        <div className="text-2xl font-bold">The [[ project ]] pizza!</div>
        <div className="text-[15px] text-gray-500">
          Would you like to order or pick a different one?
        </div>
      </div>
      <div className="flex">
        <PizzaBackground className="size-[300px]" />
      </div>
    </div>
  )
}

function PizzaBackground({ className }: { className?: string }) {
  return (
    <svg
      width="324"
      height="302"
      viewBox="0 0 324 302"
      fill="none"
      className={className}
    >
      <path
        opacity="0.7"
        d="M324 163.006C323.953 142.295 320.496 121.944 314.857 103.092C298.016 46.7912 259.121 -2.38895 208.537 0.0898307C176.102 1.67885 143.679 7.11409 111.243 11.4214C83.5571 15.0978 56.0317 18.4657 32.8214 43.2176C22.7763 53.9301 14.3717 67.3766 8.76879 82.4419C-6.80943 124.327 -0.362868 173.773 18.1304 209.878C36.6243 245.983 65.5382 270.622 95.648 290.023C107.925 297.935 121.801 305.265 135.763 300.331C144.361 297.291 151.874 289.919 160.144 285.33C187.968 269.888 217.911 288.054 247.355 284.14C264.846 281.815 282.144 271.302 295.293 255.007C310.998 235.543 320.399 208.528 323.107 181.521C323.727 175.337 324.013 169.155 324 163.006Z"
        fill="#FFD9F9"
      />
    </svg>
  )
}
