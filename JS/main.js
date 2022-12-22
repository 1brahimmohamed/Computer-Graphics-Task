var gl;
function init()
{
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL (canvas);
    if(!gl) {this.alert("WebGL isn't available");}
    
    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(1.0,1.0,1.0,1.0);

    var vertices = [vec2(-0.25, 0),
                    vec2(0, 0.5),
                    vec2(0.25, 0),
                    vec2(0.25, -0.5),
                    vec2(0.20, -0.6),
                    vec2(0.15, -0.5),
                    vec2(0.1, -0.6),
                    vec2(0.05, -0.5),
                    vec2(0.0, -0.6),
                    vec2(-0.05, -0.5),
                    vec2(-0.1, -0.6),
                    vec2(-0.15, -0.5),
                    vec2(-0.2, -0.6),
                    vec2(-0.25, -0.5)]
    var program=initShaders(gl,"vertex-shader","fragment-shader");
    gl.useProgram(program);

    //load the data into the GPU
    var bufferid=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,bufferid);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(vertices),gl.STATIC_DRAW);
    
    //associate out shader variables with our data buffer
    var vPosition=gl.getAttribLocation(program,"vPosition");
    gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPosition);
    render();

}
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN,0,14);
}
