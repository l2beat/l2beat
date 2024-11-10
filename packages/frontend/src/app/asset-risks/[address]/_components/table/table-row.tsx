// 'use client'
// import Image from 'next/image'
// import { type TdHTMLAttributes, useState } from 'react'
// import { type ClassNameValue } from 'tailwind-merge'
// import { formatUnits } from 'viem'
// import { ArrowIcon } from '~/icons/arrow'
// import { cn } from '~/utils/cn'
// import { type Token, useReport } from '../report-context'
// import { RiskDetails } from './risk-details'
// import { StageBadge } from './stage-badge'
// import { CriticalWarning, Warning } from './warning'

// export function TableRow({
//   token,
// }: {
//   token: Token
// }) {
//   const report = useReport()
//   const chain = report.chains[token.token.networkId]
//   const [isOpen, setIsOpen] = useState(false)

//   const criticalWarnings = chain?.risks.filter((r) => r.isCritical) ?? []
//   const warnings = chain?.risks.filter((r) => !r.isCritical) ?? []
//   const bridges = report.bridges
//     .filter((b) => b.targetTokenId === token.token.address)
//     .map((b) => ({
//       ...b,
//       externalBridge: b.externalBridgeId
//         ? report.externalBridges.find((e) => e.id === b.externalBridgeId)
//         : null,
//     }))

//   return (
//     <>
//       <tr
//         className={cn(
//           'cursor-pointer',
//           'hover:bg-black/[0.05] dark:hover:bg-white/[0.1]',
//           !isOpen && 'border-b border-b-gray-200 dark:border-b-zinc-700',
//           'group-hover/body:bg-black/[0.05]',
//         )}
//         onClick={() => setIsOpen((s) => !s)}
//       >
//         <Cell>
//           {/* TODO: add dolar value */}
//           <div className="text-lg font-bold text-black dark:text-white">
//             $0.00
//           </div>
//           <div className="text-sm font-medium text-gray-500 dark:text-gray-50">
//             {token.balance &&
//               formatUnits(BigInt(token.balance), token.meta?.decimals ?? 0)}
//             &nbsp;
//             {token.meta?.symbol}
//           </div>
//         </Cell>
//         <Cell className="flex items-center gap-2">
//           {token.meta?.logoUrl && (
//             <Image
//               src={token.meta?.logoUrl}
//               alt={`${token.meta?.name} icon`}
//               width={32}
//               height={32}
//               className="size-8"
//             />
//           )}
//           <div className="flex flex-col">
//             <span className="text-lg font-bold">{token.meta?.name}</span>
//             <div className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-50">
//               on <span className="font-medium">{chain?.name}</span>
//               &nbsp;
//               {chain?.stage && <StageBadge stage={chain.stage} />}
//               &nbsp;
//               {bridges.length === 1
//                 ? `bridged via ${
//                     bridges[0]?.externalBridge?.name ?? 'Canonical bridge'
//                   }`
//                 : bridges.length !== 0
//                   ? `bridged via multiple bridges`
//                   : null}
//             </div>
//           </div>
//         </Cell>
//         <Cell>TYPE</Cell>
//         <Cell>
//           <div className={cn('flex items-center justify-between gap-3')}>
//             <div className="flex items-center gap-3">
//               {!!criticalWarnings.length && (
//                 <CriticalWarning count={criticalWarnings.length} />
//               )}
//               {!!warnings.length && <Warning count={warnings.length} />}
//             </div>
//             <div className={cn(!isOpen && 'rotate-180')}>
//               <ArrowIcon className="dark:fill-gray-50" />
//             </div>
//           </div>
//         </Cell>
//       </tr>
//       {isOpen && (
//         <tr
//           className={cn(
//             'cursor-default border-b border-b-gray-200 dark:border-b-zinc-700',
//             'hover:bg-black/[0.05] dark:hover:bg-white/[0.1]',
//             'group-hover/body:bg-black/[0.05]',
//           )}
//         >
//           <Cell className="pt-0" colSpan={5}>
//             <RiskDetails token={token} />
//           </Cell>
//         </tr>
//       )}
//     </>
//   )
// }

// export function Cell({
//   children,
//   className,
//   ...rest
// }: {
//   children: React.ReactNode
//   className?: ClassNameValue
// } & TdHTMLAttributes<HTMLTableCellElement>) {
//   return (
//     <td
//       className={cn(
//         'h-16 min-w-max p-2 first:pl-[18px] last:pr-[18px]',
//         className,
//       )}
//       {...rest}
//     >
//       {children}
//     </td>
//   )
// }
