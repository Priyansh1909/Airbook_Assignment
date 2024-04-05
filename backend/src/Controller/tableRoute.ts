import express from 'express';
import { connect } from '../db';
import { RowDataPacket } from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';





export const router = express.Router();



router.get("/", async (req, res) => {

    try {



        console.log(req.query)
        const { genre, Age, Rating } = req.query
        console.log("rd", genre)

        // Making the Query and if there is Genre Filter then it will pick Genre
        let Query = `SELECT *
                FROM (
                SELECT *
                FROM airbook.netflix
                
            `
        if (genre != "") {
            Query += `WHERE genre LIKE '%${genre}%' `
        }

        Query += `
    ) AS sorted_votes
    ORDER BY certificate ${Age}, rating ${Rating}`
        const conn = await connect();

        const TableData = await conn.query(Query);

        await conn.end()

        res.json(TableData[0]);
    } catch (error) {
        console.log(error)
        res.status(400).json("Server Error")

    }

})

router.get("/Allgenre", async (req, res) => {


    try {



        const conn = await connect();
        const Data = await conn.query("SELECT genre FROM airbook.netflix");
        const GenreData: { genre: string }[] = Data[0] as { genre: string }[];


        const genreCounts: { [genre: string]: number } = {};

        GenreData.forEach(element => {
            const genres = element.genre.split(',').map((genre: string) => genre.trim());
            genres.forEach((genre: string) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;

            });
        });


        const genreArray = Object.keys(genreCounts).map(genre => ({ genre, count: genreCounts[genre] }));

        genreArray.sort((a, b) => b.count - a.count);

        // Take top 5 genres
        const topGenres = genreArray.slice(0, 5);

        // Calculate the count of all other genres
        const othersCount = genreArray.slice(5).reduce((acc, curr) => acc + curr.count, 0);

        // Create the "Others" entry
        const others = { genre: "Others", count: othersCount };

        const Top5Genre = [...topGenres, others]

        console.log(Top5Genre)


        await conn.end()



        res.status(200).json({ genreArray: genreArray, TopGenre: Top5Genre })
    } catch (error) {
        console.log(error)
        res.status(400).json("Server Error")

    }



})




