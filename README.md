# Down-To-Load

A desktop application for sorting and organising your Downloads folder. Select files with a checkbox grid, pick a preset destination, and move them — all without touching File Explorer.

Built with Electron, Vue 3, and Tailwind CSS. Works fully offline. No account required.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running in Development](#running-in-development)
- [Building for Distribution](#building-for-distribution)
  - [Output Files](#output-files)
  - [Sharing with Others](#sharing-with-others)
- [Using the App](#using-the-app)
  - [First Launch — Setup Wizard](#first-launch--setup-wizard)
  - [Sorter Page](#sorter-page)
  - [Config Page](#config-page)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [IPC Architecture](#ipc-architecture)
  - [File Moving](#file-moving)
  - [Config Storage](#config-storage)
- [Supported File Types](#supported-file-types)
- [Versioning and Releasing](#versioning-and-releasing)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Visual file grid** — browse your Downloads folder as cards, sorted by most recently modified
- **Checkbox multi-select** — click any card to select it; select individual files or use "Select all"
- **Filter by type** — tabs for Images, Videos, Audio, Documents, Archives, Executables, and Other; only tabs with matching files are shown
- **Preset destinations** — configure a list of named folders (e.g. Music, Work Projects, Desktop) and move files there in one click
- **Colour-coded destinations** — each destination gets a colour you pick, making them easy to tell apart
- **Batch moves** — select as many files as you like across different types and move them all at once
- **Conflict handling** — if a file with the same name already exists at the destination, it is automatically renamed (`file (1).ext`, `file (2).ext`, etc.) rather than overwriting
- **Cross-drive support** — moving files between different drives (e.g. C: to D:) uses a copy-then-delete fallback automatically
- **Editable config** — settings are stored as plain `config.json` that you can open and edit in any text editor
- **No internet required** — runs entirely offline; no telemetry, no accounts, no cloud

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) 30 |
| Frontend framework | [Vue 3](https://vuejs.org/) (Composition API) |
| State management | [Pinia](https://pinia.vuejs.org/) |
| Routing | [Vue Router](https://router.vuejs.org/) 4 (hash mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 3 |
| Icons | [Lucide](https://lucide.dev/) (via `lucide-vue-next`) |
| Bundler | [Vite](https://vitejs.dev/) 5 |
| Packaging | [electron-builder](https://www.electron.build/) 24 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (comes with Node.js)
- Windows 10 or Windows 11

> The app is configured to build Windows installers. Mac and Linux builds are possible but not currently configured in `package.json`.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/down-to-load.git
cd down-to-load
npm install
```

### Running in Development

```bash
npm run dev
```

This command does two things concurrently:

1. Starts the **Vite dev server** on `http://localhost:5173` (hot-module reload enabled)
2. Waits for Vite to be ready, then launches **Electron** pointing at the dev server

Changes to Vue files in `src/` will hot-reload instantly. Changes to `electron/main.js` or `electron/preload.js` require restarting the command.

---

## Building for Distribution

```bash
npm run dist
```

This runs `vite build` (produces `dist/`) followed by `electron-builder` (produces `release/`).

The first build may take a few minutes as electron-builder downloads platform-specific tools. Subsequent builds are faster.

### Output Files

After a successful build, the `release/` folder contains:

| File | Description |
|---|---|
| `Down-To-Load Setup 1.0.0.exe` | NSIS installer. Installs the app like any standard Windows program, adds a Start Menu shortcut, and supports uninstallation via Add/Remove Programs. |
| `Down-To-Load 1.0.0.exe` | Portable executable. No installation needed — just run it. User config is still saved to `%APPDATA%\Down-To-Load\`. |

Both files are self-contained. The recipient needs nothing else installed (no Node.js, no runtime libraries).

### Sharing with Others

- For most people, send the **portable `.exe`** — it is a single file and requires no installation steps.
- For a more "installed" experience with a Start Menu shortcut, send the **Setup `.exe`**.
- Neither file requires an internet connection after download.

To change the version shown in the filename, update `"version"` in `package.json` before running `npm run dist`.

---

## Using the App

### First Launch — Setup Wizard

The first time you open Down-To-Load, a two-step setup wizard appears.

**Step 1 — Select your Downloads folder**

Click the folder button and navigate to the folder you want Down-To-Load to read files from. This is typically:

```
C:\Users\<your name>\Downloads
```

You can point it at any folder, not just the system Downloads folder.

**Step 2 — Add preset destinations**

Add at least one destination folder. These are the places you will sort files into. Examples:

- `Music` → `C:\Users\<name>\Music`
- `Work` → `C:\Users\<name>\Documents\Work`
- `Photos` → `D:\Photos\Unsorted`

For each destination, give it:
- A **name** — shown in the move picker and on the Config page
- A **folder path** — use the Browse button to pick it
- A **colour** — used to colour-code the destination card (click the colour swatch)

You must add at least one destination before you can proceed. You can add more at any time from the Config page.

Click **Get Started** to save your setup and go to the Sorter.

---

### Sorter Page

This is the main page of the app.

**Browsing files**

Files from your Downloads folder are displayed as a grid of cards, sorted newest-first. Each card shows:
- A coloured badge with the file extension
- The full filename (hover to see the full name if it is truncated)
- The file size
- How long ago the file was modified

**Filtering by type**

Filter tabs appear above the grid. Only categories that have matching files are shown. Click a tab to filter; click **All** to go back to the full list.

**Selecting files**

Click any card to select or deselect it. A violet border and a checkmark appear when a card is selected. You can:
- Click individual cards to build a selection
- Use **Select all** to select every file currently visible in the active filter
- Use **Deselect all** (appears after selecting all) to clear the selection
- Click **Clear** in the action bar to deselect everything

**Moving files**

Once one or more files are selected, a bar appears at the bottom of the screen showing the number of selected files and a **Move to…** button.

Click **Move to…** to open the destination picker. Choose a destination and the files are immediately moved (cut-and-pasted) to that folder. The grid refreshes automatically.

**Refreshing the list**

Click the refresh icon (↻) in the top-right of the toolbar to reload the file list. This is useful if you have moved, added, or deleted files outside of the app.

---

### Config Page

Accessible from the **Config** tab in the navigation bar.

**Downloads Folder**

Shows the currently configured source folder. Click **Change** to pick a different one. The Sorter will reload automatically.

**Preset Destinations**

Lists all your saved destinations. For each one you can:
- Click the **↗ open** icon to open the folder in File Explorer
- Click the **pencil** icon to edit the name, path, or colour
- Click the **trash** icon to delete it

To add a new destination, fill in the form at the bottom of the section:
1. Type a name
2. Click **Browse** to pick the folder (the name auto-fills from the folder name if left blank)
3. Pick a colour using the colour swatch
4. Click **+ Add Destination**

**Config File**

Click **Reveal** to open File Explorer at the location of `config.json`. You can open this file in any text editor (Notepad, VS Code, etc.) and edit it directly. The file structure is:

```json
{
  "downloadsFolder": "C:\\Users\\yourname\\Downloads",
  "destinations": [
    {
      "id": "1716000000000",
      "name": "Music",
      "path": "C:\\Users\\yourname\\Music",
      "color": "#8b5cf6"
    }
  ]
}
```

After editing `config.json` manually, restart the app for changes to take effect.

---

## Project Structure

```
down-to-load/
│
├── electron/
│   ├── main.js          # Electron main process — window creation, IPC handlers, file system operations
│   └── preload.js       # Preload script — exposes a safe window.electronAPI bridge to the renderer
│
├── src/
│   ├── main.js          # Vue app entry point — creates the app, registers Pinia and Vue Router
│   ├── App.vue          # Root component — navigation bar, router-view, notification container
│   ├── style.css        # Global styles — Tailwind directives, scrollbar styling, custom utilities
│   │
│   ├── router/
│   │   └── index.js     # Vue Router config — hash history, route definitions, setup redirect guard
│   │
│   ├── stores/
│   │   └── appStore.js  # Pinia store — holds config state, wraps load/save IPC calls
│   │
│   ├── composables/
│   │   └── useNotifications.js  # Module-level singleton toast system (success / error)
│   │
│   ├── utils/
│   │   └── fileUtils.js  # FILE_CATEGORIES map, getFileCategory(), formatFileSize(), formatDate()
│   │
│   ├── views/
│   │   ├── Setup.vue    # Two-step onboarding wizard (shown on first launch only)
│   │   ├── Sorter.vue   # Main file grid — filter tabs, card selection, move action bar + modal
│   │   └── Config.vue   # Settings — change source folder, manage destinations, reveal config file
│   │
│   └── components/
│       └── NotificationToast.vue  # Fixed-position toast stack, driven by useNotifications
│
├── index.html           # Vite HTML entry point
├── vite.config.js       # Vite config — Vue plugin, base './' for Electron file:// compatibility
├── tailwind.config.js   # Tailwind content paths
├── postcss.config.js    # PostCSS — Tailwind + Autoprefixer
└── package.json         # Scripts, devDependencies, electron-builder config
```

---

## How It Works

### IPC Architecture

Electron enforces a strict separation between the **main process** (Node.js, full OS access) and the **renderer process** (the Vue app, sandboxed like a browser).

Communication between them goes through IPC (Inter-Process Communication):

```
Vue component
    │
    ▼
window.electronAPI.someMethod()     ← exposed by preload.js via contextBridge
    │
    ▼
ipcRenderer.invoke('channel-name')  ← sends message to main process
    │
    ▼
ipcMain.handle('channel-name', ...) ← main process handles it, returns result
    │
    ▼
Promise resolves in Vue component
```

`contextIsolation: true` and `nodeIntegration: false` are enforced, meaning the Vue app has no direct access to Node.js APIs — everything goes through the explicit `window.electronAPI` bridge.

**Registered IPC channels:**

| Channel | Direction | Description |
|---|---|---|
| `get-config` | renderer → main | Read `config.json`; returns parsed object or `null` |
| `save-config` | renderer → main | Write `config.json`; returns `{ success, error? }` |
| `get-files` | renderer → main | Read all files in a folder; returns array of file metadata |
| `move-files` | renderer → main | Move an array of files to a destination folder; returns per-file results |
| `select-folder` | renderer → main | Open the native folder picker dialog; returns selected path or `null` |
| `reveal-config` | renderer → main | Show `config.json` in File Explorer |
| `open-folder` | renderer → main | Open a folder path in File Explorer |

### File Moving

Moving a file goes through this logic in `main.js`:

1. Construct the destination path from the destination folder + the source filename
2. If a file already exists at that path, append ` (1)`, ` (2)`, etc. until a free name is found
3. Attempt `fs.renameSync(source, dest)` — this is atomic on the same drive
4. If `renameSync` throws `EXDEV` (cross-device error, i.e. different drives), fall back to `fs.copyFileSync` + `fs.unlinkSync`
5. Return a per-file result object so the UI can report partial failures in a batch

### Config Storage

Config is stored at:

```
Windows: C:\Users\<name>\AppData\Roaming\Down-To-Load\config.json
```

This path is resolved at runtime using Electron's `app.getPath('userData')`, which is called inside each IPC handler (after the app is fully ready) rather than at module load time.

Vue's reactivity system wraps plain objects in `Proxy` when they are added to reactive state. Because Electron's IPC uses the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) — which cannot serialize `Proxy` objects — the config is passed through `JSON.parse(JSON.stringify(...))` in the Pinia store before being sent over IPC. This strips all Vue reactivity wrappers, leaving a plain serializable object.

---

## Supported File Types

File type detection is based on extension only (no MIME sniffing). The categories and their extensions are defined in `src/utils/fileUtils.js` and can be extended freely.

| Category | Extensions |
|---|---|
| **Images** | jpg, jpeg, png, gif, webp, svg, bmp, ico, tiff, tif, raw, heic, heif, avif |
| **Videos** | mp4, mkv, avi, mov, wmv, flv, webm, m4v, mpg, mpeg, 3gp, ts, vob |
| **Audio** | mp3, wav, flac, aiff, aif, aac, ogg, wma, m4a, opus, alac, ape, dsd, dsf, mka, wv, tta |
| **Documents** | pdf, doc, docx, xls, xlsx, ppt, pptx, txt, rtf, csv, md, odt, ods, odp, pages, numbers, key |
| **Archives** | zip, rar, 7z, tar, gz, bz2, xz, zst, cab, iso, tgz |
| **Executables** | exe, msi, bat, cmd, sh, ps1, pkg, deb, rpm, appimage, apk |
| **Other** | Anything not matched by the above |

To add a new extension, open `src/utils/fileUtils.js` and add it to the appropriate `extensions` array in `FILE_CATEGORIES`.

---

## Versioning and Releasing

1. Update `"version"` in `package.json`
2. Run `npm run dist`
3. Find the new installer in `release/`

The app name, app ID, and installer output directory are all configured under the `"build"` key in `package.json`.

---

## Troubleshooting

**The app opens but shows a blank screen**

The Vite dev server may not have started yet. Wait a few seconds and the window should load. If it does not, check that port 5173 is not in use by another process.

**"Get Started" button shows an error toast**

Check that the `%APPDATA%\Down-To-Load\` directory is writable. If you are running the app from a restricted path, try moving it elsewhere.

**Files fail to move**

- Make sure the destination folder still exists (it may have been deleted or renamed since you configured it)
- Check that you have write permission to the destination
- If moving between drives, ensure there is enough disk space at the destination

**I edited `config.json` manually and the app shows old data**

Restart the app. Config is loaded once at startup and changes to the file on disk are not watched.

**The portable `.exe` is flagged by Windows Defender / SmartScreen**

This is expected for unsigned executables. Click **More info → Run anyway** on the SmartScreen prompt. To avoid this for distributed builds, the executable would need to be code-signed with a paid Windows certificate.

**I want to reset the app completely**

Delete `config.json` at `%APPDATA%\Down-To-Load\config.json`. The next launch will show the setup wizard again.
