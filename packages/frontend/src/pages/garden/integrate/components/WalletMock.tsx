import { CropPlantSample } from '../../components/CropBadge'
import { CROP_COLUMNS } from '../../crops'

/**
 * What the lookup endpoint is for, drawn rather than described: the moment a
 * wallet is asking a user to sign, with the four crops of the protocol they are
 * about to touch shown inline. Decorative - it is a picture of an integration,
 * not a component anyone should ship.
 */
export function WalletMock() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]" aria-hidden>
      <div className="-inset-6 absolute rounded-[32px] bg-[#dff0dc]/50 blur-2xl dark:bg-[#15ca60]/10" />
      <div className="relative overflow-hidden rounded-[26px] border border-divider bg-surface-primary shadow-[0_18px_50px_-20px_rgba(16,32,20,.45)]">
        <div className="flex items-center justify-between border-divider border-b px-5 py-3.5">
          <span className="font-semibold text-paragraph-13 text-secondary">
            Confirm transaction
          </span>
          <span className="size-2 rounded-full bg-[#15ca60]" />
        </div>

        <div className="px-5 pt-4 pb-1">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f0f4ff] font-bold text-[#4a5fd0] text-sm dark:bg-[#4a5fd0]/15">
              UNI
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold text-paragraph-15">
                Uniswap V3
              </span>
              <span className="font-mono text-paragraph-12 text-secondary">
                0x1F98…F984
              </span>
            </span>
          </div>
        </div>

        <div className="mx-5 mt-3 flex items-center justify-between rounded-xl border border-[#cfe3c0] border-dashed bg-[#f6faf3] px-3 py-2 dark:border-[#2c3a22] dark:bg-[#15ca60]/[.06]">
          <span className="font-bold text-[10px] uppercase tracking-wider">
            CROPS
          </span>
          <div className="flex items-end gap-1">
            {SAMPLE.map((crop, index) => (
              <span
                key={crop.key}
                className="flex scale-75 flex-col items-center gap-0.5"
              >
                <CropPlantSample
                  sentiment={crop.sentiment}
                  status={crop.status}
                  delay={0.1 + index * 0.12}
                />
                <span className="font-semibold text-[10px] text-secondary">
                  {crop.letter}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4">
          <span className="flex-1 rounded-xl bg-surface-tertiary py-2.5 text-center font-semibold text-paragraph-13 text-secondary">
            Reject
          </span>
          <span className="flex-1 rounded-xl bg-[#15ca60] py-2.5 text-center font-semibold text-paragraph-13 text-white">
            Confirm
          </span>
        </div>
      </div>
    </div>
  )
}

const SAMPLE = CROP_COLUMNS.map((column, index) => ({
  key: column.key,
  letter: column.letter,
  sentiment: (['good', 'good', 'neutral', 'good'] as const)[index] ?? 'good',
  status:
    (['reviewed', 'reviewed', 'notReviewed', 'partiallyReviewed'] as const)[
      index
    ] ?? 'reviewed',
}))
