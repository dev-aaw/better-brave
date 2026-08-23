// Better Brave: Freeform Canvas & Smart Magnetic Snapping Dashboard Controller

// --- 1. INDEXEDDB DUVAR KAĞIDI YÖNETİMİ ---
function openWallpaperDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('BetterBraveWallpapersDB', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('wallpapers')) {
        db.createObjectStore('wallpapers');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveWallpaperToIDB(fileBlob) {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('wallpapers', 'readwrite');
      const store = tx.objectStore('wallpapers');
      store.put(fileBlob, 'custom_bg');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('IndexedDB Save Error:', err);
    return false;
  }
}

async function getWallpaperFromIDB() {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve) => {
      const tx = db.transaction('wallpapers', 'readonly');
      const store = tx.objectStore('wallpapers');
      const req = store.get('custom_bg');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

async function clearWallpaperFromIDB() {
  try {
    const db = await openWallpaperDB();
    const tx = db.transaction('wallpapers', 'readwrite');
    tx.objectStore('wallpapers').delete('custom_bg');
  } catch (err) {}
}

// --- 2. ÇOKLU DİL (i18n) TANIMLARI ---
const translations = {
  tr: {
    newTab: "Yeni Sekme",
    editBtn: "Düzenle",
    saveBtn: "Kaydet",
    addWidget: "Widget Ekle",
    controlCenter: "Kontrol Merkezi",
    tabGeneral: "Genel Özellikler",
    tabAudio: "Ses & Müzik",
    tabWorld: "Dünya Saatleri & Hava",
    tabAppearance: "Görünüm & Tuval",
    tabShortcuts: "Sabitlenmiş Sekmeler",
    tabPrivacy: "Sistem & Bellek",
    widgetClock: "Saat ve Tarih",
    widgetSearch: "Arama Çubuğu",
    widgetShortcuts: "Sabitlenmiş Sekmeler",
    widgetWeather: "Dünya Saatleri & Hava Durumu",
    widgetTodo: "Yapılacaklar & Notlar",
    widgetSystem: "Sistem Monitörü",
    cleanRamQuick: "Temizle",
    ramCleanedToast: "⚡ RAM Boşaltıldı! Arka plan sekmeleri donduruldu.",
    duplicatesClosedToast: "🧹 Çift açık sekmeler kapatıldı!",
    ramUsage: "RAM",
    cpuUsage: "CPU Yükü",
    digital: "Dijital",
    analog: "Analog",
    bgTheme: "Arka Plan Teması",
    clockType: "Saat Türü",
    addShortcutTitle: "Yeni Kısayol Ekle",
    titleLabel: "Başlık",
    urlLabel: "Web Adresi (URL)",
    save: "Kaydet",
    add: "Ekle",
    searchBtn: "Ara",
    addCityTitle: "Şehir Ekle (Saat & Hava Durumu)",
    addCityDesc: "Dilediğiniz şehri ekleyin; yerel saat ve hava durumu otomatik hesaplanacaktır.",
    addCityBtn: "➕ Şehir Ekle",
    activeCities: "Aktif Şehirler",
    newShortcut: "Yeni Sekme Ekle",
    shortcutsList: "Sabitlenmiş Sekmeler Listesi",
    selectImageBtn: "📁 Resim Seç (Maks. 10MB)",
    removeCustomBgBtn: "Özel Resmi Kaldır",
    quickActionsTitle: "Hızlı Sistem & Bellek Eylemleri",
    closeDuplicatesBtn: "Çift Açık Sekmeleri Kapat",
    freeMemoryBtn: "RAM'i Boşalt (Sekmeleri Uyut)",
    systemStatsTitle: "Sistem Kaynak Kullanımı",
    blockedTrackers: "Bugün Engellenen İzleyiciler",
    tabSnoozerTitle: "💤 AKILLI RAM TASARRUF MODU (TAB SNOOZER)",
    tabSnoozerDesc: "Arka planda belirli süre kullanılmayan sekmeleri otomatik uyutarak RAM'i %60'a kadar boşaltır.",
    musicIndicatorTitle: "🎵 MÜZİK ÇALMA GÖSTERGESİ",
    musicIndicatorDesc: "Müzik/ses çalan sekmelerin başlığında animasyonlu müzik notası gösterir.",
    pdfNotesTitle: "📑 PDF & SAYFA NOT ALMA",
    pdfNotesDesc: "PDF veya sayfalarda metin seçtiğinizde highlight araç çubuğu gösterir.",
    autoPipTitle: "📺 OTOMATİK PİP (YÜZEN VİDEO)",
    autoPipDesc: "Video oynarken başka sekmeye geçince videoyu otomatik küçük yüzen pencereye alır.",
    linkGlowTitle: "⚡ AÇIK LİNK TESPİTİ",
    linkGlowDesc: "Başka sekmede açık olan linklerin üzerine gelince sade sekme rozeti gösterir.",
    ramCpuTitle: "⚡ RAM & CPU ARAÇ ÇUBUĞU ROZETİ",
    ramCpuDesc: "Eklenti simgesi üzerinde anlık RAM ve CPU kullanımını gösterir.",
    smartGroupingTitle: "🏷️ AKILLI SEKME GRUPLAMA",
    smartGroupingDesc: "Aynı siteden açılan sekmeleri otomatik olarak renklendirip gruplandırır.",
    tabSearchTitle: "🔍 SEKME ARAMA KISAYOLU (Ctrl+Shift+F)",
    tabSearchDesc: "Tüm açık sekmeler arasında klavye kısayoluyla anında arama yapmayı sağlar.",
    openSoundTitle: "🔔 SEKME AÇILIŞ SESİ",
    openSoundDesc: "Yeni bir sekme açıldığında ses efekti çalar.",
    closeSoundTitle: "🔕 SEKME KAPANIŞ SESİ",
    closeSoundDesc: "Bir sekme kapatıldığında ses efekti çalar.",
    musicPulseTitle: "🎶 MÜZİK VURUŞ ANİMASYONU",
    musicPulseDesc: "Müzik çalan sekmelerde ritmik nabız/vuruş animasyonu gösterir.",
    soundProfile: "Ses Profili:",
    soundLevel: "Seviye:",
    customSoundBtn: "🎵 Kendi Ses Dosyanı Seç",
    testOpenSound: "Açılış Sesini Test Et 🔊",
    testCloseSound: "Kapanış Sesini Test Et 🔊"
  },
  en: {
    newTab: "New Tab",
    editBtn: "Edit",
    saveBtn: "Save",
    addWidget: "Add Widget",
    controlCenter: "Control Center",
    tabGeneral: "General Features",
    tabAudio: "Audio & Music",
    tabWorld: "World Clocks & Weather",
    tabAppearance: "Appearance & Canvas",
    tabShortcuts: "Pinned Tabs",
    tabPrivacy: "System & Memory",
    widgetClock: "Clock & Date",
    widgetSearch: "Search Bar",
    widgetShortcuts: "Pinned Tabs (Speed Dial)",
    widgetWeather: "World Clocks & Weather",
    widgetTodo: "Tasks & Notes",
    widgetSystem: "System Monitor",
    cleanRamQuick: "Clean",
    ramCleanedToast: "⚡ RAM Freed! Background tabs suspended.",
    duplicatesClosedToast: "🧹 Duplicate tabs closed!",
    ramUsage: "RAM",
    cpuUsage: "CPU Usage",
    digital: "Digital",
    analog: "Analog",
    bgTheme: "Background Theme",
    clockType: "Clock Style",
    addShortcutTitle: "Add New Shortcut",
    titleLabel: "Title",
    urlLabel: "Web Address (URL)",
    save: "Save",
    add: "Add",
    searchBtn: "Search",
    addCityTitle: "Add City (Clock & Weather)",
    addCityDesc: "Add any city; local time and live weather will be calculated automatically.",
    addCityBtn: "➕ Add City",
    activeCities: "Active Cities",
    newShortcut: "Add Pinned Tab",
    shortcutsList: "Pinned Tabs List",
    selectImageBtn: "📁 Choose Image (Max 10MB)",
    removeCustomBgBtn: "Remove Custom Image",
    quickActionsTitle: "Quick System & Memory Actions",
    closeDuplicatesBtn: "Close Duplicate Tabs",
    freeMemoryBtn: "Free RAM (Sleep Tabs)",
    systemStatsTitle: "System Resource Usage",
    blockedTrackers: "Trackers Blocked Today",
    tabSnoozerTitle: "💤 SMART RAM SAVER (TAB SNOOZER)",
    tabSnoozerDesc: "Automatically freezes inactive background tabs to save up to 60% RAM.",
    musicIndicatorTitle: "🎵 AUDIO PLAYING INDICATOR",
    musicIndicatorDesc: "Shows animated music notes in tab titles playing audio.",
    pdfNotesTitle: "📑 PDF & PAGE HIGHLIGHTER",
    pdfNotesDesc: "Displays highlight toolbar when selecting text on pages or PDFs.",
    autoPipTitle: "📺 AUTOMATIC PIP (FLOATING VIDEO)",
    autoPipDesc: "Automatically floats playing videos when switching tabs.",
    linkGlowTitle: "⚡ OPEN LINK DETECTOR",
    linkGlowDesc: "Shows subtle badge when hovering links already opened in other tabs.",
    ramCpuTitle: "⚡ RAM & CPU TOOLBAR BADGE",
    ramCpuDesc: "Displays real-time RAM and CPU usage on extension icon.",
    smartGroupingTitle: "🏷️ SMART TAB GROUPING",
    smartGroupingDesc: "Automatically groups and colors tabs from the same domain.",
    tabSearchTitle: "🔍 TAB SEARCH SHORTCUT (Ctrl+Shift+F)",
    tabSearchDesc: "Quickly search across all open tabs via keyboard shortcut.",
    openSoundTitle: "🔔 TAB OPEN SOUND",
    openSoundDesc: "Plays a sound effect when a new tab is created.",
    closeSoundTitle: "🔕 TAB CLOSE SOUND",
    closeSoundDesc: "Plays a sound effect when a tab is closed.",
    musicPulseTitle: "🎶 MUSIC BEAT ANIMATION",
    musicPulseDesc: "Rhythmic pulse animation on tabs playing audio.",
    soundProfile: "Sound Profile:",
    soundLevel: "Volume:",
    customSoundBtn: "🎵 Choose Audio File",
    testOpenSound: "Test Open Sound 🔊",
    testCloseSound: "Test Close Sound 🔊"
  },
  de: {
    newTab: "Neuer Tab",
    editBtn: "Bearbeiten",
    saveBtn: "Speichern",
    addWidget: "Widget hinzufügen",
    controlCenter: "Kontrollzentrum",
    tabGeneral: "Allgemein",
    tabAudio: "Audio & Musik",
    tabWorld: "Weltuhren & Wetter",
    tabAppearance: "Erscheinungsbild & Leinwand",
    tabShortcuts: "Angeheftete Tabs",
    tabPrivacy: "System & Speicher",
    widgetClock: "Uhr & Datum",
    widgetSearch: "Suchleiste",
    widgetShortcuts: "Angeheftete Tabs",
    widgetWeather: "Weltuhren & Wetter",
    widgetTodo: "Aufgaben & Notizen",
    widgetSystem: "System-Monitor",
    cleanRamQuick: "Bereinigen",
    ramCleanedToast: "⚡ RAM freigegeben!",
    duplicatesClosedToast: "🧹 Duplikate geschlossen!",
    ramUsage: "RAM",
    cpuUsage: "CPU-Last",
    digital: "Digital",
    analog: "Analog",
    bgTheme: "Hintergrund-Design",
    clockType: "Uhrentyp",
    addShortcutTitle: "Neuen Shortcut hinzufügen",
    titleLabel: "Titel",
    urlLabel: "Web-Adresse (URL)",
    save: "Speichern",
    add: "Hinzufügen",
    searchBtn: "Suchen",
    addCityTitle: "Stadt hinzufügen",
    addCityDesc: "Fügen Sie eine Stadt hinzu für Ortszeit und Wetter.",
    addCityBtn: "➕ Stadt hinzufügen",
    activeCities: "Aktive Städte",
    newShortcut: "Shortcut hinzufügen",
    shortcutsList: "Shortcut-Liste",
    selectImageBtn: "📁 Bild auswählen (Max 10MB)",
    removeCustomBgBtn: "Benutzerdefiniertes Bild entfernen",
    quickActionsTitle: "Schnelle System-Aktionen",
    closeDuplicatesBtn: "Doppelte Tabs schließen",
    freeMemoryBtn: "RAM leeren (Tabs schlafen)",
    systemStatsTitle: "Systemressourcen",
    blockedTrackers: "Heute blockierte Tracker",
    tabSnoozerTitle: "💤 INTELLIGENTER RAM-SPARER",
    tabSnoozerDesc: "Schläfert inaktive Tabs automatisch ein.",
    musicIndicatorTitle: "🎵 MUSIK-ANZEIGE",
    musicIndicatorDesc: "Zeigt Musiknoten bei Audiowiedergabe.",
    pdfNotesTitle: "📑 PDF-MARKIERUNGEN",
    pdfNotesDesc: "Textmarker für Webseiten und PDFs.",
    autoPipTitle: "📺 AUTOMATISCHES PIP",
    autoPipDesc: "Schwebendes Videofenster bei Tab-Wechsel.",
    linkGlowTitle: "⚡ OFFENER LINK DETEKTOR",
    linkGlowDesc: "Erkennt bereits geöffnete Links.",
    ramCpuTitle: "⚡ RAM/CPU BADGE",
    ramCpuDesc: "Echtzeit-Anzeige auf dem Icon.",
    smartGroupingTitle: "🏷️ TAB-GRUPPIERUNG",
    smartGroupingDesc: "Gruppiert Tabs derselben Domain.",
    tabSearchTitle: "🔍 TAB-SUCHE (Ctrl+Shift+F)",
    tabSearchDesc: "Tabs schnell durchsuchen.",
    openSoundTitle: "🔔 TAB-ÖFFNEN-SOUND",
    openSoundDesc: "Sound beim Öffnen eines Tabs.",
    closeSoundTitle: "🔕 TAB-SCHLIESSEN-SOUND",
    closeSoundDesc: "Sound beim Schließen eines Tabs.",
    musicPulseTitle: "🎶 MUSIK-IMPULS",
    musicPulseDesc: "Pulsierende Animation.",
    soundProfile: "Sound-Profil:",
    soundLevel: "Lautstärke:",
    customSoundBtn: "🎵 Audiodatei wählen",
    testOpenSound: "Öffnen-Sound testen 🔊",
    testCloseSound: "Schließen-Sound testen 🔊"
  },
  es: {
    newTab: "Nueva Pestaña",
    editBtn: "Editar",
    saveBtn: "Guardar",
    addWidget: "Añadir Widget",
    controlCenter: "Centro de Control",
    tabGeneral: "General",
    tabAudio: "Audio y Música",
    tabWorld: "Relojes y Clima",
    tabAppearance: "Apariencia y Lienzo",
    tabShortcuts: "Pestañas Fijadas",
    tabPrivacy: "Sistema y Memoria",
    widgetClock: "Reloj y Fecha",
    widgetSearch: "Barra de Búsqueda",
    widgetShortcuts: "Pestañas Fijadas",
    widgetWeather: "Relojes y Clima Mundial",
    widgetTodo: "Tareas y Notas",
    widgetSystem: "Monitor de Sistema",
    cleanRamQuick: "Limpiar",
    ramCleanedToast: "⚡ ¡RAM liberada!",
    duplicatesClosedToast: "🧹 ¡Pestañas duplicadas cerradas!",
    ramUsage: "RAM",
    cpuUsage: "Uso de CPU",
    digital: "Digital",
    analog: "Analógico",
    bgTheme: "Tema de Fondo",
    clockType: "Tipo de Reloj",
    addShortcutTitle: "Añadir Acceso Directo",
    titleLabel: "Título",
    urlLabel: "Dirección Web (URL)",
    save: "Guardar",
    add: "Añadir",
    searchBtn: "Buscar",
    addCityTitle: "Añadir Ciudad",
    addCityDesc: "Añade una ciudad para ver su hora y clima.",
    addCityBtn: "➕ Añadir Ciudad",
    activeCities: "Ciudades Activas",
    newShortcut: "Añadir Acceso Directo",
    shortcutsList: "Lista de Accesos Directos",
    selectImageBtn: "📁 Elegir Imagen (Máx 10MB)",
    removeCustomBgBtn: "Eliminar Imagen Personalizada",
    quickActionsTitle: "Acciones Rápidas",
    closeDuplicatesBtn: "Cerrar Duplicados",
    freeMemoryBtn: "Liberar RAM (Suspender)",
    systemStatsTitle: "Uso de Recursos",
    blockedTrackers: "Rastreadores Bloqueados",
    tabSnoozerTitle: "💤 AHORRO DE RAM INTELIGENTE",
    tabSnoozerDesc: "Suspende pestañas inactivas.",
    musicIndicatorTitle: "🎵 INDICADOR DE AUDIO",
    musicIndicatorDesc: "Muestra notas musicales en pestañas.",
    pdfNotesTitle: "📑 RESALTADOR DE TEXTO",
    pdfNotesDesc: "Herramienta para resaltar páginas y PDFs.",
    autoPipTitle: "📺 PIP AUTOMÁTICO",
    autoPipDesc: "Ventana flotante de vídeo al cambiar de pestaña.",
    linkGlowTitle: "⚡ DETECTOR DE ENLACES",
    linkGlowDesc: "Detecta enlaces ya abiertos.",
    ramCpuTitle: "⚡ PLACA RAM/CPU",
    ramCpuDesc: "Uso en tiempo real en el icono.",
    smartGroupingTitle: "🏷️ AGRUPACIÓN DE PESTAÑAS",
    smartGroupingDesc: "Agrupa pestañas del mismo dominio.",
    tabSearchTitle: "🔍 BÚSQUEDA DE PESTAÑAS",
    tabSearchDesc: "Buscar entre pestañas abiertas.",
    openSoundTitle: "🔔 SONIDO AL ABRIR",
    openSoundDesc: "Efecto de sonido al abrir pestaña.",
    closeSoundTitle: "🔕 SONIDO AL CERRAR",
    closeSoundDesc: "Efecto de sonido al cerrar pestaña.",
    musicPulseTitle: "🎶 PULSO MUSICAL",
    musicPulseDesc: "Animación rítmica.",
    soundProfile: "Perfil de Sonido:",
    soundLevel: "Volumen:",
    customSoundBtn: "🎵 Elegir Archivo de Audio",
    testOpenSound: "Probar Sonido Abrir 🔊",
    testCloseSound: "Probar Sonido Cerrar 🔊"
  },
  fr: {
    newTab: "Nouvel Onglet",
    editBtn: "Modifier",
    saveBtn: "Enregistrer",
    addWidget: "Ajouter un Widget",
    controlCenter: "Centre de Contrôle",
    tabGeneral: "Général",
    tabAudio: "Audio & Musique",
    tabWorld: "Horloges & Météo",
    tabAppearance: "Apparence & Canevas",
    tabShortcuts: "Onglets Épinglés",
    tabPrivacy: "Système & Mémoire",
    widgetClock: "Horloge & Date",
    widgetSearch: "Barre de Recherche",
    widgetShortcuts: "Onglets Épinglés",
    widgetWeather: "Horloges & Météo Mondiale",
    widgetTodo: "Tâches & Notes",
    widgetSystem: "Moniteur Système",
    cleanRamQuick: "Nettoyer",
    ramCleanedToast: "⚡ RAM Libérée!",
    duplicatesClosedToast: "🧹 Onglets en double fermés!",
    ramUsage: "RAM",
    cpuUsage: "Usage CPU",
    digital: "Numérique",
    analog: "Analogique",
    bgTheme: "Thème d'Arrière-plan",
    clockType: "Style d'Horloge",
    addShortcutTitle: "Ajouter un Raccourci",
    titleLabel: "Titre",
    urlLabel: "Adresse Web (URL)",
    save: "Enregistrer",
    add: "Ajouter",
    searchBtn: "Rechercher",
    addCityTitle: "Ajouter une Ville",
    addCityDesc: "Ajoutez une ville pour voir son heure et sa météo.",
    addCityBtn: "➕ Ajouter une Ville",
    activeCities: "Villes Actives",
    newShortcut: "Ajouter un Raccourci",
    shortcutsList: "Liste des Raccourcis",
    selectImageBtn: "📁 Choisir une Image (Max 10MB)",
    removeCustomBgBtn: "Supprimer l'Image",
    quickActionsTitle: "Actions Rapides",
    closeDuplicatesBtn: "Fermer les Doublons",
    freeMemoryBtn: "Libérer la RAM (Mettre en veille)",
    systemStatsTitle: "Ressources Système",
    blockedTrackers: "Pisteurs Bloqués",
    tabSnoozerTitle: "💤 ÉCONOMISEUR DE RAM INTELLIGENT",
    tabSnoozerDesc: "Suspend les onglets inactifs.",
    musicIndicatorTitle: "🎵 INDICATEUR AUDIO",
    musicIndicatorDesc: "Affiche des notes de musique.",
    pdfNotesTitle: "📑 SURLIGNEUR PDF & PAGES",
    pdfNotesDesc: "Outil de surlignage de texte.",
    autoPipTitle: "📺 PIP AUTOMATIQUE",
    autoPipDesc: "Vidéo flottante lors du changement d'onglet.",
    linkGlowTitle: "⚡ DÉTECTEUR DE LIENS OUVERTS",
    linkGlowDesc: "Détecte les liens déjà ouverts.",
    ramCpuTitle: "⚡ BADGE RAM/CPU",
    ramCpuDesc: "Utilisation en temps réel.",
    smartGroupingTitle: "🏷️ GROUPEMENT D'ONGLETS",
    smartGroupingDesc: "Groupe les onglets d'un même site.",
    tabSearchTitle: "🔍 RECHERCHE D'ONGLETS",
    tabSearchDesc: "Recherche rapide parmi les onglets.",
    openSoundTitle: "🔔 SON D'OUVERTURE",
    openSoundDesc: "Effet sonore à l'ouverture d'un onglet.",
    closeSoundTitle: "🔕 SON DE FERMETURE",
    closeSoundDesc: "Effet sonore à la fermeture d'un onglet.",
    musicPulseTitle: "🎶 PULSE MUSICAL",
    musicPulseDesc: "Animation de pulsation sonore.",
    soundProfile: "Profil Sonore:",
    soundLevel: "Volume:",
    customSoundBtn: "🎵 Choisir un Fichier Audio",
    testOpenSound: "Tester Son d'Ouverture 🔊",
    testCloseSound: "Tester Son de Fermeture 🔊"
  }
};

const WIDGET_IDS = ['clock', 'search', 'shortcuts', 'weather', 'todo', 'system'];

const defaultShortcuts = [
  { title: "YouTube", url: "https://www.youtube.com" },
  { title: "GitHub", url: "https://github.com" },
  { title: "Reddit", url: "https://www.reddit.com" },
  { title: "Twitter / X", url: "https://x.com" },
  { title: "Brave Search", url: "https://search.brave.com" },
  { title: "Wikipedia", url: "https://tr.wikipedia.org" }
];

const defaultCities = [
  { name: 'İstanbul', lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' }
];

const defaultTodos = [
  { id: '1', text: 'Better Brave\'i keşfet', done: true },
  { id: '2', text: 'Yeni sekme düzenini özelleştir', done: true }
];

// --- 3. SERBEST TUVAL VARSAYILAN YÜZDELİK KOORDİNATLARI ---
const defaultCanvasPositions = {
  clock: { leftPercent: 3.5, topPercent: 4 },
  weather: { leftPercent: 3.5, topPercent: 18 },
  search: { leftPercent: 50, topPercent: 38, isCentered: true },
  shortcuts: { leftPercent: 50, topPercent: 48, isCentered: true },
  system: { leftPercent: 78, topPercent: 46 },
  todo: { leftPercent: 78, topPercent: 65 }
};

const themeBackgrounds = {
  cyber: "linear-gradient(135deg, #09090b 0%, #121217 50%, #0d0d12 100%)",
  deep_space: "linear-gradient(135deg, #050510 0%, #0c0a24 50%, #1a1a30 100%)",
  neon_sunset: "linear-gradient(135deg, #180e29 0%, #280d3d 50%, #3d1436 100%)",
  aurora: "linear-gradient(135deg, #04141c 0%, #002840 50%, #04141c 100%)",
  midnight: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
  solid_black: "#09090b",
  solid_zinc: "#141417"
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(rawUrl) {
  if (!rawUrl) return '#';
  const trimmed = String(rawUrl).trim();
  if (/^(javascript:|data:text\/html|vbscript:)/i.test(trimmed)) {
    return '#';
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// --- 4. ANA UYGULAMA ---
document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const bgLayer = document.getElementById('bgLayer');
  const dashboardCanvas = document.getElementById('dashboardCanvas');
  const snapGuideX = document.getElementById('snapGuideX');
  const snapGuideY = document.getElementById('snapGuideY');
  const lockToggleBtn = document.getElementById('lockToggleBtn');
  const lockIcon = document.getElementById('lockIcon');
  const lockLabel = document.getElementById('lockLabel');
  const openAddWidgetModalBtn = document.getElementById('openAddWidgetModalBtn');

  const digitalClockView = document.getElementById('digitalClockView');
  const analogClockView = document.getElementById('analogClockView');
  const digitalTime = document.getElementById('digitalTime');
  const digitalDate = document.getElementById('digitalDate');
  const analogHour = document.getElementById('analogHour');
  const analogMin = document.getElementById('analogMin');
  const analogSec = document.getElementById('analogSec');
  const analogDate = document.getElementById('analogDate');

  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchEngineSelect = document.getElementById('searchEngineSelect');
  const shortcutsContainer = document.getElementById('shortcutsContainer');
  const multiCityContainer = document.getElementById('multiCityContainer');

  // Todo elements
  const todoInputForm = document.getElementById('todoInputForm');
  const todoInput = document.getElementById('todoInput');
  const todoItemsList = document.getElementById('todoItemsList');
  const todoCompletedCount = document.getElementById('todoCompletedCount');

  // System Monitor elements
  const btnWidgetCleanRam = document.getElementById('btnWidgetCleanRam');
  const widgetCleanRamIcon = document.getElementById('widgetCleanRamIcon');
  const widgetRamVal = document.getElementById('widgetRamVal');
  const widgetRamFill = document.getElementById('widgetRamFill');
  const widgetCpuVal = document.getElementById('widgetCpuVal');
  const widgetCpuFill = document.getElementById('widgetCpuFill');

  // Modals & Controls
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const appLangSelect = document.getElementById('appLangSelect');
  const addWidgetModal = document.getElementById('addWidgetModal');
  const addWidgetModalOverlay = document.getElementById('addWidgetModalOverlay');
  const closeAddWidgetModal = document.getElementById('closeAddWidgetModal');
  const addWidgetList = document.getElementById('addWidgetList');
  const btnResetLayout = document.getElementById('btnResetLayout');

  // --- STORAGE YÜKLEME ---
  let { enabledWidgets = { clock: true, search: true, shortcuts: true, weather: true, todo: true, system: true } } = await chrome.storage.local.get('enabledWidgets');
  let { canvasPositions = { ...defaultCanvasPositions } } = await chrome.storage.local.get('canvasPositions');
  let { worldCities = defaultCities } = await chrome.storage.local.get('worldCities');
  let { userShortcuts = defaultShortcuts } = await chrome.storage.local.get('userShortcuts');
  let { userTodos = defaultTodos } = await chrome.storage.local.get('userTodos');
  let { clockMode = 'digital' } = await chrome.storage.local.get('clockMode');
  let { newtabTheme = 'cyber' } = await chrome.storage.local.get('newtabTheme');
  let { defaultSearchEngine = 'google' } = await chrome.storage.local.get('defaultSearchEngine');
  let { appLang = 'tr' } = await chrome.storage.local.get('appLang');

  let isEditMode = false;

  // --- DİL VE ÇEVİRİ UYGULAMA ---
  function applyLanguage(lang) {
    appLang = lang;
    const t = translations[lang] || translations.tr;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      if (t[key]) el.title = t[key];
    });

    if (appLangSelect) appLangSelect.value = lang;
    if (lockLabel) {
      lockLabel.textContent = isEditMode ? t.saveBtn : t.editBtn;
    }
  }

  // --- TUVAL KOORDİNAT YERLEŞİMİ (RESPONSIVE PERCENTAGE POSITIONING) ---
  function renderWidgetPositions() {
    if (!dashboardCanvas) return;
    const canvasRect = dashboardCanvas.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;

    WIDGET_IDS.forEach(id => {
      const el = document.getElementById(`widget-${id}`);
      if (!el) return;

      const isEnabled = enabledWidgets[id] !== false;
      if (!isEnabled) {
        el.style.display = 'none';
        return;
      }

      el.style.display = '';
      const pos = canvasPositions[id] || defaultCanvasPositions[id];
      if (!pos) return;

      const cardW = el.offsetWidth || 260;
      const cardH = el.offsetHeight || 120;

      const maxLeft = Math.max(0, canvasRect.width - cardW);
      const maxTop = Math.max(0, canvasRect.height - cardH);

      let leftPx = (pos.leftPercent / 100) * canvasRect.width;
      let topPx = (pos.topPercent / 100) * canvasRect.height;

      if (pos.isCentered) {
        leftPx = Math.max(cardW / 2, Math.min(canvasRect.width - cardW / 2, leftPx));
        topPx = Math.max(0, Math.min(maxTop, topPx));
        el.style.left = `${leftPx}px`;
        el.style.top = `${topPx}px`;
        el.style.transform = 'translateX(-50%)';
      } else {
        leftPx = Math.max(0, Math.min(maxLeft, leftPx));
        topPx = Math.max(0, Math.min(maxTop, topPx));
        el.style.left = `${leftPx}px`;
        el.style.top = `${topPx}px`;
        el.style.transform = 'none';
      }

      // Checkbox ayar modalında senkronize et
      const cb = document.getElementById(`chk_${id}`);
      if (cb) cb.checked = isEnabled;
    });
  }

  window.addEventListener('resize', () => {
    renderWidgetPositions();
  });

  // --- AKILLI MANYETİK SÜRÜKLE & BIRAK MOTORU (SMART MAGNETIC SNAP ENGINE) ---
  let activeDragWidget = null;
  let dragOffset = { x: 0, y: 0 };

  function initMagneticDrag() {
    document.querySelectorAll('.widget-card').forEach(card => {
      card.addEventListener('pointerdown', (e) => {
        if (!isEditMode) return;
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;

        activeDragWidget = card;
        activeDragWidget.classList.add('is-dragging');
        card.setPointerCapture(e.pointerId);

        const cardRect = card.getBoundingClientRect();
        const canvasRect = dashboardCanvas.getBoundingClientRect();

        dragOffset.x = e.clientX - cardRect.left;
        dragOffset.y = e.clientY - cardRect.top;

        // Merkezli transformu kaldırıp anlık piksel pozisyonuna geçir
        card.style.transform = 'none';
        card.style.left = `${cardRect.left - canvasRect.left}px`;
        card.style.top = `${cardRect.top - canvasRect.top}px`;
      });

      card.addEventListener('pointermove', (e) => {
        if (!activeDragWidget || activeDragWidget !== card) return;

        const canvasRect = dashboardCanvas.getBoundingClientRect();
        let targetX = e.clientX - canvasRect.left - dragOffset.x;
        let targetY = e.clientY - canvasRect.top - dragOffset.y;

        const cardW = card.offsetWidth;
        const cardH = card.offsetHeight;

        // Snapping Points Scan (Diğer widget'lar ve ekran merkezleri ile hizalama)
        const SNAP_DIST = 14;
        let snappedX = null;
        let snappedY = null;
        let guideXPos = null;
        let guideYPos = null;

        // 1. Ekran Yatay/Dikey Merkez Manyetiği
        const canvasCenterX = canvasRect.width / 2;
        if (Math.abs((targetX + cardW / 2) - canvasCenterX) < SNAP_DIST) {
          targetX = canvasCenterX - cardW / 2;
          snappedX = targetX;
          guideXPos = canvasCenterX;
        }

        // 2. Diğer Widget'larla Sol, Merkez, Sağ, Üst, Alt Hizalaması
        document.querySelectorAll('.widget-card').forEach(other => {
          if (other === card || other.style.display === 'none') return;
          const oRect = other.getBoundingClientRect();
          const oLeft = oRect.left - canvasRect.left;
          const oTop = oRect.top - canvasRect.top;
          const oW = other.offsetWidth;
          const oH = other.offsetHeight;

          // X Axis Snaps:
          // A) Sol kenarlar aynı hizada
          if (Math.abs(targetX - oLeft) < SNAP_DIST) {
            targetX = oLeft;
            guideXPos = oLeft;
          }
          // B) Merkezler aynı hizada
          else if (Math.abs((targetX + cardW / 2) - (oLeft + oW / 2)) < SNAP_DIST) {
            targetX = oLeft + oW / 2 - cardW / 2;
            guideXPos = oLeft + oW / 2;
          }
          // C) Sağ kenarlar aynı hizada
          else if (Math.abs((targetX + cardW) - (oLeft + oW)) < SNAP_DIST) {
            targetX = oLeft + oW - cardW;
            guideXPos = oLeft + oW;
          }

          // Y Axis Snaps:
          // A) Üst kenarlar aynı hizada
          if (Math.abs(targetY - oTop) < SNAP_DIST) {
            targetY = oTop;
            guideYPos = oTop;
          }
          // B) Merkezler Y aynı hizada
          else if (Math.abs((targetY + cardH / 2) - (oTop + oH / 2)) < SNAP_DIST) {
            targetY = oTop + oH / 2 - cardH / 2;
            guideYPos = oTop + oH / 2;
          }
          // C) Alt kenarlar aynı hizada
          else if (Math.abs((targetY + cardH) - (oTop + oH)) < SNAP_DIST) {
            targetY = oTop + oH - cardH;
            guideYPos = oTop + oH;
          }
        });

        // Tuval sınırları içinde tut (Tam serbestlik: 0 ile ekranın tam kenarı arası)
        targetX = Math.max(0, Math.min(canvasRect.width - cardW, targetX));
        targetY = Math.max(0, Math.min(canvasRect.height - cardH, targetY));

        card.style.left = `${targetX}px`;
        card.style.top = `${targetY}px`;

        // Manyetik Kılavuz Çizgilerini Göster/Gizle
        if (guideXPos !== null) {
          snapGuideX.style.display = 'block';
          snapGuideX.style.left = `${guideXPos}px`;
        } else {
          snapGuideX.style.display = 'none';
        }

        if (guideYPos !== null) {
          snapGuideY.style.display = 'block';
          snapGuideY.style.top = `${guideYPos}px`;
        } else {
          snapGuideY.style.display = 'none';
        }
      });

      const endDrag = (e) => {
        if (!activeDragWidget || activeDragWidget !== card) return;
        activeDragWidget.classList.remove('is-dragging');

        snapGuideX.style.display = 'none';
        snapGuideY.style.display = 'none';

        const canvasRect = dashboardCanvas.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const maxLeft = Math.max(0, canvasRect.width - cardRect.width);
        const maxTop = Math.max(0, canvasRect.height - cardRect.height);

        const finalLeftPx = Math.max(0, Math.min(maxLeft, cardRect.left - canvasRect.left));
        const finalTopPx = Math.max(0, Math.min(maxTop, cardRect.top - canvasRect.top));

        const leftPercent = (finalLeftPx / canvasRect.width) * 100;
        const topPercent = (finalTopPx / canvasRect.height) * 100;

        const wid = card.dataset.widget;
        canvasPositions[wid] = {
          leftPercent: Math.round(leftPercent * 100) / 100,
          topPercent: Math.round(topPercent * 100) / 100,
          isCentered: false
        };

        chrome.storage.local.set({ canvasPositions });
        activeDragWidget = null;
      };

      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);
    });
  }

  // --- DÜZENLEME MODU AÇ/KAPAT (✏️ Edit / 💾 Save) ---
  if (lockToggleBtn) {
    lockToggleBtn.addEventListener('click', () => {
      isEditMode = !isEditMode;
      const t = translations[appLang] || translations.tr;

      if (isEditMode) {
        document.body.classList.remove('mode-locked');
        document.body.classList.add('mode-edit');
        lockToggleBtn.classList.add('active-unlocked');
        lockIcon.textContent = '💾';
        lockLabel.textContent = t.saveBtn;
        if (openAddWidgetModalBtn) openAddWidgetModalBtn.style.display = 'inline-flex';
      } else {
        document.body.classList.remove('mode-edit');
        document.body.classList.add('mode-locked');
        lockToggleBtn.classList.remove('active-unlocked');
        lockIcon.textContent = '✏️';
        lockLabel.textContent = t.editBtn;
        if (openAddWidgetModalBtn) openAddWidgetModalBtn.style.display = 'none';
      }
    });
  }

  // --- WIDGET KALDIRMA (✕ Butonu) ---
  document.querySelectorAll('.widget-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wid = btn.dataset.remove;
      enabledWidgets[wid] = false;
      chrome.storage.local.set({ enabledWidgets }, () => {
        renderWidgetPositions();
      });
    });
  });

  // --- WIDGET EKLEME MODALI ---
  if (openAddWidgetModalBtn) {
    openAddWidgetModalBtn.addEventListener('click', () => {
      renderAddWidgetList();
      addWidgetModal.style.display = 'flex';
    });
  }
  if (closeAddWidgetModal) {
    closeAddWidgetModal.addEventListener('click', () => addWidgetModal.style.display = 'none');
  }
  if (addWidgetModalOverlay) {
    addWidgetModalOverlay.addEventListener('click', () => addWidgetModal.style.display = 'none');
  }

  function renderAddWidgetList() {
    if (!addWidgetList) return;
    addWidgetList.innerHTML = '';
    const t = translations[appLang] || translations.tr;

    WIDGET_IDS.forEach(id => {
      if (enabledWidgets[id] === false) {
        const item = document.createElement('div');
        item.className = 'add-widget-item';
        item.innerHTML = `
          <span style="font-weight:600; font-size:13px; color:#fff;">${t['widget' + id.charAt(0).toUpperCase() + id.slice(1)] || id}</span>
          <button type="button" class="btn-primary" style="padding:4px 12px; font-size:12px;" data-add-widget="${id}">➕ Ekle</button>
        `;
        item.querySelector('button').addEventListener('click', () => {
          enabledWidgets[id] = true;
          chrome.storage.local.set({ enabledWidgets }, () => {
            renderWidgetPositions();
            renderAddWidgetList();
          });
        });
        addWidgetList.appendChild(item);
      }
    });

    if (addWidgetList.children.length === 0) {
      addWidgetList.innerHTML = '<p style="color:var(--text-secondary); font-size:13px; text-align:center; padding:10px;">Tüm widget\'lar şu an ekranda aktif!</p>';
    }
  }

  // --- YERLEŞİMİ SIFIRLA (RESET LAYOUT) ---
  if (btnResetLayout) {
    btnResetLayout.addEventListener('click', () => {
      canvasPositions = JSON.parse(JSON.stringify(defaultCanvasPositions));
      enabledWidgets = { clock: true, search: true, shortcuts: true, weather: true, todo: true, system: true };
      chrome.storage.local.set({ canvasPositions, enabledWidgets }, () => {
        renderWidgetPositions();
        showFeedbackToast('🔄 Yerleşim varsayılan konumlara sıfırlandı!');
      });
    });
  }

  // --- 5. SAAT VE TARİH MOTORU ---
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = now.getSeconds();

    if (digitalTime) digitalTime.textContent = `${h}:${m}`;

    const langCode = appLang === 'tr' ? 'tr-TR' : (appLang === 'de' ? 'de-DE' : (appLang === 'es' ? 'es-ES' : (appLang === 'fr' ? 'fr-FR' : 'en-US')));
    const dateStr = now.toLocaleDateString(langCode, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (digitalDate) digitalDate.textContent = dateStr;

    if (analogHour && analogMin && analogSec) {
      const hrDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
      const minDeg = now.getMinutes() * 6 + s * 0.1;
      const secDeg = s * 6;
      analogHour.style.transform = `rotate(${hrDeg}deg)`;
      analogMin.style.transform = `rotate(${minDeg}deg)`;
      analogSec.style.transform = `rotate(${secDeg}deg)`;
      if (analogDate) analogDate.textContent = dateStr;
    }
  }
  // Clock will be driven by the visibility lifecycle below

  // --- 6. ARAMA ÇUBUĞU MOTORU ---
  if (searchEngineSelect) {
    searchEngineSelect.value = defaultSearchEngine;
    searchEngineSelect.addEventListener('change', (e) => {
      defaultSearchEngine = e.target.value;
      chrome.storage.local.set({ defaultSearchEngine });
    });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;

      if (/^(https?:\/\/|www\.)/i.test(q) || (q.includes('.') && !q.includes(' '))) {
        let url = q;
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        window.location.href = url;
        return;
      }

      const engine = searchEngineSelect ? searchEngineSelect.value : 'google';
      const urls = {
        google: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        brave: `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
        yandex: `https://yandex.com/search/?text=${encodeURIComponent(q)}`
      };
      window.location.href = urls[engine] || urls.google;
    });
  }

  // --- 7. SABİTLENMİŞ SEKME & KISAYOL (SPEED DIAL) ---
  function renderShortcuts() {
    if (!shortcutsContainer) return;
    shortcutsContainer.innerHTML = '';

    userShortcuts.forEach((item, idx) => {
      const tile = document.createElement('a');
      tile.className = 'shortcut-tile';
      const cleanUrl = sanitizeUrl(item.url);
      const cleanTitle = escapeHtml(item.title);
      tile.href = cleanUrl;
      tile.title = cleanTitle;

      let domain = '';
      try { domain = new URL(cleanUrl).hostname; } catch (e) { domain = cleanUrl; }
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

      tile.innerHTML = `
        <div class="shortcut-icon-box">
          <img src="${faviconUrl}" alt="${cleanTitle}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23fff\'><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'14\'>🌐</text></svg>'">
        </div>
        <span class="shortcut-name">${cleanTitle}</span>
        <button type="button" class="shortcut-delete-btn" data-del="${idx}" title="Kaldır">✕</button>
      `;

      tile.querySelector('.shortcut-delete-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        userShortcuts.splice(idx, 1);
        chrome.storage.local.set({ userShortcuts }, () => {
          renderShortcuts();
          renderShortcutManagerList();
        });
      });

      shortcutsContainer.appendChild(tile);
    });

    // Kısayol Ekleme Butonu
    const addBtn = document.createElement('div');
    addBtn.className = 'shortcut-tile add-tile';
    addBtn.innerHTML = `
      <div class="shortcut-icon-box add-box">
        <span>➕</span>
      </div>
      <span class="shortcut-name" data-i18n="add">Ekle</span>
    `;
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById('shortcutModal');
      if (modal) {
        modal.style.display = 'flex';
        if (newShortcutTitle) newShortcutTitle.value = '';
        if (newShortcutUrl) newShortcutUrl.value = '';
        setTimeout(() => { if (newShortcutTitle) newShortcutTitle.focus(); }, 50);
      }
    });
    shortcutsContainer.appendChild(addBtn);
  }

  // Kısayol Modal İşlemleri
  const shortcutModal = document.getElementById('shortcutModal');
  const closeShortcutModal = document.getElementById('closeShortcutModal');
  const shortcutModalOverlay = document.getElementById('shortcutModalOverlay');
  const saveNewShortcutBtn = document.getElementById('saveNewShortcutBtn');
  const newShortcutTitle = document.getElementById('newShortcutTitle');
  const newShortcutUrl = document.getElementById('newShortcutUrl');

  function handleSaveShortcut() {
    const title = newShortcutTitle.value.trim();
    let url = newShortcutUrl.value.trim();
    if (!title || !url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;

    userShortcuts.push({ title, url });
    chrome.storage.local.set({ userShortcuts }, () => {
      newShortcutTitle.value = '';
      newShortcutUrl.value = '';
      if (shortcutModal) shortcutModal.style.display = 'none';
      renderShortcuts();
      renderShortcutManagerList();
    });
  }

  if (closeShortcutModal) closeShortcutModal.addEventListener('click', () => { if (shortcutModal) shortcutModal.style.display = 'none'; });
  if (shortcutModalOverlay) shortcutModalOverlay.addEventListener('click', () => { if (shortcutModal) shortcutModal.style.display = 'none'; });
  if (saveNewShortcutBtn) saveNewShortcutBtn.addEventListener('click', handleSaveShortcut);

  [newShortcutTitle, newShortcutUrl].forEach(input => {
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveShortcut();
        }
      });
    }
  });

  // --- 8. DÜNYA SAATLERİ & ÇOKLU ŞEHİR HAVA DURUMU (WITH 30-MIN CACHE) ---
  const weatherMemoryCache = new Map();
  async function fetchCityWeather(city) {
    const cacheKey = `${city.name}_${city.lat}_${city.lon}`;
    const now = Date.now();
    const cached = weatherMemoryCache.get(cacheKey);
    if (cached && (now - cached.timestamp < 1800000)) { // 30 dakika cache
      return cached.data;
    }
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`);
      const data = await res.json();
      if (data && data.current_weather) {
        weatherMemoryCache.set(cacheKey, { data: data.current_weather, timestamp: now });
        return data.current_weather;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '⛅';
  }

  async function renderMultiCityWeather() {
    if (!multiCityContainer) return;
    multiCityContainer.innerHTML = '';

    for (const city of worldCities) {
      const card = document.createElement('div');
      card.className = 'city-card';

      let timeStr = '--:--';
      try {
        timeStr = new Intl.DateTimeFormat('tr-TR', {
          timeZone: city.timezone || 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(new Date());
      } catch (e) {
        timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      }

      const cleanCityName = escapeHtml(city.name);
      const cleanCountry = escapeHtml(city.country || 'Dünya Saati');
      card.innerHTML = `
        <div class="city-info-col">
          <span class="city-name">${cleanCityName}</span>
          <span class="city-sub">${cleanCountry}</span>
        </div>
        <div class="city-time-badge">${escapeHtml(timeStr)}</div>
        <div class="city-weather-badge" id="weather_${city.name.replace(/[^a-zA-Z0-9]/g, '')}">
          <span class="weather-temp">--°C</span>
        </div>
      `;

      multiCityContainer.appendChild(card);

      // Canlı Hava Durumu Çek
      fetchCityWeather(city).then(w => {
        const badge = document.getElementById(`weather_${city.name.replace(/\s+/g, '')}`);
        if (badge && w) {
          badge.innerHTML = `
            <span class="weather-icon">${getWeatherIcon(w.weathercode)}</span>
            <span class="weather-temp">${Math.round(w.temperature)}°C</span>
          `;
        }
      });
    }
  }

  // --- 9. YAPILACAKLAR & NOTLAR (MINIMALIST CHECKLIST) ---
  function renderTodos() {
    if (!todoItemsList) return;
    todoItemsList.innerHTML = '';

    let completed = 0;
    userTodos.forEach((item, index) => {
      if (item.done) completed++;
      const el = document.createElement('div');
      el.className = `todo-item ${item.done ? 'completed' : ''}`;
      const cleanTodoText = escapeHtml(item.text);
      el.innerHTML = `
        <div class="todo-left">
          <input type="checkbox" class="todo-checkbox" ${item.done ? 'checked' : ''} data-idx="${index}">
          <span class="todo-text" title="${cleanTodoText}">${cleanTodoText}</span>
        </div>
        <button type="button" class="todo-del-btn" data-del-todo="${index}" title="Sil">✕</button>
      `;

      el.querySelector('.todo-checkbox').addEventListener('change', (e) => {
        userTodos[index].done = e.target.checked;
        chrome.storage.local.set({ userTodos }, () => renderTodos());
      });

      el.querySelector('.todo-del-btn').addEventListener('click', () => {
        userTodos.splice(index, 1);
        chrome.storage.local.set({ userTodos }, () => renderTodos());
      });

      todoItemsList.appendChild(el);
    });

    if (todoCompletedCount) {
      todoCompletedCount.textContent = `${completed}/${userTodos.length}`;
    }
  }

  if (todoInputForm) {
    todoInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = todoInput.value.trim();
      if (!val) return;
      userTodos.push({ id: String(Date.now()), text: val, done: false });
      todoInput.value = '';
      chrome.storage.local.set({ userTodos }, () => renderTodos());
    });
  }

  // --- 10. CANLI SİSTEM MONİTÖRÜ & RAM TEMİZLEME BUTONU ---
  function updateSystemMetrics() {
    if (chrome.system && chrome.system.memory) {
      chrome.system.memory.getInfo((mem) => {
        if (!mem) return;
        const totalGB = (mem.capacity / (1024 ** 3)).toFixed(1);
        const availGB = (mem.availableCapacity / (1024 ** 3)).toFixed(1);
        const usedGB = (totalGB - availGB).toFixed(1);
        const ramPct = Math.round(((mem.capacity - mem.availableCapacity) / mem.capacity) * 100);

        if (widgetRamVal) widgetRamVal.textContent = `${usedGB} / ${totalGB} GB (${ramPct}%)`;
        if (widgetRamFill) {
          widgetRamFill.style.width = `${ramPct}%`;
          widgetRamFill.style.background = ramPct > 85 ? 'var(--danger)' : (ramPct > 65 ? '#f59e0b' : 'var(--accent)');
        }

        const suiteRamStat = document.getElementById('suiteRamStat');
        if (suiteRamStat) suiteRamStat.textContent = `${usedGB} GB / ${totalGB} GB (${ramPct}%)`;
      });
    }

    if (chrome.system && chrome.system.cpu) {
      chrome.system.cpu.getInfo((cpu) => {
        if (!cpu || !cpu.processors) return;
        let totalUsage = 0;
        cpu.processors.forEach(proc => {
          const u = proc.usage;
          const total = u.user + u.kernel + u.idle;
          const used = u.user + u.kernel;
          totalUsage += (used / total);
        });
        const cpuPct = Math.min(100, Math.round((totalUsage / cpu.processors.length) * 100)) || 5;

        if (widgetCpuVal) widgetCpuVal.textContent = `${cpuPct}%`;
        if (widgetCpuFill) widgetCpuFill.style.width = `${cpuPct}%`;

        const suiteCpuStat = document.getElementById('suiteCpuStat');
        if (suiteCpuStat) suiteCpuStat.textContent = `${cpuPct}%`;
      });
    }
  }

  // --- LIVE TIMER VISIBILITY CONTROLLER (ZERO CPU WHEN TAB IN BACKGROUND) ---
  let liveClockTimer = null;
  let liveMetricsTimer = null;

  function resumeNewtabTimers() {
    pauseNewtabTimers();
    updateClock();
    updateSystemMetrics();
    liveClockTimer = setInterval(updateClock, 1000);
    liveMetricsTimer = setInterval(updateSystemMetrics, 3000);
  }

  function pauseNewtabTimers() {
    if (liveClockTimer) { clearInterval(liveClockTimer); liveClockTimer = null; }
    if (liveMetricsTimer) { clearInterval(liveMetricsTimer); liveMetricsTimer = null; }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseNewtabTimers();
    } else {
      resumeNewtabTimers();
    }
  }, { passive: true });

  resumeNewtabTimers();

  // Sistem Monitörü İçindeki "RAM Temizle" Butonu
  if (btnWidgetCleanRam) {
    btnWidgetCleanRam.addEventListener('click', async () => {
      if (widgetCleanRamIcon) widgetCleanRamIcon.textContent = '⚡';
      chrome.runtime.sendMessage({ type: 'DISCARD_ALL_INACTIVE_TABS' }, (resp) => {
        const t = translations[appLang] || translations.tr;
        showFeedbackToast(t.ramCleanedToast);
        setTimeout(() => {
          if (widgetCleanRamIcon) widgetCleanRamIcon.textContent = '🧹';
          updateSystemMetrics();
        }, 1200);
      });
    });
  }

  // --- 11. SUITE MODAL SEKMELERİ & AYARLAR ---
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
      renderShortcutManagerList();
      renderCityManagerList();
    });
  }
  if (closeSettingsModal) closeSettingsModal.addEventListener('click', () => settingsModal.style.display = 'none');
  if (modalOverlay) modalOverlay.addEventListener('click', () => settingsModal.style.display = 'none');

  document.querySelectorAll('.suite-nav-item').forEach(navBtn => {
    navBtn.addEventListener('click', () => {
      document.querySelectorAll('.suite-nav-item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.suite-tab-pane').forEach(p => p.classList.remove('active'));
      navBtn.classList.add('active');
      const targetId = navBtn.dataset.tab;
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  if (appLangSelect) {
    appLangSelect.addEventListener('change', (e) => {
      const newL = e.target.value;
      chrome.storage.local.set({ appLang: newL }, () => {
        applyLanguage(newL);
        updateClock();
        renderShortcuts();
        renderAddWidgetList();
      });
    });
  }

  // Toast Bildirim Gösterici
  function showFeedbackToast(msg) {
    const toast = document.getElementById('actionFeedbackToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2800);
  }

  // Çift Sekmeleri Kapat ve RAM Boşalt Butonları
  const btnCloseDuplicatesBtn = document.getElementById('btnCloseDuplicatesBtn');
  if (btnCloseDuplicatesBtn) {
    btnCloseDuplicatesBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'CLOSE_DUPLICATE_TABS' }, (resp) => {
        const t = translations[appLang] || translations.tr;
        showFeedbackToast(t.duplicatesClosedToast);
      });
    });
  }

  const btnFreeMemoryBtn = document.getElementById('btnFreeMemoryBtn');
  if (btnFreeMemoryBtn) {
    btnFreeMemoryBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'DISCARD_ALL_INACTIVE_TABS' }, (resp) => {
        const t = translations[appLang] || translations.tr;
        showFeedbackToast(t.ramCleanedToast);
        updateSystemMetrics();
      });
    });
  }

  // Şehir Yöneticisi
  function renderCityManagerList() {
    const list = document.getElementById('cityManagerList');
    if (!list) return;
    list.innerHTML = '';
    worldCities.forEach((city, idx) => {
      const row = document.createElement('div');
      row.className = 'city-manager-row';
      row.innerHTML = `
        <span style="font-size:13px; font-weight:600; color:#fff;">${escapeHtml(city.name)}</span>
        <button type="button" class="btn-danger" style="padding:4px 8px; font-size:11px;" data-del-city="${idx}">Sil</button>
      `;
      row.querySelector('button').addEventListener('click', () => {
        worldCities.splice(idx, 1);
        chrome.storage.local.set({ worldCities }, () => {
          renderCityManagerList();
          renderMultiCityWeather();
        });
      });
      list.appendChild(row);
    });
  }

  const addNewCityBtn = document.getElementById('addNewCityBtn');
  const newCityNameInput = document.getElementById('newCityNameInput');
  if (addNewCityBtn) {
    addNewCityBtn.addEventListener('click', async () => {
      const name = newCityNameInput.value.trim();
      if (!name) return;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          worldCities.push({ name, lat, lon, timezone: 'auto' });
          chrome.storage.local.set({ worldCities }, () => {
            newCityNameInput.value = '';
            renderCityManagerList();
            renderMultiCityWeather();
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Kısayol Yöneticisi Listesi
  function renderShortcutManagerList() {
    const list = document.getElementById('shortcutManagerList');
    if (!list) return;
    list.innerHTML = '';
    userShortcuts.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'city-manager-row';
      row.innerHTML = `
        <div>
          <strong style="color:#fff; font-size:13px;">${escapeHtml(item.title)}</strong>
          <span style="color:var(--text-secondary); font-size:11px; margin-left:8px;">${escapeHtml(item.url)}</span>
        </div>
        <button type="button" class="btn-danger" style="padding:4px 8px; font-size:11px;" data-del-sc="${idx}">Sil</button>
      `;
      row.querySelector('button').addEventListener('click', () => {
        userShortcuts.splice(idx, 1);
        chrome.storage.local.set({ userShortcuts }, () => {
          renderShortcutManagerList();
          renderShortcuts();
        });
      });
      list.appendChild(row);
    });
  }

  // --- 12. TEMA VE ARKA PLAN YÖNETİMİ ---
  async function applyTheme(theme) {
    if (theme === 'custom_image') {
      const blob = await getWallpaperFromIDB();
      if (blob) {
        bgLayer.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
      } else {
        bgLayer.style.background = themeBackgrounds.cyber;
      }
    } else {
      bgLayer.style.backgroundImage = 'none';
      bgLayer.style.background = themeBackgrounds[theme] || themeBackgrounds.cyber;
    }
  }

  const bgThemeSelect = document.getElementById('bgThemeSelect');
  const imageUploadArea = document.getElementById('imageUploadArea');
  const bgFileInput = document.getElementById('bgFileInput');
  const btnSelectBgFile = document.getElementById('btnSelectBgFile');
  const btnRemoveCustomBg = document.getElementById('btnRemoveCustomBg');

  if (bgThemeSelect) {
    bgThemeSelect.value = newtabTheme;
    if (newtabTheme === 'custom_image' && imageUploadArea) imageUploadArea.style.display = 'block';

    bgThemeSelect.addEventListener('change', async (e) => {
      newtabTheme = e.target.value;
      if (imageUploadArea) imageUploadArea.style.display = (newtabTheme === 'custom_image') ? 'block' : 'none';
      chrome.storage.local.set({ newtabTheme });
      applyTheme(newtabTheme);
    });
  }

  if (btnSelectBgFile && bgFileInput) {
    btnSelectBgFile.addEventListener('click', () => bgFileInput.click());
    bgFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      await saveWallpaperToIDB(file);
      applyTheme('custom_image');
      if (btnRemoveCustomBg) btnRemoveCustomBg.style.display = 'block';
    });
  }

  if (btnRemoveCustomBg) {
    btnRemoveCustomBg.addEventListener('click', async () => {
      await clearWallpaperFromIDB();
      newtabTheme = 'cyber';
      if (bgThemeSelect) bgThemeSelect.value = 'cyber';
      if (imageUploadArea) imageUploadArea.style.display = 'none';
      chrome.storage.local.set({ newtabTheme: 'cyber' });
      applyTheme('cyber');
    });
  }

  // --- 13. SAAT MODU (DİJİTAL / ANALOG) & GÖRÜNÜM AYARLARI ---
  const btnClockDigital = document.getElementById('btnClockDigital');
  const btnClockAnalog = document.getElementById('btnClockAnalog');

  function applyClockMode(mode) {
    clockMode = mode;
    if (mode === 'analog') {
      if (digitalClockView) digitalClockView.style.display = 'none';
      if (analogClockView) analogClockView.style.display = 'flex';
      if (btnClockAnalog) btnClockAnalog.classList.add('active');
      if (btnClockDigital) btnClockDigital.classList.remove('active');
    } else {
      if (digitalClockView) digitalClockView.style.display = 'flex';
      if (analogClockView) analogClockView.style.display = 'none';
      if (btnClockDigital) btnClockDigital.classList.add('active');
      if (btnClockAnalog) btnClockAnalog.classList.remove('active');
    }
  }
  applyClockMode(clockMode);

  if (btnClockDigital) {
    btnClockDigital.addEventListener('click', () => {
      applyClockMode('digital');
      chrome.storage.local.set({ clockMode: 'digital' });
    });
  }
  if (btnClockAnalog) {
    btnClockAnalog.addEventListener('click', () => {
      applyClockMode('analog');
      chrome.storage.local.set({ clockMode: 'analog' });
    });
  }

  // Widget Görünürlük Checkboxları
  WIDGET_IDS.forEach(id => {
    const cb = document.getElementById(`chk_${id}`);
    if (cb) {
      cb.checked = enabledWidgets[id] !== false;
      cb.addEventListener('change', (e) => {
        enabledWidgets[id] = e.target.checked;
        chrome.storage.local.set({ enabledWidgets }, () => {
          renderWidgetPositions();
        });
      });
    }
  });

  // --- 14. GENEL ÖZELLİKLER & SES AYARLARI SENKRONİZASYONU ---
  const generalFeatures = [
    'tabSnoozer', 'musicIndicator', 'pdfNotes', 'autoPip',
    'linkGlow', 'ramCpuMonitor', 'smartTabGrouping', 'tabSearchShortcut',
    'openSound', 'closeSound', 'musicPulseAnimation'
  ];

  chrome.storage.local.get(generalFeatures, (res) => {
    generalFeatures.forEach(feat => {
      const cb = document.getElementById(`chk_${feat}`);
      if (cb) {
        cb.checked = res[feat] !== false;
        cb.addEventListener('change', (e) => {
          chrome.storage.local.set({ [feat]: e.target.checked });
        });
      }
    });
  });

  // Ses Profili & Seviye Ayarları
  const openSoundType = document.getElementById('openSoundType');
  const closeSoundType = document.getElementById('closeSoundType');
  const openSoundVolume = document.getElementById('openSoundVolume');
  const closeSoundVolume = document.getElementById('closeSoundVolume');
  const openVolVal = document.getElementById('openVolVal');
  const closeVolVal = document.getElementById('closeVolVal');

  chrome.storage.local.get(['openSoundType', 'closeSoundType', 'openSoundVolume', 'closeSoundVolume'], (data) => {
    if (openSoundType && data.openSoundType) openSoundType.value = data.openSoundType;
    if (closeSoundType && data.closeSoundType) closeSoundType.value = data.closeSoundType;
    if (openSoundVolume && data.openSoundVolume !== undefined) {
      openSoundVolume.value = data.openSoundVolume;
      if (openVolVal) openVolVal.textContent = Math.round(data.openSoundVolume * 100) + '%';
    }
    if (closeSoundVolume && data.closeSoundVolume !== undefined) {
      closeSoundVolume.value = data.closeSoundVolume;
      if (closeVolVal) closeVolVal.textContent = Math.round(data.closeSoundVolume * 100) + '%';
    }
  });

  if (openSoundType) {
    openSoundType.addEventListener('change', (e) => {
      chrome.storage.local.set({ openSoundType: e.target.value });
      const customBox = document.getElementById('openCustomBox');
      if (customBox) customBox.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
  }

  if (closeSoundType) {
    closeSoundType.addEventListener('change', (e) => {
      chrome.storage.local.set({ closeSoundType: e.target.value });
      const customBox = document.getElementById('closeCustomBox');
      if (customBox) customBox.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });
  }

  if (openSoundVolume) {
    openSoundVolume.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      if (openVolVal) openVolVal.textContent = Math.round(vol * 100) + '%';
      chrome.storage.local.set({ openSoundVolume: vol });
    });
  }

  if (closeSoundVolume) {
    closeSoundVolume.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      if (closeVolVal) closeVolVal.textContent = Math.round(vol * 100) + '%';
      chrome.storage.local.set({ closeSoundVolume: vol });
    });
  }

  // Ses Test Butonları
  const testOpenSoundBtn = document.getElementById('testOpenSoundBtn');
  if (testOpenSoundBtn) {
    testOpenSoundBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'TEST_PLAY_SOUND', soundType: 'open' });
    });
  }

  const testCloseSoundBtn = document.getElementById('testCloseSoundBtn');
  if (testCloseSoundBtn) {
    testCloseSoundBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'TEST_PLAY_SOUND', soundType: 'close' });
    });
  }

  // --- İLK ÇALIŞTIRMA VE KURULUM ---
  applyLanguage(appLang);
  applyTheme(newtabTheme);
  renderWidgetPositions();
  initMagneticDrag();
  renderShortcuts();
  renderMultiCityWeather();
  renderTodos();
});
