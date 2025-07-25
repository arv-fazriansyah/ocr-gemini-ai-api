
---
![Demo](https://github.com/arv-fazriansyah/ocr-gemini-ai-api/raw/main/img/demo.png)
# **OCR berbasis Cloudflare Worker + Gemini API (KTP/KK)**
Proyek ini memungkinkan Anda mengunggah file Kartu Tanda Penduduk (KTP) atau Kartu Keluarga (KK) dalam bentuk (JPG) atau PDF, lalu mengekstrak informasi teks dalam format JSON terstruktur menggunakan Google Gemini API (`gemini-2.5-flash`).

---

## 🔧 Fitur

* OCR menggunakan model Gemini 2.5 Flash dari Google
* Input file: JPG atau PDF
* Output: JSON terstruktur berisi data identitas
* Deploy di Cloudflare Worker
* Frontend HTML terpisah di GitHub

---

## 🖼️ Format Output JSON

Output hasil OCR akan dalam bentuk array of object seperti ini:

```json
  [
    (jika ada tampilkan {
      "no_kk": ""
    }),
    {
        "nik": "",
        "nama": "",
        "tempat_lahir": "",
        "tanggal_lahir": "",
        "jenis_kelamin": "",
        "golongan_darah": "",
        "alamat": {
          "jalan": "",
          "RT": "",
          "RW": "",
          "desa": "",
          "kecamatan": "",
          "kabupaten": "",
          "provinsi": ""
        },
        "agama": "",
        (jika ada tampilkan {
          "pendidikan": ""
        }),
        "status_perkawinan": "",
        "pekerjaan": "",
        "kewarganegaraan": ""
      }
  ]
```

---

## 🚀 Deploy ke Cloudflare Worker

### 1. Clone repository

```bash
git clone https://github.com/arv-fazriansyah/ocr-gemini-ai-api.git
cd ocr-gemini-ai-api
```

### 2. Edit API Key Gemini

Buka file worker (`worker.js` atau `index.js`) dan ubah bagian:

```js
API_KEY: <<your_api_key>>
```

Ganti dengan [Google Gemini API Key](https://makersuite.google.com/app/apikey).

### 3. Deploy ke Cloudflare Worker

Jika menggunakan Wrangler:

```bash
npm install -g wrangler
wrangler init
wrangler publish
```

---

## 🌐 Frontend (HTML UI)

Frontend web (form upload) bisa diakses langsung dari GitHub raw URL:

```
https://raw.githubusercontent.com/arv-fazriansyah/ocr-gemini-ai-api/main/index.html
```

HTML ini akan otomatis diload oleh Worker saat diakses melalui metode `GET`.

---

## 🔁 Cara Kerja

1. File dikirim melalui `POST` ke Worker
2. Worker mengubah file menjadi base64
3. Base64 + prompt dikirim ke endpoint Gemini API
4. Hasil teks diekstrak dan diparse sebagai JSON
5. Output ditampilkan dalam format JSON atau teks mentah (jika parsing gagal)

---

## 📦 Struktur File

* `index.js` – Script utama Cloudflare Worker
* `index.html` – Frontend form upload file
* `README.md` – Dokumentasi

---

## 📝 Catatan

* Pastikan file tidak melebihi batas ukuran Cloudflare (10 MB).
* Jangan gunakan API Key publik di frontend.
* Gunakan Gemini Flash (`gemini-2.5-flash`) untuk performa cepat.

---

## 📄 Lisensi

MIT © 2025 [arv-fazriansyah](https://github.com/arv-fazriansyah)

---
