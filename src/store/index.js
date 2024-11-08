import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../reducer/authSlice'
import articlesReducer from '../reducer/article-slice'

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
  },
})
export default store
