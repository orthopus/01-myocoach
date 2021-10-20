/*
    MyoCoach frontend queue management utility class
    ================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

class Queue<T> {
    _oldestIndex: number;
    _newestIndex: number;
    _storage: Array<T>;

    constructor() {
        this._oldestIndex = 0;
        this._newestIndex = 0;
        this._storage = new Array<T>();
    }

    size(): number {
        return this._newestIndex - this._oldestIndex;
    }

    enqueue(data: T): Array<T> {
        this._storage[this._newestIndex] = data;
        this._newestIndex++;
        return this._storage;
    }

    dequeue() {
        let oldestIndex = this._oldestIndex,
            newestIndex = this._newestIndex,
            deletedData;

        if (oldestIndex !== newestIndex) {
            deletedData = this._storage[oldestIndex];
            delete this._storage[oldestIndex];
            this._oldestIndex++;
        }
    }
}

export default Queue;