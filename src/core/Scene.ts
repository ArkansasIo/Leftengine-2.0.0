export type ComponentType = string;

export interface EngineComponent {
  readonly type: ComponentType;
  enabled?: boolean;
}

export class Entity {
  readonly components = new Map<ComponentType, EngineComponent>();

  constructor(
    public readonly id: string,
    public name: string,
    public active = true,
  ) {}

  add<T extends EngineComponent>(component: T): T {
    if (!component.type.trim()) throw new Error("Component type must not be empty.");
    this.components.set(component.type, component);
    return component;
  }

  get<T extends EngineComponent>(type: ComponentType): T | undefined {
    return this.components.get(type) as T | undefined;
  }

  remove(type: ComponentType): boolean {
    return this.components.delete(type);
  }
}

export class Scene {
  private readonly entities = new Map<string, Entity>();

  add(entity: Entity): void {
    if (this.entities.has(entity.id)) throw new Error(`Entity "${entity.id}" already exists.`);
    this.entities.set(entity.id, entity);
  }

  create(name: string): Entity {
    const entity = new Entity(crypto.randomUUID(), name);
    this.add(entity);
    return entity;
  }

  get(id: string): Entity | undefined { return this.entities.get(id); }
  remove(id: string): boolean { return this.entities.delete(id); }
  all(): Entity[] { return [...this.entities.values()]; }
  clear(): void { this.entities.clear(); }
}
