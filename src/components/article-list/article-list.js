import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin, Alert } from 'antd'

import Footer from '../footer/footer'
import Article from '../article/article'
import { loadArticles, setPage } from '../../reducer/article-slice'

import styles from './article-list.module.scss'

function ArticleList() {
  const dispatch = useDispatch()
  const { articles, loading, error, page, totalArticles } = useSelector((state) => state.articles)
  const pageSize = 10
  const totalPages = Math.ceil(totalArticles / 10)

  useEffect(() => {
    dispatch(loadArticles({ page, pageSize }))
  }, [dispatch, page, pageSize])

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage))
  }

  if (loading) {
    return <Spin className={styles.spin} />
  }

  if (error) {
    return <Alert message={error} type="error" className={styles.alert} />
  }
  return (
    <div>
      <ul>
        {articles.map((article) => (
          <Article
            key={article.slug}
            slug={article.slug}
            title={article.title}
            description={article.description}
            author={article.author.username}
            date={new Date(article.createdAt).toLocaleDateString()}
            likeCount={article.favoritesCount}
            favorited={article.favorited}
            genres={article.tagList}
            image={article.author.image}
          />
        ))}
      </ul>
      <Footer currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}
export default ArticleList
