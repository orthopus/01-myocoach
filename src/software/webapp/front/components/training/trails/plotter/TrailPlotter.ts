/*
    MyoCoach frontend trail plotter interface
    =========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export interface TrailPlotter {
    getPrevPoint?: (t: number, pointArray: Array<readonly number[]>) => number,
    getNextPoint?: (t: number, pointArray: Array<readonly number[]>) => number,
    evalPath: (t: number, pointArray: Array<readonly number[]>) => number
}