import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {Trail} from "../../../types/training/Trail";
import Box from "@mui/material/Box";
import ManageTrailPointsForm from "./ManageTrailPointsForm";
import CustomInput from "../../common/CustomInput";
import InputLabel from "@mui/material/InputLabel";

/*
    MyoCoach frontend create trail dialog component
    ===============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const CreateTrailDialog: React.FC<{ open: boolean, onClose: () => void, onSubmit: (trail: Trail) => Promise<any> }> =
    ({ open, onClose, onSubmit }) => {

        const [name, setName] = React.useState("");
        const [interpolation, setInterpolation] = React.useState<"linear" | "step">("linear");
        const [pointArray0, setPointArray0] = React.useState<Array<readonly number[]>>([]);
        const [pointArray1, setPointArray1] = React.useState<Array<readonly number[]>>([]);

        function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
            const text = e.currentTarget.value;
            setName(text);
        }

        function handleInterpolationChange(event: React.ChangeEvent<HTMLInputElement>) {
            const value: string = (event.target as HTMLInputElement).value;
            if (value == "linear") {
                setInterpolation("linear");
            } else {
                setInterpolation("step");
            }
        }

        function handleSubmit() {
            onSubmit({ name: name, interpolation: interpolation,
                pointArray0: pointArray0, pointArray1: pointArray1 }).then(onClose);
        }

        function isValid(): boolean {
            return name.length > 0 && (pointArray0.length > 0 || pointArray1.length > 0);
        }

        return (
            <Dialog open={open} onClose={onClose} aria-labelledby={"create-trail-dialog-title"} maxWidth={"lg"}>
                <form onSubmit={(event: React.ChangeEvent<any>) => event.preventDefault()}>
                    <DialogTitle id={"create-trail-dialog-title"}>
                        Create New Trail
                    </DialogTitle>
                    <DialogContent>
                        <Box my={2}>
                            <FormControl>
                                <InputLabel color={"info"} shrink htmlFor={"name-input"}>Name</InputLabel>
                                <CustomInput type={"text"} value={name} placeholder={"Trail Name..."}
                                             onChange={handleNameChange} id={"name-input"}/>
                            </FormControl>
                        </Box>
                        <Box my={2}>
                            <FormControl component={"fieldset"} fullWidth>
                                <FormLabel color={"info"} component={"legend"}>Interpolation</FormLabel>
                                <RadioGroup row aria-label={"trail-interpolation"}
                                            name={"interpolation-radio-buttons-group"}
                                            value={interpolation}
                                            onChange={handleInterpolationChange}>
                                    <FormControlLabel value={"linear"} control={<Radio color={"info"} />} label={"Linear"} />
                                    <FormControlLabel value={"step"} control={<Radio color={"info"} />} label={"Step"} />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box my={2}>
                            <FormControl fullWidth>
                                <FormLabel component={"legend"}>EMG0 Points</FormLabel>
                                <ManageTrailPointsForm pointArray={pointArray0} setPointArray={setPointArray0}/>
                            </FormControl>
                        </Box>
                        <Box my={2}>
                            <FormControl fullWidth>
                                <FormLabel component={"legend"}>EMG1 Points</FormLabel>
                                <ManageTrailPointsForm pointArray={pointArray1} setPointArray={setPointArray1}/>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button color={"secondary"} onClick={handleSubmit} disabled={!isValid()}>
                            Create
                        </Button>
                        <Button color={"inherit"} onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }

export default CreateTrailDialog;