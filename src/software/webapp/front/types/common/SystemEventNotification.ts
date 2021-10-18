/*
    MyoCoach frontend system event notification interface
    =====================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export interface SystemEventNotification {
    type: string,
    message: string,
    system_timestamp?: number,
}