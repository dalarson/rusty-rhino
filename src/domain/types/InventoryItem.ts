export type InventoryItem = {
    // a globally unique ID for the item.
    id?: string;
    // the name or title of the item
    name: string;
    // a brief description of the item
    description: string;
    // ordered photo URLs; index 0 is the cover/thumbnail
    imgUrls?: string[];
    // legacy: a URL to the main image (superseded by imgUrls)
    imgUrl?: string;
    // an optional price for the item
    price: number;
    // whether the item is currently spoken for / sold
    sold: boolean;
    // the type of the item, could correspond to the room in which it belongs.
    type: InventoryItemType;
    // legacy: URLs for "before" photos
    beforeImgUrls?: string[];
    // legacy: URLs for "after" photos
    afterImgUrls?: string[];
}

export enum InventoryItemType {
    Bedroom = "bedroom",
    Kitchen = "kitchen",
    LivingRoom = "livingroom",
    Den = "den",
    Office = "office",
    Bathroom = "bathroom",
    Outdoor = "outdoor",
    Misc = "misc"
}
