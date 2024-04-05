import React, { useEffect, useRef, useState ,SVGProps} from "react";
import * as d3 from "d3"; 


interface CustomSvg extends SVGProps<SVGSVGElement>{
    svfRef?:React.MutableRefObject<SVGSVGElement> | null;
}

function Chart() {

    const [data] = useState([33,56,88,99,54,23,45,34,100,345,345])
    const svgRef  = useRef<SVGSVGElement>(null)


    useEffect(()=>{

        // Width n height
        const width = 700;
        const height = 400;

        /// thsi will crete the box based on width n height
        const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background", '#d3d3d3')
        .style("margin-top", '50')
        .style("margin-left", '50')
        .style("overflow","visible")


        /// for the Xscale how to distrubite
        const Xscale = d3.scaleLinear()
        .domain([0,data.length - 1])
        .range([0,width])

        /// for the yscale how to distrubite

        const Yscale = d3.scaleLinear()
        .domain([0,height])
        .range([height,0])

        /// this will generate Line 
        const GenerateScale = d3.line()
        .x((d,i)=> Xscale(i))
        .y(Yscale)
        .curve(d3.curveCardinal);


                // xaxis names
                const Xaxis = d3.axisBottom(Xscale)
                .ticks(data.length)
                .tickFormat(i => i + 1)
        
        
                const Yaxis = d3.axisLeft(Yscale)
                .ticks(data.length)

        
                svg.append('g')
                .call(Xaxis)
                .attr("transform", `translate(0, ${height})`)
        
                svg.append('g')
                .call(Yaxis)


        // the line based on it data and generate line 
        svg.selectAll('.line')
        .data([data])
        .join('path')
        .attr('d', d =>GenerateScale(d))
        .attr("fill", "none")
        .attr("stroke", "black")


        



        

    },[data])

  return (
    <div className="charts">
        <svg ref={svgRef}></svg>
    </div>
  )
}

export default Chart