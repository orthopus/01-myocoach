import * as React from "react"

import {useLoading} from "./AsyncLoading"
import styled from "@mui/material/styles/styled";

/*
    Canvas react wrapper component for Godot game view
    ==================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const GameCanvas = styled('canvas')(() => ({
    display: "block",
    margin: 0,
    color: "white",
    '&:focus': {
        outline: "none"
    }
}))

export type ReactEngineProps = {
    engine: Engine,
    wasm: string,
    pck: string,
    fileSizes: any,
    width?: number,
    height?: number,
    params?: any,
    resize?: boolean,
}

function toFailure(err: any) {
    const msg = err.message || err
    console.error(msg)
    return { msg, mode: "notice", initialized: true }
}

const ReactCanvas: React.FC<ReactEngineProps> =
    ({engine, pck, wasm, fileSizes, width = 340, height = 256}) => {
        const canvasRef = React.useRef<HTMLCanvasElement>(null);
        const [instance, setInstance] = React.useState<Engine>();
        const [loadingState, changeLoadingState] = useLoading();

        React.useEffect(() => {
            if (Engine.isWebGLAvailable()) {
                changeLoadingState({ mode: "indeterminate" });
                setInstance(new Engine({ args: ['--main-pack', pck], canvasResizePolicy: 0,
                    fileSizes: fileSizes, executable: wasm,
                    mainPack: pck, onProgress: setProgressFunc, onExit: setExitFunc, canvas: canvasRef.current }));
            } else {
                changeLoadingState(toFailure("WebGL not available"));
            }
        }, [engine]);

        function setProgressFunc(current: number, total: number) {
            if (total > 0) {
                const progressPercent = current / total * 100;
                changeLoadingState({ mode: "progress", percent: progressPercent });
            } else {
                changeLoadingState({ mode: "indeterminate" });
            }
        }

        function setExitFunc(status_code: number) {
            console.log(`game exited with status code : ${status_code}`);
            Engine.unload();
            console.log("freed memory");
        }

        function requestQuit() {
            if (instance) {
                console.log("calling instance.requestQuit()");
                instance.requestQuit();
            }
        }

        React.useEffect(() => {
            if (instance) {
                Promise.all([
                    // Load and init the engine
                    instance.init(wasm),
                    // And the pck concurrently
                    instance.preloadFile(pck),
                ]).then(() => {
                    // Now start the engine.
                    return instance.start({ args: ['--main-pack', pck], canvasResizePolicy: 0,
                        fileSizes: fileSizes,
                        executable: wasm,
                        mainPack: pck, onProgress: setProgressFunc, onExit: setExitFunc, canvas: canvasRef.current });
                }).then(() => {
                    console.log('Engine has started!');
                    changeLoadingState({ mode: "hidden", initialized: true })
                }).catch((err: any) => changeLoadingState(toFailure(err)));
            }
            return () => requestQuit();
        }, [instance, pck, changeLoadingState, canvasRef]);

        return (<GameCanvas ref={canvasRef}
                            id={"my-game-canvas"}
                            width={width}
                            height={height}
                            style={{ display: loadingState.initializing ? "hidden" : "block" }}>
            HTML5 canvas appears to be unsupported in the current browser.
            <br />
            Please try updating or use a different browser.
        </GameCanvas>);
    }

export default ReactCanvas;
