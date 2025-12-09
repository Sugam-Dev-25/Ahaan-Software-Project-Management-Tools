import { configureStore } from '@reduxjs/toolkit';
import  loginUsers  from '../features/User/login/loginSlice';
import registerUser from '../features/User/register/registerSlice'

export const store = configureStore({
    reducer: {
       login:loginUsers,
    register: registerUser
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
