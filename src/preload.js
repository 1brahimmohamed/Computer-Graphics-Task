// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
"use strict";

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    let canvas = document.querySelector("#gl-canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    let program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    let colorLocation = gl.getUniformLocation(program, "u_color");
    let translationLocation = gl.getUniformLocation(program, "u_translation");
    let rotationLocation = gl.getUniformLocation(program, "u_rotation");
    let scaleLocation = gl.getUniformLocation(program, "u_scale");

    // Create a buffer to put positions in
    let positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    let translation = [gl.canvas.width/8, gl.canvas.height/8];
    let rotation = [0, 1];
    let scale = [1, 1];
    let color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider(
        "#x",
        {
            value: translation[0],
            slide: updatePosition(0),
            max: gl.canvas.width
        }
    );
    webglLessonsUI.setupSlider(
        "#y",
        {
            value: translation[1],
            slide: updatePosition(1),
            max: gl.canvas.height
        }
    );
    webglLessonsUI.setupSlider(
        "#angle", {
            slide: updateAngle,
            max: 360
        }
    );
    webglLessonsUI.setupSlider(
        "#scaleX",
        {
            value: scale[0],
            slide: updateScale(0),
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2
        }
    );
    webglLessonsUI.setupSlider(
        "#scaleY",
        {
            value: scale[1],
            slide: updateScale(1),
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2
        }
    );

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(event, ui) {
        let angleInDegrees = 360 - ui.value;
        let angleInRadians = angleInDegrees * Math.PI / 180;
        rotation[0] = Math.sin(angleInRadians);
        rotation[1] = Math.cos(angleInRadians);
        drawScene();
    }

    function updateScale(index) {
        return function (event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color
        gl.uniform4fv(colorLocation, color);

        // Set the translation.
        gl.uniform2fv(translationLocation, translation);

        // Set the rotation.
        gl.uniform2fv(rotationLocation, rotation);

        // Set the scale.
        gl.uniform2fv(scaleLocation, scale);

        // Draw the geometry.
        let primitiveType = gl.TRIANGLES;
        let count = 25;  // 6 triangles in the 'F', 3 points per triangle
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {

    let width = 350,
        length = 300,
        smallTriangleHeight = length+50;

    let vertices = [
        // rectangle
        0,0,
        0,length,
        width,length,

        0,0,
        width,0,
        width,length,

        // upper triangle
        0,0,
        width/2, -width/2,
        width, 0,

        // small triangle 1
        0,length,
        width/5,length,
        (width/5)/2, smallTriangleHeight,

        // small triangle 2
        width/5, length,
        2 * width/5, length,
        1.5 * (width/5), smallTriangleHeight,

        // small triangle 3
        2 * width/5, length,
        3 * width/5, length,
        2.5 * (width/5), smallTriangleHeight,

        // small triangle 4
        3 * width/5, length,
        4 * width/5, length,
        3.5 * (width/5), smallTriangleHeight,

        // small triangle 5
        4 * width/5, length,
        width, length,
        4.5 * (width/5), smallTriangleHeight,
    ]
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW);

}


main();
