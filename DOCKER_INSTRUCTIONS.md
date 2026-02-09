# Panduan Menggunakan Docker untuk Clover Cosplay

File ini berisi panduan langkah demi langkah untuk menjalankan aplikasi Clover Cosplay menggunakan Docker. 
Setup ini sudah **FULL STACK** (Aplikasi Next.js + Database MySQL Lokal), jadi kamu tidak perlu install MySQL atau Node.js secara manual di laptop lain.

## 1. Persiapan Awal

Pastikan kamu sudah menginstall **Docker Desktop**:
1.  Download **Docker Desktop for Windows** dari website resmi Docker.
2.  Install dan jalankan aplikasinya.
3.  Tunggu sampai status di pojok kiri bawah aplikasi Docker berwarna **Hijau (Running) / Engine Running**.

## 2. Cara Menjalankan Aplikasi

1.  Buka **Terminal** (Command Prompt / PowerShell / VS Code Terminal).
2.  Pastikan kamu berada di dalam folder project `clover-cosplay`.
3.  Jalankan perintah berikut:

```bash
docker-compose up -d --build
```

**Penjelasan:**
*   `up`: Menyalakan container.
*   `-d`: Detached mode (jalan di background, terminal tidak terkunci).
*   `--build`: Memaksa build ulang image (penting jika ada perubahan di `Dockerfile`).

Tunggu prosesnya selesai. Docker akan mendownload image MySQL dan Node.js, lalu menyiapkan database dan aplikasi.

## 3. Cek Status

Untuk melihat apakah aplikasi sudah berjalan, ketik:
```bash
docker ps
```
Kamu harusnya melihat 2 container: `clover_app` dan `clover_db`.

Untuk melihat log (jika penasaran atau ada error):
```bash
docker-compose logs -f
```
(Tekan `Ctrl + C` untuk keluar dari log).

## 4. Membuka Aplikasi

Buka browser dan buka:

👉 **http://localhost:3000**

## 5. Mengakses Database

Database kamu sekarang berjalan di dalam container Docker.
Jika kamu perlu mengakses databasenya (misal pakai DBeaver atau MySQL Workbench), gunakan detail ini:

*   **Host**: localhost
*   **Port**: 3306
*   **Username**: root
*   **Password**: root
*   **Database**: clover_db

## 6. Cara Mematikan

Jika sudah selesai, matikan Docker dengan perintah:
```bash
docker-compose down
```
Ini akan mematikan dan menghapus container, tapi **data database kamu AMAN** karena tersimpan di volume docker (`db_data`).
