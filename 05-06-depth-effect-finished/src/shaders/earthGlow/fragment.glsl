varying vec3 vNormal;
uniform float uZoom;

void main() {
  vec3 lightSource = vec3(0.0, 0.0, 1.0);
  float strength = max(1.0, pow(1.0 / (uZoom / 2.0), 5.0));
  float intensity = pow(0.8 - dot(vNormal, lightSource), 5.0) * strength;
  vec3 greenCol = vec3(0.246, 0.623, 0.557);

  gl_FragColor = vec4(greenCol, 1.0) * intensity;
}