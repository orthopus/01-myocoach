import * as React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CustomInput from "../../common/CustomInput";

/*
    MyoCoach frontend trail points management form component
    ========================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const ManageTrailPointsForm: React.FC<{ pointArray: Array<readonly number[]>,
    setPointArray: React.Dispatch<React.SetStateAction<Array<readonly number[]>>> }> =
    ({ pointArray, setPointArray}) => {

        const [time, setTime] = React.useState(0);
        const [percentage, setPercentage] = React.useState(0);

        function handleTimeValueChange(e: React.ChangeEvent<HTMLInputElement>) {
            const text = e.currentTarget.value;
            setTime(Number.parseInt(text));
        }

        function handlePercentageValueChange(e: React.ChangeEvent<HTMLInputElement>) {
            const text = e.currentTarget.value;
            setPercentage(Number.parseInt(text));
        }

        function handleAddPointAction() {
            const point: readonly number[] = Object.freeze([time, percentage]);
            pointArray.push(point);
            setPointArray(pointArray);
        }

        function handleDeleteLastPointAction() {
            pointArray.pop();
            setPointArray(pointArray);
        }

        function formatPointArray() {
            let pointArrayStr = "[";
            for (let i: number = 0; i < pointArray.length ; i++) {
                pointArrayStr += "[" + pointArray[i] + "]";
                if (i + 1 < pointArray.length) {
                    pointArrayStr += ",";
                }
            }
            pointArrayStr += "]";
            return pointArrayStr;
        }

        return (
            <React.Fragment>
                <Box sx={{m: 1, p: 1}}>
                    <Typography>{formatPointArray()}</Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <Box m={1}>
                        <FormControl>
                            <InputLabel color={"info"} shrink htmlFor={"time-input"}>Time (ms)</InputLabel>
                            <CustomInput type={"number"} value={time} onChange={handleTimeValueChange} id={"time-input"}/>
                        </FormControl>
                    </Box>
                    <Box m={1}>
                        <FormControl>
                            <InputLabel color={"info"} shrink htmlFor={"value-input"}>Value (%)</InputLabel>
                            <CustomInput type={"number"} value={percentage} onChange={handlePercentageValueChange} id={"value-input"}/>
                        </FormControl>
                    </Box>
                    <Box m={1}>
                        <IconButton color={"secondary"} onClick={handleAddPointAction}><Add/></IconButton>
                    </Box>
                    <Box m={1}>
                        <IconButton color={"secondary"} onClick={handleDeleteLastPointAction}><Remove/></IconButton>
                    </Box>
                </Box>
            </React.Fragment>
        );
    }

export default ManageTrailPointsForm;