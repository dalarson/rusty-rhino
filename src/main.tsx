import { AppShell } from "@mantine/core";
import { Header } from "./Header/Header";

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
        <>Content</>
      </AppShell.Main>
    </AppShell>
  );
}