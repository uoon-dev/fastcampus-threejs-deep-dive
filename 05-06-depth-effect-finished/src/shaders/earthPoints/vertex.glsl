varying vec2 vUv;
varying float vDistance;

void main()
{
    vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    float hiddeness = 0.45;
    float dist = (1.0 / length(mvPosition.xyz)) - hiddeness;

    gl_PointSize = 20.0;
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vDistance = dist;
}