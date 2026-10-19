export type AssetType = "text" | "json" | "image";
export type AssetStatus = "idle" | "loading" | "ready" | "error";

export interface AssetRecord<T> {
  id: string;
  url: string;
  type: AssetType;
  status: AssetStatus;
  value?: T;
  error?: Error;
}

export class AssetManager {
  private readonly assets = new Map<string, AssetRecord<unknown>>();

  async loadText(id: string, url: string, signal?: AbortSignal): Promise<string> {
    return this.load(id, url, "text", async response => response.text(), signal);
  }

  async loadJSON<T>(id: string, url: string, signal?: AbortSignal): Promise<T> {
    return this.load(id, url, "json", async response => response.json() as Promise<T>, signal);
  }

  async loadImage(id: string, url: string): Promise<HTMLImageElement> {
    const cached = this.assets.get(id);
    if (cached?.status === "ready") return cached.value as HTMLImageElement;
    const record: AssetRecord<HTMLImageElement> = { id, url, type: "image", status: "loading" };
    this.assets.set(id, record as AssetRecord<unknown>);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        if (typeof Image === "undefined") { reject(new Error("Image loading is not available in this environment.")); return; }
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error(`Failed to load image asset: ${url}`));
        element.src = url;
      });
      record.status = "ready";
      record.value = image;
      return image;
    } catch (error) {
      record.status = "error";
      record.error = error instanceof Error ? error : new Error(String(error));
      throw record.error;
    }
  }

  get<T>(id: string): AssetRecord<T> | undefined {
    return this.assets.get(id) as AssetRecord<T> | undefined;
  }

  has(id: string): boolean { return this.assets.has(id); }
  clear(): void { this.assets.clear(); }

  private async load<T>(id: string, url: string, type: AssetType, parser: (response: Response) => Promise<T>, signal?: AbortSignal): Promise<T> {
    const cached = this.assets.get(id);
    if (cached?.status === "ready") return cached.value as T;
    const record: AssetRecord<T> = { id, url, type, status: "loading" };
    this.assets.set(id, record as AssetRecord<unknown>);
    try {
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`Asset request failed (${response.status}): ${url}`);
      const value = await parser(response);
      record.status = "ready";
      record.value = value;
      return value;
    } catch (error) {
      record.status = "error";
      record.error = error instanceof Error ? error : new Error(String(error));
      throw record.error;
    }
  }
}
