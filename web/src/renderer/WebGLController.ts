import { FBOPicker } from './FBOPicker';

export class WebGLController {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private reqFrame: number = 0;

    private fboPicker: FBOPicker;

    // Shader programs
    private nodeProgram: WebGLProgram | null = null;
    private pickingProgram: WebGLProgram | null = null;

    // Buffers
    private nodePositionBuffer: WebGLBuffer | null = null;
    private nodeColorBuffer: WebGLBuffer | null = null;
    private nodePickingIdBuffer: WebGLBuffer | null = null;

    private nodeCount: number = 0;

    // Mouse & Picking State
    private mouseX: number = -1;
    private mouseY: number = -1;
    public hoveredId: number = 0;

    // Tween state
    private activeTween: ((t: number) => { panX: number, panY: number, zoom: number, done: boolean }) | null = null;
    private cameraPan = { x: 0, y: 0 };
    private cameraZoom = 1.0;

    public focusNodesByIndex(indices: number[]) {
        if (indices.length === 0 || !this.nodePositionBuffer) return;

        // Mocking bounding box center for the tween
        const targetPan = { x: 0, y: 0 };
        const targetZoom = 2.5;

        const startTime = performance.now();
        this.activeTween = (t: number) => {
            const progress = Math.min((t - startTime) / 1000.0, 1.0);
            const ease = 1 - Math.pow(1 - progress, 3);
            return {
                panX: this.cameraPan.x + (targetPan.x - this.cameraPan.x) * ease,
                panY: this.cameraPan.y + (targetPan.y - this.cameraPan.y) * ease,
                zoom: this.cameraZoom + (targetZoom - this.cameraZoom) * ease,
                done: progress >= 1.0
            };
        };
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
        if (!gl) throw new Error("WebGL2 is required");
        this.gl = gl;

        this.fboPicker = new FBOPicker(gl);

        this.init();

        // Attach mouse listener to abstract DOM
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
            this.mouseY = (e.clientY - rect.top) * window.devicePixelRatio;
        });

        this.renderLoop = this.renderLoop.bind(this);
        this.reqFrame = requestAnimationFrame(this.renderLoop);
    }

    private init() {
        this.gl.clearColor(0.08, 0.08, 0.1, 1.0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Visible Node Shader
        const vsNode = `#version 300 es
      in vec2 a_position;
      in vec3 a_color;
      out vec3 v_color;
      void main() {
        gl_Position = vec4(a_position * 0.1, 0.0, 1.0);
        gl_PointSize = 12.0;
        v_color = a_color;
      }
    `;
        const fsNode = `#version 300 es
      precision highp float;
      in vec3 v_color;
      out vec4 outColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        outColor = vec4(v_color, 1.0);
      }
    `;

        // Picking Node Shader
        const vsPick = `#version 300 es
      in vec2 a_position;
      in vec3 a_picking_id;
      out vec3 v_picking_id;
      void main() {
        gl_Position = vec4(a_position * 0.1, 0.0, 1.0);
        gl_PointSize = 16.0; // Thicker hit area for hover tolerance
        v_picking_id = a_picking_id;
      }
    `;
        const fsPick = `#version 300 es
      precision highp float;
      in vec3 v_picking_id;
      out vec4 outColor;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        outColor = vec4(v_picking_id, 1.0); // No alpha blending
      }
    `;

        this.nodeProgram = this.createProgram(vsNode, fsNode);
        this.pickingProgram = this.createProgram(vsPick, fsPick);
    }

    public updateGraphData(buffers: {
        nodePositions: Float32Array;
        nodeColors: Float32Array;
        nodePickingIds: Float32Array;
    }) {
        if (!this.nodeProgram || !this.pickingProgram) return;

        this.nodeCount = buffers.nodePositions.length / 2;

        this.nodePositionBuffer = this.createBuffer(buffers.nodePositions);
        this.nodeColorBuffer = this.createBuffer(buffers.nodeColors);
        this.nodePickingIdBuffer = this.createBuffer(buffers.nodePickingIds);
    }

    private createBuffer(data: Float32Array): WebGLBuffer | null {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        return buffer;
    }

    private renderLoop() {
        const dpr = window.devicePixelRatio || 1;
        const cw = Math.floor(this.canvas.clientWidth * dpr);
        const ch = Math.floor(this.canvas.clientHeight * dpr);

        if (this.canvas.width !== cw || this.canvas.height !== ch) {
            this.canvas.width = cw;
            this.canvas.height = ch;
        }

        // Apply Tween
        if (this.activeTween) {
            const state = this.activeTween(performance.now());
            this.cameraPan.x = state.panX;
            this.cameraPan.y = state.panY;
            this.cameraZoom = state.zoom;
            if (state.done) this.activeTween = null;
        }

        // --- PASS 1: FBO Picking ---
        if (this.nodeCount > 0 && this.pickingProgram && this.mouseX >= 0) {
            this.fboPicker.resize(cw, ch);
            this.fboPicker.bind();

            this.gl.useProgram(this.pickingProgram);
            this.bindNodeAttributes(this.pickingProgram, this.nodePickingIdBuffer!);
            this.gl.drawArrays(this.gl.POINTS, 0, this.nodeCount);

            // Read pixel inside FBO state
            this.hoveredId = this.fboPicker.readPixel(this.mouseX, this.mouseY);

            this.fboPicker.unbind();
        }

        // --- PASS 2: Visible Canvas ---
        this.gl.viewport(0, 0, cw, ch);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        if (this.nodeCount > 0 && this.nodeProgram) {
            this.gl.useProgram(this.nodeProgram);
            this.bindNodeAttributes(this.nodeProgram, this.nodeColorBuffer!);
            this.gl.drawArrays(this.gl.POINTS, 0, this.nodeCount);
        }

        this.reqFrame = requestAnimationFrame(this.renderLoop);
    }

    private bindNodeAttributes(program: WebGLProgram, colorBuf: WebGLBuffer) {
        const posLoc = this.gl.getAttribLocation(program, 'a_position');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.nodePositionBuffer);
        this.gl.enableVertexAttribArray(posLoc);
        this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

        const colorLoc = this.gl.getAttribLocation(program, colorBuf === this.nodeColorBuffer ? 'a_color' : 'a_picking_id');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuf);
        this.gl.enableVertexAttribArray(colorLoc);
        this.gl.vertexAttribPointer(colorLoc, 3, this.gl.FLOAT, false, 0, 0);
    }

    public destroy() {
        cancelAnimationFrame(this.reqFrame);
    }

    private createProgram(vsSource: string, fsSource: string): WebGLProgram | null {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fsSource);
        const program = this.gl.createProgram();
        if (!program || !vertexShader || !fragmentShader) return null;
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) return null;
        return program;
    }

    private compileShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type);
        if (!shader) return null;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}
