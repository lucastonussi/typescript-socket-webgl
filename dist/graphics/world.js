export function main() {
    let webgl = captureWebgl();
    if (!webgl) {
        return;
    }
    startWindow(webgl);
}
function captureWebgl() {
    let canvas, webgl;
    canvas = document.querySelector("#canvas");
    console.log(canvas);
    webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!webgl || !(webgl instanceof WebGLRenderingContext)) {
        return null;
    }
    return webgl;
}
function startWindow(webgl) {
    let { r, g, b } = {
        r: 150,
        g: 20,
        b: 130,
    };
    let fragmentCode = `
    void main(void) {
      gl_FragColor = vec4(
        ${r / 255},
        ${g / 255},
        ${b / 255},
        1
      );
    }`;
    let viewport = {
        width: 1000,
        height: 1000,
    };
    let vertexCode = `
    attribute vec2 coordinates; 
    void main(void) {
      gl_Position = vec4(
        coordinates,
        ${viewport.width},
        ${viewport.height}
      );
    }`;
    let vortexes = [110.4, 110.4, 110.0, 11, 11, 110.4];
    if (webgl) {
        initWebGL(webgl, vortexes);
        let vertexShader = createVertexShader(webgl, vertexCode);
        let fragmentShader = createFragmentShader(webgl, fragmentCode);
        let shaderProgram = createShaderProgram(webgl, vertexShader, fragmentShader);
        transformCoordinatesAndSet(webgl, shaderProgram);
        drawArrays(webgl);
    }
}
/**
 * Creates the vertex buffer, binds it, passes the vortex data to it,
 * and sets the color.
 */
function initWebGL(webgl, vortexes) {
    let vertexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vortexes), webgl.STATIC_DRAW);
    webgl.clearColor(0, 0, 0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
}
/**
 * Creates the vertex shader object from the source code defined in
 * 2_vertex_shader.js.
 */
function createVertexShader(webgl, vertexCode) {
    let vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    webgl.shaderSource(vertexShader, vertexCode);
    webgl.compileShader(vertexShader);
    return vertexShader;
}
/**
 * Creates the fragment shader object from the source code defined in
 * 2_vertex_shader.js.
 */
function createFragmentShader(webgl, fragmentCode) {
    let fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    webgl.shaderSource(fragmentShader, fragmentCode);
    webgl.compileShader(fragmentShader);
    return fragmentShader;
}
/**
 * Create and attach the shader programs from the shader compiled objects.
 */
function createShaderProgram(webgl, vertexShader, fragmentShader) {
    let shaderProgram = webgl.createProgram();
    webgl.attachShader(shaderProgram, vertexShader);
    webgl.attachShader(shaderProgram, fragmentShader);
    webgl.linkProgram(shaderProgram);
    webgl.useProgram(shaderProgram);
    return shaderProgram;
}
/**
 * Gets and sets the coordinates associating the compiled shader programs
 * to buffer objects.
 */
function transformCoordinatesAndSet(webgl, shaderProgram) {
    let coordinates = webgl.getAttribLocation(shaderProgram, "coordinates");
    webgl.vertexAttribPointer(coordinates, 2, webgl.FLOAT, false, 0, 0);
    webgl.enableVertexAttribArray(coordinates);
}
/**
 * Draws the arrays.
 */
function drawArrays(webgl) {
    webgl.drawArrays(webgl.TRIANGLES, 1, 3);
}
// document.addEventListener("keydown", (event) => {
//   let canvas = document.getElementById('canvas');
//   let context = canvas.getContext('2d');
//   if (!context) { return };
//   if (event.key === "ArrowUp")    {}
//   if (event.key === "ArrowDown")  {}
//   if (event.key === "ArrowLeft")  {}
//   if (event.key === "ArrowRight") {}
// });
export default { main };
//# sourceMappingURL=world.js.map