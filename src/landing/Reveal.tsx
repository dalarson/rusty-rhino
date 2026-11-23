import { ReactNode, useEffect, useRef, useState } from "react";

export const Reveal = ({ children, delay = 0 }: { children: ReactNode, delay?: number }): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.15 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`reveal${visible ? " visible" : ""}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
            {children}
        </div>
    );
};
