import express from 'express';
import cors from "cors";
import {router as tableRoute} from "./Controller/tableRoute";
import {router as ChartsRoute} from "./Controller/chartsRoute";

const app = express()

app.use(cors());


app.get("/",(req,res)=>{
    res.send("Hello World proais")
})

app.use("/api/table/",tableRoute)
app.use("/api/chart/",ChartsRoute)




app.listen(3000,()=>{
    console.log("Server Started on Port 3000")
})
