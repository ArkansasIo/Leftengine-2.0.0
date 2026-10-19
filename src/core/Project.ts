import { Entity, EngineComponent, Scene } from "./Scene";

export const PROJECT_FORMAT = "leftengine-project";
export const PROJECT_VERSION = 1;

export interface EntityDocument {
  id: string;
  name: string;
  active: boolean;
  components: Record<string, Record<string, unknown>>;
}

export interface ProjectDocument {
  format: typeof PROJECT_FORMAT;
  version: typeof PROJECT_VERSION;
  metadata: { name: string; createdAt: string; updatedAt: string };
  scene: { entities: EntityDocument[] };
}

export function serializeScene(scene: Scene): ProjectDocument["scene"] {
  return {
    entities: scene.all().map(entity => ({
      id: entity.id,
      name: entity.name,
      active: entity.active,
      components: Object.fromEntries([...entity.components.entries()].map(([type, component]) => [type, toPlainComponent(component)])),
    })),
  };
}

export function createProject(scene: Scene, name = "Untitled Project"): ProjectDocument {
  const now = new Date().toISOString();
  return { format: PROJECT_FORMAT, version: PROJECT_VERSION, metadata: { name, createdAt: now, updatedAt: now }, scene: serializeScene(scene) };
}

export function stringifyProject(project: ProjectDocument, pretty = true): string {
  return JSON.stringify(project, null, pretty ? 2 : 0);
}

export function parseProject(text: string): ProjectDocument {
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error("Project file is not valid JSON."); }
  validateProject(value);
  return value as ProjectDocument;
}

export function deserializeScene(document: ProjectDocument["scene"]): Scene {
  const scene = new Scene();
  for (const item of document.entities) {
    const entity = new Entity(item.id, item.name, item.active);
    for (const component of Object.values(item.components)) {
      entity.add(component as EngineComponent);
    }
    scene.add(entity);
  }
  return scene;
}

function toPlainComponent(component: EngineComponent): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(component)) {
    if (typeof value !== "function" && typeof value !== "symbol" && value !== undefined) result[key] = value;
  }
  return result;
}

function validateProject(value: unknown): asserts value is ProjectDocument {
  if (!value || typeof value !== "object") throw new Error("Project document must be an object.");
  const project = value as Record<string, unknown>;
  if (project.format !== PROJECT_FORMAT) throw new Error(`Unsupported project format: ${String(project.format)}`);
  if (project.version !== PROJECT_VERSION) throw new Error(`Unsupported project version: ${String(project.version)}`);
  if (!project.scene || typeof project.scene !== "object") throw new Error("Project scene is missing.");
  const scene = project.scene as Record<string, unknown>;
  if (!Array.isArray(scene.entities)) throw new Error("Project scene entities must be an array.");
}
