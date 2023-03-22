uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;
varying float vDistance;

float circle (vec2 coord, float r) {
    float fromCenter = length(coord - 0.5);
    float strength = r / fromCenter - r * 2.0;

    return strength;
}

float random(vec2 uv) {
    return fract(dot(uv, vec2(12.9898, 78.233)));
}

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;

    float strength = circle(gl_PointCoord, 0.03);
    float alpha = col.r * strength * vDistance;
    float randomNumber = random(vUv + uTime / 400.0);

    vec3 greenCol = vec3(0.08, 0.356, 0.196);
    vec3 deepgreenCol = vec3(0.036, 0.123, 0.057);

    vec3 finalCol = mix(greenCol, deepgreenCol, randomNumber);

    gl_FragColor = vec4(finalCol, alpha);
}