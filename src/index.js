require('normalize.css/normalize.css');
require('./styles/index.css');

import * as d3 from 'd3';
import * as d3Tile from 'd3-tile';

var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight);


const svg = d3.select("body").append("svg")
      .attr("viewBox", [0, 0, width, height]);

const tile = d3Tile.tile()
      .extent([[0, 0], [width, height]])
      .tileSize(256)
      .clampX(false);

  const zoom = d3.zoom()
      .scaleExtent([1 << 8, 1 << 22])
      .extent([[0, 0], [width, height]])
      .on("zoom", () => zoomed(d3.event.transform));

  let image = svg.append("g")
      .attr("pointer-events", "none")
    .selectAll("image");

  svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity
        .translate(width >> 1, height >> 1)
        .scale(1 << 12));

function url(x, y, z) {
  return `http://${"abc"[y % 3]}.tile.openstreetmap.org/${z}/${x}/${y}.png`
};

  function zoomed(transform) {
    const tiles = tile(transform);

    image = image.data(tiles, d => d).join("image")
        .attr("xlink:href", d => url(...d3Tile.tileWrap(d)))
        .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
        .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
        .attr("width", tiles.scale)
        .attr("height", tiles.scale);
  }

