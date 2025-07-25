function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1024) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 1024));
  }
  return btoa(binary);
}

function cleanJSONText(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/, '')
    .trim();
}

// Konfigurasi
const CONFIG = {
  API_KEY: <<your_api_key>>,
  MODEL: 'gemini-2.5-flash',
  PROMPT: `Tolong ekstrak teks dari gambar JPG atau file PDF ini. Output harus berupa JSON array of object, tanpa penjelasan tambahan.
  Format yang digunakan:
  [
    (jika ada tampilkan {
      "no_kk": ""
    }),
    {
      "data": {
        "nik": "",
        "nama": "",
        "tempat_tanggal_lahir": "",
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
        "status_perkawinan": "",
        "pekerjaan": "",
        "kewarganegaraan": ""
      }
    }
  ]`,
};

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.MODEL}:generateContent?key=${CONFIG.API_KEY}`;
const HTML_URL = 'https://raw.githubusercontent.com/arv-fazriansyah/ocr-gemini-ai-api/main/index.html';

export default {
  async fetch(request) {
    // Handle GET - Serve HTML from GitHub
    if (request.method === 'GET') {
      try {
        const htmlRes = await fetch(HTML_URL);
        if (!htmlRes.ok) {
          return new Response('Gagal memuat halaman', { status: 500 });
        }
        const html = await htmlRes.text();
        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      } catch (err) {
        return new Response('Error saat mengambil HTML: ' + err.message, { status: 500 });
      }
    }

    // Handle POST - OCR Request
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
          return new Response('File tidak ditemukan.', { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = arrayBufferToBase64(arrayBuffer);
        const mimeType = file.type || 'application/octet-stream';

        const payload = {
          contents: [
            {
              parts: [
                { text: CONFIG.PROMPT },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        };

        const geminiRes = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await geminiRes.json();
        let outputText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        outputText = cleanJSONText(outputText);

        try {
          const parsed = JSON.parse(outputText);
          return new Response(JSON.stringify(parsed, null, 2), {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch {
          return new Response(outputText, {
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      } catch (err) {
        return new Response('Terjadi kesalahan saat memproses file.', { status: 500 });
      }
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};
