import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit";
import { ResponseError } from "../types/types";


const handleFetchBaseQueryError = (error: FetchBaseQueryError): string => {
    if (typeof error.status === 'number') {
        return (error.data as ResponseError).message || 'An unknown error has occurred'
    }

    switch (error.status) {
        case 'FETCH_ERROR':
            return `Server connection error: ${error.error}`
        case 'PARSING_ERROR':
            return `Data processing error: ${error.error}`
        case 'TIMEOUT_ERROR':
            return `Your request failed due to response timeout. Please try again: ${error.error}`
        default:
            return 'An unknown error has occurred'
    }
}

const handleSerializedError = (error: SerializedError): string => {
    return `Error: ${error.message || 'Unknown error'}`
}

export const errorHandling = (error: FetchBaseQueryError | SerializedError): string => {
    return ('status' in error)
        ? handleFetchBaseQueryError(error)
        : handleSerializedError(error)
}