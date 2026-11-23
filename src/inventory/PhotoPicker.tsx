import { ActionIcon, Badge, Box, Group, Image, Loader, SimpleGrid, Text } from "@mantine/core";
import { IconArrowLeft, IconArrowRight, IconRefresh, IconStar, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { InventorySvc } from "../domain/services/InventorySvc";
import { moveItem, prepareImage } from "../utils/photos";

export interface PhotoEntry {
    key: string;
    preview: string;
    url?: string;
    file?: File;
    status: "done" | "uploading" | "error";
    error?: string;
}

export interface IPhotoPickerProps {
    initialUrls: string[];
    onChange: (entries: PhotoEntry[]) => void;
}

const MAX_CONCURRENCY = 3;
const ACCEPT = "image/*,.heic,.heif";

export const PhotoPicker = ({ initialUrls, onChange }: IPhotoPickerProps): JSX.Element => {
    const [entries, setEntries] = useState<PhotoEntry[]>(() =>
        initialUrls.map((url, i) => ({ key: `existing-${i}-${url}`, preview: url, url, status: "done" as const })));
    const [dragging, setDragging] = useState(false);
    const svc = useRef(new InventorySvc());
    const queue = useRef<string[]>([]);
    const active = useRef(0);
    const files = useRef(new Map<string, File>());
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => { onChangeRef.current(entries); }, [entries]);

    const patch = (key: string, p: Partial<PhotoEntry>) =>
        setEntries(prev => prev.map(e => e.key === key ? { ...e, ...p } : e));

    const pump = () => {
        while (active.current < MAX_CONCURRENCY && queue.current.length > 0) {
            const key = queue.current.shift()!;
            const file = files.current.get(key);
            if (!file) continue;
            active.current++;
            patch(key, { status: "uploading", error: undefined });
            prepareImage(file)
                .then(prepared => svc.current.uploadImage(prepared).execute())
                .then(url => { files.current.delete(key); patch(key, { url, status: "done" }); })
                .catch((e: unknown) => patch(key, { status: "error", error: e instanceof Error ? e.message : String(e) }))
                .finally(() => { active.current--; pump(); });
        }
    };

    const addFiles = (list: FileList | File[]) => {
        const images = Array.from(list).filter(f => f.type.startsWith("image/") || /\.(hei[cf]|jpe?g|png|webp)$/i.test(f.name));
        if (images.length === 0) return;
        const added: PhotoEntry[] = images.map(f => {
            const key = crypto.randomUUID();
            files.current.set(key, f);
            queue.current.push(key);
            return { key, preview: "", file: f, status: "uploading" };
        });
        setEntries(prev => [...prev, ...added]);
        pump();
    };

    const retry = (key: string) => {
        queue.current.push(key);
        patch(key, { status: "uploading", error: undefined });
        pump();
    };

    const remove = (key: string) => {
        files.current.delete(key);
        queue.current = queue.current.filter(k => k !== key);
        setEntries(prev => prev.filter(e => e.key !== key));
    };

    const move = (from: number, to: number) => setEntries(prev => moveItem(prev, from, to));

    return (
        <Box>
            <Text size="sm" fw={500}>Photos</Text>
            <Text size="xs" c="dimmed" mb={4}>The first photo is the cover. HEIC photos are converted automatically.</Text>
            <Box
                component="label"
                onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e: React.DragEvent) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                style={{
                    display: "block", padding: 16, textAlign: "center", cursor: "pointer", borderRadius: 8,
                    border: "2px dashed var(--mantine-color-gray-5)",
                    background: dragging ? "var(--mantine-color-blue-light)" : undefined
                }}
            >
                <Text size="sm">Drop photos here or click to select</Text>
                <input
                    type="file"
                    accept={ACCEPT}
                    multiple
                    hidden
                    onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                />
            </Box>
            <SimpleGrid cols={2} spacing="xs" mt="xs">
                {entries.map((e, i) => (
                    <Box key={e.key} pos="relative" style={{ border: "1px solid var(--mantine-color-gray-3)", borderRadius: 6, overflow: "hidden" }}>
                        <Box h={110} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {e.status === "uploading" && <Loader size="sm" />}
                            {e.status === "error" && <Text size="xs" c="red" p={4}>{e.error ?? "Upload failed"}</Text>}
                            {e.status === "done" && <Image src={e.url} h={110} fit="cover" />}
                        </Box>
                        {i === 0 && <Badge pos="absolute" top={4} left={4} size="xs">Cover</Badge>}
                        <Group gap={2} justify="center" p={2}>
                            <ActionIcon size="sm" variant="subtle" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move earlier"><IconArrowLeft size={14} /></ActionIcon>
                            {i > 0 && <ActionIcon size="sm" variant="subtle" onClick={() => move(i, 0)} aria-label="Make cover"><IconStar size={14} /></ActionIcon>}
                            {e.status === "error" && <ActionIcon size="sm" variant="subtle" onClick={() => retry(e.key)} aria-label="Retry"><IconRefresh size={14} /></ActionIcon>}
                            <ActionIcon size="sm" variant="subtle" disabled={i === entries.length - 1} onClick={() => move(i, i + 1)} aria-label="Move later"><IconArrowRight size={14} /></ActionIcon>
                            <ActionIcon size="sm" variant="subtle" color="red" onClick={() => remove(e.key)} aria-label="Remove"><IconX size={14} /></ActionIcon>
                        </Group>
                    </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
};
