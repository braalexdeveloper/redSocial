import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);


  useEffect(() => {
    allUsers(1);
  }, []);

  const allUsers = async (nextPage = 1) => {
    setLoading(true);
    const request = await fetch(Global.url + "user/allUsers/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const dataUsers = await request.json();

    if (dataUsers.status === "success" && dataUsers.result.docs) {
      let newUsers = dataUsers.result.docs;
      if (users.length >= 1) {
        newUsers = [...users, ...dataUsers.result.docs];
      }
      setUsers(newUsers);
      setLoading(false);
      setFollowing(dataUsers.user_following);
      //Paginación
      if (users.length >= (dataUsers.result.total - dataUsers.result.docs.length)) {
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
        <h1 className="content__title">Gente</h1>

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
