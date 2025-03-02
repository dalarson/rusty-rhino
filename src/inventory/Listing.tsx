import { InventoryItem } from "../domain/types/InventoryItem";

export const Listing = (props: InventoryItem): JSX.Element => {
    return (
        <div>
            <div>{props.name}</div>
            <div>{props.description}</div>
            <div>{props.price}</div>
            <div>{props.sold}</div>
        </div>
    )
}