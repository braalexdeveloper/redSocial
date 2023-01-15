import React from 'react';
import Header from './header';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";

export const PublicLayout = () => {
  const {auth}=useAuth();
  return (
    <>
     {/* layout */}
     <Header/>
     
     {/* Contenido principal */}
     <section className="layout__content">
       {!auth._id ? <Outlet/> : <Navigate to="/social"/> } 
      </section>
    </>
  )
}
