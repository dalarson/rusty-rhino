import { useMemo } from "react";
import { Table } from "@mantine/core";
import { InterestSvc } from "../domain/services/InterestSvc";
import { useApiRequest } from "../domain/services/ApiRequest";
import { InterestEntry } from "../domain/types/InterestEntry";

export const Inquiries = (): JSX.Element => {
    const interestSvc = useMemo(() => new InterestSvc(), []);
    const { data, isLoading, isError } = useApiRequest(interestSvc.getInterest());

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
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Message</Table.Th>
                    <Table.Th>Item ID</Table.Th>
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
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
};
