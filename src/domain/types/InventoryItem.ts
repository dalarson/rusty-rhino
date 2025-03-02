import { Guid } from "./Guid";

export type InventoryItem = {
    // a globally unique ID for the item.
    guid: Guid;
    // the name or title of the item
    name: string;
    // a brief description of the item
    description: string;
    // the image of the item to display with the listing
    img: Blob; // not sure what this will be
    // an optional price for the item
    price?: number;
    // whether the item is currently spoken for / sold
    sold: boolean;
}
