import React from 'react';
// style
import classes from "../styles/movieCard.module.scss"

const MovieCard = ({
                       releaseDate,
                       index,
                       genres,
                       image,
                       title,
                       descriptions
                   }) => {
    let allGenres = genres;
    allGenres = allGenres.slice(1,allGenres.length-2)
    allGenres = allGenres.replaceAll("'","")
    return (
        <li>
            <a href="" className={classes.card}>
                <img src={image} className={classes.card__image} alt=""/>
                <div className={classes.card__overlay}>
                    <div className={classes.card__header}>
                        <svg className={classes.card__arc} xmlns="http://www.w3.org/2000/svg">
                            <path/>
                        </svg>
                        <div className={classes.card__thumb}>{index + 1}</div>
                        <div>
                            <h3 className={classes.card__title}>{title}</h3>
                        </div>
                    </div>
                    <p className={classes.card__description}><strong>Genres:</strong> {allGenres}</p>
                </div>
            </a>
        </li>
    );
};

export default MovieCard;
