import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Spin } from 'antd'

import './edit-article.scss'
import ArticleForm from '../article-form'
import { fetchArticleBySlug, updateArticle } from '../../api/api'

function EditArticle() {
  const { slug } = useParams()
  const { token } = useSelector((state) => state.auth)
  const [article, setArticle] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleBySlug(slug)
        setArticle(data.article)
      } catch (err) {
        setError('Не удалось загрузить статью для редактирования')
      }
    }
    loadArticle()
  }, [slug])
  const handleEditSubmit = async (data) => {
    try {
      const updatedArticle = { ...article, ...data }
      await updateArticle(slug, updatedArticle, token)
      navigate(`/articles/${slug}`)
    } catch (err) {
      setError('Ошибка при редактировании статьи')
    }
  }

  if (!article) return <Spin className="spin" />

  return (
    <div>
      {error && <Alert message={error} type="error" className="alert" />}
      <ArticleForm initialValues={article} onSubmit={handleEditSubmit} isEdit />
    </div>
  )
}

export default EditArticle
