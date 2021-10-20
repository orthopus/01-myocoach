import * as React from 'react'
import Box from "@mui/material/Box";
import ReactGodot from "./ReactGodot";

/*
    MyoCoach Godot Game wrapper component
    ============================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const GameWrapper: React.FC<{ measure0: number, measure1: number,
    timestamp: number, availableHeight: number, description: GameDescription }> =
    ({ measure0, measure1, timestamp, availableHeight, description }) => {

        const emgThreshold: number = 30;

        const [keyPressed, setKeyPressed] = React.useState(false);
        const [dimensions, setDimensions] = React.useState([Math.round(4 * availableHeight / 3), availableHeight]);

        React.useEffect(() => {
            triggerMouseYMovementEvent(measure0 - measure1);
            if (measure1 > emgThreshold) {
                if(keyPressed) {
                    triggerSpaceKeyUpEvent();
                } else {
                    triggerSpaceKeyDownEvent();
                }
            }
        }, [timestamp]);

        function triggerMouseYMovementEvent(value: number) {
            if (value != 0) {
                let element = document.getElementById('my-game-canvas');
                if (element) {
                    const zoomFactor: number = dimensions[1] / 256;
                    element.dispatchEvent(new MouseEvent('mousemove', {
                        movementX: 0,
                        movementY: value * zoomFactor,
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                }
            }
        }

        function triggerSpaceKeyDownEvent() {
            let element = document.getElementById('my-game-canvas');
            if (element) {
                element.dispatchEvent(new KeyboardEvent('keydown', {'key': ' ', 'code': 'Space'}));
                setKeyPressed(true);
            }
        }

        function triggerSpaceKeyUpEvent() {
            let element = document.getElementById('my-game-canvas');
            if (element) {
                element.dispatchEvent(new KeyboardEvent('keyup', {'key': ' ', 'code': 'Space'}));
                setKeyPressed(false);
            }
        }

        function onDimensionsChanged(newDimensions: Array<number>) {
            setDimensions(newDimensions);
        }

        return (
            <Box mx={1}>
                <ReactGodot script={'/public/games/game.js'}
                            pck={`/public/games/${description.path}/game.pck`}
                            wasm={`/public/games/${description.path}/game`}
                            fileSizes={description.fileSizes}
                            resize width={description.width} height={description.height}
                            availableHeight={availableHeight}
                            dimensions={dimensions} onDimensionsChanged={onDimensionsChanged}/>
            </Box>
        );
    }

export default GameWrapper;