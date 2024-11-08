import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ArticleList from '../article-list/article-list'
import Header from '../header'
import ArticleDetail from '../article/article-inner'
import SignIn from '../signIn'
import SignUp from '../signUp'
import EditProfile from '../edit-profile'
import NewArticle from '../new-article'
import EditArticle from '../edit-article/edit-article'

import styles from './app.module.scss'

function App() {
  return (
    <Router>
      <Header />
      <main className={styles.container}>
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profiles" element={<EditProfile />} />
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
        </Routes>
      </main>
    </Router>
  )
}
export default App
