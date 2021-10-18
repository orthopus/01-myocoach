import * as React from "react";
import MyoGauge from "./MyoGauge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import rafSchd from "raf-schd";
import useTheme from "@mui/material/styles/useTheme";

/*
    MyoCoach frontend dashboard component
    =====================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const Dashboard: React.FC<{measure0: number, measure1: number, height: number}> =
    ({ measure0, measure1, height }) => {

        const theme = useTheme();

        const labelRef0 = React.useRef<HTMLDivElement>(null);
        const labelRef1 = React.useRef<HTMLDivElement>(null);

        const [graphHeight, setGraphHeight] = React.useState(height);

        const [measure0State, setMeasure0State] = React.useState(measure0);
        const [measure1State, setMeasure1State] = React.useState(measure1);
        const schedule = rafSchd(measuresUpdate);

        React.useEffect(() => {
            setGraphHeight(height - labelRef0.current.clientHeight - labelRef1.current.clientHeight - 4 * parseInt(theme.spacing(2), 10));
        }, [labelRef0.current, labelRef1.current, height])

        React.useEffect(() => {
            schedule();
        }, [measure0, measure1])

        function measuresUpdate() {
            setMeasure0State(measure0);
            setMeasure1State(measure1);
        }

        return (<Box display={"flex"} justifyContent={"center"} flexDirection={"row"}>
            <Box sx={{ height: graphHeight }} mt={2}>
                <Box sx={{ height: "25%" }}><Typography variant={"overline"} align={"right"}>100%</Typography></Box>
                <Box sx={{ height: "25%" }}><Typography variant={"overline"} align={"right"}>50%</Typography></Box>
                <Box sx={{ height: "25%" }}><Typography variant={"overline"} align={"right"}>0%</Typography></Box>
                <Box sx={{ height: "25%" }}><Typography variant={"overline"} align={"right"}>50%</Typography></Box>
                <Box><Typography variant={"overline"}>100%</Typography></Box>
            </Box>
            <Box height={graphHeight} mt={2}>
                <Box sx={{ height: "25%" }}>
                    <svg height={"2"} width={"20"}><line x1={"0"} x2={"20"} style={{stroke: "gray",strokeWidth: 3}} /></svg>
                </Box>
                <Box sx={{ height: "25%" }}>
                    <svg height={"2"} width={"20"}><line x1={"0"} x2={"20"} style={{stroke: "gray",strokeWidth: 3}} /></svg>
                </Box>
                <Box sx={{ height: "25%" }}>
                    <svg height={"2"} width={"20"}><line x1={"0"} x2={"20"} style={{stroke: "gray",strokeWidth: 3}} /></svg>
                </Box>
                <Box sx={{ height: "25%" }}>
                    <svg height={"2"} width={"20"}><line x1={"0"} x2={"20"} style={{stroke: "gray",strokeWidth: 3}} /></svg>
                </Box>
                <Box>
                    <svg height={"2"} width={"20"}><line x1={"0"} x2={"20"} style={{stroke: "gray",strokeWidth: 3}} /></svg>
                </Box>
            </Box>
            <Box pl={0}>
                <Typography ref={labelRef1} variant={"overline"}>EMG1</Typography>
                <MyoGauge measure={measure1State} height={graphHeight/2}/>
                <MyoGauge measure={measure0State} height={graphHeight/2} reversed/>
                <Typography ref={labelRef0} variant={"overline"}>EMG0</Typography>
            </Box>
        </Box>);
    }

export default Dashboard;