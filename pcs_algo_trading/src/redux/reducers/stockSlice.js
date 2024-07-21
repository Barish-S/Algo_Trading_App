import { createSlice } from '@reduxjs/toolkit'

export const stockSlice = createSlice({
  name: 'stockData',
  initialState: {
    sidebarStatus:"company_list"
  },

  reducers: {
    setSidebarStatus:(state,action)=>{
      state.sidebarStatus=action.payload
    }
  },

})


export default stockSlice.reducer
export const {setLoader,setSidebarStatus } = stockSlice.actions
