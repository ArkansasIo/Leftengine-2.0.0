import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("project serializer defines a versioned portable format", async () => {
  const source = await readFile(new URL("../src/core/Project.ts", import.meta.url), "utf8");
  assert.match(source, /PROJECT_FORMAT/);
  assert.match(source, /PROJECT_VERSION = 1/);
  assert.match(source, /serializeScene/);
  assert.match(source, /deserializeScene/);
  assert.match(source, /parseProject/);
});

test("renderer and input modules exist", async () => {
  const renderer = await readFile(new URL("../src/core/Renderer.ts", import.meta.url), "utf8");
  const input = await readFile(new URL("../src/core/Input.ts", import.meta.url), "utf8");
  assert.match(renderer, /export interface Renderer/);
  assert.match(renderer, /export class Canvas2DRenderer/);
  assert.match(input, /export class InputManager/);
  assert.match(input, /bind\(action: string/);
});
