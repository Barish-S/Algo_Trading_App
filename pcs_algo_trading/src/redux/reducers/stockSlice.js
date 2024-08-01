import { createSlice } from '@reduxjs/toolkit'

export const stockSlice = createSlice({
  name: 'stockData',
  initialState: {
    sidebarStatus:"company_list",
    datas:[],
    pageStatus:"history_forward",
    loader:false
  },

  reducers: {
    setAllData:(state,action)=>{
      state.datas=action.payload
    },
    setSidebarStatus:(state,action)=>{
      state.sidebarStatus=action.payload
    },
    setPageStatus:(state,action)=>{
      state.pageStatus=action.payload
    },
    setLoader:(state,action)=>{
      state.loader=action.payload
    },
  },

})


export default stockSlice.reducer
export const {setAllData,setSidebarStatus,setPageStatus,setLoader } = stockSlice.actions
