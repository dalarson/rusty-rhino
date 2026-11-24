import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Container, Group, Image, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowRight, IconHammer, IconMessageCircle, IconTruckDelivery } from "@tabler/icons-react";
import Rhino from "../../resources/logo/Logo.png";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { getPhotos } from "../utils/photos";
import { formatPrice } from "../utils/formatPrice";
import { Reveal } from "./Reveal";

const steps = [
    { icon: IconHammer, title: "Browse", text: "Look through one-of-a-kind, hand-restored pieces." },
    { icon: IconMessageCircle, title: "Inquire", text: "Tell us which piece you love and we'll be in touch." },
    { icon: IconTruckDelivery, title: "Pick up", text: "Arrange pickup or delivery and make it yours." },
];

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` } as React.CSSProperties);

const Hero = () => (
    <div className="hero-bg">
        <Container size="lg" py={{ base: 60, md: 110 }}>
            <Group justify="space-between" wrap="nowrap" gap="xl">
                <Stack gap="lg" maw={560}>
                    <Text className="fade-up" tt="uppercase" fw={600} c="rust.6" style={{ letterSpacing: 2 }} size="sm">
                        Rustic furniture, restored
                    </Text>
                    <Title className="fade-up" style={{ ...delay(120), fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 1.05 }}>
                        Character you can feel, craftsmanship that lasts.
                    </Title>
                    <Text className="fade-up" size="lg" c="dimmed" style={delay(240)}>
                        Rusty Rhino finds, restores, and sells farmhouse-style furniture with a story. Every piece is
                        unique, and ready for a new home.
                    </Text>
                    <Group className="fade-up" style={delay(360)}>
                        <Button component={Link} to="/shop" size="lg" radius="xl" rightSection={<IconArrowRight size={18} />}>
                            Browse the shop
                        </Button>
                        <Button component="a" href="#story" size="lg" radius="xl" variant="default">
                            Our story
                        </Button>
                    </Group>
                </Stack>
                <Image className="hero-rhino" src={Rhino} alt="" w={280} visibleFrom="md" />
            </Group>
        </Container>
    </div>
);

const Featured = () => {
    const inventorySvc = useMemo(() => new InventorySvc(), []);
    const { data } = useApiRequest(inventorySvc.getInventory());
    const items = (data ?? []).slice(0, 3);
    if (items.length === 0) return null;

    return (
        <Container size="lg" py={80}>
            <Reveal>
                <Group justify="space-between" align="flex-end" mb="xl">
                    <Title order={2}>Fresh from the workshop</Title>
                    <Button component={Link} to="/shop" variant="subtle" rightSection={<IconArrowRight size={16} />}>
                        See everything
                    </Button>
                </Group>
            </Reveal>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                {items.map((item, i) => (
                    <Reveal key={item.id} delay={i * 120}>
                        <Card component={Link} to={`/listing/${item.id}`} className="lift-card" padding={0} radius="lg" withBorder style={{ textDecoration: "none", color: "inherit" }}>
                            <Image src={getPhotos(item)[0]} fallbackSrc="resources/images/fallback.png" h={240} fit="cover" />
                            <Group justify="space-between" p="md">
                                <Text fw={600}>{item.name}</Text>
                                {item.price > 0 && <Text c="rust.6" fw={600}>{formatPrice(item.price)}</Text>}
                            </Group>
                        </Card>
                    </Reveal>
                ))}
            </SimpleGrid>
        </Container>
    );
};

const Story = () => (
    <div id="story" style={{ background: "light-dark(var(--mantine-color-barn-1), var(--mantine-color-dark-6))" }}>
        <Container size="sm" py={80} ta="center">
            <Reveal>
                <Title order={2} mb="md">Our story</Title>
                <Text size="lg" c="dimmed">
                    Rusty Rhino started with a love for worn wood, honest joinery, and furniture that has lived a
                    little. We rescue pieces with good bones and bring them back to life, so your home feels warm,
                    lived-in, and unmistakably yours.
                </Text>
            </Reveal>
        </Container>
    </div>
);

const HowItWorks = () => (
    <Container size="lg" py={80}>
        <Reveal><Title order={2} ta="center" mb={48}>How it works</Title></Reveal>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
            {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                    <Stack align="center" ta="center" gap="xs">
                        <ThemeIcon size={64} radius="xl" variant="light"><s.icon size={30} /></ThemeIcon>
                        <Title order={4}>{s.title}</Title>
                        <Text c="dimmed">{s.text}</Text>
                    </Stack>
                </Reveal>
            ))}
        </SimpleGrid>
    </Container>
);

const Cta = () => (
    <Container size="lg" pb={80}>
        <Reveal>
            <Card radius="xl" p={{ base: "xl", md: 56 }} ta="center" bg="rust.7">
                <Title order={2} c="white" mb="sm">Found something you love?</Title>
                <Text c="white" mb="lg" opacity={0.9}>Pieces go fast. Send us an inquiry and we'll hold it for you.</Text>
                <Group justify="center">
                    <Button component={Link} to="/shop" size="lg" radius="xl" variant="white" color="rust.8">
                        Shop now
                    </Button>
                </Group>
            </Card>
        </Reveal>
    </Container>
);

export const Landing = (): JSX.Element => (
    <>
        <Hero />
        <Featured />
        <Story />
        <HowItWorks />
        <Cta />
    </>
);
