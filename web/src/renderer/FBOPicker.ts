export class FBOPicker {
    private gl: WebGL2RenderingContext;
    private fbo: WebGLFramebuffer | null = null;
    private texture: WebGLTexture | null = null;
    private depthBuffer: WebGLRenderbuffer | null = null;

    public width: number = 0;
    public height: number = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    public resize(width: number, height: number) {
        if (this.width === width && this.height === height) return;
        this.width = width;
        this.height = height;

        if (this.fbo) this.gl.deleteFramebuffer(this.fbo);
        if (this.texture) this.gl.deleteTexture(this.texture);
        if (this.depthBuffer) this.gl.deleteRenderbuffer(this.depthBuffer);

        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        // Use RGBA8 for pixel exact precision
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA8, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        this.depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);

        this.fbo = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    public bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
        this.gl.viewport(0, 0, this.width, this.height);
        // Ensure blending and multisampling is DISSABLED for picking to avoid ID corruption
        this.gl.disable(this.gl.BLEND);
        this.gl.disable(this.gl.DITHER);

        // Clear with 0,0,0,0 representing background empty ID
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    public unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        // Re-enable blend for visible rendering
        this.gl.enable(this.gl.BLEND);
    }

    public readPixel(x: number, y: number): number {
        this.bind();

        // WebGL Y origin is bottom-left
        const pixelX = Math.floor(x);
        const pixelY = Math.floor(this.height - y);

        const data = new Uint8Array(4);
        this.gl.readPixels(pixelX, pixelY, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);

        this.unbind();

        // Reconstruct RGB into a single ID int (A is ignored)
        const id = (data[0] << 16) | (data[1] << 8) | data[2];

        // id === 0 means background
        return id;
    }
}
