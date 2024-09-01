import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const authFormSchema = () =>
    z.object({
        //both
        email: z.string().email(),
        password: z.string().min(8),
    });
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
export const removeSpecialCharacters = (value: string) => {
    return value.replace(/[^\w\s]/gi, "");
};
