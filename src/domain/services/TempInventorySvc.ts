import { Guid } from "../types/Guid";
import { InventoryItem } from "../types/InventoryItem";
import { IInventorySvc } from "./IInventorySvc";

const url = "resources/img/";
const imgs = ["chicago", "dino", "gnar", "lake", "pipe"];
const names = ["Chicago", "Dino", "Gnar", "Lake", "Pipe"];
const descriptions = [
    "A bustling cityscape with iconic architecture and vibrant culture. Chicago is known for its impressive skyline, deep-dish pizza, and rich history. It's a city that never sleeps, offering endless opportunities for exploration and adventure.", // Chicago
    "A prehistoric creature brought to life in vivid detail. Dino captures the imagination with its towering presence and fierce demeanor. Perfect for those who are fascinated by the ancient world and its majestic inhabitants.", // Dino
    "A daring and adventurous character full of energy. Gnar is always ready for the next big challenge, embodying the spirit of excitement and thrill. This character is a favorite among those who love action and adventure.", // Gnar
    "A serene and picturesque body of water surrounded by nature. Lake offers a tranquil escape from the hustle and bustle of everyday life. It's a perfect spot for relaxation, reflection, and connecting with the natural world.", // Lake
    "An industrial structure used for transporting fluids or gases. Pipe represents the backbone of modern infrastructure, essential for various industrial processes. Its robust design and functionality make it a critical component in many applications." // Pipe
];
const prices = [50, 75, 150, 70, 12];
const solds = [false, false, false, false, true]
const extension = ".png";

export class TempInventorySvc implements IInventorySvc {
    constructor() {
    }

    public getInventory(): Promise<InventoryItem[]> {
        const inventory: InventoryItem[] = [];
        imgs.forEach((img, index) => {
            inventory.push({
                guid: new Guid(),
                name: names[index],
                description: descriptions[index],
                price: prices[index],
                imgUrl: url + img + extension,
                sold: solds[index]
            })
        });
        return Promise.resolve(inventory);
    }
}