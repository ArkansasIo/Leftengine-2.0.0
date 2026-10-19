export type InputDevice = "keyboard" | "mouse";

export interface InputBinding {
  action: string;
  code: string;
  device: InputDevice;
}

export interface InputTarget {
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

export class InputManager {
  private readonly bindings = new Map<string, InputBinding[]>();
  private readonly pressed = new Set<string>();
  private readonly target: InputTarget;
  private attached = false;

  private readonly onKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    this.pressed.add(`keyboard:${keyboardEvent.code}`);
  };
  private readonly onKeyUp = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    this.pressed.delete(`keyboard:${keyboardEvent.code}`);
  };
  private readonly onBlur = (): void => this.pressed.clear();
  private readonly onMouseDown = (event: Event): void => {
    const mouseEvent = event as MouseEvent;
    this.pressed.add(`mouse:button${mouseEvent.button}`);
  };
  private readonly onMouseUp = (event: Event): void => {
    const mouseEvent = event as MouseEvent;
    this.pressed.delete(`mouse:button${mouseEvent.button}`);
  };

  constructor(target: InputTarget = window) {
    this.target = target;
    this.attach();
  }

  bind(action: string, code: string, device: InputDevice = "keyboard"): void {
    if (!action.trim() || !code.trim()) throw new Error("Input action and code are required.");
    const list = this.bindings.get(action) ?? [];
    if (!list.some(binding => binding.code === code && binding.device === device)) {
      list.push({ action, code, device });
      this.bindings.set(action, list);
    }
  }

  unbind(action: string, code?: string): void {
    if (code === undefined) { this.bindings.delete(action); return; }
    const remaining = (this.bindings.get(action) ?? []).filter(binding => binding.code !== code);
    if (remaining.length) this.bindings.set(action, remaining);
    else this.bindings.delete(action);
  }

  isPressed(action: string): boolean {
    return (this.bindings.get(action) ?? []).some(binding => this.pressed.has(`${binding.device}:${binding.device === "mouse" ? `button${binding.code}` : binding.code}`));
  }

  isCodePressed(code: string, device: InputDevice = "keyboard"): boolean {
    return this.pressed.has(`${device}:${device === "mouse" ? `button${code}` : code}`);
  }

  clear(): void { this.pressed.clear(); }

  destroy(): void {
    if (!this.attached) return;
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    this.target.removeEventListener("blur", this.onBlur);
    this.target.removeEventListener("mousedown", this.onMouseDown);
    this.target.removeEventListener("mouseup", this.onMouseUp);
    this.attached = false;
    this.clear();
  }

  private attach(): void {
    if (this.attached) return;
    this.target.addEventListener("keydown", this.onKeyDown);
    this.target.addEventListener("keyup", this.onKeyUp);
    this.target.addEventListener("blur", this.onBlur);
    this.target.addEventListener("mousedown", this.onMouseDown);
    this.target.addEventListener("mouseup", this.onMouseUp);
    this.attached = true;
  }
}
