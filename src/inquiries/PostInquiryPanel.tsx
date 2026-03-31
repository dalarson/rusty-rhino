import { Button, Drawer, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { useQueryClient } from "react-query";
import { CacheKeys } from "../domain/services/CacheKeys";
import { IPostInquiryPanelProps } from "./IPostInquiryPanelProps";
import { InterestSvc } from "../domain/services/InterestSvc";


export const PostInquiryPanel = (props: IPostInquiryPanelProps): JSX.Element => {
    const queryClient = useQueryClient();
    console.log("PostInquiryPanel props: ", props);

    // File upload state variables
    const interestSvc = new InterestSvc();
    const [error, setError] = useState<Error | null>(null);

    // loading state for mutation
    const [isLoading, setLoading] = useState<boolean>(false);

    const cannotBeEmpty = (value: string) => { if (value.length === 0) return "Value cannot be empty." }
    // FORM Metadata
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            inventoryItemId: props.listingId,
            name: '',
            email: '',
            message: '',
            phone: ''
        },
        validate: {
            inventoryItemId: cannotBeEmpty,
            name: cannotBeEmpty,
            email: cannotBeEmpty,
            message: (value: string) => value.length > 250 ? "Message must be less than 250 characters." : null,
        }
    });

    const onSubmit = async (values: typeof form.values) => {
        console.log(values);
        // if props.item is undefined we are adding an item
        setLoading(true);
        await interestSvc.postInterest(values).execute().then(() => {
            queryClient.invalidateQueries(CacheKeys.Interest);
            setLoading(false);
            props.onDismiss();
        }).catch((e: Error) => {
            console.log("Failed to post inquiry: ", e);
            setError(e);
            setLoading(false);
        })
    }

    const onDismiss = () => {
        props.onDismiss();
        // clear state for next open of drawer
        setError(null);
        form.reset();
    }

    return (
        <Drawer position="right" opened={props.isOpen} onClose={onDismiss} title={"Submit an inquiry"}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap={"8px"}>
                    {error && <Text c="red">{error.message}</Text>}
                    {<><TextInput
                        withAsterisk
                        label="Name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                        <TextInput
                            withAsterisk
                            label="Email"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <TextInput
                            withAsterisk
                            label="Phone"
                            key={form.key('phone')}
                            {...form.getInputProps('phone')}
                        />
                        <TextInput
                            withAsterisk
                            label="Message"
                            key={form.key('message')}
                            {...form.getInputProps('message')}
                        />
                        <>
                            {!isLoading && <Button style={{ marginTop: "12px" }} disabled={!form.isDirty()} type="submit">Post inquiry!</Button>}
                            {isLoading && <Button style={{ marginTop: "12px" }} disabled={true} >Posting...</Button>}
                        </>
                    </>
                    }
                </Stack>
            </form>
        </Drawer >
    );
}