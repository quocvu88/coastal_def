# Build APK – Lá Chắn Bờ Biển

App Android bọc game HTML (`../la-chan-bo-bien.html`) trong WebView, chạy offline, toàn màn hình, khoá dọc.

## Build lại sau khi sửa game

1. Chép game vào assets và nhúng font offline (cần mạng lần này để tải font):

   ```bash
   node tools/build-assets.mjs ../la-chan-bo-bien.html
   ```

2. Build APK (dùng Java đi kèm Android Studio và Gradle 9.3.1 có sẵn trong `~/.gradle`):

   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
   & "$env:USERPROFILE\.gradle\wrapper\dists\gradle-9.3.1-all\9ot9r568e8zfvvd4mn8rbu1j0\gradle-9.3.1\bin\gradle.bat" assembleRelease
   ```

   Kết quả: `app/build/outputs/apk/release/app-release.apk`.

Tăng `versionCode` / `versionName` trong `app/build.gradle.kts` mỗi lần phát hành bản mới.

## Ghi chú

- Bản này ký bằng khoá debug của máy build, chỉ để cài thử. Đưa lên Google Play cần tạo keystore riêng và build AAB (`bundleRelease`).
- `local.properties` trỏ tới Android SDK trên máy này, không đưa vào Git.
- Nút Back của Android gọi `window.__androidBack()` trong game: đang chơi thì tạm dừng, ở hải đồ/kho thì về menu, ở menu thì thoát app.
- Tiến trình lưu trong localStorage của WebView; gỡ app hoặc xoá dữ liệu app sẽ mất tiến trình.
