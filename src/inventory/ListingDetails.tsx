import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Image, Text, Title, Stack, Group, Badge, SimpleGrid, Divider, Button, Center, Loader } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { formatPrice } from "../utils/formatPrice";
import { PostInquiryPanel } from "../inquiries/PostInquiryPanel";

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
                <Button variant="subtle" onClick={() => navigate('/')}>Go back to inventory</Button>
            </Stack>
        </Container>
    );

    return (
        <Container size="md" pb="xl">
            <Group justify="space-between" mb="md">
                <Button 
                    variant="subtle" 
                    leftSection={<IconArrowLeft size={16} />} 
                    onClick={() => navigate('/')}
                >
                    Back to Inventory
                </Button>
                <Button color="blue" radius="md" onClick={toggleInquiry}>
                    I want this!
                </Button>
            </Group>

            <Stack gap="xl">
                <CardSection item={item} />
                
                {(item.beforeImgUrls && item.beforeImgUrls.length > 0) && (
                    <PhotoSection title="Before Restoration" images={item.beforeImgUrls} />
                )}

                {(item.afterImgUrls && item.afterImgUrls.length > 0) && (
                    <PhotoSection title="After Restoration" images={item.afterImgUrls} />
                )}
            </Stack>

            <PostInquiryPanel listingId={item.id!} isOpen={inquiryOpened} onDismiss={toggleInquiry} />
        </Container>
    );
};

const CardSection = ({ item }: { item: any }) => (
    <Stack gap="md">
        <Center>
            <Image 
                src={item.imgUrl} 
                radius="md" 
                mah={500} 
                w="auto" 
                fit="contain"
                fallbackSrc="/resources/images/fallback.png"
            />
        </Center>
        
        <Group justify="space-between" align="flex-start">
            <div>
                <Title order={1}>{item.name}</Title>
                <Badge size="lg" variant="light" color="blue" mt="xs">{item.type}</Badge>
            </div>
            {item.price > 0 && (
                <Text fw={700} size="xl" c="blue">
                    {formatPrice(item.price)}
                </Text>
            )}
        </Group>

        <Text size="lg" style={{ whiteSpace: 'pre-wrap' }}>
            {item.description}
        </Text>
    </Stack>
);

const PhotoSection = ({ title, images }: { title: string, images: string[] }) => (
    <Stack gap="sm">
        <Divider label={title} labelPosition="center" />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {images.map((url, i) => (
                <Image 
                    key={url + i} 
                    src={url} 
                    radius="md" 
                    mah={300} 
                    w="auto" 
                    fit="cover" 
                />
            ))}
        </SimpleGrid>
    </Stack>
);
