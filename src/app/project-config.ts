export interface ProjectConfig {
    id: string;
    name: string;
    path: string;
    intents: any;
    welcome: string;
    fallback: string;
    activePrompts: string[];
}