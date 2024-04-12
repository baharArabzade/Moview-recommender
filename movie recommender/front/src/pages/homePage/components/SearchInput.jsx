import React,{useMemo} from "react";
import Highlighter from "react-highlight-words";
// styles
import classes from "../styles/searchInput.module.scss";
// icons
import SearchIcon from "../../../assets/icons/SearchIcon";
import ClearFiledIcon from "../../../assets/icons/ClearFieldIcon";
// constant
import {all_Movies} from "../constant";

const getSearchList = (searchInput) => {
    return all_Movies.filter((movie) => movie.toLowerCase().includes(searchInput.toLowerCase()))
}

const SearchInput = ({
                         isOnFocus,
                         isLtr,
                         placeholder,
                         name,
                         value,
                         onChange,
                         search,
                         onFocus,
                         onBlur,
                         enableClear,
                         onClear,
                        onSelect,
                     }) => (
    <div className={classes.search_wrapper}>

        <div className={`${classes.input_wrapper} ${isLtr && classes.ltr}`}>
            <div className={`${classes.icon} ${!search && classes.normal_cursor}`} onClick={() => search()}>
                <SearchIcon/>
            </div>
            <input
                className={`${classes.input} ${isLtr && classes.ltr}`}
                name={name}
                value={value}
                placeholder={placeholder}
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
            />
            {
                enableClear && value !== "" && (
                    <div className={classes.icon} onClick={() => onClear()}>
                        <ClearFiledIcon/>
                    </div>
                )
            }
        </div>
        {value.length > 2 && isOnFocus &&
        <div className={classes.search_recommendations}>
            {getSearchList(value).map((findItem,index) =>
                <div className={classes.search_item} key={`${findItem}${index}`} onClick={()=>onSelect(findItem)}>
                    <Highlighter
                        className={`${classes.item_text} ${isLtr && classes.ltr}`}
                        highlightClassName={classes.highlight_text}
                        searchWords={[value]}
                        textToHighlight={findItem}
                        autoEscape
                    />
                </div>)}
            {getSearchList(value).length === 0 && <div className={classes.no_result}>sorry no resault</div>}

        </div>
        }
    </div>

);

export default SearchInput;
