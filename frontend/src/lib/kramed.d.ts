declare module 'kramed' {
    interface Kramed {
        (markdown: string): string;
    }
    const defaultKramed: Kramed;
    export default defaultKramed;
}
