import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios"

interface CertificateCount {
    certificate: string;
    total_count: number;
  }

function BarChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data,setData] = useState<CertificateCount []>([])
  const [selectedRating, setSelectedRating] = useState(""); 
  const RatingValue = useRef<HTMLSelectElement>(null);

  const handlesubmit = ()=>{
    const RatingIs = RatingValue.current?.value
    console.log(RatingIs, "value")
    localStorage.setItem("RatingValue", RatingIs || "")
    setSelectedRating(RatingIs || "")
}

useEffect(() => {
  const storedRating = localStorage.getItem("RatingValue") || ""; 
  setSelectedRating(storedRating);


  axios.get("https://apiairbook.api8s.com/api/chart/barchart", {
    params: { rating: storedRating } 
  })
  .then((response: any) => {
    setData(response.data);
  })
  .catch((error: any) => {
    console.error(error);
  });
}, []);

  useEffect(()=>{

     axios.get("https://apiairbook.api8s.com/api/chart/barchart",{
        params:{
            rating:selectedRating
        }
     })
     .then((response:any)=>{
        setData(response.data)

     }).catch((error:any)=>{
      console.log(error)
     })

  },[selectedRating])
  

  useEffect(()=>{

    const parentDiv = svgRef.current?.parentElement;

    const parentWidth = parentDiv?.clientWidth || 900 ;


    const margin = {top: 30, right: 30, bottom: 100, left: 60}
    const width = parentWidth - margin.left - margin.right
    const height = 350 - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    .attr("width",width)
    .attr("height", height)
    .style("overflow","visible")
    .style("margin", "60")


    svg.selectAll("*").remove();

    
    
    if(data.length > 0){
      // Xaxis 
     const Xscale =d3.scaleBand()
     .range ([0, width])
     .domain(data.map((d)=>d.certificate))
     .padding(0.4)

     svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(Xscale))
            .selectAll("text")
            .style("text-anchor", "center") 
            .transition()
            .duration(3000);;

    svg.append("text")
        .text("Age Restriction Shows")
        .style("font-size", "12")
        .attr("transform", "translate("+ ((width - margin.left - margin.right - 10)/ 2)+", "+ (height + 40)  +  ")")
        .transition()
        .duration(3000);
   

    // Yaxis 
    const MaxCount = d3.max(data,d=>d.total_count) || 0
     const Yscale = d3.scaleLinear().range([height,0]).domain([0,MaxCount + 10 ])
     svg.append("g").call(d3.axisLeft(Yscale)) .transition()
     .duration(3000);

     svg.append("text")
     .text("Number of Shows Per Age")
     .attr("transform", "translate("+ (30 - margin.left)+", "+ (height)/1.2  +  ")rotate(-90)")
     .style("font-size", "12")
     .transition()
     .duration(3000);

     

     //  Creating Bar

     svg.selectAll("mybars")
     .data(data)
     .enter()
     .append('rect')
     .attr('x', (d)=>{return Xscale(d.certificate) || ""})
     .attr("width", Xscale.bandwidth())
     .attr('y', height)
     .attr("height", 0) 
     .attr("fill", "#69b3a2")
     .on("mouseover", function (_event:any, d) {
      d3.select(this).style("opacity", 0.8); 
      // Tooltip
      const tooltip = svg.append("g")
        .attr("class", "tooltip")
      tooltip.append("rect")
        .attr("width", 100)
        .attr("height", 40)
        .attr("fill", "#8e8e8e")
        .style("opacity", 0.8);
      tooltip.append("text")
        .attr("x", 50)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d.total_count);
      tooltip.attr("transform", "translate(" + (Xscale(d.certificate)|| 0) + "," + (Yscale(d.total_count) - 45) + ")")
    })
    .on("mouseout", function (_event:any, _d:any) {
      d3.select(this).style("opacity", 1); 
      svg.selectAll(".tooltip").remove(); 
    })
     .transition()
     .duration(3000)
     .attr('y',(d)=>{return Yscale(d.total_count) || 0})
     .attr("height", function(d) { return height - Yscale(d.total_count) - 1; })


    }





  },[data])

  return (
    <div className="rounded overflow-hidden shadow-lg border border-gray-300 ml-4 ">

<div className="flex items-center m-1 justify-between pl-3 pb-2 border-b-2 ">
  <div> 
    Number of Show based upto  Age Restriction
  </div>
  <div>

  <label htmlFor="rating" className="mr-2"> Filter Rating:</label>
  <select 
    id="rating"
    className="border border-gray-300 rounded-md py-1 px-2 bg-white text-gray-700 focus:outline-none focus:border-blue-500"
    ref={RatingValue} 
    value={selectedRating} 
    onChange={handlesubmit}
  >
    <option value="0.0">All</option>
    <option value="5.0">5 and above</option>
    <option value="6.0">6 and above</option>
    <option value="7.0">7 and above</option>
    <option value="8.0">8 and above</option>
  </select>
  </div>

</div>


        <div>
            <svg ref={svgRef} width={500} height={500} className="border-black"></svg>
        </div>
    </div>
  )
}

export default BarChart