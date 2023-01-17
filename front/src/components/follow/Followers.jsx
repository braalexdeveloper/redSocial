import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';

export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [userProfile,setUserProfile]=useState({});

  const params=useParams();


  useEffect(() => {
    allUsers(1);
    GetProfile(params.idUser,setUserProfile);
  }, []);

  const allUsers = async (nextPage = 1) => {
    const userId=params.idUser;
    setLoading(true);
    const request = await fetch(Global.url + "follow/followers/"+userId+"/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const dataUsers = await request.json();

    if (dataUsers.status === "success" && dataUsers.follows) {
        let newUsers=[];
      dataUsers.follows.forEach(el=>{
         newUsers=[...newUsers,el.user]
      })

      if (users.length >= 1) {
        newUsers = [...users, ...newUsers];
      }
      setUsers(newUsers);
      setLoading(false);
      setFollowing(dataUsers.user_following);
      //Paginación
      if (users.length >= (dataUsers.total - dataUsers.follows.length)) {
        setMore(false);
      }
      //otra forma 
      /*if(newUsers.length===dataUsers.result.total){
        setMore(false);
      }*/
    }
  }


  return (
    <>

      <header className="content__header">
        <h1 className="content__title">Usuario que siguen a {userProfile.name} {userProfile.surname}</h1>

      </header>

      <UserList users={users}
        allUsers={allUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        loading={loading}
        more={more}
      />

    </>
  )
}
