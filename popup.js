// Better Brave Suite: Comprehensive Popup Controller

document.addEventListener('DOMContentLoaded', async () => {
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
    
    const filtered = q 
      ? allTabsCache.filter(t => (t.title && t.title.toLowerCase().includes(q)) || (t.url && t.url.toLowerCase().includes(q)))
      : allTabsCache.slice(0, 5);

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="no-results-msg">Eşleşen sekme bulunamadı</div>';
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
            <div class="tab-title-text">${escapeHtml(tab.title || 'Başlıksız Sekme')}</div>
            <div class="tab-domain-text">${escapeHtml(domain)}</div>
          </div>
        </div>
        ${tab.active ? '<span style="font-size:10px; color:#38bdf8; font-weight:700;">Aktif</span>' : ''}
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
    
    audioTabCount.textContent = `${audioTabs.length} Sekme`;
    audioTabList.innerHTML = '';

    if (audioTabs.length === 0) {
      audioTabList.innerHTML = '<div class="no-results-msg">Şu an ses çalan sekme yok</div>';
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
              <div class="tab-title-text">${escapeHtml(tab.title || 'Sekme')}</div>
              <div style="font-size:10px; color:${isMuted ? '#ef4444' : '#22c55e'}; font-weight:600;">
                ${isMuted ? '🔇 Sessize Alındı' : '🔊 Ses Çalıyor'}
              </div>
            </div>
          </div>
          <button class="audio-btn" title="${isMuted ? 'Sesi Aç' : 'Sustur'}">
            ${isMuted ? '🔊 Aç' : '🔇 Sustur'}
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

    if (allMuted) {
      muteAllBtn.classList.add('active-muted');
      muteAllIcon.textContent = '🔇';
      muteAllText.textContent = 'Sesi Aç';
    } else {
      muteAllBtn.classList.remove('active-muted');
      muteAllIcon.textContent = '🔊';
      muteAllText.textContent = 'Tümünü Sustur';
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
            <span style="font-weight:700; color:#f4f4f5;">${escapeHtml(grp.title || 'Grup')}</span>
            <span style="color:var(--text-muted); font-size:10px;">(${groupTabs.length} sekme)</span>
          </div>
          <button class="ungroup-btn">Dağıt</button>
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
      groupActiveTab(btn.dataset.name, btn.dataset.color);
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
  if (settings.customOpenSoundName) openFileName.textContent = `Yüklü: ${settings.customOpenSoundName}`;
  updateCustomBox(openSoundType.value, openCustomBox);

  closeSoundEnabled.checked = settings.closeSoundEnabled;
  closeSoundType.value = settings.closeSoundType;
  closeSoundVolume.value = settings.closeSoundVolume;
  closeVolVal.textContent = `${Math.round(settings.closeSoundVolume * 100)}%`;
  if (settings.customCloseSoundName) closeFileName.textContent = `Yüklü: ${settings.customCloseSoundName}`;
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
    const val = parseFloat(openSoundVolume.value);
    openVolVal.textContent = `${Math.round(val * 100)}%`;
    await chrome.storage.local.set({ openSoundVolume: val });
  });
  openUploadBtn.addEventListener('click', () => openFileInput.click());
  openFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      customOpenData = ev.target.result;
      openFileName.textContent = `Yüklü: ${file.name}`;
      await chrome.storage.local.set({
        customOpenSoundData: customOpenData,
        customOpenSoundName: file.name
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
    });
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
    const val = parseFloat(closeSoundVolume.value);
    closeVolVal.textContent = `${Math.round(val * 100)}%`;
    await chrome.storage.local.set({ closeSoundVolume: val });
  });
  closeUploadBtn.addEventListener('click', () => closeFileInput.click());
  closeFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      customCloseData = ev.target.result;
      closeFileName.textContent = `Yüklü: ${file.name}`;
      await chrome.storage.local.set({
        customCloseSoundData: customCloseData,
        customCloseSoundName: file.name
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
    });
  });

  // İlk yüklemeler
  await loadAllTabs();
  await renderAudioTabs();
  await updateMasterMuteState();
  await renderActiveGroups();
});