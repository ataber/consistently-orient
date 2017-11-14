var complex = require('simplicial-complex');

function orientation(cell, edge) {
  var indexA = cell.indexOf(edge[0]);
  var indexB = cell.indexOf(edge[1]);

  if (indexA == 0 && indexB == cell.length - 1) {
    return -1;
  } else if (indexB == 0 && indexA == cell.length - 1) {
    return 1;
  } else {
    return indexB - indexA;
  }
}

module.exports = function(cells) {
  cells = Array.from(cells);
  complex.normalize(cells);
  components = complex.connectedComponents(cells);
  components.map(function(component) {
    var edges = complex.unique(complex.skeleton(component, 1));
    var vertices = complex.unique(complex.skeleton(component, 0));
    var correctlyOrientedCells = new Set();
    var visitedEdges = new Array(edges.length).fill(false);
    var edgeToCellIncidence = complex.incidence(edges, component);
    var cellsToVisit = [0];
    while (cellsToVisit.length > 0) {
      var cellIndex = cellsToVisit.pop();
      var cell = component[cellIndex];
      correctlyOrientedCells.add(cellIndex);

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

        var orientationA = orientation(cell, edge);
        var orientationB = orientation(neighbor, edge);

        if (Math.sign(orientationA) == Math.sign(orientationB)) {
          if (correctlyOrientedCells.has(neighborIndex)) {
            throw `Non-orientable manifold!`;
          }

          // flip orientation
          component[neighborIndex] = [neighbor[1], neighbor[0], neighbor[2]];
        }

        correctlyOrientedCells.add(neighborIndex);
      }
    }
  });

  return [].concat.apply([], components);
}
