# Locket

A modern, secure, and beautiful local-first password manager application built with React, Vite, and Tailwind CSS.

## Features

- **Secure Credential Storage**: Manage your logins, API keys, database credentials, and notes.
- **Modern UI**: Sleek, glassmorphism-inspired design with rich aesthetics.
- **Dock Interface**: intuitive navigation with a macOS-style dock.
- **Local Storage**: Data is persisted locally for privacy and quick access.
- **Animations**: Smooth transitions and interactions powered by Framer Motion.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd locket
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```

4.  Building for production (Web):
    ```bash
    npm run build
    ```

### Desktop App (Tauri)

**Download the latest version:** [GitHub Releases](https://github.com/coding-vasu/locket/releases)

#### Running in Development Mode

Start the React dev server and Tauri window:

```bash
npm run tauri:dev
```

#### Building for Desktop

Build the native application (creates a `.dmg` or `.app` on macOS):

```bash
npm run tauri:build
```

The output will be in `src-tauri/target/release/bundle`.

## Project Structure

```
src/
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── stores/       # Global state management
├── types/        # TypeScript type definitions
├── App.tsx       # Main application entry
src-tauri/        # Tauri Rust configuration and code
```

## License

MIT
