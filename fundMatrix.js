var fundmatrix = new function() {

//
//   public
//


//
// estimate the fundamental matrix (F) using the 8 point alforithm
//
     this.estimateF = function(x1, x2) {
          //normalize the coordinates, and take the passed coordinates and transfer function for x1 and x2
          var result1 = normalize(x1);
          var normalized1 = result1[0];
          var T1 = result1[1];

          var result2 = normalize(x2);
          var normalized2 = result2[0];
          var T2 = result2[1];

          var A = buildA(normalized1, normalized2);

          var Fprelim = extractF(A);

          var Fconstrained = constrainF(Fprelim);

          var F = numeric.dot(numeric.dot(numeric.transpose(T2), Fconstrained), T1);

          //console.log(F);

          return F;
     }


//
//  estimate epipole from a fundamental matrix
//
     this.epipole = function(F) {

          //calculate the epipoles and normalize
          var epiDecomp = numeric.svd(F);
          var V = numeric.transpose(epiDecomp.V)[2];
          var U = numeric.transpose(epiDecomp.U)[2];


          V[0] = V[0] / V[2];
          V[1] = V[1] / V[2];
          V[2] = 1;

          U[0] = U[0] / U[2];
          U[1] = U[1] / U[2];
          U[2] = 1;

          return {
               e1: V,
               e2: U
          }
     }

//
//  estimate the epipole from before and after points.
//
     this.epinode = function(coef) {

          var j,i,avg1,avg2,count = 0;
          var sum1 = 0;
          var sum2 = 0;
          var A = [0,0];
          var pts = Array.matrix(2,coef.length,1);

          for(i = 0;i<coef.length;i++) {
               for(j = i+1; j<(coef.length);j++) {

                    A = [[coef[i][0],coef[i][1]],[coef[j][0],coef[j][1]]];
                    pts[count] = numeric.solve(A,[-coef[i][2],-coef[j][2]]);
                    count++;
               }
          }

          for(i=0;i<pts.length;i++) {
                    sum1 += pts[i][0];
          }

          //average the first coordinates
          avg1 = sum1/pts.length;

          //add up all the second coordinates
          for(i=0;i<pts.length;i++) {
                    sum2 += pts[i][1];
          }
          //average the second coordinates
          avg2 = sum2/pts.length;

          //define the centroid of the points, the epinode
          return [avg1.toFixed(3), avg2.toFixed(3)];

     }

     //
     // private
     //
     var normalize = function(pts) {

          var newpts = Array.matrix(2, 10, 1);
          var dist = Array.dim(pts[0].length, 0);
          var i = 0,
               sum1 = 0,
               sum2 = 0,
               avg1 = 0,
               avg2 = 0,
               meandist = 0,
               scale = 0;

          //SHIFT THE COORDINATES
          //add up all the first coordinates
          for (i = 0; i < pts[0].length; i++) {
               sum1 += pts[0][i];
          }

          //average the first coordinates
          avg1 = sum1 / pts[0].length;

          //add up all the second coordinates
          for (i = 0; i < pts[0].length; i++) {
               sum2 += pts[1][i];
          }
          //average the second coordinates
          avg2 = sum2 / pts[0].length;

          //define the centroid of the points
          var centroid = [avg1, avg2];

          //shift the origin of the coordinates to the centroid
          for (i = 0; i < pts[0].length; i++) {
               newpts[0][i] = pts[0][i] - avg1;
               newpts[1][i] = pts[1][i] - avg2;
          }

          //SCALE THE COORDINATES (mean = Math.sqrt(2))
          //calculate the distance from the origin of each point
          for (i = 0; i < pts[0].length; i++) {
               dist[i] = Math.sqrt(Math.pow(newpts[0][i], 2) + Math.pow(newpts[1][i], 2));
          }
          //find the average distance
          for (i = 0; i < dist.length; i++) {
               meandist += dist[i];
          }
          meandist = meandist / dist.length;

          //scale the points
          scale = Math.sqrt(2) / meandist;

          //build transformation matrix T

          var T = [
               [scale, 0, -scale * avg1],
               [0, scale, -scale * avg2],
               [0, 0, 1]
          ];

          //transform the points
          newpoints = numeric.dot(T, pts);
          return [newpoints, T];
     }

     var buildA = function(x1, x2) {

          var A = [0, 0, 0, 0, 0, 0, 0, 0, 0];

          //step through the x1 and x2 matricies and build the A matrix
          for (i = 0; i < x1[0].length; i++) {

               A[i] = [(x2[0][i] * x1[0][i]), (x2[0][i] * x1[1][i]), x2[0][i], (x2[1][i] * x1[0][i]), (x2[1][i] * x1[1][i]), x2[1][i],
                    x1[0][i], x1[1][i], 1
               ];

          }

          return A;
     }

     var extractF = function(A) {

          //extract the Fundamental Matrix from A
          var decomp = numeric.svd(A);

          //F is the last column of the V decomp
          var V = numeric.transpose(decomp.V);

          var F = V[8];

          //rearrange F to 3x3
          var Fsquare = [
               [F[0], F[1], F[2]],
               [F[3], F[4], F[5]],
               [F[6], F[7], F[8]]
          ];

          return Fsquare;
     }

     var constrainF = function(F) {

          //enforce the constraint that rank(F) = 2
          var decomp = numeric.svd(F);

          //set the diagonal matrix
          var D = numeric.diag([decomp.S[0], decomp.S[1], 0]);

          //undecompose the matrix and return
          return numeric.dot(numeric.dot(decomp.U, D), numeric.transpose(decomp.V));
     }


}()
