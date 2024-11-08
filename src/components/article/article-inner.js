import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Modal, Tag, Button, Spin, Alert } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'

import { removeFavorite, addFavorite } from '../../reducer/article-slice'
import { fetchArticleBySlug, deleteArticle } from '../../api/api'

import styles from './article.module.scss'

function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const { token, username } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const [favorited, setFavorited] = useState(JSON.parse(localStorage.getItem('favorites'))?.[slug] || false)
  const [favoritedCount, setFavoritedCount] = useState(null)

  const handleClick = (event) => {
    event.preventDefault()

    if (favorited) {
      dispatch(removeFavorite({ slug, token }))
      const updatedFavorites = { ...JSON.parse(localStorage.getItem('favorites')) }
      delete updatedFavorites[slug]
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setFavorited(false)
      setFavoritedCount(favoritedCount - 1)
    } else {
      dispatch(addFavorite({ slug, token }))
      const updatedFavorites = { ...JSON.parse(localStorage.getItem('favorites')), [slug]: true }
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setFavorited(true)
      setFavoritedCount(favoritedCount + 1)
    }
  }

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleBySlug(slug)
        setArticle(data.article)
        setFavoritedCount(data.article.favoritesCount)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [slug])

  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/articles/${slug}/edit`)
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure to delete this article?',
      onOk: async () => {
        try {
          await deleteArticle(slug, token)
          navigate('/')
        } catch (err) {
          setError('Error after delete')
        }
      },
    })
  }

  if (loading || !slug) return <Spin className={styles.article__spin} />

  if (error) return <Alert message={error} type="error" className={styles.article__alert} />

  return (
    <div className={styles.articleDetail}>
      <div className={styles.article}>
        <div className={styles.article__info}>
          <div className={styles['article__info-right']}>
            <div className={styles['article__info-right-inner']}>
              <p className={styles['article__info-title']}>{article.title}</p>
              <div className={styles.article__like}>
                <button
                  type="button"
                  className={`${favorited && token ? styles.article__favoriate : styles.article__button}`}
                  aria-label="Like article"
                  onClick={handleClick}
                  disabled={!token}
                />
                <span className={styles['article__heart-count']}>{favoritedCount}</span>
              </div>
            </div>
            <div>
              {article.tagList.map(
                (genre) =>
                  genre && (
                    <Tag key={uuidv4()} className={styles['article__tag-inner']}>
                      {genre}
                    </Tag>
                  )
              )}
            </div>
          </div>
          <div className={styles['article__info-inner-item']}>
            <div className={styles['article__info-left-item']}>
              <div className={styles['article__container-profile']}>
                <p className={styles['article__info-name']}>{article.author.username}</p>
                <p className={styles['article__info-date']}>{format(article.createdAt, 'PP')}</p>
              </div>
              <img src={article.author.image} alt="author" className={styles['article__info-img']} />
            </div>

            {username === article.author.username && (
              <div className={styles.article__actions}>
                <Button onClick={handleDelete} color="danger" variant="outlined">
                  Delete
                </Button>
                <Button onClick={handleEdit} variant="outlined" className={styles['article__button-color']}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.article__container}>
          <p className={styles['article__inner-des']}>{article.description}</p>
        </div>

        <div className={styles['article__info-markdown']}>
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail
