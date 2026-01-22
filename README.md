<div align="center">
  <img src="public/icon.png" alt="Locket Logo" width="120" height="120" />
  <h1>Locket</h1>
  <p><strong>Secure, Local-First Digital Vault</strong></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#security">Security</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

**Locket** is a modern, privacy-focused desktop application for managing sensitive credentials. Built with **Tauri** and **React**, it combines the performance of a native Rust backend with the visual fidelity of a modern web frontend.

Unlike cloud-based password managers, Locket stores your data **locally on your device**, encrypted with military-grade **AES-GCM 256-bit encryption**.

## 🚀 Features

- **🔒 Local-First Security**: content is encrypted and stored locally. No cloud servers, no trackers.
- **🔑 Multi-Type Storage**: Support for:
  - **Logins**: Username/Password combinations.
  - **API Keys**: Environment variables, keys, and secrets.
  - **Databases**: Connection strings and server details.
  - **Secure Notes**: Encrypted snippets and memos.
- **💎 Glassmorphism UI**: specific, premium aesthetic with smooth Framer Motion animations.
- **⌨️ Power User Friendly**: Full keyboard shortcut support and quick search.
- **🦀 Rust Backend**: Powered by Tauri v2 for minimal resource usage and high security.

## 🛡️ Security Architecture

Locket takes security seriously. We use standard, audit-friendly cryptographic primitives:

- **Algorithm**: AES-GCM (256-bit)
- **Key Derivation**: Secure random IV generation per write.
- **Storage Location**: `~/Library/Application Support/com.locket.app/store/locket_data.enc`
- **Data Integrity**: Authenticated encryption ensures data cannot be tampered with without detection.

> **Note**: This is the Developer Edition. Future updates will include Master Password protection and Key Derivation Function (Argon2id) integration.

## 🛠️ Tech Stack

- **Core**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/) + [Phosphor Icons](https://phosphoricons.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## ⚡ Getting Started

### Prerequisites

- Node.js v18+
- Rust (standard stable toolchain)
- `cargo` available in PATH

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/coding-vasu/locket.git
    cd locket
    ```

2.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

3.  **Run in Development Mode**
    This command handles port management and starts the Tauri window.

    ```bash
    npm run tauri:dev
    ```

4.  **Build for Production**
    Generate a native binary for your OS (macOS `.dmg` / `.app`).
    ```bash
    npm run tauri:build
    ```

## 📂 Project Structure

```
locket/
├── src/
│   ├── components/      # React UI components (Glassmorphism)
│   ├── stores/          # Zustand state (Credential & UI)
│   ├── utils/
│   │   ├── crypto.ts    # AES-GCM encryption implementation
│   │   └── storage.ts   # Encrypted file adapter
│   └── types/           # TypeScript definitions
├── src-tauri/
│   ├── src/             # Rust backend code
│   └── capabilities/    # FS Permission scopes
└── public/              # Static assets
```

## 📄 License

MIT License.
