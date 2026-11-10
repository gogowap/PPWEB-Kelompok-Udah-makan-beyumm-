import { useState } from 'react'
import {
  Settings,
  AlertTriangle,
  CalendarClock,
  Save,
  RotateCcw,
} from 'lucide-react'
import { Modal, Button } from '../components/common'
import { useInventaris } from '../hooks/useInventaris'
import { DEFAULT_INVENTARIS_SETTINGS } from '../context/inventarisContextObject'

function SettingCard({ icon: Icon, title, description, children }) {
  return (
    <section
      aria-label={title}
      className="bg-white border border-slate-200 rounded-xl shadow-sm"
    >
      <div className="flex items-start gap-3 p-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function NumberInput({ id, label, value, onChange, suffix, min = 0 }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-600 mb-1.5"
      >
        {label}
      </label>
      <div className="flex">
        <input
          id={id}
          type="number"
          min={min}
          value={value}
          onChange={(e) => {
            const raw = e.target.value
            const next = raw === '' ? min : Number(raw)
            onChange(Math.max(min, Number.isFinite(next) ? next : min))
          }}
          className="w-full rounded-l-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
        />
        {suffix && (
          <div className="px-3 py-2 bg-slate-50 border border-l-0 border-slate-200 rounded-r-lg text-xs text-slate-500 flex items-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const {
    settings: contextSettings,
    saveSettings,
    resetSettings,
  } = useInventaris()

  const [localSettings, setLocalSettings] = useState(contextSettings)
  const [saved, setSaved] = useState(false)
  const [confirmResetModal, setConfirmResetModal] = useState(false)

  function update(key, value) {
    setSaved(false)
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    saveSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function confirmReset() {
    resetSettings()
    setLocalSettings(DEFAULT_INVENTARIS_SETTINGS)
    setConfirmResetModal(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <Settings size={19} />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">Pengaturan</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-11">
            Atur batas peringatan stok dan kedaluwarsa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmResetModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#8A7CD9]"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <Save size={15} />
            Simpan Pengaturan
          </button>
        </div>
      </header>

      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg px-4 py-3 text-xs font-medium"
        >
          ✓ Pengaturan berhasil disimpan.
        </div>
      )}

      <SettingCard
        icon={AlertTriangle}
        title="Peringatan Stok"
        description="Tentukan batas stok yang dianggap kritis."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            id="setting-stok-kritis-gudang"
            label="Stok kritis gudang"
            value={localSettings.stokKritisGudang}
            onChange={(value) => update('stokKritisGudang', value)}
            suffix="pcs"
          />
          <NumberInput
            id="setting-stok-kritis-display"
            label="Stok kritis display"
            value={localSettings.stokKritisDisplay}
            onChange={(value) => update('stokKritisDisplay', value)}
            suffix="pcs"
          />
        </div>
      </SettingCard>

      <SettingCard
        icon={CalendarClock}
        title="Peringatan Kedaluwarsa"
        description="Tentukan kapan barang mulai muncul pada peringatan Dashboard."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput
            id="setting-kadaluarsa-bulan"
            label="Mulai peringatan kedaluwarsa"
            value={localSettings.kadaluarsaBulan}
            onChange={(value) => update('kadaluarsaBulan', value)}
            suffix="bulan"
            min={1}
          />
          <NumberInput
            id="setting-kadaluarsa-mendesak"
            label="Peringatan kedaluwarsa mendesak"
            value={localSettings.kadaluarsaMendesakHari}
            onChange={(value) => update('kadaluarsaMendesakHari', value)}
            suffix="hari"
            min={1}
          />
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            Contoh: jika diatur <b>3 bulan</b>, setiap kloter dengan tanggal kedaluwarsa dalam sekitar 3 bulan akan muncul di Dashboard.
          </p>
        </div>
      </SettingCard>

      <Modal
        isOpen={confirmResetModal}
        onClose={() => setConfirmResetModal(false)}
        title="Reset Pengaturan"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Kembalikan semua pengaturan ke nilai awal?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmResetModal(false)}
            >
              Batal
            </Button>
            <Button type="button" onClick={confirmReset}>
              Ya, Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
