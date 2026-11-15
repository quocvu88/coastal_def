plugins {
    id("com.android.application")
}

android {
    namespace = "vn.lachanbobien.game"
    compileSdk = 36

    defaultConfig {
        applicationId = "vn.lachanbobien.game"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Test build: signed with the local debug key so it installs directly on a phone.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
