let canvas = document.getElementById("cgcanvas");
let context = canvas.getContext("2d");
let width = parseInt(canvas.getAttribute("width"));
let height =  parseInt(canvas.getAttribute("height"));
let imageData = context.createImageData(width ,height);

var span = document.getElementsByClassName("close")[0];
var myBtnModal = null ;

var atual = 0 ;
var gxi = null;
var gyi = null; 
var gxf = null;
var gyf = null;

var figuras = [];
function selecionar(obj,bnt){
    ojt = parseInt(obj);
    if(figuras[obj]){
      figuras[obj] = false;
      bnt.style.backgroundColor = "#ffffff";
    }
    else{
      figuras[obj] =  true;
      bnt.style.backgroundColor = "#778e92";

    }
}

function mDown(obj,evt)
{
  for(i = 0 ; i < figuras.length;i++){
    if (figuras[i]){
      //canvas.addEventListener('click', function(evt){
        var mousePos = getMousePos(canvas,evt);
        gxi = mousePos.x;
        gyi = mousePos.y;
        i = figuras.length;
      //}, false);
    }
  }
}

function mUp(obj,evt)
{
  var mousePos = getMousePos(canvas,evt);
  gxf = mousePos.x;
  gyf = mousePos.y;
  if (gxi>gxf || gyi>gyf ) //inverter para quando o usuario estiver arrastando para tras
  {
    var aux1 = gxi;
    var aux2 = gyi;
    gxi = gxf;
    gyi = gyf;
    gxf = aux1;
    gyf = aux2;
  }
  for(i = 0 ; i < figuras.length;i++){
    if (figuras[i]){
      if(i == 1){ 
        linhaQualquer(gxi,gyi,gxf,gyf,document.getElementById("myBtnfiguras").title);
        i = figuras.length;
      }
      else if(i == 2){ 
        quadrado(gxi,gyi,gxf,gyf,document.getElementById("myBtnfiguras").title);
        i = figuras.length;
      }
      else if(i == 3){ 
        retangulo(gxi,gyi,gxf,gyf,document.getElementById("myBtnfiguras").title);
        i = figuras.length;
      }  
      else if(i == 4){ 
        triangulo(gxi,gyi,gxf,gyf,document.getElementById("myBtnfiguras").title);
        i = figuras.length;
      }  
    }
  }
}

function getMousePos(canvas,evt){
    // get canvas position
    var obj = canvas;
    var top = obj.offsetTop;
    var left = obj.offsetLeft;
    
    obj = obj.offsetParent;

    var mouseX = evt.clientX - left + window.pageXOffset ;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x: (-(width/2) + mouseX),
        y: (+(height/2) - mouseY)
    };

}
if (false) {
  canvas.addEventListener('click', function(evt){
    var mousePos = getMousePos(canvas, evt);
    console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
  }, false);
}

function mudarCor(el,modal){
  myBtnModal.title = el.title;
  myBtnModal.style.backgroundColor = el.title;
  fecharModal(modal);
}

function acender(coordenada,cor , alpha = 255){
 coordenada[0]=coordenada[0] + width/2;
 coordenada[1]=height/2 - coordenada[1]; 
  var rgb =hexToRgb(cor);

  let index = (coordenada[0] + coordenada[1] * width) * 4;

  imageData.data[index] = rgb[0];
  imageData.data[index + 1] = rgb[1];
  imageData.data[index + 2] = rgb[2];
  imageData.data[index + 3] = alpha;

}
function hexToRgb(hex) {
    hex = hex.substring(1,7);
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r,g,b];   
}


function linhaHorizontal(x,y,size,cor,alpha){
   for (var i = 0; i < size; i++) {
       acender([x+i,y],cor,alpha);
   }

   context.putImageData(imageData,0,0); 
}  
function linhaVertical(x,y,size,cor,alpha){
   for (var i = 0; i < size; i++) {
       acender([x,y+i],cor,alpha);
   }

  context.putImageData(imageData,0,0);  
}
function linha45(x,y,size,cor){
  
   var xt = (size*1.4)/2;

   for (var i = 0; i < xt; i++) {
       acender([x+i,y+i],cor);  
   }
   context.putImageData(imageData,0,0);
}
function linhaQualquer(xi,yi,xf,yf,cor)
{
  var deltaX = (xf - xi);
  var deltaY = (yf - yi);
  var m = deltaY/deltaX;
  console.log(deltaX,deltaY);
  if ( Math.abs(deltaX) > Math.abs(deltaY)) 
    {
    if (xi<xf){
        for (var i = xi ; i < xf ; i++) {
          var y = parseInt(m*(i - xi)) + yi;
          acender([i,y],cor);
        }
      }
    else{
      linhaQualquer(xf,yf,xi,yi,cor);
    }
  }
  else
  {
    if (yi<yf){
        for (var i = yi ; i < yf ; i++) {
          var x = parseInt((i - yi)/m) + xi;
          acender([x,i],cor);
        }}
    else{
          linhaQualquer(xf,yf,xi,yi,cor);
        }  
  }
  
  context.putImageData(imageData,0,0);
}

function quadrado(xi,yi,xf,yf,cor){
  if (xf<xi || yf<yi ) {
    deltaX = -(xf-xi);
  }
  else{
    deltaX = (xf-xi);
  }
  linhaQualquer(xi,yi,xi,yi+deltaX,cor);
  linhaQualquer(xi,yi,xf,yi,cor);
  linhaQualquer(xf,yi,xf,yi+deltaX,cor);
  linhaQualquer(xi,yi+deltaX,xf,yi+deltaX,cor);
  context.putImageData(imageData,0,0);
}
function retangulo(xi,yi,xf,yf,cor,p = ""){
  if (p !== "" ) {
    console.log(p);
    preencher(xi,yi,xf,yf,p,4);
  }
  linhaQualquer(xi,yi,xi,yf,cor);
  linhaQualquer(xi,yi,xf,yi,cor);
  linhaQualquer(xi+(xf-xi),yi,xi+(xf-xi),yf,cor);
  linhaQualquer(xi,yi+(yf-yi),xf,yi+(yf-yi),cor);
  context.putImageData(imageData,0,0);
}
function triangulo(xi,yi,xf,yf,cor){
  linhaQualquer(xi,yf,xf,yi,cor);
  linhaQualquer(xi,yi,xi,yf,cor);
  linhaQualquer(xi,yi,xf,yi,cor);
  context.putImageData(imageData,0,0);
}

function axis( cor = document.querySelector("#myBtnAxis").title , espessura = parseInt(document.querySelector("#tamnhoControl").value) ){
  if (cor !== "#ffffff")
    axis("#ffffff");
  else
    espessura = 14;
  var larguraPontoIni = (width/2) - (espessura/2);
  var alturaPontoIni = -(espessura/2);
  for (var i = 0 ; i < espessura ; i++){ 

    linhaVertical((larguraPontoIni+i) - width/2,-(height/2),height,cor);
    linhaHorizontal(-(width/2),alturaPontoIni+i,width,cor); 
  }
  if (this.atual !== 0 ) {
    grade(document.querySelector("#myBtnGrade").title,this.atual);
  }
  
  context.putImageData(imageData,0,0);  
}


function grade(cor = document.querySelector("#myBtnGrade").title, espacamento = parseInt(document.querySelector("#tamnho-Control-grade").value) )
{ 
  if (cor !== "#ffffff"){
    if (atual !== 0){
      grade("#ffffff");
    }
    this.atual = espacamento;
  }
  else{
    espacamento = this.atual;
  }
  if (espacamento !== 0){
    for (var i = 0 ;  i<width/espacamento ; i++){
      linhaVertical(-(height/2)+i*espacamento,-(height/2),height,cor);
      linhaHorizontal(-(width/2),-(width/2)+i*espacamento,width,cor); 
    }
  }
  context.putImageData(imageData,0,0);  
}


function preencher(xi,yi,xf,yf,cor)
{ 
  for (var i = 0 ;  i < Math.abs(xf-xi) ; i++){
    linhaVertical(xi+i,yi,Math.abs(yf-yi),cor,100);
   
  }

  for (var i = 0 ;  i < Math.abs(yf-yi) ; i++){
    linhaHorizontal(xi,yi+i,Math.abs(xf-xi),cor,100); 
  }
  context.putImageData(imageData,0,0);
}

function casa(){
  retangulo(20,20,40,60,"#000","#00ccff");
  retangulo(40,20,100,60,"#000","#00cc33");
  retangulo(28,20,32,35,"#000","#ffffff");
  retangulo(60,35,80,45,"#000","#ffffff");
  linhaHorizontal(30,80,60,"#000");
  linhaQualquer(20,60,30,80,"#000");
  linhaQualquer(40,60,30,80,"#000");
  linhaQualquer(100,60,90,80,"#000");
}

casa();


function mostrarModal(modal,bnt){
  myBtnModal = bnt ;
  modal.style.display = "block";
}
function fecharModal(modal){
  myBtnModal = null ;
   modal.style.display = "none";
}

context.putImageData(imageData,0,0);