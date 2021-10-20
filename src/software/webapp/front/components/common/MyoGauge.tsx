import * as React from "react";
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

/*
    MyoCoach Gauge component for dashboard
    ======================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const NormalGaugeBackground = styled(Box)(({ theme}) => ({
    backgroundColor: theme.palette.error.light,
    width: 30,
    display: "flex",
    alignItems: "flex-end"
}));

const NormalGaugeForeground = styled(Box)(({ theme}) => ({
    transition: "height 200ms ease-out",
    backgroundColor: theme.palette.error.main,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%"
}));

const ReversedGaugeBackground = styled(Box)(({ theme}) => ({
    backgroundColor: theme.palette.info.light,
    width: 30,
    display: "flex",
    alignItems: "flex-start"
}));

const ReversedGaugeForeground = styled(Box)(({ theme}) => ({
    transition: "height 200ms ease-out",
    backgroundColor: theme.palette.info.main,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: "100%"
}));

const MyoGauge: React.FC<{ measure: number, height: number, reversed?: boolean }> =
    ({measure, height, reversed}) => {

        return (
            <React.Fragment>
                {
                    reversed == undefined ?
                        <NormalGaugeBackground sx={{ height: height }}>
                            <NormalGaugeForeground sx={{ height: `${measure}%`}}/>
                        </NormalGaugeBackground> :
                        <ReversedGaugeBackground sx={{ height: height }}>
                            <ReversedGaugeForeground sx={{ height: `${measure}%`}}/>
                        </ReversedGaugeBackground>
                }
            </React.Fragment>
        );
    }

export default MyoGauge;