uniform sampler2D uTexture;
varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 map = texture2D(uTexture, vUv);
    vec3 col = 1.0 - map.rgb;
    float alpha = col.r;


    vec3 greenCol = vec3(0.08, 0.356, 0.196);
    float strength = mix(map.rgb * 5.0, greenCol, vDistance).g * 2.0;

    vec3 finalCol = greenCol * strength;

    gl_FragColor = vec4(finalCol, alpha * finalCol.g);
}