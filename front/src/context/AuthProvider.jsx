import React, { useState,useEffect,createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext=createContext();

export const AuthProvider = ({children}) => {
    const [auth,setAuth]=useState({});
    const [counters,setCounters]=useState({});
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
      authUser();
    },[]);

    const authUser=async()=>{
        //sacar datso identificado del localstorage
        const token=localStorage.getItem("token");
        const user=localStorage.getItem("user");

        //Comprobar si tengo el token y user
        if(!token || !user){
          setLoading(false);
            return false;
        }

        //Transformar los datos use r a objeto javascript
        const userObj=JSON.parse(user);
        const userId=userObj.id;

        //Peticio ajax al backend para comprobar el token y que devuelva los datos del usuario
        const request=await fetch(Global.url+"user/profile/"+userId,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":token
            }
        });

        //Peticio ajax al backend para obtener los cantidades de seguidos y seguidores
        const requestCounters=await fetch(Global.url+"user/counters/"+userId,{
          method:"GET",
          headers:{
              "Content-Type":"application/json",
              "Authorization":token
          }
      });

        const data=await request.json();
        const dataCounters=await requestCounters.json();
        //Setear al estado auth
        setAuth(data.user);
        setCounters(dataCounters);
        setLoading(false);
        
    }

  return (
    <AuthContext.Provider value={{auth,setAuth,counters,setCounters,loading,authUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
