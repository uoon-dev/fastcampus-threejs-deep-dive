varying vec3 vNormal;

void main() {
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vNormal = normalize(normalMatrix * normal);
}