import React from 'react';
import Header from './header';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';


export const PrivateLayout = () => {
  return (
    <>
     {/* layout */}

     {/* Cabezera navegación */}
     <Header/>
     
     {/* Contenido principal */}
     <section className="layout__content">
        <Outlet/>
      </section>

      {/* Barra lateral */}
      <Sidebar/>
    </>
  )
}