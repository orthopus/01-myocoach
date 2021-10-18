import io from "socket.io-client";

/*
    MyoCoach frontend socket-io client setup
    ========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
export const socket = io(process.env.ENDPOINT);