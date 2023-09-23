/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á "mousedown" og "mousemove" atburðum
//
//    Hjálmtýr Hafsteinsson, september 2023
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;
// Hálf breidd/hæð ferningsins
var boxRad = 0.05;
var vPosition;

var dX;
var dY;

// Ferningurinn er upphaflega í miðjunni
var verticesBox = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);

var vertices = [
    vec2( -0.1, -0.9 ),
    vec2( -0.1, -0.86 ),
    vec2(  0.1, -0.86 ),
    vec2(  0.1, -0.9 ) 
];
var colorB0 = vec4(1.0, 0.0, 1.0, 1.0);
var bufferId;
var bufferIdBounce;

var mouseX;             // Old value of x-coordinate  
var movement = false;   // Do we move the paddle?
var boxSpadi = vec2( 0.0, 0.0 );
var box = vec2( 0.0, 0.0 );

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    dX = 0.01;//Math.random()*0.1-0.05;
    dY = 0.01;//Math.random()*0.1-0.05;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

        // Associate out shader variables with our data buffer
        vPosition = gl.getAttribLocation( program, "vPosition" );
        //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        //gl.enableVertexAttribArray( vPosition );
        locColor = gl.getUniformLocation( program, "vcolor" );
        //vPosition = gl.getAttribLocation( program, "vPosition" );
        //locBox = gl.getUniformLocation( program, "boxPos" );
    
        locBox = gl.getUniformLocation( program, "boxPos" );
    

    // Load the data into the GPU
    bufferIdBounce = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdBounce );
    //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition );
    //gl.uniform4fv( locColor, flatten(colorB3) );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesBox), gl.DYNAMIC_DRAW );    
    
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition );
    //gl.uniform4fv( locColor, flatten(colorB3) );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
  //  var vPosition = gl.getAttribLocation( program, "vPosition" );
    //gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition );
//    locColor = gl.getUniformLocation( program, "vcolor" );
    //vPosition = gl.getAttribLocation( program, "vPosition" );
    //locBox = gl.getUniformLocation( program, "boxPos" );

    locBox = gl.getUniformLocation( program, "boxPos" );

    // Event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        mouseX = e.offsetX;
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            var xmove = 2*(e.offsetX - mouseX)/canvas.width;
            mouseX = e.offsetX;
            for(i=0; i<4; i++) {
                vertices[i][0] += xmove;
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        }
    } );

    render();
}


function render() {
    boxSpadi[0] += 0;
    boxSpadi[1] += 0;
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Láta ferninginn skoppa af veggjunum
    if(crash()){
        dY = -dY;
    }
    else if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    else if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;
    
    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;
        
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdBounce );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv( locColor, flatten(colorB0) );
    gl.uniform2fv( locBox, flatten(box) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    
    //window.requestAnimFrame(render);

    
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv( locColor, flatten(colorB0) );
    gl.uniform2fv( locBox, flatten(boxSpadi) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    window.requestAnimFrame(render);
}

function crash(){
    if(box[1] < -0.83){
        //return box[0] + boxRad > 0.1 && box[0] - boxRad  -0.1;
        return box[0] + boxRad > vertices[0][0] && box[0] - boxRad < vertices[2][0];
        //return box
        //return true;
        //return (((box[0] + boxRad)));
    }
    else return false;
}
