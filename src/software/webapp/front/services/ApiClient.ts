import {Trail} from "../types/training/Trail";

/*
    MyoCoach frontend API client
    ============================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

export class ApiClient {

    static setTime(currentTime: number): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/time`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time : currentTime })
        });
    }

    static shutdownSystem(): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/shutdown`,{
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: 'Shutdown System'
        });
    }

    static rebootSystem(): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/reboot`,{
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: 'Reboot System'
        });
    }

    static swapEmgInputs(): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/swapEmgInputs`,{
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: 'Swap EMG inputs'
        })
    }

    static getTrail(id: number): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/trails/${id}`)
    }

    static listTrails(): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/trails`)
    }

    static insertTrail(payload: Trail): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/trails`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
    }

    static deleteTrail(id: number): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/api/trails/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    }

    static exportTrail(id: number): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/download/trail.xml`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
    }

    static importTrail(file: File): Promise<Response> {
        const formData = new FormData();
        formData.append('file', file);
        return fetch(`${process.env.ENDPOINT}/upload/trail`, {
            method: 'POST',
            body: formData
        })
    }

    static getGameList(): Promise<Response> {
        return fetch(`${process.env.ENDPOINT}/public/games/gamelist.json`)
    }
}