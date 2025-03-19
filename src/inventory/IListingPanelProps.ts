import { InventoryItem } from "../domain/types/InventoryItem";

export interface IListingPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    item?: InventoryItem;
}