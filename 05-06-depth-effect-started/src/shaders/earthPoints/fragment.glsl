uniform sampler2D uTexture;
varying vec2 vUv;

float circle (vec2 coord, float r) {
    float fromCenter = length(coord - 0.5);
    float strength = r / fromCenter - r * 2.0;

    return strength;
}

void main()
{
    float strength = circle(gl_PointCoord, 0.01);

    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r * strength;


    float x = fract(vUv.x * 100.0);
    float y = fract(vUv.y * 100.0);

    float dist = length(vec2(x, y) - 0.5);

    vec3 greenCol = vec3(0.0, 1.0, 0.0);

    vec3 finalCol = mix(greenCol, vec3(0.0), step(0.1, dist));
    finalCol.g += map.r * 2.0;

    gl_FragColor = vec4(greenCol, alpha);
}