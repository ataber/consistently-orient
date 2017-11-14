# consistently-orient

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Depth-first traversal through 2D simplicial complex to consistently orient cells (and potentially fail with information about orientability).

## Usage

[![NPM](https://nodei.co/npm/consistently-orient.png)](https://www.npmjs.com/package/consistently-orient)

```javascript
var bunny          = require('bunny')
var flippedCount   = orient(bunny.cells);

// possible further global checks: volume (as follows) or raytracing
if (require('mesh-mass')(bunny.cells, bunny.positions).volume < 0) {
  // volume is negative, implying the global orientation must be flipped
}
```

`require("consistently-orient")(cells)`
----------------------------------------------------
Modifies `cells` in-place. Splits the complex into components defined by manifold connectivity (i.e. two cells are neighbors iff they share a manifold edge), and for each component attempts to consistently orient cells. Note that we choose the desired orientation arbitrarily, so a further global check is required if you need additional guarantees such as outward-facing normals.

In the case of non-orientability (determined by reaching a contradiction while propagating orientation), raises an error.

The method we use for finding manifold patches is derived from [this reference](http://www.alecjacobson.com/weblog/?p=3618).

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/ataber/consistently-orient/blob/master/LICENSE.md) for details.
