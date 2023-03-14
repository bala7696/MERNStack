import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false
    },
    reducers: {
        productsRequest(state, action) {
            return {
                loading: true
            }
        },
        productsSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products,
                productsCount: action.payload.count,
                resultPerPage: action.payload.resultPerPage
            }
        },
        productsFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        adminProductRequest(state, action) {
            return {
                loading: true
            }
        },
        adminProductSuccess(state, action) {
            return {
                loading: false,
                products: action.payload.products
            }
        },
        adminProductFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        },
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
    }
});

const { actions, reducer } = productsSlice;

export const {
    productsRequest,
    productsSuccess,
    productsFail,
    adminProductRequest,
    adminProductSuccess,
    adminProductFail,
    clearError

} = actions;

export default reducer;

