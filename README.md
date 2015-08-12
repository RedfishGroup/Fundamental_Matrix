# Fundamental_Matrix
Fundamental Matrix In Javascript

This code was written by Conner Jackson while he interned for Redfish in 2014. 

#Functionality
- Calculates the Fundamental Matrix from a given set of point pairs
- Finds the epipoles of the two perspectives
- Plots the epipolar lines of the given points
- Gives the equation for each epipolar line
- Calculates the episode

#Issues and Improvements
- Currently has no input for arbitrary points. Points are hard coded into the HTML
- No labelled axes on the graph
- Currently the graph is set to display the area around the epinode of the included points. Will need to dynamically scale
- Cannot read points off images. Must be given an array of points. 
- Does not check for the validity of input data. Assumes an array of vectors of the form [x,y,1]. 
