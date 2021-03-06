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
  if (cells.length == 0) {
    return 0;
  }

  var flipCount = 0;
  complex.normalize(cells);
  var edges = complex.unique(complex.skeleton(cells, 1));
  var correctlyOrientedCells = new Array(cells.length).fill(false);
  var visitedEdges = new Array(edges.length).fill(false);
  var edgeToCellIncidence = complex.incidence(edges, cells);

  function orientManifoldPatch(seedCellIndex) {
    var cellsToVisit = [seedCellIndex];
    while (cellsToVisit.length > 0) {
      var cellIndex = cellsToVisit.pop();
      var cell = cells[cellIndex];
      correctlyOrientedCells[cellIndex] = true;

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
          // disallow propagation of orientation across non-manifold edges
          continue;
        } else if (neighboringCells.length == 1) {
          // boundary edge, no neighbor to flip
          continue;
        }

        var neighborIndex = neighboringCells[(neighboringCells.indexOf(cellIndex) + 1) % 2];
        var neighbor = cells[neighborIndex];
        cellsToVisit.push(neighborIndex);

        var orientationA = orientation(cell, edge);
        var orientationB = orientation(neighbor, edge);

        if (Math.sign(orientationA) == Math.sign(orientationB)) {
          if (correctlyOrientedCells[neighborIndex]) {
            throw `Non-orientable manifold!`;
          }

          // flip orientation
          cells[neighborIndex] = [neighbor[1], neighbor[0], neighbor[2]];
          flipCount++;
        }

        correctlyOrientedCells[neighborIndex] = true;
      }
    }
  }

  orientManifoldPatch(0);

  function notCorrectlyOriented(c) {
    return !c;
  };
  var nextCellIndex;
  while ((nextCellIndex = correctlyOrientedCells.findIndex(notCorrectlyOriented)) && nextCellIndex !== -1) {
    // orient each manifold patch using an arbitrary representative as seed cell
    orientManifoldPatch(nextCellIndex);
  }

  return flipCount;
}
