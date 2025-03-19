import { Button, Drawer, FileInput, Image, Select, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useForm } from "@mantine/form";
import { InventoryItem, InventoryItemType } from "../domain/types/InventoryItem";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../domain/services/CacheKeys";

export interface IListingPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    item?: InventoryItem;
}

const cannotBeEmpty = (value: any) => { if (value.length === 0) return "Value cannot be empty." }

export const ListingPanel = (props: IListingPanelProps): JSX.Element => {
    const queryClient = useQueryClient();

    console.log(props.item);

    // File upload state variables
    const inventorySvc = new InventorySvc();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // loading state for mutation
    const [isLoading, setLoading] = useState<boolean>(false);

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
        // if props.item is undefined we are adding an item
        if (props.item == undefined) {
            // upload image, await response
            setLoading(true);
            if (!file) throw new Error("no file available");
            return await inventorySvc.uploadImage(file).execute().then(async (imgUrl: string) => {
                const inventoryDto: InventoryItem = {
                    ...values,
                    imgUrl: imgUrl,
                    sold: false
                }
                await inventorySvc.addInventoryItem(inventoryDto).execute().then(() => {
                    // clear react query
                    queryClient.invalidateQueries({ queryKey: CacheKeys.Inventory });
                    onDismiss();
                }).catch((e: Error) => {
                    console.log("Failed to create inventory item");
                    setLoading(false);
                    throw e;
                })
            }).catch((e: Error) => {
                console.log("Failed to upload file");
                setError(e);
                setLoading(false);
            })
        } else {
            // if an item was passed in we are editing the item
            // TODO: if a new image was uploaded, delete old image and upload new image
            // for now images will not be editable
            setLoading(true);
            const inventoryItemDto: InventoryItem = {
                ...values,
                imgUrl: props.item.imgUrl,
                id: props.item.id,
                sold: false
            }
            await inventorySvc.patchInventoryItem(inventoryItemDto).execute().then(() => {
                queryClient.invalidateQueries({ queryKey: CacheKeys.Inventory });
                onDismiss();
            }).catch((error: Error) => {
                setError(error);
                setLoading(false);
            })
            // patch inventory item with new img url and other data
        }

    }

    const onDismiss = () => {
        props.onDismiss();
        // clear state for next open of drawer
        setError(null);
        setFile(null);
        form.reset();
    }

    return (
        <Drawer position="right" opened={props.isOpen} onClose={onDismiss} title={props.item === undefined ? "Add a new listing" : "Edit a listing"}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap={"8px"}>
                    {props.item == undefined && <FileInput
                        key={form.key('file')}
                        label="Select an image"
                        description="Make sure it's less than 2 MB, and .png or .jpg"
                        placeholder="click here to upload..."
                        onChange={setFile}
                        disabled={props.item !== undefined}
                    />}
                    {props.item && props.item.imgUrl && (
                        <>
                            <Text>Images are not editable yet, please delete and re-add to edit image.</Text>
                            <Image src={props.item.imgUrl} />
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