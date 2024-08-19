import { z, ZodSchema } from 'zod';
import type { Context, Next } from 'hono';
import type { ValidationSource } from '../types';
import { createValidationError, CatchAsyncError } from '../libs/utils';

export const validationMiddleware = <S>(source : ValidationSource, schema : ZodSchema) => {
    return CatchAsyncError(async (context : Context, next : Next) => {
        // @ts-expect-error // type bug
        const data = await context.req[source]();
        const handelValidation : Record<ValidationSource, (data : S, schema : ZodSchema<S>) => Promise<z.SafeParseReturnType<unknown, unknown>>> = {
            json : validate, query : validate, param : validate
        };

        const validationResult = await handelValidation[source](data, schema);
        if (!validationResult.success) throw createValidationError(validationResult.error?.issues[0].message);
        context.req.validationData = {
            [source] : validationResult.data as z.infer<typeof schema>
        };
        await next();
    });
}

const validate = async (data : unknown, schema : ZodSchema) : Promise<z.SafeParseReturnType<unknown, unknown>> => {
    return schema.safeParse(data)
};