import { LeftEngine } from "./core/Engine";
import "./styles/main.css";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("App root #app was not found.");

const engine = new LeftEngine();
const startedAt = new Date();
root.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">L</span><div><strong>LEFTENGINE</strong><small>ENGINE STUDIO · 2.0.0</small></div></div>
      <div class="nav-label">WORKSPACE</div>
      <button class="nav-item active" data-panel="overview">▦ <span>Overview</span></button>
      <button class="nav-item" data-panel="scene">◇ <span>Scene Graph</span></button>
      <button class="nav-item" data-panel="entities">▤ <span>Entities</span></button>
      <button class="nav-item" data-panel="systems">⌘ <span>Systems</span></button>
      <div class="nav-label">PROJECT</div>
      <button class="nav-item" data-panel="settings">⚙ <span>Settings</span></button>
      <div class="sidebar-bottom"><span class="status-dot"></span> Engine core ready <small>v2.0.0</small></div>
    </aside>
    <main class="main">
      <header class="topbar"><div><span class="eyebrow">LOCAL WORKSPACE</span><strong id="page-title">Overview</strong></div><div class="top-actions"><span class="pill"><i class="status-dot"></i><span id="engine-status">STOPPED</span></span><button id="run-button" class="primary">▶ Start engine</button></div></header>
      <section class="content">
        <div class="welcome"><div><p class="eyebrow">ENGINE CONTROL CENTER</p><h1>Build something <em>remarkable.</em></h1><p class="muted">A modular foundation for real-time scenes, systems, and tools.</p></div><div class="version-block"><span>VERSION</span><strong>2.0.0</strong><small>PREVIEW BUILD</small></div></div>
        <div class="metrics">
          <article class="metric"><span>ENGINE STATE</span><strong id="metric-state">Stopped</strong><small id="metric-state-sub">Ready to initialize</small></article>
          <article class="metric"><span>SCENE ENTITIES</span><strong id="metric-entities">0</strong><small>Loaded in active scene</small></article>
          <article class="metric"><span>FRAME DELTA</span><strong id="metric-delta">—</strong><small>Milliseconds per frame</small></article>
          <article class="metric"><span>SESSION UPTIME</span><strong id="metric-uptime">00:00</strong><small>Current browser session</small></article>
        </div>
        <div class="workspace-grid">
          <article class="panel viewport-panel"><div class="panel-header"><div><span class="eyebrow">RENDER VIEW</span><h2>Scene viewport</h2></div><span class="badge"><i class="status-dot"></i> PREVIEW</span></div><div class="viewport"><div class="grid-plane"></div><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="crosshair">+</div><div class="viewport-label">PERSPECTIVE · EDITOR CAMERA</div><div class="viewport-coords">X 0.0&nbsp;&nbsp; Y 0.0&nbsp;&nbsp; Z 0.0</div></div><div class="panel-footer"><span>Scene preview placeholder</span><span>Renderer module not connected</span></div></article>
          <article class="panel activity-panel"><div class="panel-header"><div><span class="eyebrow">RUNTIME</span><h2>Engine console</h2></div><button id="clear-console" class="quiet">Clear</button></div><div id="console" class="console" aria-live="polite"></div><div class="console-entry"><span>›</span><input id="console-input" placeholder="Type help and press Enter…" aria-label="Console command" /><button id="send-command">Send</button></div></article>
          <article class="panel scene-panel"><div class="panel-header"><div><span class="eyebrow">HIERARCHY</span><h2>Scene entities</h2></div><button id="add-entity" class="quiet">＋ Add entity</button></div><div id="entity-list" class="entity-list"><div class="empty-state">No entities yet. Add one to begin.</div></div></article>
          <article class="panel systems-panel"><div class="panel-header"><div><span class="eyebrow">ARCHITECTURE</span><h2>Core modules</h2></div><span class="badge">4 MODULES</span></div><div class="system-row"><span class="system-icon">◎</span><div><strong>Lifecycle</strong><small>Start, stop, dispose</small></div><span class="module-state">READY</span></div><div class="system-row"><span class="system-icon">⌁</span><div><strong>Event bus</strong><small>Typed runtime events</small></div><span class="module-state">READY</span></div><div class="system-row"><span class="system-icon">◇</span><div><strong>Scene graph</strong><small>Entity/component model</small></div><span class="module-state">READY</span></div><div class="system-row"><span class="system-icon">▧</span><div><strong>Renderer</strong><small>Integration point</small></div><span class="module-state pending">PLANNED</span></div></article>
        </div>
        <footer>LEFTENGINE 2.0.0 <span>MODULAR BY DESIGN</span><span>Created ${startedAt.toLocaleDateString()}</span></footer>
      </section>
    </main>
  </div>`;

const appRoot: HTMLDivElement = root;
const $ = <T extends HTMLElement>(selector: string) => {
  const element = appRoot.querySelector<T>(selector);
  if (!element) throw new Error(`Required UI element missing: ${selector}`);
  return element;
};

function log(message: string, level: "info" | "success" | "warn" = "info"): void {
  const row = document.createElement("div");
  row.className = `log-row ${level}`;
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString([], { hour12: false });
  const text = document.createElement("span");
  text.textContent = message;
  row.append(time, text);
  $("#console").append(row);
  $("#console").scrollTop = $("#console").scrollHeight;
}

function refreshEntities(): void {
  $("#metric-entities").textContent = String(engine.scene.all().length);
  const list = $("#entity-list");
  list.replaceChildren();
  const entities = engine.scene.all();
  if (!entities.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No entities yet. Add one to begin.";
    list.append(empty);
    return;
  }
  for (const entity of entities) {
    const row = document.createElement("div");
    row.className = "entity-row";
    const icon = document.createElement("span");
    icon.className = "entity-icon";
    icon.textContent = "◇";
    const name = document.createElement("span");
    name.className = "entity-name";
    name.textContent = entity.name;
    const id = document.createElement("code");
    id.textContent = entity.id.slice(0, 8);
    const remove = document.createElement("button");
    remove.className = "remove-entity";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${entity.name}`);
    remove.addEventListener("click", () => {
      engine.scene.remove(entity.id);
      log(`Removed entity: ${entity.name}`, "warn");
      refreshEntities();
    });
    row.append(icon, name, id, remove);
    list.append(row);
  }
}

function setEngineState(running: boolean): void {
  $("#engine-status").textContent = running ? "RUNNING" : "STOPPED";
  $("#metric-state").textContent = running ? "Running" : "Stopped";
  $("#metric-state-sub").textContent = running ? "Frame loop active" : "Ready to initialize";
  $("#run-button").textContent = running ? "■ Stop engine" : "▶ Start engine";
  $("#run-button").classList.toggle("danger", running);
  $("#run-button").classList.toggle("primary", !running);
  appRoot.querySelector(".topbar .status-dot")?.classList.toggle("live", running);
}

engine.events.on("started", () => { setEngineState(true); log("Engine lifecycle started.", "success"); });
engine.events.on("stopped", () => { setEngineState(false); log("Engine lifecycle stopped.", "warn"); });
engine.events.on("frame", ({ deltaMs, elapsedMs }) => {
  $("#metric-delta").textContent = `${deltaMs.toFixed(1)} ms`;
  $("#metric-uptime").textContent = formatTime(elapsedMs);
});

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

$("#run-button").addEventListener("click", () => {
  if (engine.getState() === "running") engine.stop();
  else {
    try { engine.start(); } catch (error) { log(error instanceof Error ? error.message : String(error), "warn"); }
  }
});
$("#add-entity").addEventListener("click", () => {
  const name = window.prompt("Entity name", `Entity ${engine.scene.all().length + 1}`);
  if (name === null || !name.trim()) return;
  engine.scene.create(name.trim());
  log(`Created entity: ${name.trim()}`, "success");
  refreshEntities();
});
$("#clear-console").addEventListener("click", () => $("#console").replaceChildren());

function runCommand(): void {
  const input = $("#console-input") as HTMLInputElement;
  const command = input.value.trim();
  if (!command) return;
  log(`> ${command}`);
  input.value = "";
  const [verb, ...args] = command.split(/\s+/);
  switch (verb?.toLowerCase()) {
    case "help":
      log("Commands: help, status, start, stop, entity <name>, clear");
      break;
    case "status":
      log(`Engine=${engine.getState()}, entities=${engine.scene.all().length}`);
      break;
    case "start":
      engine.start();
      break;
    case "stop":
      engine.stop();
      break;
    case "entity": {
      const name = args.join(" ").trim() || `Entity ${engine.scene.all().length + 1}`;
      engine.scene.create(name);
      refreshEntities();
      log(`Created entity: ${name}`, "success");
      break;
    }
    case "clear":
      $("#console").replaceChildren();
      break;
    default:
      log(`Unknown command "${verb}". Type help for commands.`, "warn");
  }
}
$("#send-command").addEventListener("click", runCommand);
$("#console-input").addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") runCommand();
});

for (const button of appRoot.querySelectorAll<HTMLButtonElement>(".nav-item")) {
  button.addEventListener("click", () => {
    appRoot.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const title = button.querySelector("span")?.textContent ?? "Overview";
    $("#page-title").textContent = title;
    log(`Workspace selected: ${title}`);
    if (button.dataset.panel === "scene" || button.dataset.panel === "entities") {
      $("#entity-list").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (button.dataset.panel === "systems") {
      $(".systems-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (button.dataset.panel === "settings") {
      log("Settings panel: configuration is currently managed in source files.");
    }
  });
}

log("Leftengine 2.0.0 boot sequence complete.", "success");
log("No WebGL renderer attached; viewport is a UI preview.");
log('Type "help" for console commands.');
refreshEntities();
