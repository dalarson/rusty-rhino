import { useMemo, useState } from "react";
import { Table, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { InterestSvc } from "../domain/services/InterestSvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { InterestEntry } from "../domain/types/InterestEntry";
import { ConfirmDeleteInquiryDialog } from "./ConfirmDeleteInquiryDialog";

export const Inquiries = (): JSX.Element => {
    const interestSvc = useMemo(() => new InterestSvc(), []);
    const { data, isLoading, isError } = useApiRequest(interestSvc.getInterest());

    const [selectedEntry, setSelectedEntry] = useState<InterestEntry | null>(null);

    const entries: InterestEntry[] = useMemo(() => data ?? [], [data]);

    const formatDate = (ts?: number) => {
        if (!ts) return "";
        return new Date(ts).toLocaleDateString(undefined, {
            year: "numeric", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Failed to load inquiries.</div>;
    if (entries.length === 0) return <div>No inquiries yet.</div>;

    return (
        <>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Phone</Table.Th>
                        <Table.Th>Message</Table.Th>
                        <Table.Th>Item ID</Table.Th>
                        <Table.Th style={{ width: 50 }}></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {entries.map((entry) => (
                        <Table.Tr key={entry.id}>
                            <Table.Td>{formatDate(entry.createdAt)}</Table.Td>
                            <Table.Td>{entry.name}</Table.Td>
                            <Table.Td>{entry.email}</Table.Td>
                            <Table.Td>{entry.phone ?? ""}</Table.Td>
                            <Table.Td>{entry.message ?? ""}</Table.Td>
                            <Table.Td>{entry.inventoryItemId ?? ""}</Table.Td>
                            <Table.Td>
                                <ActionIcon color="red" variant="subtle" onClick={() => setSelectedEntry(entry)}>
                                    <IconX size={16} />
                                </ActionIcon>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            {selectedEntry && (
                <ConfirmDeleteInquiryDialog
                    opened={!!selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                    entry={selectedEntry}
                />
            )}
        </>
    );
};
