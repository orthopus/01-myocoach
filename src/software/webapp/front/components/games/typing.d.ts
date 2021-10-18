/*
    Godot Engine declaration
    ========================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
declare class Engine {
    constructor(initConfig?: EngineConfig);

    static isWebGLAvailable: (majorVersion?: number) => boolean;
    static load: (path: string) => Promise<any>;
    static unload: () => void;

    init: (basePath: string) => Promise<any>;
    preloadFile: (file: string|ArrayBuffer, path?: string) => Promise<any>;
    start: (config: EngineConfig) => Promise<any>;
    startGame: (config: EngineConfig) => Promise<any>;
    copyToFS: (path: string, buffer: ArrayBuffer) => void;
    requestQuit: () => void;
}

interface EngineConfig {
    unloadAfterInit?: boolean,
    canvas?: HTMLCanvasElement,
    executable?: string,
    mainPack?: string,
    locale?: string,
    canvasResizePolicy?: number,
    args?: Array<string>,
    experimentalVK?: boolean,
    persistentPaths?: Array<string>,
    persistentDrops?: boolean,
    gdnativeLibs?: Array<string>,
    fileSizes?: any,
    onExecute?: (path: string, args: Array<string>) => void,
    onExit?: (status_code: number) => void,
    onProgress?: (current: number, total: number) => void,
    onPrint?: (var_args?: Array<string>) => void,
    onPrintError?: (var_args?: Array<string>) => void,
}

type EngineLoaderDescription = string

interface GameDescription {
    name: string,
    url: string,
    path: string,
    width: number,
    height: number,
    fileSizes: any,
}