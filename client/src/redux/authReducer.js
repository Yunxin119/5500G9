import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setCredential: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
        updateUser: (state, action) => {
            state.userInfo = {...state.userInfo, ...action.payload};
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        }
    }
})

export const {setCredential, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;