<template>
  <div class="contents">
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-auto p-4">
      <h1 class="text-3xl mb-1 shrink-0">Curves</h1>
      <p class="text-dimmed text-xs mb-4">
        Plot parametric curves, animate with time, and generate with AI.
      </p>
      <div class="flex-1 grid grid-cols-[1.5fr_1fr] gap-4 *:min-w-0 min-h-0">
        <div class="flex flex-col min-h-0 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span>Plot</span>
            <UButton
              icon="i-mdi-refresh"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="resetViewport"
              >Reset</UButton
            >
            <span
              v-if="timeDisplay"
              class="ml-auto text-sm font-mono tabular-nums text-primary"
              >{{ timeDisplay }}</span
            >
          </div>
          <canvas
            ref="refCanvas"
            class="border border-default cursor-crosshair flex-1 w-full min-h-0"
            :width="canvasWidth"
            :height="canvasHeight"
          />
        </div>
        <div>
          <div class="mb-1 flex items-center gap-1">
            <span>Functions</span>
            <UPopover>
              <UButton
                icon="i-mdi-information-outline"
                size="xs"
                color="neutral"
                variant="ghost"
              />
              <template #content>
                <div v-html="CURVES_SYNTAX_HTML" />
              </template>
            </UPopover>
            <UDropdownMenu class="ml-auto" :items="dropdownItems">
              <UButton
                icon="i-mdi-chevron-down"
                size="xs"
                color="neutral"
                variant="ghost"
                label="Examples"
                trailing
              />
            </UDropdownMenu>
          </div>
          <CodeEditor
            class="h-80 border border-default"
            v-model="editorText"
            placeholder="Enter functions, one per line..."
            :linter="exprLinter"
            @input="onInput"
            @cursor-move="onCursorMove"
          />
        </div>
      </div>
    </div>

    <ToolRail :items="toolRailItems">
      <template #panel-snapshots>
        <SnapshotPanel
          title="Snapshots"
          v-model="state.activeIndex"
          :snapshots="snapshots"
          :get-data="getSnapshotData"
          @pick="onPick"
        />
      </template>
      <template #panel-share>
        <ShareUrl :get-params="() => ({ code: editorText })" />
      </template>
      <template #panel-ai>
        <AiPanel
          :on-generate="handleGenerate"
          placeholder="Draw a large ellipse that reveals itself over time..."
        />
      </template>
    </ToolRail>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { Parser, type Expression } from 'expr-eval';
import type { Diagnostic } from '@codemirror/lint';
import CodeEditor from '@/components/code-editor.vue';
import ShareUrl from '@/components/share-url.vue';
import AiPanel from '@/components/ai-panel.vue';
import { generateCurves } from '@/components/curves/ai';
import { CURVES_SYNTAX_HTML } from '@/components/curves/config';
import SnapshotPanel from '@/components/snapshot-panel.vue';
import { Snapshots, Storage } from '@/util';

const store = new Storage<{ code: string }>('curves/settings');
const snapshots = new Snapshots('curves/snapshots');

const state = reactive<{ activeIndex: number }>({
  activeIndex: -1,
});

const toolRailItems = [
  { key: 'snapshots', icon: 'i-mdi-camera', label: 'Snapshots' },
  { key: 'share', icon: 'i-mdi-share-variant', label: 'Share' },
  { key: 'ai', icon: 'i-mdi-auto-fix', label: 'AI Generate' },
];

const DEFAULT_CODE = `sin(x)
cos(x)
# Try your own functions below
`;

const EXAMPLES: Record<string, string> = {
  trig: `sin(x)
cos(x)`,
  animation: `sin(x + T)
cos(x + T * 2)`,
  ellipse: `5*cos(2*PI*t), 3*sin(2*PI*t)`,
  'ellipse-anim': `5*cos(2*PI*t), 3*sin(2*PI*t) {t < T % 2}`,
};

const dropdownItems = [
  { label: 'Simple trig', onSelect: () => loadExample('trig') },
  { label: 'Animation', onSelect: () => loadExample('animation') },
  { label: 'Ellipse', onSelect: () => loadExample('ellipse') },
  { label: 'Ellipse (animated)', onSelect: () => loadExample('ellipse-anim') },
];

function loadExample(key: string) {
  const code = EXAMPLES[key];
  if (code) editorText.value = code;
}

function saveData() {
  store.dump({ code: editorText.value });
}

function restoreData() {
  const saved = store.load({ code: '' });
  if (saved.code) {
    editorText.value = saved.code;
    return true;
  }
  return false;
}

function onPick({ data }: { data: { name?: string; code: string } }) {
  state.activeIndex = -1;
  editorText.value = data.code;
  compileExpressions(data.code);
}

function getSnapshotData() {
  return { code: editorText.value };
}

async function handleGenerate(prompt: string) {
  const result = await generateCurves(prompt, editorText.value, viewport.value);
  if (result) {
    editorText.value = result;
  }
}

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
];

interface StandardLine {
  type: 'standard';
  lineNo: number;
  expr: Expression;
  fn: (x: number, T: number) => number;
  condition?: Expression;
}

interface ParametricLine {
  type: 'parametric';
  lineNo: number;
  xExpr: Expression;
  yExpr: Expression;
  xFn: (t: number, T: number) => number;
  yFn: (t: number, T: number) => number;
  condition?: Expression;
}

type ParsedLine = StandardLine | ParametricLine;

const refCanvas = ref<HTMLCanvasElement>();
const compiledExprs = shallowRef<ParsedLine[]>([]);
const compileErrors = shallowRef<Diagnostic[]>([]);
const editorText = ref(DEFAULT_CODE);
const cursorLine = ref(0);
const timeDisplay = ref('');

const cssWidth = ref(800);
const cssHeight = ref(600);
const canvasWidth = ref(800);
const canvasHeight = ref(600);
const dpr = ref(1);

const viewport = ref({
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
});

const isDark = ref(false);
const themeColors = computed(() => {
  if (isDark.value) {
    return {
      bg: '#1e1e2e',
      gridLine: '#313244',
      axis: '#585b70',
      label: '#a6adc8',
    };
  }
  return {
    bg: '#ffffff',
    gridLine: '#e5e7eb',
    axis: '#9ca3af',
    label: '#6b7280',
  };
});

let animFrame = 0;
let lastPanX = 0;
let lastPanY = 0;
let isPanning = false;
let T = 0;
let tStart = 0;
let animating = false;
let viewportAnimFrame = 0;

function onInput() {
  compileExpressions(editorText.value);
}

function onCursorMove(line: number) {
  cursorLine.value = line;
  scheduleRedraw();
}

function splitTopLevelComma(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of str) {
    if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
      current += ch;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

function compileExpressions(text: string) {
  const lines = text.split('\n');
  const parser = new Parser();
  const result: ParsedLine[] = [];
  const errors: Diagnostic[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (rawLine === undefined) continue;
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const lineStart = lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
    const lineEnd = lineStart + rawLine.length;

    try {
      let condition: Expression | undefined;
      let body = line;
      const braceMatch = line.match(/\{([^}]+)\}$/);
      if (braceMatch) {
        condition = parser.parse(braceMatch[1]!);
        body = line.slice(0, braceMatch.index).trim();
        if (!body) throw new Error('Empty expression before condition');
      }

      const parts = splitTopLevelComma(body);
      if (parts.length >= 2) {
        if (parts.length > 2)
          throw new Error(
            'Too many comma-separated expressions (expected 2 for parametric)',
          );
        const xExpr = parser.parse(parts[0]!.trim());
        const yExpr = parser.parse(parts[1]!.trim());
        const vars = new Set([...xExpr.variables(), ...yExpr.variables()]);
        if (vars.has('x') || vars.has('y')) {
          const bad = ['x', 'y'].filter((v) => vars.has(v));
          throw new Error(
            `Parametric expressions cannot use ${bad.join(', ')} (use t instead)`,
          );
        }
        const xFn = xExpr.toJSFunction('t, T');
        const yFn = yExpr.toJSFunction('t, T');
        try {
          xFn(0, 0);
          yFn(0, 0);
        } catch (err: any) {
          throw new Error(err.message || 'Error evaluating expression');
        }
        result.push({
          type: 'parametric',
          lineNo: i + 1,
          xExpr,
          yExpr,
          xFn,
          yFn,
          condition,
        });
      } else {
        const expr = parser.parse(body);
        if (expr.variables().includes('t')) {
          throw new Error(
            'Use T for time, or use comma syntax for parametric equations',
          );
        }
        const fn = expr.toJSFunction('x, T');
        try {
          fn(0, 0);
        } catch (err: any) {
          throw new Error(err.message || 'Error evaluating expression');
        }
        result.push({ type: 'standard', lineNo: i + 1, expr, fn, condition });
      }
    } catch (err: any) {
      errors.push({
        from: lineStart,
        to: lineEnd,
        severity: 'error',
        message: err.message || 'Invalid expression',
      });
    }
  }

  compiledExprs.value = result;
  compileErrors.value = errors;

  const needsT = result.some((line) => {
    const vars: string[] = [];
    if (line.type === 'standard') {
      vars.push(...line.expr.variables());
    } else {
      vars.push(...line.xExpr.variables(), ...line.yExpr.variables());
    }
    if (line.condition) vars.push(...line.condition.variables());
    return vars.includes('T');
  });
  if (needsT && !animating) {
    tStart = performance.now();
    T = 0;
    animating = true;
    runAnimation();
  } else if (!needsT) {
    animating = false;
    scheduleRedraw();
  }
}

function exprLinter() {
  return compileErrors.value;
}

function getDisplaySize(): [number, number] {
  return [cssWidth.value, cssHeight.value];
}

function worldToPixel(wx: number, wy: number): [number, number] {
  const v = viewport.value;
  const [w, h] = getDisplaySize();
  const px = ((wx - v.xMin) / (v.xMax - v.xMin)) * w;
  const py = h - ((wy - v.yMin) / (v.yMax - v.yMin)) * h;
  return [px, py];
}

function pixelToWorld(px: number, py: number): [number, number] {
  const v = viewport.value;
  const [w, h] = getDisplaySize();
  const wx = v.xMin + (px / w) * (v.xMax - v.xMin);
  const wy = v.yMin + ((h - py) / h) * (v.yMax - v.yMin);
  return [wx, wy];
}

function niceStep(range: number) {
  const rough = range / 8;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * mag;
}

function formatLabel(val: number): string {
  if (Math.abs(val) >= 1e4 || (Math.abs(val) < 0.01 && val !== 0)) {
    return val.toExponential(1);
  }
  return String(parseFloat(val.toPrecision(6)));
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  const v = viewport.value;
  const [w, h] = getDisplaySize();
  const colors = themeColors.value;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);

  const xRange = v.xMax - v.xMin;
  const yRange = v.yMax - v.yMin;
  const step = niceStep(Math.max(xRange, yRange));

  ctx.strokeStyle = colors.gridLine;
  ctx.lineWidth = 1;

  const xStart = Math.ceil(v.xMin / step) * step;
  const yStart = Math.ceil(v.yMin / step) * step;

  ctx.beginPath();
  for (let x = xStart; x <= v.xMax; x += step) {
    const [px] = worldToPixel(x, 0);
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
  }
  for (let y = yStart; y <= v.yMax; y += step) {
    const [, py] = worldToPixel(0, y);
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
  }
  ctx.stroke();

  const [ax, ay] = worldToPixel(0, 0);
  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 1.5;

  if (ax >= 0 && ax <= w) {
    ctx.beginPath();
    ctx.moveTo(ax, 0);
    ctx.lineTo(ax, h);
    ctx.stroke();
  }
  if (ay >= 0 && ay <= h) {
    ctx.beginPath();
    ctx.moveTo(0, ay);
    ctx.lineTo(w, ay);
    ctx.stroke();
  }

  ctx.fillStyle = colors.label;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let x = xStart; x <= v.xMax; x += step) {
    if (Math.abs(x) < step * 0.01) continue;
    const [px] = worldToPixel(x, 0);
    const labelY = Math.min(Math.max(ay + 4, 4), h - 14);
    ctx.fillText(formatLabel(x), px, labelY);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = yStart; y <= v.yMax; y += step) {
    if (Math.abs(y) < step * 0.01) continue;
    const [, py] = worldToPixel(0, y);
    const labelX = Math.max(Math.min(ax - 4, w - 4), 30);
    ctx.fillText(formatLabel(y), labelX, py);
  }
}

function drawCurves(ctx: CanvasRenderingContext2D) {
  const exprs = compiledExprs.value;
  const [w, h] = getDisplaySize();
  const active = cursorLine.value;

  for (let ci = 0; ci < exprs.length; ci++) {
    const parsed = exprs[ci]!;
    const { lineNo, condition } = parsed;
    const color = COLORS[ci % COLORS.length]!;
    const isActive = lineNo === active;

    ctx.strokeStyle = color;
    ctx.lineWidth = isActive ? 3 : 1.5;
    ctx.beginPath();

    if (parsed.type === 'parametric') {
      const { xFn, yFn } = parsed;
      const steps = 500;
      let started = false;
      let lastPx = NaN;
      let lastPy = NaN;

      for (let si = 0; si <= steps; si++) {
        const t = si / steps;
        let wx: number, wy: number;
        try {
          wx = xFn(t, T);
          wy = yFn(t, T);
        } catch {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPx = NaN;
          lastPy = NaN;
          continue;
        }

        if (!isFinite(wx) || !isFinite(wy)) {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPx = NaN;
          lastPy = NaN;
          continue;
        }

        if (condition) {
          try {
            if (!condition.evaluate({ x: wx, y: wy, t, T })) {
              if (started) {
                ctx.stroke();
                ctx.beginPath();
                started = false;
              }
              lastPx = NaN;
              lastPy = NaN;
              continue;
            }
          } catch {
            if (started) {
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
            lastPx = NaN;
            lastPy = NaN;
            continue;
          }
        }

        const [px, py] = worldToPixel(wx, wy);

        if (px < -w || px > 2 * w || py < -h || py > 2 * h) {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPx = NaN;
          lastPy = NaN;
          continue;
        }

        if (!started || Math.hypot(px - lastPx, py - lastPy) > Math.max(w, h)) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
        started = true;
        lastPx = px;
        lastPy = py;
      }

      if (started) ctx.stroke();
    } else {
      const { fn } = parsed;
      let started = false;
      let lastPy = NaN;

      for (let px = 0; px < w; px++) {
        const [wx] = pixelToWorld(px, 0);
        let wy: number;
        try {
          wy = fn(wx, T);
        } catch {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPy = NaN;
          continue;
        }

        if (!isFinite(wy)) {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPy = NaN;
          continue;
        }

        if (condition) {
          try {
            if (!condition.evaluate({ x: wx, y: wy, T })) {
              if (started) {
                ctx.stroke();
                ctx.beginPath();
                started = false;
              }
              lastPy = NaN;
              continue;
            }
          } catch {
            if (started) {
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
            lastPy = NaN;
            continue;
          }
        }

        const [, py] = worldToPixel(wx, wy);

        if (py < -h || py > 2 * h) {
          if (started) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
          }
          lastPy = NaN;
          continue;
        }

        if (!started || Math.abs(py - lastPy) > h) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
        started = true;
        lastPy = py;
      }

      if (started) ctx.stroke();
    }
  }
}

function redraw() {
  const canvas = refCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr.value, 0, 0, dpr.value, 0, 0);
  drawGrid(ctx);
  drawCurves(ctx);
}

function scheduleRedraw() {
  if (animating) return;
  cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(redraw);
}

function runAnimation() {
  if (!animating) {
    timeDisplay.value = '';
    return;
  }
  T = (performance.now() - tStart) / 1000;
  timeDisplay.value = `T=${T.toFixed(1)}`;
  redraw();
  animFrame = requestAnimationFrame(runAnimation);
}

function onMouseDown(e: MouseEvent) {
  isPanning = true;
  lastPanX = e.clientX;
  lastPanY = e.clientY;
}

function onMouseMove(e: MouseEvent) {
  if (!isPanning) return;
  const dx = e.clientX - lastPanX;
  const dy = e.clientY - lastPanY;
  lastPanX = e.clientX;
  lastPanY = e.clientY;

  const v = viewport.value;
  const xRange = v.xMax - v.xMin;
  const yRange = v.yMax - v.yMin;
  const [dw, dh] = getDisplaySize();
  const wxDelta = (-dx / dw) * xRange;
  const wyDelta = (dy / dh) * yRange;

  viewport.value = {
    xMin: v.xMin + wxDelta,
    xMax: v.xMax + wxDelta,
    yMin: v.yMin + wyDelta,
    yMax: v.yMax + wyDelta,
  };
  scheduleRedraw();
}

function onMouseUp() {
  isPanning = false;
}

function onWheel(e: WheelEvent) {
  e.preventDefault();
  const canvas = refCanvas.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const [wx, wy] = pixelToWorld(mx, my);

  const factor = e.deltaY > 0 ? 1.1 : 0.9;
  const v = viewport.value;

  viewport.value = {
    xMin: wx + (v.xMin - wx) * factor,
    xMax: wx + (v.xMax - wx) * factor,
    yMin: wy + (v.yMin - wy) * factor,
    yMax: wy + (v.yMax - wy) * factor,
  };
  scheduleRedraw();
}

function onResize() {
  const canvas = refCanvas.value;
  if (!canvas) return;
  const container = canvas.parentElement;
  if (!container) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return;
  dpr.value = window.devicePixelRatio || 1;
  cssWidth.value = w;
  cssHeight.value = h;
  canvasWidth.value = Math.floor(w * dpr.value);
  canvasHeight.value = Math.floor(h * dpr.value);

  viewport.value = normalizeViewport();
  scheduleRedraw();
}

function normalizeViewport(
  target: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  } = viewport.value,
) {
  const ratio = canvasWidth.value / canvasHeight.value;
  const halfHeight = (target.xMax - target.xMin) / ratio / 2;
  const yCenter = (target.yMin + target.yMax) / 2;
  return {
    ...target,
    yMin: yCenter - halfHeight,
    yMax: yCenter + halfHeight,
  };
}

function resetViewport() {
  tStart = performance.now();
  T = 0;
  animateViewport(
    normalizeViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 }),
  );
}

function animateViewport(
  target: { xMin: number; xMax: number; yMin: number; yMax: number },
  duration = 300,
) {
  const start = { ...viewport.value };
  const startTime = performance.now();
  cancelAnimationFrame(viewportAnimFrame);
  function step(now: number) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    viewport.value = {
      xMin: start.xMin + (target.xMin - start.xMin) * ease,
      xMax: start.xMax + (target.xMax - start.xMax) * ease,
      yMin: start.yMin + (target.yMin - start.yMin) * ease,
      yMax: start.yMax + (target.yMax - start.yMax) * ease,
    };
    redraw();
    if (t < 1) viewportAnimFrame = requestAnimationFrame(step);
  }
  viewportAnimFrame = requestAnimationFrame(step);
}

function checkHash() {
  const query = new URLSearchParams(window.location.hash.slice(1));
  try {
    const code = query.get('code');
    if (code != null) {
      editorText.value = code;
      compileExpressions(code);
    }
  } finally {
    window.location.hash = '';
  }
}

watch(editorText, () => {
  saveData();
});

const disposables: Array<() => void> = [];

onMounted(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  isDark.value = mq.matches;
  mq.addEventListener('change', (e) => {
    isDark.value = e.matches;
    scheduleRedraw();
  });

  if (!restoreData()) {
    compileExpressions(DEFAULT_CODE);
  }

  const canvas = refCanvas.value;
  if (canvas) {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  if (refCanvas.value) {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onResize();
      }
    });
    resizeObserver.observe(refCanvas.value);
    disposables.push(() => resizeObserver.disconnect());
  }
  checkHash();
});

onUnmounted(() => {
  cancelAnimationFrame(animFrame);
  cancelAnimationFrame(viewportAnimFrame);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  disposables.forEach((dispose) => dispose());
});
</script>
