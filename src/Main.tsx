import { AppShell, Group, Button } from "@mantine/core";
import { Header } from "./header/Header";
import { Inventory } from "./inventory/Inventory";
import { Inquiries } from "./inquiries/Inquiries";
import { ListingDetails } from "./inventory/ListingDetails";
import { useAuth } from "./auth/useAuth";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const Navigation = () => {
    const { isAdmin } = useAuth();
    const location = useLocation();

    return (
        <Group gap="xs">
            <Button 
                component={Link} 
                to="/" 
                variant={location.pathname === '/' ? 'filled' : 'subtle'}
            >
                Inventory
            </Button>
            {isAdmin && (
                <Button 
                    component={Link} 
                    to="/inquiries" 
                    variant={location.pathname === '/inquiries' ? 'filled' : 'subtle'}
                >
                    Inquiries
                </Button>
            )}
        </Group>
    );
};

export const Main = (): JSX.Element => {
    return (
        <BrowserRouter>
            <AppShell
                header={{ height: 60 }}
                padding="md"
            >
                <AppShell.Header>
                    <Header title={"Rusty Rhino"} tabs={<Navigation />} />
                </AppShell.Header>
                <AppShell.Main>
                    <Routes>
                        <Route path="/" element={<Inventory />} />
                        <Route path="/listing/:id" element={<ListingDetails />} />
                        <Route path="/inquiries" element={<Inquiries />} />
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
}