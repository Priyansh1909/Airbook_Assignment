import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type GenreData = {
  genre: string;
  count: number;
};

function PieChart({ FetchGenre }: any) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [data, setData] = useState<GenreData[]>([]);

  useEffect(() => {
    if (FetchGenre?.FetchGenre.TopGenre) {
      setData(FetchGenre.FetchGenre.TopGenre);
    }
  }, [FetchGenre]);

  useEffect(() => {
    if (data.length > 0) {

      const margin = {top: 30, right: 30, bottom: 20, left: 60}
      const parentDiv = svgRef.current?.parentElement;
      const parentWidth = parentDiv?.clientWidth || 500 ;;
      const width = parentWidth;
      const height = 350  - margin.bottom;
      const radius = Math.min(width, height) / 2;


      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("margin-bottom", "13");

      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${width / 3},${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeSet2);

      const pie = d3.pie<GenreData>().value((d) => d.count);

      const arc = d3.arc<d3.PieArcDatum<GenreData>>()
        .innerRadius(0)
        .outerRadius(radius);

        // Creating Arcs 
      const arcs = g.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (event, d: any) {
          const [x, y] = d3.pointer(event);
          console.log(x,y)
          d3.select(this).style("opacity", 0.4);
          svg
            .append("text")
            .attr("width",50)
            .attr("height",30)
            .attr("class", "tooltip")
            .attr("x", x + 200)
            .attr("y", y+ 150 )
            .attr("text-anchor", "middle")
            .style("fill", "black")
            .style("rx", "10px")
            .style("ry", "10px")
            .style("font-size", "12px")
            .text(`${d.data.genre}: ${d.data.count}`);
        })
        
        .on("mousemove", function (event) {
          const [x, y] = d3.pointer(event);
          svg.select(".tooltip").attr("x", x+200).attr("y", y+180);
        })
        .on("mouseout", function (_, _d: any) {
          d3.select(this).style("opacity", 1);
          svg.selectAll(".tooltip").remove();
        });

      

      arcs.append("path")
        .attr("fill", (_, i:any) => color(i))
        .attr("d", arc)
        .transition()
        .duration(1000)
        .attrTween("d", function(d) :any {
          const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function(t:any) {
            return arc(interpolate(t));
          };
        });

        // Adding Legend on the Right Side
        const legend = svg.append('g')
        .attr("transform", `translate(${width - 200}, 60)`)
        .style("color","black")

        const legendRectSize = 20;
        const legendSpacing = 6;



        const legendItems = legend.selectAll('.legend-item')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (_,i:any) => `translate(0,${i * (legendRectSize + legendSpacing)})`)

        // Adding Color Code for Genre
      legendItems.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('fill', (_, i:any) => color(i));

        // Adding Name for Genre

      legendItems.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(d => d.genre);


    }
  }, [data]);

  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-300 mr-4 ">
      <div className="flex items-center m-1 justify-between pl-3 pb-2 border-b-2 ">
          <div> 
            Number of Shows Per Genre
          </div>

        </div>
      <svg ref={svgRef} width={500} height={500}></svg>
    </div>
  );
}

export default PieChart;
