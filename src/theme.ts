import { createTheme, MantineColorsTuple } from "@mantine/core";

const rust: MantineColorsTuple = [
    "#fdf3ee", "#f6e2d7", "#ecc3ac", "#e1a27f", "#d78559",
    "#d0713d", "#b7552a", "#a24a22", "#8f3f1c", "#7a3414",
];

const barn: MantineColorsTuple = [
    "#f6f3ef", "#e8e3dc", "#d3c9bc", "#bdac98", "#a99179",
    "#9c826a", "#8a7058", "#6f5a47", "#4a3d32", "#2b231d",
];

export const theme = createTheme({
    primaryColor: "rust",
    primaryShade: { light: 6, dark: 5 },
    colors: { rust, barn },
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "Fraunces, Georgia, 'Times New Roman', serif",
        fontWeight: "600",
    },
    defaultRadius: "md",
    radius: { md: "10px", lg: "16px", xl: "24px" },
    shadows: {
        xs: "0 1px 2px rgba(43,35,29,0.06), 0 1px 1px rgba(43,35,29,0.04)",
        md: "0 8px 24px rgba(43,35,29,0.10)",
    },
});
