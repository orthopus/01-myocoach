import {TrailPlotter} from "./TrailPlotter";

/*
    MyoCoach frontend plotter class for trails with step interpolation
    ==================================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export class StepTrailPlotter implements TrailPlotter {

    getPrevPoint(t: number, pointArray: Array<readonly number[]>) {
        const sortedPoints = pointArray
            .sort((a, b) => {
                if (a[0] < b[0]) {
                    return  1;
                } else {
                    return -1;
                }
            });
        for(const point of sortedPoints) {
            if (t > point[0]) {
                return point[0];
            }
        }
        return -1;
    }

    evalPath(t: number, pointArray: Array<readonly number[]>) {
        const key = this.getPrevPoint(t, pointArray);
        if (key != -1) {
            return pointArray.find(([t, v]) => t == key)[1];
        } else {
            return 0;
        }
    }
}