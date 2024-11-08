import { useForm } from 'react-hook-form'
import { Button } from 'antd'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './forms-styles.scss'

function ArticleForm({ initialValues = {}, onSubmit, isEdit = false }) {
  const {
    handleSubmit,
    register,
    unregister,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })
  const [tags, setTags] = useState(
    (initialValues.tagList || ['']).map((tag) => ({
      id: uuidv4(),
      value: typeof tag === 'string' ? tag : tag.value,
    }))
  )

  const handleAddTag = () => {
    setTags([...tags, { id: uuidv4(), value: '' }])
  }

  const handleRemoveTag = (id, index) => {
    setTags(tags.filter((tag) => tag.id !== id))
    unregister(`tagList[${index}]`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h2 className="form__title">{isEdit ? 'Edit Article' : 'Create New Article'}</h2>

      <p className="form__text">Title</p>
      <div className="form__container-input">
        <input
          type="text"
          className="form__input"
          placeholder="Title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <p className="form__text">Short description</p>
      <div className="form__container-input">
        <input
          type="text"
          placeholder="Short description"
          className="form__input"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <p className="form__text">Text</p>
      <div className="form__container-textarea">
        <textarea
          placeholder="Text"
          className="form__textarea"
          {...register('body', { required: 'Text is required' })}
        />
        {errors.text && <p>{errors.text.message}</p>}
      </div>

      <p className="form__text">Tags</p>
      <div className="form__tags">
        {tags.map((tag, index) => (
          <div key={tag.id} className="form__tags-input">
            <input className="form__tag-input" type="text" placeholder="Tag" {...register(`tagList[${index}]`)} />
            {tags.length > 1 && (
              <Button
                type="default"
                color="danger"
                variant="outlined"
                className="form__button"
                onClick={() => handleRemoveTag(tag.id, index)}
              >
                Delete
              </Button>
            )}
            {index === tags.length - 1 && (
              <Button type="default" color="primary" variant="outlined" className="form__button" onClick={handleAddTag}>
                Add Tag
              </Button>
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="form__send-info">
        {isEdit ? 'Save' : 'Send'}
      </button>
    </form>
  )
}

export default ArticleForm
