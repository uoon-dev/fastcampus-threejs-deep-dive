precision mediump float;

varying vec2 vUv;

float smoothy(float edge0, float edge1, float x) {
    float t = clamp((x - 0.3) / (0.7 - 0.3), 0.0, 1.0);

    float strength = t * t * (3.0 - 2.0 * t);

    return strength;
}

void main()
{
    // 1. 그라데이션
    // float x = vUv.x;
    // float y = vUv.y;

    // float col = x;

    // gl_FragColor = vec4(col, col, col, 1.0);

    // 2. 대각선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // // if (y <= x + 0.1) {
    // if (y <= x + 0.005 && y + 0.005 >= x) {
    //     col = green;
    // }

    // 3. 곡선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (x * x <= y && x * x >= y - 0.005) {
    //     col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 4. 그래프 + 그라데이션
    // float x = vUv.x / 2.0;
    // float y = vUv.y;

    // vec3 col = vec3(x * x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (x * x <= y && x * x >= y - 0.005) {
    //     col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 5. step
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // float strength = step(0.5, x);

    // if (strength == 0.0) {
    //     discard;
    // }

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 6. min, max
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // float strength = max(0.5, x);

    // vec3 col = vec3(strength);

    // 7. clamp
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // float strength = clamp(x, 0.3, 0.7);

    // vec3 col = vec3(strength);


    // gl_FragColor = vec4(col, 1.0);

    // 8. smoothstep
    // float x = vUv.x;
    // float y = vUv.y;

    // float strength = smoothstep(0.3, 0.7, x);

    // vec3 green = vec3(0.0, 1.0, 0.0);


    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);

    // 9. mix
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    // vec3 blue = vec3(0.0, 0.0, 1.0);

    // vec3 col = mix(green, blue, x);
    // mix(1.0, 2.0, 0.0); // 0.0
    // mix(1.0, 2.0, 0.25); // 1.25
    // mix(1.0, 2.0, 0.5); // 1.5

    // gl_FragColor = vec4(col, 1.0);

    // 10. pow
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (pow(x, 4.0) <= y && pow(x, 4.0) >= y - 0.005) {
    //     col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 11. sqrt
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (sqrt(x) <= y && sqrt(x) >= y - 0.005) {
    //     col = green;
    // }

    // gl_FragColor = vec4(col, 1.0);

    // 12. mod
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(mod(x * 7.0, 1.0));
    // col = step(0.5, col);

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // gl_FragColor = vec4(col, 1.0);

    // 13. fract
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(fract((y - 0.11) * 7.0));
    // vec3 col2 = vec3(fract((x - 0.11) * 7.0));

    // col = 1.0 - step(0.5, col) * step(0.5, col2);

    // fract(0.4); // 0.4
    // fract(2.3); // 0.3
    // fract(5.75); // 0.75

    // gl_FragColor = vec4(col, 1.0);

    // 14. sin, cos
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(cos(x * 20.0));


    // gl_FragColor = vec4(col, 1.0);

    // 15. abs
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(abs(cos(x * 20.0)));


    // gl_FragColor = vec4(col, 1.0);

    // 16. distance
    // float x = vUv.x;
    // float y = vUv.y;

    // float dist = distance(vec2(x, y), vec2(0.5));
    // dist = step(0.3, dist);

    // vec3 col = vec3(dist);

    // gl_FragColor = vec4(col, 1.0);

    // 17. length
    float x = vUv.x;
    float y = vUv.y;

    float dist = length(vec2(x, y) - 0.5);
    // dist = step(0.3, dist);

    vec3 col = vec3(dist);

    gl_FragColor = vec4(col, 1.0);
}