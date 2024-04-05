import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios"

interface DataProp {
    id: number;
    title: string;
    certificate: number;
    runtime: number;
    genre: string;
    rating: number;
    votes: number;
}

function ScatterChart() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [data, setData] = useState<DataProp[]>([])


    useEffect(() => {

        const ParentDiv = svgRef.current?.parentElement
        const ParentWidth = ParentDiv?.clientWidth || 900;
        const margin = { top: 30, right: 30, bottom: 50, left: 60 }
        const width = ParentWidth - margin.left - margin.right
        const height = 600 - margin.top - margin.bottom

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("overflow", "visible")
            .style("margin", "40 60 60 60")

        svg.selectAll("*").remove();


        // Xaxis

        const Max_Xaxis = d3.max(data, d => d.runtime) || 0
        const Xscale = d3.scaleLinear()
            .range([margin.left, width - margin.right])
            .domain([0, Max_Xaxis])

        svg.append('g')
            .attr("transform", `translate(0 , ${height - margin.bottom})`)
            .call(d3.axisBottom(Xscale))

        // Xaxis Label

        svg.append('text')
            .text("Run Time of Shows")
            .style("font-size", "16")
            .attr("transform", `translate(${(width - margin.left) / 2}, ${height - 5})`)

        // Yaxis
        const MaxCount = d3.max(data, d => d.rating) || 0
        const Yscale = d3.scaleLinear()
            .range([height - margin.bottom, margin.top])
            .domain([0, MaxCount + 1])

        svg.append('g')
            .call(d3.axisLeft(Yscale))
            .attr('transform', `translate(${margin.left}, 0)`);

        // YAxis Label


        svg.append('text')
            .text("Rating of the Shows")
            .style("font-size", "16")
            .attr("transform", `translate(20, ${height / 1.5})rotate(-90)`)


        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .style("color", "#ddd")
            .style("opacity", 0.7)
            .call(d3.axisBottom(Xscale)
                .tickSize(-height + margin.top + margin.bottom)
                .tickFormat("" || null));

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left}, 0)`)
            .style("color", "#ddd")
            .style("opacity", 0.7)
            .call(d3.axisLeft(Yscale)
                .tickSize(-width + margin.left + margin.right)
                .tickFormat("" || null)
            );

        // dots

        svg.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return Xscale(d.runtime); })
            .attr("cy", function (d) { return Yscale(d.rating); })
            .attr("r", 3)
            .style("fill", "#69b3a2")
        
            .on("mouseover", function (_event: any, d) {
                const [x, y] = d3.pointer(event);
                d3.select(this).style("opacity", 0.8);
                // Tooltip
                const tooltip = svg.append("g")
                    .attr("class", "tooltip")

                tooltip.append("rect")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", 300)
                    .attr("height", 80)
                    .attr("fill", "white")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 2)
                    .style("ry", "10px")
                    .style("rx", "10px");

                const text = tooltip.append("text")
                    .attr("x", x + 120)
                    .attr("y", y + 10)
                    .attr("font-size", "12px")

                // Adding tspan in Text 
                text.append("tspan")
                    .attr("x", x + 10)
                    .attr("dy", "1.2em")
                    .text(`Title: ${d.title}`);

                text.append("tspan")
                    .attr("x", x + 10)
                    .attr("dy", "1.2em")
                    .text(`Genre: ${d.genre}`);

                text.append("tspan")
                    .attr("x", x + 10)
                    .attr("dy", "1.2em")
                    .text(`runtime: ${d.runtime}`);

                text.append("tspan")
                    .attr("x", x + 10)
                    .attr("dy", "1.2em")
                    .text(`rating: ${d.rating}`);
            })
            .on("mouseout", function (_event: any, _d: any) {
                d3.select(this).style("opacity", 1);
                svg.selectAll(".tooltip").remove();
            })
            .transition()
            .duration(3000)

    }, [data])

    useEffect(() => {


        axios.get("https://apiairbook.api8s.com/api/chart/ScatterChart", {
        })
            .then((response: any) => {
                setData(response.data);
            })
            .catch((error: any) => {
                console.error(error);
            });
    }, []);






    return (
        <div className="rounded overflow-hidden shadow-lg border border-gray-300 ml-4 mr-4">

            <div className="flex items-center m-1 justify-between pl-3 mr-3 pb-2 border-b-2 ">
                <div>
                    Rating Vs Runtime of the Shows
                </div>
            </div>


            <div>
                <svg ref={svgRef} width={500} height={500} className="border-black"></svg>
            </div>
        </div>
    )
}

export default ScatterChart