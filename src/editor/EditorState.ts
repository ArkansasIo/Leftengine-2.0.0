export type EditorPanel = "overview" | "scene" | "entities" | "systems" | "settings";
export type EditorTool = "select" | "move" | "rotate" | "scale";

export class EditorState {
  activePanel: EditorPanel = "overview";
  activeTool: EditorTool = "select";
  selectedEntityId: string | null = null;
  dirty = false;

  selectEntity(id: string | null): void {
    this.selectedEntityId = id;
  }

  setPanel(panel: EditorPanel): void {
    this.activePanel = panel;
  }

  setTool(tool: EditorTool): void {
    this.activeTool = tool;
  }

  markDirty(): void { this.dirty = true; }
  markSaved(): void { this.dirty = false; }
}
