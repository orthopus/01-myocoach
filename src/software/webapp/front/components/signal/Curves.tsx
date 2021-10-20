import * as React from "react";
import SmoothieComponent, {TimeSeries} from "react-smoothie";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import styled from "@mui/material/styles/styled";

const Wrap = styled('div')(() => ({
    width: '100%',
    height: "100%",
}));

/*
    MyoCoach frontend signal visualisation component
    ================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const Curves: React.FC<{emg0: number, emg1: number, timestamp: number, windowWidth: number, height: number}> =
    ({emg0, emg1, timestamp, windowWidth, height}) => {

        const theme = useTheme();
        const chartRef = React.useRef<SmoothieComponent>(null);
        const chartWrapperRef = React.useRef<HTMLDivElement>(null);
        const wrapperId = "chartWrapper";

        const [graphHeight, setGraphHeight] = React.useState(height);

        const [emgTS0, setEmgTS0] = React.useState<TimeSeries>(new TimeSeries({}));
        const [emgTS1, setEmgTS1] = React.useState<TimeSeries>(new TimeSeries({}));

        React.useEffect(() => {
            measuresUpdate();
        }, [timestamp])

        React.useEffect(() => {
            setGraphHeight(height);
        }, [height])

        React.useEffect(() => {
            if (chartWrapperRef.current != undefined) {
                const newSpeed = Math.round(10000/chartWrapperRef.current.clientWidth);
                console.log(`new speed : ${newSpeed}`);
                if (chartRef.current != undefined) {
                    // Unfortunately it is not possible to update SmoothieComponent props directly
                    // This workaround seems to work
                    chartRef.current.smoothie.options.millisPerPixel = newSpeed;
                }
            }
        }, [windowWidth])

        React.useEffect(() => {
            if (chartRef.current != undefined) {
                chartRef.current.smoothie.options.grid.strokeStyle = theme.palette.secondary.main;
                chartRef.current.smoothie.options.grid.fillStyle = theme.palette.primary.main;
            }
        }, [theme])

        function measuresUpdate() {
            setEmgTS0(prevState => {
                prevState.append(timestamp, emg0);
                return prevState;
            });
            setEmgTS1(prevState => {
                prevState.append(timestamp, emg1);
                return prevState;
            });
        }

        return (
            <Box height={graphHeight} mx={1}>
                <Wrap id={wrapperId} ref={chartWrapperRef}>
                    <SmoothieComponent ref={chartRef} grid={{strokeStyle: theme.palette.secondary.main,
                        fillStyle: theme.palette.primary.main,
                        millisPerLine: 0, verticalSections: 10}}
                                       responsive
                                       interpolation={"linear"}
                                       height={graphHeight}
                                       labels={{disabled: true}}
                                       maxValue={100} minValue={-0.5}
                                       streamDelay={0}
                                       series={[
                                           {
                                               data: emgTS0,
                                               strokeStyle: theme.palette.info.main,
                                               lineWidth: 2,
                                           },
                                           {
                                               data: emgTS1,
                                               strokeStyle: theme.palette.error.main,
                                               lineWidth: 2,
                                           }
                                       ]}
                    />
                </Wrap>
            </Box>
        );
    }

export default Curves;