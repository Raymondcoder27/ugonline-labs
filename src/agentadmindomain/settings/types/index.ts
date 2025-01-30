
export type AccessibilityTier = {
    text: string;
    value:string
};

export type Category = {
    id:string;
    name: string;
    icon_url:string;
};

export interface CreateServiceCategory{
    name: string;
    icon: string | ArrayBuffer | null;
}