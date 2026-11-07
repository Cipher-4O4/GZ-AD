# 🛡️ PANDUAN RESMI & KREDENSIAL FINAL ATTACK & DEFENSE IONIC 2026

Dokumen ini memuat seluruh informasi teknis, kredensial akun panitia dan tim peserta, mekanisme penilaian scoring Attack & Defense, serta instruksi koneksi VPN & SSH untuk kompetisi **Final Cybersecurity IONIC 2026**.

---

## 🌐 1. Alamat Akses Platform

Platform dapat diakses melalui browser:
* **Domain Publik (Cloudflare Tunnel)**:  
  👉 **`https://photographic-deck-package-collectibles.trycloudflare.com`**
* **Akses Jaringan Privat / ZeroTier (HTTPS)**:  
  👉 **`https://10.43.170.150`** *(Abaikan peringatan self-signed SSL certificate jika muncul)*

> ℹ️ **Status Tamu (Guest)**: Saat pertama kali membuka halaman, semua pengunjung berstatus Tamu (Guest) tanpa hak istimewa. Untuk masuk, klik tombol **Masuk (Login)** pada bilah navigasi kanan atas. Menu "Tentang" (About) telah ditiadakan agar antarmuka fokus pada jalannya kompetisi.

---

## 🔐 2. Daftar Kredensial Akun

### 👑 A. Akun Administrator / Panitia
Gunakan akun ini untuk mengontrol jalannya perang (Warfare Engine), melakukan inspeksi flag, sabotase atau restore service, serta mengelola divisi dan review tim:

| Role | Username | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `Admin@IONIC2026!` | Panel `/admin/games`, Warfare Controller, CRUD Divisi, Review Tim, Scoring |

---

### ⚔️ B. Akun 10 Tim Finalis
Setiap tim login menggunakan username tim masing-masing.

| Tim ID | Kode | Username | Password Web & SSH | Nama Tim Resmi | Asal Sekolah | Target IP Vulnbox | Port SSH |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| **1** | T401 | `team1` | `Team1@IONIC2026!` | REKSADANA OVERFLOW | SMK TELKOM PURWOKERTO | `172.0.9.2` | `2221` |
| **2** | T402 | `team2` | `Team2@IONIC2026!` | Pemanasan Dulu Rek | SMK TELKOM MALANG | `172.0.9.3` | `2222` |
| **3** | T403 | `team3` | `Team3@IONIC2026!` | WILSEC - M1R41 | SMK NEGERI 1 JAKARTA | `172.0.9.4` | `2223` |
| **4** | T404 | `team4` | `Team4@IONIC2026!` | Maaf TKA Pilih CTF | MA NEGERI 3 JEMBER | `172.0.9.5` | `2224` |
| **5** | T405 | `team5` | `Team5@IONIC2026!` | WilSec - BOEDOET 47 | SMK NEGERI 1 JAKARTA | `172.0.9.6` | `2225` |
| **6** | T406 | `team6` | `Team6@IONIC2026!` | kata magfi "bebas" | SMK NEGERI 21 JAKARTA | `172.0.9.7` | `2226` |
| **7** | T407 | `team7` | `Team7@IONIC2026!` | Z3RODAY | SMK NEGERI 1 BOYOLANGU | `172.0.9.8` | `2227` |
| **8** | T408 | `team8` | `Team8@IONIC2026!` | Gangantua | SMK NEGERI 3 TUBAN | `172.0.9.9` | `2228` |
| **9** | T409 | `team9` | `Team9@IONIC2026!` | satu koma lima | SMK NEGERI 1 BOYOLANGU | `172.0.9.10` | `2229` |
| **10** | T410 | `team10` | `Team10@IONIC2026!` | Pengen Menang | SMKN 1 KEPANJEN | `172.0.9.11` | `2230` |

---

## ⚙️ 3. Mekanisme Scoring & Rules Attack & Defense

### 1. Waktu Pertandingan (Live & Realtime)
* **Status**: Aktif saat ini (**Round 1, Tick 1**)
* **Durasi 1 Tick**: **60 detik** (1 Menit)
* **Masa Berlaku Flag**: **3 Tick** (180 detik). Flag yang ditanam pada Tick 1 akan kedaluwarsa setelah Tick 3 berakhir.

### 2. Aturan Penyerangan (Attack)
* Target serangan adalah service tim lawan pada IP masing-masing (`172.0.9.X`).
* Format Flag: `flag{ionic26_<teamId>_<service>_t<tick>_<hash>}`
* Flag dapat disubmit secara satuan atau **Batch Multiple Flags** (satu flag per baris) di Sidebar halaman `/games/5/challenges`.
* Poin:
  * **+100 Poin Attack** untuk setiap flag lawan yang valid dan belum pernah diambil.
  * **-50 Poin Defense** dipotong dari tim lawan yang menjadi korban eksploitasi.
* ⚠️ **Dilarang**:
  * Men-submit flag milik service tim Anda sendiri (otomatis ditolak sistem).
  * Melakukan serangan DoS/DDoS brutal pada infrastruktur platform scoring.

### 3. Aturan Pertahanan & Ketersediaan Layanan (Defense & SLA)
Setiap tick berakhir, sistem checker memeriksa ketersediaan service setiap tim:
* **Layanan UP (Operational)**: Tim memperoleh **+10 Poin SLA Availability** per service per tick.
* **Layanan FAULT (Mumble / Integritas Rusak)**: Service menjawab namun fungsionalitas utama rusak atau di-patch secara ilegal hingga checker gagal. Tidak ada poin SLA.
* **Layanan DOWN (Offline / Port Tertutup)**: Service mati total. Poin SLA 0.

### 4. Daftar Service Tantangan (Challenges)
| No | Nama Service | Kategori | Port Default | Deskripsi Ringkas |
| :---: | :--- | :---: | :---: | :--- |
| 1 | `simple-crypto` | Crypto | `8001` | Layanan enkripsi/deskripsi custom dengan kelemahan padding/key reuse. |
| 2 | `simple-pwn` | Pwn | `8002` | Binary TCP service dengan celah stack overflow / format string. |
| 3 | `simple-web` | Web | `8003` | Aplikasi web autentikasi dengan celah SQL Injection / IDOR. |
| 4 | `coloring` | Web | `8004` | Aplikasi web SVG generator / template injection. |

---

## 🔌 4. Panduan Koneksi WireGuard & SSH Jarak Jauh

Karena kompetisi diselenggarakan secara online/jarak jauh, peserta menghubungkan perangkat ke jaringan CTF melalui WireGuard VPN sebelum mengakses Vulnbox masing-masing.

### A. Konfigurasi WireGuard Peserta
Contoh konfigurasi file `.conf` untuk Tim (misal Tim 7 - Z3RODAY):

```ini
[Interface]
PrivateKey = <Private_Key_Tim_7>
Address = 10.8.0.17/24
DNS = 1.1.1.1

[Peer]
PublicKey = <Public_Key_Server_Proxmox>
Endpoint = <IP_Public_Server_Atau_ZeroTier>:51820
AllowedIPs = 10.8.0.0/24, 172.0.9.0/24
PersistentKeepalive = 25
```

Jalankan koneksi:
```bash
sudo wg-quick up wg0
```

### B. Akses SSH ke Server Tim Sendiri (Untuk Patching & Defence)
Peserta masuk ke server mesin sendiri untuk memeriksa source code, membaca log, dan menambal celah:

```bash
# Melalui VPN WireGuard:
ssh team7@10.8.0.1 -p 2227

# Atau melalui IP Host CTF:
ssh team7@10.43.170.150 -p 2227
```
*(Ganti angka `7` dan port `2227` sesuai ID Tim masing-masing pada Tabel Kredensial).*

---

## 🖥️ 5. Fitur Platform Web yang Tersedia

1. **Dashboard Pertandingan (`/games/5`)**:
   - Menampilkan status Final Cybersecurity IONIC 2026.
   - Tombol langsung menuju Scoreboard dan Challenges.
2. **Visual Attack-Defense Map (`/games/5/attack` / `/games/5/scoreboard`)**:
   - Map interaktif visual jaringan 10 tim.
   - Radar indikator kesehatan service (Hijau = UP, Oranye = Mumble, Merah = Offline).
   - Feed realtime First Blood & Serangan Nuke.
3. **Challenges & Batch Flag Submit (`/games/5/challenges`)**:
   - Tab kategori Crypto, Pwn, Web.
   - Form input flag dengan dukungan pemisahan otomatis baris baru (multi-flag submission).
   - Modal detail instruksi dan port tiap service.
4. **Daftar Tim (`/teams`)**:
   - Menampilkan 10 tim finalis beserta nama sekolah dan status keanggotaan.
5. **Panel Admin Panitia (`/admin/games`)**:
   - Mengontrol Round & Tick (Start, Pause, Resume, Next Tick).
   - Pengaturan durasi tick.
   - Manajemen Divisi (`/admin/games/5/divisions`).
   - Review Tim Peserta (`/admin/games/5/review`).
   - Inspeksi Flag aktif & simulasi serangan.
