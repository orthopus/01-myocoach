import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import Fab from "@mui/material/Fab";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import NativeSelect from "@mui/material/NativeSelect";
import {Trail} from "../../../types/training/Trail";
import TrailPreview from "./TrailPreview";
import {ApiClient} from "../../../services/ApiClient";
import TrailManagementSection from "./TrailManagementSection";
import TrailUtils from "../../../util/TrailUtils";
import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack";
import NetworkUtils from "../../../util/NetworkUtils";
import CustomInput from "../../common/CustomInput";

/*
    MyoCoach frontend training setup component
    ==========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const TrainingSetup: React.FC<{ trail: Trail, onSelectedTrailChanged: (id: number) => void,
    pathWidth: number, onPathWidthChanged: (value: number) => void,
    lastScore: number, onApply: () => void,
    onResponse: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey }> =
    ({ trail, onSelectedTrailChanged, pathWidth,
         onPathWidthChanged, lastScore, onApply, onResponse }) => {

        const theme = useTheme();

        const [trails, setTrails] = React.useState<Array<Trail>>([]);

        React.useEffect(() => {
            updateTrailList().then(() => console.info("trail list updated"))
        }, [])

        React.useEffect(() => {
            if(trails.length > 0) {
                onSelectedTrailChanged(trails[0].id)
            }
        }, [trails])

        function updateTrailList() {
            return ApiClient.listTrails().then(res => res.json()).then(json =>
                setTrails(json));
        }

        function handleTrailTypeChanged(event: React.ChangeEvent<HTMLSelectElement>) {
            const id: number = Number.parseInt((event.target as HTMLSelectElement).value);
            onSelectedTrailChanged(id);
        }

        function handlePathWidthChanged(event: Event, newValue: number) {
            onPathWidthChanged(newValue);
        }

        function handleApplyConf() {
            onApply();
        }

        function handleCreateTrailAction(trail: Trail): Promise<any> {
            return ApiClient.insertTrail(trail)
                .then(resp => NetworkUtils.manageResult(resp, onResponse)).then(updateTrailList);
        }

        function handleDeleteTrailAction(id: number): Promise<any> {
            return ApiClient.deleteTrail(id)
                .then(resp => NetworkUtils.manageResult(resp, onResponse)).then(updateTrailList);
        }

        function handleExportTrailAction(id: number): Promise<any> {
            let filename: string = "";
            return ApiClient.exportTrail(id)
                .then(response => {
                    const disposition = response.headers.get("Content-Disposition");
                    filename = disposition.match(/filename=(.+)/)[1];
                    return response.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    URL.revokeObjectURL(url);
                });
        }

        function handleImportTrailAction(file: File): Promise<any> {
            return ApiClient.importTrail(file)
                .then(resp => NetworkUtils.manageResult(resp, onResponse)).then(updateTrailList);
        }

        return (
            <React.Fragment>
                <Box component={Paper} p={3} m={2}>
                    <Box m={1}>
                        <Typography variant={"h5"}>Training Session Setup</Typography>
                    </Box>
                    <Grid container columns={{xs: 6, md: 12}}>
                        <Grid item xs={6} md={6} px={2} py={{xs: 0, md: 2}}>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                <Box>
                                    <FormControl fullWidth
                                                 sx={{ my: 1, minWidth: 120 }}>
                                        <FormLabel color={"info"} component={"legend"}>Trail selection</FormLabel>
                                        <NativeSelect value={trail != undefined ? trail.id : -1}
                                                      onChange={handleTrailTypeChanged}
                                                      input={<CustomInput />}
                                                      inputProps={{ name: 'trailSelect', id: 'trail-select' }}>
                                            {
                                                trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                            }
                                        </NativeSelect>
                                    </FormControl>
                                    <Box sx={{textAlign: 'center'}}>
                                        <Typography variant={'caption'}>
                                            Sensors : {trail != undefined ? TrailUtils.getSensors(trail) : "--"} - Interpolation : {trail != undefined ? trail.interpolation : "--"} - Duration : {trail != undefined ? Math.round(TrailUtils.getSelectedTrailDuration(trail) / 1000) : "--"} seconds
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Box sx={{m: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography>Preview</Typography>
                                    <Box height={150}>
                                        <TrailPreview trail={trail} pathWidth={pathWidth}/>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6} px={2} py={{xs: 0, md: 2}}>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                <Box>
                                    <FormControl fullWidth
                                                 sx={{ my: 1, minWidth: 120 }}>
                                        <FormLabel component={"legend"}>Trail width : {pathWidth}</FormLabel>
                                        <Slider color={"secondary"} sx={{ my: 2, width: "100%" }} value={pathWidth}
                                                onChange={handlePathWidthChanged} marks step={2} min={10} max={30}
                                        />
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                <Box>
                                    <Box sx={{m: 4, display: 'flex', flexDirection: 'column'}}>
                                        <Box sx={{mx: 3, my: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Fab sx={{
                                                backgroundColor: theme.palette.warning.main,
                                                width: "112px",
                                                height: "112px",
                                                '&:hover': {
                                                    backgroundColor: theme.palette.warning.dark,
                                                },
                                            }} size={"large"} onClick={handleApplyConf} disabled={trail == undefined}>
                                                <Typography variant={"h5"} color={"secondary"}>Start</Typography>
                                            </Fab>
                                        </Box>
                                        <Box sx={{mx: 3, my: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Chip sx={{
                                                backgroundColor: theme.palette.secondary.main,
                                                color: theme.palette.primary.main,
                                            }} label={lastScore != -1 ? `LAST SCORE : ${Math.round(lastScore * 100)}%` : 'LAST SCORE : --'}/>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <TrailManagementSection trails={trails} onCreateTrailSubmit={handleCreateTrailAction}
                                        onDeleteTrailSubmit={handleDeleteTrailAction}
                                        onExportTrailSubmit={handleExportTrailAction}
                                        onImportTrailSubmit={handleImportTrailAction} />
            </React.Fragment>
        );
    }

export default TrainingSetup;