# LLaMazing

A simple Web / UI / App / Frontend to Ollama.

| Light Theme               | Dark Theme               |
| ------------------------- | ------------------------ |
| ![](screenshot-light.png) | ![](screenshot-dark.png) |

## Prerequisites

Install [Ollama](https://ollama.ai/) and run the server.

Download some [models](https://ollama.ai/library). For example, one of my favorites:

```shell
$ ollama pull dolphin-mistral
```

## Using LLaMazing

For using the app itself, there are 3 options:

- Web demo (with local Ollama)
- Local Web UI
- Stand-alone app

### Option 1 : Web demo

Allow browser to connect to your Ollama instance:

```shell
$ launchctl setenv OLLAMA_ORIGINS 'https://my.llamaz.ing'
```

Head over to https://my.llamaz.ing and chat with your local Ollama instance.

### Option 2 : Local Web UI

#### Install dependencies:

```shell
$ pnpm i
```

#### Run in browser (dev mode)

```shell
$ pnpm dev --open
```

### Option 3 : Standalone app

Build one yourself (see below) or download a release from https://github.com/da-z/llamazing/releases

<img src="app-icon.png" width="150"/>

**❗Note**: In order for the standalone app to work, you have to either manually start Ollama server like this:

```shell
$ OLLAMA_ORIGINS=* ollama serve
```

or set the property globally (once) and restart Ollama server

```shell
$ launchctl setenv OLLAMA_ORIGINS '*'
```

---

## Other

### Building Web app

Build app (output goes to `./dist` folder)

```shell
$ pnpm build
```

### Running standalone app in dev mode

Install Tauri [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) based on your system:

```shell
$ pnpm tauri dev
```

### Building app (Mac Universal)

```shell
$ pnpm tauri build --target universal-apple-darwin
```

#### Building app for your system

```shell
$ pnpm tauri build
```

#### Building app with debugging enabled

Good for troubleshooting a build (enables dev tools):

```shell
$ pnpm tauri build --debug
```
