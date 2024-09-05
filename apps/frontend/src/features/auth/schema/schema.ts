import z from 'zod'

import {
    loginSchema as loginSchemaBackend,
    registerSchema as registerSchemaBackend
} from "../../../../../types";

export const loginSchema = loginSchemaBackend.pick({ password: true })
export const registerSchema = registerSchemaBackend.omit({ email: true })


export type FormLoginSchema = z.infer<typeof loginSchema>
export type FormRegisterSchema = z.infer<typeof registerSchema>