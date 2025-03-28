import { USERS_URL } from "../config";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: USERS_URL + "/login",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
        register: builder.mutation({
            query: (body) => ({
                url: USERS_URL + "/register",
                method: "POST",
                body,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
        logout: builder.mutation({
            query: () => ({
                url: USERS_URL + "/logout",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
        getProfile: builder.query({
            query: (id) => ({
                url: USERS_URL + "/" + id,
                credentials: "include", // Added credentials
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5,
        }),
        updateProfile: builder.mutation({
            query: (body) => ({
                url: USERS_URL + "/" + body.id,
                method: "PUT",
                body,
                credentials: "include", // Added credentials
            }),
            invalidatesTags: ["User"],
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: USERS_URL,
                credentials: "include", // Added credentials
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5,
        }),
        getUserProfile: builder.query({
            query: (id) => ({
                url: USERS_URL + "/" + id,
                credentials: "include", // Added credentials
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: USERS_URL + "/" + id,
                method: "DELETE",
                credentials: "include", // Added credentials
            }),
            invalidatesTags: ["User"],
        }),
        sendVerificationEmail: builder.mutation({
            query: (body) => ({
                url: USERS_URL + "/send-verification-email",
                method: "POST",
                body,
                credentials: "include", // Added credentials
            }),
            invalidatesTags: ["User"],
        }),
        verifyUserEmail: builder.mutation({
            query: ({ token }) => ({
                url: USERS_URL + `/verify/verify-email?token=${token}`,
                method: "GET",
                credentials: "include", // Added credentials
            }),
            invalidatesTags: ["User"],
        }),
        processPdf: builder.mutation({
            query: (formData) => ({
                url: USERS_URL + "/process-pdf",
                method: "POST",
                body: formData,
                formData: true,
                credentials: "include",
            }),
        }),
        generateCoverLetter: builder.mutation({
            query: (body) => ({
                url: USERS_URL + "/generate-cover-letter",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        extractJobInfo: builder.mutation({
            query: (data) => ({
                url: USERS_URL + "/extract-job-info",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useSendVerificationEmailMutation,
    useVerifyUserEmailMutation,
    useProcessPdfMutation,
    useGenerateCoverLetterMutation,
    useExtractJobInfoMutation,
} = userApiSlice;

export default userApiSlice;
