import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { registerUser, loginUser, updateUserProfile } from '../api/api'

export const signUpUser = createAsyncThunk('auth/signUp', async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUser(userData)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  } catch (error) {
    return rejectWithValue(JSON.parse(error.message))
  }
})

export const signInUser = createAsyncThunk('auth/signIn', async (userData, { rejectWithValue }) => {
  try {
    const data = await loginUser(userData)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  } catch (error) {
    if (error.errors) {
      return rejectWithValue(error.errors)
    }
    return rejectWithValue('Ошибка при регистрации')
  }
})

export const updateUser = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const { token, ...userDetails } = userData
    const data = await updateUserProfile({ ...userDetails, token })
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const savedUser = JSON.parse(localStorage.getItem('user')) || {}
const authSlice = createSlice({
  name: 'user',
  initialState: {
    token: savedUser.token || null,
    username: savedUser.username || null,
    email: savedUser.email || null,
    image: savedUser.image || '',
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.username = null
      state.email = null
      state.image = ''
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
        state.email = action.payload.email
        state.image = action.payload.image || ''
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.username = action.payload.username
        state.email = action.payload.email
        state.image = action.payload.image || ''
        state.error = null
      })
      .addCase(signInUser.rejected, (state) => {
        state.error = 'The email or password was entered incorrectly'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.username = action.payload.username
        state.email = action.payload.email
        state.image = action.payload.image || ''
        state.error = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
