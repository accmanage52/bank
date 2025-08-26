export default function VirtualDebitCard({ name, cardNumber, expiry, cvv }) {
  const formatted = (cardNumber || '').replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
  return (
    <div className="relative w-[330px] h-[200px] rounded-2xl overflow-hidden shadow-glow bg-gradient-to-br from-credPurple to-credTeal p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_40%)]" />
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="text-xs opacity-80">virtual debit</div>
          <div className="text-sm font-semibold">bankvault</div>
        </div>
        <div className="text-2xl tracking-widest select-all">{formatted || '0000 0000 0000 0000'}</div>
        <div className="flex justify-between text-sm">
          <div>
            <div className="opacity-70 text-xs">card holder</div>
            <div className="font-medium">{name || 'FULL NAME'}</div>
          </div>
          <div>
            <div className="opacity-70 text-xs">expiry</div>
            <div className="font-medium">{expiry || 'MM/YY'}</div>
          </div>
          <div>
            <div className="opacity-70 text-xs">cvv</div>
            <div className="font-medium">{cvv || '***'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
