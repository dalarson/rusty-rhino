import { Button, Drawer, FileInput, Image, Select, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useForm } from "@mantine/form";
import { InventoryItem, InventoryItemType } from "../domain/types/InventoryItem";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../domain/services/CacheKeys";
import { IListingPanelProps } from "./IListingPanelProps";


export const ListingPanel = (props: IListingPanelProps): JSX.Element => {
    const queryClient = useQueryClient();

    // File upload state variables
    const inventorySvc = new InventorySvc();
    const [file, setFile] = useState<File | null>(null);
    const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
    const [afterFiles, setAfterFiles] = useState<File[]>([]);
    const [error, setError] = useState<Error | null>(null);

    // loading state for mutation
    const [isLoading, setLoading] = useState<boolean>(false);

    const cannotBeEmpty = (value: string) => { if (value.length === 0) return "Value cannot be empty." }
    // FORM Metadata
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: props.item !== undefined ? {
            name: props.item.name,
            description: props.item.description,
            price: props.item.price,
            type: props.item.type
        } : {
            name: '',
            description: '',
            price: 0,
            type: InventoryItemType.Misc
        },
        validate: {
            name: cannotBeEmpty,
            description: cannotBeEmpty,
            price: (value: number) => (/^\d+(,\d{1,2})?$/.test(value.toString()) ? null : "Price must be valid format (i.e. 79.95)."),
            type: () => null
        }
    })

    const onSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            // if props.item is undefined we are adding an item
            if (props.item == undefined) {
                if (!file) throw new Error("Main image is required");

                // Prepare all upload tasks
                const uploadTasks = [inventorySvc.uploadImage(file).execute()];
                beforeFiles.forEach(f => uploadTasks.push(inventorySvc.uploadImage(f).execute()));
                afterFiles.forEach(f => uploadTasks.push(inventorySvc.uploadImage(f).execute()));

                const urls = await Promise.all(uploadTasks);
                const mainImgUrl = urls[0];
                const beforeImgUrls = urls.slice(1, 1 + beforeFiles.length);
                const afterImgUrls = urls.slice(1 + beforeFiles.length);

                const inventoryDto: InventoryItem = {
                    ...values,
                    imgUrl: mainImgUrl,
                    beforeImgUrls,
                    afterImgUrls,
                    sold: false
                }
                await inventorySvc.addInventoryItem(inventoryDto).execute();
            } else {
                // if an item was passed in we are editing the item
                let beforeImgUrls = props.item.beforeImgUrls ?? [];
                let afterImgUrls = props.item.afterImgUrls ?? [];

                if (beforeFiles.length > 0 || afterFiles.length > 0) {
                    const uploadTasks: Promise<string>[] = [];
                    beforeFiles.forEach(f => uploadTasks.push(inventorySvc.uploadImage(f).execute()));
                    afterFiles.forEach(f => uploadTasks.push(inventorySvc.uploadImage(f).execute()));
                    
                    const urls = await Promise.all(uploadTasks);
                    const newBeforeUrls = urls.slice(0, beforeFiles.length);
                    const newAfterUrls = urls.slice(beforeFiles.length);
                    
                    beforeImgUrls = [...beforeImgUrls, ...newBeforeUrls].slice(0, 3);
                    afterImgUrls = [...afterImgUrls, ...newAfterUrls].slice(0, 3);
                }

                const inventoryItemDto: InventoryItem = {
                    ...values,
                    imgUrl: props.item.imgUrl,
                    id: props.item.id,
                    beforeImgUrls,
                    afterImgUrls,
                    sold: false
                }
                await inventorySvc.patchInventoryItem(inventoryItemDto).execute();
            }

            queryClient.invalidateQueries({ queryKey: CacheKeys.Inventory });
            onDismiss();
        } catch (e: any) {
            console.error("Operation failed", e);
            setError(e);
            setLoading(false);
        }
    }

    const onDismiss = () => {
        props.onDismiss();
        // clear state for next open of drawer
        setError(null);
        setFile(null);
        setBeforeFiles([]);
        setAfterFiles([]);
        form.reset();
    }

    return (
        <Drawer position="right" opened={props.isOpen} onClose={onDismiss} title={props.item === undefined ? "Add a new listing" : "Edit a listing"}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap={"8px"}>
                    {props.item == undefined && (
                        <FileInput
                            key={form.key('file')}
                            label="Select main image"
                            description="Make sure it's less than 2 MB, and .png or .jpg"
                            placeholder="click here to upload..."
                            onChange={setFile}
                            required
                        />
                    )}
                    
                    <FileInput
                        label="Before photos (max 3)"
                        placeholder="Upload before photos..."
                        multiple
                        value={beforeFiles}
                        onChange={(files) => setBeforeFiles(files.slice(0, 3))}
                    />

                    <FileInput
                        label="After photos (max 3)"
                        placeholder="Upload after photos..."
                        multiple
                        value={afterFiles}
                        onChange={(files) => setAfterFiles(files.slice(0, 3))}
                    />

                    {props.item && props.item.imgUrl && (
                        <>
                            <Text size="xs">Main image (not editable yet):</Text>
                            <Image src={props.item.imgUrl} mah={100} w="auto" />
                        </>
                    )}
                    {error && <Text c="red">{error.message}</Text>}
                    {((!props.item && file) || (props.item)) && <><TextInput
                        withAsterisk
                        label="Name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />
                        <TextInput
                            withAsterisk
                            label="Description"
                            key={form.key('description')}
                            {...form.getInputProps('description')}
                        />
                        <TextInput
                            withAsterisk
                            label="Price"
                            key={form.key('price')}
                            {...form.getInputProps('price')}
                        />
                        <Select
                            label="Type"
                            key={form.key('type')}
                            data={Object.values(InventoryItemType)}
                            {...form.getInputProps('type')}
                        />
                        {props.item == undefined &&
                            <>
                                {!isLoading && <Button style={{ marginTop: "12px" }} type="submit">Add listing!</Button>}
                                {isLoading && <Button style={{ marginTop: "12px" }} disabled={true} >Adding...</Button>}
                            </>
                        }
                        {props.item !== undefined &&
                            <>
                                {!isLoading && <Button style={{ marginTop: "12px" }} disabled={!form.isDirty()} type="submit">Save listing!</Button>}
                                {isLoading && <Button style={{ marginTop: "12px" }} disabled={true} >Saving...</Button>}
                            </>
                        }

                    </>
                    }
                </Stack>
            </form>
        </Drawer >
    );
}