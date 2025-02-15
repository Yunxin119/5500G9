import { createSlice } from '@reduxjs/toolkit';
import { companies } from '../sampleData/companies';

const initialState = {
    companies: companies
}

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        // temp reducer without backend
        getCompanies: (state) => {
            return state.companies;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        addCompany: (state, action) => {
            state.companies.push(action.payload);
        },
        updateCompany: (state, action) => {
            const index = state.companies.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.companies[index] = action.payload;
            }
        },
        deleteCompany: (state, action) => {
            state.companies = state.companies.filter(c => c.id !== action.payload);
        }
    }
});

export const { getCompanies, setCompanies, addCompany, updateCompany, deleteCompany } = companySlice.actions;
export default companySlice.reducer;