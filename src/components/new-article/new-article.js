import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Alert from 'antd/es/alert/Alert'

import ArticleForm from '../article-form'
import { createArticle } from '../../api/api'

function NewArticle() {
  const token = useSelector((state) => state.auth.token)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleCreateArticle = async (data) => {
    try {
      await createArticle(data, token)
      navigate('/')
    } catch (err) {
      setError('Не удалось создать статью')
    }
  }

  return (
    <div>
      {error && <Alert message={error} type="error" />}
      <ArticleForm onSubmit={handleCreateArticle} />
    </div>
  )
}

export default NewArticle
