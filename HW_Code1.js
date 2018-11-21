// hw2.js
// Vertex shader program
///////////////////////////////////////////C IAOOOO
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n'      + // Vertex coordinates
  'attribute vec4 a_Color;\n'  +        // Vertex Color
  'uniform mat4 u_MvpMatrix;\n'       + // Model-View-Projection Matrix
  'varying vec4 v_Color;\n'           + // vertex color
  'void main() {\n'                   +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';
//******************************************************************************************
// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';
//*****************************************************************************************

var g_colors=[]; // Vettore dei colori


function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }



  // Set the clear color and enable the depth test
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_MvpMatrix      = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix ) {
    console.log('Failed to get the storage location');
    return;
  }

  var vpMatrix = new Matrix4();   // View projection matrix
  var camPos = new Vector3([0.0,3.0,6.0]);
  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 1000);
  vpMatrix.lookAt(camPos.elements[0],camPos.elements[1],camPos.elements[2], 0, 0, 0, 0, 1, 0);

  var currentAngle = 0.0;  // Current rotation angle
  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix



  //*********************************************************************
  // creo una GUI con dat.gui
  var gui = new dat.GUI();
  // checkbox geometry
  var geometria = {cube:true,cone:false,cylinder:false,sphere:false,torus:false};

  // color selector
  var colore = {color0:[255,0,0]};

  g_colors.push(colore.color0[0]/255);
  g_colors.push(colore.color0[1]/255);
  g_colors.push(colore.color0[2]/255);

  //
  gui.addColor(colore,'color0').onFinishChange(function(value) {
	  console.log(value);
    refreshhh();
    console.log(colore);
  });
  // Funzione che aggiorna il colore da usare nell'array g_colors
  function changeColor(){
    g_colors.pop();
    g_colors.pop();
    g_colors.pop();

    g_colors.push(colore.color0[0]/255);
    g_colors.push(colore.color0[1]/255);
    g_colors.push(colore.color0[2]/255);
  }
  // Funzione di refresh. Ridisegna la figura corrente, aggiornando il colore.
  function refreshhh(){
    changeColor();
    return n = initVertexBuffers(gl);
  }


  //
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }


  //
  gui.add(geometria,'cube').onFinishChange(function(value) {
    // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = value;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = false;
	   }

     changeColor();
     n = initVertexBuffers(gl);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });
  gui.add(geometria,'cone').onFinishChange(function(value) {
    // Fires when a controller loses focus.
       // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = value;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = false;
	   }


     changeColor();
     //n = genericHedron(gl, [0,0,0,1], [1,0], 3);
     n = genericHedron(gl, [0,1,0,0,0,0], [0,1,0], 3);


	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });
  gui.add(geometria,'cylinder').onFinishChange(function(value) {
    // Fires when a controller loses focus.
       // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = value;
    		geometria.sphere = false;
    		geometria.torus = false;
	   }

     changeColor();
     n = initVertexBuffers(gl);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });
  gui.add(geometria,'sphere').onFinishChange(function(value) {
    // Fires when a controller loses focus.
       // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = value;
    		geometria.torus = false;
	   }

     changeColor();
     n = initVertexBuffers(gl);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });
  gui.add(geometria,'torus').onFinishChange(function(value) {
    // Fires when a controller loses focus.
       // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = false;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = value;
	   }

     changeColor();
     n = initVertexBuffers(gl);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });



  //*********************************************************************************
  var tick = function() {
    	// read geometria
    	/*for(var x in geometria){
    		if(geometria[x] == true)
    			console.log(x);
    	}*/

      currentAngle = animate(currentAngle);  // Update the rotation angle
      // Calculate the model matrix
      modelMatrix.setRotate(currentAngle, -1, 0, 0); // Rotate around the y-axis

      mvpMatrix.set(vpMatrix).multiply(modelMatrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      // Clear color and depth buffer
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Draw the cube
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

      requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}



function genericHedron(gl, centri, distanza, precisioneC){  //coordinate centri, distanza punti da centri, precisione cerchi
  // calcolo numero di vertici della figura
  var nv = 0; // numero vertici
  var ni = 0; // numero indici
  var precedentePunto=true;
  for(var i = 0; i < (centri.length / 2); i++){
      if(distanza[i] > 0){
          nv = nv + precisioneC;
          if(precedentePunto){
              ni = ni + precisioneC*3;
          }else{
              ni = ni + precisioneC*6;
          }
          precedentePunto = false;
      }else{
          nv++;
          if( i != 0 ){
              ni = ni + precisioneC*3;
          }
          precedentePunto=true;
      }
      console.log(nv);
  }
  nv = nv * 3;
  console.log("nv = ", nv);
  console.log("ni = ", ni);

  // creazione del vettore dei vertici
  var vertices = new Float32Array(nv);

  //
  var colors = new Float32Array(nv);
  for(var i=0; i < 24; i++){
    colors[i*3] = g_colors[0];
    colors[i*3+1] = g_colors[1];
    colors[i*3+2] = g_colors[2];
  }

  // Indices of the vertices
  var indices = new Uint8Array(ni);

  var count = 0;
  var angolo = 0;
  var ind = 0;
  var tempInd = 0;
  var tempInd2 = 0;
  for(var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti
      console.log("i = ", i);
      if(distanza[i] > 0){  // Se deve essere un poligono
          var temp = count;
          console.log("punti");
          if( distanza[i-1] == 0 ){ // Se il precedente era un punto con distanza 0
              for(var j = 0; j < precisioneC; j++){
                  console.log("j = ", j);

                  vertices[count] = distanza[i] * Math.cos(angolo);        // x
                  vertices[count+1] = centri[i*2 + 1];                     // y
                  vertices[count+2] =  distanza[i] * Math.sin(angolo);     // Z

                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  colors[count*3] = g_colors[0] ;
                  colors[count*3 + 1] = g_colors[1] ;
                  colors[count*3 + 2] = g_colors[2] ;
                  //colors[count*3 + 2] = 1 ;

                  count = count + 3;
              }
              //var tempInd2 = ind;
              //tempInd = ind;
              for( var j = 0; j < precisioneC ; j++ ){
                  console.log("j = ", j);
                  indices[ind] = tempInd;
                  indices[ind+1] = tempInd2+1;
                  indices[ind+2] = tempInd2+2;
                  ind = ind + 3;
                  tempInd2 = tempInd2 + 1;
                  //console.log("indici:", indices);
              }
              indices[ind-1] = tempInd + 1;
          }else{  // Se il precedente era un poligono

              //In ogni caso, calcolare i punti del poligono
              for(var j = 0; j < precisioneC; j++){
                  // vertices
                  console.log("j = ", j);

                  vertices[count] = distanza[i] * Math.cos(angolo);        // x
                  vertices[count+1] = centri[i*2 + 1];                     // y
                  vertices[count+2] =  distanza[i] * Math.sin(angolo);     // Z

                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  colors[count*3] = g_colors[0] ;
                  colors[count*3 + 1] = g_colors[1] ;
                  colors[count*3 + 2] = g_colors[2] ;
                  //colors[count*3 + 2] = 1 ;

                  count = count + 3;
                  
              }
              // Ogni due lati, un quadrato tra loro e i loro corrispondenti nell'ultimo poligono

              // Se ho per esempio due quadrati e devo fare gli indici dei triangolini in mezzo:
              /*
              Precisione : 5
              indici da mettere:   
              9,8,4,    4,3,8,    8,7,3,    3,2,7,    7,6,2,    2,1,6,    6,9,1,    1,4,9
              9,8,4,    8,7,3,    7,6,2,    6,9,1,    4,3,8,    3,2,7,    2,1,6     1,4,9

              1---------2                             6---------7
              |         |                             |         |
              |    0    |    la parte prima,          |    5    |    la parte seconda
              |         |                             |         |
              4---------3                             9---------8

              */
              var temp = ind; // Mi salvo dov'era ind prima delle modifiche di questo ciclo
              for( var j = 0; j < precisioneC ; j++ ){
                console.log("j = ", j);
                indices[ind] = indices[temp];
                indices[ind+1] = indices[temp-1];
                indices[ind+2] = indices[temp-2];
                ind = ind + 3;
                tempInd2 = tempInd2 + 1;
                //console.log("indici:", indices);
            }
            indices[ind-1] = tempInd + 1;
          }
      }else{
          //console.log("count = ", count);
          //console.log("punto");
          vertices[count] = centri[i];
          vertices[count + 1] = centri[i + 1];
          vertices[count + 2] = 0;

          //colors[count] = g_colors[0];
          colors[count] = 1;
          //colors[count + 1] = g_colors[1];
          colors[count + 1] = 1;
          //colors[count + 2] = g_colors[2];
          colors[count + 2] = 1;
          //console.log("colore:", colors);
          count = count + 3;
          if( i != 0 ){
              tempInd = tempInd2 + 1;
              tempInd2 = tempInd2 - precisioneC + 1;
              for( var j = 0; j < precisioneC; j++ ){
                  console.log("j = ", j);
                  indices[ind] = tempInd;
                  indices[ind+1] = tempInd2;
                  indices[ind+2] = tempInd2+1;
                  ind = ind + 3;
                  tempInd2 = tempInd2 + 1;
              }
              indices[ind-1] = tempInd2 - precisioneC;
          }
      }
  }
  console.log("vertici:", vertices);
  console.log("indici:", indices);
  console.log("colore:", colors);
  //console.log("n indici:", indices.length);
/*
  //Per ogni vertice:
  for(var i=1; i < nv+1; i++){
      // Calcolamo le coordinate del vertice corrente
      vertices[i*3] = raggio * Math.cos(angolo);        // x
      vertices[i*3 + 1] = raggio * Math.sin(angolo);    // y
      vertices[i*3 + 2] = 0.0 ;                         // z
      // Andiamo al prossimo vertice (per il prossimo ciclo)
      angolo = angolo + ( 2 * Math.PI/nVertici );
      // Riempie il vettore dei colori
      colors[i*3] = g_colors[0];
      colors[i*3 + 1] = g_colors[1];
      colors[i*3 + 2] = g_colors[2];
      // Settiamo gli indici del triangolo corrente
      indices[i*3] = 0;
      indices[i*3 + 1]=i+1;
      indices[i*3 + 2]=i+2;
  }
*/



  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices,       3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color',    colors,  3, gl.FLOAT)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}




function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    // Coordinates
    var vertices = new Float32Array([
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);
/*
    // Colors
    var colors = new Float32Array([    // Colors
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0 　    // v4-v7-v6-v5 back
    ]);
*/
    var colors = new Float32Array(72);
    for(var i=0; i < 24; i++){
      colors[i*3] = g_colors[0];
      colors[i*3+1] = g_colors[1];
      colors[i*3+2] = g_colors[2];
    }

    // Indices of the vertices
    var indices = new Uint8Array([
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);

    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices,       3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color',    colors,  3, gl.FLOAT)) return -1;

    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}




function initArrayBuffer(gl, attribute, data, num, type) {
    // Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute);
      return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);
    return true;
}




// Rotation angle (degrees/second)
var ANGLE_STEP = 10.0;
// Last time that this function was called
var g_last = Date.now();


function animate(angle) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}
