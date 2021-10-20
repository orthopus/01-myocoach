import * as React from 'react';
import useTheme from "@mui/material/styles/useTheme";
import SmoothieComponent, {TimeSeries} from "react-smoothie";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Fab from "@mui/material/Fab";
import TrainingSetup from "./setup/TrainingSetup";
import {Trail} from "../../types/training/Trail";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress"
import {LinearTrailPlotter} from "./trails/plotter/LinearTrailPlotter";
import {StepTrailPlotter} from "./trails/plotter/StepTrailPlotter";
import Stop from "@mui/icons-material/Stop";
import {ApiClient} from "../../services/ApiClient";
import TrailUtils from "../../util/TrailUtils";
import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack";
import styled from "@mui/material/styles/styled";

/*
    MyoCoach frontend training session component
    ============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const Wrap = styled('div')(() => ({
    width: '100%',
    height: "100%",
}));

const TrainingSession: React.FC<{emg0: number, emg1: number, timestamp: number, windowWidth: number, height: number,
    onResponse: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey}> =
    ({emg0, emg1, timestamp, windowWidth, height, onResponse}) => {

        const theme = useTheme();

        const stepTrailPlotter = new StepTrailPlotter();
        const linearTrailPlotter = new LinearTrailPlotter();

        const START_DELAY: number = 5000;

        const DELTA_T = 200;
        const PRECISION = 0.2;

        const chartRef = React.useRef<SmoothieComponent>(null);
        const chartWrapperRef = React.useRef<HTMLDivElement>(null);

        const [pathWidth, setPathWidth] = React.useState(20);

        const [graphHeight, setGraphHeight] = React.useState(height);
        const [graphWidth, setGraphWidth] = React.useState(windowWidth);

        const [selectedTrail, setSelectedTrail] = React.useState<Trail>(undefined);
        const [selectedTrailDuration, setSelectedTrailDuration] = React.useState(0);

        const [emgTS0, setEmgTS0] = React.useState<TimeSeries>(new TimeSeries({}));
        const [emgTS1, setEmgTS1] = React.useState<TimeSeries>(new TimeSeries({}));
        const [pathTS0, setPathTS0] = React.useState<TimeSeries>(new TimeSeries({}));
        const [pathTS1, setPathTS1] = React.useState<TimeSeries>(new TimeSeries({}));

        const [sessionStarted, setSessionStarted] = React.useState(false);
        const [isEmg0In, setIsEmg0In] = React.useState(false);
        const [isEmg1In, setIsEmg1In] = React.useState(false);
        const [startSessionInstant, setStartSessionInstant] = React.useState(-1);
        const [pointNumber, setPointNumber] = React.useState(0);
        const [scoreEmg0, setScoreEmg0] = React.useState(1);
        const [scoreEmg1, setScoreEmg1] = React.useState(1);

        const [totalScore, setTotalScore] = React.useState(-1);

        React.useEffect(() => {
            setGraphHeight(height);
        }, [height])

        React.useEffect(() => {
            if(sessionStarted) {
                if (chartWrapperRef.current != undefined) {
                    const newSpeed = Math.round(10000 / chartWrapperRef.current.clientWidth);
                    setGraphWidth(chartWrapperRef.current.clientWidth);
                    if (chartRef.current != undefined) {
                        // Unfortunately it is not possible to update SmoothieComponent props directly
                        // This workaround seems to work
                        chartRef.current.smoothie.options.millisPerPixel = newSpeed;
                    }
                }
            }
        }, [sessionStarted, windowWidth])
        /*
        As the SmoothComponent is not created at the same time than this component and is destroyed
         when the session ends, we set the speed when the session starts or the windowWidth change
         */

        React.useEffect(() => {
            setSelectedTrailDuration(TrailUtils.getSelectedTrailDuration(selectedTrail))
        }, [selectedTrail])

        React.useEffect(() => {
            if(sessionStarted) {
                if (chartRef.current != undefined) {
                    chartRef.current.smoothie.options.grid.strokeStyle = theme.palette.secondary.main;
                    chartRef.current.smoothie.options.grid.fillStyle = theme.palette.primary.main;
                }
            }
        }, [theme])

        function path0(t: number): number {
            if(TrailUtils.isEmg0Enabled(selectedTrail)) {
                if (selectedTrail.interpolation == 'step') {
                    return stepTrailPlotter.evalPath(t, selectedTrail.pointArray0);
                } else {
                    return linearTrailPlotter.evalPath(t, selectedTrail.pointArray0);
                }
            }
            return 0;
        }

        function path1(t: number): number {
            if(TrailUtils.isEmg1Enabled(selectedTrail)) {
                if (selectedTrail.interpolation == 'step') {
                    return stepTrailPlotter.evalPath(t, selectedTrail.pointArray1);
                } else {
                    return linearTrailPlotter.evalPath(t, selectedTrail.pointArray1);
                }
            }
            return 0;
        }

        function selectTrail(trailId: number) {
            ApiClient.getTrail(trailId).then(res => res.json()).then(json => setSelectedTrail(json));
        }


        function emgIsIn(emg: number, t: number, path: (t: number) => number): boolean {
            return emg <= getMaxPath(DELTA_T, t, path) + pathWidth / 2 && emg >= getMinPath(DELTA_T, t, path) - pathWidth / 2;
        }

        function getMinPath(deltaT: number, t: number, path: (t: number) => number): number {
            if (Math.abs(path(t - deltaT) - path(t + deltaT)) < PRECISION) {
                return path(t);
            } else if (path(t - deltaT) <= path(t + deltaT)) {
                return getMinPath(deltaT / 2, t - deltaT / 2, path);
            } else {
                return getMinPath(deltaT / 2, t + deltaT / 2, path);
            }
        }

        function getMaxPath(deltaT: number, t: number, path: (t: number) => number): number {
            if (Math.abs(path(t - deltaT) - path(t + deltaT)) < PRECISION) {
                return path(t);
            } else if (path(t - deltaT) >= path(t + deltaT)) {
                return getMaxPath(deltaT / 2, t - deltaT / 2, path);
            } else {
                return getMaxPath(deltaT / 2, t + deltaT / 2, path);
            }
        }

        React.useEffect(() => {

            const t = timestamp - startSessionInstant;

            if (TrailUtils.isEmg0Enabled(selectedTrail)) {
                setIsEmg0In(emgIsIn(emg0, t, path0));
                setEmgTS0(prevState => {
                    prevState.dropOldData(timestamp, 1024);
                    prevState.append(timestamp, emg0);
                    return prevState;
                });
            }
            if (TrailUtils.isEmg1Enabled(selectedTrail)) {
                setIsEmg1In(emgIsIn(emg1, t, path1));
                setEmgTS1(prevState => {
                    prevState.dropOldData(timestamp, 1024);
                    prevState.append(timestamp, emg1);
                    return prevState;
                });
            }

            if (selectedTrail != undefined) {
                if (sessionStarted && (timestamp - startSessionInstant > 0) && (timestamp - startSessionInstant < selectedTrailDuration)) {
                    if (TrailUtils.isEmg0Enabled(selectedTrail)) {
                        setScoreEmg0(prevState => {
                            const value = isEmg0In ? 1 : 0;
                            return (prevState * pointNumber + value) / (pointNumber + 1);
                        });
                    }
                    if (TrailUtils.isEmg1Enabled(selectedTrail)) {
                        setScoreEmg1(prevState => {
                            const value = isEmg1In ? 1 : 0;
                            return (prevState * pointNumber + value) / (pointNumber + 1);
                        });
                    }
                    setPointNumber(prevState => {
                        return prevState + 1;
                    });
                }
                if (sessionStarted && (timestamp - startSessionInstant > selectedTrailDuration)) {
                    endSession();
                }
            }
        }, [timestamp])

        function startSession() {
            setPointNumber(0);
            setScoreEmg0(1);
            setScoreEmg1(1);
            setEmgTS0(new TimeSeries({}));

            if(TrailUtils.isEmg0Enabled(selectedTrail)) {
                const timeSeries = new TimeSeries({});
                selectedTrail.pointArray0.forEach(([key, value]) => {
                    timeSeries.append(timestamp + START_DELAY + key, value)
                });
                setPathTS0(timeSeries);
            } else {
                setPathTS0(new TimeSeries({}));
            }
            setEmgTS1(new TimeSeries({}));
            if(TrailUtils.isEmg1Enabled(selectedTrail)) {
                const timeSeries = new TimeSeries({});
                selectedTrail.pointArray1.forEach(([key, value]) => {
                    timeSeries.append(timestamp + START_DELAY + key, value)
                });
                setPathTS1(timeSeries);
            } else {
                setPathTS1(new TimeSeries({}));
            }
            setStartSessionInstant(timestamp + START_DELAY);
            setSessionStarted(true);
        }

        function abortSession() {
            setSessionStarted(false);
        }

        function endSession() {
            if (TrailUtils.isEmg0Enabled(selectedTrail) && TrailUtils.isEmg1Enabled(selectedTrail)) {
                setTotalScore((scoreEmg0 + scoreEmg1)/2);
            } else if (TrailUtils.isEmg0Enabled(selectedTrail)) {
                setTotalScore(scoreEmg0);
            } else if (TrailUtils.isEmg1Enabled(selectedTrail)) {
                setTotalScore(scoreEmg1);
            } else {
                setTotalScore(0);
            }
            setSessionStarted(false);
        }

        function getSeries() {
            if(TrailUtils.isEmg0Enabled(selectedTrail) && TrailUtils.isEmg1Enabled(selectedTrail)) {
                return [
                    {
                        data: pathTS0,
                        strokeStyle: theme.palette.info.light,
                        lineWidth: Math.round(pathWidth * height / 100),
                    },
                    {
                        data: pathTS1,
                        strokeStyle: theme.palette.error.light,
                        lineWidth: Math.round(pathWidth * height / 100),
                    },
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
                ];
            } else if (TrailUtils.isEmg0Enabled(selectedTrail)) {
                return [
                    {
                        data: pathTS0,
                        strokeStyle: theme.palette.info.light,
                        lineWidth: Math.round(pathWidth * height / 100),
                    },
                    {
                        data: emgTS0,
                        strokeStyle: theme.palette.info.main,
                        lineWidth: 2,
                    }
                ];
            } else if (TrailUtils.isEmg1Enabled(selectedTrail)) {
                return [
                    {
                        data: pathTS1,
                        strokeStyle: theme.palette.error.light,
                        lineWidth: Math.round(pathWidth * height / 100),
                    },
                    {
                        data: emgTS1,
                        strokeStyle: theme.palette.error.main,
                        lineWidth: 2,
                    }
                ];
            }
        }

        return (
            <React.Fragment>
                {
                    sessionStarted ?
                        <Box mx={1}>
                            <Box height={graphHeight} position={"relative"}>
                                <React.Fragment>
                                    {
                                        (startSessionInstant > timestamp) ?
                                            <Box position={"absolute"} zIndex={"speedDial"} top={graphHeight / 2 - 56}
                                                 left={graphWidth / 2 - 56}>
                                                <Tooltip title={"Abort"}>
                                                    <Fab style={{
                                                        backgroundColor: theme.palette.secondary.main,
                                                        color: theme.palette.primary.main,
                                                        width: 112,
                                                        height: 112
                                                    }} size={"large"} onClick={abortSession}>
                                                        <Typography variant={"h5"} align={"center"}
                                                                    color={"primary"}>{Math.round((startSessionInstant - timestamp) / 1000)}</Typography>
                                                    </Fab>
                                                </Tooltip>
                                            </Box> :
                                            <Box>
                                                <Box position={"absolute"} zIndex={"speedDial"} top={1} left={1} right={1}>
                                                    <LinearProgress color={"secondary"} variant={"determinate"}
                                                                    value={Math.round(((timestamp - startSessionInstant) / selectedTrailDuration) * 100)} />
                                                </Box>
                                                <Box position={"absolute"} zIndex={"speedDial"} alignItems={"center"} left={"2%"} top={"2%"}>
                                                    <Box m={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                                        <Fab style={{
                                                            backgroundColor: theme.palette.warning.main,
                                                            color: theme.palette.secondary.main,
                                                        }} size={"large"} disabled>
                                                            <Typography variant={"h5"} align={"center"}
                                                                        color={"secondary"}>{Math.round((selectedTrailDuration - (timestamp - startSessionInstant)) / 1000)}</Typography>
                                                        </Fab>
                                                    </Box>
                                                    <Box m={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                                        <Tooltip title={"Abort"}>
                                                            <Fab color={"secondary"} size={"large"} onClick={abortSession}>
                                                                <Stop/>
                                                            </Fab>
                                                        </Tooltip>
                                                    </Box>
                                                    { TrailUtils.isEmg0Enabled(selectedTrail) ?
                                                        <Box m={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                                            {isEmg0In ?
                                                                <Chip style={{backgroundColor: theme.palette.success.main}}
                                                                      label={"EMG0"}/> :
                                                                <Chip style={{backgroundColor: theme.palette.error.main}}
                                                                      label={"EMG0"}/>
                                                            }
                                                        </Box> : null }
                                                    { TrailUtils.isEmg1Enabled(selectedTrail) ?
                                                        <Box m={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                                            {isEmg1In ?
                                                                <Chip style={{backgroundColor: theme.palette.success.main}}
                                                                      label={"EMG1"}/> :
                                                                <Chip style={{backgroundColor: theme.palette.error.main}}
                                                                      label={"EMG1"}/>
                                                            }
                                                        </Box> : null }
                                                </Box>
                                            </Box>
                                    }
                                </React.Fragment>
                                <Wrap ref={chartWrapperRef}>
                                    <SmoothieComponent ref={chartRef}
                                                       grid={{
                                                           strokeStyle: theme.palette.secondary.main,
                                                           fillStyle: theme.palette.primary.main,
                                                           millisPerLine: 0,
                                                           verticalSections: 10
                                                       }}
                                                       responsive
                                                       interpolation={selectedTrail.interpolation}
                                                       height={graphHeight}
                                                       labels={{disabled: true}}
                                                       maxValue={100} minValue={-0.5}
                                                       streamDelay={500 - START_DELAY}
                                                       series={getSeries()}
                                    />
                                </Wrap>
                            </Box>
                        </Box>
                        :
                        <TrainingSetup trail={selectedTrail} onSelectedTrailChanged={selectTrail}
                                       pathWidth={pathWidth} onPathWidthChanged={setPathWidth}
                                       lastScore={totalScore} onApply={startSession} onResponse={onResponse}/>
                }
            </React.Fragment>
        );
    }

export default TrainingSession;