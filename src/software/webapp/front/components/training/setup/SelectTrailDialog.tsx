import * as React from 'react';
import {Trail} from "../../../types/training/Trail";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Box from "@mui/material/Box";
import CustomInput from "../../common/CustomInput";

/*
    MyoCoach frontend trail select dialog component
    ===============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const SelectTrailDialog: React.FC<{ title: string, action: string, open: boolean, onClose: () => void, trails: Array<Trail>,
    onSubmit: (id: number) => Promise<any> }> = ({ title, action, open, onClose, trails, onSubmit }) => {

    const [selectedId, setSelectedId] = React.useState(-1);

    React.useEffect(() => {
        if (trails != undefined && trails.length > 0) {
            setSelectedId(trails[0].id);
        }
    }, [trails])

    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const id: number = Number.parseInt((event.target as HTMLSelectElement).value);
        setSelectedId(id);
    }

    function handleSubmit() {
        if (selectedId != -1) {
            onSubmit(selectedId).then(onClose);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby={"select-trail-dialog-title"}>
            <form onSubmit={(event: React.ChangeEvent<any>) => event.preventDefault()}>
                <DialogTitle id={"select-trail-dialog-title"}>{title}</DialogTitle>
                <DialogContent>
                    <Box my={2}>
                        <FormControl fullWidth>
                            <InputLabel color={"info"} htmlFor={"trail-select"}>Trail selection</InputLabel>
                            <NativeSelect value={selectedId} onChange={handleSelectChange} input={<CustomInput/>}
                                          id={"trail-select"}
                                          inputProps={{ name: 'trailSelect'  }}>
                                {
                                    trails.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                }
                            </NativeSelect>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button color={"secondary"} disabled={selectedId == -1} onClick={handleSubmit}>{action}</Button>
                    <Button color={"inherit"} onClick={onClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default SelectTrailDialog;