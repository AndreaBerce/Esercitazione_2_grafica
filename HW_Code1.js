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
  var camPos = new Vector3([0.0,0.0,6.0]);
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


  var raggio = Math.sqrt(2);

  var centri = new Float32Array([0,1,0,1,0,-1,0,-1]);
  var dimensioni = new Float32Array([0,raggio,raggio,0]);
  var precisioneC = 4;


  //
  gui.addColor(colore,'color0').onFinishChange(function(value) {
	  console.log(value);
    refreshhh();
    console.log(colore);
  });

  // Funzione di refresh. Ridisegna la figura corrente, aggiornando il colore.
  function refreshhh(){
    g_colors.pop();
    g_colors.pop();
    g_colors.pop();

    g_colors.push(colore.color0[0]/255);
    g_colors.push(colore.color0[1]/255);
    g_colors.push(colore.color0[2]/255);
    return n = genericHedron(gl, centri, dimensioni, precisioneC);
  }


  //
  var n = genericHedron(gl, centri, dimensioni, precisioneC);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }


  //------------------------------------------------------------------
  gui.add(geometria,'cube').onFinishChange(function(value) {
    // Fires when a controller loses focus.
	   if(value == true){
    		geometria.cube = value;
    		geometria.cone = false;
    		geometria.cylinder = false;
    		geometria.sphere = false;
    		geometria.torus = false;
	   }

     raggio = Math.sqrt(2);
     centri = new Float32Array([0,1, 0,1, 0,-1, 0,-1]);
     dimensioni = new Float32Array([0, raggio, raggio, 0]);
     precisioneC = 4;

     n = genericHedron(gl, centri, dimensioni, precisioneC);

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


     centri = new Float32Array([0,1, 0,-1, 0,-1]);
     dimensioni = new Float32Array([0, 1, 0]);
     precisioneC = 64;

     n = genericHedron(gl, centri, dimensioni, precisioneC);


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

     centri = new Float32Array([0,1, 0,1, 0,-1, 0,-1]);
     dimensioni = new Float32Array([0, 1, 1, 0]);
     precisioneC = 64;

     n = genericHedron(gl, centri, dimensioni, precisioneC);

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

     precisioneC = 50;
     centri = new Float32Array(precisioneC*2);
     dimensioni = new Float32Array(precisioneC);

     raggio = 1;
     var angolo = Math.PI / 2;
     for(var i = 0; i < precisioneC; i++){
        centri[i*2] = 1;                                // x
        centri[i*2+1] = raggio * Math.sin(angolo);      // y
        dimensioni[i] = raggio * Math.cos(angolo);
        angolo = angolo - ( Math.PI / (precisioneC - 1) );
     }
     dimensioni[0] = 0;
     dimensioni[precisioneC-1] = 0;

     console.log("SFERA\n");
     n = genericHedron(gl, centri, dimensioni, precisioneC);

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

     //n = initVertexBuffers(gl);
     centri = [];
     dimensioni = [];
     precisioneC = 40;
     // Genero i punti del cerchio principale
     raggio = 1.1;
     var raggino = 0.3;
     
     for(var i = 0; i <= 2*Math.PI; i+= 2*Math.PI/precisioneC){
        centri.push(raggio * Math.cos(i));                                // x
        centri.push(raggio * Math.sin(i));                                // y
        dimensioni.push(raggino);
     }
     
     //Il primo elemento si ripete
     centri.unshift(centri[1]);
     centri.unshift(centri[1]); //Pusho di nuovo lo stesso perché ora sono shiftati dopo il primo unshift
     dimensioni.unshift(0);

     centri.push(centri[0]);
     centri.push(centri[1]);
     dimensioni.push(raggino);
     console.clear();
     console.log("TORO\n");

     console.log(centri);
     console.log(dimensioni);

     
     
     n = genericHedron(gl, new Float32Array(centri), new Float32Array(dimensioni), precisioneC);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
   });



  //*********************************************************************************
  var tick = function() {

      currentAngle = animate(currentAngle);  // Update the rotation angle
      // Calculate the model matrix
      modelMatrix.setRotate(currentAngle, -1, 0, 0); // Rotate around the y-axis

      mvpMatrix.set(vpMatrix).multiply(modelMatrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      // Clear color and depth buffer
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Draw the cube
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}

function precision(x) {
  return Number.parseFloat(x).toPrecision(3);
}

function genericHedron(gl, centri, distanza, precisioneC){  //coordinate centri, distanza punti da centri, precisione cerchi
  var isClosed = false;
  var xCentro;
  var yCentro;
  // calcolo numero di vertici della figura
  var nv = 0; // numero vertici
  var ni = 0; // numero indici

  
  // Probabilmente non così utile, visto che si usano i push
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
      
  }
  nv = nv * 3;

  

  // creazione del vettore dei vertici
  var vertices = [];
  var colors = [];
  var colorStep = 0.05;

  for(var i=0; i < nv/3; i++){
    colors.push(g_colors[0]);
    colors.push(g_colors[1]);
    colors.push(g_colors[2]);
  }

  // Indices of the vertices
  var indices = new Uint16Array(ni);


  // Controllo se è un solido chiuso
  if(centri[0] == centri[centri.length-2] && centri[1] == centri[centri.length-1])  isClosed = true;
    
  xCentro = 0;
  yCentro = 0;
  for(var i=0; i<centri.length/2; i++){
      xCentro += centri[i*2];
      yCentro += centri[i*2 +1];
  }
  xCentro /= centri.length/2;
  yCentro /= centri.length/2;

  console.log("Centro della figura = (" +xCentro+ "," +yCentro+ ")");
    

  var angolo = Math.PI / 4;
  var ind = 0; // TODO: forse si può togliere gli ind per usare invece push
  var tempInd = 0;
  var tempInd2 = 0;
  for(var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti

      //stfu gli altri <3
      //var alpha = Math.atan2(centri[i*2 +1] - centri[(i-1)*2 +1], centri[i*2] - centri[(i-1)*2]); // Arcsin(y2-y1, x2-x1)
      //console.log("\nAngolo: "+alpha);
          
              var y2 = centri[i*2 +1];
              var y1 = yCentro;
              var x2 = centri[i*2];
              var x1 = yCentro;
              var m1 = (y2-y1)/(x2-x1); // Trovo la m del poligono corrente

              var alphaCorrente = Math.atan(m1);
              
              var q = y2 - m1*x2;

              console.log("Angolo: "+ alphaCorrente);
          
      if(distanza[i] > 0){  // Se deve essere un poligono

          // Intanto dobbiamo in ogni caso calcolare i punti dell'nAgono che lo circonda.
          for(var j = 0; j < precisioneC; j++){
            
            var x = centri[i*2] + distanza[i] * Math.cos(angolo);
            if(isClosed) x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
            var y = centri[i*2 + 1];
            if(isClosed) y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
            var z = distanza[i] * Math.sin(angolo);


            vertices.push(x);        // x
            vertices.push(y);        // y
            vertices.push(z);        // Z

            angolo = angolo + ( 2 * Math.PI/precisioneC );
            

            //TEST colorstep
            colors.push(g_colors[0]);
            colors.push(g_colors[1]);
            colors.push(g_colors[2]);

            
            
          }
          if( distanza[i-1] == 0 ){ // Se il precedente era un punto con distanza 0
              
              for( var j = 0; j < precisioneC ; j++ ){
                  
                  indices[ind] = tempInd;
                  indices[ind+1] = tempInd2+1;
                  indices[ind+2] = tempInd2+2;
                  ind = ind + 3;
                  tempInd2 = tempInd2 + 1;
                  ;
              }
              indices[ind-1] = tempInd + 1;
          }else{  // Se il precedente era un poligono

              // Ogni due lati, un quadrato tra loro e i loro corrispondenti nell'ultimo poligono
              // Se ho per esempio due quadrati e devo fare gli indici dei triangolini in mezzo:
              /*
              Precisione : 5
              indici da mettere:
              9,8,4,    4,3,8,    8,7,3,    3,2,7,    7,6,2,    2,1,6,    6,9,1,    1,4,9

              1---------2                             6---------7
              |         |                             |         |
              |    0    |    la parte prima,          |    5    |    la parte seconda
              |         |                             |         |
              4---------3                             9---------8
              */

              tempInd = tempInd2 + 1;
              tempInd2 = tempInd2 - precisioneC;
              var temp = tempInd; // Mi salvo dov'era ind prima delle modifiche di questo ciclo
              var temp2 = tempInd2 + 1;
              
              for( var j = 0; j < precisioneC; j++ ){

                indices[ind] = tempInd;
                  indices[ind+1] = tempInd+1;
                  indices[ind+2] = tempInd2+1;

                  indices[ind+3] = tempInd+1;
                  indices[ind+4] = tempInd2+1;
                  indices[ind+5] = tempInd2+2;

                  ind = ind + 6;
                  tempInd = tempInd + 1;
                  tempInd2 = tempInd2 + 1;
              }
              indices[ind-5] = temp;
              indices[ind-3] = temp;
              indices[ind-2] = tempInd2;
              indices[ind-1] = temp2;
              tempInd2 = tempInd-1;
          }
      }else{
          
          vertices.push(centri[i*2]);
          vertices.push(centri[i*2 + 1]);
          vertices.push(0);

          // Coloriamo bianchi il primo e ultimo punto, in modo che si capisca se la figura è corretta
          // anche senza shader per la luce.
          colors[0] = 1;
          colors[1] = 1;
          colors[2] = 1;
          colors[colors.length-1] = 1;
          colors[colors.length -2] = 1;
          colors[colors.length -3] = 1;
          
          
          if( i != 0 ){
              
              tempInd = tempInd2 + 1;
              tempInd2 = tempInd2 - precisioneC + 1;
              
              for( var j = 0; j < precisioneC; j++ ){
                  
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
  //console.log("vertici:", vertices);


  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices),       3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_Color',    new Float32Array(colors),  3, gl.FLOAT)) return -1;

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
var ANGLE_STEP = 10; //10
// Last time that this function was called
var g_last = Date.now();


function animate(angle) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 500.0;
    return newAngle %= 360;
}
