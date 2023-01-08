import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PrivateLayout } from '../components/layout/private/PrivateLayout';

import { PublicLayout } from '../components/layout/public/PublicLayout';
import { Feed } from '../components/publication/Feed';
import { Login } from '../components/user/Login';
import { Registro } from '../components/user/Registro';


export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
        </Route>

        <Route path='/social' element={<PrivateLayout />} >
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
        </Route>

        <Route path='*' element={
          <>
           <p>
            <h1>Error 404</h1>
            <Link to="/">Volver al Inicio</Link>
           </p>
          </>
        }/>

        </Routes>
    </BrowserRouter >
  )
}
