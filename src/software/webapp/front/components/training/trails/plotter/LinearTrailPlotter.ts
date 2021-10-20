import {TrailPlotter} from "./TrailPlotter";

/*
    MyoCoach frontend plotter class for trails with linear interpolation
    ====================================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export class LinearTrailPlotter implements TrailPlotter {

    getPrevPoint(t: number, pointArray: Array<readonly number[]>): number {
        const sortedPoints = pointArray
            .sort((a, b) => {
                if (a[0] < b[0]) {
                    return 1;
                } else if (a[0] > b[0]) {
                    return -1;
                } else {
                    return 0;
                }
            });
        for(const point of sortedPoints) {
            if (t > point[0]) {
                return point[0];
            }
        }
        return -1;
    }

    getNextPoint(t: number, pointArray: Array<readonly number[]>): number {
        const sortedPoints = pointArray
            .sort((a, b) => {
                if (a[0] < b[0]) {
                    return -1;
                } else if (a[0] > b[0]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        for(const point of sortedPoints) {
            if (t < point[0]) {
                return point[0];
            }
        }
        return -1;
    }

    evalPath(t: number, pointArray: Array<readonly number[]>): number {
        const prevKey = this.getPrevPoint(t, pointArray);
        const nextKey = this.getNextPoint(t, pointArray);
        if(prevKey == -1) {
            return pointArray.find(([t, v]) => t == nextKey)[1];
        } else if(nextKey == -1) {
            return pointArray.find(([t, v]) => t == prevKey)[1];
        } else {
            const nextValue = pointArray.find(([t, v]) => t == nextKey)[1];
            const prevValue = pointArray.find(([t, v]) => t == prevKey)[1]

            const a = (nextValue - prevValue) / (nextKey - prevKey);
            const b = (nextKey * prevValue - prevKey * nextValue) / (nextKey - prevKey);
            return a * t + b;
        }
    }

}