import React, { useEffect, useState, useRef } from "react";
import { parseDp, parseOptimalOne } from "./parseDp";
import * as d3 from "d3";
import * as d3dag from "https://cdn.skypack.dev/d3-dag@1.0.0-1";
import { Checkbox } from "@material-tailwind/react";

import "../../assets/stylesheets/Dp.css";

const GraphView = ({ width, height, data }) => {
  const dagSvg = useRef(null);
  const margin = { x: 0, y: 20 };

  const [showOptimalOne, setShowOptimalOne] = useState(false);
  const handleCheckboxChange = () => {
    setShowOptimalOne((prev) => !prev);
  };

  function drawGraph({ graphSvg, data }) {
    console.log(data);
    d3.select(graphSvg.current).selectAll("*").remove(); //clear

    // data graph 형태로 변경
    const graph = d3dag.graphStratify()(data);

    /* coumput layout */
    const nodeRadius = 25;
    const nodeSize = [nodeRadius * 2, nodeRadius * 2];
    // const shape = d3dag.tweakShape(nodeSize, d3dag.shapeEllipse);
    const dagDepth = data[data.length - 1].level;

    const layout = d3dag
      .sugiyama()
      .nodeSize((node) => {
        if (node.data.id.includes(" - ")) {
          return [node.data.id.length * 6 + 20, 200];
        } else {
          return [50, 50];
        }
      })
      .gap([30, 30]);
    // .tweaks([shape]);

    const { width: dagWidth, height: dagHeight } = layout(graph);

    const svg = d3
      .select(graphSvg.current)
      .append("svg")
      .attr("width", dagWidth)
      .attr("height", dagHeight)
      .append("g") // 그룹으로 묶어서
      .attr("transform", `scale(${width / dagWidth}, ${width / dagWidth})`)
      .call(
        d3.zoom().on("zoom", (event) => {
          svg.attr("transform", event.transform);
        })
      )
      .append("g");

    // create links
    const line = d3.line().curve(d3.curveMonotoneY);
    svg
      .append("g")
      .selectAll("path")
      .data(graph.links())
      .enter()
      .append("path")
      .attr("d", (d) =>
        line([
          [
            d.source.x,
            d.source.data.level * (dagHeight / dagDepth) + nodeRadius / 2,
          ],
          [
            d.target.x,
            d.target.data.level * (dagHeight / dagDepth) - nodeRadius / 2,
          ],
        ])
      )
      .attr("transform", `translate(0, ${margin.y})`)
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", "lightgrey");

    // create nodes
    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(graph.nodes())
      .enter()
      .append("g")
      .attr("transform", (d) => {
        return `translate(${d.x}, ${
          d.data.level * (dagHeight / dagDepth) + margin.y
        })`;
      });

    // // create arrows
    // const arrowSize = (nodeRadius * nodeRadius) / 20.0;
    // const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
    // const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);

    // svg
    //   .append("g")
    //   .selectAll("path")
    //   .data(graph.links())
    //   .enter()
    //   .append("path")
    //   .attr("d", arrow)
    //   .attr("transform", ({ points }) => {
    //     const [[sx, sy], [ex, ey]] = points.slice(-2);
    //     const dx = sx - ex;
    //     const dy = sy - ey;
    //     // This is the angle of the last line segment
    //     const angle = (Math.atan2(-dy, -dx) * 180) / Math.PI + 90;
    //     return `translate(${ex}, ${ey}) rotate(${angle})`;
    //   })
    //   .attr("fill", ({ target }) => colorMap[target.data.id])
    //   .attr("stroke", "white")
    //   .attr("stroke-width", 1.5)
    //   .attr("stroke-dasharray", `${arrowLen},${arrowLen}`);

    const colorMap = new Map();
    const nodesArray = Array.from(graph.nodes());

    const nodeTypes = [
      ...new Set(
        nodesArray.map((node) => {
          return node.data.id.split(" - ")[1];
        })
      ),
    ];

    nodeTypes.forEach((type, i) => {
      colorMap.set(type, d3.schemePastel1[i]);
    });

    nodes.each(function (d) {
      const node = d3.select(this);
      const parts = d.data.id.split(" - ");

      if (parts.length > 1) {
        node
          .append("rect")
          .attr("width", d.data.id.length * 6 + 20)
          .attr("height", 50)
          .attr("x", -d.data.id.length * 3 - 10)
          .attr("y", -15)
          .attr("fill", colorMap.get(parts[1]));
      } else {
        node
          .append("circle")
          .attr("r", nodeRadius)
          .attr("fill", colorMap.get(nodeTypes[0]));
      }
    });

    // node type
    nodes
      .append("text")
      .text((d) => d.data.id.split(" - ").pop())
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("class", "dp-node-text");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "dp-tooltip")
      .style("visibility", "hidden");

    nodes
      .on("mouseover", function (event, d) {
        tooltip
          .html(`${d.data.id} level: ${d.data.level}`)
          .style("visibility", "visible");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }

  useEffect(() => {
    const dpData = parseDp(data);
    const optimalData = parseOptimalOne(data);

    if (showOptimalOne)
      drawGraph({
        graphSvg: dagSvg,
        data: optimalData,
      });
    else
      drawGraph({
        graphSvg: dagSvg,
        data: dpData,
      });
  }, [data, width, height, showOptimalOne]);

  return (
    <div>
      <svg ref={dagSvg} width={width} height={height + 2 * margin.y}></svg>
      <div className="checkbox-container">
        <Checkbox
          color="blue"
          className="h-4 w-4 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
          checked={showOptimalOne}
          label={<p className="text">Show Optimized One</p>}
          onClick={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default GraphView;
