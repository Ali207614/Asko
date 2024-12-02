import React from "react";
import SpinnerStyle from "./spinnerStyle";
// import 'bootstrap/dist/css/bootstrap.min.css';
const Spinner = () => {
    return (

        <SpinnerStyle>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </SpinnerStyle>
    );
};

export default Spinner;