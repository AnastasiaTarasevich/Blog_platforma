import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { updateUser } from '../../reducer/authSlice'
import styles from '../signUp/signUp.module.scss'

function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const { token, username, email, password } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    // Создаем объект userData с обновленными данными и токеном
    const userData = {
      token, // Получаем токен из состояния Redux
      username: data.username,
      email: data.email,
      image: data.image,
      password: data.password,
    }
    try {
      await dispatch(updateUser(userData)).unwrap() // unwrap нужен для извлечения успешного ответа
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile!')
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.registration}>
      <h2 className={styles.registration__title}>Create new account</h2>
      <p className={styles.registration__text}>Username</p>
      <div className={styles['registration__container-input']}>
        <input
          type="text"
          className={styles.registration__input}
          minLength="3"
          maxLength="20"
          defaultValue={username}
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Username must be at least 3 characters long' },
            maxLength: { value: 20, message: 'Username must be at most 20 characters long' },
          })}
        />
        {errors.username && <p className={styles.registration__error}>{errors.username.message}</p>}
      </div>
      <p className={styles.registration__text}>Email address</p>
      <div className={styles['registration__container-input']}>
        <input
          type="email"
          className={styles.registration__input}
          defaultValue={email}
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && <p className={styles.registration__error}>{errors.email.message}</p>}
      </div>
      <p className={styles.registration__text}> New Password</p>
      <div className={styles['registration__container-input']}>
        <input
          type="password"
          className={styles.registration__input}
          defaultValue={password}
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters long' },
            maxLength: { value: 40, message: 'Password must be at most 40 characters long' },
          })}
        />
        {errors.password && <p className={styles.registration__error}>{errors.password.message}</p>}
      </div>
      <p className={styles.registration__text}>Avatar image(url)</p>
      <div className={styles['registration__container-input']}>
        <input
          type="url"
          className={styles.registration__input}
          defaultValue=""
          placeholder="Avatar image"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('image', {
            pattern: { value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i, message: 'Invalid URL' },
          })}
        />
        {errors.image && <p className={styles.registration__error}>{errors.image.message}</p>}
      </div>

      <button type="submit" className={styles.registration__button}>
        Save
      </button>
      <ToastContainer />
    </form>
  )
}
export default EditProfile
