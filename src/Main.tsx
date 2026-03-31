import { AppShell, Tabs } from "@mantine/core";
import { Header } from "./header/Header";
import { Inventory } from "./inventory/Inventory";
import { Inquiries } from "./inquiries/Inquiries";
import { useAuth } from "./auth/useAuth";

export const Main = (): JSX.Element => {
    const { isAdmin } = useAuth();

    const tabsList = (
        <Tabs.List style={{ borderBottom: "none" }}>
            <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
            {isAdmin && <Tabs.Tab value="inquiries">Inquiries</Tabs.Tab>}
        </Tabs.List>
    );

    return (
        <Tabs defaultValue="inventory">
            <AppShell
                header={{ height: 60 }}
                padding="md"
            >
                <AppShell.Header>
                    <Header title={"Rusty Rhino"} tabs={tabsList} />
                </AppShell.Header>
                <AppShell.Main>
                    <Tabs.Panel value="inventory">
                        <Inventory />
                    </Tabs.Panel>
                    {isAdmin && (
                        <Tabs.Panel value="inquiries">
                            <Inquiries />
                        </Tabs.Panel>
                    )}
                </AppShell.Main>
            </AppShell>
        </Tabs>
    );
}