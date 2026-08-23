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

function getStorageKey() {
  return 'notes_' + encodeURIComponent(window.location.origin + window.location.pathname);
}

// 🧠 Akıllı Dönüştürücü & Hesaplayıcı (Para Birimi, Birimler, Saat, Matematik)
function getSmartInsight(text) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed.length > 50) return null;

  // 1. Matematik Hesaplama (Örn: "120 * 4", "50 + 25 / 5", "100 * 1.20")
  if (/^[\d\s\+\-\*/\(\)\.\,]+$/.test(trimmed) && /[\+\-\*/]/.test(trimmed) && /\d/.test(trimmed)) {
    try {
      const sanitized = trimmed.replace(/,/g, '.');
      // Secure safe basic calculation
      const mathResult = Function('"use strict"; return (' + sanitized + ')')();
      if (typeof mathResult === 'number' && !isNaN(mathResult) && isFinite(mathResult)) {
        return { icon: '🧮', text: `= ${Number(mathResult.toFixed(4))}` };
      }
    } catch (e) {}
  }

  // 2. Para Birimi (USD, EUR, GBP, JPY -> TRY)
  const currencyMatch = trimmed.match(/^([$€£¥₺])\s*([\d,.]+)|([\d,.]+)\s*(usd|eur|gbp|jpy|try|tl|dolar|euro|sterlin)$/i);
  if (currencyMatch) {
    const sym = (currencyMatch[1] || currencyMatch[4] || '').toLowerCase();
    const numStr = (currencyMatch[2] || currencyMatch[3] || '').replace(/,/g, '');
    const val = parseFloat(numStr);
    if (!isNaN(val) && val > 0) {
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

  // 3. Ölçü Birimleri (lbs, miles, ft, in, fahrenheit)
  const lbsMatch = trimmed.match(/^([\d,.]+)\s*(lbs?|pounds?)$/i);
  if (lbsMatch) {
    const val = parseFloat(lbsMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '⚖️', text: `${val} lbs = ${(val * 0.453592).toFixed(1)} kg` };
  }

  const milesMatch = trimmed.match(/^([\d,.]+)\s*(miles?|mi)$/i);
  if (milesMatch) {
    const val = parseFloat(milesMatch[1].replace(/,/g, ''));
    if (!isNaN(val)) return { icon: '📏', text: `${val} mi = ${(val * 1.60934).toFixed(1)} km` };
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

  return null;
}

// 🌐 Google Çeviri API
async function fetchTranslation(text) {
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error('Translate fetch error');
    const data = await res.json();
    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map(item => item[0]).filter(Boolean).join('');
      return translated || null;
    }
  } catch (e) {}
  return null;
}

function getOrCreateSelectionPopup() {
  if (selectionPopup && document.body.contains(selectionPopup)) return selectionPopup;

  const popup = document.createElement('div');
  popup.className = 'gx-selection-popup';
  popup.innerHTML = `
    <div class="gx-smart-insight-bar" id="gxSmartBar" style="display: none;">
      <span class="gx-smart-icon" id="gxSmartIcon">💱</span>
      <span class="gx-smart-text" id="gxSmartText">--</span>
    </div>

    <div class="gx-popup-actions-row">
      <button type="button" class="gx-action-btn" id="gxSearchBtn" title="Web'de Ara">
        <span class="gx-btn-icon">🔍</span>
        <span class="gx-btn-label">Ara</span>
      </button>

      <button type="button" class="gx-action-btn" id="gxCopyBtn" title="Metni Kopyala">
        <span class="gx-btn-icon">📋</span>
        <span class="gx-btn-label">Kopyala</span>
      </button>

      <button type="button" class="gx-action-btn" id="gxTranslateBtn" title="Türkçeye Çevir">
        <span class="gx-btn-icon">🌐</span>
        <span class="gx-btn-label">Çevir</span>
      </button>

      <div class="gx-popup-divider"></div>

      <div class="gx-highlighter-group">
        <button type="button" class="gx-color-btn swatch-yellow" data-color="yellow" title="Sarı Vurgula"></button>
        <button type="button" class="gx-color-btn swatch-blue" data-color="blue" title="Mavi Vurgula"></button>
        <button type="button" class="gx-color-btn swatch-green" data-color="green" title="Yeşil Vurgula"></button>
      </div>

      <button type="button" class="gx-action-btn-icon-only" id="gxStickyNoteBtn" title="Not Ekle">
        <span>📝</span>
      </button>

      <button type="button" class="gx-action-btn-icon-only" id="gxExportNotesBtn" title="Notları Dışa Aktar (.md)">
        <span>💾</span>
      </button>
    </div>

    <div class="gx-translation-card" id="gxTransCard" style="display: none;">
      <div class="gx-trans-header">
        <span class="gx-trans-lang-badge">🇹🇷 Türkçe Çeviri</span>
        <button type="button" class="gx-trans-close-btn" id="gxCloseTransBtn">✕</button>
      </div>
      <div class="gx-trans-content" id="gxTransContent">Çevriliyor...</div>
      <div class="gx-trans-footer">
        <button type="button" class="gx-trans-action-btn" id="gxCopyTransBtn">📋 Kopyala</button>
        <button type="button" class="gx-trans-action-btn" id="gxOpenTransTabBtn">Google Çeviri ↗</button>
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
        label.textContent = '✓ Kopyalandı';
        popup.querySelector('#gxCopyBtn').style.color = '#4ade80';
        setTimeout(() => {
          label.textContent = 'Kopyala';
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

    transCard.style.display = 'flex';
    transContent.textContent = 'Çevriliyor...';

    const result = await fetchTranslation(currentSelectedText);
    if (result) {
      transContent.textContent = result;
    } else {
      transContent.textContent = 'Çeviri alınamadı. Google Çeviri sekmesinde açabilirsiniz.';
    }
  });

  closeTransBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    transCard.style.display = 'none';
  });

  copyTransBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const textToCopy = transContent.textContent;
    if (textToCopy && textToCopy !== 'Çevriliyor...') {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyTransBtn.textContent = '✓ Kopyalandı';
        setTimeout(() => { copyTransBtn.textContent = '📋 Kopyala'; }, 1000);
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

  // 5. Not Ekle Butonu
  popup.querySelector('#gxStickyNoteBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    createStickyNote(savedRange ? savedRange.getBoundingClientRect() : { top: 100, left: 100 });
    hideSelectionPopup();
  });

  // 6. Notları Dışa Aktar Butonu
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

  try {
    range.deleteContents();
    range.insertNode(span);
    saveAnnotation({ type: 'highlight', text, color, timestamp: new Date().toLocaleString('tr-TR') });
  } catch (e) {}

  sel.removeAllRanges();
}

function createStickyNote(rect, initialText = '') {
  const note = document.createElement('div');
  note.className = 'pdf-sticky-note';
  note.style.top = `${window.scrollY + (rect.top || 100) + 20}px`;
  note.style.left = `${Math.min(window.innerWidth - 240, window.scrollX + (rect.left || 100))}px`;

  note.innerHTML = `
    <div class="pdf-note-header">
      <span>📝 Not</span>
      <button type="button" class="pdf-note-close">✕</button>
    </div>
    <textarea class="pdf-note-textarea" placeholder="Notunuzu buraya yazın...">${initialText}</textarea>
  `;

  const textarea = note.querySelector('.pdf-note-textarea');
  textarea.addEventListener('change', () => {
    saveAnnotation({ type: 'note', text: textarea.value, timestamp: new Date().toLocaleString('tr-TR') });
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
  const key = getStorageKey();
  const data = await chrome.storage.local.get(key);
  const list = data[key] || [];

  if (!list.length) {
    alert('Bu sayfada henüz kaydedilmiş not bulunmuyor.');
    return;
  }

  let md = `# Belge Notları & Vurguları\n**Sayfa:** ${window.location.href}\n**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n---\n\n`;
  list.forEach((item, i) => {
    if (item.type === 'highlight') {
      md += `### ${i + 1}. Vurgulanan Metin (${item.color})\n> "${item.text}"\n*Eklenme: ${item.timestamp}*

`;
    } else {
      md += `### ${i + 1}. Not\n${item.text}\n*Eklenme: ${item.timestamp}*\n\n`;
    }
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notlar_${document.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// 🖱️ Mouse Up ile Seçim Yakalama ve Menü Konumlandırma
document.addEventListener('mouseup', async (e) => {
  if (selectionPopup && selectionPopup.contains(e.target)) return;

  const { pdfNotesEnabled = true } = await chrome.storage.local.get('pdfNotesEnabled');
  if (!pdfNotesEnabled) return;

  setTimeout(() => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) {
      currentSelectedText = sel.toString().trim();
      savedRange = sel.getRangeAt(0);
      const rect = savedRange.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const popup = getOrCreateSelectionPopup();
      
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
