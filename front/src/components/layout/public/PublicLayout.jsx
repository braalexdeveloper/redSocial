import React from 'react';
import Header from './header';
import { Outlet } from 'react-router-dom';


export const PublicLayout = () => {
  return (
    <>
     {/* layout */}
     <Header/>
     
     {/* Contenido principal */}
     <section className="layout__content">
        <Outlet/>
      </section>
    </>
  )
}
