import { v4 as uuid, validate } from "uuid";

export class Guid {

    private _guid: string;

    constructor(guid?: string) {
        if (guid && validate(guid)) {
            this._guid = guid;
        } else if (!guid) {
            this._guid = uuid();
        } else {
            throw new Error("Invalid GUID");
        }
    }

    toString(): string {
        return this._guid;
    }
}