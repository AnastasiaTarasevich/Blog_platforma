import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../../reducer/authSlice'
import Profile from '../../assets/Profile.svg'

import styles from './header.module.scss'

function Header() {
  const dispatch = useDispatch()
  const { username, image } = useSelector((state) => state.auth || {})
  const userImage = image || Profile
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.header__link}>
        <p className={styles.header__text}>Realworld Blog</p>
      </Link>
      <div className={styles.header__buttons}>
        {username ? (
          <div className={styles.header__authorization}>
            <div className={styles.header__user}>
              <Link to="/new-article">
                <Button type="button" className={styles['header__user-button']}>
                  Create article
                </Button>
              </Link>
              <Link to="/profiles" className={styles['header__link-profile']}>
                <div className={styles.header__profile}>
                  <p className={styles.header__username}>{username}</p>
                  <img className={styles.header__image} src={userImage} alt={`${username}'s profile`} />
                </div>
              </Link>
            </div>
            <Button className={styles.header__logout} onClick={() => dispatch(logout())}>
              Log Out
            </Button>
          </div>
        ) : (
          <>
            <Link to="/sign-in">
              <Button color="default" variant="text" className={styles['header__buttons-signIn']}>
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="outlined" className={styles['header__buttons-signUp']}>
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
export default Header
