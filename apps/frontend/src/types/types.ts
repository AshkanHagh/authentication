import { ReactNode } from "react";

type ButtonVariant =
    'btn-neutral' |
    'btn-primary' |
    'btn-secondary' |
    'btn-accent' |
    'btn-ghost' |
    'btn-link' |
    'btn-info' |
    'btn-success' |
    'btn-warning' |
    'btn-error'

    

type ButtonType =
    'submit' |
    'reset' |
    'button';

type ButtonSize =
    'btn-xs' |
    'btn-sm' |
    'btn-lg';

export type PrimaryButton = {
    children: ReactNode,
    className: string
    type: ButtonType
    variant: ButtonVariant
    size: ButtonSize
    outline: true,
    active: true
}