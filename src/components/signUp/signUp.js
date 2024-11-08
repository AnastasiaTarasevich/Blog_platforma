import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { signUpUser } from '../../reducer/authSlice'

import styles from './signUp.module.scss'

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const userData = {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    }

    const resultAction = await dispatch(signUpUser(userData))

    if (signUpUser.fulfilled.match(resultAction)) {
      navigate('/')
    }

    if (resultAction.payload) {
      const errorResponse = resultAction.payload
      if (errorResponse.username) {
        setError('username', { type: 'manual', message: errorResponse.username })
      }
      if (errorResponse.email) {
        setError('email', { type: 'manual', message: errorResponse.email })
      }
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
          placeholder="Username"
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
          placeholder="Email address"
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Invalid email address' },
          })}
        />
        {errors.email && <p className={styles.registration__error}>{errors.email.message}</p>}
      </div>
      <p className={styles.registration__text}>Password</p>
      <div className={styles['registration__container-input']}>
        <input
          type="password"
          className={styles.registration__input}
          placeholder="Password"
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
      <p className={styles.registration__text}>Repeat Password</p>
      <div className={styles['registration__container-input']}>
        <input
          type="password"
          className={styles.registration__input}
          placeholder="Password"
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('repeatPassword', {
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />
        {errors.repeatPassword && <p className={styles.registration__error}>{errors.repeatPassword.message}</p>}
      </div>
      <div className={styles['registration__container-input']}>
        <hr className={styles.registration__line} />
        <label htmlFor="f">
          <input
            id="f"
            type="checkbox"
            required
            className={styles.registration__checkbox}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('agreement', { required: 'You must agree to the terms' })}
          />
          I agree to the processing of my personal information
        </label>
      </div>

      <button type="submit" className={styles.registration__button}>
        Create
      </button>

      <p className={styles.registration__authorization}>
        Already have an account?{' '}
        <Link to="/sign-in" className={styles['registration__authorization-link']}>
          Sign In
        </Link>
        .
      </p>
    </form>
  )
}
export default SignUp
