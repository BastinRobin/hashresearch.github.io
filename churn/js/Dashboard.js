queue()
    .defer(d3.tsv, "js/churn.csv")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	console.log(apiData);
//Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y");
	dataSet.forEach(function(d) {
		d.Date = dateFormat.parse(d.Date);
				d.Date.setDate(1);
		d['Total Call Charge'] = +d['Total Call Charge'];
	});

	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.Date; });
	var gradeLevel = ndx.dimension(function(d) { return d['Voice mail plan']; });
	var resourceType = ndx.dimension(function(d) { return d['Area code']; });
	var fundingStatus = ndx.dimension(function(d) { return d['Churn']; });
	var povertyLevel = ndx.dimension(function(d) { return d['International plan']; });
	var state = ndx.dimension(function(d) { return d['State']; });
	var totalDonations  = ndx.dimension(function(d) { return d['Total Call Charge']; });


	//Calculate metrics
	var projectsByDate = datePosted.group(); 
	var projectsByGrade = gradeLevel.group(); 
	var projectsByResourceType = resourceType.group();
	var projectsByFundingStatus = fundingStatus.group();
	var projectsByPovertyLevel = povertyLevel.group();
	var stateGroup = state.group();

	var all = ndx.groupAll();

	//Calculate Groups
	var totalDonationsState = state.group().reduceSum(function(d) {
		return d['Total Call Charge'];
	});

	var totalDonationsGrade = gradeLevel.group().reduceSum(function(d) {
		return d['Voice mail plan'];
	});

	var totalDonationsFundingStatus = fundingStatus.group().reduceSum(function(d) {
		return d['Churn'];
	});



	var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d['Total Call Charge'];});

	//Define threshold values for data
	var minDate = datePosted.bottom(1)[0].Date;
	var maxDate = datePosted.top(1)[0].Date;

console.log(minDate);
console.log(maxDate);

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var gradeLevelChart = dc.rowChart("#grade-chart");
	var resourceTypeChart = dc.rowChart("#resource-chart");
	var fundingStatusChart = dc.pieChart("#funding-chart");
	var povertyLevelChart = dc.rowChart("#poverty-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var netDonations = dc.numberDisplay("#net-donations");
	var stateDonations = dc.barChart("#state-donations");


  selectField = dc.selectMenu('#menuselect')
        .dimension(state)
        .group(stateGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	netDonations
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(netTotalDonations)
		.formatNumber(d3.format(".3s"));

	dateChart
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(6);

	resourceTypeChart
        //.width(300)
        .height(220)
        .dimension(resourceType)
        .group(projectsByResourceType)
        .elasticX(true)
        .xAxis().ticks(5);

	povertyLevelChart
		//.width(300)
		.height(220)
        .dimension(povertyLevel)
        .group(projectsByPovertyLevel)
        .xAxis().ticks(4);

	gradeLevelChart
		//.width(300)
		.height(220)
        .dimension(gradeLevel)
        .group(projectsByGrade)
        .xAxis().ticks(4);

  
          fundingStatusChart
            .height(220)
            //.width(350)
            .radius(90)
            .innerRadius(40)
            .transitionDuration(1000)
            .dimension(fundingStatus)
            .group(projectsByFundingStatus);


    stateDonations
    	//.width(800)
        .height(220)
        .transitionDuration(1000)
        .dimension(state)
        .group(totalDonationsState)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(state))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("s"));


    dc.renderAll();

};