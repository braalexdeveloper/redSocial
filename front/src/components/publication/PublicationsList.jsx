import React from 'react';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import ReactTimeAgo from 'react-time-ago';

export const PublicationsList = ({publications,getPublications,page,setPage,more,setMore}) => {
    const { auth } = useAuth();
    const nextPage = () => {
        let newPage = page + 1;
        setPage(newPage);
        getPublications(newPage);
    }

    const deletePublication = async (userId) => {
        let request = await fetch(Global.url + "publication/remove/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        let publicationDelete = await request.json();

        setPage(1);
        setMore(true);
        getPublications(1, true);

    }

  return (
    <>
    {publications.map(publication => (
        <article className="posts__post" key={publication._id}>
            <div className="post__container">
                <div className="post__image-user">
                    <Link to={"/social/profile/" + publication.user._id} className="post__image-link">
                        {!publication.user.image ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : publication.user.image === "default.png" ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : <img src={publication.user.image} className="post__user-image" alt="Foto de perfil" />}

                    </Link>
                </div>
                <div className="post__body">
                    <div className="post__user-info">
                        <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                        <span className="user-info__divider"> | </span>
                        <a href="#" className="user-info__create-date"><ReactTimeAgo date={Date.parse(publication.created_at)} locale="es-ES" /></a>
                    </div>
                    <h4 className="post__content">{publication.text}</h4>
                    {publication.file && <img src={publication.file} />}
                </div>
            </div>
            {
                auth._id === publication.user._id && <div className="post__buttons">
                    <button onClick={() => deletePublication(publication._id)} className="post__button"><i className="fa-solid fa-trash-can"></i></button>
                </div>
            }

        </article>
    ))

    }
    {
        more &&
        <div className="content__container-btn">
            <button onClick={nextPage} className="content__btn-more-post">Ver mas publicaciones</button>
        </div>
    }
    </>
  )
}
