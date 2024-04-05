import BarChart from "./BarChart"
import PieChart from "./PieChart"
import ScatterChart from "./ScatterChart"




function AllChart(FetchGenre:any) {
  return (
    <div>
      
      <div className="grid grid-cols-2 gap-5">

          <div className="w-full mt-3">
          <BarChart/>
          </div>
          <div className="w-full mt-3">
          <PieChart FetchGenre={FetchGenre}/>
          </div>
      </div>
      <div>
      <div className="w-full mt-3">
        <ScatterChart />
      </div>
      </div>
    </div>
  )
}

export default AllChart