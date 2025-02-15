import { COMPANY_URL } from '../config';
import { apiSlice } from './apiSlice';

export const companyApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompany: builder.query({
            query: () => ({
                url: COMPANY_URL,
                credentials: 'include'
            }),
            providesTags: ['Company'],
            keepUnusedDataFor: 5,
        }),
        addCompany:builder.mutation({
            query: (body) => ({
                url: COMPANY_URL + '/add',
                method: 'POST',
                body,
                credentials: 'include'
            }),
            invalidatesTags: ['Company']
        }),
        updateCompany: builder.mutation({
            query: (body) => ({
                url: COMPANY_URL + '/'+body.id,
                method: 'PUT',
                body,
                credentials: 'include'
            }),
            invalidatesTags: ['Company']
        }),
        deleteCompany: builder.mutation({
            query: (id) => ({
                url: COMPANY_URL + '/'+id,
                method: 'DELETE',
                credentials: 'include'
            }),
            invalidatesTags: ['Company']
        }),
        getCompanyByUserId: builder.query({
            query: (id) => ({
                url: COMPANY_URL + '/user/'+id,
                credentials: 'include'
            }),
            providesTags: ['Company']
        })
    })
});

export const { 
    useGetCompanyQuery, 
    useAddCompanyMutation, 
    useUpdateCompanyMutation, 
    useDeleteCompanyMutation,
    useGetCompanyByUserIdQuery
} = companyApiSlice;
export default companyApiSlice;