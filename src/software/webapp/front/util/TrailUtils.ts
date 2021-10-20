import {Trail} from "../types/training/Trail";

/*
    MyoCoach frontend trail utility class
    =====================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export default class TrailUtils {

    static getSelectedTrailDuration(trail: Trail): number {
        let duration = 0;
        if(trail != undefined) {
            if (trail.pointArray0 != undefined && trail.pointArray0.length > 0) {
                for (let i = 0; i < trail.pointArray0.length; i++) {
                    duration = Math.max(duration, (trail.pointArray0[i])[0]);
                }
            }
            if (trail.pointArray1 != undefined && trail.pointArray1.length > 0) {
                for (let i = 0; i < trail.pointArray1.length; i++) {
                    duration = Math.max(duration, (trail.pointArray1[i])[0]);
                }
            }
        }
        return duration;
    }

    static isEmg0Enabled(trail: Trail): boolean {
        return trail != undefined && trail.pointArray0 != undefined && trail.pointArray0.length > 0;
    }

    static isEmg1Enabled(trail: Trail): boolean {
        return trail != undefined && trail.pointArray1 != undefined && trail.pointArray1.length > 0;
    }

    static getSensors(trail: Trail): string {
        if (trail != undefined) {
            if (TrailUtils.isEmg0Enabled(trail) && TrailUtils.isEmg1Enabled(trail)) {
                return "EMG0 & EMG1";
            } else if (TrailUtils.isEmg0Enabled(trail)) {
                return "EMG0";
            } else if (TrailUtils.isEmg1Enabled(trail)) {
                return "EMG1";
            }
        }
        return "--";
    }
}