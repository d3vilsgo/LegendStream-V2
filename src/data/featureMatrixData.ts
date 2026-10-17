export interface FeatureItem {
  id: string;
  name: string;
  category: string;
  phase: 'MVP' | 'V1';
  platforms: string[];
  screens?: string[];
  acceptance: string[];
}

export interface FeatureMatrixDoc {
  product: string;
  version: string;
  platforms: string[];
  features: FeatureItem[];
}

export const FEATURE_MATRIX_DATA: FeatureMatrixDoc = {
  product: "LegendStream XPlayer V2",
  version: "1.0",
  platforms: ["Compact", "Medium", "Expanded", "TV"],
  features: [
    {
      id: "SRC-001",
      name: "Xtream Codes kaynağı",
      category: "Kaynaklar",
      phase: "MVP",
      platforms: ["all"],
      screens: ["SourceEditSheet", "SourceRow"],
      acceptance: [
        "Sunucu URL + kullanıcı + şifre alanları zorunlu",
        "Test Et → ping ve kanal sayısı önizlemesi döner",
        "Hatalı kimlik → 'Kimlik doğrulama hatası' mesajı"
      ]
    },
    {
      id: "SRC-002",
      name: "M3U / M3U8 kaynağı (URL + Dosya)",
      category: "Kaynaklar",
      phase: "MVP",
      platforms: ["all"],
      screens: ["SourceEditSheet", "SourceRow"],
      acceptance: [
        "URL ve Dosya seçimi sunulur",
        "Opsiyonel XMLTV EPG URL alanı",
        "Test Et → liste boyutu ve ping"
      ]
    },
    {
      id: "SRC-003",
      name: "Stalker Portal kaynağı",
      category: "Kaynaklar",
      phase: "MVP",
      platforms: ["all"],
      screens: ["SourceEditSheet", "SourceRow"],
      acceptance: [
        "Portal URL + MAC (format doğrulamalı) + Serial No zorunlu",
        "Opsiyonel Device ID",
        "Test Et → ping + kanal önizleme"
      ]
    },
    {
      id: "SRC-004",
      name: "Kaynak düzenle / sil / öncelik",
      category: "Kaynaklar",
      phase: "MVP",
      platforms: ["all"],
      screens: ["SourceRow", "Settings > Kaynaklar"],
      acceptance: [
        "Her kaynak için Düzenle, Sil, Aktif Yap",
        "Sürükle-bırak / yukarı-aşağı sıralama"
      ]
    },
    {
      id: "PROF-001",
      name: "Çoklu profil & 'Kim İzliyor?' ekranı",
      category: "Profil",
      phase: "MVP",
      platforms: ["all"],
      screens: ["WhoIsWatching", "ProfileCard"],
      acceptance: [
        "Profil kartında kaynak durum etiketi",
        "'+ Yeni Profil / İçerik Ekle' kartı en sağda",
        "Kaynaksız profil → doğrudan Kaynak Ekle"
      ]
    },
    {
      id: "PROF-002",
      name: "Profil izolasyonu",
      category: "Profil",
      phase: "MVP",
      platforms: ["all"],
      acceptance: [
        "Geçmiş, favori, indirme profiller arası ayrı",
        "Profil değişiminde aktif yayın durdurulur ve bellek temizlenir"
      ]
    },
    {
      id: "FTUE-001",
      name: "30 sn'lik 3 adımlı FTUE turu",
      category: "İlk Kullanım",
      phase: "V1",
      platforms: ["all"],
      screens: ["FtueTourModal"],
      acceptance: [
        "Her adımda 'Atla' görünür",
        "Yalnızca yeni profillere gösterilir"
      ]
    },
    {
      id: "HOME-001",
      name: "Ana ekran rafları",
      category: "Ana Ekran",
      phase: "MVP",
      platforms: ["all"],
      screens: ["Home", "HorizontalRail"],
      acceptance: [
        "Hero + 7 raf (Devam Et, TMDB Önerileri, Son Filmler, Son Diziler, Favori Kanallar, Canlı Kategorileri, Trend)",
        "Adaptif sütun: 2-3 / 4 / 6 / 7"
      ]
    },
    {
      id: "TMDB-001",
      name: "TMDB detay zenginleştirme",
      category: "TMDB",
      phase: "MVP",
      platforms: ["all"],
      screens: ["DetailScreen"],
      acceptance: [
        "Puan, tür, özet, oyuncular, benzer içerikler, fragman",
        "Free API anahtarı; kullanıcı anahtarı opsiyonel"
      ]
    },
    {
      id: "TMDB-002",
      name: "TMDB öneri motoru",
      category: "TMDB",
      phase: "V1",
      platforms: ["all"],
      acceptance: ["İzleme geçmişine göre raf şekillenir"]
    },
    {
      id: "DL-001",
      name: "Çevrimdışı indirme",
      category: "İndirme",
      phase: "MVP",
      platforms: ["all"],
      screens: ["DownloadModal", "DownloadRow", "Settings > İndirilenler"],
      acceptance: [
        "Film/dizi/bölüm bazında",
        "1080p / 720p kalite seçimi",
        "Duraklat / Devam / İptal / Yeniden Dene",
        "Kuyruk: eşzamanlı max 2",
        "Wi-Fi-only kısıtlaması",
        "Depolama çubuğu (toplam / LSX / boş)"
      ]
    },
    {
      id: "DL-002",
      name: "Depolama güvenliği",
      category: "İndirme",
      phase: "MVP",
      platforms: ["all"],
      acceptance: [
        "%95 doluluk veya <1GB → indirmeler 'Duraklatıldı'",
        "Kullanıcıya bilgi banner'ı"
      ]
    },
    {
      id: "PLAY-001",
      name: "Oynatıcı temel",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["all"],
      screens: ["Player"],
      acceptance: [
        "İlerleme, süre, Oynat/Duraklat, ±10sn",
        "Altyazı, Multi Audio, En-boy, Kanal listesi, EPG, Bilgi butonları"
      ]
    },
    {
      id: "PLAY-002",
      name: "Jest kontrolü (dokunmatik)",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["Compact", "Medium", "Expanded"],
      acceptance: [
        "Sağ dikey = ses, sol dikey = parlaklık",
        "Kenara çift dokunma = ±10sn",
        "3sn sonra kontroller gizlenir"
      ]
    },
    {
      id: "PLAY-003",
      name: "D-pad kontrolü (TV)",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["TV"],
      acceptance: [
        "Yukarı/Aşağı = zapping",
        "Sol = kanal çekmecesi, Sağ = EPG çekmecesi",
        "0-9 = doğrudan kanal (2sn timeout)",
        "Uzun Sol/Sağ = hızlı sar"
      ]
    },
    {
      id: "PLAY-004",
      name: "Zapping OSD",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["all"],
      screens: ["ZappingOSD"],
      acceptance: ["Alt 1/3 kart, 3sn fade-out, logo + şimdi + sonraki"]
    },
    {
      id: "PLAY-005",
      name: "Multi Audio & Altyazı paneli",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["all"],
      screens: ["AudioSubPanel"],
      acceptance: [
        "Sadece destekleyen yayında aktif",
        "Altyazı font boyutu + kontrast + arka plan"
      ]
    },
    {
      id: "PLAY-006",
      name: "Video Info paneli",
      category: "Oynatıcı",
      phase: "MVP",
      platforms: ["all"],
      screens: ["InfoPanel"],
      acceptance: [
        "Çözünürlük, codec, bitrate, FPS, ses codec, kanal sayısı, ses dili, buffer durumu",
        "Video arkada oynamaya devam eder"
      ]
    },
    {
      id: "PLAY-007",
      name: "Adaptif tamponlama uyarısı",
      category: "Oynatıcı",
      phase: "V1",
      platforms: ["all"],
      screens: ["BufferWarning"],
      acceptance: ["<1.5sn tamponda '720p'ye geç' önerisi"]
    },
    {
      id: "ERR-001",
      name: "Otomatik failover",
      category: "Hata Kurtarma",
      phase: "V1",
      platforms: ["all"],
      screens: ["FailoverBanner"],
      acceptance: [
        "Birincil kaynak yanıtsızsa yedek M3U'ya geçiş",
        "4sn OSD bildirim"
      ]
    },
    {
      id: "ERR-002",
      name: "Çevrimdışı EPG koruması",
      category: "Hata Kurtarma",
      phase: "V1",
      platforms: ["all"],
      acceptance: [
        "EPG kesintisinde son 7 günlük önbellek gösterilir",
        "'Çevrimdışı EPG' rozeti"
      ]
    },
    {
      id: "EPG-001",
      name: "7 günlük EPG",
      category: "EPG",
      phase: "MVP",
      platforms: ["all"],
      screens: ["EPGScreen", "RightDrawer"],
      acceptance: [
        "Zaman şeridi + kanal listesi",
        "Şimdi vurgulu / sonraki soluk",
        "Hatırlatıcı kurma",
        "Catch-up varsa 'Geriye Sar'"
      ]
    },
    {
      id: "FAV-001",
      name: "Favoriler",
      category: "Favoriler",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Kanal / Film / Dizi sekmeleri, sıralama"]
    },
    {
      id: "HIST-001",
      name: "Geçmiş",
      category: "Geçmiş",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Kronolojik liste, filtre, temizleme"]
    },
    {
      id: "SEARCH-001",
      name: "Birleşik arama",
      category: "Arama",
      phase: "MVP",
      platforms: ["all"],
      screens: ["SearchScreen"],
      acceptance: ["Tüm kaynaklarda sonuç, filtre çipleri"]
    },
    {
      id: "SEARCH-002",
      name: "Sesli arama",
      category: "Arama",
      phase: "V1",
      platforms: ["all"],
      acceptance: ["TV'de Google asistanı, mobilde mikrofon"]
    },
    {
      id: "CAST-001",
      name: "Google Cast",
      category: "Cast",
      phase: "V1",
      platforms: ["Compact", "Medium", "Expanded"],
      screens: ["CastModal"],
      acceptance: ["Cihaz tarama + tek dokunuş aktarım"]
    },
    {
      id: "SET-001",
      name: "5 dünya dili",
      category: "Ayarlar",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["TR/EN/DE/FR/ES arayüz + TMDB meta dili"]
    },
    {
      id: "SET-002",
      name: "Harici oynatıcı seçeneği",
      category: "Ayarlar",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Yerleşik / Harici (VLC, MX Player)"]
    },
    {
      id: "SET-003",
      name: "Otomatik içerik güncelleme",
      category: "Ayarlar",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Aç/kapat + sıklık seçimi"]
    },
    {
      id: "SET-004",
      name: "Ebeveyn kontrolü",
      category: "Ayarlar",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["PIN belirleme, kilitli kategoriler"]
    },
    {
      id: "A11Y-001",
      name: "TalkBack & ekran okuyucu",
      category: "Erişilebilirlik",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Tüm kart/OSD'de aria-label ve odak tanımları"]
    },
    {
      id: "A11Y-002",
      name: "Dinamik tip ölçeği",
      category: "Erişilebilirlik",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["%112–%150 font boyutunda layout kırılmaz"]
    },
    {
      id: "A11Y-003",
      name: "Azaltılmış hareket",
      category: "Erişilebilirlik",
      phase: "MVP",
      platforms: ["all"],
      acceptance: ["Animasyon ve ölçekleme kapatılabilir"]
    },
    {
      id: "A11Y-004",
      name: "Renk körü paletleri",
      category: "Erişilebilirlik",
      phase: "V1",
      platforms: ["all"],
      acceptance: ["Protanopia, Deuteranopia, 4.5:1 yüksek kontrast"]
    },
    {
      id: "SIM-001",
      name: "Adaptive simülatör",
      category: "Prototip",
      phase: "MVP",
      platforms: ["design-tool"],
      acceptance: ["Auto / Compact / Medium / Expanded / TV butonları"]
    },
    {
      id: "SIM-002",
      name: "12 bölümlük şartname inceleyici",
      category: "Prototip",
      phase: "V1",
      platforms: ["design-tool"],
      acceptance: ["Geliştirici modunda 's' kısayoluyla açılır, son kullanıcıya gösterilmez"]
    }
  ]
};
