// Extending d3.layout by adding cedr layout for drawing cedr events.
// For now just supporting Point and Interval.
d3.layout.cedr = function() {
  var scale = 10,
      minor = 0,
      extent,
      vs = function(x) { return x.vs },
      ve = function(x) { return x.ve },
      y = function(x, i) { return x.y || i },
      d = function(x) { return x.d },
      title = function(x, i) { return "e" + i };

  function computeHExtent(data, paddingding) {
    if(data.length === 0) {
      return [0, 0];
    } else {
      var vsExtent = d3.extent(data.map(vs));
      var veExtent = d3.extent(data.map(ve));
      var tmin = Math.min(vsExtent[0], veExtent[0]) - paddingding;
      var tmax = Math.max(vsExtent[1], veExtent[1]) + paddingding;
      if(typeof extent === 'undefined') {
        return [tmin, tmax];
      } else {
        return [Math.min(tmin, extent[0]), Math.max(tmax, extent[1])];
      }
    }
  }

  function computeVExtent(data) {
    return data.length === 0 ? [0, 0] : d3.extent(data.map(y));
  }

  function cedr(data, winAllign) {
    // Separate windows and events.
    var windows = data.filter(function(x) { return x.kind === 'window'; });
    var events = data.filter(function(x) { return x.kind !== 'window'; });
    
    // compute horizontal (time) extent
    var winExtent = computeHExtent(windows, 0); // paddingding is 0 to draw windows all the way to the sides.
    var eventExtent = computeHExtent(events, 1); // events however are paddingded by 1 scale unit.
    var hExtent;
    if(windows.length === 0) {
      hExtent = eventExtent;
    } else if(events.length === 0) {
      hExtent = winExtent;
    } else {
      hExtent = [Math.min(winExtent[0], eventExtent[0]), Math.max(winExtent[1], eventExtent[1])];
    }

    // compute vertical extent and adjustment values for windows and events.
    var winY = computeVExtent(windows);
    var eventY = computeVExtent(events);
    var winAdjust = 0,
        eventAdjust = 0,
        winDy = winY[1] - winY[0], // could be 0 if no windows
        eventDy = eventY[1] - eventY[0]; // could be 0 if no events
    if(winDy !== 0) winDy++; // add paddingding if there are windows
    if(eventDy !== 0) eventDy++; // add paddingding if there are events
    if(winAllign === 'top') {
      winAdjust = eventDy + 1 - winY[0]; // move min to 1 above the events
      eventAdjust = 1 - eventY[0]; // move min to 1
    } else {
      winAdjust = 1 - winY[0]; // move min to 1
      eventAdjust = winDy + 1 - eventY[0]; // move min to 1 above the windows
    }
    var vExtent = [0, winDy + eventDy + 1];

    // compute and apply scaling
    var h = (vExtent[1] - vExtent[0] + 1) * scale * minor;
    var w = (hExtent[1] - hExtent[0] + 1) * scale * minor;
    var yScale = d3.scale.linear().domain(vExtent).range([-h, 0]); // -h..0 to account for screen Y-axis translation
    var xScale = d3.scale.linear().domain(hExtent).range([0, w]);

    return {
      xAxis: d3.svg.axis()
          .scale(xScale)
          .orient('bottom')
          .ticks(hExtent[1] - hExtent[0])
          .tickSubdivide(minor)
          .tickSize(-h, -h, 0),
      yAxis : d3.svg.axis()
          .scale(yScale)
          .orient('left')
          .ticks(vExtent[1] - vExtent[0])
          .tickSubdivide(minor)
          .tickSize(-w, -w, 0)
          .tickFormat(''),
      w: w,
      h: h,
      data: data.map(function(x, i) {
        var vsVal = vs(x, i);
        var veVal = ve(x, i);
        var yVal = y(x, i) + (x.kind === 'window' ? winAdjust : eventAdjust);
        var result = { kind: x.kind, vs: xScale(vsVal), y: -h - yScale(yVal), d: d(x, i), title: title(x, i) };
        if(veVal === vsVal) {
          // it's a point
          if(typeof(x.extend === 'number')) {
            result.extend = xScale(x.extend - 0.5);
          }
          result.ve =  xScale(vsVal + 0.5);
        } else {
          // it's an interval
          if(typeof(x.extend === 'number')) {
            result.extend = xScale(x.extend);
          }
          result.ve =  xScale(veVal);
        }
        if(x.kind === 'window') {
          result.yExtend = yScale(winAllign === 'top' ? vExtent[1] : vExtent[0]);
        }

        return result;
      })
    };
  };

  cedr.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return cedr;
  };

  cedr.minor = function(_) {
    if (!arguments.length) return minor;
    minor = _;
    return cedr;
  };

  cedr.vs = function(_) {
    if (!arguments.length) return vs;
    vs = _;
    return cedr;
  };

  cedr.ve = function(_) {
    if (!arguments.length) return ve;
    ve = _;
    return cedr;
  };

  cedr.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return cedr;
  };

  cedr.d = function(_) {
    if (!arguments.length) return d;
    d = _;
    return cedr;
  };

  cedr.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return cedr;
  };

  cedr.extent = function(_) {
    if (!arguments.length) return extent;
    extent = _;
    return cedr;
  };

  return cedr;
}

// Extend d3.svg with timePlot which utilizes d3.layout.cedr layout to draw
// the timePlot of the cedr events.
d3.svg.timePlot = function() {
  // default color for events (blueish)
  var color = function() { return "#1f77b4" };

  function drawWindow(g, e, w) {
    // draw the window line fragment...
    g.append("svg:line").attr("class", "window")
      .attr("x1", e.vs)
      .attr("x2", e.ve)
      .attr("y1", e.y)
      .attr("y2", e.y);

    // display title if any...
    if(typeof e.title !== 'unknown') {
      g.append("svg:text").attr("class", "event")
        .attr("x", e.vs)
        .attr("y", e.y - 4)
        .attr("text-anchor", "left")
        .text(e.title);
    }

    // vertical guide for window start and end if yExtend is specified.
    if(typeof +e.yExtend === 'number')
    {
      // do not draw verical guides at the edges of the drawing
      if(e.ve !== w && e.ve !== 0) {
        g.append("svg:line")
          .attr("x1", e.ve)
          .attr("x2", e.ve)
          .attr("y1", e.y)
          .attr("y2", e.yExtend)
          .attr("stroke", "black")
          .attr("shape-rendering", "crispEdges")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", [1,5,1,5]);
      }
      if(e.vs !== w && e.vs !== 0) {
        g.append("svg:line")
          .attr("x1", e.vs)
          .attr("x2", e.vs)
          .attr("y1", e.y)
          .attr("y2", e.yExtend)
          .attr("stroke", "black")
          .attr("shape-rendering", "crispEdges")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", [1,5,1,5]);
      }
    }
  };

  function drawEvent(g, e) {
    // draw the event line fragment...
    g.append("svg:line").attr("class", "event")
      .attr("x1", e.vs)
      .attr("x2", e.ve)
      .attr("y1", e.y)
      .attr("y2", e.y)
      .attr("stroke", color(e.d))
      .attr("stroke-width", 2);

    // starting circle...
    g.append("svg:circle").attr("class", "event")
      .attr("cx", e.vs)
      .attr("cy", e.y)
      .attr("r", 3)
      .attr("stroke", color(e.d))
      .attr("fill", color(e.d));

    // dotted time extension showing the effect of alterlifetime if extend is specified...
    if(typeof e.extend === 'number') {
      g.append("svg:line").attr("class", "event")
        .attr("x1", e.ve)
        .attr("x2", e.ve + e.extend)
        .attr("y1", e.y)
        .attr("y2", e.y)
        .attr("stroke", color(e.d))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 2);
    }

    // and the title is specified.
    if(typeof e.title !== 'unknown') {
      g.append("svg:text").attr("class", "event")
        .attr("x", e.vs)
        .attr("y", e.y - 4)
        .attr("text-anchor", "left")
        .text(e.title);
    }
  };

  function timePlot(g, cedr) {
    // yAxis
    g.append("g")
      .attr("class", "axis")
      .call(cedr.yAxis);
    // xAxis
    g.append("g")
      .attr("class", "axis")
      .call(cedr.xAxis);

    // event and window data
    cedr.data.forEach(function(e, i) {
      if(e.kind === 'window') {
        drawWindow(g, e, cedr.w);
      } else if(e.kind === 'event') {
        drawEvent(g, e);
      }
    });
  }

  timePlot.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return timePlot;
  };

  return timePlot;
}

// common helper function to not clutter the html files.
function sampleDrawing(computeTracks, padding) {
  var colors = [
    "#1f77b4", // blue-ish
    "#d62728", // red-ish
    "#9467bd", // magenta-ish
    "#ff7f0e", // orange-ish
    "#8c564b" // brown-ish
    ];
  padding = +padding || 20;

  var plot = d3.svg.timePlot()
    .color(function(x) { return colors[x]; });

  var cedr = d3.layout.cedr()
    .minor(3)
    .scale(7.958)
    .d(function(x) { return x.d - 1 })
    .title(function(x) { return x.title });

  var tracks = computeTracks(cedr);

  var w = d3.max(tracks, function(x) { return x.w });
  var h = d3.sum(tracks, function(x) { return x.h });
  var svg = d3.select("body")
    .append("svg:svg")
      .attr("width", w + 2 * padding)
      .attr("height", h + 2 * padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding + ")");

  var heights = [];
  tracks.reduce(function(h, x) { var s = h + x.h; heights.push(s); return s; }, 0);

  for(var i = tracks.length - 1; i >= 0; i -= 1)
  {
    var t = svg.append("g")
      .attr("class", "track")
      .attr("width", w)
      .attr("height", heights[i])
      .attr("transform", "translate(" + 0 + "," + heights[i] + ")");

    plot(t, tracks[i]);
  }
};

// Introduce string formatting like in C# with {0}, {1}, etc...
// Taken from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if(typeof String.prototype.format !== 'function') {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined' ? args[number] : match;
      });
  };
};
