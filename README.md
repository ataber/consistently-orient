# consistently-orient

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Depth-first traversal through simplicial complex to consistently orient cells (and potentially fail with information about orientability).

## Usage

[![NPM](https://nodei.co/npm/consistently_orient.png)](https://www.npmjs.com/package/consistently_orient)

```javascript
var bunny          = require('bunny')
var orientedCells  = orient(cells);
```

`require("consistently-orient")(cells)`
----------------------------------------------------
Splits complex into connected components, and for each component attempts to consistently orient cells. Note that we choose the desired orientation arbitrarily, so a global check is required if you need additional guarantees such as outward-facing normals.

In the case of non-orientability (or non-manifoldness), raises an error.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/ataber/consistently-orient/blob/master/LICENSE.md) for details.
