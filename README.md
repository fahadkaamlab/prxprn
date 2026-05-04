# Free VPN Switch (Chrome Extension)

This project provides a simple Chrome extension UI that lets you switch browser traffic through a configured proxy endpoint.

## Important

- This is **not** a full VPN tunnel; it uses Chrome's `proxy` API for browser traffic only.
- Replace the sample proxy hosts in `background.js` with working proxy endpoints you control or trust.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder.

## Files

- `manifest.json` – Extension manifest (MV3)
- `background.js` – Proxy configuration and state handling
- `popup.html` / `popup.css` / `popup.js` – Extension popup interface
