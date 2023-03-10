// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
"use strict";

let program

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    let canvas = document.querySelector("#gl-canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

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

    let translation = [gl.canvas.width / 7, gl.canvas.height / 7];
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
        let count = 36;  // 12 triangles in the 'shape', 3 points per triangle
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {

    let width = 200,
        length = 150;

    let rectangle = [
        -width / 2, -length / 2,
        -width / 2, length / 2,
        width / 2, length / 2,

        -width / 2, -length / 2,
        width / 2, length / 2,
        width / 2, -length / 2,
    ]

    let square = [
        -width / 4, -length / 2,
        width / 4, -length / 2,
        -width / 4, -((length / 2) + (width / 2)),

        -width / 4, -((length / 2) + (width / 2)),
        width / 4, -length / 2,
        width / 4, -((length / 2) + (width / 2)),
    ]

    let rightHand = [
        width / 2, -length / 4,
        width / 2, length / 4,
        width / 2 + 100, 0,
    ]

    let leftHand = [
        -width / 2, -length / 4,
        -width / 2, length / 4,
        -width / 2 - 100, 0,
    ]

    let leg1 = [
        -width / 2, length / 2,
        0, length / 2,
        -width / 4, length / 2 + 150,
    ]

    let leg2 = [
        width / 2, length / 2,
        0, length / 2,
        width / 4, length / 2 + 150,
    ]

    let hexagon = [
        -width / 4 - 10, -((length / 2) + (width / 2)),
        width / 4 + 10, -((length / 2) + (width / 2)),
        -width / 4 - 10, -((width / 2) + (length / 2) + 100),

        width / 4 + 10, -((length / 2) + (width / 2)),
        width / 4 + 10, -((width / 2) + (length / 2) + 100),
        -width / 4 - 10, -((width / 2) + (length / 2) + 100),
    ]

    let triangleRight = [
        width / 4 + 10, -((length / 2) + (width / 2)),
        width / 4 + 10, -((width / 2) + (length / 2) + 100),
        width / 2 + 50, -((width / 2) + (length / 2) + 50)
    ]

    let triangleLeft = [
        -width / 4 - 10, -((length / 2) + (width / 2)),
        -width / 4 - 10, -((width / 2) + (length / 2) + 100),
        -width / 2 - 50, -((width / 2) + (length / 2) + 50)
    ]

    let vertices = rectangle.concat(square, rightHand, leftHand, leg1, leg2, hexagon, triangleRight, triangleLeft)

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW);

}

main();
