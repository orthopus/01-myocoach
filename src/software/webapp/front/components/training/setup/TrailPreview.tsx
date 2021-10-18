import * as React from 'react';
import SmoothieComponent, {TimeSeries} from "react-smoothie";
import useTheme from "@mui/material/styles/useTheme";
import {Trail} from "../../../types/training/Trail";
import TrailUtils from "../../../util/TrailUtils";

/*
    MyoCoach frontend trail preview component
    =========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const TrailPreview: React.FC<{ trail: Trail, pathWidth: number }> = ({ trail, pathWidth}) => {

    const theme = useTheme();

    const previewChartDimensions = [300, 150];

    const previewChartRef = React.useRef<SmoothieComponent>(null);
    const [ts0, setTs0] = React.useState<TimeSeries>(new TimeSeries({}));
    const [ts1, setTs1] = React.useState<TimeSeries>(new TimeSeries({}));

    const interval = React.useRef<NodeJS.Timer>(null);

    React.useEffect(() => {
        if (trail != undefined) {
            if (previewChartRef.current != undefined) {
                // Unfortunately it is not possible to update SmoothieComponent props directly
                // This workaround seems to work
                previewChartRef.current.smoothie.options.interpolation = trail.interpolation;
            }
            if (interval.current != null) {
                clearInterval(interval.current);
            }
            setTs0(new TimeSeries({}));
            setTs1(new TimeSeries({}));
            pointToPointTrail();
        }
        return function cleanup() {
            clearInterval(interval.current);
        }
    }, [trail]);

    React.useEffect(() => {
        if (previewChartRef.current != undefined) {
            previewChartRef.current.smoothie.options.grid.strokeStyle = theme.palette.secondary.main;
            previewChartRef.current.smoothie.options.grid.fillStyle = theme.palette.primary.main;
        }
    }, [theme])

    function pointToPointTrail() {
        const trailDuration = TrailUtils.getSelectedTrailDuration(trail);
        setPointToPointTrail();
        interval.current = setInterval(() => {
            setPointToPointTrail();
        }, trailDuration);
    }

    function setPointToPointTrail() {
        const time = new Date().getTime();

        if(trail.pointArray0 != undefined) {
            const timeSeries0 = new TimeSeries({});
            trail.pointArray0.forEach(([k, v]) => {
                timeSeries0.append(time + k, v);
            });
            setTs0(timeSeries0);
        }
        if(trail.pointArray1 != undefined) {
            const timeSeries1 = new TimeSeries({});
            trail.pointArray1.forEach(([k, v]) => {
                timeSeries1.append(time + k, v);
            });
            setTs1(timeSeries1);
        }
    }

    return (<SmoothieComponent ref={previewChartRef}
                               grid={{strokeStyle: theme.palette.secondary.main,
                                   fillStyle: theme.palette.primary.main,
                                   millisPerLine: 0,
                                   verticalSections: 10}}
                               labels={{disabled: true}}
                               width={previewChartDimensions[0]}
                               height={previewChartDimensions[1]}
                               maxValue={100} minValue={0}
                               series={[
                                   {
                                       data: ts0,
                                       strokeStyle: theme.palette.info.light,
                                       lineWidth: Math.round(pathWidth * previewChartDimensions[1] / 100),
                                   },
                                   {
                                       data: ts1,
                                       strokeStyle: theme.palette.error.light,
                                       lineWidth: Math.round(pathWidth * previewChartDimensions[1] / 100),
                                   }
                               ]}/>);

}

export default TrailPreview;