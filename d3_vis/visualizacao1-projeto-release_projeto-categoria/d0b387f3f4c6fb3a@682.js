// https://observablehq.com/@julianapsa/visualizacao-projeto-release-e-projeto-categoria@682
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Visualização Projeto/Release e Projeto/Categoria`
)});
  main.variable(observer("container")).define("container", function(){return(
function container(id, title) { 
  return `
<div class='container'>
<div class='content'>
<div class='container'>
<div class='row'>
    <div class='span12' id='${id}'>
      <h4>${title}</h4>
    </div>
  </div>
</div>
</div>
</div>`
}
)});
  main.variable(observer("projects")).define("projects", ["d3"], function(d3){return(
d3.json('https://raw.githubusercontent.com/diegofarias06/bug-repository/master/data-vis-1.json').then(function(data){
  data.forEach(function(d,i){
    d.name = d['Name']
    d.category = d['Category']
    d.released = +d.Released
    d.count = 1
  })
  return data
})
)});
  main.variable(observer("facts2")).define("facts2", ["crossfilter","projects"], function(crossfilter,projects){return(
crossfilter(projects)
)});
  main.variable(observer("nameDim")).define("nameDim", ["facts2"], function(facts2){return(
facts2.dimension( d => d.name)
)});
  main.variable(observer("categoryDim")).define("categoryDim", ["facts2"], function(facts2){return(
facts2.dimension( d => d.category)
)});
  main.variable(observer("releasedDim")).define("releasedDim", ["facts2"], function(facts2){return(
facts2.dimension( d => d.released)
)});
  main.variable(observer("projectsByReleaseGroup")).define("projectsByReleaseGroup", ["releasedDim"], function(releasedDim){return(
releasedDim.group().reduceSum(d => d.count)
)});
  main.variable(observer("projectsByCategoryGroup")).define("projectsByCategoryGroup", ["categoryDim"], function(categoryDim){return(
categoryDim.group().reduceSum(d => d.count)
)});
  main.variable(observer("projectsByYear")).define("projectsByYear", ["md","container","dc","releasedDim","d3","projectsByReleaseGroup"], function(md,container,dc,releasedDim,d3,projectsByReleaseGroup)
{
  let view = md`${container('barchart1','Projects/Release')}` 
  let barChart = dc.barChart(view.querySelector("#barchart1"))
  barChart.width(1000)
           .height(400)
           .dimension(releasedDim)
           .margins({top: 40, right: 40, bottom: 40, left: 40})
           .x(d3.scaleBand())
           .xUnits(dc.units.ordinal)
           .brushOn(true)
           .gap(30)
           .group(projectsByReleaseGroup, 'projectsByYear') 
  dc.barChart
  barChart.render()
  return view      
}
);
  main.variable(observer("projectsByCategory")).define("projectsByCategory", ["md","container","dc","categoryDim","d3","projectsByCategoryGroup"], function(md,container,dc,categoryDim,d3,projectsByCategoryGroup)
{
  let view = md`${container('barchart2','Projects/Category')}` 
  let barChart = dc.barChart(view.querySelector("#barchart2"))
  barChart.width(1000)
           .height(400)
           .margins({top: 40, right: 40, bottom: 40, left: 40})       
           .dimension(categoryDim)
           .x(d3.scaleBand())
           .xUnits(dc.units.ordinal)
           .brushOn(true)
           .gap(10)
           .group(projectsByCategoryGroup) 
  
  barChart.render()
  return view   
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula inclui o css do dc.
<style>
.dc-chart path.dc-symbol, .dc-legend g.dc-legend-item.fadeout {
  fill-opacity: 0.5;
  stroke-opacity: 0.5; }

.dc-chart rect.bar {
  stroke: none;
  cursor: pointer; }
  .dc-chart rect.bar:hover {
    fill-opacity: .5; }

.dc-chart rect.deselected {
  stroke: none;
  fill: #ccc; }

.dc-chart .pie-slice {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }
  .dc-chart .pie-slice.external {
    fill: #000; }
  .dc-chart .pie-slice :hover, .dc-chart .pie-slice.highlight {
    fill-opacity: .8; }

.dc-chart .pie-path {
  fill: none;
  stroke-width: 2px;
  stroke: #000;
  opacity: 0.4; }

.dc-chart .selected path, .dc-chart .selected circle {
  stroke-width: 3;
  stroke: #ccc;
  fill-opacity: 1; }

.dc-chart .deselected path, .dc-chart .deselected circle {
  stroke: none;
  fill-opacity: .5;
  fill: #ccc; }

.dc-chart .axis path, .dc-chart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges; }

.dc-chart .axis text {
  font: 10px sans-serif; }

.dc-chart .grid-line, .dc-chart .axis .grid-line, .dc-chart .grid-line line, .dc-chart .axis .grid-line line {
  fill: none;
  stroke: #ccc;
  shape-rendering: crispEdges; }

.dc-chart .brush rect.selection {
  fill: #4682b4;
  fill-opacity: .125; }

.dc-chart .brush .custom-brush-handle {
  fill: #eee;
  stroke: #666;
  cursor: ew-resize; }

.dc-chart path.line {
  fill: none;
  stroke-width: 1.5px; }

.dc-chart path.area {
  fill-opacity: .3;
  stroke: none; }

.dc-chart path.highlight {
  stroke-width: 3;
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart g.state {
  cursor: pointer; }
  .dc-chart g.state :hover {
    fill-opacity: .8; }
  .dc-chart g.state path {
    stroke: #fff; }

.dc-chart g.deselected path {
  fill: #808080; }

.dc-chart g.deselected text {
  display: none; }

.dc-chart g.row rect {
  fill-opacity: 0.8;
  cursor: pointer; }
  .dc-chart g.row rect:hover {
    fill-opacity: 0.6; }

.dc-chart g.row text {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }

.dc-chart g.dc-tooltip path {
  fill: none;
  stroke: #808080;
  stroke-opacity: .8; }

.dc-chart g.county path {
  stroke: #fff;
  fill: none; }

.dc-chart g.debug rect {
  fill: #00f;
  fill-opacity: .2; }

.dc-chart g.axis text {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .node {
  font-size: 0.7em;
  cursor: pointer; }
  .dc-chart .node :hover {
    fill-opacity: .8; }

.dc-chart .bubble {
  stroke: none;
  fill-opacity: 0.6; }

.dc-chart .highlight {
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart .fadeout {
  fill-opacity: 0.2;
  stroke-opacity: 0.2; }

.dc-chart .box text {
  font: 10px sans-serif;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .box line {
  fill: #fff; }

.dc-chart .box rect, .dc-chart .box line, .dc-chart .box circle {
  stroke: #000;
  stroke-width: 1.5px; }

.dc-chart .box .center {
  stroke-dasharray: 3, 3; }

.dc-chart .box .data {
  stroke: none;
  stroke-width: 0px; }

.dc-chart .box .outlier {
  fill: none;
  stroke: #ccc; }

.dc-chart .box .outlierBold {
  fill: red;
  stroke: none; }

.dc-chart .box.deselected {
  opacity: 0.5; }
  .dc-chart .box.deselected .box {
    fill: #ccc; }

.dc-chart .symbol {
  stroke: none; }

.dc-chart .heatmap .box-group.deselected rect {
  stroke: none;
  fill-opacity: 0.5;
  fill: #ccc; }

.dc-chart .heatmap g.axis text {
  pointer-events: all;
  cursor: pointer; }

.dc-chart .empty-chart .pie-slice {
  cursor: default; }
  .dc-chart .empty-chart .pie-slice path {
    fill: #fee;
    cursor: default; }

.dc-data-count {
  float: right;
  margin-top: 15px;
  margin-right: 15px; }
  .dc-data-count .filter-count, .dc-data-count .total-count {
    color: #3182bd;
    font-weight: bold; }

.dc-legend {
  font-size: 11px; }
  .dc-legend .dc-legend-item {
    cursor: pointer; }

.dc-hard .number-display {
  float: none; }

div.dc-html-legend {
  overflow-y: auto;
  overflow-x: hidden;
  height: inherit;
  float: right;
  padding-right: 2px; }
  div.dc-html-legend .dc-legend-item-horizontal {
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-horizontal.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-vertical {
    display: block;
    margin-top: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-vertical.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-color {
    display: table-cell;
    width: 12px;
    height: 12px; }
  div.dc-html-legend .dc-legend-item-label {
    line-height: 12px;
    display: table-cell;
    vertical-align: middle;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 0.75em; }

.dc-html-legend-container {
  height: inherit; }
</style>`
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require("dc")
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require("crossfilter2")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  return main;
}
