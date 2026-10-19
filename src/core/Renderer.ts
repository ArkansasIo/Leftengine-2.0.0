export type RendererBackend = "canvas2d" | "none";

export interface RenderableEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  active: boolean;
}

export interface RendererStats {
  frame: number;
  drawCalls: number;
  width: number;
  height: number;
  backend: RendererBackend;
}

export interface Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly backend: RendererBackend;
  resize(width?: number, height?: number): void;
  render(entities: readonly RenderableEntity[]): void;
  getStats(): RendererStats;
  dispose(): void;
}

export class Canvas2DRenderer implements Renderer {
  readonly backend: RendererBackend = "canvas2d";
  private readonly context: CanvasRenderingContext2D;
  private frame = 0;
  private drawCalls = 0;

  constructor(public readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D rendering is not available.");
    this.context = context;
    this.resize();
  }

  resize(width?: number, height?: number): void {
    const requestedWidth = width ?? this.canvas.clientWidth;
    const requestedHeight = height ?? this.canvas.clientHeight;
    const nextWidth = Math.max(1, Math.floor(requestedWidth || 800));
    const nextHeight = Math.max(1, Math.floor(requestedHeight || 460));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(nextWidth * dpr);
    this.canvas.height = Math.floor(nextHeight * dpr);
    this.canvas.style.width = `${nextWidth}px`;
    this.canvas.style.height = `${nextHeight}px`;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  render(entities: readonly RenderableEntity[]): void {
    const width = this.canvas.clientWidth || 800;
    const height = this.canvas.clientHeight || 460;
    this.context.clearRect(0, 0, width, height);
    this.drawGrid(width, height);
    this.drawCalls = 1;
    for (const entity of entities) {
      if (!entity.active) continue;
      const x = width / 2 + entity.x;
      const y = height / 2 - entity.y;
      this.context.beginPath();
      this.context.arc(x, y, 5, 0, Math.PI * 2);
      this.context.fillStyle = "#68d5ff";
      this.context.fill();
      this.context.strokeStyle = "rgba(104,213,255,.35)";
      this.context.stroke();
      this.drawCalls += 1;
    }
    this.frame += 1;
  }

  getStats(): RendererStats {
    return { frame: this.frame, drawCalls: this.drawCalls, width: this.canvas.width, height: this.canvas.height, backend: this.backend };
  }

  dispose(): void {
    this.frame = 0;
    this.drawCalls = 0;
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  private drawGrid(width: number, height: number): void {
    const step = 32;
    this.context.strokeStyle = "rgba(111,157,190,.12)";
    this.context.lineWidth = 1;
    this.context.beginPath();
    for (let x = 0; x <= width; x += step) { this.context.moveTo(x, 0); this.context.lineTo(x, height); }
    for (let y = 0; y <= height; y += step) { this.context.moveTo(0, y); this.context.lineTo(width, y); }
    this.context.stroke();
    this.context.strokeStyle = "rgba(104,213,255,.22)";
    this.context.beginPath();
    this.context.moveTo(width / 2, 0); this.context.lineTo(width / 2, height);
    this.context.moveTo(0, height / 2); this.context.lineTo(width, height / 2);
    this.context.stroke();
  }
}

export function detectRendererBackend(canvas: HTMLCanvasElement): RendererBackend {
  return canvas.getContext("2d") ? "canvas2d" : "none";
}
