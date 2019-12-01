var margin = { top: 80, right: 50, bottom: 80, left: 135 },
    width = 750 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(
    "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/categoriasPrioridades.csv",
    function(data) {
      // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
      var priorities = d3
        .map(data, function(d) {
          return d.Priority;
        })
        .keys();
      var categories = d3
        .map(data, function(d) {
          return d.Category;
        })
        .keys();

      // Build X scales and axis:
      var x = d3
        .scale.ordinal()
        .domain(priorities)
        .rangeRoundBands([0, width], 0.05);

      /*
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()*/
      svg
        .append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      // Build Y scales and axis:
      var y = d3
        .scale.ordinal()
        .range()
        .domain(categories)
        .rangeRoundBands([height, 0], 0.05);
      svg
        .append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain")
        .remove();

      // Build color scale
      var myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([1, 5000]);

      // create a tooltip
      var tooltip = d3
        .select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        //.style("background-color", "white")
        //.style("border", "solid")
        //.style("border-width", "2px")
        //.style("border-radius", "5px")
        //.style("padding", "5px");

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        tooltip.style("opacity", 1);
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1);
      };

			var sumCategory = new Map();
			data.forEach(fSumCategory);

			function fSumCategory(value, index, array) {
				if (!sumCategory.has(value.Category))
					sumCategory.set(value.Category, parseInt(0));
				sumCategory.set(value.Category, sumCategory.get(value.Category)+parseInt(value.N));
			}

      var mousemove = function(d) {
        tooltip
          .html(d.N + " relatórios ("+ Math.round((d.N/sumCategory.get(d.Category))*10000)/100+"% dos relatórios de "+d.Category+")")
          .style("left", d3.mouse(this)[0] + 200 + "px")
          .style("top", d3.mouse(this)[1] + "px");
      };
      var mouseleave = function(d) {
        tooltip.style("opacity", 0);
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8);
      };

      // add the squares
      svg
        .selectAll()
        .data(data, function(d) {
          return d.Priority + ":" + d.Category;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return x(d.Priority);
        })
        .attr("y", function(d) {
          return y(d.Category);
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {
          return myColor(d.N);
        })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

      // Add legend
      continuous("#legend1", myColor);

      function continuous(selector_id, colorscale) {
        var legendheight = 200,
          legendwidth = 80,
          margin = { top: 10, right: 60, bottom: 10, left: 2 };

        var canvas = d3
          .select(selector_id)
          .style("height", legendheight + "px")
          .style("width", legendwidth + "px")
          .style("position", "relative")
          .append("canvas")
          .attr("height", legendheight - margin.top - margin.bottom)
          .attr("width", 1)
          .style("height", legendheight - margin.top - margin.bottom + "px")
          .style("width", legendwidth - margin.left - margin.right + "px")
          .style("border", "1px solid #000")
          .style("position", "absolute")
          .style("top", margin.top + "px")
          .style("left", margin.left + "px")
          .node();

        var ctx = canvas.getContext("2d");

        var legendscale = d3
          .scaleLinear()
          .range([1, legendheight - margin.top - margin.bottom])
          .domain(colorscale.domain());

        // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
        var image = ctx.createImageData(1, legendheight);
        d3.range(legendheight).forEach(function(i) {
          var c = d3.rgb(colorscale(legendscale.invert(i)));
          image.data[4 * i] = c.r;
          image.data[4 * i + 1] = c.g;
          image.data[4 * i + 2] = c.b;
          image.data[4 * i + 3] = 255;
        });
        ctx.putImageData(image, 0, 0);

        // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
        // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
        /*
			d3.range(legendheight).forEach(function(i) {
				ctx.fillStyle = colorscale(legendscale.invert(i));
				ctx.fillRect(0,i,1,1);
			});
			*/

        var legendaxis = d3
          .axisRight()
          .scale(legendscale)
          .tickSize(6)
          .ticks(8);

        var svg = d3
          .select(selector_id)
          .append("svg")
          .attr("height", legendheight + "px")
          .attr("width", legendwidth + "px")
          .style("position", "absolute")
          .style("left", "0px")
          .style("top", "0px");

        svg
          .append("g")
          .attr("class", "axis")
          .attr(
            "transform",
            "translate(" +
              (legendwidth - margin.left - margin.right + 3) +
              "," +
              margin.top +
              ")"
          )
          .call(legendaxis);
      }
    }
  );

  // Add title to graph
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("#Relatórios /  (Categoria,Prioridade)");

  // Add subtitle to graph
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "grey")
    .style("max-width", 400)
    .text(
      "Valores relativos e absolutos da quantidade de relatório por Categoria e Prioridade"
    );