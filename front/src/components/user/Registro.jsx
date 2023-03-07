import React from 'react'
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';

export const Registro = () => {
  const { form, changed } = useForm({});
  const [saved,setSaved]=useState("not_sanded");

  const saveUser = async (e) => {
    e.preventDefault();
    let newUser = form;
   
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {"Content-Type":"application/json; charset=UTF-8"}
    });

    const data = await request.json();
    if(data.status==="success"){
      setSaved("saved")
    }else{
      setSaved("error")
    }
  }

  return (
    <>
      <header className="content__header content_header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">
        {saved==="saved" ? <strong className='alert alert-success'>Usuario Registrado Correctamente!!</strong>:''}
        {saved==="error" ? <strong className='alert alert-danger'>Usuario no se ha Registrado!!</strong>:''}
        <form className='register-form' onSubmit={saveUser}>

          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type="text" name='name' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input type="text" name='surname' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='nick'>Nick</label>
            <input type="text" name='nick' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo Electronico</label>
            <input type="email" name='email' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type="password" name='password' onChange={changed} />
          </div>

          <input type="submit" value="Registrar" className='success' />

        </form>
      </div>
    </>
  )
}
