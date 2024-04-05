import express from 'express';
import { connect } from '../db';







export const router = express.Router();


router.get('/barchart', async(req,res)=>{
    try {
        const {rating} = req.query 
        console.log("thsi is rating",rating)


 

    let Query = `SELECT certificate, COUNT(*) AS total_count FROM airbook.netflix WHERE rating >= ${rating || 0} GROUP BY certificate`
        const conn = await connect();

        const TableData = await conn.query(Query);

        await conn.end()
        console.log("this is new data", TableData[0])

        res.json(TableData[0]);
        
    } catch (error) {
        console.log(error)
        res.status(400).json("Server Error")
        
    }
})


router.get('/ScatterChart', async(req,res)=>{
    try {

 

    let Query = `SELECT * FROM airbook.netflix`
        const conn = await connect();

        const TableData = await conn.query(Query);

        await conn.end()
        console.log("this is new data", TableData[0])

        res.json(TableData[0]);
        
    } catch (error) {
        console.log(error)
        res.status(400).json("Server Error")
        
    }
})
