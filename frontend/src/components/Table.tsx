import { useEffect, useState, useRef } from "react"
import axios from "axios"



function Table({ FetchGenre }: any) {

    const [data, setData] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [Age, SetAge] = useState("");
    const [Rating, SetRating] = useState("");

    // Pagination
    const [CurrentPage, SetCurrentPage] = useState(1)
    const DataPerPage = 10;
    const FirstItemPerPage = (CurrentPage - 1) * DataPerPage;
    const LastItemPerPage = CurrentPage * DataPerPage;
    const DataRecords = data.slice(FirstItemPerPage, LastItemPerPage);
    const numberOfPage = Math.ceil(data.length / DataPerPage)

    const GenreValue = useRef<HTMLSelectElement>(null);
    const AgeValue = useRef<any>(localStorage.getItem('AgeValue') || 'DESC')
    const RatingValue = useRef<any>(localStorage.getItem('RatingValue') || 'DESC')

    const handlesubmit = () => {
        const genreIs = GenreValue.current?.value
        console.log(genreIs, "value")
        localStorage.setItem("genreValue", genreIs || "")
        setSelectedGenre(genreIs || "")
        SetCurrentPage(1)
    }

    const toggleAgeOrder = () => {
        AgeValue.current = AgeValue.current === 'ASC' ? 'DESC' : 'ASC';
        localStorage.setItem('AgeValue', AgeValue.current);
        SetAge(AgeValue.current === 'ASC' ? 'DESC' : 'ASC')
        console.log("heelo", AgeValue.current)
    };

    const toggleRatingOrder = () => {
        RatingValue.current = RatingValue.current === 'ASC' ? 'DESC' : 'ASC';
        localStorage.setItem('RatingValue', RatingValue.current);
        SetRating(RatingValue.current === 'ASC' ? 'DESC' : 'ASC')
        console.log("heelo", RatingValue.current)
    };



    useEffect(() => {
        const storedGenre = localStorage.getItem("genreValue");
        if (storedGenre) {
            setSelectedGenre(storedGenre);
        }

        axios.get("https://apiairbook.api8s.com/api/table", {
            params: {
                genre: storedGenre,
                Age: AgeValue.current === 'ASC' ? 'ASC' : 'DESC',
                Rating: RatingValue.current === 'ASC' ? 'ASC' : 'DESC'

            }
        })
            .then(response => {
                setData(response.data);
                // console.log(response.data)
            })
            .catch((error: any) => {
                console.log(error)
            });



    }, []);

    useEffect(() => {

        axios.get("https://apiairbook.api8s.com/api/table", {
            params: {
                genre: selectedGenre,
                Age: AgeValue.current === 'ASC' ? 'ASC' : 'DESC',
                Rating: RatingValue.current === 'ASC' ? 'ASC' : 'DESC'

            }
        })
            .then(response => {
                setData(response.data);
            })
            .catch((error: any) => {
                console.log(error)
            });




    }, [selectedGenre, Age, Rating])


    const prevPage = () => {
        if (CurrentPage > 1) {
            SetCurrentPage(CurrentPage - 1);
        }
    };

    const NextPage = () => {
        if (CurrentPage < numberOfPage) {
            SetCurrentPage(CurrentPage + 1);
        }
    };

    const changepage = (page: number) => {
        if (page >= 1 && page <= numberOfPage) {
            SetCurrentPage(page);
        }

    }

    return (
        <div className="tablediv  mt-10 ml-4 mr-4  rounded overflow-hidden shadow-lg border border-gray-300 p-4">

            <div className="text-center m-2 font-semibold">
                List Of Shows Based on Votes
            </div>

            <div className="mt-4 mb-4">
                <label htmlFor="rating" className="mr-2"> Genre :</label>
                <select className="border border-gray-300 rounded-md py-1 px-2 bg-white text-gray-700 focus:outline-none focus:border-blue-500" ref={GenreValue} value={selectedGenre} onChange={() => handlesubmit()}>
                    <option value="">All</option>
                    {
                        FetchGenre?.genreArray?.map((item: any) => {

                            return (
                                <option value={item.genre}>{item.genre}</option>
                            )
                        })
                    }


                </select>
            </div>

            <table className="w-full">
                <thead className="bd-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left ">Title</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left w-52">Genre</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left w-40">Age Restriction  <span className="hover:bg-gray-300 rounded-xl" ref={AgeValue} onClick={toggleAgeOrder}><i className={`fa fa-fw fa-sort ${AgeValue.current === 'ASC' ? 'fa-sort-asc' : 'fa-sort-desc'} `}></i></span></th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left w-40">Rating <span className="hover:bg-gray-300 rounded-xl"><i className={`fa fa-fw fa-sort ${RatingValue.current === 'ASC' ? 'fa-sort-asc' : 'fa-sort-desc'} `} ref={RatingValue} onClick={toggleRatingOrder}></i></span></th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left w-40">Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        DataRecords.map((item: any, i) => {
                            // console.log("thsi is item" , i)
                            const oddeven = i % 2
                            // console.log("oddeven", oddeven)
                            const bg = oddeven == 0 ? "bg-white" : "bg-gray-50"
                            return (
                                <tr className={`${bg}`} key={item.title}>
                                    <td className="p-3 text-sm text-gray-700 tracking-wide text-left ">{item.title}</td>
                                    <td className="p-3 text-sm text-gray-700 tracking-wide text-left w-52">{item.genre}</td>
                                    <td className="p-3 text-sm text-gray-700 tracking-wide text-left w-40">{item.certificate}</td>
                                    <td className="p-3 text-sm text-gray-700 tracking-wide text-left w-40">{item.rating}</td>
                                    <td className="p-3 text-sm text-gray-700 tracking-wide text-left w-40">{item.votes}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>
            <nav>
                <ul className="flex justify-center m-4">
                    <li>
                        <button
                            className={`border border-gray-300 rounded-md px-3 py-1 mr-2 ${CurrentPage === 1 ? "bg-gray-200" : ""
                                }`}
                            onClick={prevPage}
                            disabled={CurrentPage === 1}
                        >
                            Prev
                        </button>
                    </li>
                    {[...Array(numberOfPage)].map((_, index: number) => (
                        <li key={index}>
                            <button
                                className={`border border-gray-300 rounded-md px-3 py-1 mx-1 ${CurrentPage === index + 1
                                        ? "bg-gray-200"
                                        : ""
                                    }`}
                                onClick={() => changepage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            className={`border border-gray-300 rounded-md px-3 py-1 ml-2 ${CurrentPage === numberOfPage
                                    ? "bg-gray-200"
                                    : ""
                                }`}
                            onClick={NextPage}
                            disabled={CurrentPage === numberOfPage}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>

        </div>
    )
}

export default Table