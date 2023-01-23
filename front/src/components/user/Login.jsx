import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate=useNavigate();
    const { form,changed }=useForm({});
    const [login,setLogin]=useState("not-sended");
    const {setAuth}=useAuth();

    const loginUser=async(e)=>{

      e.preventDefault();

      let userToLogin=form;
      //petición al backend
      const request=await fetch(Global.url+"user/login",{
        method:"POST",
        body:JSON.stringify(userToLogin),
        headers:{"Content-Type":"application/json"}
      });

      const data=await request.json();
      console.log(data)
      
      if(data.status=="success"){
        //persistir los datos en el navegador
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        setLogin("login");

        //Set datos en el auth
        setAuth(data.user);
      
          setTimeout(()=>{
           window.location.reload();
          
            
         },1000)
        
        //Redirección
       
      }else{
        setLogin("error");
      }
    }

    return (
        <>
            <header className="content__header content_header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
            {login==="login" ? <strong className='alert alert-success'>Usuario Logueado Correctamente!!</strong>:''}
        {login==="error" ? <strong className='alert alert-danger'>Usuario NO Identificado!!</strong>:''}
                <form className='form-login' onSubmit={loginUser}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type="email" name="email" onChange={changed}/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Contraseña</label>
                        <input type="password" name="password" onChange={changed}/>
                    </div>
                    <input type="submit" value="Identificate" className='btn btn-success'/>
                </form>
            </div>
        </>
    )
}
