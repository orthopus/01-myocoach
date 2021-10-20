import * as React from 'react';
import {Trail} from "../../../types/training/Trail";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Create from "@mui/icons-material/Create";
import CreateTrailDialog from "./CreateTrailDialog";
import SelectTrailDialog from "./SelectTrailDialog";
import UploadTrailFileDialog from "./UploadTrailFileDialog";
import FileDownload from "@mui/icons-material/FileDownload";
import FileUpload from "@mui/icons-material/FileUpload"
import {BrowserUtils} from "../../../util/BrowserUtils";

/*
    MyoCoach frontend trail management section component
    ====================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const TrailManagementSection: React.FC<{ trails: Array<Trail>, onCreateTrailSubmit: (trail: Trail) => Promise<any>,
    onDeleteTrailSubmit: (id: number) => Promise<any>, onExportTrailSubmit: (id: number) => Promise<any>,
    onImportTrailSubmit: (file: File) => Promise<any> }> =
    ({ trails, onCreateTrailSubmit, onDeleteTrailSubmit, onExportTrailSubmit, onImportTrailSubmit }) => {

        const IS_MOBILE_BROWSER: boolean = BrowserUtils.isMobileBrowser();

        const [createTrailDialogOpen, setCreateTrailDialogOpen] = React.useState(false);
        const [exportTrailDialogOpen, setExportTrailDialogOpen] = React.useState(false);
        const [importTrailDialogOpen, setImportTrailDialogOpen] = React.useState(false);
        const [deleteTrailDialogOpen, setDeleteTrailDialogOpen] = React.useState(false);

        function openCreateTrailDialog() {
            setCreateTrailDialogOpen(true);
        }

        function openDeleteTrailDialog() {
            setDeleteTrailDialogOpen(true);
        }

        function openExportTrailDialog() {
            setExportTrailDialogOpen(true);
        }

        function openImportTrailDialog() {
            setImportTrailDialogOpen(true);
        }

        return (
            <React.Fragment>
                <Box component={Paper} p={3} m={2}>
                    <Box mx={1} my={2}>
                        <Typography variant={"h5"}>Manage Trails</Typography>
                    </Box>
                    <Box mx={1} my={2}>
                        <ButtonGroup variant={"contained"} aria-label={"contained button group"}
                                     size={"small"} fullWidth>
                            <Button size={"small"} color={"success"} onClick={openCreateTrailDialog}
                                    startIcon={<Create/>}>Create</Button>
                            {
                                IS_MOBILE_BROWSER ? null :
                                    <Button size={"small"} color={"primary"} onClick={openImportTrailDialog}
                                            startIcon={<FileUpload/>}>Import</Button>
                            }
                            {
                                IS_MOBILE_BROWSER ? null :
                                    <Button size={"small"} color={"secondary"} onClick={openExportTrailDialog}
                                            startIcon={<FileDownload/>}>Export</Button>
                            }
                            <Button size={"small"} color={"warning"} onClick={openDeleteTrailDialog}
                                    startIcon={<DeleteIcon/>}>Delete</Button>
                        </ButtonGroup>
                    </Box>
                </Box>
                <CreateTrailDialog open={createTrailDialogOpen} onClose={() => setCreateTrailDialogOpen(false)}
                                   onSubmit={onCreateTrailSubmit}/>
                {
                    IS_MOBILE_BROWSER ? null :
                        <UploadTrailFileDialog open={importTrailDialogOpen}
                                               onClose={() => setImportTrailDialogOpen(false)}
                                               onSubmit={onImportTrailSubmit}/>
                }
                {
                    IS_MOBILE_BROWSER ? null :
                        <SelectTrailDialog title={"Export Trail XML File"} action={"Export"}
                                           open={exportTrailDialogOpen}
                                           onClose={() => setExportTrailDialogOpen(false)}
                                           trails={trails} onSubmit={onExportTrailSubmit}/>
                }
                <SelectTrailDialog title={"Delete Existing Trail"} action={"Delete"} open={deleteTrailDialogOpen}
                                   onClose={() => setDeleteTrailDialogOpen(false)}
                                   trails={trails} onSubmit={onDeleteTrailSubmit}/>
            </React.Fragment>
        );
    }

export default TrailManagementSection;