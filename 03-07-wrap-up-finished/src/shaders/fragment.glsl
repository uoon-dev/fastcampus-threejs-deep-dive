uniform float uBrightness;
uniform vec2 uPosition;
uniform vec3 uColor;
uniform float uAlpha;
uniform sampler2D tDiffuse;

varying vec2 vPosition;
varying vec2 vUv;

void main() {
    vec2 newUV = vec2(vUv.x, vUv.y);
    vec4 tex = texture2D(tDiffuse, newUV);
    tex.rgb += uColor;
    float brightness = sin(uBrightness + vUv.x);

    gl_FragColor = tex / brightness;
}