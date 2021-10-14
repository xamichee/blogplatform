import React, { useState } from 'react';
import { connect } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { withRouter, Redirect } from 'react-router-dom';

import BlogApi from "../../blogApi/BlogApi";
import { errorMessage } from "../../utils/utils";
import { setUser } from "../../Reducer/store.actions";


import FormInput from "../FormInput/FormInput";
import Button from "../Button/Button";
import ModalError from "../ModalError/ModalError";

const UserProfile = ({history, setUser, user: {token, username}}) => {
  const {control, handleSubmit, watch, formState: {errors}} = useForm();
  const [error, setError] = useState(false);

  const {editProfile} = new BlogApi();

  const onSubmit = ({username, email, password, url}) => {
    console.log(username, email, password, url, token);
    editProfile(username, email, password, url, token)
      .then(res => res.data.user)
      .then(user => {
        console.log(user);
        if (user) {
          setUser(user)
          sessionStorage.setItem('user', JSON.stringify(user));
          history.push('/');
        }
      })
      .catch(err => console.dir(err));
  }

  if (!username) {
    return <Redirect to="/articles/"/>
  }

  return (
    <div className="profile form _block">
      {error && <ModalError error={error} setError={setError}/>}
      <h2 className="form__title">Edit profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile__form">
        <div className="controller">
          <Controller
            className="controller"
            name="username"
            control={control}
            rules={{required: true, minLength: 3, maxLength: 20}}
            render={({field}) =>
              <FormInput {...field}
                         value={watch("username")}
                         label="Username"
                         error={errors.username}
              />
            }
          />
          {errors.username && errorMessage(errors.username.type, 'username', 3, 20)}
        </div>
        <div className="controller">
          <Controller
            className="controller"
            name="email"
            control={control}
            rules={{required: true, pattern: /.+@.+\..+/i}}
            render={({field}) =>
              <FormInput {...field}
                         value={watch("email")}
                         label="Email"
                         error={errors.email}
              />
            }
          />
          {errors.email && errorMessage(errors.email.type, 'Email')}
        </div>
        <div className="controller">
          <Controller
            className="controller"
            name="password"
            control={control}
            rules={{required: true, minLength: 6, maxLength: 40}}
            render={({field}) =>
              <FormInput {...field}
                         type="password"
                         value={watch("password")}
                         label="New password"
                         error={errors.password}
              />
            }
          />
          {errors.password && errorMessage(errors.password.type, 'password', 6, 40)}
        </div>
        <div className="controller">
          <Controller
            className="controller"
            name="avatar"
            control={control}
            rules={{
              required: false,
            }}
            render={({field}) =>
              <FormInput {...field}
                         type="avatar"
                         value={watch("avatar")}
                         label="Avatar image (url)"
                         error={errors.avatar}
              />
            }
          />
          {errors.repeatPassword && errorMessage(errors.repeatPassword.type, 'password')}
        </div>
        <Button type="submit" children={"Save"}/>
      </form>
    </div>
  )
    ;
};

const mapDispatchToProps = {setUser};
const mapStateToProps = ({user}) => ({user})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfile));
