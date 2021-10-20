import * as React from "react";
import {socket} from "./services/socket";
import Dashboard from "./components/common/Dashboard";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import LightTheme from "./themes/LightTheme";
import DarkTheme from "./themes/DarkTheme";
import {Route, Switch} from "react-router";
import Settings from "./components/settings/Settings";
import GameWrapper from "./components/games/GameWrapper";
import Box from "@mui/material/Box";
import About from "./components/about/About";
import TrainingSession from "./components/training/TrainingSession";
import Curves from "./components/signal/Curves";
import rafSchd from "raf-schd";
import {useSnackbar, VariantType} from "notistack";
import {SystemEventNotification} from "./types/common/SystemEventNotification";
import styled from "@mui/material/styles/styled";
import DesktopAppBar from "./components/common/DesktopAppBar";
import MobileDrawer from "./components/common/MobileDrawer";
import useTheme from "@mui/material/styles/useTheme";
import {ApiClient} from "./services/ApiClient";

/*
    MyoCoach frontend main component
    ================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const Root = styled('div')(() => ({
    display: 'flex',
}));

const AppBarWrapper = styled('div')(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const MobileDrawerWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

const ContentWrapper = styled('main')(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
}));

const ToolbarWrapper = styled('div')(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

function useWindowDimensions() {
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

    const updateWidthAndHeight = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    };

    React.useEffect(() => {
        window.addEventListener("resize", updateWidthAndHeight);
        return () => window.removeEventListener("resize", updateWidthAndHeight);
    });

    return {
        windowWidth,
        windowHeight,
    }
}

const App: React.FC = () => {

    const theme = useTheme();

    const { windowWidth, windowHeight } = useWindowDimensions();

    const toolbarRef = React.useRef(null);

    const [gameList, setGameList] = React.useState<Array<GameDescription>>([]);
    const [contentHeight, setContentHeight] = React.useState(windowHeight);
    const [serverConnected, setServerConnected] = React.useState(true);
    const [boardConnected, setBoardConnected] = React.useState(true);
    const [emg0Measure, setEmg0Measure] = React.useState(0);
    const [emg1Measure, setEmg1Measure] = React.useState(0);
    const [timestamp, setTimestamp] = React.useState(0);
    const [timestampDiff, setTimestampDiff] = React.useState(0);

    const schedule = rafSchd(measuresUpdate);
    const { enqueueSnackbar } = useSnackbar();
    const clientMessage: String = "Hello server !";

    const isDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = React.useState(isDarkMedia.matches);

    isDarkMedia.addListener(() => {
        setDarkMode(isDarkMedia.matches);
    });

    React.useEffect(() => {
        socket.on('connect', function() {
            setServerConnected(true);
            setBoardConnected(true);
            socket.emit('client_response', { data: clientMessage });
        });
        socket.on('disconnect', function() {
            setServerConnected(false);
            setBoardConnected(false);
            setTimestampDiff(0);
        });
        socket.on('server_response', function(payload) { schedule(payload) });
        socket.on('server_event', function(payload) { processSystemEventNotification(payload) });
        socket.on('board_response', function(message) {
            if (message.data == "false") {
                setBoardConnected(false);
            } else {
                setBoardConnected(true);
            }
        });
        ApiClient.getGameList().then(res => res.json()).then(json => setGameList(json));
    }, []);

    React.useEffect(() => {
        if(timestamp != 0 && timestampDiff == 0) {
            setTimestampDiffAction(timestamp);
        }
    }, [timestamp]);

    // windowWidth changes may have an effect on contentHeight
    // because depending on its current value the toolbar may be displayed or not
    React.useEffect(() => {
        const newContentHeight = windowHeight - toolbarRef.current.clientHeight - 2 * parseInt(theme.spacing(3), 10);
        setContentHeight(newContentHeight);
    }, [windowWidth, windowHeight]);

    function processSystemEventNotification(notification: SystemEventNotification) {
        const variant: VariantType = 'info';
        switch (notification.type) {
            case 'set_system_time':
                setTimestampDiffAction(notification.system_timestamp);
                const systemDateTime: Date = new Date(notification.system_timestamp);
                const notificationMessage =
                    `${notification.message} The system datetime is now : ${systemDateTime.toLocaleString()}`
                enqueueSnackbar(notificationMessage, {variant});
                break;
            default:
                enqueueSnackbar(notification.message, {variant});
                break;
        }
    }

    function measuresUpdate(message: any) {
        setEmg0Measure(message.data[0]);
        setEmg1Measure(message.data[1]);
        setTimestamp(message.data[2]);
    }

    function handleToggleDarkMode() {
        setDarkMode((prevState) => !prevState);
    }

    function setTimestampDiffAction(timestamp: number) {
        const newTimestampDiff: number = Date.now() - timestamp;
        setTimestampDiff(newTimestampDiff);
    }

    function handleToggleFullscreen() {
        if(document.fullscreenEnabled) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => console.log("set fullscreen mode"));
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(() => console.log("exited fullscreen mode"));
                }
            }
        }
    }

    return (<ThemeProvider theme={darkMode ? DarkTheme : LightTheme}>
        <Root>
            <CssBaseline/>
            <AppBarWrapper>
                <DesktopAppBar gameList={gameList} serverConnected={serverConnected} sensorsConnected={boardConnected}
                               onToggleFullscreenEvent={handleToggleFullscreen}
                               onToggleDarkModeEvent={handleToggleDarkMode}/>
            </AppBarWrapper>
            <MobileDrawerWrapper>
                <MobileDrawer gameList={gameList} serverConnected={serverConnected} sensorsConnected={boardConnected}
                              onToggleFullscreenEvent={handleToggleFullscreen}
                              onToggleDarkModeEvent={handleToggleDarkMode}/>
            </MobileDrawerWrapper>
            <ContentWrapper>
                <ToolbarWrapper ref={toolbarRef} />
                <Box sx={{display: 'flex', justifyContent: 'start-flex'}}>
                    <Box position={"fixed"}>
                        <Dashboard measure0={emg0Measure} measure1={emg1Measure} height={contentHeight}/>
                    </Box>
                    <Box sx={{display: 'flex', flexGrow: 1, minHeight: contentHeight, alignItems: 'center'}}>
                        <Box sx={{flexGrow: 1}} ml={12}>
                            <Switch>
                                <Route key={"/about"} path={"/about"} component={About}/>
                                <Route key={"/settings"} path={"/settings"} render={() =>
                                    <Settings serverConnected={serverConnected}
                                              boardConnected={boardConnected}
                                              onResponse={enqueueSnackbar}/>}/>
                                <Route exact key={"/training"} path={"/training"}
                                       render={() => <TrainingSession emg0={emg0Measure} emg1={emg1Measure}
                                                                      timestamp={timestamp + timestampDiff}
                                                                      windowWidth={windowWidth}
                                                                      height={contentHeight}
                                                                      onResponse={enqueueSnackbar}/>}/>
                                {
                                    gameList.map((description: GameDescription) =>
                                        <Route exact key={description.url} path={description.url}
                                               render={() => <GameWrapper measure0={emg0Measure} measure1={emg1Measure}
                                                                          timestamp={timestamp + timestampDiff}
                                                                          availableHeight={contentHeight}
                                                                          description={description}/>
                                               }/>
                                    )
                                }

                                <Route exact key={"/"} path={"/"}
                                       render={() => <Curves emg0={emg0Measure} emg1={emg1Measure}
                                                             timestamp={timestamp + timestampDiff}
                                                             windowWidth={windowWidth} height={contentHeight}/>}/>
                            </Switch>
                        </Box>
                    </Box>
                </Box>
            </ContentWrapper>
        </Root>
    </ThemeProvider>);
}

export default App;