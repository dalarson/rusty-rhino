import { InventoryItem } from "../domain/types/InventoryItem";

export const MAX_DIMENSION = 2048;
export const JPEG_QUALITY = 0.85;

/** Returns all photos of an item in display order; index 0 is the cover. */
export const getPhotos = (item: Pick<InventoryItem, "imgUrls" | "imgUrl" | "beforeImgUrls" | "afterImgUrls">): string[] => {
    if (item.imgUrls && item.imgUrls.length > 0) return item.imgUrls;
    return [item.imgUrl, ...(item.beforeImgUrls ?? []), ...(item.afterImgUrls ?? [])]
        .filter((u): u is string => !!u);
};

export const isHeic = (file: Pick<File, "name" | "type">): boolean =>
    /^image\/hei[cf]$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

export const moveItem = <T,>(list: T[], from: number, to: number): T[] => {
    if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
};

const renameToJpg = (name: string) => name.replace(/\.[^.]*$/, "") + ".jpg";

const resizeToJpeg = async (blob: Blob, name: string): Promise<File> => {
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const out = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/jpeg", JPEG_QUALITY));
    if (!out) throw new Error(`Could not process ${name}`);
    return new File([out], renameToJpg(name), { type: "image/jpeg" });
};

export type HeicConverter = (file: File) => Promise<Blob>;

const defaultConverter: HeicConverter = async (file) => {
    const { heicTo } = await import("heic-to");
    return heicTo({ blob: file, type: "image/jpeg", quality: JPEG_QUALITY });
};

/** Converts HEIC to JPEG and downsizes large images; other small images pass through. */
export const prepareImage = async (
    file: File,
    convert: HeicConverter = defaultConverter,
    resize: (blob: Blob, name: string) => Promise<File> = resizeToJpeg
): Promise<File> => {
    if (isHeic(file)) {
        const jpeg = await convert(file);
        return resize(jpeg, file.name);
    }
    if (file.size <= 1.5 * 1024 * 1024) return file;
    return resize(file, file.name);
};
