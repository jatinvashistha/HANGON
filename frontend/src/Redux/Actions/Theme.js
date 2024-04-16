import { changeTheme } from "../Reducers/Theme"


export const changeThemee = (theme) =>(dispatch) =>{
 dispatch(changeTheme(theme))
}