import React, {useEffect, useState} from 'react';
import axios from 'axios';
// style
import classes from "./styles/homePage.module.scss"
// images
import background from "../../assets/background.jpg";
import background2 from "../../assets/popcornBackground.jpg";
import noimage from "../../assets/noimage.png";
// components
import Loader from "./components/Loader";
import SearchInput from "./components/SearchInput";
// api
import MovieCard from "./components/MovieCard"
import {baseUrl, IMDBBaseUrl} from "./constant";

const HomePage = () => {
    const [searchInput, setSearchInput] = useState("")
    const [movieName, setMovieName] = useState("")
    const [recommendedMovies, setRecommendedMovies] = useState([])
    const [isSearchOnFocus, setIsSearchOnFocus] = useState(false)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (images && recommendedMovies && (images?.length === recommendedMovies?.length)) {
            if (images.length > 0) {
                setLoading(false)
            }
        }


    }, [images, recommendedMovies])

    const getRecommendation = async (movieName) => {

        setLoading(true);
        await axios.post(`${baseUrl}`, {movie_name: movieName})
            .then((res) => {
                console.log('data of', res.data)
                console.log('1')
                setRecommendedMovies(() => [...res.data])
                console.log('2')
                setTimeout(() => {
                    res.data.forEach((movie, index) => {
                            axios.get(`${IMDBBaseUrl}${movie.title}`)
                                .then((res2) => {
                                    let imageSrc = res2.data.results?.[0].image
                                    if (!imageSrc) {
                                        imageSrc = noimage
                                    }
                                    setImages((images) => [...images, {src: imageSrc,index}])

                                })
                                .catch(() => {
                                    console.log('here')
                                    setImages((images) => [...images, {src: `${noimage}`,index}])

                                })
                        }
                    )

                }, 5000)
            })
            .catch(() => {
                setLoading(false)
            })
    }


    return (


        <div className={classes.container} style={{
            backgroundImage: `url(${background})`,
        }}>
            <div className={classes.search_input_wrapper}>
                <div className={classes.search_input}>
                    <SearchInput
                        onSelect={(name) => {

                            setSearchInput(name);
                            setMovieName(name);
                            setIsSearchOnFocus(false);
                            setRecommendedMovies([])
                            setImages([]);
                            getRecommendation(name);
                        }}
                        isOnFocus={isSearchOnFocus}
                        value={searchInput}
                        placeholder={"Movie name: Inception"}
                        onChange={(input) => {
                            setIsSearchOnFocus(true);
                            setSearchInput(input.target.value)
                        }
                        }/>
                </div>
            </div>
            {!loading ?
                <div>
                    <div className={classes.resault}>
                        Recommendations for: {movieName}
                    </div>
                    <div className={classes.cards}>
                    {recommendedMovies?.map((movie, index) => <MovieCard key={movie.title}
                                                                         index={index}
                                                                         title={movie.title}
                                                                         genres={movie.genres}
                                                                         image={images.find((image)=>image.index === index).src}/>
                    )}
                    </div>

                </div> :
                <div className={classes.loader}>
                    <Loader/>
                </div>}
        </div>

    )

};

export default HomePage;
