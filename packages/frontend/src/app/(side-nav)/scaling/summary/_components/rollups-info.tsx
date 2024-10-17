import { InfoIcon } from "~/icons/info";

export function RollupsInfo() {
  return <div className="flex items-center gap-1">
    <InfoIcon variant="blue" className="size-3 shrink-0" />
    <span className="text-[13px] font-medium leading-[1.15] text-secondary"><i><strong>Rollup</strong></i> is a blockchain that inherits both consensus and DA from L1 and has a trust-minimized bridge with the base layer via a proof system (using fraud proofs or ZK proofs).</span>
  </div>
}