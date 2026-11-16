import { cn } from '~/utils/cn'
import { DONATE_ADDRESS } from '../DonatePage'

export function QrCodeSection({
  mobile,
  qrCodeUrl,
  className,
}: {
  className: string
  mobile?: boolean
  qrCodeUrl: string
}) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            'size-[200px] rounded-xl border border-divider bg-white p-3',
            mobile && 'size-[184px]',
          )}
        >
          <img
            alt="QR Code of donate address"
            src={qrCodeUrl}
            width={176}
            height={176}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>
        <p className="mx-auto mt-4 inline-block w-[21ch] break-all font-mono font-normal text-lg">
          {DONATE_ADDRESS}
        </p>
      </div>
    </div>
  )
}
