export const scrollToId = (id: string, offset: number = 80) => {
    // Use setTimeout to ensure DOM is fully rendered/updated, especially after route changes
    setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;

        element.scrollIntoView({ behavior: 'smooth' });
    }, 0);
};
