import React from 'react'
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { Global } from '../../helpers/Global';

export const UserList = ({users,allUsers,following,setFollowing,page,setPage,more,loading}) => {
    const {auth}=useAuth();
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
          setFollowing([...following, userId])
        }
      }
    
      const unFollow = async (userId) => {
       //Petición al backend  para guardar el follow
       const request = await fetch(Global.url + "follow/unfollow/"+userId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      });
    
      const data = await request.json();
    
      //Cuando este todo correcto
      if (data.status === "success") {
    
        //Actualizar estado del following con el nuevo follow
        setFollowing(following.filter(el=>el!==userId))
      }
      }

      const nextPage = () => {
        let newPage = page + 1;
        setPage(newPage);
        allUsers(newPage);
    
      }

  return (
    <>
    <div className="content__posts">
        {users.map(user => (
          <article className="posts__post" key={user._id}>

            <div className="post__container">

              <div className="post__image-user">
                <a href="#" className="post__image-link">
                  {!user.image ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : user.image === "default.png" ? <img src={avatar} className="post__user-image" alt="Foto de perfil" /> : <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}

                </a>
              </div>

              <div className="post__body">

                <div className="post__user-info">
                  <a href="#" className="user-info__name">{user.name}</a>
                  <span className="user-info__divider"> | </span>
                  <a href="#" className="user-info__create-date">{user.created_at}</a>
                </div>

                <h4 className="post__content">{user.bio}</h4>

              </div>

            </div>

            {user._id!==auth._id &&
            <div className="post__buttons">

              {!following.includes(user._id) && <button onClick={()=>follow(user._id)} className="post__button post__button--green">
                Seguir
              </button>
              }
              {following.includes(user._id) && <button onClick={()=>unFollow(user._id)} className="post__button">
                Dejar de Seguir
              </button>}

            </div>
          }
          </article>
        ))}



      </div>

{loading ? "Cargando..." : ""}
{more && <div className="content__container-btn">
  <button className="content__btn-more-post" onClick={nextPage}>
    Ver más Gente
  </button>
</div>}
</>
  )
}
