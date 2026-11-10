import { AlertTriangle, RotateCcw } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = 'Gagal Memuat Data Inventaris',
  message = 'Terjadi kendala saat mengambil data dari server API.',
  onRetry,
}) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="mx-auto my-8 max-w-lg rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <AlertTriangle size={24} />
      </div>

      <h2 className="mt-4 text-base font-bold text-slate-800">{title}</h2>

      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{message}</p>

      {onRetry && (
        <div className="mt-5 flex justify-center">
          <Button type="button" onClick={onRetry}>
            <RotateCcw size={16} className="mr-2" />
            Coba Muat Ulang
          </Button>
        </div>
      )}
    </section>
  )
}
