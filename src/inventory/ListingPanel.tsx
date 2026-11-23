import { Button, Drawer, Select, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { InventorySvc } from "../domain/services/InventorySvc";
import { useForm } from "@mantine/form";
import { InventoryItemType } from "../domain/types/InventoryItem";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../domain/services/CacheKeys";
import { IListingPanelProps } from "./IListingPanelProps";
import { PhotoEntry, PhotoPicker } from "./PhotoPicker";
import { getPhotos } from "../utils/photos";


export const ListingPanel = (props: IListingPanelProps): JSX.Element => {
    const queryClient = useQueryClient();

    // File upload state variables
    const inventorySvc = new InventorySvc();
    const [photos, setPhotos] = useState<PhotoEntry[]>([]);
    const [pickerKey, setPickerKey] = useState(0);
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
            if (photos.length === 0) throw new Error("At least one photo is required");
            const imgUrls = photos.map(p => p.url!);
            if (props.item == undefined) {
                await inventorySvc.addInventoryItem({ ...values, imgUrls, sold: false }).execute();
            } else {
                await inventorySvc.patchInventoryItem({ ...values, imgUrls, id: props.item.id, sold: false }).execute();
            }

            queryClient.invalidateQueries({ queryKey: CacheKeys.Inventory });
            onDismiss();
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            console.error("Operation failed", error);
            setError(error);
            setLoading(false);
        }
    }

    const photosReady = photos.length > 0 && photos.every(p => p.status === "done");
    const photosDirty = props.item !== undefined &&
        JSON.stringify(photos.map(p => p.url)) !== JSON.stringify(getPhotos(props.item));
    const canSubmit = photosReady && (props.item === undefined || form.isDirty() || photosDirty);

    const onDismiss = () => {
        props.onDismiss();
        // clear state for next open of drawer
        setError(null);
        setPhotos([]);
        setPickerKey(k => k + 1);
        form.reset();
    }

    return (
        <Drawer position="right" opened={props.isOpen} onClose={onDismiss} title={props.item === undefined ? "Add a new listing" : "Edit a listing"}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap={"8px"}>
                    <PhotoPicker
                        key={pickerKey}
                        initialUrls={props.item ? getPhotos(props.item) : []}
                        onChange={setPhotos}
                    />
                    {error && <Text c="red">{error.message}</Text>}
                    {<><TextInput
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
                                {!isLoading && <Button style={{ marginTop: "12px" }} disabled={!canSubmit} type="submit">Add listing!</Button>}
                                {isLoading && <Button style={{ marginTop: "12px" }} disabled={true} >Adding...</Button>}
                            </>
                        }
                        {props.item !== undefined &&
                            <>
                                {!isLoading && <Button style={{ marginTop: "12px" }} disabled={!canSubmit} type="submit">Save listing!</Button>}
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