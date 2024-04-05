import {useEffect,useState} from "react"
import './App.css'
import Header from './components/Header'
import AllChart from "./components/AllChart"
import Table from './components/Table'
import axios from "axios"




function App() {
  const [FetchGenre, setFetchGenre] =  useState([])


  useEffect(()=>{

    axios.get("https://apiairbook.api8s.com/api/table/Allgenre")
    .then(response => {
        setFetchGenre(response.data);
        console.log(response.data)
    })
    .catch((error: any) => {
        console.log(error)
    });
  },[])

  

  return (
    <>
    <Header/>
    <AllChart FetchGenre={FetchGenre}/>
    <Table FetchGenre={FetchGenre}/>
    <footer  className="mb-12"/>
    </>
  )
}

export default App
