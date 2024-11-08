import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Tag } from 'antd'

import { addFavorite, removeFavorite } from '../../reducer/article-slice'

import styles from './article.module.scss'

function Article({ slug, title, description, author, date, likeCount, genres, image, favorited }) {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  const handleClick = (event) => {
    event.preventDefault()

    const slugForParams = slug

    if (event.target.className.includes(styles.article__button) && token) {
      dispatch(addFavorite({ token, slug: slugForParams }))
    }

    if (event.target.className.includes(styles.article__favoriate) && token) {
      dispatch(removeFavorite({ token, slug: slugForParams }))
    }
  }

  return (
    <li className={styles.article}>
      <div className={styles.article__info}>
        <div className={styles['article__info-right']}>
          <div className={styles['article__info-right-inner']}>
            <Link to={`/articles/${slug}`} className={styles.article__link}>
              <p className={styles['article__info-title']}>{title}</p>
            </Link>
            <div className={styles.article__like}>
              <button
                type="button"
                className={`${favorited && token ? styles.article__favoriate : styles.article__button}`}
                aria-label="Like article"
                onClick={(event) => handleClick(event)}
                disabled={!token}
              />
              <span className={styles['article__heart-count']}>{likeCount}</span>
            </div>
          </div>
          <div>
            {genres.length > 0 &&
              genres.slice(0, 4).map(
                (genre) =>
                  genre && (
                    <Tag key={uuidv4()} className={styles.article__tag}>
                      {genre}
                    </Tag>
                  )
              )}
          </div>
        </div>
        <div className={styles['article__info-left']}>
          <div className={styles['article__info-left-inner']}>
            <p className={styles['article__info-name']}>{author}</p>
            <p className={styles['article__info-date']}>{format(date, 'PP')}</p>
          </div>
          <img src={image} alt="author" className={styles['article__info-img']} />
        </div>
      </div>
      <p className={styles['article__info-left-text']}>{description}</p>
    </li>
  )
}

export default Article
