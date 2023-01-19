import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';
import { Global } from '../../helpers/Global';
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/useAuth";

export const Profile = () => {
    const params = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const { auth } = useAuth();


    useEffect(() => {
        getDataUser();
        getCounts();
        getPublications(1,true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounts();
        getPublications(1,true);
    }, [params])

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.idUser, setUserProfile);
        console.log(dataUser);
        if (dataUser.following && dataUser.following._id) setIFollow(true);
    }


    const getCounts = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.idUser, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.followed) {
            setCounters(data);
        }

    }

    const follow = async (userId) => {
        //Petición al backend  para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        //Cuando este todo correcto
        if (data.status === "success") {

            //Actualizar estado del following con el nuevo follow
            setIFollow(true);
        }
    }

    const unFollow = async (userId) => {
        //Petición al backend  para guardar el follow
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        //Cuando este todo correcto
        if (data.status === "success") {

            setIFollow(false);
        }
    }

    const getPublications = async (nextPage = 1,newProfile=false) => {
        const request = await fetch(Global.url + "publication/user/" + params.idUser + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {

            let newPublications = data.publications;

            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            if(newProfile){
                newPublications = data.publications;
                setMore(true);
            }

            setPublications(newPublications);

            if (newPublications.length === data.total) {
                setMore(false);
            }
        }
    }

    const nextPage = () => {
        let newPage = page + 1;
        setPage(newPage);
        getPublications(newPage);
    }

    return (
        <>
            <div className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {!userProfile.image ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : userProfile.image === "default.png" ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : <img src={Global.url + "user/avatar/" + userProfile.image} className="post__user-image" alt="Foto de perfil" />}
                    </div>
                    <div className="general-info__container-names">
                        <a className="container-names__name" href="/social/profile/63ab0bfae7f860816a8a9a70">{userProfile.name} {userProfile.surname}</a>
                        <p className="container-names__nickname">{userProfile.nick}</p>
                        {userProfile._id !== auth._id &&
                            (iFollow ?
                                <button onClick={() => unFollow(userProfile._id)} className=" btn-seguir-perfil post__button">Dejar de Seguir</button>
                                :
                                <button onClick={() => follow(userProfile._id)} className="post__button post__button--green btn-seguir-perfil ">Seguir</button>
                            )}
                        <p className="container-names__nickname">{userProfile.bio}</p>
                    </div>
                </div>
                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={"/social/following/" + userProfile._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followers/" + userProfile._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/profile/" + userProfile._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>
                </div>
            </div>
            {publications.map(publication => (
                <article className="posts__post" key={publication._id}>
                    <div className="post__container">
                        <div className="post__image-user">
                            <Link to={"/social/profile/" + publication.user._id} className="post__image-link">
                                {!publication.user.image ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : publication.user.image === "default.png" ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Foto de perfil" />}

                            </Link>
                        </div>
                        <div className="post__body">
                            <div className="post__user-info">
                                <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                                <span className="user-info__divider"> | </span>
                                <a href="#" className="user-info__create-date">{publication.user.created_at}</a>
                            </div>
                            <h4 className="post__content">{publication.text}</h4>
                        </div>
                    </div>
                    {
                        auth._id === publication.user._id && <div className="post__buttons">
                            <a href="#" className="post__button"><i className="fa-solid fa-trash-can"></i></a>
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
