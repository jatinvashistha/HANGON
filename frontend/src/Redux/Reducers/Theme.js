import { createSlice } from "@reduxjs/toolkit";
import { theme1, theme2 } from "../../theme";

export const themeSlice = createSlice({
    name : 'theme',

    initialState : {
        
         theme :    theme1
        
    },
    reducers : {
        changeTheme :(state,action) =>{
            return {
                ...state, 
                theme : action.payload
            }

        }
    }
})

export const {changeTheme} = themeSlice.actions