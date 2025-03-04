import { InventoryItem } from "../types/InventoryItem";

export interface IInventorySvc {
    /**
     * A function to make an API call to get the existing inventory of items.
     */
    getInventory(): Promise<InventoryItem[]>;
}