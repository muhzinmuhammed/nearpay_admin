import { api } from "../api";

const userAuth = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (values) => ({
                url: '/v2/admin/login',
                method: 'POST',
                body: values,
            }),
        }),
        dashboard: builder.query({
            query: ({ page = 1, search = "" }) => ({
                url: `/v2/admin/all_user?page=${page}&search=${search}`, // Pass page and search as query parameters
                method: 'GET',
            }),
        }),
        updateUserScore: builder.mutation({
            query: ({ id, score }) => ({
                url: `/v2/admin/update_score/${id}`,
                method: 'PUT',
                body: { score },
            }),
        }),
    }),
});

// Corrected export names to match endpoint names
export const { 
    useLoginMutation, 
    useDashboardQuery, 
    useUpdateUserScoreMutation 
} = userAuth;

export default userAuth;
