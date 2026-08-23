# Chrome Web Store Submission Guide — Better Brave

*Last Updated: 2026-08-23*
*Extension Version: 1.6.0*

---

## 1. Store Listing Metadata

### Extension Title
```text
Better Brave — Tab Manager, Sound Effects & Minimalist Dashboard
```

### Short Description (Max 132 chars)
```text
Enhance Brave & Chrome: Opera GX style sound effects, smart tab grouping & snoozing, RAM/CPU monitor, PDF notes, and custom new tab.
```

### Detailed Description (Markdown format for Web Store)
```markdown
⚡ **Better Brave** transforms your browsing experience with powerful tab management, dynamic sound feedback, real-time performance monitoring, and a fully customizable minimalist new tab dashboard.

---

### ✨ Core Features:

🎵 **Opera GX Style Sound Enhancer**
- Crisp synthesized sound feedback on tab open and tab close.
- Multiple built-in audio profiles: Pop, GX Click, Chime, Woosh.
- Custom audio support: Upload your own MP3/WAV sound effects.

🚀 **Intelligent Tab & Memory Management**
- **Smart Tab Snoozer:** Automatically freezes inactive background tabs to save up to 60% RAM.
- **Duplicate Tab Cleaner:** One-click detection and removal of duplicate open tabs.
- **One-Click Memory Release:** Instantly release RAM occupied by unused background tabs.
- **Smart Domain Grouping:** Auto-group tabs by website with color coding.
- **Instant Tab Search (Ctrl+Shift+F):** Find and jump to any open tab across all windows in milliseconds.

⚡ **Real-Time RAM & CPU Toolbar Badge**
- Live memory percentage directly on your browser toolbar icon with dynamic status coloring (Green / Yellow / Red).
- Instant multi-core CPU usage monitoring.

🔗 **Open Link Detector (Link Glow & Tab Indicator)**
- Hovering any link or video thumbnail shows a badge if that link is already open in another tab.
- Click the badge to jump straight to that tab without creating duplicate tabs.

🎵 **Audio Playing Indicator**
- Live musical note animation (🎵 🎶 🎧) in the tab title of any tab actively playing sound.

📑 **PDF & Web Highlighter with Sticky Notes**
- Highlight text directly on web pages and PDFs in multiple colors (Yellow, Blue, Green).
- Add sticky notes and export all highlights/notes to Markdown (`.md`) with one click.

🖼️ **Minimalist Freeform New Tab Dashboard**
- Drag and drop widgets anywhere on the screen with smart magnetic snapping.
- Clean digital/analog clock and live multi-city weather.
- Speed Dial shortcut tiles with automatic high-res favicons.
- Built-in lightweight To-Do & notes checklist.
- Custom wallpaper background engine (supports high-res images).

---

### 🔒 100% Private & Open Source
- **Zero telemetry & zero data collection:** All your settings, notes, and shortcuts stay strictly on your local computer.
- **No external analytics or tracking scripts.**
- **Open-source on GitHub:** Transparent and auditable code.
```

### Categories
- **Primary Category:** Productivity
- **Secondary Category:** User Interface & System Tools

---

## 2. Permissions Justifications (For Google Review Team)

Every permission declared in `manifest.json` is justified below for copy-pasting into the Developer Dashboard:

| Permission | Review Justification (English) |
|---|---|
| `tabs` | Required to read tab titles, detect audio playback status, navigate between open tabs during search, highlight open links, and suspend inactive tabs in Tab Snoozer. |
| `tabGroups` | Required to organize and color-code open tabs automatically by domain or custom preset groups. |
| `offscreen` | Required in Manifest V3 to play synthesized Web Audio sound effects and custom user audio files when tabs open/close. |
| `storage` | Required to save user preferences, custom shortcuts, to-do list items, world cities, and extension toggles locally. |
| `unlimitedStorage` | Required to store high-resolution custom background wallpaper images and custom audio files locally without quota errors. |
| `scripting` | Required to render the non-intrusive audio playing note animation and link glow pulse indicator in tab titles. |
| `system.memory` | Required to calculate real-time system RAM usage for the live toolbar badge and dashboard system widget. |
| `system.cpu` | Required to monitor processor load across CPU cores for the dashboard system widget. |
| `host_permissions: ["<all_urls>"]` | Required for the content script to detect open link hovers, enable Auto Picture-in-Picture on video elements, and support the PDF/web page highlighter across web pages. |

---

## 3. Privacy & Data Use Disclosures

- **Does this extension collect or transmit user data?** `No`
- **Does this extension sell or transfer user data to third parties?** `No`
- **Does this extension use remote code execution (eval)?** `No`
- **Single Purpose Compliance:** `Yes — Browser enhancement, tab productivity, audio feedback, and new tab dashboard customization.`

---

## 4. Web Store Asset Requirements

1. **Icons (Included in repository):**
   - `icons/icon-16.png` (16×16px)
   - `icons/icon-32.png` (32×32px)
   - `icons/icon-48.png` (48×48px)
   - `icons/icon-128.png` (128×128px)

2. **Screenshots (Prepare before upload):**
   - Minimum 1 screenshot (1280×800px or 640×400px).
   - Recommended:
     1. New Tab Dashboard with widgets & wallpaper.
     2. Better Brave Control Center (Ayarlar Modalı).
     3. Popup Panel (Tab Search, Audio Controller, Grouping).
     4. Open Link Detector badge & PDF Annotator.
