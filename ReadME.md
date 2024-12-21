# TwitchLatencyGuard

**TwitchLatencyGuard** is a Chrome extension designed to help manage and reduce latency on Twitch streams. It detects high latency and automatically applies a user-defined method for fast-forwarding to the live edge—ensuring you stay as close to real-time as possible.

> **Important**: Due to recent changes Twitch made to the channel metadata layout, **FrankerFaceZ** (FFZ) users must manually revert to an older layout variant for Playback Statistics to function in certain circumstances. See [FrankerFaceZ Requirements](#frankerfacez-requirements) below.

## Features

- **Real-Time Latency Detection**: Monitors Twitch’s built-in latency metrics (exposed by FrankerFaceZ).
- **User-Configurable Threshold**: Automatically triggers fast-forward actions if latency exceeds your chosen threshold.
- **Fast-Forward Methods**:
  1. **Seek to Live Edge** (Default & Currently Recommended)
  2. **Change Video Quality**
  3. **Reload Video Element**
  4. **Adjust Playback Rate**
  5. **Reinitialize Player**  

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [FrankerFaceZ Requirements](#frankerfacez-requirements)  
4. [Usage](#usage)  
5. [Configuration](#configuration)  
6. [Technical Overview](#technical-overview)  
7. [Contributing](#contributing)  
8. [License](#license)  

---

## Prerequisites

1. **Google Chrome** (or another Chromium-based browser supporting Manifest V3).
2. **FrankerFaceZ (FFZ)** extension installed.  
   - Within FFZ, you must enable the **Playback Statistics** feature.

## Installation

1. Clone or download this repository.
2. Open the Chrome Extensions page:
   - Navigate to `chrome://extensions/` (or via **More Tools** → **Extensions**).
   - Enable **Developer Mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the folder containing `manifest.json`.

The extension will now appear in your extensions list as **Twitch Latency Guard**.

## FrankerFaceZ Requirements

1. Make sure **FrankerFaceZ** is installed and **Playback Statistics** is enabled:
   - Go to **FrankerFaceZ Control Center** → **Add-Ons** → **Playback Statistics** → ensure it is **On**.
   - This ensures the extension can read the “Latency To Broadcaster” information from Twitch.

2. **Switch the channel metadata layout** if needed:
   - Open **FrankerFaceZ Control Center** → **Experiments** → find `web_channel_metadata_layout`.
   - Change the dropdown from **variant 1** to **control 1**.
   - Twitch’s new default layout (variant 1) sometimes hides the *Playback Statistics* field. By forcing **control 1**, you restore the older layout where the extension can see the latency value.

## Usage

- **Seek to Live Edge** is the **only currently working** or reliable method. Other methods may require additional testing or may be prone to breakage with future Twitch updates.
- If your latency crosses the threshold (default 1.5 seconds), the extension will attempt to bring you back to near real-time:
  1. **Seek to Live Edge**: Instantly jumps the video time to the latest available buffer.
  2. [Other methods may become stable or remain experimental in the future.]

### Quick Start

1. Go to a Twitch channel with a live stream.
2. Ensure **Playback Statistics** is visible (see above instructions).
3. Access the extension’s popup by clicking the **TwitchLatencyGuard** icon in your browser toolbar.
4. Set your **Latency Threshold** (seconds).
5. Select your **Fast Forward Method** (we recommend **Seek to Live Edge**).
6. Click **Save**.

Now, when your latency climbs above the set threshold, TwitchLatencyGuard will automatically correct it.

## Configuration

In the extension’s **popup.html**:

- **Latency Threshold**: The number of seconds of delay at which you consider your stream to be too far behind live.
- **Fast Forward Method**:  
  - *seek*: Seeks the video to the live edge (recommended).
  - *quality*: Changes the video quality (and reverts it) to force a rebuffer.
  - *reload*: Reloads the video element.
  - *speedup*: Temporarily speeds up the video playback rate.
  - *reinit*: Reinitializes the entire Twitch player.

These settings are stored via Chrome’s `chrome.storage.sync` API so they remain consistent across your devices (if synced).

## Technical Overview

- **content.js**:  
  - Injected into every `*.twitch.tv` page.  
  - Listens for Twitch’s built-in timeupdate events to measure latency (via FrankerFaceZ’s “Latency To Broadcaster” metric).
  - If latency exceeds the user’s threshold, triggers the selected fast-forward method.

- **popup.js** & **popup.html**:  
  - Provide the user interface to configure the extension’s settings.
  - Persist settings via `chrome.storage.sync`.

- **background.js**:  
  - Handles messages from content scripts requesting stored configuration.

- **manifest.json**:  
  - Chrome Extension Manifest V3 specification.
  - Declares permissions, content scripts, and the extension’s metadata.

### File-by-File

- **content.js**: Core logic, injection points, event handlers, fast-forward methods.
- **popup.html**: Simple HTML settings page (Latency threshold, method dropdown, etc.).
- **popup.js**: Manages the saving and loading of settings from `chrome.storage`.
- **background.js**: Service worker for handling asynchronous Chrome messages.
- **styles.css**: (Optional) Provide UI styling for the popup.

## Contributing

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

I welcome any improvements or bug fixes!

## License

```
Copyright (C) 2024 [Tim Jason Weber]
All rights reserved.

1. License Terms
Redistribution, use, and modification of this software in source or binary forms are strictly prohibited without the prior written consent of [T. Jason Weber]. This software is provided solely for personal and educational purposes. Commercial use of the software, in whole or in part, is expressly forbidden without explicit permission.

- **Private, Non-Commercial Use**: Private individuals are permitted to experiment, modify, and create forks of this software for personal, non-commercial purposes only. Any redistribution of these modifications or forks is prohibited without explicit permission.

2. Attribution
Any authorized use of this software must provide proper credit to [Tim Jason Weber], including attribution in any derivative works, presentations, or other related materials.

3. No Warranty
This software is provided "AS IS," without any express or implied warranties, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. The author is not liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruptions) arising in any way from the use of this software.

4. Jurisdiction
This agreement is governed by the laws of Germany/Bavaria. Any disputes arising under or in connection with this agreement shall be subject to the exclusive jurisdiction of the courts of Germany/Bavaria.

5. Modification and Updates
The author reserves the right to update, modify, or revoke this license at any time without prior notice.
```

---

*Thank you for using **TwitchLatencyGuard**! I hope it helps keep your viewing experience smooth and latency-free.*