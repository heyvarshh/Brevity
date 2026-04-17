import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../store/useStore';

const ConceptGraph = () => {
  const d3Container = useRef(null);
  const { concepts } = useStore();

  useEffect(() => {
    if (concepts && d3Container.current) {
      const width = d3Container.current.clientWidth;
      const height = d3Container.current.clientHeight;

      // Clear previous graph
      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

      // Mock links between concepts for visualization
      const nodes = concepts.map((c) => ({ id: c.name, ...c }));
      const links = nodes.length > 1 ? nodes.slice(1).map((n) => ({
        source: nodes[0].id,
        target: n.id
      })) : [];

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .attr("stroke", "#334155")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1);

      const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));

      node.append("circle")
        .attr("r", 8)
        .attr("fill", "#6366f1")
        .attr("stroke", "#1e1b4b")
        .attr("stroke-width", 2)
        .attr("class", "cursor-pointer hover:fill-indigo-400 transition-colors shadow-lg shadow-indigo-500/50");

      node.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .text(d => d.name)
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("class", "pointer-events-none uppercase tracking-widest");

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("transform", d => `translate(${d.x},${d.y})`);
      });
    }
  }, [concepts]);

  return (
    <div className="w-full h-full bg-[#0f172a]/20" ref={d3Container}></div>
  );
};

export default ConceptGraph;
