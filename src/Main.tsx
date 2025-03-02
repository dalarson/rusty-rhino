import { AppShell } from "@mantine/core";
import { Header } from "./header/Header";
import { Inventory } from "./inventory/Inventory";

export const Main = (): JSX.Element => {

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Header title={"Rusty Rhino"}></Header>
            </AppShell.Header>
            <AppShell.Main>
                <Inventory />
            </AppShell.Main>
        </AppShell>
    );
}