import React from "react";
// loader
import { Puff } from "svg-loaders-react";
// styles
import classes from "../styles/loader.module.scss";

const Loader = () => (
    <div className={classes.loading_wrapper}>
        <Puff stroke="#1f1f1f" strokeOpacity=".125" />
    </div>
);

export default Loader;
