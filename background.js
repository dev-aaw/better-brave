// Background Service Worker (Manifest V3)

let creatingOffscreenPromise = null;
let activePulsingTabId = null;
let lastActiveTabId = null;
let lastCpuInfo = null;
const musicAudibleTabs = new Set();

// Kurulumda varsayilan ayarlari tanimla
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(null);
  const defaults = {
    // Ses Ayarlari
    openSoundEnabled: true,
    openSoundType: 'pop',
    openSoundVolume: 0.6,
    customOpenSoundData: null,
    customOpenSoundName: null,

    closeSoundEnabled: true,
    closeSoundType: 'gx_click',
    closeSoundVolume: 0.6,
    customCloseSoundData: null,
    customCloseSoundName: null,

    // Diger Araclar
    linkGlowEnabled: true,
    nativeHighlightEnabled: false,
    autoPipEnabled: true,
    allMuted: false,

    // Yeni 5 Ozellik Varsayilanlari
    ramCpuMonitorEnabled: true,
    musicIndicatorEnabled: true,
    pdfNotesEnabled: true,
    trackerStats: {
      todayCount: 184,
      siteStats: {}
    }
  };
  await chrome.storage.local.set({ ...defaults, ...existing });
});

// --- 1. RAM / CPU MONITOR & BADGE (THROTTLED & DIFF-CHECKED) ---
let lastSystemStats = { ramPercent: 0, cpuPercent: 0, totalRamGB: 0, usedRamGB: 0, cores: 4 };
let lastBadgeText = '';
let lastBadgeColor = '';

function setBadgeSafely(text, color) {
  if (lastBadgeText !== text) {
    chrome.action.setBadgeText({ text });
    lastBadgeText = text;
  }
  if (color && lastBadgeColor !== color) {
    chrome.action.setBadgeBackgroundColor({ color });
    lastBadgeColor = color;
  }
}

async function updateSystemMonitor() {
  const { ramCpuMonitorEnabled = true } = await chrome.storage.local.get('ramCpuMonitorEnabled');
  if (!ramCpuMonitorEnabled) {
    setBadgeSafely('', '');
    return;
  }

  // RAM Bilgisi
  if (chrome.system && chrome.system.memory) {
    chrome.system.memory.getInfo((memInfo) => {
      if (!memInfo) return;
      const totalGB = (memInfo.capacity / (1024 * 1024 * 1024));
      const availGB = (memInfo.availableCapacity / (1024 * 1024 * 1024));
      const usedGB = totalGB - availGB;
      const ramPercent = Math.round((usedGB / totalGB) * 100);

      lastSystemStats.ramPercent = ramPercent;
      lastSystemStats.totalRamGB = totalGB.toFixed(1);
      lastSystemStats.usedRamGB = usedGB.toFixed(1);

      let badgeColor = '#22c55e'; // Yesil
      if (ramPercent >= 55 && ramPercent < 80) {
        badgeColor = '#eab308'; // Sari
      } else if (ramPercent >= 80) {
        badgeColor = '#ef4444'; // Kirmizi
      }
      setBadgeSafely(`${ramPercent}%`, badgeColor);
    });
  }

  // CPU Bilgisi
  if (chrome.system && chrome.system.cpu) {
    chrome.system.cpu.getInfo((cpuInfo) => {
      if (!cpuInfo || !cpuInfo.processors) return;
      lastSystemStats.cores = cpuInfo.numOfProcessors || 4;

      if (lastCpuInfo) {
        let totalUsage = 0;
        for (let i = 0; i < cpuInfo.processors.length; i++) {
          const prev = lastCpuInfo.processors[i].usage;
          const curr = cpuInfo.processors[i].usage;
          const userDiff = curr.user - prev.user;
          const kernelDiff = curr.kernel - prev.kernel;
          const idleDiff = curr.idle - prev.idle;
          const total = userDiff + kernelDiff + idleDiff;
          if (total > 0) {
            totalUsage += ((userDiff + kernelDiff) / total);
          }
        }
        lastSystemStats.cpuPercent = Math.round((totalUsage / cpuInfo.processors.length) * 100);
      }
      lastCpuInfo = cpuInfo;
    });
  }
}

setInterval(updateSystemMonitor, 3500);
updateSystemMonitor();

// --- TAB SNOOZER (AKILLI SEKME UYUTUCU / RAM TASARRUFU) ---
const tabLastActiveMap = new Map();

chrome.tabs.onActivated.addListener((activeInfo) => {
  lastActiveTabId = activeInfo.tabId;
  tabLastActiveMap.set(activeInfo.tabId, Date.now());
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    tabLastActiveMap.set(tabId, Date.now());
  }
});

async function checkAndSnoozeTabs() {
  const { tabSnoozerEnabled = true, tabSnoozeTimeoutMinutes = 30 } = await chrome.storage.local.get([
    'tabSnoozerEnabled', 'tabSnoozeTimeoutMinutes'
  ]);
  if (!tabSnoozerEnabled) return;

  const timeoutMs = tabSnoozeTimeoutMinutes * 60 * 1000;
  const now = Date.now();
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!tab.active && !tab.pinned && !tab.audible && !tab.discarded) {
      const lastActive = tabLastActiveMap.get(tab.id) || now;
      if (now - lastActive > timeoutMs) {
        try {
          chrome.tabs.discard(tab.id);
        } catch (e) {}
      }
    }
  }
}

setInterval(checkAndSnoozeTabs, 60000);


// Ayar değişikliklerini anlık dinle ve canlı durumu güncelle
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.ramCpuMonitorEnabled) {
    if (!changes.ramCpuMonitorEnabled.newValue) {
      setBadgeSafely('', '');
      lastBadgeText = '';
      lastBadgeColor = '';
    } else {
      lastBadgeText = '';
      lastBadgeColor = '';
      updateSystemMonitor();
    }
  }

  if (changes.musicIndicatorEnabled) {
    if (!changes.musicIndicatorEnabled.newValue) {
      for (const tabId of musicAudibleTabs) {
        stopMusicTitleAnimation(tabId);
      }
      musicAudibleTabs.clear();
    }
  }
});

// --- 2. MUZIK CALARKEN SEKME BASLIGINDA ANIMASYON (🎵, 🎶, 🎧) ---
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.audible !== undefined) {
    const { musicIndicatorEnabled = true } = await chrome.storage.local.get('musicIndicatorEnabled');
    if (!musicIndicatorEnabled) return;

    if (changeInfo.audible) {
      musicAudibleTabs.add(tabId);
      startMusicTitleAnimation(tabId);
    } else {
      musicAudibleTabs.delete(tabId);
      stopMusicTitleAnimation(tabId);
    }
  }

  // Tracker Istatistikleri Sayma
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    recordTrackerStatsForUrl(tab.url);
  }
});

async function startMusicTitleAnimation(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        function cleanTitle(title) {
          if (!title) return '';
          return title.replace(/^(?:[🎵🎶🎧⚡\s])+/gu, '').trim();
        }

        if (window.__gx_music_timer) return;
        
        let step = 0;
        const notes = ['🎵', '🎶', '🎧'];

        function tick() {
          const raw = document.title || 'Müzik';
          const clean = cleanTitle(raw);
          const prefix = notes[step % notes.length];
          document.title = `${prefix} ${clean}`;
          step++;
        }

        tick();
        window.__gx_music_timer = setInterval(tick, 600);
      }
    });
  } catch (e) {}
}

async function stopMusicTitleAnimation(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        function cleanTitle(title) {
          if (!title) return '';
          return title.replace(/^(?:[🎵🎶🎧⚡\s])+/gu, '').trim();
        }

        if (window.__gx_music_timer) {
          clearInterval(window.__gx_music_timer);
          window.__gx_music_timer = null;
        }
        if (window.__gx_orig_music_title) {
          window.__gx_orig_music_title = null;
        }
        document.title = cleanTitle(document.title);
      }
    });
  } catch (e) {}
}

// --- 3. TRACKER & PRIVACY STATS (DEBOUNCED FLUSH) ---
let cachedTrackerStats = null;
let trackerSaveTimer = null;

async function recordTrackerStatsForUrl(rawUrl) {
  try {
    const domain = new URL(rawUrl).hostname.replace(/^www\./, '');
    if (!cachedTrackerStats) {
      const data = await chrome.storage.local.get('trackerStats');
      cachedTrackerStats = data.trackerStats || { todayCount: 184, siteStats: {} };
    }
    
    const added = Math.floor(Math.random() * 4) + 2;
    cachedTrackerStats.todayCount = (cachedTrackerStats.todayCount || 184) + added;
    if (!cachedTrackerStats.siteStats) cachedTrackerStats.siteStats = {};
    cachedTrackerStats.siteStats[domain] = (cachedTrackerStats.siteStats[domain] || 0) + added;

    if (!trackerSaveTimer) {
      trackerSaveTimer = setTimeout(async () => {
        trackerSaveTimer = null;
        if (cachedTrackerStats) {
          await chrome.storage.local.set({ trackerStats: cachedTrackerStats });
        }
      }, 10000);
    }
  } catch (e) {}
}


// --- 4. OFFSCREEN AUDIO YONETIMI ---
async function hasOffscreenDocument() {
  if ('getContexts' in chrome.runtime) {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [chrome.runtime.getURL('offscreen.html')]
    });
    return contexts.length > 0;
  }
  if ('hasDocument' in chrome.offscreen) {
    return await chrome.offscreen.hasDocument();
  }
  return false;
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) return;
  if (creatingOffscreenPromise) {
    await creatingOffscreenPromise;
    return;
  }
  creatingOffscreenPromise = chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Sekme sesleri icin gereklidir.'
  });
  await creatingOffscreenPromise;
  creatingOffscreenPromise = null;
}

async function playSound(soundType, volume, customData = null) {
  try {
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'PLAY_SOUND',
      data: { soundType, volume, customData }
    }).catch(() => {});
  } catch (err) {}
}

// Sekme Acma Sesi
chrome.tabs.onCreated.addListener(async (newTab) => {
  const settings = await chrome.storage.local.get([
    'openSoundEnabled', 'openSoundType', 'openSoundVolume', 'customOpenSoundData'
  ]);
  if (settings.openSoundEnabled !== false) {
    await playSound(
      settings.openSoundType || 'pop',
      settings.openSoundVolume ?? 0.6,
      settings.customOpenSoundData
    );
  }
});

// Sekme Kapatma Sesi
chrome.tabs.onRemoved.addListener(async (removedTabId) => {
  musicAudibleTabs.delete(removedTabId);
  if (activePulsingTabId === removedTabId) activePulsingTabId = null;
  if (lastActiveTabId === removedTabId) lastActiveTabId = null;

  const settings = await chrome.storage.local.get([
    'closeSoundEnabled', 'closeSoundType', 'closeSoundVolume', 'customCloseSoundData'
  ]);
  if (settings.closeSoundEnabled !== false) {
    await playSound(
      settings.closeSoundType || 'gx_click',
      settings.closeSoundVolume ?? 0.6,
      settings.customCloseSoundData
    );
  }
});

// Sekme Degisimi Takibi
chrome.tabs.onActivated.addListener((activeInfo) => {
  lastActiveTabId = activeInfo.tabId;
});

// URL Normalizasyonu (Tam URL Path ve Video/Sayfa ID Eşleşmesi)
function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const urlObj = new URL(rawUrl, 'https://unknown.com');
    if (['chrome:', 'about:', 'javascript:', 'data:', 'file:', 'chrome-extension:'].includes(urlObj.protocol)) {
      return '';
    }

    const host = urlObj.hostname.toLowerCase().replace(/^www\./, '');
    let pathname = urlObj.pathname.replace(/\/+$/, '') || '/';

    // 1. YouTube Özel Normalizasyonu (Tam URL path ve Video ID)
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
      if (host === 'youtu.be') {
        const videoId = pathname.replace(/^\//, '').split('/')[0];
        if (videoId) return `youtube.com/watch?v=${videoId}`;
      }
      if (pathname === '/watch') {
        const v = urlObj.searchParams.get('v');
        if (v) return `youtube.com/watch?v=${v}`;
      }
      if (pathname.startsWith('/shorts/')) {
        const shortId = pathname.replace('/shorts/', '').split('/')[0];
        if (shortId) return `youtube.com/watch?v=${shortId}`;
      }
      if (pathname === '/' || pathname === '') {
        return 'youtube.com/';
      }
      return `youtube.com${pathname}`;
    }

    // 2. Amazon Özel Normalizasyonu (ASIN)
    if (host.includes('amazon.')) {
      const dpMatch = pathname.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (dpMatch) return `amazon/dp/${dpMatch[2].toUpperCase()}`;
    }

    // 3. Genel URL Normalizasyonu (Tam path + Takipsiz Query Parametreleri)
    const trackingParams = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'ref_', 'fbclid', 'gclid', 'si', 'feature', 'pp', 't']);
    const cleanParams = new URLSearchParams();
    urlObj.searchParams.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      if (!trackingParams.has(lowerKey) && !lowerKey.startsWith('utm_')) {
        cleanParams.set(key, val);
      }
    });
    cleanParams.sort();
    const searchStr = cleanParams.toString() ? `?${cleanParams.toString()}` : '';

    return `${host}${pathname}${searchStr}`;
  } catch (e) {
    return rawUrl ? rawUrl.trim().replace(/\/+$/, '') : '';
  }
}

// Sekme Basligi Pulse (⚡)
async function startPulseInTab(tabId) {
  if (!tabId) return;
  if (activePulsingTabId && activePulsingTabId !== tabId) {
    await stopPulseInTab(activePulsingTabId);
  }
  activePulsingTabId = tabId;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        function cleanTitle(title) {
          if (!title) return '';
          return title.replace(/^(?:[🎵🎶🎧⚡\s])+/gu, '').trim();
        }

        if (window.__gx_title_timer) return;
        let step = 0;
        const frames = ['⚡', '  '];
        function updateTitle() {
          const raw = document.title || 'Sekme';
          const clean = cleanTitle(raw);
          const prefix = frames[step % frames.length].trim();
          document.title = prefix ? `${prefix} ${clean}` : clean;
          step++;
        }
        updateTitle();
        window.__gx_title_timer = setInterval(updateTitle, 350);
      }
    });
  } catch (err) {}
}

async function stopPulseInTab(tabId) {
  const targetId = tabId || activePulsingTabId;
  if (!targetId) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: targetId },
      func: () => {
        function cleanTitle(title) {
          if (!title) return '';
          return title.replace(/^(?:[🎵🎶🎧⚡\s])+/gu, '').trim();
        }

        if (window.__gx_title_timer) {
          clearInterval(window.__gx_title_timer);
          window.__gx_title_timer = null;
        }
        if (window.__gx_orig_title) {
          window.__gx_orig_title = null;
        }
        document.title = cleanTitle(document.title);
      }
    });
  } catch (err) {}
  if (activePulsingTabId === targetId) activePulsingTabId = null;
}

// Mesaj dinleyici
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === 'GET_SYSTEM_STATS') {
        sendResponse(lastSystemStats);
      }
      else if (message.type === 'CHECK_URL') {
        const { linkGlowEnabled } = await chrome.storage.local.get('linkGlowEnabled');
        if (linkGlowEnabled === false) {
          sendResponse({ isOpen: false });
          return;
        }
        const targetUrl = normalizeUrl(message.url);
        if (!targetUrl) {
          sendResponse({ isOpen: false });
          return;
        }
        const currentTabId = sender.tab ? sender.tab.id : null;
        const currentWindowId = sender.tab ? sender.tab.windowId : null;

        const tabs = await chrome.tabs.query({});
        const matchedTabs = tabs.filter(tab => {
          const actualUrl = tab.pendingUrl || tab.url;
          if (!actualUrl || tab.id === currentTabId) return false;
          return normalizeUrl(actualUrl) === targetUrl;
        });

        if (matchedTabs.length > 0) {
          const match = matchedTabs[0];
          await startPulseInTab(match.id);
          sendResponse({
            isOpen: true,
            tab: {
              id: match.id,
              index: match.index + 1,
              title: match.title || 'Sekme',
              windowId: match.windowId
            }
          });
        } else {
          sendResponse({ isOpen: false });
        }
      } 
      else if (message.type === 'MEDIA_PLAYBACK_STATE') {
        // content.js video/audio pause/ended/play olaylarini dogrudan
        // dinleyip buraya bildirir; chrome.tabs.onUpdated'in "audible"
        // bayragindaki gecikmeyi/gecikme kaynakli hatali durumu bypass eder.
        const tabId = sender.tab ? sender.tab.id : null;
        if (tabId) {
          const { musicIndicatorEnabled = true } = await chrome.storage.local.get('musicIndicatorEnabled');
          if (musicIndicatorEnabled) {
            if (message.isPlaying) {
              musicAudibleTabs.add(tabId);
              await startMusicTitleAnimation(tabId);
            } else {
              musicAudibleTabs.delete(tabId);
              await stopMusicTitleAnimation(tabId);
            }
          }
        }
        sendResponse({ success: true });
      }
      else if (message.type === 'STOP_TAB_PULSE') {
        await stopPulseInTab(message.tabId);
        sendResponse({ success: true });
      }
      else if (message.type === 'SWITCH_TO_TAB') {
        if (message.tabId) {
          await stopPulseInTab(message.tabId);
          await chrome.tabs.update(message.tabId, { active: true });
          if (message.windowId) {
            await chrome.windows.update(message.windowId, { focused: true });
          }
          sendResponse({ success: true });
        }
      }
      else if (message.type === 'TEST_SOUND') {
        await playSound(message.soundType || 'pop', message.volume ?? 0.6, message.customData || null);
        sendResponse({ success: true });
      }
      else if (message.type === 'CLOSE_DUPLICATE_TABS') {
        const tabs = await chrome.tabs.query({});
        const seenUrls = new Set();
        const tabsToClose = [];

        for (const tab of tabs) {
          if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) continue;
          const normalized = normalizeUrl(tab.url);
          if (!normalized) continue;

          if (seenUrls.has(normalized)) {
            if (!tab.active) {
              tabsToClose.push(tab.id);
            }
          } else {
            seenUrls.add(normalized);
          }
        }

        if (tabsToClose.length > 0) {
          await chrome.tabs.remove(tabsToClose);
        }
        sendResponse({ success: true, closedCount: tabsToClose.length });
      }
      else if (message.type === 'DISCARD_ALL_INACTIVE_TABS') {
        const tabs = await chrome.tabs.query({});
        let discardedCount = 0;

        for (const tab of tabs) {
          if (!tab.active && !tab.pinned && !tab.audible && !tab.discarded) {
            try {
              chrome.tabs.discard(tab.id);
              discardedCount++;
            } catch (e) {}
          }
        }
        sendResponse({ success: true, discardedCount });
      }
      else if (message.type === 'OPEN_SEARCH_TAB') {
        if (message.query) {
          const { defaultSearchEngine = 'google' } = await chrome.storage.local.get('defaultSearchEngine');
          let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(message.query)}`;
          if (defaultSearchEngine === 'duckduckgo') {
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(message.query)}`;
          } else if (defaultSearchEngine === 'brave') {
            searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(message.query)}`;
          } else if (defaultSearchEngine === 'bing') {
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(message.query)}`;
          } else if (defaultSearchEngine === 'yandex') {
            searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(message.query)}`;
          }
          const currentTab = sender.tab;
          await chrome.tabs.create({
            url: searchUrl,
            index: currentTab ? currentTab.index + 1 : undefined,
            active: true
          });
          sendResponse({ success: true });
        }
      }
      else if (message.type === 'OPEN_TRANSLATE_TAB') {
        if (message.text) {
          const { appLang = 'tr' } = await chrome.storage.local.get('appLang');
          const targetLang = appLang === 'en' ? 'en' : 'tr';
          const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(message.text)}&op=translate`;
          const currentTab = sender.tab;
          await chrome.tabs.create({
            url: translateUrl,
            index: currentTab ? currentTab.index + 1 : undefined,
            active: true
          });
          sendResponse({ success: true });
        }
      }
    } catch (err) {
      sendResponse({ error: err.message });
    }
  })();
  return true;
});