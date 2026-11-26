import { AppShell, Group, Container } from "@mantine/core";
import { Header } from "./header/Header";
import { Inventory } from "./inventory/Inventory";
import { Inquiries } from "./inquiries/Inquiries";
import { InquiryDetails } from "./inquiries/InquiryDetails";
import { ListingDetails } from "./inventory/ListingDetails";
import { useAuth } from "./auth/useAuth";
import { Landing } from "./landing/Landing";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
];

const Navigation = () => {
    const { isAdmin } = useAuth();
    const location = useLocation();
    const all = isAdmin ? [...links, { to: "/inquiries", label: "Inquiries" }] : links;

    return (
        <Group gap="lg">
            {all.map((l) => (
                <Link key={l.to} to={l.to} className="nav-link" data-active={location.pathname === l.to}>
                    {l.label}
                </Link>
            ))}
        </Group>
    );
};

const Page = ({ children }: { children: React.ReactNode }) => (
    <Container size="lg" py="xl" className="fade-up">{children}</Container>
);

export const Main = (): JSX.Element => {
    return (
        <BrowserRouter>
            <AppShell
                header={{ height: 60 }}
                padding={0}
            >
                <AppShell.Header className="site-header">
                    <Header title={"Rusty Rhino"} tabs={<Navigation />} />
                </AppShell.Header>
                <AppShell.Main>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/shop" element={<Page><Inventory /></Page>} />
                        <Route path="/listing/:id" element={<Page><ListingDetails /></Page>} />
                        <Route path="/inquiries" element={<Page><Inquiries /></Page>} />
                        <Route path="/inquiries/:id" element={<Page><InquiryDetails /></Page>} />
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
}