import * as React from "react"
import CircularProgress from "@mui/material/CircularProgress";
import CircularProgressWithLabel from "../common/CircularProgressWithLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

/*
    Godot loader component for game loading
    =======================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

export type PackLoadingState = {
    mode: string
    initializing: boolean
    percent?: number
    msg?: string
}

export type PackLoadingAction = {
    msg?: string
    initialized?: boolean
    percent?: number
    mode: string
}

export type PackLoadingDispatch = (action: PackLoadingAction) => void

const Godot = styled('div')(() => ({
    fontFamily: "Noto Sans, Droid Sans, Arial, sans-serif",
    color: "#e0e0e0",
    backgroundColor: "#3b3943",
    backgroundImage: "linear-gradient(to bottom, #403e48, #35333c)",
    border: "1px solid #45434e",
    boxShadow: "0 0 1px 1px #2f2d35",
}));

const Status = styled('div')(({ theme }) => ({
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    '& > * + *': {
        marginLeft: theme.spacing(2),
    },
}));

const StatusNotice = styled('div')(() => ({
    margin: "0 100px",
    lineHeight: "1.3",
    visibility: "visible",
    padding: "4px 6px",
}));

const packLoadingReducer = (
    state: PackLoadingState,
    action: PackLoadingAction
) => {
    if (!state.initializing) return state

    switch (action.mode) {
        case "progress":
        case "indeterminate":
        case "notice":
        case "hidden":
            break
        default:
            throw new Error("Invalid status mode")
    }

    return {
        mode: action.mode,
        msg: action.msg,
        percent: action.percent || 0,
        initializing: !action.initialized
    }
}

type LoadingProps = {
    notice?: string
    percent?: number
    indeterminate: boolean
}

const LoadingContext = React.createContext<[PackLoadingState, PackLoadingDispatch]>([
    { mode: "", initializing: true },
    () => {}
])

export const useLoading = () => React.useContext(LoadingContext)

const Loading: React.FC<LoadingProps> = ({
                                             notice,
                                             percent = 0,
                                             indeterminate = false
                                         }) => {

    return (
        <Status id={"status"}>
            <Box alignItems={"center"} justifyContent={"center"}>
                <Box m={1}>
                    <Typography variant={"h5"} align={"center"} color={"secondary"}>Game loading, please wait...</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} m={2}>
                    {indeterminate ? (
                        <CircularProgress size={"5rem"} color={"secondary"}/>
                    ) : (
                        <CircularProgressWithLabel size={"5rem"} color={"secondary"} variant={"determinate"} value={percent}/>
                    )}
                </Box>
                {notice && (
                    <StatusNotice id={"status-notice"}>
                        <Godot>
                            {notice}
                        </Godot>
                    </StatusNotice>
                )}
            </Box>
        </Status>
    )
}

const AsyncLoading: React.FC = ({ children }) => {
    const [loadingState, dispatchLoadingAction] = React.useReducer(packLoadingReducer, {
        mode: "indeterminate",
        initializing: true
    })

    return (
        <LoadingContext.Provider value={[loadingState, dispatchLoadingAction]}>
            {loadingState.mode !== "hidden" && (
                <Loading
                    notice={loadingState.msg}
                    percent={loadingState.percent}
                    indeterminate={loadingState.mode === "indeterminate"}
                />
            )}
            {children}
        </LoadingContext.Provider>
    )
}

export default AsyncLoading
