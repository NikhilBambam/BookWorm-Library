
// import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import AddNewAdmin from '../../popups/AddNewAdmin';


// const userSlice = createSlice({
//     name:"user",
//     initialState:{
//         users:[],
//         loading:false,
//     },
//     reducers:{
//         fetchAllUsersRequest(state){
//             state.loading=true;
//         },
//         fetchAllUsersSuccess(state,action){
//             state.loading=false;
//             state.users=action.payload;
//         },
//         fetchAllUsersFailed(state){
//            state.loading=false; 
//         },
//         addNewAdminRequest(state){
//             state.loading=true;
//         },
//         addNewAdminSuccess(state){
//             state.loading=false;
            
//         },
//         addNewAdminFailed(state){
//             state.loading=false;
//         },
//     }
// });

// export const fetchAllUsers=()=>async(dispatch)=>{
//     dispatch(userSlice.actions.fetchAllUsersRequest());
//     await axios.get("http://localhost:4000/api/v1/user/all",{withCredentials:true}).then((res)=>{

//         dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users))
//         .catch(err=>{
//             dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
            
//         })
//     })
// };

// export const addNewAdmin=(data)=>async(dispatch)=>{
//     dispatch(userSlice.actions.addNewAdminRequest());
//     await axios.post("http://localhost:4000/api/v1/user/add/new-admin",data,{
//         withCredentials:true,
//         headers:{
//             "Content-Type":"multipart/form-data",
//         },
//     }).then((res)=>{
//         dispatch(userSlice.actions.addNewAdminSuccess());
//         toast.success(res.data.message);
//     }).catch(err=>{
//         dispatch(userSlice.actions.addNewAdminFailed());
//         toast.error(err.response.data.message);
//     })
// }

// export default userSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toggleAddNewAdminPopup } from './popUpSlice';

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchAllUsersRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchAllUsersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload;
        },
        fetchAllUsersFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addNewAdminRequest(state) {
            state.loading = true;
            state.error = null;
        },
        addNewAdminSuccess(state) {
            state.loading = false;
        },
        addNewAdminFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    try {
        const res = await axios.get("http://localhost:4000/api/v1/user/all", { withCredentials: true });
        dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
    } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch users";
        dispatch(userSlice.actions.fetchAllUsersFailed(message));
        toast.error(message);
    }
};

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    try {
        const res = await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        dispatch(userSlice.actions.addNewAdminSuccess());
        toast.success(res.data.message);
        dispatch(toggleAddNewAdminPopup());
    } catch (err) {
        const message = err.response?.data?.message || "Failed to add admin";
        dispatch(userSlice.actions.addNewAdminFailed(message));
        toast.error(message);
    }
};

export default userSlice.reducer;
