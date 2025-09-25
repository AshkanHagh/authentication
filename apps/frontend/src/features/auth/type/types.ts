import { FieldValues, Path, UseFormRegister } from "react-hook-form"
import { InputHTMLAttributes } from "react"
import { LoginResponse } from "../../../../../types"

export type FormInputVariant = "password" | "name" | "email"

export type FormInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  label: Path<T>
  variant?: FormInputVariant
} & InputHTMLAttributes<HTMLInputElement>

export type LoginResponseWithoutState = Omit<LoginResponse<"loggedIn">, "state">
