# 🦁 Better Brave Suite

> **Power-up your browser with Opera GX style sound effects, smart tab management & snoozing, live RAM/CPU monitor, and a minimalist freeform new tab dashboard.**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-38bdf8?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-emerald?style=flat-square)](https://github.com/dev-aaw/better-brave)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)
[![Zero Data Collection](https://img.shields.io/badge/Privacy-100%25%20Local-blueviolet?style=flat-square)](PRIVACY.md)

---

## 🌟 Overview

**Better Brave** is a lightweight, privacy-focused, open-source productivity suite and browser enhancement for Brave and Chromium-based browsers. Built with Manifest V3 and pure Web APIs, it delivers a high-performance experience with near-zero CPU and memory footprint.

---

## ✨ Key Features

### 🎵 1. Opera GX Style Sound Enhancer (Web Audio API)
* Crisp, low-latency audio feedback when opening and closing tabs.
* Built-in sound synthesis profiles: **Pop**, **GX Click**, **Chime**, **Woosh**.
* Custom audio support: Upload your own MP3 / WAV audio files.

### 🚀 2. Intelligent Tab & Memory Management
* **💤 Smart Tab Snoozer:** Automatically sleeps inactive background tabs, freeing up to **60% RAM**.
* **🧹 Close Duplicate Tabs:** One-click detection and cleanup of duplicate URLs across all windows.
* **⚡ One-Click RAM Flush:** Instantly freeze unused background tabs to recover system memory.
* **🏷️ Smart Tab Grouping:** Automatically group and color-code tabs from the same domain or custom categories.
* **🔍 Fast Tab Search (`Ctrl + Shift + F`):** Instantly search and jump between hundreds of open tabs with fuzzy filtering.

### ⚡ 3. Real-Time RAM & CPU Toolbar Badge
* Live memory usage percentage directly on the extension toolbar icon with dynamic status coloring (Green 🟢 / Yellow 🟡 / Red 🔴).
* Multi-core CPU load and memory usage breakdown.

### 🔗 4. Universal Open Link Detector (Link Glow)
* Hovering any link or YouTube video thumbnail shows a badge if that link is already open in another tab.
* Click the badge to jump straight to that tab and avoid creating clutter.

### 🎶 5. Audio Playing Indicator
* Animated musical note (`🎵 🎶 🎧`) in the title of tabs actively playing audio or video.

### 📑 6. PDF & Web Page Highlighter + Sticky Notes
* Select text on any web page or PDF to highlight in Yellow, Blue, or Green.
* Attach sticky notes and export all annotations as Markdown (`.md`) with one click.

### 🖼️ 7. Minimalist Freeform New Tab Dashboard
* **Smart Magnetic Snapping:** Drag and drop widgets anywhere on the screen with smart alignment guidelines.
* **Frameless Minimalist Look:** Zero-clutter aesthetic that blends seamlessly with any background.
* Digital & Analog clock with world clocks and live weather forecasts.
* Speed Dial shortcuts with auto-detected high-res favicons.
* Lightweight To-Do checklist and custom HD/4K wallpaper support.

---

## 🛠️ Installation (Developer Mode / Manual)

1. Clone this repository:
   ```bash
   git clone https://github.com/dev-aaw/better-brave.git
   ```
2. Navigate to your browser's extensions page:
   * **Brave:** `brave://extensions`
   * **Chrome:** `chrome://extensions`
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `better-brave` folder.
5. Open a new tab (`Ctrl + T`) to explore your upgraded dashboard!

---

## 🔒 Privacy & Security

Better Brave is **100% private and offline-first**:
* **Zero Telemetry:** No tracking, no user analytics, no data harvesting.
* **100% Local Storage:** All your shortcuts, notes, and preferences are stored exclusively on your device via `chrome.storage.local`.
* For details, see [PRIVACY.md](PRIVACY.md).

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.
