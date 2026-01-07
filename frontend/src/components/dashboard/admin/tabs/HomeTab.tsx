import {  useAppSelector } from "../../../redux/app/hook"


export const HomeTab = () => {
   
    const user=useAppSelector(state=>state.login.user)
    
    
  return (
    <div>
        <h2 className="text-[25px] font-bold">Welcome 👋 {user?.name}</h2>
    </div>
  )
}
