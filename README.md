# Wedding Invitation — Kinan & Faiz

Undangan pernikahan digital yang responsif dan dipersonalisasi untuk setiap tamu. Project ini menampilkan rangkaian cerita undangan, detail resepsi, RSVP, ucapan tamu, galeri, informasi wedding gift, musik, dan halaman penutup dalam satu pengalaman interaktif.

Live site: [wedding-invitations-lovat.vercel.app](https://wedding-invitations-lovat.vercel.app/)

## Fitur

- Sapaan tamu berdasarkan slug pada URL, misalnya `?to=rina-fajar`.
- Splash screen dan invitation story dengan transisi serta dukungan reduced motion.
- Countdown menuju 16 Agustus 2026 pukul 09.30 WIB.
- Detail resepsi pukul 09.30–11.30 WIB di Pala Ballroom, Surabaya Suites Hotel.
- RSVP personal dengan batas jumlah tamu dan pencegahan pengiriman ulang.
- Wishes & Prayers terpisah dari RSVP, lengkap dengan daftar pesan yang ditampilkan.
- Wedding gift dengan pola tap to reveal/hide; data rekening hanya diambil saat diminta.
- Galeri preview dan galeri lengkap dengan foto lokal yang telah dioptimalkan.
- Tombol musik global yang tetap mudah dijangkau selama invitation story dibuka.
- Layout responsif untuk ponsel dan tablet, dengan preview khusus pada desktop mulai 1024 px.

## Tech Stack

- [Next.js 16](https://nextjs.org/) dengan App Router
- [React 19](https://react.dev/)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Supabase
- Vercel

## Menjalankan Project

Persyaratan:

- Node.js 20 atau versi LTS yang lebih baru
- npm
- Project Supabase dengan tabel dan RPC yang sesuai

Install dependency:

```bash
npm install
```

Buat file `.env.local` di root project, lalu isi variabel yang diperlukan:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

WEDDING_MANDIRI_ACCOUNT_NAME=
WEDDING_MANDIRI_ACCOUNT_NUMBER=
WEDDING_BRI_ACCOUNT_NAME=
WEDDING_BRI_ACCOUNT_NUMBER=
WEDDING_BCA_ACCOUNT_NAME=
WEDDING_BCA_ACCOUNT_NUMBER=

# Opsional; default-nya /music/wedding-song.mp3
NEXT_PUBLIC_WEDDING_MUSIC_SRC=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` juga didukung sebagai pengganti `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Untuk menguji personalisasi tamu, gunakan slug yang tersimpan di tabel `guests`:

```text
http://localhost:3000/?to=guest-slug
```

Slug hanya menerima huruf kecil, angka, dan tanda hubung.

## Integrasi Supabase

Frontend menggunakan Supabase publishable/anon key dan memanggil RPC berikut:

| RPC | Fungsi |
| --- | --- |
| `resolve_guest(p_slug)` | Mengambil identitas tamu, batas tamu, serta status RSVP dan wishes. |
| `submit_rsvp(p_slug, p_guest_count)` | Menyimpan konfirmasi kehadiran satu kali. |
| `submit_wish(p_slug, p_sender_name, p_message)` | Menyimpan ucapan tamu satu kali. |
| `list_visible_wishes(p_limit)` | Mengambil ucapan yang boleh ditampilkan. |

Data utama tersimpan pada tabel `guests`, `rsvps`, dan `wishes`. Aturan validasi, relasi, Row Level Security, dan izin eksekusi RPC tetap harus dikonfigurasi di Supabase.

Jika konfigurasi Supabase belum tersedia, undangan masih dapat dibuka, tetapi personalisasi, RSVP, dan wishes tidak aktif.

## Keamanan Wedding Gift

Nama dan nomor rekening menggunakan environment variable server-side tanpa awalan `NEXT_PUBLIC_`. Browser mengambilnya dari endpoint `/api/transaction` hanya setelah tombol reveal ditekan, dan respons tidak disimpan di cache.

Jangan menaruh nilai rekening, Supabase secret/service-role key, atau isi `.env.local` di repository. Semua environment variable yang sama perlu ditambahkan pada project Vercel sebelum deployment.

## Scripts

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server. |
| `npm run build` | Membuat production build. |
| `npm run start` | Menjalankan production server dari hasil build. |
| `npm run lint` | Menjalankan ESLint. |
| `npm test` | Menjalankan test suite berbasis Node.js. |

## Struktur Project

```text
app/
├── api/transaction/      # Endpoint server-side untuk wedding gift
├── fonts/                # Font lokal
├── layout.tsx
└── page.tsx
components/
├── invitation/           # Seluruh section dan interaksi invitation story
├── layout/               # Desktop preview
├── main-screen/          # Halaman pembuka invitation story
└── splash-screen/        # Cover awal undangan
lib/
├── invitation-api.ts     # Akses RPC Supabase
├── invitation-story.ts   # Konfigurasi acara, aset, countdown, dan state story
├── invitation.ts         # Resolusi slug dan sapaan tamu
├── supabase.ts           # Supabase browser client
└── transaction.ts        # Pembacaan rekening dari server environment
public/
├── images/               # Aset visual lokal
└── music/                # Audio undangan
tests/                    # Unit dan source-contract tests
```

Detail acara, waktu countdown, lokasi, dan daftar aset terpusat di `lib/invitation-story.ts`. Perubahan konten utama sebaiknya dilakukan dari sana agar seluruh section tetap konsisten.

## Validasi Sebelum Deployment

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

Pastikan URL tamu memakai slug yang aktif di Supabase dan seluruh environment variable production sudah terpasang di Vercel.
