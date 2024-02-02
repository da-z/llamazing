# LLaMazing

A simple frontend to Ollama.

| Light Theme               | Dark Theme               |
| ------------------------- | ------------------------ |
| ![](screenshot-light.png) | ![](screenshot-dark.png) |

## Install

Install [Ollama](https://ollama.ai/) and run the server.

Download some [models](https://ollama.ai/library). For example, one of my favorites:

```shell
$ ollama pull dolphin-mistral
```

Install the web ui

```shell
$ pnpm i
```

## Run in browser (dev mode)

```shell
$ pnpm dev --open
```

## Run standalone app (dev mode)

```shell
$ pnpm tauri dev
```

## Standalone App

Build one yourself or download from https://github.com/da-z/llamazing/releases

<img src="app-icon.png" width="150"/>

**❗Note**: In order for the standalone app to work, you have to run ollama server like this:

```shell
$ OLLAMA_ORIGINS=*://localhost ollama serve
```

Alternatively, set the property globally and restart Ollama server

```shell
$ launchctl setenv OLLAMA_ORIGINS '*://localhost'
```

## Build App (Mac Universal)

```shell
$ pnpm tauri build --target universal-apple-darwin
```

## Build App for your system

```shell
$ pnpm tauri build
```

## Build App with debugging enabled

Good for troubleshooting a build (enables dev tools):

```shell
$ pnpm tauri build --debug
```
