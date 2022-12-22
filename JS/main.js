let gl;

function init() {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        this.alert("WebGL isn't available");
    }

    //configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    let x = 1,
        y = 1,
        tx = 0,
        ty = 0;

    let vertices = [
        vec2((x * -0.25) + tx  ,  (y *  0  ) + ty   ),
        vec2((x * 0    ) + tx  ,  (y *  0.5) + ty   ),
        vec2((x * 0.25 ) + tx  ,  (y *  0  ) + ty   ),
        vec2((x * 0.25 ) + tx  ,  (y * -0.5) + ty   ),
        vec2((x * 0.20 ) + tx  ,  (y * -0.6) + ty   ),
        vec2((x * 0.15 ) + tx  ,  (y * -0.5) + ty   ),
        vec2((x * 0.1  ) + tx  ,  (y * -0.6) + ty   ),
        vec2((x * 0.05 ) + tx  ,  (y * -0.5) + ty   ),
        vec2((x * 0.0  ) + tx  ,  (y * -0.6) + ty   ),
        vec2((x * -0.05) + tx  ,  (y * -0.5) + ty   ),
        vec2((x * -0.1 ) + tx  ,  (y * -0.6) + ty   ),
        vec2((x * -0.15) + tx  ,  (y * -0.5) + ty   ),
        vec2((x * -0.2 ) + tx  ,  (y * -0.6) + ty   ),
        vec2((x * -0.25) + tx  ,  (y * -0.5) + ty   )
    ]
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //load the data into the GPU
    let bufferid = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferid);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    //associate out shader letiables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 14);
}
