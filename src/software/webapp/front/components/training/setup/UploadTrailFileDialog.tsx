import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";

/*
    MyoCoach frontend trail upload dialog component
    ===============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const UploadTrailFileDialog: React.FC<{ open: boolean, onClose: () => void,
    onSubmit: (file: File) => Promise<any> }> = ({ open, onClose, onSubmit }) => {

    const [file, setFile] = React.useState<File>(undefined);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = (event.target as HTMLInputElement).files;
        setFile(files[0]);
    }

    function handleSubmit() {
        if (file != undefined) {
            onSubmit(file).then(onClose);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby={"upload-trail-dialog-title"}>
            <form onSubmit={(event: React.ChangeEvent<any>) => event.preventDefault()}>
                <DialogTitle id={"upload-trail-dialog-title"}>Upload Trail XML File</DialogTitle>
                <DialogContent>
                    <Box my={2}>
                        <InputLabel htmlFor={"file-input"}>File</InputLabel>
                        <Input id={"file-input"} type={"file"} onChange={handleInputChange}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color={"secondary"} disabled={file == undefined} onClick={handleSubmit}>Upload</Button>
                    <Button color={"inherit"} onClick={onClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default UploadTrailFileDialog;