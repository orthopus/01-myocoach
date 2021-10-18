import styled from "@mui/material/styles/styled";
import InputBase from "@mui/material/InputBase";

/*
    MyoCoach frontend custom input component
    ========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const CustomInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        color: theme.palette.secondary.main,
        marginTop: theme.spacing(1),
    },
    '& .MuiInputBase-input': {
        position: 'relative',
        backgroundColor: theme.palette.primary.main,
        borderWidth: 0,
        borderRadius: 12,
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderWidth: 2,
            borderRadius: 12,
            borderColor: theme.palette.info.main,
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default CustomInput;