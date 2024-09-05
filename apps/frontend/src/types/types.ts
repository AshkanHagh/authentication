import { ButtonHTMLAttributes, ReactNode } from "react";


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

type ButtonSize =
    'btn-xs' |
    'btn-sm' |
    'btn-lg';

export type Button = {
    children?: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    outline?: true
    active?: true
} & ButtonHTMLAttributes<HTMLButtonElement>


export type ResponseError = {
    success: boolean
    message: string
}