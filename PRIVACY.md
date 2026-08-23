# Privacy Policy — Better Brave

*Last Updated: 2026-08-23*

Better Brave is an open-source, privacy-first browser extension created to enhance tab productivity, sound feedback, and new tab dashboard customization.

### 1. Data Collection & Transmission
- **Zero Personal Data Collected:** Better Brave does not collect, record, track, or transmit any personal data, browsing history, URLs visited, IP addresses, search queries, or device information.
- **No Third-Party Analytics:** There are no tracking scripts, analytics libraries (e.g. Google Analytics), ads, or telemetry embedded in the extension.

### 2. Local Storage Use
- All user preferences, custom shortcuts, to-do checklist items, world cities, custom sound effects, and wallpaper settings are stored **100% locally on your computer** using the browser's `chrome.storage.local` and `IndexedDB` APIs.
- Your data never leaves your device.

### 3. Permissions Usage
- **`tabs` & `tabGroups`:** Used strictly locally to count tabs, detect audio playback, manage groups, and search tabs.
- **`system.memory` & `system.cpu`:** Used locally to calculate RAM and CPU percentage for the dashboard and badge.
- **`offscreen`:** Used to play Web Audio sound effects.
- **`host_permissions: ["<all_urls>"]`:** Used locally by the content script for hover link detection and page text highlighter.

### 4. Open Source & Auditing
Better Brave is open source. You can inspect the entire codebase on GitHub.

### 5. Contact
For any questions, open an issue on the GitHub repository.
