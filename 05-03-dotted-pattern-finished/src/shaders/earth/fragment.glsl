uniform sampler2D uTexture;
varying vec2 vUv;

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r;

    vec3 greenColor = vec3(0.0, 1.0, 0.0);
    col = greenColor;

    gl_FragColor = vec4(col, alpha);

    float x = fract(vUv.x * 100.0);
    float y = fract(vUv.y * 100.0);

    vec3 greenCol = vec3(0.0, 1.0, 0.0);

    vec3 finalCol = map.r * greenCol * 2.0;

    gl_FragColor = vec4(finalCol, alpha * finalCol.g);
}