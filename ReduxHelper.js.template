/**
 * /src/helpers/ReduxHelper.js
 *
 * ReduxSlice를 작업하면서 반복되는 중복코드의 모듈화
 */
import { createSlice } from '@reduxjs/toolkit';

// 리덕스가 로딩 상태를 관리하는 상태값을 생성하는 함수
const pending = (state, {meta, payload}) => {
    return {...state, loading: true}
};

// 리덕스가 성공 상태를 관리하는 상태값을 생성하는 함수
const fulfilled = (state, {meta, payload}) => {
    return {
        status: payload.status,
        message: payload.message,
        item: payload.item,
        timestamp: payload.timestamp,
        loading: false
    }
};

// 리덕스가 실패 상태를 관리하는 상태값을 생성하는 함수
const rejected = (state, {meta, payload}) => {
    return {
        ...state,
        loading: false,
        status: payload?.status || 0,
        message: payload?.message || 'Unknown Error'
    }
};

const reduxHelper = {

    // 리덕스 Slice 객체를 생성하는 함수
    // 1) sliceName: slice 객체의 이름
    // 2) extraReducers: 비동기 처리를 위한 액션함수 배열
    // 3) callback : 비동기 처리 성공시 호출할 콜백함수. 없다면 기본 fulfilled 함수 호출
    getDefaultSlice: (slideName, extraReducers=[], callback={}, reducers={}) => {
        return createSlice({
            name: slideName,
            initialState: {
                status: 200,
                message: "OK",
                item: null,
                timestamp: null,
                loading: false,
            },
            reducers: reducers,
            extraReducers: (builder) => {
                extraReducers.forEach((v, i) => {
                    builder.addCase(v.pending, pending);
                    builder.addCase(v.fulfilled, callback[v.fulfilled] || fulfilled);
                    builder.addCase(v.rejected, rejected);
                })
            }
        });
    }
}

export default reduxHelper;