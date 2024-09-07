import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hook/useAppStore'
import { createAction } from '@reduxjs/toolkit'
import { useLocation } from 'react-router-dom'
import { logout } from '../slice/authSlice'

const getUser = createAction('auth/getUser')

const useGetUser = (...noAuthRequiredRoutes: string[]): boolean => {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const userDetail = useAppSelector(state => state.auth.userDetail)

    useEffect(() => {
        if (noAuthRequiredRoutes.some(route => location.pathname.includes(route)) || userDetail) {
            dispatch(logout())
            return
        }

        dispatch(getUser())
    }, [])


    if (userDetail === undefined) return true
    return false

}

export default useGetUser