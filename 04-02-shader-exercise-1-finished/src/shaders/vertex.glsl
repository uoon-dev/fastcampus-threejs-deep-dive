
uniform float uTime;
in float aRandomPosition;

out float vRandomPosition;
out vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += aRandomPosition / 20.0;
    modelPosition.z += aRandomPosition / 20.0 * sin(uTime);
    // modelPosition.z += sin(uTime + modelPosition.x) / 2.0;

    vRandomPosition = (aRandomPosition + 1.0) / 2.0;
    vRandomPosition /= uTime * 0.3;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vUv = uv;
}