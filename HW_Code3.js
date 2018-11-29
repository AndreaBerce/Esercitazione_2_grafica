// Codice1.js
// implementazione modello di blinn phong
// GDD - 2017
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n'   +
  'uniform mat4 u_MvpMatrix;\n'  +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix

  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'uniform vec3 u_LightColor;\n'   +   // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'uniform vec3 u_DiffuseMat;\n'   +   // Diffuse material color
  'uniform vec3 u_SpecularMat;\n'  +   // Specular material color
  'uniform float u_Shininess  ;\n' +   // Specular material shininess
  'uniform vec3 u_AmbientMat;\n'   +   // Ambient material color
  'uniform vec3 u_CameraPos;\n'    +   // Camera Position

  'varying vec4 v_Normal;\n' +
  'varying vec4 v_vertexPosition;\n' +
  'varying mat4 v_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec3 v_LightColor;\n'   +   // Light color
  'varying vec3 v_LightPosition;\n' +  // Position of the light source
  'varying vec3 v_AmbientLight;\n' +   // Ambient light color
  'varying vec3 v_DiffuseMat;\n'   +   // Diffuse material color
  'varying vec3 v_SpecularMat;\n'  +   // Specular material color
  'varying float v_Shininess  ;\n' +   // Specular material shininess
  'varying vec3 v_AmbientMat;\n'   +   // Ambient material color
  'varying vec3 v_CameraPos;\n'    +   // Camera Position

  'varying vec4 v_Color;\n'        +
  'void main() {\n'                +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
      // Calculate world coordinate of vertex
    '  v_vertexPosition = u_ModelMatrix * a_Position;\n' +

    '  v_Normal = a_Normal;\n' +
    '  v_NormalMatrix = u_NormalMatrix;\n' +
    '  v_LightColor = u_LightColor;\n' +
    '  v_LightPosition = u_LightPosition;\n' +
    '  v_AmbientLight = u_AmbientLight;\n' +
    '  v_DiffuseMat = u_DiffuseMat;\n' +
    '  v_SpecularMat = u_SpecularMat;\n' +
    '  v_Shininess = u_Shininess;\n' +
    '  v_AmbientMat = u_AmbientMat;\n' +
    '  v_CameraPos = u_CameraPos;\n' +

  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +

  'varying vec4 v_Normal;\n' +
  'varying vec4 v_vertexPosition;\n' +
  'varying mat4 v_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec3 v_LightColor;\n'   +   // Light color
  'varying vec3 v_LightPosition;\n' +  // Position of the light source
  'varying vec3 v_AmbientLight;\n' +   // Ambient light color
  'varying vec3 v_DiffuseMat;\n'   +   // Diffuse material color
  'varying vec3 v_SpecularMat;\n'  +   // Specular material color
  'varying float v_Shininess  ;\n' +   // Specular material shininess
  'varying vec3 v_AmbientMat;\n'   +   // Ambient material color
  'varying vec3 v_CameraPos;\n'    +   // Camera Position

  'varying vec4 v_Color;\n' +
  'void main() {\n' +

      // Calculate a normal to be fit with a model matrix, and make it 1.0 in length
    '  vec3 normal = normalize(vec3(v_NormalMatrix * v_Normal));\n' +

    '  float d = length(v_LightPosition - vec3(v_vertexPosition));\n' +
    '  float atten = 1.0/(0.01 * d*d);\n' +
      // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(v_LightPosition - vec3(v_vertexPosition));\n' +
      // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
      // Calculate the color due to diffuse reflection
    '  vec3 diffuse = v_LightColor * v_DiffuseMat * nDotL;\n' +
      // Calculate the color due to ambient reflection
    '  vec3 ambient = v_AmbientLight * v_AmbientMat;\n' +
    '  vec3 specular = vec3(0.0,0.0,0.0);\n'            +
    '  if(nDotL > 0.0) {\n'                             +
        // Calculate specular component
    '       vec3 h = normalize(normalize(v_CameraPos - vec3(v_vertexPosition)) + lightDirection);\n' +
    '       float hDotn  = max(dot(h, normal), 0.0);\n' +
    '       specular = v_LightColor * v_SpecularMat * pow(hDotn,v_Shininess);\n' +
    '  }\n'                                           +
      // Add the surface colors due to diffuse reflection and ambient reflection
    '  gl_FragColor = vec4(atten *(diffuse + specular)  + ambient, 1.0);\n' +
  '}\n';

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

  // Set the vertex coordinates, the color and the normal
  //var n = initVertexBuffersCube(gl);



  var centri = [];
  var dimensioni = [];
  var precisioneC = 125;

  // Genero i punti del cerchio principale
  var raggione = 1.1;
  var raggino = 0.3;

  for(var i = 0; i <= 2*Math.PI; i+= 2*Math.PI/precisioneC){
     centri.push(raggione * Math.cos(i));                                // x
     centri.push(raggione * Math.sin(i));                                // y
     dimensioni.push(raggino);                                           // Raggio dei cerchi
  }

  //Il primo elemento si ripete
  centri.unshift(centri[1]);
  centri.unshift(centri[1]); //Pusho di nuovo lo stesso perché ora sono shiftati dopo il primo unshift
  dimensioni.unshift(0);
  //Ripeto anche l'ultimo, che sarà uguale al primo essendo una figura chiusa.
  centri.push(centri[0]);
  centri.push(centri[1]);
  dimensioni.push(raggino);

  var n = circleDrag(gl, new Float32Array(centri), new Float32Array(dimensioni), precisioneC);
  //var n = circleDrag(gl, [0,0.8, 0,0.8, 0,-0.8, 0,-0.8], [0, 0.8*Math.sqrt(2), 0.8*Math.sqrt(2), 0], 4);




  // Set the clear color and enable the depth test
  gl.clearColor(0.5, 0.5, 0.5, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_ModelMatrix   = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix     = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix  = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_LightColor    = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight  = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  var u_DiffuseMat    = gl.getUniformLocation(gl.program, 'u_DiffuseMat');
  var u_SpecularMat   = gl.getUniformLocation(gl.program, 'u_SpecularMat');
  var u_Shininess     = gl.getUniformLocation(gl.program, 'u_Shininess');
  var u_AmbientMat    = gl.getUniformLocation(gl.program, 'u_AmbientMat');
  var u_CameraPos     = gl.getUniformLocation(gl.program, 'u_CameraPos');
  if (!u_ModelMatrix || !u_MvpMatrix   || !u_NormalMatrix ||
      !u_LightColor || !u_LightPosition　|| !u_AmbientLight ||
	  !u_DiffuseMat  || !u_SpecularMat || !u_Shininess || !u_AmbientMat || !u_CameraPos) {
    console.log('Failed to get the storage location');
    return;
  }
  // ******************************************************************************************
  // Set the Specular and Diffuse light color
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, 1.0, 2.0, 12.0);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  // Set the ambient material
  gl.uniform3f(u_AmbientMat, 0.329412, 0.223529, 0.027451);
  // Set the diffuse material
  gl.uniform3f(u_DiffuseMat, 0.780392, 0.568627, 0.113725);
  // Set the specular material
  gl.uniform3f(u_SpecularMat, 0.992157	, 0.941176, 0.807843);

   // Set the specular material
  gl.uniform1f(u_Shininess, 0.21794872*128);

   var cameraPos = [1,3,8];          // camera position
  // Set the camera position
  gl.uniform3f(u_CameraPos, cameraPos[0],cameraPos[1],cameraPos[2]);
  //********************************************************************************************
  //*********************************************************************
  // creo una GUI con dat.gui
  var gui = new dat.GUI();
  // checkbox geometry
  var materiali = {brass:true,emerald:false,bronze:false,jade:false,gold:false,obsidian:false,pearl:false,ruby:false,turquoise:false,chrome:false,copper:false,silver:false};
  //
  gui.add(materiali,'brass').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    		    materiali[i]=false;
        }
    		materiali.brass=true;
    		console.log("brass");
  	 }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.329412, 0.223529, 0.027451);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.780392, 0.568627, 0.113725);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.992157	, 0.941176, 0.807843);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.21794872*128);

     // Iterate over all controllers
     for (var i in gui.__controllers) {
         gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'emerald').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			materiali[i]=false;
        }
    		materiali.emerald=true;
    		console.log("emerald");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.0215, 0.1745, 0.0215);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.07568, 0.61424, 0.07568);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.633, 0.727811, 0.633);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.6*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'bronze').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.bronze=true;
    		console.log("bronze");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.2125, 0.1275, 0.054);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.714, 0.4284, 0.18144);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.393548, 0.271906, 0.166721);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.2*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'jade').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.jade=true;
    		console.log("jade");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.135, 0.2225, 0.1575);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.54, 0.89, 0.63);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.316228, 0.316228, 0.316228);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.1*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'gold').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.gold=true;
    		console.log("gold");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.24725, 0.1995, 0.0745);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.75164, 0.60648, 0.22648);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.628281, 0.555802, 0.366065);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.4*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'obsidian').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.obsidian=true;
    		console.log("obsidian");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.05375, 0.05, 0.06625);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.18275, 0.17, 0.22525);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.332741, 0.328634, 0.346435);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.3*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'pearl').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.pearl=true;
    		console.log("pearl");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.25, 0.20725, 0.20725);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 1, 0.829, 0.829);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.296648, 0.296648, 0.296648);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.088*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'ruby').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.ruby=true;
    		console.log("ruby");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.1745, 0.01175, 0.01175);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.61424, 0.04136, 0.04136);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.727811, 0.626959, 0.626959);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.6*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'turquoise').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.turquoise=true;
    		console.log("turquoise");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.1, 0.18725, 0.1745);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.396, 0.74151, 0.69102);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.297254, 0.30829, 0.306678);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.1*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'chrome').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.chrome=true;
    		console.log("chrome");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.25, 0.25, 0.25);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.4, 0.4, 0.4);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.774597, 0.774597, 0.774597);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.6*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'copper').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.copper=true;
    		console.log("copper");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.19125, 0.0735, 0.0225);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.7038, 0.27048, 0.0828);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.256777, 0.137622, 0.086014);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.1*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });
  gui.add(materiali,'silver').onFinishChange(function(value) {
     // Fires when a controller loses focus.
	   if(value == true){
    		for(var i in materiali){
    			   materiali[i]=false;
        }
    		materiali.silver=true;
    		console.log("silver");
	   }

     // Set the ambient material
     gl.uniform3f(u_AmbientMat, 0.19225, 0.19225, 0.19225);
     // Set the diffuse material
     gl.uniform3f(u_DiffuseMat, 0.50754, 0.50754, 0.50754);
     // Set the specular material
     gl.uniform3f(u_SpecularMat, 0.508273, 0.508273, 0.508273);
    // Set the specular material
     gl.uniform1f(u_Shininess, 0.4*128);

	   // Iterate over all controllers
     for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
     }
  });


  //*********************************************************************************

  var currentAngle = 0.0;           // Current rotation angle
  var vpMatrix = new Matrix4();   // View projection matrix

  // Calculate the view projection matrix
  vpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  vpMatrix.lookAt(cameraPos[0],cameraPos[1],cameraPos[2], 0, 0, 0, 0, 1, 0);

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4(); 　  // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals

  var tick = function() {
    	currentAngle = animate(currentAngle);  // Update the rotation angle

    	// Calculate the model matrix
    	modelMatrix.setRotate(currentAngle, 1, 1, 0); // Rotate around the y-axis

    	// Pass the model matrix to u_ModelMatrix
    	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    	mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    	// Pass the model view projection matrix to u_MvpMatrix
    	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    	// Calculate the matrix to transform the normal based on the model matrix
    	normalMatrix.setInverseOf(modelMatrix);
    	normalMatrix.transpose();
    	// Pass the transformation matrix for normals to u_NormalMatrix
    	gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    	// Clear color and depth buffer
    	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    	// Draw the cube(Note that the 3rd argument is the gl.UNSIGNED_SHORT)
    	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

    	requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}



function circleDrag(gl, centri, distanza, precisioneC){  //coordinate centri, distanza punti da centri, precisione cerchi
  var isClosed = false; // Variabile che dice se la figura è chiusa

  // calcolo numero di vertici della figura
  var nv = 0; // numero vertici
  var ni = 0; // numero indici

  for( var i = 0; i < (centri.length / 2); i++ ){
      if( distanza[i] > 0 ){
          if( distanza[i-1] == 0 ){ // se prima c'era un punto
              ni = ni + precisioneC * 3;  // ni = ni + nTriangoli * nVertitiTriangolo
              nv = nv + precisioneC * 3;
          }else{ // se prima c'era un poligolo
              ni = ni + precisioneC * 6;  // ni = ni + nTriangoli * 2 * nVertitiTriangolo
              nv = nv + precisioneC * 4;
          }
      }else{
          if( i > 0 && distanza[i-1] != 0 ){ // se prima c'era un poligono
              ni = ni + precisioneC * 3;  // ni = ni + nTriangoli * nVertitiTriangolo
              nv = nv + precisioneC * 3;
          }
      }
  }
  nv = nv * 3;

  // creazione del vettore dei vertici
  var vertices = new Float32Array(nv);

  // Indices of the vertices
  var indices = new Uint16Array(ni);

  // Controllo se è un solido chiuso
  if(centri[0] == centri[centri.length-2] && centri[1] == centri[centri.length-1]){
    isClosed = true;
  }

  var angolo = Math.PI/4;
  var alphaPrecedente = 0;
  var count = 0;
  var ind = 0;
  var ind2 = 0;
  var x;
  var y;
  var z;
  for(var i = 0; i < (centri.length / 2); i++ ){  // Per ognuno dei punti ricevuti
      //stfu gli altri <3

      // Trovo l'angolo corrente sul cerchio principale
      if(i == 0 || (i-2) == precisioneC){
          alphaCorrente = 0;
      }else{
          alphaCorrente = (i-1) * 2*Math.PI/precisioneC;
      }

      if(distanza[i] > 0){  // Se deve essere un poligono
          if( distanza[i-1] == 0 ){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count] = centri[(i-1) * 2];
                  vertices[count+1] = centri[(i-1) * 2 +1];
                  vertices[count+2] = 0;

                  // Calcolo delle coordinate dei punti sui cerchi minori
                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;

                  indices[ind] = ind2+2;
                  indices[ind+1] = ind2+1;
                  indices[ind+2] = ind2;

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;

          }else{
              for( var j = 0; j < precisioneC; j++ ){
                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+6] = x;
                  vertices[count+7] = y;
                  vertices[count+8] = z;


                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;


                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[i*2] + distanza[i] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[i*2] + distanza[i] * Math.cos(angolo) * Math.cos(alphaCorrente);
                  }
                  y = centri[i*2 + 1];
                  if(isClosed){
                      y = centri[i*2 +1] + distanza[i] * Math.cos(angolo) * Math.sin(alphaCorrente);
                  }
                  z = distanza[i] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;


                  indices[ind] = ind2+2;
                  indices[ind+1] = ind2+1;
                  indices[ind+2] = ind2;


                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+9] = x;
                  vertices[count+10] = y;
                  vertices[count+11] = z;

                  indices[ind+3] = ind2+3;
                  indices[ind+4] = ind2+1;
                  indices[ind+5] = ind2+2;

                  ind = ind + 6;
                  ind2 = ind2 + 4;
                  count = count + 12;
              }
              alphaPrecedente = alphaCorrente;
          }
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

          if( i > 0 && distanza[i-1] != 0){
              for( var j = 0; j < precisioneC; j++ ){
                  vertices[count+6] = centri[i*2];
                  vertices[count+7] = centri[i*2 + 1];
                  vertices[count+8] = 0;

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count+3] = x;
                  vertices[count+4] = y;
                  vertices[count+5] = z;

                  angolo = angolo + ( 2 * Math.PI/precisioneC );

                  x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo);
                  if(isClosed){ // Se è chiuso i cerchi non saranno tutti angolati 0, ma verso il centro
                      x = centri[(i-1)*2] + distanza[i-1] * Math.cos(angolo) * Math.cos(alphaPrecedente);
                  }
                  y = centri[(i-1)*2 + 1];
                  if(isClosed){
                      y = centri[(i-1)*2 +1] + distanza[i-1] * Math.cos(angolo) * Math.sin(alphaPrecedente);
                  }
                  z = distanza[i-1] * Math.sin(angolo);

                  vertices[count] = x;
                  vertices[count+1] = y;
                  vertices[count+2] = z;

                  indices[ind] = ind2;
                  indices[ind+1] = ind2+1;
                  indices[ind+2] = ind2+2;

                  ind = ind + 3;
                  ind2 = ind2 + 3;
                  count = count + 9;
              }
              alphaPrecedente = alphaCorrente;
          }
      }
  }




  var normals = new Float32Array(vertices.length);
  var temp = new Float32Array(10);
  count = 0;
  for( var  i = 0; i < (indices.length / 3) ; i++){

      temp[0] = vertices[indices[i*3]*3] - vertices[indices[i*3+1]*3];
      temp[1] = vertices[indices[i*3]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[2] = vertices[indices[i*3]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[3] = vertices[indices[i*3+2]*3] - vertices[indices[i*3+1]*3];
      temp[4] = vertices[indices[i*3+2]*3 + 1] - vertices[indices[i*3+1]*3 + 1];
      temp[5] = vertices[indices[i*3+2]*3 + 2] - vertices[indices[i*3+1]*3 + 2];

      temp[6] = (temp[1] * temp[5]) - (temp[2] * temp[4]);
      temp[7] = (temp[2] * temp[3]) - (temp[0] * temp[5]);
      temp[8] = (temp[0] * temp[4]) - (temp[1] * temp[3]);
      if(temp[6] == 0){temp[6] = 0;}
      if(temp[7] == 0){temp[7] = 0;}
      if(temp[8] == 0){temp[8] = 0;}

      temp[9] = Math.sqrt( temp[6]*temp[6] + temp[7]*temp[7] + temp[8]*temp[8] );

      for( var j = 0; j < 3; j++){
          normals[indices[i*3+j]*3] = temp[6] / temp[9];
          normals[indices[i*3+j]*3+1] = temp[7] / temp[9];
          normals[indices[i*3+j]*3+2] = temp[8] / temp[9];
      }
  }


  // Write the vertex property to buffers (coordinates and normals)
  // Same data can be used for vertex and normal
  // In order to make it intelligible, another buffer is prepared separately
  if (!initArrayBuffer(gl, 'a_Position', new Float32Array(vertices), gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal'  , new Float32Array(normals)  , gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return indices.length;
}





function initArrayBuffer(gl, attribute, data, type, num) {
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

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}
// Rotation angle (degrees/second)
var ANGLE_STEP = 20.0;
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
