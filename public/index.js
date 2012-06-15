var step = +cubism.option("step", 1e4);

var context = cubism.context()
    .step(step)
    .size(1080);

var cube = context.cube("http://localhost:1081");

// Add top and bottom axes to display the time.
d3.select("body").selectAll(".axis")
    .data(["top", "bottom"])
  .enter().append("div")
    .attr("class", function(d) { return d + " axis"; })
    .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

// Add a mouseover rule.
d3.select("body").append("div")
    .attr("class", "rule")
    .call(context.rule());

function queryType(element) {
  return element.match(/^sql/) || element.match(/^load/) || element === "schema";
}

d3.json(cube + "/1.0/types", function(types) {
  d3.select("body").insert("div", ".bottom")
      .attr("class", "group")
      .call(function() { this.append("header").text("Median query durations per model"); })
    .selectAll(".horizon")
      .data(types.filter(queryType))
    .enter().append("div")
      .attr("class", "horizon")
    .call(context.horizon()
      .metric(function(d) { return cube.metric("median(" + d + "(duration_ms))"); }));
});

// On mousemove, reposition the chart values to match the rule.
context.on("focus", function(i) {
  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
});

// Initialize the step menu's selection.
d3.selectAll("#step option").property("selected", function() {
  return this.value == step;
});

// Update the location on step change.
d3.select("#step").on("change", function() {
  window.location = "?step=" + this.value + "&" + location.search.replace(/[?&]step=[^&]*(&|$)/g, "$1").substring(1);
});

