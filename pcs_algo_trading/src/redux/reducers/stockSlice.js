import { createSlice } from '@reduxjs/toolkit'

export const stockSlice = createSlice({
  name: 'stockData',
  initialState: {
    sidebarStatus:"company_list",
    datas:[]
  },

  reducers: {
    setAllData:(state,action)=>{
      state.datas=action.payload
    },
    setSidebarStatus:(state,action)=>{
      state.sidebarStatus=action.payload
    }
  },

})


export default stockSlice.reducer
export const {setAllData,setSidebarStatus } = stockSlice.actions
