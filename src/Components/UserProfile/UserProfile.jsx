import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


import { errorMessage } from "../../utils/utils";
import { setUser } from "../../Reducer/store.actions";
import { editProfile } from '../../Reducer/api.actions';

import FormInput from "../FormInput/FormInput";
import Button from "../Button/Button";

const UserProfile = ({editProfile, user}) => {

  const {username, email, image} = user;
  const {control, handleSubmit, watch, formState: {errors}} = useForm({defaultValues: {username, email, image}});
  const [serverError, setServerError] = useState(null);

  const onSubmit = ({username, email, password, image}) => {
    setServerError(null);
    editProfile(username, email, password, image)
      .catch(err => setServerError(err.response.data))
  }

  if (!username) {
    return <Redirect to="/articles/"/>
  }

  return (
    <div className="profile form _block">
      <h2 className="form__title">Edit profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile__form">
        <div className="controller">
          <Controller
            className="controller"
            name="username"
            control={control}
            rules={{minLength: 3, maxLength: 20}}
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
            rules={{pattern: /.+@.+\..+/i}}
            render={({field}) =>
              <FormInput {...field}
                         value={watch("email")}
                         label="Email"
                         error={errors.email || serverError}
              />
            }
          />
          {errors.email && errorMessage(errors.email.type, 'Email')}
          {!errors.email && serverError === 'Unique constraint failed on the fields: (`email`)' && <span className="form__error">Email was already used.</span>}
        </div>
        <div className="controller">
          <Controller
            className="controller"
            name="password"
            control={control}
            rules={{minLength: 6, maxLength: 40}}
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
            name="image"
            control={control}
            rules={{
              required: false,
            }}
            render={({field}) =>
              <FormInput {...field}
                         type="avatar"
                         value={watch("image")}
                         label="Avatar image (url)"
                         error={errors.image}
              />
            }
          />
          {errors.repeatPassword && errorMessage(errors.repeatPassword.type, 'password')}
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
    ;
};

const mapDispatchToProps = {setUser, editProfile};
const mapStateToProps = ({user}) => ({user})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

UserProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    image: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
}