export function getKategoriList(barang = []) {
  const unik = new Map()

  barang.forEach((item) => {
    const nama = String(item?.kategori ?? '').trim()
    if (nama && !unik.has(nama.toLowerCase())) {
      unik.set(nama.toLowerCase(), nama)
    }
  })

  return [...unik.values()].sort((a, b) => a.localeCompare(b, 'id'))
}

export function samakanKategori(input, barang = []) {
  const teks = String(input ?? '').trim()
  const cocok = getKategoriList(barang).find(
    (k) => k.toLowerCase() === teks.toLowerCase()
  )
  return cocok ?? teks
}
