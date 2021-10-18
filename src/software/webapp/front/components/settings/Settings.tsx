import * as React from "react";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import UpdateIcon from "@mui/icons-material/Update";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Refresh from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import {ApiClient} from "../../services/ApiClient";
import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack";
import SwapVert from "@mui/icons-material/SwapVert";
import NetworkUtils from "../../util/NetworkUtils";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import styled from "@mui/material/styles/styled";
import IconButton from "@mui/material/IconButton";
import ActionDialog from "./ActionDialog";

/*
    MyoCoach frontend settings' page component
    ========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const ButtonGroupWrapper = styled('div')(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const IconButtonGroupWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

const Settings: React.FC<{ serverConnected: boolean, boardConnected: boolean,
    onResponse: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey }> =
    ({ serverConnected, boardConnected, onResponse }) => {

        const [restartDialogOpen, setRestartDialogOpen] = React.useState(false);
        const [shutdownDialogOpen, setShutdownDialogOpen] = React.useState(false);

        const theme = useTheme();

        function openRestartDialog() {
            setRestartDialogOpen(true);
        }

        function openShutdownDialog() {
            setShutdownDialogOpen(true);
        }

        function sendTimeToServer() {
            let currentTime = Date.now();
            ApiClient.setTime(currentTime).then(resp => NetworkUtils.manageResult(resp, onResponse));
        }

        function sendShutdownCommandToServer() {
            ApiClient.shutdownSystem().then(resp => NetworkUtils.manageResult(resp, onResponse));
        }

        function sendRebootCommandToServer() {
            ApiClient.rebootSystem().then(resp => NetworkUtils.manageResult(resp, onResponse));
        }

        function sendSwapEmgInputsCommandToServer() {
            ApiClient.swapEmgInputs().then(resp => NetworkUtils.manageResult(resp, onResponse));
        }

        return(
            <React.Fragment>
                <Box component={Paper} p={2} m={2}>
                    <Typography variant={"h5"}>General state</Typography>
                    <table>
                        <tbody>
                        <tr>
                            <td><Typography variant={"body1"}>Application server :</Typography></td>
                            <td>
                                {
                                    serverConnected ?
                                        <Chip label={"Connected"}
                                              style={{backgroundColor: theme.palette.success.main,
                                                  fontFamily: "Montserrat"}}/>
                                        :
                                        <Chip label={"Not Connected"}
                                              style={{backgroundColor: theme.palette.warning.main,
                                                  fontFamily: "Montserrat"}}/>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><Typography variant={"body1"}>Sensors board :</Typography></td>
                            <td>
                                {
                                    boardConnected ?
                                        <Chip label={"Connected"}
                                              style={{backgroundColor: theme.palette.success.main,
                                                  fontFamily: "Montserrat"}}/>
                                        :
                                        <Chip label={"Not Connected"}
                                              style={{backgroundColor: theme.palette.warning.main,
                                                  fontFamily: "Montserrat"}}/>
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Box>
                <Box component={Paper} m={2}>
                    <Box component={Typography} p={2} variant={"h5"}>System actions</Box>
                    <ButtonGroupWrapper>
                        <ButtonGroup variant={"contained"} size={"large"} fullWidth>
                            <Tooltip title={"Swap EMG inputs"}>
                                <Button sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }} onClick={sendSwapEmgInputsCommandToServer} startIcon={<SwapVert/>}>
                                    Swap EMG inputs
                                </Button>
                            </Tooltip>
                            <Tooltip title={"Set system datetime"}>
                                <Button onClick={sendTimeToServer} startIcon={<UpdateIcon/>}>
                                    Set Time
                                </Button>
                            </Tooltip>
                            <Tooltip title={"Reboot system"}>
                                <Button onClick={openRestartDialog} color={"warning"} startIcon={<Refresh/>}>
                                    Restart
                                </Button>
                            </Tooltip>
                            <Tooltip title={"Shutdown system"}>
                                <Button sx={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }} onClick={openShutdownDialog} color={"error"} startIcon={<PowerSettingsNewIcon/>}>
                                    Shutdown
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                    </ButtonGroupWrapper>
                    <IconButtonGroupWrapper>
                        <Box sx={{ display: "flex", flexWrap: 'nowrap', width: "100%" }}>
                            <Box sx={{ p: 1, flexGrow: 1, textAlign: 'center' }}>
                                <Tooltip title={"Swap EMG inputs"}>
                                    <IconButton sx={{ backgroundColor: "primary.main" }} size={"large"} onClick={sendSwapEmgInputsCommandToServer}>
                                        <SwapVert fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ p: 1, flexGrow: 1, textAlign: 'center' }}>
                                <Tooltip title={"Set system datetime"}>
                                    <IconButton sx={{ backgroundColor: "primary.main" }} size={"large"} onClick={sendTimeToServer}>
                                        <UpdateIcon fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ p: 1, flexGrow: 1, textAlign: 'center' }}>
                                <Tooltip title={"Reboot system"}>
                                    <IconButton sx={{ backgroundColor: "warning.main" }} color={"warning"} size={"large"} onClick={openRestartDialog}>
                                        <Refresh sx={{ color: "text.primary" }} fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box sx={{ p: 1, flexGrow: 1, textAlign: 'center' }}>
                                <Tooltip title={"Shutdown system"}>
                                    <IconButton sx={{ backgroundColor: "error.main" }} color={"error"} size={"large"} onClick={openShutdownDialog}>
                                        <PowerSettingsNewIcon sx={{ color: "text.primary" }} fontSize={"large"}/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </IconButtonGroupWrapper>
                </Box>
                <ActionDialog title={"Restart"} action={"restart"} open={restartDialogOpen}
                              onClose={() => setRestartDialogOpen(false)} onSubmit={sendRebootCommandToServer}/>
                <ActionDialog title={"Shutdown"} action={"shutdown"} open={shutdownDialogOpen}
                              onClose={() => setShutdownDialogOpen(false)} onSubmit={sendShutdownCommandToServer} />
            </React.Fragment>
        );
    }

export default Settings;