varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    float dist = pow(length(mvPosition.xyz) / 2.0, 6.0);

    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vDistance = dist;
}