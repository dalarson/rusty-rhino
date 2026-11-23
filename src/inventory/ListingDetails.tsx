import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Image, Text, Title, Stack, Group, Badge, SimpleGrid, Button, Center, Loader } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { formatPrice } from "../utils/formatPrice";
import { PostInquiryPanel } from "../inquiries/PostInquiryPanel";
import { InventoryItem } from "../domain/types/InventoryItem";
import { getPhotos } from "../utils/photos";

export const ListingDetails = (): JSX.Element => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const inventorySvc = useMemo(() => new InventorySvc(), []);
    const [inquiryOpened, { toggle: toggleInquiry }] = useDisclosure(false);
    
    const { data: item, isLoading, isError } = useApiRequest(inventorySvc.getInventoryItem(id!));

    if (isLoading) return (
        <Center style={{ height: '50vh' }}>
            <Loader size="xl" />
        </Center>
    );

    if (isError || !item) return (
        <Container size="md">
            <Stack align="center" mt="xl">
                <Text size="xl" c="red">Error loading listing details.</Text>
                <Button variant="subtle" onClick={() => navigate('/shop')}>Go back to inventory</Button>
            </Stack>
        </Container>
    );

    return (
        <Container size="md" pb="xl">
            <Group justify="space-between" mb="md">
                <Button 
                    variant="subtle" 
                    leftSection={<IconArrowLeft size={16} />} 
                    onClick={() => navigate('/shop')}
                >
                    Back to Shop
                </Button>
                <Button color="rust" radius="md" onClick={toggleInquiry}>
                    I want this!
                </Button>
            </Group>

            <Stack gap="xl">
                <CardSection item={item} />
            </Stack>

            <PostInquiryPanel listingId={item.id!} isOpen={inquiryOpened} onDismiss={toggleInquiry} />
        </Container>
    );
};

const CardSection = ({ item }: { item: InventoryItem }) => (
    <Stack gap="md">
        <Gallery photos={getPhotos(item)} />
        
        <Group justify="space-between" align="flex-start">
            <div>
                <Title order={1}>{item.name}</Title>
                <Badge size="lg" variant="light" color="rust" mt="xs">{item.type}</Badge>
            </div>
            {item.price > 0 && (
                <Text fw={700} size="xl" c="rust.6">
                    {formatPrice(item.price)}
                </Text>
            )}
        </Group>

        <Text size="lg" style={{ whiteSpace: 'pre-wrap' }}>
            {item.description}
        </Text>
    </Stack>
);

const Gallery = ({ photos }: { photos: string[] }) => {
    const [selected, setSelected] = useState(0);
    const current = photos[Math.min(selected, photos.length - 1)];
    return (
        <Stack gap="sm">
            <Center>
                <Image
                    src={current}
                    radius="md"
                    mah={500}
                    w="auto"
                    fit="contain"
                    fallbackSrc="/resources/images/fallback.png"
                />
            </Center>
            {photos.length > 1 && (
                <SimpleGrid cols={{ base: 4, sm: 6 }} spacing="xs">
                    {photos.map((url, i) => (
                        <Image
                            key={url + i}
                            src={url}
                            radius="sm"
                            h={70}
                            fit="cover"
                            onClick={() => setSelected(i)}
                            style={{ cursor: "pointer", outline: i === selected ? "2px solid var(--mantine-color-blue-6)" : "none" }}
                        />
                    ))}
                </SimpleGrid>
            )}
        </Stack>
    );
};
