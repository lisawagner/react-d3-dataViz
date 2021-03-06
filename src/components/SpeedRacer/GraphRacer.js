import * as d3 from "d3";
import { format } from "d3";
import "./gstyles.css";

const jsonURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

export const GraphRacer = () => {
  // fetch(jsonURL)
  // .then((response) => {
  //   return response.json();
  // })
  // .then((bikers) => {
  // bikers.map((biker) => console.log("Dudes:", biker.Name));
  // const Years = bikers.map((biker) => biker.Year);
  // console.log(Years);

  // const noDope = bikers.filter((biker) => biker.Doping === "");
  // console.log("NoDope:", noDope);

  // const yesDope = bikers.filter((biker) => biker.Doping !== "");
  // console.log("Doper:", yesDope);

  // const formatBiker = (biker) => {
  //   const { Name, Year, Time } = biker;
  //   return `${Year} ${Name}: ${Time}`;
  // };

  // const generateReport = (bikers, maxYears) =>
  //   bikers
  //     .filter((biker) => biker.Year < maxYears)
  //     .map(formatBiker)
  //     .join("\n");

  // const elBiker = document.getElementById("message");
  // const message = bikers[21].Name;
  // const message = formatBiker(bikers[17]);
  // const message = generateReport(bikers, 1997);
  // elBiker.textContent = message;
  // work with json data here
  // console.log("Sample Biker:", bikers[34]);
  // })
  // .catch((err) => {
  //   console.log(err);
  // });

  const width = 960;
  const height = 800;
  const margin = { top: 40, right: 30, bottom: 50, left: 160 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("svg").attr("width", width).attr("height", height);

  const render = (data) => {
    const xValue = (d) => d.Seconds;
    const yValue = (d) => d.Place;

    // set up canvas scale
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, xValue)])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scalePoint()
      .domain(data.map(yValue))
      .range([0, innerHeight])
      .padding(0.5);

    // d3 margin convention
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // format xAxis
    const xAxisFormat = (number) => format(".4s")(number).replace("k", "s");
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(xAxisFormat)
      .tickSize(-innerHeight);

    // set the axis

    const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);

    g.append("g").call(yAxis).select(".domain").remove();

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${innerHeight})`);

    xAxisG.select(".domain").remove();

    xAxisG
      .append("text")
      .attr("class", "axis-label")
      .attr("y", 30)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text("Racetime in Seconds");

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", 7);

    g.append("text")
      .attr("class", "title")
      .attr("y", -10)
      .text("Goofing off with D3js");
  };

  d3.json(jsonURL).then((data) => {
    data.forEach((d) => {
      // + parses strings into num
      d.Year = +d.Year;
    });
    render(data);
  });

  return (
    <div>
      <h1>GraphRacer</h1>
      <svg></svg>
      <div id="svgData"></div>
      <div id="message"></div>
    </div>
  );
};
