export default function () {
  // WebGL 시작하기
  const container = document.querySelector('#container');
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;

  container.appendChild(canvas);

  const gl = canvas.getContext('webgl');

  // vertex shader 만들기
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader,
    `
    attribute vec2 position;
    varying vec2 vPosition;

    void main() {
      vec2 newPosition = (position + 1.0) / 2.0; // 0~1
      gl_Position = vec4(position, 0.0, 1.0);

      vPosition = newPosition;
    }
  `
  );
  gl.compileShader(vertexShader);

  // fragment shader 만들기
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fragmentShader,
    `
    precision mediump float;
    varying vec2 vPosition;

    void main() {
      gl_FragColor = vec4(vPosition, 0.0, 1.0);
    }
  `
  );
  gl.compileShader(fragmentShader);

  // vertex shader, fragment shader를 하나의 프로그램으로 연결해보기
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  // 정점 데이터 넘겨주기
  const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 정점의 위치를 어떻게 계산할지 정보를 넘겨주기
  const position = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(position);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
