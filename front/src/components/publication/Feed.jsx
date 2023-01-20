import React, { useEffect, useState } from 'react'


import { Global } from '../../helpers/Global';

import { PublicationsList } from '../publication/PublicationsList';

export const Feed = () => {

   
       
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
   
    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1,showNews=false) => {
        
        if(showNews){
            nextPage=1;
            setPage(1);
            setPublications([]);
        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {

            let newPublications = data.publications;

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }


            setPublications(newPublications);

            if (!showNews && newPublications.length === data.total) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    }

  return (
    <>

            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button onClick={()=>getPublications(1,true)} className="content__button">Mostrar nuevas</button>
            </header>

            <PublicationsList publications={publications} getPublications={getPublications} page={page} setPage={setPage} more={more} setMore={setMore} />

        </>
  )
}
