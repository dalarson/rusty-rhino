/**
 * A function to format the price tag for an item.
 */
export function formatPrice(price: number) {
    return `$${price.toFixed(2)}`;
}