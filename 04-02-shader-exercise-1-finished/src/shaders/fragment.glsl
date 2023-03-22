uniform sampler2D uTexture;

in float vRandomPosition;
in vec2 vUv;
out vec4 myFragColor;

void main()
{
    vec4 tex = texture(uTexture, vUv);
    // gl_FragColor = tex * vRandomPosition;
    myFragColor = tex * vRandomPosition;
    // myFragColor = tex;
}