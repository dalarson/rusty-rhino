export type InventoryItem = {
    // a globally unique ID for the item.
    id?: string;
    // the name or title of the item
    name: string;
    // a brief description of the item
    description: string;
    // a URL to an image of the item
    imgUrl: string
    // an optional price for the item
    price: number;
    // whether the item is currently spoken for / sold
    sold: boolean;
    // the type of the item, could correspond to the room in which it belongs.
    type: InventoryItemType;
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
