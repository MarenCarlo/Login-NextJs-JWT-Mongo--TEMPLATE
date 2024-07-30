import { ChangeEvent } from "react";

export interface input {
    variant: 'default' | 'active',
    type: "text" | "password" | "file" | "color" | "number" | "date" | "radio",
    placeholder?: string,
    label?: string,
    className?: string,
    id?: string,
    name?: string,
    // value?: string | number | string[] | boolean,
    value?: any,
    disabled?: boolean,
    maxLength?: number | undefined,
    onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | (() => void),
    // defaultValue?: string | number | readonly string[] | boolean | undefined,
    defaultValue?: any,
    min?: number,
    max?: number,
    required?: boolean,
}