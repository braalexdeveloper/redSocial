import React from 'react';
import { useState } from 'react';
import useAuth from "../../hooks/useAuth";
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import avatar from "../../assets/img/user.png";

export const Config = () => {

    const [saved, setSaved] = useState("not_sended");
    const { auth, setAuth } = useAuth();

    const updateUser = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");
        let newDataUser = SerializeForm(e.target);

        //Borrar propiedad innecesaria
        delete newDataUser.file0;

        //Actualizar usuario en la base de datos
        const request = await fetch(Global.url + "user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const data = await request.json();

        if (data.status === "success") {
            delete data.userUpdate.password;
            setAuth(data.userUpdate);
            setSaved("saved")
        } else {
            setSaved("error")
        }

        //Subida de imagenes
        const fileInput = document.getElementById("file");
        if (data.status === "success" && fileInput.files[0]) {
            //Recoger imagen al subir
            const formData = new FormData();
            formData.append('file0', fileInput.files[0]);

            //Petición para enviar el fichero
            const uploadRequest = await fetch(Global.url + "user/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            });
            const uploadData = await uploadRequest.json();

            if (uploadData.status === "success") {
                delete uploadData.user.password;
                setAuth(uploadData.user);
                setSaved("saved")
            } else {
                setSaved("error")
            }
        }
    }


    return (
        <>
            <header className="content__header content_header--public">
                <h1 className="content__title">Ajustes</h1>
            </header>

            <div className="content__posts">
                {saved === "saved" ? <strong className='alert alert-success'>Usuario Modificado Correctamente!!</strong> : ''}
                {saved === "error" ? <strong className='alert alert-danger'>Usuario no se ha Modificado!!</strong> : ''}
                <form className='update-form' onSubmit={updateUser}>

                    <div className='form-group'>
                        <label htmlFor='name'>Nombre</label>
                        <input type="text" name='name' defaultValue={auth.name} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='surname'>Apellidos</label>
                        <input type="text" name='surname' defaultValue={auth.surname} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" name='nick' defaultValue={auth.nick} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='bio'>Biografia</label>
                        <textarea name='bio' defaultValue={auth.bio} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='email'>Correo Electronico</label>
                        <input type="email" name='email' defaultValue={auth.email} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type="password" name='password' />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='file0'>Avatar</label>
                        <div className='avatar'>
                            <div className="general-info__container-avatar">
                                {!auth.image ? <img src={avatar} className="container-avatar__img" alt="Foto de perfil" /> : auth.image === "default.png" ? <img src={avatar} className="container-avatar__img" alt="Foto de perfil" /> : <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            </div>
                        </div>
                        <br />
                        <input type="file" name='file0' id="file" />
                    </div>
                    <br />

                    <input type="submit" value="Update" className='success' />

                </form>
            </div>
        </>
    )
}
