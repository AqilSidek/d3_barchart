let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req = new XMLHttpRequest()

let dataset //where we'll store the response that we get
let values //where we'll store the array of dates and GDP numbers

let heightScale //height of the bars
let xScale //where bars are placed horizontally on the canvas
let xAxisScale //drawing x-axis
let yAxisScale //drawing y-axis

let w = 800
let h = 600
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', w)
    svg.attr('height', h)
}

let generateScales = () => {

    heightScale = d3.scaleLinear()
                   .domain([0, d3.max(values, (item) => {
                    return item[1]
                   })])
                   .range([0,  h - (2 * padding)]);

    xScale = d3.scaleLinear()
                   .domain([0, values.length - 1])
                   .range([padding, w - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    });

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, w - padding]);

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([h - padding, padding]);
}

let drawbars = () => {

    //tooltip has to be created on the body, not the SVG canvas
    //purely because of the way FreeCodeCamp marks this exercise
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden') //hidden so that there is not a visible separate div
                    .style('height', 'auto') //style method is used because we are not working on/in the SVG canvas
                    .style('width', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (w - (2 * padding))/values.length)
        .attr('data-date', (item) => {
            return item[0];
        })
        .attr('data-gdp', (item) => {
            return item[1];
        })
        .attr('height', (item) =>  {
            return heightScale(item[1]);
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item, index) => {
            return (h - padding) - heightScale(item[1])
        })
        //this was not taught in the curriculum
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text(item[0])
            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

let generateAxes = () => {
    
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (h - padding) + ')')
    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    dataset = JSON.parse(req.responseText)
    values = dataset.data 
    console.log(values)

    //calling functions in order they should execute
    drawCanvas()
    generateScales()
    drawbars()
    generateAxes()
}
req.send()