import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { InputHTMLAttributes } from "react"

export type FormInputVariant = 'password' | 'name' | 'email'

export type FormInputProps<T extends FieldValues> = {
    register: UseFormRegister<T>
    label: Path<T>
    variant?: FormInputVariant
} & InputHTMLAttributes<HTMLInputElement>