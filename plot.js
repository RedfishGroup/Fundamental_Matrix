var plot = function(coef, canvas) {

     //var canvas = document.getElementById('graphEpinode');
     var context = canvas.getContext('2d');

     var A = coef[0];
     var B = coef[1];
     var C = coef[2];
     var m = -A/B;
     var inter = -C/B;

     var x1 = 2;
     var y1 = m*x1 + inter;
     var y1 = -(1/2)*y1 + 400;

     var x2 = (canvas.width + 1600)/4 - 2;
     var y2 = m*x2 + inter;
     var y2 = -(1/2)*y2 + 400;
     var x2 = 4*x2 - 1600;

      context.beginPath();
      context.moveTo(x1,y1);
      context.lineTo(x2,y2);
      context.stroke();



      //document.writeln("<br>" + "Epipolar Line: Y  =  " + m.toFixed(3) + " * X  +  ("  + inter.toFixed(3) + ")");
}

var plot2 = function( x, xb,coef, canvas){

  //var canvas = document.getElementById('graphEpinode');
  var context = canvas.getContext('2d');

  var A = coef[0];
  var B = coef[1];
  var C = coef[2];
  var m = -A/B;
  var inter = -C/B;

  var x0 = x[0]
  var y0 = x[0]*m + inter
  var x1 = x[0] 
  var y1 = x1*m + inter 
  var x2 = xb[0]//x[0] + 5*m
  var y2 = x2*m + inter 


  context.strokeStyle = "rgba(0,0,0,0.2)"
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  context.fillStyle = "#50f"
  context.fillRect( x[0]-2, x[1]-2,4,4)

  context.fillStyle = "#5f5"
  context.fillRect( x0-1,  y0-1,2,2)

}
