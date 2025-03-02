import axios from "axios";
import { InventoryItem } from "../types/InventoryItem";
import { IInventorySvc } from "./IInventorySvc";
import { Guid } from "../types/Guid";

// urls
const imgUrl = "../../../resources/img";
const imgNames = ["chicago", "dino", "gnar", "lake"];

export class TempContentSvc implements IInventorySvc {

    // temporary API call to get inventory data
    public async getInventory(): Promise<InventoryItem[]> {
        return await Promise.all(
            imgNames.map(async (name) => {
                const img = await axios.get(`${imgUrl}/${name}.heic`, { responseType: 'blob' });
                console.log(img.data);
                return {
                    guid: new Guid(),
                    name: name,
                    img: img.data,
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum a, lacinia metus. Nullam in turpis nec purus feugiat, molestie ipsum a, lacinia metus. Nullam in turpis",
                    price: 100,
                    sold: false
                }
            })
        );
    }
}