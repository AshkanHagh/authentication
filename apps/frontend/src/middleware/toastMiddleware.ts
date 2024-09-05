import { isRejectedWithValue, Middleware, SerializedError } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { toast } from "sonner";
import { errorHandling } from "../utils/errorHandling";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const toastMiddleware: Middleware<{}, RootState> = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error = action.payload as (SerializedError | FetchBaseQueryError)
        toast.error(errorHandling(error))
    }
    return next(action)
}

export default toastMiddleware