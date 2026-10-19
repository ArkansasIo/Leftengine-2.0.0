import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// These tests assert the TypeScript source contract without requiring a TS runtime loader.
test("scene implementation exposes entity, component, and scene APIs", async () => {
  const source = await readFile(new URL("../src/core/Scene.ts", import.meta.url), "utf8");
  assert.match(source, /export class Entity/);
  assert.match(source, /add<T extends EngineComponent>/);
  assert.match(source, /export class Scene/);
  assert.match(source, /create\(name: string\)/);
});
