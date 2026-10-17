# LegendStream XPlayer V2 — Tam Teslim Paketi

Sırayla üç ana bölüm: **A) Figma Handoff** → **B) JSON Feature Matrix** → **C) Beta Test Planı**.

---

## A) FIGMA HANDOFF PAKETİ

### A.1 Renk Tokenları

| Token | Hex | Kullanım |
| :--- | :--- | :--- |
| `bg/base` | `#0A0A0C` | Ana arka plan (saf siyah değil, hafif sıcak) |
| `bg/surface` | `#16161A` | Kart, panel, raf zeminleri |
| `bg/elevated` | `#1F1F24` | Modal, çekmece, OSD kartı |
| `bg/overlay` | `rgba(0,0,0,0.65)` | Video üstü katman |
| `text/primary` | `#EDEDED` | Başlık, gövde, birincil metin |
| `text/secondary` | `#9A9AA0` | İkincil metin, meta bilgisi |
| `text/disabled` | `#5A5A62` | Pasif buton, devre dışı elemanlar |
| `accent/default` | `#E0A94A` / `#10B981` | Vurgu (varsayılan amber veya zümrüt yeşili; değiştirilebilir) |
| `accent/alt` | `#5FB6E8` | Alternatif vurgu (buz mavisi) |
| `state/success` | `#3FBF7F` | Yeşil nokta, başarı durumu |
| `state/warning` | `#E0A94A` | Sarı nokta, uyarı durumu |
| `state/error` | `#E05353` | Kırmızı nokta, hata durumu |
| `focus/ring` | `accent/default 1px` | D-pad focus çerçevesi (1.06x scale) |
| `divider` | `#26262C` | İnce ayrım çizgisi |

> **Renk Körü Paletleri**: Protanopia / Deuteranopia / Yüksek Kontrast (4.5:1 minimum) — vurgu ve durum renkleri otomatik olarak semantik ikon ve kalınlaşan çizgilerle desteklenir.

---

### A.2 Tipografi Tokenları

| Token | Compact (<600dp) | Medium (600–839dp) | Expanded (840–1279dp) | TV (≥1280dp 10-Foot) |
| :--- | :--- | :--- | :--- | :--- |
| `display/hero` | 28sp | 32sp | 36sp | **44sp** |
| `title/page` | 22sp | 26sp | 30sp | **42sp** |
| `title/section` | 18sp | 20sp | 22sp | **28sp** |
| `body/primary` | 16sp | 16sp | 18sp | **22sp** |
| `body/secondary` | 14sp | 14sp | 16sp | **20sp** |
| `caption` | 12sp | 12sp | 13sp | **16sp** |
| `label/button` | 14sp | 14sp | 16sp | **20sp** |

- **Font Ailesi**: Plus Jakarta Sans / Inter / SF Pro.
- **Ağırlıklar**: 300 (display/hero), 400 (body), 500 (label), 600 (button/bold).

---

### A.3 Boşluk & Yarıçap

| Token | Değer |
| :--- | :--- |
| `space/xs` | 4px |
| `space/sm` | 8px |
| `space/md` | 16px |
| `space/lg` | 24px |
| `space/xl` | 32px |
| `space/2xl` | 48px |
| `radius/card` | 14px |
| `radius/button` | 8px |
| `radius/modal` | 20px |

---

### A.4 Animasyon Tokenları

| Token | Süre | Easing |
| :--- | :--- | :--- |
| `motion/fast` | 150ms | ease-out |
| `motion/base` | 200ms | ease-out |
| `motion/slow` | 240ms | ease-out |
| `motion/focus` | 180ms | cubic-bezier(.2, .8, .2, 1) |
| `motion/fade` | 200ms | linear |
| `Reduce-motion` | 0ms | — (Erişilebilirlik ayarında tüm hareketler kapatılır) |

---

### A.5 Bileşen Kütüphanesi

#### B1. Kartlar
- **PosterCard**: 2:3 afiş + başlık + rozet (indirme, 4K, yeni) + focus büyüme 1.0 → 1.06x.
- **ChannelCard**: 16:9 kart, logo + numara + kanal adı + şimdi oynayan + ilerleme barı + sonraki.
- **HeroBanner**: 1/3 ekran sinematik afiş + başlık + tür + süre + IMDb/TMDB puanı + Oynat butonu.
- **ProfileCard**: Avatar + profil ismi + durum noktası (● 3 kaynak bağlı / ○ Kaynak eklenmemiş) + "+ Yeni Profil" kısayolu.
- **SourceRow**: Sağlayıcı türü ikonu + isim + durum noktası + gecikme (ms) + "Aktif" rozeti + test/düzenle/sil aksiyonları.
- **DownloadRow**: Afiş + başlık + kalite + duraklat/iptal/yeniden dene + ilerleme barı + dosya boyutu.
- **HistoryRow**: Küçük resim + başlık + tür rozeti + izlenme zamanı + ilerleme yüzdesi.

#### B2. Raflar & Listeler
- **HorizontalRail**: Başlık + "Tümünü Gör" butonu + yatay kaydırılabilir kart listesi.
- **FilterChips**: Tür / yıl / kaynak / izlenmedi / sıralama çipleri.
- **CategoryList**: Dikey kategori sütunu (ikon + kategori adı + kanal sayısı).

#### B3. Navigasyon
- **BottomBar (Compact)**: 5 ana sekme, tek elle başparmak erişiminde.
- **NavRail (Medium/Expanded)**: Dikey ikon şeridi; Expanded'da genişleyen.
- **LeftRay (TV)**: 72px → 230px genişleyen TV rayı; en üstte "LSX V2" monogramı.
- **TopBar**: Arama çubuğu + sesli arama mikrofonu + aktif kullanıcı avatarı + kaynak durumu (gecikme) + Google Cast butonu + saat.

#### B4. Oynatıcı Bileşenleri
- **ControlBar**: İlerleme çubuğu + süre + Oynat/Duraklat + ±10sn sarma + Altyazı + Multi Audio + En-boy + Kanal çekmecesi + EPG + Bilgi.
- **ZappingOSD**: Alt 1/3 kart: Logo + numara + ad + şimdi + ilerleme + sonraki + saat (3 saniyede yumuşak sönümleme).
- **LeftDrawer**: Kategori + kanal listesi (soldan video üstüne süzülür).
- **RightDrawer**: EPG yayın akışı paneli (sağdan süzülür, video hafif küçülür/arkada kalır).
- **InfoPanel**: Çözünürlük, video codec, audio codec, bitrate, FPS, ses dili, tampon durumu (optimal/warning/critical).
- **AudioSubPanel**: Çoklu ses parçası listesi + altyazı dili + font boyutu + kontrast/arka plan rengi.
- **ChannelNumberInput**: 0–9 rakam girişi, 2 sn zaman aşımı, ekranın alt-ortasında zarif kutu.
- **BufferWarning**: 1.5 sn altı tamponda "720p'ye geç" adaptif akış önerisi.

#### B5. Modal & Overlay
- **CastModal**: Yakındaki Google Cast/Android TV cihazlarını tarama + tek dokunuş aktarımı.
- **TrailerModal**: Fragman video oynatıcı penceresi.
- **DownloadModal**: Kalite seçimi (1080p FHD / 720p HD) + başlatma.
- **FtueTourModal**: 3 adım / 30 sn hızlı tur, her adımda "Turu Atla" seçeneği.
- **FailoverBanner**: 4 sn OSD: *"Birincil kaynak yanıt vermedi; Ulusal Yedek akışına kesintisiz geçildi."*
- **ConfirmDialog**: Silme / önbellek temizleme onayları.
- **SourceEditSheet**: Xtream Codes / M3U / Stalker Portal ekleme ve düzenleme formu.

#### B6. Durum Bileşenleri
- **SkeletonCard / SkeletonRow**: Yükleme anında akıcı gri dalga iskeleti.
- **EmptyState**: İkon + kısa mesaj + yönlendirici tek buton.
- **ErrorState**: *"Yeniden dene / Farklı kaynak dene / Ayarları aç"*.
- **StatusDot**: Yeşil (aktif), Sarı (yüksek gecikme), Kırmızı (bağlantı hatası) durum noktası.

---

### A.6 20 Kritik Frame (4 Sınıf × 5 Ekran)

| # | Ekran | Compact (<600dp) | Medium (600–839dp) | Expanded (840–1279dp) | TV (≥1280dp 10-Foot) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Kim İzliyor?** | Alt bar + tek sütun kartlar | Rail + 2 sütun avatar | Rail + 3 sütun avatar | Sol ray + yatay avatarlar + PIN |
| **2** | **Kaynak Ekle** | Tam ekran form | Form + önizleme | 2 panel form | Tam ekran form + canlı test paneli |
| **3** | **Ana Ekran** | Hero banner + 2 sütun raf | Hero + 4 sütun raf | Hero + 6 sütun raf | Hero banner + 7 sütun geniş raf |
| **4** | **Oynatıcı (Canlı)** | Jestler + PiP + Cast butonu | Dokunmatik jestler + PiP | Dokunma + çekmeceler | D-pad + çekmeceler + zapping OSD |
| **5** | **EPG** | Yatay gün şeridi + dikey liste | 2 panel görünüm | 2 panel geniş cetvel | 7 günlük zaman cetveli + kanal sütunu |

---

### A.7 Etkileşim Matrisi

| Aksiyon | Compact (Mobil) | Medium / Expanded | TV (10-Foot Kumanda) |
| :--- | :--- | :--- | :--- |
| **Seçim** | Dokunma | Dokunma / Fare tıklama | **OK / Enter** |
| **Geri** | Sistem geri jesti | Sistem geri / Esc | **Geri tuşu / Backspace** |
| **Ses / Parlaklık** | Sağ/Sol kenar dikey kaydırma | Dikey kaydırma | **Kumanda ses tuşları** |
| **±10 sn Sarma** | Kenara çift dokunma | Çift dokunma | **Sol / Sağ (← / →) yön tuşları** |
| **Kanal Değiştir (Zapping)** | Kanal listesinden dokunma | Kanal listesi | **Yukarı / Aşağı (↑ / ↓) tuşları** |
| **EPG Paneli** | Sağdan sola kaydırma | Sağdan kaydırma | **Sağ (→) yön tuşu** |
| **Kanal Çekmecesi** | Sol kenardan kaydırma | Sol kenardan kaydırma | **Sol (←) yön tuşu** |
| **Info Paneli** | Uzun basış veya 'i' butonu | 'i' butonu | **'i' tuşu** |
| **Altyazı & Ses Paneli** | Oynatıcı butonundan | Buton | **'c' / 's' tuşu** |
| **Kanal Numarası** | Sanal tuş takımı | Sanal tuş takımı | **0–9 rakam tuşları (2 sn zaman aşımı)** |
| **PiP Modu** | Sistem PiP | Sistem PiP | **Uygulama içi mini canlı önizleme** |
| **Google Cast** | Topbar Cast butonu | Topbar Cast butonu | — (Zaten TV üzerinde) |
| **Sesli Arama** | Mikrofon ikonu | Mikrofon ikonu | **Google TV Asistan mikrofon tuşu** |

---

## B) JSON FEATURE MATRIX

```json
{
  "product": "LegendStream XPlayer V2",
  "version": "1.0",
  "platforms": ["Compact", "Medium", "Expanded", "TV"],
  "features": [
    {
      "id": "SRC-001",
      "name": "Xtream Codes kaynağı",
      "category": "Kaynaklar",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["SourceEditSheet", "SourceRow"],
      "acceptance": [
        "Sunucu URL + kullanıcı + şifre alanları zorunlu",
        "Test Et → ping ve kanal sayısı önizlemesi döner",
        "Hatalı kimlik → 'Kimlik doğrulama hatası' mesajı"
      ]
    },
    {
      "id": "SRC-002",
      "name": "M3U / M3U8 kaynağı (URL + Dosya)",
      "category": "Kaynaklar",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["SourceEditSheet", "SourceRow"],
      "acceptance": [
        "URL ve Dosya seçimi sunulur",
        "Opsiyonel XMLTV EPG URL alanı",
        "Test Et → liste boyutu ve ping"
      ]
    },
    {
      "id": "SRC-003",
      "name": "Stalker Portal kaynağı",
      "category": "Kaynaklar",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["SourceEditSheet", "SourceRow"],
      "acceptance": [
        "Portal URL + MAC (format doğrulamalı) + Serial No zorunlu",
        "Opsiyonel Device ID",
        "Test Et → ping + kanal önizleme"
      ]
    },
    {
      "id": "SRC-004",
      "name": "Kaynak düzenle / sil / öncelik",
      "category": "Kaynaklar",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["SourceRow", "Settings > Kaynaklar"],
      "acceptance": [
        "Her kaynak için Düzenle, Sil, Aktif Yap",
        "Sürükle-bırak / yukarı-aşağı sıralama"
      ]
    },
    {
      "id": "PROF-001",
      "name": "Çoklu profil & 'Kim İzliyor?' ekranı",
      "category": "Profil",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["WhoIsWatching", "ProfileCard"],
      "acceptance": [
        "Profil kartında kaynak durum etiketi",
        "'+ Yeni Profil / İçerik Ekle' kartı en sağda",
        "Kaynaksız profil → doğrudan Kaynak Ekle"
      ]
    },
    {
      "id": "PROF-002",
      "name": "Profil izolasyonu",
      "category": "Profil",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": [
        "Geçmiş, favori, indirme profiller arası ayrı",
        "Profil değişiminde aktif yayın durdurulur ve bellek temizlenir"
      ]
    },
    {
      "id": "FTUE-001",
      "name": "30 sn'lik 3 adımlı FTUE turu",
      "category": "İlk Kullanım",
      "phase": "V1",
      "platforms": ["all"],
      "screens": ["FtueTourModal"],
      "acceptance": [
        "Her adımda 'Atla' görünür",
        "Yalnızca yeni profillere gösterilir"
      ]
    },
    {
      "id": "HOME-001",
      "name": "Ana ekran rafları",
      "category": "Ana Ekran",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["Home", "HorizontalRail"],
      "acceptance": [
        "Hero + 7 raf (Devam Et, TMDB Önerileri, Son Filmler, Son Diziler, Favori Kanallar, Canlı Kategorileri, Trend)",
        "Adaptif sütun: 2-3 / 4 / 6 / 7"
      ]
    },
    {
      "id": "TMDB-001",
      "name": "TMDB detay zenginleştirme",
      "category": "TMDB",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["DetailScreen"],
      "acceptance": [
        "Puan, tür, özet, oyuncular, benzer içerikler, fragman",
        "Free API anahtarı; kullanıcı anahtarı opsiyonel"
      ]
    },
    {
      "id": "TMDB-002",
      "name": "TMDB öneri motoru",
      "category": "TMDB",
      "phase": "V1",
      "platforms": ["all"],
      "acceptance": ["İzleme geçmişine göre raf şekillenir"]
    },
    {
      "id": "DL-001",
      "name": "Çevrimdışı indirme",
      "category": "İndirme",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["DownloadModal", "DownloadRow", "Settings > İndirilenler"],
      "acceptance": [
        "Film/dizi/bölüm bazında",
        "1080p / 720p kalite seçimi",
        "Duraklat / Devam / İptal / Yeniden Dene",
        "Kuyruk: eşzamanlı max 2",
        "Wi-Fi-only kısıtlaması",
        "Depolama çubuğu (toplam / LSX / boş)"
      ]
    },
    {
      "id": "DL-002",
      "name": "Depolama güvenliği",
      "category": "İndirme",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": [
        "%95 doluluk veya <1GB → indirmeler 'Duraklatıldı'",
        "Kullanıcıya bilgi banner'ı"
      ]
    },
    {
      "id": "PLAY-001",
      "name": "Oynatıcı temel",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["Player"],
      "acceptance": [
        "İlerleme, süre, Oynat/Duraklat, ±10sn",
        "Altyazı, Multi Audio, En-boy, Kanal listesi, EPG, Bilgi butonları"
      ]
    },
    {
      "id": "PLAY-002",
      "name": "Jest kontrolü (dokunmatik)",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["Compact", "Medium", "Expanded"],
      "acceptance": [
        "Sağ dikey = ses, sol dikey = parlaklık",
        "Kenara çift dokunma = ±10sn",
        "3sn sonra kontroller gizlenir"
      ]
    },
    {
      "id": "PLAY-003",
      "name": "D-pad kontrolü (TV)",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["TV"],
      "acceptance": [
        "Yukarı/Aşağı = zapping",
        "Sol = kanal çekmecesi, Sağ = EPG çekmecesi",
        "0-9 = doğrudan kanal (2sn timeout)",
        "Uzun Sol/Sağ = hızlı sar"
      ]
    },
    {
      "id": "PLAY-004",
      "name": "Zapping OSD",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["ZappingOSD"],
      "acceptance": ["Alt 1/3 kart, 3sn fade-out, logo + şimdi + sonraki"]
    },
    {
      "id": "PLAY-005",
      "name": "Multi Audio & Altyazı paneli",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["AudioSubPanel"],
      "acceptance": [
        "Sadece destekleyen yayında aktif",
        "Altyazı font boyutu + kontrast + arka plan"
      ]
    },
    {
      "id": "PLAY-006",
      "name": "Video Info paneli",
      "category": "Oynatıcı",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["InfoPanel"],
      "acceptance": [
        "Çözünürlük, codec, bitrate, FPS, ses codec, kanal sayısı, ses dili, buffer durumu",
        "Video arkada oynamaya devam eder"
      ]
    },
    {
      "id": "PLAY-007",
      "name": "Adaptif tamponlama uyarısı",
      "category": "Oynatıcı",
      "phase": "V1",
      "platforms": ["all"],
      "screens": ["BufferWarning"],
      "acceptance": ["<1.5sn tamponda '720p'ye geç' önerisi"]
    },
    {
      "id": "ERR-001",
      "name": "Otomatik failover",
      "category": "Hata Kurtarma",
      "phase": "V1",
      "platforms": ["all"],
      "screens": ["FailoverBanner"],
      "acceptance": [
        "Birincil kaynak yanıtsızsa yedek M3U'ya geçiş",
        "4sn OSD bildirim"
      ]
    },
    {
      "id": "ERR-002",
      "name": "Çevrimdışı EPG koruması",
      "category": "Hata Kurtarma",
      "phase": "V1",
      "platforms": ["all"],
      "acceptance": [
        "EPG kesintisinde son 7 günlük önbellek gösterilir",
        "'Çevrimdışı EPG' rozeti"
      ]
    },
    {
      "id": "EPG-001",
      "name": "7 günlük EPG",
      "category": "EPG",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["EPGScreen", "RightDrawer"],
      "acceptance": [
        "Zaman şeridi + kanal listesi",
        "Şimdi vurgulu / sonraki soluk",
        "Hatırlatıcı kurma",
        "Catch-up varsa 'Geriye Sar'"
      ]
    },
    {
      "id": "FAV-001",
      "name": "Favoriler",
      "category": "Favoriler",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Kanal / Film / Dizi sekmeleri, sıralama"]
    },
    {
      "id": "HIST-001",
      "name": "Geçmiş",
      "category": "Geçmiş",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Kronolojik liste, filtre, temizleme"]
    },
    {
      "id": "SEARCH-001",
      "name": "Birleşik arama",
      "category": "Arama",
      "phase": "MVP",
      "platforms": ["all"],
      "screens": ["SearchScreen"],
      "acceptance": ["Tüm kaynaklarda sonuç, filtre çipleri"]
    },
    {
      "id": "SEARCH-002",
      "name": "Sesli arama",
      "category": "Arama",
      "phase": "V1",
      "platforms": ["all"],
      "acceptance": ["TV'de Google asistanı, mobilde mikrofon"]
    },
    {
      "id": "CAST-001",
      "name": "Google Cast",
      "category": "Cast",
      "phase": "V1",
      "platforms": ["Compact", "Medium", "Expanded"],
      "screens": ["CastModal"],
      "acceptance": ["Cihaz tarama + tek dokunuş aktarım"]
    },
    {
      "id": "SET-001",
      "name": "5 dünya dili",
      "category": "Ayarlar",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["TR/EN/DE/FR/ES arayüz + TMDB meta dili"]
    },
    {
      "id": "SET-002",
      "name": "Harici oynatıcı seçeneği",
      "category": "Ayarlar",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Yerleşik / Harici (VLC, MX Player)"]
    },
    {
      "id": "SET-003",
      "name": "Otomatik içerik güncelleme",
      "category": "Ayarlar",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Aç/kapat + sıklık seçimi"]
    },
    {
      "id": "SET-004",
      "name": "Ebeveyn kontrolü",
      "category": "Ayarlar",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["PIN belirleme, kilitli kategoriler"]
    },
    {
      "id": "A11Y-001",
      "name": "TalkBack & ekran okuyucu",
      "category": "Erişilebilirlik",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Tüm kart/OSD'de aria-label ve odak tanımları"]
    },
    {
      "id": "A11Y-002",
      "name": "Dinamik tip ölçeği",
      "category": "Erişilebilirlik",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["%112–%150 font boyutunda layout kırılmaz"]
    },
    {
      "id": "A11Y-003",
      "name": "Azaltılmış hareket",
      "category": "Erişilebilirlik",
      "phase": "MVP",
      "platforms": ["all"],
      "acceptance": ["Animasyon ve ölçekleme kapatılabilir"]
    },
    {
      "id": "A11Y-004",
      "name": "Renk körü paletleri",
      "category": "Erişilebilirlik",
      "phase": "V1",
      "platforms": ["all"],
      "acceptance": ["Protanopia, Deuteranopia, 4.5:1 yüksek kontrast"]
    },
    {
      "id": "SIM-001",
      "name": "Adaptive simülatör",
      "category": "Prototip",
      "phase": "MVP",
      "platforms": ["design-tool"],
      "acceptance": ["Auto / Compact / Medium / Expanded / TV butonları"]
    },
    {
      "id": "SIM-002",
      "name": "12 bölümlük şartname inceleyici",
      "category": "Prototip",
      "phase": "V1",
      "platforms": ["design-tool"],
      "acceptance": ["Geliştirici modunda 's' kısayoluyla açılır, son kullanıcıya gösterilmez"]
    }
  ]
}
```

---

## C) BETA TEST PLANI

### C.1 Hedefler & Başarı Kriterleri

| Metrik | Hedef Değer | Açıklama |
| :--- | :--- | :--- |
| **İlk yayına ulaşma süresi** | `< 60 sn` (median) | Uygulama açılışından ilk kanalın başlamasına kadar |
| **Kaynak ekleme başarı oranı** | `%90` | İlk denemede sorunsuz doğrulama |
| **Failover geçiş süresi** | `< 4 sn` | Çöken birincil kaynaktan yedek M3U'ya geçiş |
| **Çökme oranı (crash-free)** | `≥ %99.5` | Oturum bazlı stabilite |
| **Kanal zapping süresi** | `< 1.5 sn` | Kanal değiştirme anında video başlama süresi |
| **FTUE tamamlama** | `%70` | Turu atlamadan adımları bitiren yeni kullanıcılar |
| **TalkBack görev tamamlama** | `5 / 5` | Görme engelli senaryolarının tamamlanması |
| **SUS Memnuniyet puanı** | `> 80` | System Usability Scale skoru |

---

### C.2 Katılımcı Profili (Toplam 12 Kişi)

- **Cihaz Dağılımı**:
  - 5 Android / Google TV (Chromecast, Shield, Xiaomi Stick)
  - 4 Mobil (Android 13 / 14, 4G + Wi-Fi)
  - 2 Tablet (Samsung Galaxy Tab S6 Lite)
  - 1 Chromebook (Lenovo Duet)
- **Segment Dağılımı**:
  - 4 "IPTV Deneyimli" (Xtream Codes / M3U mimarisini iyi bilen kullanıcılar)
  - 4 "IPTV Yeni" (Daha önce hiç IPTV oynatıcı kullanmamış geleneksel TV izleyicileri)
  - 4 "Erişilebilirlik" (TalkBack ekran okuyucu kullananlar veya düşük görüşlüler)
- **Test Süresi**: 2 hafta aktif test + 2 hafta analiz ve düzeltme (toplam 4 hafta).

---

### C.3 10 Test Senaryosu

1. **Senaryo 1 — İlk Kurulum (Tüm Platformlar)**:
   - Uygulamayı ilk kez aç → Dil & Tema seç → "Kim İzliyor?" → "+ Yeni Profil" oluştur → Kaynak Ekle (Xtream) → Test Et → Kaydet → İlk kanalı oynat (Hedef: `<60 sn`, `4 adım`).
2. **Senaryo 2 — Kaynak Çeşitliliği & Yönetimi**:
   - M3U URL, M3U Dosya, Stalker Portal ekleme. Hatalı şifre girildiğinde hata mesajının doğrulanması. Kaynak listesinde yukarı/aşağı öncelik sıralaması ve silme.
3. **Senaryo 3 — Canlı TV & EPG Etkileşimi**:
   - Kanal listesinden kanal seçimi. TV kumandasında Yukarı/Aşağı zapping ve OSD kontrolü. TV Sağ tuşuyla transparan EPG çekmecesi açma. Hatırlatıcı kurma ve 0–9 rakam tuşlaması.
4. **Senaryo 4 — VOD & TMDB Kataloğu**:
   - Film detayını açma, TMDB puanı, yönetmen, zengin oyuncu kadrosu ve fragman penceresini test etme. Favorilere ekleme.
5. **Senaryo 5 — İndirme & Depolama Yönetimi**:
   - 1080p indirme başlatma. 3. indirmede otomatik kuyruğa alma. Cihaz hafızası %95 dolduğunda indirmelerin otomatik duraklatılması. Wi-Fi kapatıldığında Wi-Fi-only kısıtlamasının devreye girmesi. İndirilen içeriği internetsiz oynatma.
6. **Senaryo 6 — Otomatik Failover**:
   - Xtream kaynağı simüle edilerek kesilir. 4 saniye içinde otomatik olarak Ulusal Yedek M3U akışına geçiş ve OSD bildirimi doğrulanır.
7. **Senaryo 7 — Profil İzolasyonu**:
   - Profil A'da 3 dakika film izlenir. Profil B'ye geçilir. Profil B'de "Kaldığın Yerden Devam Et" rafının temiz kaldığı doğrulanır. Profil A'ya dönüldüğünde kaldığı dakikadan devam ettiği test edilir.
8. **Senaryo 8 — Erişilebilirlik**:
   - TalkBack açıkken kaynak ekleme formu tamamlanır. Sistem font boyutu %150'ye çıkarıldığında metinlerin taşmadığı doğrulanır. Reduce-motion ile animasyonların durduğu, renk körü paletlerinin çalıştığı doğrulanır.
9. **Senaryo 9 — FTUE (İlk Kullanıcı Deneyimi)**:
   - Yeni profilde 30 saniyelik 3 adımlı turun açıldığı, her adımda "Turu Atla" seçeneğinin çalıştığı doğrulanır.
10. **Senaryo 10 — Google Cast & Sesli Arama**:
    - Mobil ve webde yayın açılır → Cast ikonuyla TV'ye aktarılır. TV arama çubuğundaki mikrofonla ses tanıma dalgası ve filtreleme test edilir.

---

### C.4 Test Ortamı Matrisi

| Platform Sınıfı | Test Cihazı | İşletim Sistemi | Ağ Ortamı |
| :--- | :--- | :--- | :--- |
| **TV** | Chromecast with Google TV | Android TV 12 | Wi-Fi 5GHz |
| **TV** | Nvidia Shield TV Pro | Android TV 11 | Ethernet (Gigabit) |
| **TV** | Xiaomi TV Stick 4K | Android TV 11 | Wi-Fi 2.4GHz |
| **Mobil** | Google Pixel 6a | Android 14 | 4G LTE + Wi-Fi |
| **Mobil** | Samsung Galaxy A54 | Android 13 | Wi-Fi |
| **Tablet** | Samsung Galaxy Tab S6 Lite | Android 13 | Wi-Fi |
| **Chromebook** | Lenovo IdeaPad Duet | ChromeOS 120 | Wi-Fi |

---

### C.5 Takip, Telemetri & Hata Severity

- **Kullanılabilirlik Skoru (SUS)**: Hedef puan `> 80 / 100`.
- **Hata Sınıflandırması (Severity)**:
  - **P0 (Kritik)**: Video oynatılamıyor, kaynak eklenemiyor, uygulama çöküyor → *24 saat içinde düzeltme zorunlu*.
  - **P1 (Yüksek)**: Bir ekran veya çekmece açılmıyor, veri kaybı riski var → *1 hafta içinde düzeltme*.
  - **P2 (Orta / Kozmetik)**: Ufak görsel hizalama hataları, nadir edge-case'ler → *2 hafta içinde düzeltme*.

---

### C.6 Çıkış Kriterleri (Exit Criteria)

Aşağıdaki maddelerin tümü eksiksiz sağlanmadan Beta aşaması kapatılamaz:

- [x] Crash-free oturum oranı > %99.5 (son 7 gün)
- [x] Ortalama ilk yayına ulaşma süresi < 60 sn
- [x] Failover ortalama geçiş süresi < 4 sn
- [x] TalkBack senaryoları 5 / 5 başarıyla geçti
- [x] Açık P0 ve P1 seviyesinde hata sayısı = 0
- [x] SUS memnuniyet puanı > 80
- [x] 4 platform sınıfında (Compact, Medium, Expanded, TV) görsel tutarlılık doğrulandı
- [x] 5 dilde (TR, EN, DE, FR, ES) string taşması yok (özellikle Almanca metin uzunluğu korundu)
- [x] FTUE tamamlama oranı > %70

---

### C.7 4 Haftalık Beta Takvimi

| Hafta | Aktivite ve Çıktılar |
| :--- | :--- |
| **Hafta 1** | Katılımcı seçimi + test ortamı kurulumu + 2 pilot kullanıcı oturumu |
| **Hafta 2** | Tam test (12 kullanıcı) + günlük hata triage oturumu (Sheets/Jira) |
| **Hafta 3** | P0 ve P1 seviye hata düzeltmeleri + re-test + SUS kullanılabilirlik analizi |
| **Hafta 4** | Final doğrulama + regresyon testleri + Release notu yayını |
