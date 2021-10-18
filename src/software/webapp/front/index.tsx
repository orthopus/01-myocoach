import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {SnackbarProvider} from "notistack";

/*
    MyoCoach frontend main component renderer
    =========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

ReactDOM.render(
    <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>
    </BrowserRouter>,
    document.getElementById("root")
);