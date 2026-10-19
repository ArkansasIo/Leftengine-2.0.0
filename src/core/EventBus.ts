export type EventHandler<T> = (payload: T) => void;

export class EventBus<Events extends { [K in keyof Events]: unknown }> {
  private readonly handlers = new Map<keyof Events, Set<EventHandler<never>>>();

  on<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): () => void {
    let bucket = this.handlers.get(type);
    if (!bucket) {
      bucket = new Set<EventHandler<never>>();
      this.handlers.set(type, bucket);
    }
    bucket.add(handler as EventHandler<never>);
    return () => this.off(type, handler);
  }

  off<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): void {
    const bucket = this.handlers.get(type);
    bucket?.delete(handler as EventHandler<never>);
    if (bucket?.size === 0) this.handlers.delete(type);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    for (const handler of [...(this.handlers.get(type) ?? [])]) {
      (handler as EventHandler<Events[K]>)(payload);
    }
  }

  clear(): void { this.handlers.clear(); }
}
