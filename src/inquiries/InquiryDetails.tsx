import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Anchor, Badge, Button, Center, Container, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconCheck, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "react-query";
import { InterestSvc } from "../domain/services/InterestSvc";
import { InventorySvc } from "../domain/services/InventorySvc";
import { CacheKeys } from "../domain/services/CacheKeys";
import { useApiRequest } from "../domain/services/ApiRequest";
import { ConfirmDeleteInquiryDialog } from "./ConfirmDeleteInquiryDialog";
import { formatInquiryDate } from "./Inquiries";

export const InquiryDetails = (): JSX.Element => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const interestSvc = useMemo(() => new InterestSvc(), []);
    const inventorySvc = useMemo(() => new InventorySvc(), []);
    const { data: entry, isLoading, isError } = useApiRequest(interestSvc.getInterestById(id!));
    const { data: inventory } = useApiRequest(inventorySvc.getInventory());

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [error, setError] = useState<Error>();

    if (isLoading) return <Center style={{ height: "50vh" }}><Loader size="xl" /></Center>;
    if (isError || !entry) return (
        <Container size="md">
            <Stack align="center" mt="xl">
                <Text size="xl" c="red">Error loading inquiry.</Text>
                <Button variant="subtle" onClick={() => navigate("/inquiries")}>Back to inquiries</Button>
            </Stack>
        </Container>
    );

    const addressed = !!entry.addressed;
    const itemName = inventory?.find((i) => i.id === entry.inventoryItemId)?.name;

    const toggleAddressed = async () => {
        setToggling(true);
        setError(undefined);
        try {
            await interestSvc.setAddressed(entry.id!, !addressed).execute();
            await queryClient.invalidateQueries(CacheKeys.Interest);
        } catch (e) {
            setError(e as Error);
        } finally {
            setToggling(false);
        }
    };

    return (
        <Container size="md" pb="xl">
            <Group justify="space-between" mb="md">
                <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate("/inquiries")}>
                    Back to Inquiries
                </Button>
                <Button color="red" variant="outline" leftSection={<IconTrash size={16} />} onClick={() => setDeleteOpen(true)}>
                    Delete
                </Button>
            </Group>

            <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                    <Group justify="space-between">
                        <Title order={2}>Inquiry from {entry.name}</Title>
                        {addressed
                            ? <Badge color="gray" variant="light">Addressed</Badge>
                            : <Badge color="blue">Needs reply</Badge>}
                    </Group>
                    {error && <Text c="red">{error.message}</Text>}
                    <Button
                        w="fit-content"
                        loading={toggling}
                        variant={addressed ? "outline" : "filled"}
                        leftSection={addressed ? undefined : <IconCheck size={16} />}
                        onClick={toggleAddressed}
                    >
                        {addressed ? "Mark as needs reply" : "Mark as addressed"}
                    </Button>

                    <Field label="Received">{formatInquiryDate(entry.createdAt)}</Field>
                    <Field label="Item">
                        {entry.inventoryItemId
                            ? <Anchor component={Link} to={`/listing/${entry.inventoryItemId}`}>{itemName ?? "View listing"}</Anchor>
                            : "—"}
                    </Field>
                    <Field label="Email"><Anchor href={`mailto:${entry.email}`}>{entry.email}</Anchor></Field>
                    <Field label="Phone">{entry.phone ? <Anchor href={`tel:${entry.phone}`}>{entry.phone}</Anchor> : "—"}</Field>
                    <Field label="Message"><Text style={{ whiteSpace: "pre-wrap" }}>{entry.message || "—"}</Text></Field>
                </Stack>
            </Paper>

            <ConfirmDeleteInquiryDialog
                opened={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onDeleted={() => navigate("/inquiries")}
                entry={entry}
            />
        </Container>
    );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Stack gap={2}>
        <Text size="sm" fw={700} c="dimmed">{label}</Text>
        {typeof children === "string" ? <Text>{children}</Text> : children}
    </Stack>
);
