/**
 * Props for the header component.
 */
export interface IHeaderProps {
    /**
     * The title of the application.
     */
    title: string;
    /**
     * Tab elements to render in the header.
     */
    tabs?: React.ReactNode;
}