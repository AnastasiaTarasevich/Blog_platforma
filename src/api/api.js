const API_URL = 'https://blog-platform.kata.academy/api'

export const fetchArticles = async (page = 1, pageSize = 10) => {
  const response = await fetch(`${API_URL}/articles?limit=${pageSize}&offset=${(page - 1) * pageSize}`)
  if (!response.ok) {
    throw new Error('Ошибка при загрузке списка статей')
  }
  return response.json()
}

export const fetchArticleBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/articles/${slug}`)
  if (!response.ok) {
    throw new Error(`Ошибка при загрузке статьи с идентификатором ${slug}`)
  }
  return response.json()
}

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: userData }),
  })
  if (response.status === 422) {
    const bodyError = await response.json()

    const errorsMessage = {}

    if (bodyError.errors.username) {
      errorsMessage.username = 'A user with this name already exists'
    }

    if (bodyError.errors.email) {
      errorsMessage.email = 'A user with this email already exists'
    }

    throw new Error(JSON.stringify(errorsMessage))
  }
  if (!response.ok) {
    throw new Error('Ошибка при регистрации')
  }

  return response.json()
}

export const loginUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: userData }),
  })
  if (!response.ok) throw new Error('Ошибка при входе')
  return response.json()
}

export const updateUserProfile = async (userData) => {
  const { token, ...user } = userData
  const response = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user }),
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return response.json()
}
export const createArticle = async (articleData, token) => {
  const response = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`, // Токен авторизации
    },
    body: JSON.stringify({ article: articleData }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка при создании статьи')
  }

  return response.json()
}
export const deleteArticle = async (slug, token) => {
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`, // Токен авторизации
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка при удалении статьи')
  }

  return response.status === 204 ? null : response.json()
}
export const updateArticle = async (slug, articleData, token) => {
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ article: articleData }),
  })

  if (!response.ok) {
    throw new Error('Ошибка при обновлении статьи')
  }

  return response.json()
}

export const favoriteArticle = async (slug, token) => {
  const response = await fetch(`${API_URL}/articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка при добавлении статьи в избранное')
  }

  return response.json()
}

export const unfavoriteArticle = async (slug, token) => {
  const response = await fetch(`${API_URL}/articles/${slug}/favorite`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Ошибка при удалении статьи из избранного')
  }

  return response.json()
}
