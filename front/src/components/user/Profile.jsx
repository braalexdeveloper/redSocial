import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';
import { Global } from '../../helpers/Global';
import avatar from "../../assets/img/user.png";

export const Profile = () => {
    const params = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [counters, setCounters] = useState({});

    useEffect(() => {
        GetProfile(params.idUser, setUserProfile);
        getCounts();
    }, []);

    useEffect(()=>{
        GetProfile(params.idUser, setUserProfile);
        getCounts();
    },[params])

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
                        <button className="post__button post__button--green btn-seguir-perfil">Seguir</button>
                        <p className="container-names__nickname">{userProfile.bio}</p>
                    </div>
                </div>
                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={"/social/following/"+userProfile._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following>=1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followers/"+userProfile._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >=1 ? counters.followed : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/profile/"+userProfile._id}className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >=1 ? counters.publications : 0}</span>
                        </Link>
                    </div>
                </div>
            </div>
            <article className="posts__post">
                <div className="post__container">
                    <div className="post__image-user">
                        <a href="#" className="post__image-link">
                            <img src="/src/assets/img/user.png" className="post__user-image" alt="Foto de perfil" />
                        </a>
                    </div>
                    <div className="post__body">
                        <div className="post__user-info">
                            <a href="#" className="user-info__name">bridney</a>
                            <span className="user-info__divider"> | </span>
                            <a href="#" className="user-info__create-date">2023-01-16T22:55:53.806Z</a>
                        </div>
                        <h4 className="post__content"></h4>
                    </div>
                </div>
                <div className="post__buttons">
                    <a href="#" className="post__button"><i className="fa-solid fa-trash-can"></i></a>
                </div>
            </article>
            <div className="content__container-btn">
                <button className="content__btn-more-post">Ver mas publicaciones</button>
            </div>
        </>
    )
}
