# Leftengine 2.0.0

A modular browser-based engine foundation built with TypeScript, Vite, HTML, and CSS. The project is designed to grow from an editor-style command center into a reusable 2D/3D runtime and tooling stack.

## Current scope

- Responsive command-center editor UI
- Engine lifecycle and typed runtime events
- Entity/component scene model
- Canvas 2D renderer abstraction
- Typed keyboard and mouse input manager
- Cached text, JSON, and image asset loading
- Versioned project serialization format
- Editor state model for panels, tools, selection, and dirty state
- CI validation and GitHub Pages deployment

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run typecheck
npm test
npm run build
```

## Architecture

```text
src/
  core/
    Assets.ts       Asset loading and cache
    Engine.ts       Runtime lifecycle and frame loop
    EventBus.ts     Typed event dispatch
    Input.ts        Keyboard/mouse bindings
    Project.ts      Portable project serialization
    Renderer.ts     Renderer interface + Canvas2D backend
    Scene.ts        Entity/component scene graph
  editor/
    EditorState.ts  Panel/tool/selection state
  main.ts           Browser editor bootstrap
  styles/
    main.css        Command-center visual system
```

## Project format

Projects use the `leftengine-project` format, version `1`. A project contains metadata plus a portable scene document with entity IDs, names, active state, and serializable component data. This provides a stable foundation for editor save/load, import/export, and later backend synchronization.

## Rendering roadmap

The current renderer intentionally uses Canvas 2D so the editor works without a heavyweight graphics dependency. The renderer interface isolates that implementation so a WebGL2/WebGPU backend can be added without changing scene or editor code.

## GitHub Pages

The Pages workflow builds the Vite site and deploys `dist/`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Status

The repository now contains the second engineering layer: runtime primitives, renderer abstraction, input, assets, persistence, and editor state. The next layer can add transform components, a live canvas viewport, import/export controls, gizmos, camera controls, and WebGL2/WebGPU rendering.
