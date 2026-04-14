# ✨ Turn Every Tweet's Grok Button Into a Custom AI Command Menu

📍 **Author:** [GitHub](https://github.com/Startanuki07?tab=repositories) | **Script:** [Repository](https://github.com/Startanuki07/X-Twitter-Grok-Commander)

**Replaces the Grok button on every tweet with a five-mode AI command menu, complete with notification forwarding and per-language prompt customization.**

---

> 💡 **Overview**
> After installation, each tweet's Grok button becomes a dropdown menu offering three built-in analysis modes and two fully customizable slots. Results can appear in Grok's sidebar or in a private tab that leaves no browsing history. An optional notification module lets you forward AI results to Discord or Telegram, and all five prompt templates are editable per language.

<details open>
  <summary><small style="color: #666;">Hide image</small></summary>
  <img src="https://greasyfork.s3.us-east-2.amazonaws.com/w5ox18f8uvogt8rvybjf43vk04tu" alt="Image">
</details>

---

## 🎛 Getting Started

After installation, you'll see a modified Grok button on each tweet. Clicking it opens the command menu. Settings are accessible from the browser's userscript manager menu.

| Icon | Feature | Where It Appears |
|------|---------|------------------|
| 🤖 | Command Menu | Replaces the existing Grok icon on every tweet |
| 🔒 | Private Mode toggle | Inside the command menu, per mode |
| 📤 | Push Notification | Inside the command menu, after a mode runs |
| ⚙️ | Settings Panel | Userscript manager menu → "Grok Commander 設定" |

---

## 🚀 Core Features

### 🔍 Fact Check Mode

Submits the tweet to Grok with a pre-built fact-checking prompt.

- The language of the prompt auto-detects based on your browser or X interface language.
- Send mode defaults to manual (you review before submitting), configurable to auto-send in Settings.
- Selecting 🔒 Private Mode redirects to a separate private Grok session, so the query does not appear in your Grok history.

---

## Why Grok?

Why Grok? Because it is natively connected to X's real-time data stream, Grok has immediate context on trending topics, public figures, and platform-specific events that other AI tools would need to retrieve indirectly. For social media content in particular, that native awareness makes a practical difference.

This script is intended for casual users who occasionally encounter an unfamiliar post and want a quick, structured way to get context — without opening a new tab, pasting text manually, or writing a prompt from scratch.

While this provides a fast way to gather context, AI-generated verification should not be treated as fully authoritative. Users are encouraged to review the source links provided by Grok, compare them with other references if needed, and form their own judgment. AI-assisted summaries are meant to serve as a starting point for understanding, not as a final source of truth.

---

### 📊 Deep Analysis Mode

Asks Grok to evaluate the tweet's tone, implied stance, emotional direction, and target audience.

- Same language auto-detection and send mode options as Fact Check.
- Works entirely within the sidebar unless Private Mode is selected.

### 🌐 Translate & Explain Mode

Translates the tweet into your detected language and explains any internet slang, memes, or cultural references embedded in the text.

- Particularly useful for posts mixing multiple languages or heavy in platform-specific shorthand.

### 🧩 Custom Slot 1 & Custom Slot 2

Two fully open prompt slots you can rename and reprogram to do anything you want.

- Default prompts offer a brief context summary (Slot 1) and a thought-provoking question (Slot 2).
- Edit the label and prompt text for each slot in Settings → prompt template editor.
- Each slot supports per-language templates — you can set a different prompt for English vs. Japanese, for example.

>💡 Flexible Use of Prompt Templates
The built-in modes provide structured examples for fact checking, analysis, and explanation. However, all prompt templates in this script are editable. By modifying the custom slots — or even the built-in modes — users can adapt the menu to support other tasks according to their own needs. The script does not restrict how Grok is used; verification is simply one of many possible applications.

### 📤 Push Notifications (Discord & Telegram)

Forward AI results directly to a Discord channel or Telegram chat after any mode runs.

- Supports up to 10 push destinations total (Discord Webhooks and Telegram Bots combined).
- Each destination can be individually enabled or disabled without deleting its configuration.
- Destinations are configured in Settings → Push Notifications panel.

> ⚠️ **This feature requires you to provide your own Discord Webhook URL or Telegram Bot Token.** These credentials are stored locally on your device and sent only to Discord's or Telegram's own servers. They are never transmitted elsewhere.

---

## ⚙️ Additional Features

### Prompt Template Editor

In Settings, you can view and rewrite the prompt for each of the five modes. Changes are saved per language — the script maintains separate templates for each language profile you configure.

### Per-Language Template Customization

Use the Export Template and Import Translation buttons in Settings to back up your current prompt templates as JSON, share them with others, or load a community-made translation pack.

### Send Mode

Toggle between manual (you confirm before sending) and auto-send in Settings. Manual mode is the default to prevent accidental submissions.

---

## 🌐 Third-Party Services & Dependencies

This script connects to external services only when you explicitly use the Push Notification feature.

| Service | Purpose | Optional? | Link |
|---------|---------|-----------|------|
| Discord (via Webhook) | Forward AI results to a Discord channel | Yes | [discord.com](https://discord.com) |
| Telegram (via Bot API) | Forward AI results to a Telegram chat | Yes | [telegram.org](https://telegram.org) |

> 💡 **If you do not configure Push Notifications, this script makes no external network requests.** All other features communicate only with X (Twitter) and Grok directly through your browser.

---

## ⚠️ Known Constraints & Limitations

- **Push Notification capacity:** Up to 10 destinations (Discord + Telegram combined). Attempting to add more will show a warning and block the addition.
- **Sidebar requirement:** Modes that send to the sidebar require the Grok sidebar to already be open. If it is not open, a prompt will ask you to open it first before using the command menu.
- **Private Mode and sidebar:** Private Mode in sidebar context enables private chat within the drawer, not a new tab. Selecting Private Mode from outside the sidebar redirects to a separate x.com/i/grok session instead.

---

## 🔐 Security & Privacy Notice

> ⚠️ **The Push Notification feature requires you to enter your own Discord Webhook URL and/or Telegram Bot Token.**

| Data Type | Source | Purpose | Storage | Transmitted To |
|-----------|--------|---------|---------|----------------|
| Discord Webhook URL | You provide | Send results to Discord channel | Saved locally on your device | Discord's servers only |
| Telegram Bot Token | You provide | Send results to Telegram chat | Saved locally on your device | Telegram's servers only |
| Script preferences (send mode, templates) | Script generates | Remember your settings | Saved locally on your device | Nowhere |

**This script does not collect, share, or transmit your credentials to any server other than the service you configured.**

> 💡 **Push Notifications are entirely opt-in.** No credentials are required to use the five analysis modes. If you never open the Push Notification settings, nothing is stored or transmitted.

---

- This userscript is primarily maintained on Greasy Fork.
- Built with AI assistance by a hobbyist developer. Bug fixes and updates may not be immediate.
- Feedback is welcome. Responses may be assisted by translation tools if needed.