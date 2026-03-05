// In a larger system this extends WebGLController, here we patch the logic for the final MSDF pass.

export const VS_MSDF = `#version 300 es
in vec2 a_position;   // Instance position
in vec2 a_quad_pos;   // Quad vertex (-0.5 to 0.5)
in vec2 a_uv;         // Atlas UV
in vec3 a_color;

uniform mat3 u_transform; // Camera zoom/pan

out vec2 v_uv;
out vec3 v_color;

void main() {
    // Basic scaling logic, UI-space to clip-space
    vec2 pos = (u_transform * vec3(a_position, 1.0)).xy;
    
    // Expand the quad
    vec2 final_pos = pos + (a_quad_pos * 0.05); // Fixed font scale factor
    
    gl_Position = vec4(final_pos, 0.0, 1.0);
    v_uv = a_uv;
    v_color = a_color;
}
`;

export const FS_MSDF = `#version 300 es
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform sampler2D u_msdf_atlas;

in vec2 v_uv;
in vec3 v_color;
out vec4 outColor;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec3 sample_msdf = texture(u_msdf_atlas, v_uv).rgb;
    float sigDist = median(sample_msdf.r, sample_msdf.g, sample_msdf.b) - 0.5;
    
    // Hardware derivatives for crisp scale-independent rendering
    float w = fwidth(sigDist);
    float opacity = smoothstep(-w, w, sigDist);
    
    if (opacity < 0.05) discard;
    
    outColor = vec4(v_color, opacity);
}
`;

// Tweening Logic Patch for WebGLController.focusNodesByIndex
export function createTween(startPan: { x: number, y: number }, targetPan: { x: number, y: number }, startZoom: number, targetZoom: number, duration: number) {
    const startTime = performance.now();
    return function tick(currentTime: number) {
        const t = Math.min((currentTime - startTime) / duration, 1.0);
        // EaseOutExpo or similar
        const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const panX = startPan.x + (targetPan.x - startPan.x) * ease;
        const panY = startPan.y + (targetPan.y - startPan.y) * ease;
        const zoom = startZoom + (targetZoom - startZoom) * ease;

        return { panX, panY, zoom, done: t >= 1.0 };
    };
}
