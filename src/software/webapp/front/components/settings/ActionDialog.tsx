import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

/*
    MyoCoach frontend action dialog component
    ====================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const ActionDialog: React.FC<{ title: string, action: string, open: boolean, onClose: () => void,
    onSubmit: () => void }> = ({ title, action, open, onClose, onSubmit }) => {

    function handleSubmit() {
        onSubmit();
        onClose();
    }

    return(
        <Dialog open={open} onClose={onClose} aria-labelledby={"action-dialog-title"}>
            <DialogTitle id={"action-dialog-title"}>{title} system</DialogTitle>
            <DialogContent>
                <Box my={2}>
                    Are you sure you want to {action} the system now ?
                </Box>
            </DialogContent>
            <DialogActions>
                {
                    action == "shutdown" ?
                        <Button color={"error"} onClick={handleSubmit}>{action}</Button>
                        :
                        <Button color={"warning"} onClick={handleSubmit}>{action}</Button>
                }
                <Button color={"inherit"} onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ActionDialog;