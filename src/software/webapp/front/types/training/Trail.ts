/*
    MyoCoach frontend training trail interface
    ==========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export interface Trail {
    id?: number,
    name: string,
    interpolation: "linear" | "step",
    pointArray0?: Array<readonly number[]>,
    pointArray1?: Array<readonly number[]>
}