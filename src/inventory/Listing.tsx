import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";
import { InventoryItem } from "../domain/types/InventoryItem";

export const Listing = (props: InventoryItem): JSX.Element => {

    return (
        <Card shadow={'xs'} padding={'md'} radius={'md'} withBorder >
            <Card.Section>
                <Image
                    src={props.imgUrl}
                    fallbackSrc={"resources/images/fallback.png"}
                    width={"auto"}
                    fit={"contain"}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{props.name}</Text>
                {props.price && <Badge color="green">{formatPrice(props.price)}</Badge>}
            </Group>

            <Text size="sm" c="dimmed">
                {props.description}
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
                I want this!
            </Button>
        </Card>
    )
}

/**
 * A function to format the price tag for an item.
 */
function formatPrice(price: number) {
    return `$${price.toFixed(2)}`;
}