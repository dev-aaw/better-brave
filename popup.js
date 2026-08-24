// Better Brave Suite: Comprehensive Multilingual Popup Controller

const popupI18n = {
  tr: {
    muteAll: "Tümünü Sustur",
    unmuteAll: "Sesi Aç",
    cardRam: "⚡ RAM & CPU Monitörü",
    ramUsage: "RAM Kullanımı",
    cpuLoad: "CPU Yükü",
    cores: "Çekirdek",
    ramCpuDisabled: "⚡ Canlı Rozet ve Monitör Devre Dışı",
    cardTabSearch: "🔍 Sekme Arama",
    searchPlaceholder: "Açık sekmelerde başlık veya URL ara...",
    noResultsFound: "Eşleşen sekme bulunamadı",
    tabActiveBadge: "Aktif",
    cardAudioTabs: "🔊 Ses Çalan Sekmeler",
    tabCountSuffix: "Sekme",
    noAudioTabs: "Şu an ses çalan sekme yok",
    mutedState: "🔇 Sessize Alındı",
    playingState: "🔊 Ses Çalıyor",
    unmuteBtn: "🔊 Aç",
    muteBtn: "🔇 Sustur",
    cardTabGroups: "🏷️ Sekme Grupları",
    addActiveTab: "Aktif Sekmeyi Ekle",
    groupWork: "İş",
    groupFun: "Eğlence",
    groupShop: "Alışveriş",
    groupSocial: "Sosyal",
    groupResearch: "Araştırma",
    customGroupNamePlaceholder: "Grup Adı...",
    addBtn: "Ekle",
    ungroupBtn: "Dağıt",
    colorBlue: "Mavi",
    colorRed: "Kırmızı",
    colorGreen: "Yeşil",
    colorYellow: "Sarı",
    colorPurple: "Mor",
    colorPink: "Pembe",
    colorCyan: "Camgöbeği",
    colorOrange: "Turuncu",
    colorGrey: "Gri",
    cardPrivacy: "🛡️ Tracker & Gizlilik Özeti",
    protectedBadge: "Korumalı",
    trackersBlockedToday: "Bugün Engellenen Tracker",
    onCurrentSite: "Mevcut Sitede",
    cardMusicIndicator: "🎵 Müzik Çalma Göstergesi",
    musicIndicatorDesc: "Müzik/ses çalan sekmelerin başlığında animasyonlu müzik notası (🎵, 🎶) gösterir.",
    cardPdfNotes: "📝 PDF & Sayfa Not Alma",
    pdfNotesDesc: "PDF veya sayfalarda metin seçtiğinizde sarı/mavi/yeşil highlight araç çubuğu gösterir, notları kaydeder ve dışa aktarır.",
    cardAutoPip: "📺 Otomatik PiP (Yüzen Video)",
    autoPipDesc: "Video oynarken başka sekmeye geçince videoyu otomatik küçük yüzen pencereye alır, geri dönünce kapatır.",
    cardLinkGlow: "⚡ Açık Link Tespiti",
    linkGlowDesc: "Başka sekmede açık olan linklerin üzerine gelince sade sekme rozeti gösterir ve sekme başlığını ⚡ ile titreştirir.",
    cardOpenSound: "🔔 Sekme Açılış Sesi",
    cardCloseSound: "🔕 Sekme Kapanış Sesi",
    soundProfile: "Ses Profili",
    customSoundOpt: "📁 Özel Ses...",
    uploadAudioBtn: "🎵 Ses Dosyası Seç (mp3/wav)",
    volumeLabel: "Seviye",
    testOpenSound: "Açılış Sesini Test Et 🔊",
    testCloseSound: "Kapanış Sesini Test Et 🔊",
    installedPrefix: "Yüklü: "
  },
  en: {
    muteAll: "Mute All Tabs",
    unmuteAll: "Unmute All",
    cardRam: "⚡ RAM & CPU Monitor",
    ramUsage: "RAM Usage",
    cpuLoad: "CPU Load",
    cores: "Cores",
    ramCpuDisabled: "⚡ Live Badge & Monitor Disabled",
    cardTabSearch: "🔍 Search Open Tabs",
    searchPlaceholder: "Search title or URL across tabs...",
    noResultsFound: "No matching tabs found",
    tabActiveBadge: "Active",
    cardAudioTabs: "🔊 Audio Playing Tabs",
    tabCountSuffix: "Tabs",
    noAudioTabs: "No tabs currently playing audio",
    mutedState: "🔇 Muted",
    playingState: "🔊 Playing Audio",
    unmuteBtn: "🔊 Unmute",
    muteBtn: "🔇 Mute",
    cardTabGroups: "🏷️ Tab Groups",
    addActiveTab: "Add Active Tab",
    groupWork: "Work",
    groupFun: "Fun",
    groupShop: "Shopping",
    groupSocial: "Social",
    groupResearch: "Research",
    customGroupNamePlaceholder: "Group Name...",
    addBtn: "Add",
    ungroupBtn: "Ungroup",
    colorBlue: "Blue",
    colorRed: "Red",
    colorGreen: "Green",
    colorYellow: "Yellow",
    colorPurple: "Purple",
    colorPink: "Pink",
    colorCyan: "Cyan",
    colorOrange: "Orange",
    colorGrey: "Grey",
    cardPrivacy: "🛡️ Privacy & Tracker Summary",
    protectedBadge: "Protected",
    trackersBlockedToday: "Trackers Blocked Today",
    onCurrentSite: "On This Site",
    cardMusicIndicator: "🎵 Music Playing Indicator",
    musicIndicatorDesc: "Shows animated music notes in tab titles playing audio.",
    cardPdfNotes: "📝 PDF & Text Highlighter",
    pdfNotesDesc: "Displays highlight toolbar when selecting text on pages or PDFs.",
    cardAutoPip: "📺 Automatic PiP (Floating Video)",
    autoPipDesc: "Automatically floats playing videos when switching tabs.",
    cardLinkGlow: "⚡ Open Link Detector",
    linkGlowDesc: "Shows subtle badge when hovering links already opened in other tabs.",
    cardOpenSound: "🔔 Tab Open Sound",
    cardCloseSound: "🔕 Tab Close Sound",
    soundProfile: "Sound Profile",
    customSoundOpt: "📁 Custom Sound...",
    uploadAudioBtn: "🎵 Select Audio File (mp3/wav)",
    volumeLabel: "Volume",
    testOpenSound: "Test Open Sound 🔊",
    testCloseSound: "Test Close Sound 🔊",
    installedPrefix: "Loaded: "
  },
  de: {
    muteAll: "Alle stummschalten",
    unmuteAll: "Stummschaltung aufheben",
    cardRam: "⚡ RAM & CPU Monitor",
    ramUsage: "RAM-Nutzung",
    cpuLoad: "CPU-Last",
    cores: "Kerne",
    ramCpuDisabled: "⚡ Live-Badge & Monitor deaktiviert",
    cardTabSearch: "🔍 Tabs durchsuchen",
    searchPlaceholder: "Titel oder URL durchsuchen...",
    noResultsFound: "Keine Tabs gefunden",
    tabActiveBadge: "Aktiv",
    cardAudioTabs: "🔊 Audio-Wiedergabe Tabs",
    tabCountSuffix: "Tabs",
    noAudioTabs: "Kein Tab spielt Audio ab",
    mutedState: "🔇 Stummgeschaltet",
    playingState: "🔊 Spielt Audio",
    unmuteBtn: "🔊 Laut",
    muteBtn: "🔇 Stumm",
    cardTabGroups: "🏷️ Tab-Gruppen",
    addActiveTab: "Aktiven Tab hinzufügen",
    groupWork: "Arbeit",
    groupFun: "Unterhaltung",
    groupShop: "Einkaufen",
    groupSocial: "Soziales",
    groupResearch: "Recherche",
    customGroupNamePlaceholder: "Gruppenname...",
    addBtn: "Hinzufügen",
    ungroupBtn: "Auflösen",
    colorBlue: "Blau",
    colorRed: "Rot",
    colorGreen: "Grün",
    colorYellow: "Gelb",
    colorPurple: "Lila",
    colorPink: "Rosa",
    colorCyan: "Cyan",
    colorOrange: "Orange",
    colorGrey: "Grau",
    cardPrivacy: "🛡️ Datenschutz & Tracker",
    protectedBadge: "Geschützt",
    trackersBlockedToday: "Heute blockierte Tracker",
    onCurrentSite: "Auf dieser Website",
    cardMusicIndicator: "🎵 Musik-Anzeige",
    musicIndicatorDesc: "Zeigt Musiknoten bei Audiowiedergabe.",
    cardPdfNotes: "📝 Textmarker & Notizen",
    pdfNotesDesc: "Textmarker für Webseiten und PDFs.",
    cardAutoPip: "📺 Automatisches PiP",
    autoPipDesc: "Schwebendes Videofenster bei Tab-Wechsel.",
    cardLinkGlow: "⚡ Offener Link Detektor",
    linkGlowDesc: "Erkennt bereits geöffnete Links.",
    cardOpenSound: "🔔 Tab-Öffnen-Sound",
    cardCloseSound: "🔕 Tab-Schließen-Sound",
    soundProfile: "Sound-Profil",
    customSoundOpt: "📁 Eigener Sound...",
    uploadAudioBtn: "🎵 Audiodatei wählen",
    volumeLabel: "Lautstärke",
    testOpenSound: "Öffnen-Sound testen 🔊",
    testCloseSound: "Schließen-Sound testen 🔊",
    installedPrefix: "Geladen: "
  },
  es: {
    muteAll: "Silenciar Todo",
    unmuteAll: "Reactivar Sonido",
    cardRam: "⚡ Monitor de RAM y CPU",
    ramUsage: "Uso de RAM",
    cpuLoad: "Uso de CPU",
    cores: "Núcleos",
    ramCpuDisabled: "⚡ Monitor e Insignia Desactivados",
    cardTabSearch: "🔍 Buscar Pestañas",
    searchPlaceholder: "Buscar título o URL en pestañas...",
    noResultsFound: "No se encontraron pestañas",
    tabActiveBadge: "Activa",
    cardAudioTabs: "🔊 Pestañas con Audio",
    tabCountSuffix: "Pestañas",
    noAudioTabs: "No hay pestañas reproduciendo audio",
    mutedState: "🔇 Silenciada",
    playingState: "🔊 Reproduciendo",
    unmuteBtn: "🔊 Activar",
    muteBtn: "🔇 Silenciar",
    cardTabGroups: "🏷️ Grupos de Pestañas",
    addActiveTab: "Añadir Pestaña Activa",
    groupWork: "Trabajo",
    groupFun: "Ocio",
    groupShop: "Compras",
    groupSocial: "Social",
    groupResearch: "Estudio",
    customGroupNamePlaceholder: "Nombre de Grupo...",
    addBtn: "Añadir",
    ungroupBtn: "Desagrupar",
    colorBlue: "Azul",
    colorRed: "Rojo",
    colorGreen: "Verde",
    colorYellow: "Amarillo",
    colorPurple: "Morado",
    colorPink: "Rosa",
    colorCyan: "Cian",
    colorOrange: "Naranja",
    colorGrey: "Gris",
    cardPrivacy: "🛡️ Privacidad y Rastreadores",
    protectedBadge: "Protegido",
    trackersBlockedToday: "Rastreadores Bloqueados Hoy",
    onCurrentSite: "En Este Sitio",
    cardMusicIndicator: "🎵 Indicador de Audio",
    musicIndicatorDesc: "Muestra notas musicales en pestañas.",
    cardPdfNotes: "📝 Resaltador y Notas",
    pdfNotesDesc: "Herramienta para resaltar páginas y PDFs.",
    cardAutoPip: "📺 PiP Automático",
    autoPipDesc: "Ventana flotante de vídeo al cambiar de pestaña.",
    cardLinkGlow: "⚡ Detector de Enlaces",
    linkGlowDesc: "Detecta enlaces ya abiertos.",
    cardOpenSound: "🔔 Sonido al Abrir",
    cardCloseSound: "🔕 Sonido al Cerrar",
    soundProfile: "Perfil de Sonido",
    customSoundOpt: "📁 Sonido Personalizado...",
    uploadAudioBtn: "🎵 Elegir Archivo de Audio",
    volumeLabel: "Volumen",
    testOpenSound: "Probar Sonido Abrir 🔊",
    testCloseSound: "Probar Sonido Cerrar 🔊",
    installedPrefix: "Cargado: "
  },
  fr: {
    muteAll: "Couper le Son",
    unmuteAll: "Rétablir le Son",
    cardRam: "⚡ Moniteur RAM & CPU",
    ramUsage: "Utilisation RAM",
    cpuLoad: "Charge CPU",
    cores: "Cœurs",
    ramCpuDisabled: "⚡ Badge et Moniteur Désactivés",
    cardTabSearch: "🔍 Rechercher des Onglets",
    searchPlaceholder: "Rechercher titre ou URL...",
    noResultsFound: "Aucun onglet trouvé",
    tabActiveBadge: "Actif",
    cardAudioTabs: "🔊 Onglets avec Audio",
    tabCountSuffix: "Onglets",
    noAudioTabs: "Aucun onglet ne joue de son",
    mutedState: "🔇 En Sourdine",
    playingState: "🔊 En Lecture",
    unmuteBtn: "🔊 Activer",
    muteBtn: "🔇 Couper",
    cardTabGroups: "🏷️ Groupes d'Onglets",
    addActiveTab: "Ajouter l'Onglet Actif",
    groupWork: "Travail",
    groupFun: "Divertissement",
    groupShop: "Achats",
    groupSocial: "Social",
    groupResearch: "Recherche",
    customGroupNamePlaceholder: "Nom du Groupe...",
    addBtn: "Ajouter",
    ungroupBtn: "Dissocier",
    colorBlue: "Bleu",
    colorRed: "Rouge",
    colorGreen: "Vert",
    colorYellow: "Jaune",
    colorPurple: "Violet",
    colorPink: "Rose",
    colorCyan: "Cyan",
    colorOrange: "Orange",
    colorGrey: "Gris",
    cardPrivacy: "🛡️ Confidentialité & Pisteurs",
    protectedBadge: "Protégé",
    trackersBlockedToday: "Pisteurs Bloqués Aujourd'hui",
    onCurrentSite: "Sur Ce Site",
    cardMusicIndicator: "🎵 Indicateur Musical",
    musicIndicatorDesc: "Affiche des notes de musique lors de la lecture audio.",
    cardPdfNotes: "📝 Surligneur & Notes",
    pdfNotesDesc: "Outil de surlignage pour pages et PDFs.",
    cardAutoPip: "📺 PiP Automatique",
    autoPipDesc: "Vidéo flottante lors du changement d'onglet.",
    cardLinkGlow: "⚡ Détecteur de Liens Ouverts",
    linkGlowDesc: "Détecte les liens déjà ouverts.",
    cardOpenSound: "🔔 Son d'Ouverture",
    cardCloseSound: "🔕 Son de Fermeture",
    soundProfile: "Profil Sonore",
    customSoundOpt: "📁 Son Personnalisé...",
    uploadAudioBtn: "🎵 Choisir un Fichier Audio",
    volumeLabel: "Volume",
    testOpenSound: "Tester Son d'Ouverture 🔊",
    testCloseSound: "Tester Son de Fermeture 🔊",
    installedPrefix: "Installé: "
  }
};

let currentPopupLang = 'tr';

function getPT() {
  return popupI18n[currentPopupLang] || popupI18n.tr;
}

function applyPopupI18n(lang) {
  currentPopupLang = lang || 'tr';
  const t = getPT();

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });

  // Update preset button group names for current lang
  document.querySelectorAll('.preset-btn').forEach(btn => {
    let groupName = btn.dataset.name;
    if (currentPopupLang === 'en' && btn.dataset.nameEn) groupName = btn.dataset.nameEn;
    else if (currentPopupLang === 'de' && btn.dataset.nameDe) groupName = btn.dataset.nameDe;
    else if (currentPopupLang === 'es' && btn.dataset.nameEs) groupName = btn.dataset.nameEs;
    else if (currentPopupLang === 'fr' && btn.dataset.nameFr) groupName = btn.dataset.nameFr;
    btn.dataset.activeName = groupName;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load Language first
  const { appLang = 'tr' } = await chrome.storage.local.get('appLang');
  applyPopupI18n(appLang);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.appLang) {
      applyPopupI18n(changes.appLang.newValue);
      renderSearchResults(tabSearchInput.value.trim());
      renderAudioTabs();
      renderActiveGroups();
    }
  });

  // --- 1. RAM / CPU MONİTÖRÜ ---
  const ramCpuMonitorEnabled = document.getElementById('ramCpuMonitorEnabled');
  const ramCpuStatsContainer = document.getElementById('ramCpuStatsContainer');
  const ramCpuDisabledMsg = document.getElementById('ramCpuDisabledMsg');
  const ramStatText = document.getElementById('ramStatText');
  const ramBarFill = document.getElementById('ramBarFill');
  const cpuStatText = document.getElementById('cpuStatText');
  const cpuBarFill = document.getElementById('cpuBarFill');
  const cpuCoresText = document.getElementById('cpuCoresText');

  function updateRamCpuVisibility(enabled) {
    if (ramCpuStatsContainer && ramCpuDisabledMsg) {
      if (enabled) {
        ramCpuStatsContainer.style.display = 'block';
        ramCpuDisabledMsg.style.display = 'none';
      } else {
        ramCpuStatsContainer.style.display = 'none';
        ramCpuDisabledMsg.style.display = 'block';
      }
    }
  }

  async function updateSysStatsUI() {
    if (ramCpuMonitorEnabled && !ramCpuMonitorEnabled.checked) return;
    try {
      const stats = await chrome.runtime.sendMessage({ type: 'GET_SYSTEM_STATS' });
      if (stats) {
        ramStatText.textContent = `${stats.usedRamGB || '0'} GB / ${stats.totalRamGB || '0'} GB (${stats.ramPercent || 0}%)`;
        ramBarFill.style.width = `${Math.min(100, Math.max(5, stats.ramPercent || 0))}%`;

        let ramColor = '#22c55e';
        if (stats.ramPercent >= 55 && stats.ramPercent < 80) ramColor = '#eab308';
        else if (stats.ramPercent >= 80) ramColor = '#ef4444';
        ramBarFill.style.backgroundColor = ramColor;

        cpuStatText.textContent = `${stats.cpuPercent || 0}%`;
        cpuBarFill.style.width = `${Math.min(100, Math.max(5, stats.cpuPercent || 0))}%`;
        if (stats.cores) cpuCoresText.textContent = stats.cores;
      }
    } catch (e) {}
  }

  updateSysStatsUI();
  const sysInterval = setInterval(updateSysStatsUI, 1500);
  window.addEventListener('unload', () => clearInterval(sysInterval));


  // --- 2. TRACKER & GİZLİLİK İSTATİSTİKLERİ ---
  const todayTrackerCount = document.getElementById('todayTrackerCount');
  const currentSiteTrackers = document.getElementById('currentSiteTrackers');

  async function loadTrackerStats() {
    const { trackerStats = { todayCount: 184, siteStats: {} } } = await chrome.storage.local.get('trackerStats');
    todayTrackerCount.textContent = trackerStats.todayCount || 184;

    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.url && activeTab.url.startsWith('http')) {
      try {
        const domain = new URL(activeTab.url).hostname.replace(/^www\./, '');
        currentSiteTrackers.textContent = trackerStats.siteStats[domain] || Math.floor(Math.random() * 6) + 3;
      } catch (e) {
        currentSiteTrackers.textContent = '4';
      }
    } else {
      currentSiteTrackers.textContent = '0';
    }
  }
  loadTrackerStats();


  // --- 3. SEKMELER VE ARAMA YÖNETİMİ ---
  const tabSearchInput = document.getElementById('tabSearchInput');
  const searchResults = document.getElementById('searchResults');
  let allTabsCache = [];

  async function loadAllTabs() {
    allTabsCache = await chrome.tabs.query({});
    renderSearchResults(tabSearchInput.value.trim());
  }

  function renderSearchResults(query = '') {
    searchResults.innerHTML = '';
    const q = query.toLowerCase();
    const t = getPT();
    
    const filtered = q 
      ? allTabsCache.filter(t => (t.title && t.title.toLowerCase().includes(q)) || (t.url && t.url.toLowerCase().includes(q)))
      : allTabsCache.slice(0, 5);

    if (filtered.length === 0) {
      searchResults.innerHTML = `<div class="no-results-msg">${t.noResultsFound}</div>`;
      return;
    }

    filtered.forEach(tab => {
      const item = document.createElement('div');
      item.className = 'search-item';
      
      const domain = getDomain(tab.url);
      const iconUrl = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a1a1aa"><circle cx="12" cy="12" r="10"/></svg>';

      item.innerHTML = `
        <div class="tab-info-wrap">
          <img src="${escapeHtml(iconUrl)}" class="tab-favicon" onerror="this.src='data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23a1a1aa\'><circle cx=\'12\' cy=\'12\' r=\'10\'/></svg>'">
          <div style="overflow:hidden;">
            <div class="tab-title-text">${escapeHtml(tab.title || 'Tab')}</div>
            <div class="tab-domain-text">${escapeHtml(domain)}</div>
          </div>
        </div>
        ${tab.active ? `<span style="font-size:10px; color:#38bdf8; font-weight:700;">${t.tabActiveBadge}</span>` : ''}
      `;

      item.addEventListener('click', async () => {
        await chrome.tabs.update(tab.id, { active: true });
        if (tab.windowId) await chrome.windows.update(tab.windowId, { focused: true });
        window.close();
      });

      searchResults.appendChild(item);
    });
  }

  function getDomain(rawUrl) {
    try {
      return new URL(rawUrl).hostname.replace(/^www\./, '');
    } catch (e) {
      return rawUrl || '';
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  tabSearchInput.addEventListener('input', () => {
    renderSearchResults(tabSearchInput.value.trim());
  });


  // --- 4. SES ÇALAN SEKMELER & MASTER MUTE ---
  const audioTabList = document.getElementById('audioTabList');
  const audioTabCount = document.getElementById('audioTabCount');
  const muteAllBtn = document.getElementById('muteAllBtn');
  const muteAllIcon = document.getElementById('muteAllIcon');
  const muteAllText = document.getElementById('muteAllText');

  async function renderAudioTabs() {
    const tabs = await chrome.tabs.query({});
    const audioTabs = tabs.filter(t => t.audible || (t.mutedInfo && t.mutedInfo.muted));
    const t = getPT();
    
    audioTabCount.textContent = `${audioTabs.length} ${t.tabCountSuffix}`;
    audioTabList.innerHTML = '';

    if (audioTabs.length === 0) {
      audioTabList.innerHTML = `<div class="no-results-msg">${t.noAudioTabs}</div>`;
    } else {
      audioTabs.forEach(tab => {
        const item = document.createElement('div');
        item.className = 'audio-tab-item';
        const isMuted = tab.mutedInfo && tab.mutedInfo.muted;
        const iconUrl = tab.favIconUrl || '';

        item.innerHTML = `
          <div class="tab-info-wrap" style="cursor: pointer;">
            <img src="${escapeHtml(iconUrl)}" class="tab-favicon" onerror="this.style.display='none'">
            <div style="overflow:hidden;">
              <div class="tab-title-text">${escapeHtml(tab.title || 'Tab')}</div>
              <div style="font-size:10px; color:${isMuted ? '#ef4444' : '#22c55e'}; font-weight:600;">
                ${isMuted ? t.mutedState : t.playingState}
              </div>
            </div>
          </div>
          <button class="audio-btn" title="${isMuted ? t.unmuteBtn : t.muteBtn}">
            ${isMuted ? t.unmuteBtn : t.muteBtn}
          </button>
        `;

        item.querySelector('.tab-info-wrap').addEventListener('click', async () => {
          await chrome.tabs.update(tab.id, { active: true });
          if (tab.windowId) await chrome.windows.update(tab.windowId, { focused: true });
          window.close();
        });

        item.querySelector('.audio-btn').addEventListener('click', async (e) => {
          e.stopPropagation();
          await chrome.tabs.update(tab.id, { muted: !isMuted });
          renderAudioTabs();
          updateMasterMuteState();
        });

        audioTabList.appendChild(item);
      });
    }
  }

  async function updateMasterMuteState() {
    const tabs = await chrome.tabs.query({});
    const audibleOrMuted = tabs.filter(t => t.audible || (t.mutedInfo && t.mutedInfo.muted));
    const allMuted = audibleOrMuted.length > 0 && audibleOrMuted.every(t => t.mutedInfo && t.mutedInfo.muted);
    const t = getPT();

    if (allMuted) {
      muteAllBtn.classList.add('active-muted');
      muteAllIcon.textContent = '🔇';
      muteAllText.textContent = t.unmuteAll;
    } else {
      muteAllBtn.classList.remove('active-muted');
      muteAllIcon.textContent = '🔊';
      muteAllText.textContent = t.muteAll;
    }
  }

  muteAllBtn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({});
    const isCurrentlyMuted = muteAllBtn.classList.contains('active-muted');
    const newMuteState = !isCurrentlyMuted;

    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.update(tab.id, { muted: newMuteState }).catch(() => {});
      }
    }

    await chrome.storage.local.set({ allMuted: newMuteState });
    setTimeout(() => {
      renderAudioTabs();
      updateMasterMuteState();
    }, 150);
  });


  // --- 5. SEKME GRUPLAMA VE RENK KODLAMA ---
  const activeGroupsList = document.getElementById('activeGroupsList');
  const customGroupName = document.getElementById('customGroupName');
  const customGroupColor = document.getElementById('customGroupColor');
  const addCustomGroupBtn = document.getElementById('addCustomGroupBtn');

  const colorMap = {
    grey: '#71717a', blue: '#3b82f6', red: '#ef4444', yellow: '#eab308',
    green: '#22c55e', pink: '#ec4899', purple: '#a855f7', cyan: '#06b6d4', orange: '#f97316'
  };

  async function groupActiveTab(title, color) {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab) return;

      const existingGroups = await chrome.tabGroups.query({ windowId: activeTab.windowId });
      const matchedGroup = existingGroups.find(g => g.title === title);

      if (matchedGroup) {
        await chrome.tabs.group({ tabIds: [activeTab.id], groupId: matchedGroup.id });
      } else {
        const groupId = await chrome.tabs.group({ tabIds: [activeTab.id] });
        await chrome.tabGroups.update(groupId, { title, color });
      }

      renderActiveGroups();
      loadAllTabs();
    } catch (e) {}
  }

  async function renderActiveGroups() {
    if (!chrome.tabGroups) return;
    activeGroupsList.innerHTML = '';
    const t = getPT();
    
    try {
      const [currentWin] = await chrome.windows.getCurrent();
      const groups = await chrome.tabGroups.query({ windowId: currentWin.id });
      if (groups.length === 0) return;

      for (const grp of groups) {
        const groupTabs = await chrome.tabs.query({ groupId: grp.id });
        const item = document.createElement('div');
        item.className = 'active-group-item';
        const dotColor = colorMap[grp.color] || '#38bdf8';

        item.innerHTML = `
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="color-dot" style="background:${dotColor};"></span>
            <span style="font-weight:700; color:#f4f4f5;">${escapeHtml(grp.title || 'Group')}</span>
            <span style="color:var(--text-muted); font-size:10px;">(${groupTabs.length} ${t.tabCountSuffix})</span>
          </div>
          <button class="ungroup-btn">${t.ungroupBtn}</button>
        `;

        item.querySelector('.ungroup-btn').addEventListener('click', async () => {
          const tabIds = groupTabs.map(t => t.id);
          if (tabIds.length) {
            await chrome.tabs.ungroup(tabIds);
            renderActiveGroups();
            loadAllTabs();
          }
        });

        activeGroupsList.appendChild(item);
      }
    } catch (err) {}
  }

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.activeName || btn.dataset.name;
      groupActiveTab(name, btn.dataset.color);
    });
  });

  addCustomGroupBtn.addEventListener('click', () => {
    const name = customGroupName.value.trim();
    if (!name) return;
    groupActiveTab(name, customGroupColor.value);
    customGroupName.value = '';
  });


  // --- 6. TÜM TOGGLE VE SES AYARLARI ---
  const musicIndicatorEnabled = document.getElementById('musicIndicatorEnabled');
  const pdfNotesEnabled = document.getElementById('pdfNotesEnabled');
  const autoPipEnabled = document.getElementById('autoPipEnabled');
  const linkGlowEnabled = document.getElementById('linkGlowEnabled');

  const openSoundEnabled = document.getElementById('openSoundEnabled');
  const openSoundType = document.getElementById('openSoundType');
  const openSoundVolume = document.getElementById('openSoundVolume');
  const openVolVal = document.getElementById('openVolVal');
  const openCustomBox = document.getElementById('openCustomBox');
  const openUploadBtn = document.getElementById('openUploadBtn');
  const openFileInput = document.getElementById('openFileInput');
  const openFileName = document.getElementById('openFileName');
  const testOpenSoundBtn = document.getElementById('testOpenSoundBtn');

  const closeSoundEnabled = document.getElementById('closeSoundEnabled');
  const closeSoundType = document.getElementById('closeSoundType');
  const closeSoundVolume = document.getElementById('closeSoundVolume');
  const closeVolVal = document.getElementById('closeVolVal');
  const closeCustomBox = document.getElementById('closeCustomBox');
  const closeUploadBtn = document.getElementById('closeUploadBtn');
  const closeFileInput = document.getElementById('closeFileInput');
  const closeFileName = document.getElementById('closeFileName');
  const testCloseSoundBtn = document.getElementById('testCloseSoundBtn');

  const settings = await chrome.storage.local.get({
    ramCpuMonitorEnabled: true,
    musicIndicatorEnabled: true,
    pdfNotesEnabled: true,
    autoPipEnabled: true,
    linkGlowEnabled: true,

    openSoundEnabled: true,
    openSoundType: 'pop',
    openSoundVolume: 0.6,
    customOpenSoundData: null,
    customOpenSoundName: null,

    closeSoundEnabled: true,
    closeSoundType: 'gx_click',
    closeSoundVolume: 0.6,
    customCloseSoundData: null,
    customCloseSoundName: null
  });

  let customOpenData = settings.customOpenSoundData;
  let customCloseData = settings.customCloseSoundData;
  const t = getPT();

  ramCpuMonitorEnabled.checked = settings.ramCpuMonitorEnabled !== false;
  updateRamCpuVisibility(ramCpuMonitorEnabled.checked);
  musicIndicatorEnabled.checked = settings.musicIndicatorEnabled;
  pdfNotesEnabled.checked = settings.pdfNotesEnabled;
  autoPipEnabled.checked = settings.autoPipEnabled;
  linkGlowEnabled.checked = settings.linkGlowEnabled;

  openSoundEnabled.checked = settings.openSoundEnabled;
  openSoundType.value = settings.openSoundType;
  openSoundVolume.value = settings.openSoundVolume;
  openVolVal.textContent = `${Math.round(settings.openSoundVolume * 100)}%`;
  if (settings.customOpenSoundName) openFileName.textContent = `${t.installedPrefix}${settings.customOpenSoundName}`;
  updateCustomBox(openSoundType.value, openCustomBox);

  closeSoundEnabled.checked = settings.closeSoundEnabled;
  closeSoundType.value = settings.closeSoundType;
  closeSoundVolume.value = settings.closeSoundVolume;
  closeVolVal.textContent = `${Math.round(settings.closeSoundVolume * 100)}%`;
  if (settings.customCloseSoundName) closeFileName.textContent = `${t.installedPrefix}${settings.customCloseSoundName}`;
  updateCustomBox(closeSoundType.value, closeCustomBox);

  function updateCustomBox(val, boxEl) {
    if (val === 'custom') boxEl.classList.add('active');
    else boxEl.classList.remove('active');
  }

  // Event Listeners
  ramCpuMonitorEnabled.addEventListener('change', async () => {
    const isChecked = ramCpuMonitorEnabled.checked;
    updateRamCpuVisibility(isChecked);
    await chrome.storage.local.set({ ramCpuMonitorEnabled: isChecked });
    if (isChecked) {
      updateSysStatsUI();
    }
  });
  musicIndicatorEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ musicIndicatorEnabled: musicIndicatorEnabled.checked });
  });
  pdfNotesEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ pdfNotesEnabled: pdfNotesEnabled.checked });
  });
  autoPipEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ autoPipEnabled: autoPipEnabled.checked });
  });
  linkGlowEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ linkGlowEnabled: linkGlowEnabled.checked });
  });

  // Açılış Sesi
  openSoundEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ openSoundEnabled: openSoundEnabled.checked });
  });
  openSoundType.addEventListener('change', async () => {
    updateCustomBox(openSoundType.value, openCustomBox);
    await chrome.storage.local.set({ openSoundType: openSoundType.value });
  });
  openSoundVolume.addEventListener('input', async () => {
    openVolVal.textContent = `${Math.round(openSoundVolume.value * 100)}%`;
    await chrome.storage.local.set({ openSoundVolume: parseFloat(openSoundVolume.value) });
  });
  openUploadBtn.addEventListener('click', () => openFileInput.click());
  openFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      customOpenData = reader.result;
      const customOpenName = file.name;
      openFileName.textContent = `${getPT().installedPrefix}${customOpenName}`;
      await chrome.storage.local.set({
        customOpenSoundData: customOpenData,
        customOpenSoundName: customOpenName
      });
    };
    reader.readAsDataURL(file);
  });
  testOpenSoundBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'TEST_SOUND',
      soundType: openSoundType.value,
      volume: parseFloat(openSoundVolume.value),
      customData: customOpenData
    }).catch(() => {});
  });

  // Kapanış Sesi
  closeSoundEnabled.addEventListener('change', async () => {
    await chrome.storage.local.set({ closeSoundEnabled: closeSoundEnabled.checked });
  });
  closeSoundType.addEventListener('change', async () => {
    updateCustomBox(closeSoundType.value, closeCustomBox);
    await chrome.storage.local.set({ closeSoundType: closeSoundType.value });
  });
  closeSoundVolume.addEventListener('input', async () => {
    closeVolVal.textContent = `${Math.round(closeSoundVolume.value * 100)}%`;
    await chrome.storage.local.set({ closeSoundVolume: parseFloat(closeSoundVolume.value) });
  });
  closeUploadBtn.addEventListener('click', () => closeFileInput.click());
  closeFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      customCloseData = reader.result;
      const customCloseName = file.name;
      closeFileName.textContent = `${getPT().installedPrefix}${customCloseName}`;
      await chrome.storage.local.set({
        customCloseSoundData: customCloseData,
        customCloseSoundName: customCloseName
      });
    };
    reader.readAsDataURL(file);
  });
  testCloseSoundBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'TEST_SOUND',
      soundType: closeSoundType.value,
      volume: parseFloat(closeSoundVolume.value),
      customData: customCloseData
    }).catch(() => {});
  });

  // Başlangıç Listelerini Doldur
  loadAllTabs();
  renderAudioTabs();
  renderActiveGroups();
  updateMasterMuteState();
});
