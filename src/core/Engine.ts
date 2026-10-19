import { EventBus } from "./EventBus";
import { Scene } from "./Scene";

export interface EngineEvents extends Record<string, unknown> {
  started: { at: number };
  stopped: { at: number };
  frame: { deltaMs: number; elapsedMs: number };
}

export type EngineState = "stopped" | "running" | "disposed";

export class LeftEngine {
  readonly scene = new Scene();
  readonly events = new EventBus<EngineEvents>();
  private state: EngineState = "stopped";
  private animationId: number | undefined;
  private previousTime = 0;
  private elapsedMs = 0;

  getState(): EngineState { return this.state; }

  start(): void {
    if (this.state === "disposed") throw new Error("Cannot start a disposed engine.");
    if (this.state === "running") return;
    this.state = "running";
    this.previousTime = 0;
    this.events.emit("started", { at: Date.now() });
    this.animationId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.state !== "running") return;
    if (this.animationId !== undefined) cancelAnimationFrame(this.animationId);
    this.animationId = undefined;
    this.state = "stopped";
    this.events.emit("stopped", { at: Date.now() });
  }

  dispose(): void {
    if (this.state === "disposed") return;
    this.stop();
    this.scene.clear();
    this.events.clear();
    this.state = "disposed";
  }

  private readonly tick = (time: number): void => {
    if (this.state !== "running") return;
    const deltaMs = this.previousTime === 0 ? 0 : Math.min(time - this.previousTime, 100);
    this.previousTime = time;
    this.elapsedMs += deltaMs;
    this.events.emit("frame", { deltaMs, elapsedMs: this.elapsedMs });
    this.animationId = requestAnimationFrame(this.tick);
  };
}
