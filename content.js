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


// --- 2. PDF / WEB NOT ALMA VE METIN HIGHLIGHT ---
let annotatorToolbar = null;
let savedRange = null;

function getStorageKey() {
  return `annot_${encodeURIComponent(window.location.origin + window.location.pathname)}`;
}

function getOrCreateAnnotatorToolbar() {
  if (annotatorToolbar && document.body.contains(annotatorToolbar)) return annotatorToolbar;

  const bar = document.createElement('div');
  bar.className = 'pdf-annotator-toolbar';
  bar.innerHTML = `
    <button class="pdf-tool-btn" data-color="yellow" title="Sarı Vurgula"><span class="color-swatch swatch-yellow"></span></button>
    <button class="pdf-tool-btn" data-color="blue" title="Mavi Vurgula"><span class="color-swatch swatch-blue"></span></button>
    <button class="pdf-tool-btn" data-color="green" title="Yeşil Vurgula"><span class="color-swatch swatch-green"></span></button>
    <button class="pdf-tool-btn" id="pdfAddNoteBtn" title="Not Ekle">📝</button>
    <button class="pdf-tool-btn" id="pdfExportBtn" title="Notları Dışa Aktar">💾</button>
  `;

  bar.querySelectorAll('.pdf-tool-btn[data-color]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyHighlight(btn.dataset.color);
      bar.classList.remove('active');
    });
  });

  bar.querySelector('#pdfAddNoteBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    createStickyNote(savedRange ? savedRange.getBoundingClientRect() : { top: 100, left: 100 });
    bar.classList.remove('active');
  });

  bar.querySelector('#pdfExportBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    exportAnnotations();
    bar.classList.remove('active');
  });

  document.body.appendChild(bar);
  annotatorToolbar = bar;
  return bar;
}

function applyHighlight(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return;

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
      <button class="pdf-note-close">✕</button>
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
      md += `### ${i + 1}. Vurgulanan Metin (${item.color})\n> "${item.text}"\n*Eklenme: ${item.timestamp}*\n\n`;
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

document.addEventListener('mouseup', async () => {
  const { pdfNotesEnabled = true } = await chrome.storage.local.get('pdfNotesEnabled');
  if (!pdfNotesEnabled) return;

  const sel = window.getSelection();
  if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) {
    savedRange = sel.getRangeAt(0);
    const rect = savedRange.getBoundingClientRect();
    const toolbar = getOrCreateAnnotatorToolbar();
    
    toolbar.style.top = `${Math.max(10, window.scrollY + rect.top - 42)}px`;
    toolbar.style.left = `${Math.min(window.innerWidth - 180, window.scrollX + rect.left + (rect.width / 2) - 80)}px`;
    toolbar.classList.add('active');
  } else {
    if (annotatorToolbar) annotatorToolbar.classList.remove('active');
  }
}, { passive: true });


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
