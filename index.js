var complex = require('simplicial-complex');
var orientation = require('cell-orientation')

module.exports = function(cells) {
  var flipCount = 0;

  cells = Array.from(cells);
  complex.normalize(cells);
  components = complex.connectedComponents(cells);
  components.map(function(component) {
    var edges = complex.unique(complex.skeleton(component, 1));
    var vertices = complex.unique(complex.skeleton(component, 0));
    var visitedCells = new Set();
    var visitedEdges = new Array(edges.length).fill(false);
    var edgeToCellIncidence = complex.incidence(edges, component);
    var cellsToVisit = [0];
    while (cellsToVisit.length > 0) {
      var cellIndex = cellsToVisit.pop();
      var cell = component[cellIndex];

      if (visitedCells.has(cellIndex)) {
        console.log("visited", cellIndex)
        continue;
      } else {
        visitedCells.add(cellIndex);
      }

      for (var i = 0; i < cell.length; i++) {
        var j = (i + 1) % cell.length;
        var edge = [cell[i], cell[j]];
        var edgeIndex = complex.findCell(edges, edge);
        if (visitedEdges[edgeIndex]) {
          continue;
        } else {
          visitedEdges[edgeIndex] = true;
        }

        var neighboringCells = edgeToCellIncidence[edgeIndex];
        if (neighboringCells.length > 2) {
          throw `Non-manifold edge with cells: ${neighboringCells}`;
        } else if (neighboringCells.length == 1) {
          // boundary edge
          continue;
        }

        var neighborIndex = neighboringCells[(neighboringCells.indexOf(cellIndex) + 1) % 2];
        var neighbor = component[neighborIndex];
        cellsToVisit.push(neighborIndex);

        var orientationA = orientation(cell);
        var orientationB = orientation(neighbor);
        console.log(cellIndex, neighborIndex, cell, neighbor, edge, orientationA, orientationB)

        if (Math.sign(orientationA) == Math.sign(orientationB)) {
          if (visitedCells.has(neighborIndex)) {
            throw `Non-orientable manifold!`;
          }

          // flip orientation
          component[neighborIndex] = [neighbor[1], neighbor[0], neighbor[2]];
          flipCount++;
        }
      }
    }
  });
  console.log(flipCount);

  return [].concat.apply([], components);
}
