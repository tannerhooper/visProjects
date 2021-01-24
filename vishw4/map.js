/** Class implementing the map view. */
class Map {
  constructor() {
    this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
  }
  
  // clears the map
  clearMap() {
    d3.selectAll('.countries')
      .classed('host', false)
      .classed('team', false)
    ;
    d3.select("#points").selectAll("*").remove();
  }

  // updates the map with new data
  updateMap(data, measure, year) {
    this.clearMap();
    
    let arr = [];
    for (c of data) {
      if (!isNaN(c.val)) {
        arr.push(c.val);
      }
    }
    let colorMap = d3.scaleLinear() // used for map shading
      .domain(arr)
      .range(['deepskyblue', 'darkblue'])
    ;
    
    for (c in data){
      let node = d3.select(`#${data[c].code}`);
      node.style('fill', colorMap(data[c].val))

      let t = node.select('title');
      t.text(`${data[c].name}: ${d3.format('.2g')(data[c].val).replace('+', '')}`)
    }
    console.log('');
  }
  
  // redraws the map
  drawMap(world) {
    let path = d3.geoPath()
      .projection(this.projection);

    let graticule = d3.geoGraticule().step([10, 10]);
    d3.select("#map").selectAll("path")
      .data([graticule()])
      .enter()
      .append("path")
      .attr("d", path)
      .attr('class', 'grat')
      .attr('fill', 'none')
      .style('stroke','darkgrey')
    ;

    let geoJSON = topojson.feature(world, world.objects.countries);
    // console.log('geoJSON',geoJSON);

    d3.select("#map").selectAll("path")
      .data(geoJSON.features)
      .enter()
      .append("path")
      .attr("id", d => d.id)
      .attr("d", path)
      .attr('class', 'countries')
      .style('strokewidth',3)
      .style('stroke','white')
      .style('fill','lightgray')
      .append('title').text(d => d.id)
    ;
  }
}
