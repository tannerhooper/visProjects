var worldMap;
var countries;

function updateChart(data, measure) {
	let stats = [];

	// get data
	for (row of data) {
		if (row['IndicatorName'] == measure) {
			if (row['CountryName'] == 'World') {
				for (year of years) {
					stats.push(row[year]);
				}
			}
		}
	}
	
	// update bar heights, tooltips, and events
	let barHeight = d3.scaleLinear()
		.domain([0, d3.max(stats)])
		.range([chartHeight, 10])
	;
	d3.selectAll('svg.svgChart g rect').data(stats).join('rect')
		.on('click',function() {
			fdata = createData(data, measure, d3.select(this).attr('id'))
			worldMap.updateMap(fdata, measure, d3.select(this).attr('id'));
			updateInfo(fdata);
		})
		.append('title').text(d => 'Worldwide: ' + d3.format('.2g')(parseFloat(d)).replace('+', ''))
	;
	d3.selectAll('svg.svgChart g rect').join('rect').transition().duration(400)
		.attr('y', d => barHeight(d))
		.attr('height', d => chartHeight - barHeight(d))
	;
	
	// add labels
    let yaxis = d3.select('.yaxis');
	yaxis.call(d3.axisLeft()
		.ticks(5)
		.tickFormat(d => d3.format('.2g')(d).replace('+', ''))
		.scale(barHeight))
		.style('font-size', '1em')
	;
	yaxis.select('g .domain').remove();
	d3.select('.chartTitle').text(measure);
}

function updateInfo(data){
	d3.select('.infodiv').selectAll('span').remove()
	data = data.filter(x => x.val !== '');
	data = data.sort((a,b) => { return a.val - b.val });
	let btm = (data.slice(0,10));
	let top = (data.slice(data.length-10)).reverse();

	d3.select('#top').selectAll('span').data(top)
		.enter().append('span')
		.text((d,i) => `${i+1}: ${d.name} - ${d3.format('.2g')(d.val).replace('+', '')}`)
	d3.select('#btm').selectAll('span').data(btm)
		.enter().append('span')
		.text((d,i) => `${(data.length-1)-i}: ${d.name} - ${d3.format('.2g')(d.val).replace('+', '')}`)
}

function createData(data, measure, yr){
	let c2 = []
	for (c in countries){
		for (row of data) {
			if (row['IndicatorName'] == measure) {
				if (row['CountryCode'] == (countries[c]).code && row['CountryCode'] !== 'WLD') {
					countries[c].year = yr
					countries[c].val = row[`${yr}`]
					if (countries[c].year !== undefined){
						c2.push(countries[c])
					}
				}
			}
		}
	}
	return c2;
}

function init() {
	let promises = [d3.csv('/data/HNP_StatsCountry.csv'), d3.csv('/data/HNP_StatsData_updated.csv')];
	let dataPromises = Promise.all(promises);
	dataPromises.then(function(data) {
		worldMap = new Map();

		d3.json("data/world.json")
			.then(function(world) {
			worldMap.drawMap(world);
			});

        mapMargin = 0;
		mapWidth = 900;
        mapHeight = 670;
        chartMargin = 50;
		chartWidth = 500;
		chartHeight = 220;

		countries = [];
		for (row of data[0]) {
			countries.push({code:row['CountryCode'],name:row['TableName']}); // get all country names
		}

		years = d3.range(1998, 2020, 2).map(d => d.toString());
		let measures = ['Life expectancy at birth, total (years)',
			'Mortality rate, infant (per 1,000 live births)',
			'Birth rate, crude (per 1,000 people)',
			'Fertility rate, total (births per woman)']; // current column name for the bar chart (from the select element)
		let dropdown = d3.selectAll('#dropdown');
		dropdown.selectAll('option').data(measures).join('option').attr('value', (d, i) => 'option' + i).text(d => d);
		dropdown.on('change', function() { updateChart(data[1], d3.select('option:checked').text()); });
		
		d3.selectAll('svg.svgChart').attr('width', chartWidth + 2*chartMargin).attr('height', chartHeight + 2*chartMargin);
		d3.selectAll('svg.svgMap').attr('width', mapWidth + 2*mapMargin).attr('height', mapHeight + 2*mapMargin);
		
		// graph backgrounds
		let svgMap = d3.selectAll('svg.svgMap');
        svgMap.append('rect')
            .attr('x', mapMargin).attr('y', mapMargin).attr('width', mapWidth).attr('height', mapHeight)
            .style('fill', 'ghostwhite').style('stroke', 'black')
        ;
		let svgChart = d3.selectAll('svg.svgChart');
        svgChart.append('rect')
            .attr('x', chartMargin).attr('y', chartMargin).attr('width', chartWidth).attr('height', chartHeight)
            .style('fill', 'ghostwhite').style('stroke', 'black')
		;
		
        // graph bars
		let barWidth = d3.scaleBand() // used for bar widths
			.domain(years)
			.range([0, chartWidth])
			.padding(.25)
		;
		d3.selectAll('svg.svgChart').append('g').attr('transform', 'translate(50, 50)')
			.selectAll('rect').data(years).join('rect')
			.attr('id', d => d)
			.attr('x', d => barWidth(d))
			.attr('width', barWidth.bandwidth())
			.style('fill', 'pink')
			.style('stroke', 'black')
			.on('mouseover', function() { d3.select(this).style('cursor', 'pointer').style('fill', 'cyan').style('stroke', 'black'); })
			.on('mouseout', function() { d3.select(this).style('cursor', 'default').style('fill', 'pink'); })
		;

		// labels
		d3.selectAll('svg.svgChart').append('text')
			.attr('class', 'chartTitle')
			.attr('x', '50%')
			.attr('y', '30')
			.attr('text-anchor', 'middle')
		;
		d3.selectAll('svg.svgChart').append('g').attr('transform', 'translate(50, 295)')
			.selectAll('text').data(years).join('text')
			.attr('x', (d, i) => barWidth(d) + barWidth.bandwidth() / 2)
			.attr('y', (d, i) => 0)
			.attr('text-anchor', 'middle')
            .text(d => d)
		;
		d3.selectAll('svg.svgChart').append('g').attr('transform', 'translate(' + chartMargin + ', ' + chartMargin + ')')
			.attr('class', 'yaxis')
		;
		
		updateChart(data[1], d3.select('option:checked').text());
	});
}
