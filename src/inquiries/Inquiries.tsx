import { useMemo } from "react";
import { Table, Text, Badge, Anchor, Group } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { InterestSvc } from "../domain/services/InterestSvc";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { InterestEntry } from "../domain/types/InterestEntry";
import { formatInquiryDate } from "../utils/formatInquiryDate";

export const Inquiries = (): JSX.Element => {
    const navigate = useNavigate();
    const interestSvc = useMemo(() => new InterestSvc(), []);
    const inventorySvc = useMemo(() => new InventorySvc(), []);
    const { data, isLoading, isError } = useApiRequest(interestSvc.getInterest());
    const { data: inventory } = useApiRequest(inventorySvc.getInventory());

    const entries: InterestEntry[] = useMemo(() => data ?? [], [data]);
    const itemNames = useMemo(() => {
        const map = new Map<string, string>();
        (inventory ?? []).forEach((i) => { if (i.id) map.set(i.id, i.name); });
        return map;
    }, [inventory]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load inquiries.</div>;
    if (entries.length === 0) return <div>No inquiries yet.</div>;

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Status</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {entries.map((entry) => {
                    const unaddressed = !entry.addressed;
                    const itemName = entry.inventoryItemId ? itemNames.get(entry.inventoryItemId) : undefined;
                    return (
                        <Table.Tr
                            key={entry.id}
                            onClick={() => navigate(`/inquiries/${entry.id}`)}
                            style={{
                                cursor: "pointer",
                                fontWeight: unaddressed ? 700 : 400,
                                opacity: unaddressed ? 1 : 0.65,
                                backgroundColor: unaddressed ? "var(--mantine-color-blue-0)" : undefined,
                            }}
                        >
                            <Table.Td>
                                <Group gap="xs" wrap="nowrap">
                                    <span style={{
                                        width: 8, height: 8, borderRadius: "50%",
                                        background: unaddressed ? "var(--mantine-color-blue-6)" : "transparent",
                                    }} />
                                    {formatInquiryDate(entry.createdAt)}
                                </Group>
                            </Table.Td>
                            <Table.Td>{entry.name}</Table.Td>
                            <Table.Td>
                                {entry.inventoryItemId ? (
                                    <Anchor component={Link} to={`/listing/${entry.inventoryItemId}`} onClick={(e) => e.stopPropagation()}>
                                        {itemName ?? "View listing"}
                                    </Anchor>
                                ) : <Text span c="dimmed">—</Text>}
                            </Table.Td>
                            <Table.Td>
                                {unaddressed
                                    ? <Badge color="blue">Needs reply</Badge>
                                    : <Badge color="gray" variant="light">Addressed</Badge>}
                            </Table.Td>
                        </Table.Tr>
                    );
                })}
            </Table.Tbody>
        </Table>
    );
};
