# Panduan Menggunakan Docker untuk Clover Cosplay

File ini berisi panduan langkah demi langkah untuk menjalankan aplikasi Clover Cosplay menggunakan Docker. 
Settingan ini sudah dikonfigurasi untuk **Development Mode** (Hot Reload), jadi setiap kamu ubah kodingan, hasilnya akan otomatis berubah di browser.

## 1. Persiapan Awal

Sebelum memulai, pastikan kamu sudah menginstall **Docker Desktop**:
1.  Download **Docker Desktop for Windows (AMD64)** dari website resmi Docker.
2.  Install dan jalankan aplikasinya.
3.  Tunggu sampai status di pojok kiri bawah aplikasi Docker berwarna **Hijau (Running)**.

## 2. Cara Menjalankan Aplikasi

1.  Buka **Terminal** (Command Prompt / PowerShell / VS Code Terminal).
2.  Pastikan kamu berada di dalam folder project `clover-cosplay`.
3.  Jalankan perintah berikut:

```bash
docker-compose up --build
```

**Penjelasan:**
*   `up`: Menyalakan container.
*   `--build`: Memaksa install ulang/bangun ulang aplikasi (penting saat pertama kali atau ada perubahan kode baru).

Tunggu prosesnya (bisa memakan waktu beberapa menit saat pertama kali karena mendownload Node.js dan MySQL).

Jika berhasil, akan muncul tulisan seperti:
> `Ready in Xms` atau `Listening on port 3000`

## 3. Membuka Aplikasi

Buka browser (Chrome/Edge) dan akses alamat ini:

👉 **http://localhost:3000**

## 4. Cara Mematikan Aplikasi

Untuk mematikan server Docker:
*   Tekan `Ctrl + C` di terminal tempat Docker berjalan.
*   Atau buka terminal baru dan ketik:
    ```bash
    docker-compose down
    ```

## Catatan Penting

1.  **Database Cloud (Aiven)**:
    Docker ini sekarang disetting untuk membaca file `.env` kamu dan connect langsung ke **Aiven MySQL**.
    Jadi, data yang tampil di Docker akan **SAMA PERSIS** dengan data yang ada di Aiven (Cloud).

2.  **Tidak Perlu Seeding Ulang**:
    Karena connect ke database cloud yang sudah ada, kamu tidak perlu menjalankan perintah seeding lagi (kecuali kamu memang mau mereset data cloud).

3.  **Jika Ada Error**:
    Coba matikan dulu dengan `docker-compose down`, lalu nyalakan lagi dengan `docker-compose up`.
