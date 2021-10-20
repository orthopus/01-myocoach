import * as React from "react"

import AsyncLoading from "./AsyncLoading"
import ReactCanvas from "./ReactCanvas"
import styled from "@mui/material/styles/styled";

/*
    Godot wrapper component
    =======================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const Wrap = styled('div')(()=> ({
    width: '100%',
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const useScript = (url: string, onLoad: () => any) => {

    React.useEffect(() => {
        const script = document.createElement("script");

        script.src = url;
        script.type="text/javascript";
        script.onload = onLoad;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);

}

export type ReactGodotProps = {
    script: EngineLoaderDescription,
    pck: string,
    wasm: string,
    fileSizes: any,
    resize?: boolean,
    width?: number,
    height?: number,
    availableHeight?: number,
    dimensions: Array<number>,
    onDimensionsChanged?: (newDimension: Array<number>) => void,
    params?: any,
}

const ReactGodot: React.FC<ReactGodotProps> = props => {
    const { script, pck, wasm, fileSizes, resize = false, width, height,
        availableHeight, dimensions, onDimensionsChanged, params } = props;
    const [engine, setEngine] = React.useState<Engine>(null);

    useScript(script, () => {
        const scope = window as any;
        setEngine(() => scope.Engine);
    });

    React.useEffect(() => {
        if (resize) {
            const newHeight = Math.max(availableHeight, height);
            const computedWidth = Math.round(newHeight * width / height);
            onDimensionsChanged([computedWidth, newHeight]);
        }
    }, [availableHeight]);

    return (
        <Wrap id={"wrap"}>
            <AsyncLoading>
                {engine && (
                    <ReactCanvas
                        pck={pck}
                        wasm={wasm}
                        engine={engine}
                        fileSizes={fileSizes}
                        width={dimensions[0]}
                        height={dimensions[1]}
                        params={params}
                    />
                )}
            </AsyncLoading>
        </Wrap>
    );
}

export default ReactGodot;