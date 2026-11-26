export const formatInquiryDate = (ts?: number) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
};
