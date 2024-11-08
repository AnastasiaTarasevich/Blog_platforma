import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { fetchArticles, favoriteArticle, unfavoriteArticle } from '../api/api'

const getFavoriteStatus = () => JSON.parse(localStorage.getItem('favorites')) || {}
export const loadArticles = createAsyncThunk(
  'articles/loadArticles',
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const data = await fetchArticles(page, pageSize)
      const favorites = getFavoriteStatus()

      const updatedArticles = data.articles.map((article) => ({
        ...article,
        favorited: favorites[article.slug] || false,
      }))

      return { articles: updatedArticles, totalArticles: data.articlesCount }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const saveFavoriteStatus = (slug, favorited) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || {}

  if (favorited) {
    favorites[slug] = true
  } else {
    delete favorites[slug]
  }

  localStorage.setItem('favorites', JSON.stringify(favorites))
}

export const fetchFavoriteStatus = createAsyncThunk(
  'articles/fetchFavoriteStatus',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/articles/${slug}/favorite`, {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await response.json()
      return { slug, favorited: data.favorited }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addFavorite = createAsyncThunk('articles/addFavorite', async ({ slug, token }, { rejectWithValue }) => {
  try {
    const data = await favoriteArticle(slug, token)
    saveFavoriteStatus(slug, true)
    return { slug, article: data.article }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const removeFavorite = createAsyncThunk(
  'articles/removeFavorite',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const data = await unfavoriteArticle(slug, token)
      saveFavoriteStatus(slug, false)
      return { slug, article: data.article }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    favoritedArticles: {},
    loading: false,
    error: null,
    page: 1,
    totalArticles: 0,
  },
  reducers: {
    setPage: (state, action) => ({ ...state, page: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadArticles.pending, (state) => ({ ...state, loading: true, error: null }))
      // В редьюсере
      .addCase(loadArticles.fulfilled, (state, action) => {
        const { articles, totalArticles } = action.payload
        state.articles = articles
        state.totalArticles = totalArticles
        state.loading = false
      })

      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = 'resolved'
        state.articles = state.articles.map((article) => {
          const item = article.slug === action.payload.article.slug
          return item ? action.payload.article : article
        })
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })

      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.status = 'resolved'
        state.articles = state.articles.map((article) => {
          const item = article.slug === action.payload.article.slug
          return item ? action.payload.article : article
        })
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
  },
})

export const { setPage } = articlesSlice.actions
export default articlesSlice.reducer
