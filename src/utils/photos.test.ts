import { describe, expect, it, vi } from "vitest";
import { getPhotos, isHeic, moveItem, prepareImage } from "./photos";

const base = { imgUrl: "m", beforeImgUrls: ["b"], afterImgUrls: ["a"] };

describe("getPhotos", () => {
    it("prefers imgUrls", () => expect(getPhotos({ ...base, imgUrls: ["x", "y"] })).toEqual(["x", "y"]));
    it("falls back to legacy fields", () => expect(getPhotos(base)).toEqual(["m", "b", "a"]));
    it("skips empty legacy values", () => expect(getPhotos({ imgUrl: "" })).toEqual([]));
});

describe("isHeic", () => {
    it("detects by mime or extension", () => {
        expect(isHeic({ name: "a.jpg", type: "image/heic" })).toBe(true);
        expect(isHeic({ name: "IMG.HEIC", type: "" })).toBe(true);
        expect(isHeic({ name: "a.png", type: "image/png" })).toBe(false);
    });
});

describe("moveItem", () => {
    it("moves and ignores out-of-range", () => {
        expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
        const l = [1, 2];
        expect(moveItem(l, 0, 5)).toBe(l);
    });
});

describe("prepareImage", () => {
    it("converts then resizes heic", async () => {
        const convert = vi.fn().mockResolvedValue(new Blob(["j"]));
        const out = new File(["x"], "a.jpg");
        const resize = vi.fn().mockResolvedValue(out);
        const res = await prepareImage(new File(["h"], "a.heic", { type: "image/heic" }), convert, resize);
        expect(convert).toHaveBeenCalled();
        expect(res).toBe(out);
    });
    it("passes small images through", async () => {
        const f = new File(["x"], "a.png", { type: "image/png" });
        const resize = vi.fn();
        expect(await prepareImage(f, vi.fn(), resize)).toBe(f);
        expect(resize).not.toHaveBeenCalled();
    });
});
