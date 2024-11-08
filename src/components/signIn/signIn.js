import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { signInUser } from '../../reducer/authSlice'

import styles from './signIn.module.scss'

function SignIn() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    const resultAction = await dispatch(signInUser(data))
    if (signInUser.fulfilled.match(resultAction)) {
      navigate('/')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.autorization}>
      <h2 className={styles.autorization__title}>Sign In</h2>
      <p className={styles.autorization__text}>Email address</p>
      <input
        type="email"
        placeholder="Email address"
        required
        className={styles.autorization__input}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('email', { required: 'Email обязателен', pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
      />
      <p className={styles.autorization__text}>Password</p>
      <div className={styles.autorization__password}>
        <input
          type="password"
          className={styles.autorization__input}
          placeholder="Password"
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('password', { required: 'Пароль обязателен' })}
        />
        {error && <p className={styles['autorization__error-text']}>{error}</p>}
      </div>
      <button type="submit" className={styles.autorization__button}>
        Login
      </button>
      <p className={styles.autorization__registration}>
        Don’t have an account?{' '}
        <Link to="/sign-up" className={styles['autorization__registration-link']}>
          Sign Up
        </Link>
        .
      </p>
    </form>
  )
}
export default SignIn
