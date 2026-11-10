const NAMA_BULAN_SINGKAT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

const NAMA_BULAN_PANJANG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export function formatTanggal(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getDate()} ${NAMA_BULAN_SINGKAT[d.getMonth()]} ${d.getFullYear()}`
}

export function formatTanggalIndonesia(date = new Date()) {
  return `${NAMA_HARI[date.getDay()]}, ${date.getDate()} ${NAMA_BULAN_PANJANG[date.getMonth()]} ${date.getFullYear()}`
}

export function sisaHari(dateStr, today = new Date()) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - today) / (1000 * 60 * 60 * 24))
}

export function todayISOString(date = new Date()) {
  const bulan = String(date.getMonth() + 1).padStart(2, '0')
  const hari = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${bulan}-${hari}`
}

export function tambahHariISO(jumlahHari, baseDate = new Date()) {
  const d = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + Number(jumlahHari)
  )
  return todayISOString(d)
}

export function sesuaikanTanggalBulanIni(isoStr, now = new Date()) {
  if (!isoStr || typeof isoStr !== 'string') return todayISOString(now)
  const parts = isoStr.split('-').map(Number)
  if (parts.length !== 3) return isoStr
  const [, , day] = parts
  const maxDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const safeDay = Math.min(Math.max(1, day), maxDay)
  return todayISOString(new Date(now.getFullYear(), now.getMonth(), safeDay))
}
