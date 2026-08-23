// Content Script: Universal Link Detection + Resilient Auto PiP + PDF/Web Annotation & Highlighting (Ultra-Optimized)

let activeBadge = null;
let hoverTimeout = null;
let hideTimeout = null;
let isHoveringTarget = false;
let isHoveringBadge = false;
let activeMatchedTabId = null;
let autoPipDebounce = null;

// --- 1. RESILIENT AUTO PIP (THROTTLED & IDLE OPTIMIZED) ---
function setupAutoPip() {
  const videos = document.querySelectorAll('video');
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    if (video.dataset.autoPipSetup) continue;
    video.dataset.autoPipSetup = 'true';
    video.autoPictureInPicture = true;
    video.disablePictureInPicture = false;
    
    try {
      navigator.mediaSession.setActionHandler('enterpictureinpicture', async () => {
        try {
          await video.requestPictureInPicture();
        } catch(e) {}
      });
    } catch(e) {}
  }
}

function requestThrottledAutoPip() {
  if (autoPipDebounce) return;
  autoPipDebounce = setTimeout(() => {
    autoPipDebounce = null;
    if (document.hidden) return;
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setupAutoPip(), { timeout: 1000 });
    } else {
      setupAutoPip();
    }
  }, 800);
}

// Initial setup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAutoPip, { once: true });
} else {
  setupAutoPip();
}

// Light single observer only observing body
const pipObserver = new MutationObserver(() => {
  if (!document.hidden) requestThrottledAutoPip();
});

if (document.body) {
  pipObserver.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body) pipObserver.observe(document.body, { childList: true, subtree: true });
  }, { once: true });
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
    requestThrottledAutoPip();
  }
}, { passive: true });


// --- 1b. ZERO-DOM-TRAVERSAL MEDIA TRACKING ---
const playingMediaSet = new Set();

function notifyMediaPlaybackState(isPlaying) {
  chrome.runtime.sendMessage({
    type: 'MEDIA_PLAYBACK_STATE',
    isPlaying
  }).catch(() => {});
}

['play', 'playing'].forEach(evt => {
  document.addEventListener(evt, (e) => {
    if (e.target instanceof HTMLMediaElement) {
      const wasEmpty = playingMediaSet.size === 0;
      playingMediaSet.add(e.target);
      if (wasEmpty) notifyMediaPlaybackState(true);
    }
  }, { capture: true, passive: true });
});

['pause', 'ended', 'emptied'].forEach(evt => {
  document.addEventListener(evt, (e) => {
    if (e.target instanceof HTMLMediaElement) {
      playingMediaSet.delete(e.target);
      if (playingMediaSet.size === 0) notifyMediaPlaybackState(false);
    }
  }, { capture: true, passive: true });
});


// --- 2. OPERA GX TARZI HIZLI METIN SEÇİM MENÜSÜ & ÇEVİRİ & DÖNÜŞTÜRÜCÜ & NOTLAR ---
let selectionPopup = null;
let savedRange = null;
let currentSelectedText = '';
let currentLang = 'tr';

const i18nDict = {
  tr: {
    search: "Ara",
    copy: "Kopyala",
    copied: "✓ Kopyalandı",
    translate: "Çevir",
    translating: "Çevriliyor...",
    translateError: "Çeviri alınamadı. Google Çeviri sekmesinde açabilirsiniz.",
    transTitle: "🇹🇷 Türkçe Çeviri",
    openGoogleTrans: "Google Çeviri ↗",
    highlightYellow: "Sarı Vurgula",
    highlightBlue: "Mavi Vurgula",
    highlightGreen: "Yeşil Vurgula",
    removeHighlight: "Vurguyu Kaldır",
    addNote: "Not Ekle",
    exportNotes: "Notları Dışa Aktar (.md)",
    noNotes: "Bu sayfada henüz kaydedilmiş not bulunmuyor.",
    noteTitle: "📝 Not",
    notePlaceholder: "Notunuzu buraya yazın...",
    targetLang: "tr"
  },
  en: {
    search: "Search",
    copy: "Copy",
    copied: "✓ Copied",
    translate: "Translate",
    translating: "Translating...",
    translateError: "Translation unavailable. Open in Google Translate.",
    transTitle: "🇬🇧 English Translation",
    openGoogleTrans: "Google Translate ↗",
    highlightYellow: "Highlight Yellow",
    highlightBlue: "Highlight Blue",
    highlightGreen: "Highlight Green",
    removeHighlight: "Remove Highlight",
    addNote: "Add Note",
    exportNotes: "Export Notes (.md)",
    noNotes: "No notes saved on this page yet.",
    noteTitle: "📝 Note",
    notePlaceholder: "Type your note here...",
    targetLang: "en"
  }
};

async function initLang() {
  const data = await chrome.storage.local.get('appLang');
  currentLang = data.appLang || 'tr';
}
initLang();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.appLang) {
    currentLang = changes.appLang.newValue || 'tr';
    applyI18nToPopup();
  }
});

function getT() {
  return i18nDict[currentLang] || i18nDict.tr;
}

function getStorageKey() {
  return 'notes_' + encodeURIComponent(window.location.origin + window.location.pathname);
}

// 🧠 Akıllı Dönüştürücü & Hesaplayıcı (Para Birimi, Birimler, Saat, Matematik)
function getSmartInsight(text) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed.length > 50) return null;
  const t = getT();

  // 1. Matematik Hesaplama (Örn: "120 * 4", "50 + 25 / 5", "100 * 1.20")
  if (/^[\d\s\+\-\*/\(\)\.\,]+$/.test(trimmed) && /[\+\-\*/]/.test(trimmed) && /\d/.test(trimmed)) {
    try {
      const sanitized = trimmed.replace(/,/g, '.');
      const mathResult = Function('"use strict"; return (' + sanitized + ')')();
      if (typeof mathResult === 'number' && !isNaN(mathResult) && isFinite(mathResult)) {
        return { icon: '🧮', text: `= ${Number(mathResult.toFixed(4))}` };
      }
    } catch (e) {}
  }

  // 2. Para Birimi
  const currencyMatch = trimmed.match(/^([$€£¥₺])\s*([\d,.]+)|([\d,.]+)\s*(usd|eur|gbp|jpy|try|tl|dolar|euro|sterlin)$/i);
  if (currencyMatch) {
    const sym = (currencyMatch[1] || currencyMatch[4] || '').toLowerCase();
    const numStr = (currencyMatch[2] || currencyMatch[3] || '').replace(/,/g, '');
    const val = parseFloat(numStr);
    if (!isNaN(val) && val > 0) {
      if (currentLang === 'en') {
        if (sym === '€' || sym === 'eur' || sym === 'euro') {
          return { icon: '💱', text: `€${val} ≈ $${(val * 1.08).toFixed(2)} USD` };
        }
        if (sym === '£' || sym === 'gbp' || sym === 'sterlin') {
          return { icon: '💱', text: `£${val} ≈ $${(val * 1.28).toFixed(2)} USD` };
        }
        if (sym === '¥' || sym === 'jpy') {
          return { icon: '💱', text: `¥${val} ≈ $${(val * 0.0067).toFixed(2)} USD` };
        }
        if (sym === '₺' || sym === 'try' || sym === 'tl') {
          return { icon: '💱', text: `${val} ₺ ≈ $${(val / 37.5).toFixed(2)} USD` };
        }
        if (sym === '$' || sym === 'usd' || sym === 'dolar') {
          return { icon: '💱', text: `$${val} ≈ ${Math.round(val * 37.5).toLocaleString('en-US')} TRY` };
        }
      } else {
        if (sym === '$' || sym === 'usd' || sym === 'dolar') {
          return { icon: '💱', text: `$${val} ≈ ${Math.round(val * 37.5).toLocaleString('tr-TR')} ₺` };
        }
        if (sym === '€' || sym === 'eur' || sym === 'euro') {
          return { icon: '💱', text: `€${val} ≈ ${Math.round(val * 40.8).toLocaleString('tr-TR')} ₺` };
        }
        if (sym === '£' || sym === 'gbp' || sym === 'sterlin') {
          return { icon: '💱', text: `£${val} ≈ ${Math.round(val * 48.2).toLocaleString('tr-TR')} ₺` };
        }
        if (sym === '¥' || sym === 'jpy') {
          return { icon: '💱', text: `¥${val} ≈ ${Math.round(val * 0.25).toLocaleString('tr-TR')} ₺` };
        }
      }
    }
  }

  // 3. Ölçü Birimleri
  const lbsMatch = trimmed.match(/^([\d,.]+)\s*(lbs?|pounds?)$/i);
  if (lbsMatch) {
    const val = parseFloat(lbsMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '⚖️', text: `${val} lbs = ${(val * 0.453592).toFixed(1)} kg` };
  }

  const kgMatch = trimmed.match(/^([\d,.]+)\s*(kgs?|kilos?)$/i);
  if (kgMatch) {
    const val = parseFloat(kgMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '⚖️', text: `${val} kg = ${(val / 0.453592).toFixed(1)} lbs` };
  }

  const milesMatch = trimmed.match(/^([\d,.]+)\s*(miles?|mi)$/i);
  if (milesMatch) {
    const val = parseFloat(milesMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '📏', text: `${val} mi = ${(val * 1.60934).toFixed(1)} km` };
  }

  const kmMatch = trimmed.match(/^([\d,.]+)\s*(kms?|kilometre|kilometer)$/i);
  if (kmMatch) {
    const val = parseFloat(kmMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '📏', text: `${val} km = ${(val / 1.60934).toFixed(1)} mi` };
  }

  const feetMatch = trimmed.match(/^(\d+)\s*(?:ft|feet|'|’)\s*(?:(\d+)\s*(?:in|inches|"|”))?$/i);
  if (feetMatch) {
    const ft = parseInt(feetMatch[1], 10);
    const inch = parseInt(feetMatch[2] || '0', 10);
    const totalCm = Math.round(ft * 30.48 + inch * 2.54);
    return { icon: '📏', text: `${trimmed} = ${totalCm} cm` };
  }

  const fahrMatch = trimmed.match(/^([\d,.]+)\s*(?:°\s*f|f|fahrenheit)$/i);
  if (fahrMatch) {
    const val = parseFloat(fahrMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '🌡️', text: `${val}°F = ${Math.round((val - 32) * 5 / 9)}°C` };
  }

  const celMatch = trimmed.match(/^([\d,.]+)\s*(?:°\s*c|c|celcius|celsius)$/i);
  if (celMatch) {
    const val = parseFloat(celMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '🌡️', text: `${val}°C = ${Math.round((val * 9 / 5) + 32)}°F` };
  }

  return null;
}

// 🌐 Dil Tercihli Google Çeviri API
async function fetchTranslation(text) {
  try {
    const targetLang = currentLang === 'en' ? 'en' : 'tr';
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error('Translate fetch error');
    const data = await res.json();
    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map(item => item[0]).filter(Boolean).join('');
      return translated || null;
    }
  } catch (e) {}
  return null;
}

function applyI18nToPopup() {
  if (!selectionPopup) return;
  const t = getT();

  const searchLabel = selectionPopup.querySelector('#gxSearchBtn .gx-btn-label');
  if (searchLabel) searchLabel.textContent = t.search;

  const copyLabel = selectionPopup.querySelector('#gxCopyBtn .gx-btn-label');
  if (copyLabel) copyLabel.textContent = t.copy;

  const transLabel = selectionPopup.querySelector('#gxTranslateBtn .gx-btn-label');
  if (transLabel) transLabel.textContent = t.translate;

  const transLangBadge = selectionPopup.querySelector('#gxTransLangBadge');
  if (transLangBadge) transLangBadge.textContent = t.transTitle;

  const openTransTabBtn = selectionPopup.querySelector('#gxOpenTransTabBtn');
  if (openTransTabBtn) openTransTabBtn.textContent = t.openGoogleTrans;

  const removeBtn = selectionPopup.querySelector('#gxRemoveHighlightBtn');
  if (removeBtn) removeBtn.title = t.removeHighlight;

  const addNoteBtn = selectionPopup.querySelector('#gxStickyNoteBtn');
  if (addNoteBtn) addNoteBtn.title = t.addNote;

  const exportBtn = selectionPopup.querySelector('#gxExportNotesBtn');
  if (exportBtn) exportBtn.title = t.exportNotes;
}

function getOrCreateSelectionPopup() {
  if (selectionPopup && document.body.contains(selectionPopup)) {
    applyI18nToPopup();
    return selectionPopup;
  }

  const t = getT();
  const popup = document.createElement('div');
  popup.className = 'gx-selection-popup';
  popup.innerHTML = `
    <div class="gx-smart-insight-bar" id="gxSmartBar" style="display: none;">
      <span class="gx-smart-icon" id="gxSmartIcon">💱</span>
      <span class="gx-smart-text" id="gxSmartText">--</span>
    </div>

    <div class="gx-popup-actions-row">
      <button type="button" class="gx-action-btn" id="gxSearchBtn" title="${t.search}">
        <span class="gx-btn-icon">🔍</span>
        <span class="gx-btn-label">${t.search}</span>
      </button>

      <button type="button" class="gx-action-btn" id="gxCopyBtn" title="${t.copy}">
        <span class="gx-btn-icon">📋</span>
        <span class="gx-btn-label">${t.copy}</span>
      </button>

      <button type="button" class="gx-action-btn" id="gxTranslateBtn" title="${t.translate}">
        <span class="gx-btn-icon">🌐</span>
        <span class="gx-btn-label">${t.translate}</span>
      </button>

      <div class="gx-popup-divider"></div>

      <div class="gx-highlighter-group">
        <button type="button" class="gx-color-btn swatch-yellow" data-color="yellow" title="${t.highlightYellow}"></button>
        <button type="button" class="gx-color-btn swatch-blue" data-color="blue" title="${t.highlightBlue}"></button>
        <button type="button" class="gx-color-btn swatch-green" data-color="green" title="${t.highlightGreen}"></button>
      </div>

      <button type="button" class="gx-remove-highlight-btn" id="gxRemoveHighlightBtn" title="${t.removeHighlight}" style="display: none;">
        <span>🗑️</span>
      </button>

      <button type="button" class="gx-action-btn-icon-only" id="gxStickyNoteBtn" title="${t.addNote}">
        <span>📝</span>
      </button>

      <button type="button" class="gx-action-btn-icon-only" id="gxExportNotesBtn" title="${t.exportNotes}">
        <span>💾</span>
      </button>
    </div>

    <div class="gx-translation-card" id="gxTransCard" style="display: none;">
      <div class="gx-trans-header">
        <span class="gx-trans-lang-badge" id="gxTransLangBadge">${t.transTitle}</span>
        <button type="button" class="gx-trans-close-btn" id="gxCloseTransBtn">✕</button>
      </div>
      <div class="gx-trans-content" id="gxTransContent">${t.translating}</div>
      <div class="gx-trans-footer">
        <button type="button" class="gx-trans-action-btn" id="gxCopyTransBtn">📋 ${t.copy}</button>
        <button type="button" class="gx-trans-action-btn" id="gxOpenTransTabBtn">${t.openGoogleTrans}</button>
      </div>
    </div>
  `;

  // 1. Web'de Ara Butonu
  popup.querySelector('#gxSearchBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSelectedText) {
      chrome.runtime.sendMessage({
        type: 'OPEN_SEARCH_TAB',
        query: currentSelectedText
      }).catch(() => {});
      hideSelectionPopup();
    }
  });

  // 2. Kopyala Butonu
  popup.querySelector('#gxCopyBtn').addEventListener('click', async (e) => {
    e.stopPropagation();
    if (currentSelectedText) {
      const curT = getT();
      try {
        await navigator.clipboard.writeText(currentSelectedText);
      } catch (err) {
        const temp = document.createElement('textarea');
        temp.value = currentSelectedText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      const label = popup.querySelector('#gxCopyBtn .gx-btn-label');
      if (label) {
        label.textContent = curT.copied;
        popup.querySelector('#gxCopyBtn').style.color = '#4ade80';
        setTimeout(() => {
          label.textContent = curT.copy;
          popup.querySelector('#gxCopyBtn').style.color = '';
          hideSelectionPopup();
        }, 600);
      }
    }
  });

  // 3. Çeviri Butonu & Kartı
  const transCard = popup.querySelector('#gxTransCard');
  const transContent = popup.querySelector('#gxTransContent');
  const closeTransBtn = popup.querySelector('#gxCloseTransBtn');
  const copyTransBtn = popup.querySelector('#gxCopyTransBtn');
  const openTransTabBtn = popup.querySelector('#gxOpenTransTabBtn');

  popup.querySelector('#gxTranslateBtn').addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!currentSelectedText) return;
    const curT = getT();

    transCard.style.display = 'flex';
    transContent.textContent = curT.translating;

    const result = await fetchTranslation(currentSelectedText);
    if (result) {
      transContent.textContent = result;
    } else {
      transContent.textContent = curT.translateError;
    }
  });

  closeTransBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    transCard.style.display = 'none';
  });

  copyTransBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const textToCopy = transContent.textContent;
    const curT = getT();
    if (textToCopy && textToCopy !== curT.translating) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyTransBtn.textContent = curT.copied;
        setTimeout(() => { copyTransBtn.textContent = `📋 ${curT.copy}`; }, 1000);
      } catch (err) {}
    }
  });

  openTransTabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentSelectedText) {
      chrome.runtime.sendMessage({
        type: 'OPEN_TRANSLATE_TAB',
        text: currentSelectedText
      }).catch(() => {});
      hideSelectionPopup();
    }
  });

  // 4. Renkli Vurgulama Butonları
  popup.querySelectorAll('.gx-color-btn[data-color]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyHighlight(btn.dataset.color);
      hideSelectionPopup();
    });
  });

  // 5. Vurguyu Kaldır Butonu
  popup.querySelector('#gxRemoveHighlightBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (savedRange) {
      removeHighlightsInRange(savedRange);
      hideSelectionPopup();
    }
  });

  // 6. Not Ekle Butonu
  popup.querySelector('#gxStickyNoteBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    createStickyNote(savedRange ? savedRange.getBoundingClientRect() : { top: 100, left: 100 });
    hideSelectionPopup();
  });

  // 7. Notları Dışa Aktar Butonu
  popup.querySelector('#gxExportNotesBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    exportAnnotations();
    hideSelectionPopup();
  });

  document.body.appendChild(popup);
  selectionPopup = popup;
  return popup;
}

function hideSelectionPopup() {
  if (selectionPopup) {
    selectionPopup.classList.remove('active');
    const transCard = selectionPopup.querySelector('#gxTransCard');
    if (transCard) transCard.style.display = 'none';
  }
}

function applyHighlight(color) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed) return;

  const range = sel.getRangeAt(0);
  const text = range.toString().trim();
  if (!text) return;

  const span = document.createElement('mark');
  span.className = `pdf-highlight-${color}`;
  span.textContent = text;
  span.title = getT().removeHighlight;

  // Tıklandığında doğrudan silme veya menü açma
  span.addEventListener('click', (e) => {
    e.stopPropagation();
    removeSingleHighlight(span);
  });

  try {
    range.deleteContents();
    range.insertNode(span);
    saveAnnotation({ type: 'highlight', text, color, timestamp: new Date().toLocaleString() });
  } catch (e) {}

  sel.removeAllRanges();
}

function removeSingleHighlight(markEl) {
  if (!markEl || markEl.tagName !== 'MARK') return;
  const parent = markEl.parentNode;
  if (!parent) return;
  const text = markEl.textContent;
  removeAnnotationFromStorage(text);

  while (markEl.firstChild) {
    parent.insertBefore(markEl.firstChild, markEl);
  }
  markEl.remove();
  parent.normalize();
}

function removeHighlightsInRange(range) {
  if (!range) return;
  const container = range.commonAncestorContainer;
  let marks = [];

  if (container.nodeType === Node.ELEMENT_NODE) {
    if (container.tagName === 'MARK') marks.push(container);
    marks.push(...container.querySelectorAll('mark[class*="pdf-highlight-"]'));
  } else if (container.parentElement) {
    if (container.parentElement.tagName === 'MARK') marks.push(container.parentElement);
    marks.push(...container.parentElement.querySelectorAll('mark[class*="pdf-highlight-"]'));
  }

  marks.forEach(m => removeSingleHighlight(m));
  window.getSelection()?.removeAllRanges();
}

async function removeAnnotationFromStorage(text) {
  const key = getStorageKey();
  const data = await chrome.storage.local.get(key);
  let list = data[key] || [];
  list = list.filter(item => item.text !== text);
  await chrome.storage.local.set({ [key]: list });
}

function hasHighlightInRange(range) {
  if (!range) return false;
  const container = range.commonAncestorContainer;
  if (container.nodeType === Node.ELEMENT_NODE && container.tagName === 'MARK') return true;
  if (container.parentElement && container.parentElement.tagName === 'MARK') return true;
  if (container.querySelector && container.querySelector('mark[class*="pdf-highlight-"]')) return true;
  return false;
}

function createStickyNote(rect, initialText = '') {
  const t = getT();
  const note = document.createElement('div');
  note.className = 'pdf-sticky-note';
  note.style.top = `${window.scrollY + (rect.top || 100) + 20}px`;
  note.style.left = `${Math.min(window.innerWidth - 240, window.scrollX + (rect.left || 100))}px`;

  note.innerHTML = `
    <div class="pdf-note-header">
      <span>${t.noteTitle}</span>
      <button type="button" class="pdf-note-close">✕</button>
    </div>
    <textarea class="pdf-note-textarea" placeholder="${t.notePlaceholder}">${initialText}</textarea>
  `;

  const textarea = note.querySelector('.pdf-note-textarea');
  textarea.addEventListener('change', () => {
    saveAnnotation({ type: 'note', text: textarea.value, timestamp: new Date().toLocaleString() });
  });

  note.querySelector('.pdf-note-close').addEventListener('click', () => {
    note.remove();
  });

  document.body.appendChild(note);
  textarea.focus();
}

async function saveAnnotation(item) {
  const key = getStorageKey();
  const data = await chrome.storage.local.get(key);
  const list = data[key] || [];
  list.push(item);
  await chrome.storage.local.set({ [key]: list });
}

async function exportAnnotations() {
  const t = getT();
  const key = getStorageKey();
  const data = await chrome.storage.local.get(key);
  const list = data[key] || [];

  if (!list.length) {
    alert(t.noNotes);
    return;
  }

  let md = `# Notes & Highlights\n**Page:** ${window.location.href}\n**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;
  list.forEach((item, i) => {
    if (item.type === 'highlight') {
      md += `### ${i + 1}. Highlight (${item.color})\n> "${item.text}"\n*Added: ${item.timestamp}*\n\n`;
    } else {
      md += `### ${i + 1}. Note\n${item.text}\n*Added: ${item.timestamp}*\n\n`;
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes_${document.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// 🖱️ Mouse Up ile Seçim Yakalama ve Menü Konumlandırma
document.addEventListener('mouseup', async (e) => {
  if (selectionPopup && selectionPopup.contains(e.target)) return;

  const { pdfNotesEnabled = true } = await chrome.storage.local.get('pdfNotesEnabled');
  if (!pdfNotesEnabled) return;

  setTimeout(async () => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) {
      currentSelectedText = sel.toString().trim();
      savedRange = sel.getRangeAt(0);
      const rect = savedRange.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const popup = getOrCreateSelectionPopup();
      
      // Vurgu varsa "Vurguyu Kaldır" butonunu göster
      const removeBtn = popup.querySelector('#gxRemoveHighlightBtn');
      if (removeBtn) {
        removeBtn.style.display = hasHighlightInRange(savedRange) ? 'inline-flex' : 'none';
      }

      // Akıllı Dönüştürücü Kontrolü
      const insight = getSmartInsight(currentSelectedText);
      const smartBar = popup.querySelector('#gxSmartBar');
      const smartIcon = popup.querySelector('#gxSmartIcon');
      const smartText = popup.querySelector('#gxSmartText');

      if (insight) {
        smartIcon.textContent = insight.icon;
        smartText.textContent = insight.text;
        smartBar.style.display = 'flex';
      } else {
        smartBar.style.display = 'none';
      }

      popup.style.display = 'flex';
      const popupRect = popup.getBoundingClientRect();
      
      let top = window.scrollY + rect.top - popupRect.height - 10;
      let left = window.scrollX + rect.left + (rect.width / 2) - (popupRect.width / 2);

      // Üste sığmıyorsa seçimin altına al
      if (rect.top - popupRect.height - 10 < 8) {
        top = window.scrollY + rect.bottom + 10;
      }

      // Sağ ve sol taşma engeli
      if (left < 10) left = 10;
      else if (left + popupRect.width > window.scrollX + window.innerWidth - 10) {
        left = window.scrollX + window.innerWidth - popupRect.width - 10;
      }

      popup.style.top = `${Math.round(top)}px`;
      popup.style.left = `${Math.round(left)}px`;
      popup.classList.add('active');
    } else {
      hideSelectionPopup();
    }
  }, 10);
});

// Dışarı tıklandığında menüyü gizle
document.addEventListener('mousedown', (e) => {
  if (selectionPopup && !selectionPopup.contains(e.target)) {
    hideSelectionPopup();
  }
});


// --- 3. EVRENSEL LINK TESPITI VE SADE SEKME ROZETI ---
function scheduleDismiss(delay = 250) {
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    if (!isHoveringTarget && !isHoveringBadge) removeBadge();
  }, delay);
}

function cancelDismiss() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

function getOrCreateBadge() {
  if (activeBadge && document.body.contains(activeBadge)) return activeBadge;

  const badge = document.createElement('div');
  badge.className = 'gx-tab-indicator-badge';
  badge.innerHTML = `
    <div class="gx-tab-pill">
      <span>#</span><span class="gx-tab-num">1</span>
    </div>
    <span class="gx-badge-title">Sekme</span>
    <span class="gx-badge-icon">↗</span>
  `;

  badge.addEventListener('mouseenter', () => {
    isHoveringBadge = true;
    cancelDismiss();
  }, { passive: true });

  badge.addEventListener('mouseleave', () => {
    isHoveringBadge = false;
    scheduleDismiss(250);
  }, { passive: true });

  document.body.appendChild(badge);
  activeBadge = badge;
  return badge;
}

function removeBadge() {
  cancelDismiss();

  if (activeMatchedTabId) {
    chrome.runtime.sendMessage({
      type: 'STOP_TAB_PULSE',
      tabId: activeMatchedTabId
    }).catch(() => {});
    activeMatchedTabId = null;
  }

  if (activeBadge) {
    activeBadge.classList.remove('gx-visible');
    setTimeout(() => {
      if (activeBadge && !activeBadge.classList.contains('gx-visible') && activeBadge.parentNode) {
        activeBadge.remove();
        activeBadge = null;
      }
    }, 120);
  }
}

function positionBadge(targetEl, badgeEl) {
  const rect = targetEl.getBoundingClientRect();
  const badgeRect = badgeEl.getBoundingClientRect();

  let top = rect.top - badgeRect.height - 6;
  let left = rect.left + (rect.width / 2) - (badgeRect.width / 2);

  if (top < 6) top = rect.bottom + 6;
  if (left < 6) left = 6;
  else if (left + badgeRect.width > window.innerWidth - 6) {
    left = window.innerWidth - badgeRect.width - 6;
  }

  badgeEl.style.top = `${Math.round(top)}px`;
  badgeEl.style.left = `${Math.round(left)}px`;
}

async function checkUrlIsOpen(url) {
  if (!url) return { isOpen: false };
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'CHECK_URL',
      url: url
    });
    return response || { isOpen: false };
  } catch (e) {
    return { isOpen: false };
  }
}

function extractUrlFromElement(target) {
  if (!target || target === document.body || target === document.documentElement) return null;

  // 1. YouTube video kartları (Tüm thumbnail ve başlık linkleri)
  const ytCard = target.closest('ytd-rich-grid-media, ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-reel-item-renderer, ytd-notification-renderer, ytd-playlist-renderer, ytd-thumbnail, #thumbnail, a.ytd-thumbnail');
  if (ytCard) {
    const ytLink = ytCard.matches('a[href]') ? ytCard : ytCard.querySelector('a#thumbnail[href], a#video-title[href], a#video-title-link[href], a.yt-simple-endpoint[href], a[href*="/watch"], a[href*="/shorts/"], a[href]');
    if (ytLink) {
      const rawHref = ytLink.getAttribute('href') || ytLink.href;
      if (isValidHref(rawHref)) {
        return { el: ytCard, url: resolveFullUrl(rawHref) };
      }
    }
  }

  // 2. Standart <a> linkleri
  const anchor = target.closest('a[href]');
  if (anchor) {
    const rawHref = anchor.getAttribute('href') || anchor.href;
    if (isValidHref(rawHref)) {
      return { el: anchor, url: resolveFullUrl(rawHref) };
    }
  }

  // 3. Amazon Kartları
  const amazonCard = target.closest('div[data-asin], div.s-result-item, div[data-component-type="s-search-result"]');
  if (amazonCard && amazonCard.getAttribute('data-asin')) {
    const amzLink = amazonCard.querySelector('a[href*="/dp/"], a[href*="/gp/product/"], a.a-link-normal[href]');
    if (amzLink) {
      const rawHref = amzLink.getAttribute('href') || amzLink.href;
      if (isValidHref(rawHref)) {
        return { el: amazonCard, url: resolveFullUrl(rawHref) };
      }
    }
  }

  // 4. data-href / data-url / role="link"
  let curr = target;
  for (let i = 0; i < 3 && curr && curr !== document.body; i++) {
    const dataUrl = curr.getAttribute('data-href') || curr.getAttribute('data-url') || curr.getAttribute('data-target-url') || curr.getAttribute('data-permalink');
    if (dataUrl && isValidHref(dataUrl)) return { el: curr, url: resolveFullUrl(dataUrl) };

    if (curr.getAttribute('role') === 'link') {
      const href = curr.getAttribute('href') || curr.getAttribute('data-url');
      if (href && isValidHref(href)) return { el: curr, url: resolveFullUrl(href) };
    }
    curr = curr.parentElement;
  }

  return null;
}

function isValidHref(href) {
  if (!href) return false;
  const trimmed = href.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('javascript:') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return false;
  return true;
}

function resolveFullUrl(rawHref) {
  try {
    return new URL(rawHref, window.location.href).href;
  } catch (e) {
    return rawHref;
  }
}

// Click dismissal
document.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    isHoveringTarget = false;
    isHoveringBadge = false;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    removeBadge();
  }
}, { capture: true, passive: true });

document.addEventListener('auxclick', (e) => {
  if (e.button === 1) {
    isHoveringTarget = false;
    isHoveringBadge = false;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    removeBadge();
  }
}, { capture: true, passive: true });

document.addEventListener('mouseover', (e) => {
  if (e.button === 1 || e.buttons === 4) return;

  const match = extractUrlFromElement(e.target);
  if (!match || !match.url) return;

  isHoveringTarget = true;
  cancelDismiss();

  if (hoverTimeout) clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(async () => {
    const res = await checkUrlIsOpen(match.url);
    if (res && res.isOpen && res.tab) {
      requestAnimationFrame(() => {
        if (!isHoveringTarget && !isHoveringBadge) return;
        activeMatchedTabId = res.tab.id;

        const badge = getOrCreateBadge();
        const tabNumEl = badge.querySelector('.gx-tab-num');
        const titleEl = badge.querySelector('.gx-badge-title');

        if (tabNumEl) tabNumEl.textContent = res.tab.index;
        if (titleEl) titleEl.textContent = res.tab.title || 'Sekme';

        badge.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          chrome.runtime.sendMessage({
            type: 'SWITCH_TO_TAB',
            tabId: res.tab.id,
            windowId: res.tab.windowId
          });
        };

        positionBadge(match.el, badge);
        badge.classList.add('gx-visible');
      });
    }
  }, 50);
}, { passive: true });

document.addEventListener('mouseout', (e) => {
  const match = extractUrlFromElement(e.target);
  if (match) {
    if (e.relatedTarget && (match.el.contains(e.relatedTarget) || (activeBadge && activeBadge.contains(e.relatedTarget)))) {
      return;
    }
    isHoveringTarget = false;
    scheduleDismiss(250);
  }
}, { passive: true });

window.addEventListener('scroll', () => {
  isHoveringTarget = false;
  isHoveringBadge = false;
  removeBadge();
}, { passive: true });

window.addEventListener('blur', () => {
  isHoveringTarget = false;
  isHoveringBadge = false;
  removeBadge();
}, { passive: true });
