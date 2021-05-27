import express from 'express'
import { getConnection } from 'typeorm'

import { Todo } from './entity/Todo'
import { Comment } from './entity/Comment'
import { checkTodoExists, checkCommentExists } from './utils'

const router = express.Router()

router.post(
  '/create_item',
  async (req: { body: { content: string; is_favorite: boolean; is_complete: boolean } }, resp) => {
    let result

    try {
      result = await Todo.create({
        content: req.body.content,
        is_favorite: req.body.is_favorite,
        is_complete: req.body.is_complete,
      }).save()
    } catch (err) {
      result = {
        detail: err.detail,
      }
      resp.status(400)
    }

    resp.json(result)
  }
)

router.get('/items', async (req, resp) => {
  let result

  try {
    result = await Todo.find({ relations: ['comments'] })
  } catch (err) {
    result = {
      detail: err.detail,
    }
    resp.status(400)
  }

  resp.json(result)
})

router.post(
  '/set_complete_status',
  async (
    req: {
      body: {
        id: number
        is_complete: boolean
      }
    },
    resp
  ) => {
    if (await checkTodoExists(req.body.id)) {
      return resp.status(400).json({ detail: `cannot find todo with id ${req.body.id}` })
    }

    let result

    try {
      result = await Todo.update(req.body.id, {
        is_complete: req.body.is_complete,
      })
    } catch (err) {
      result = {
        detail: err.detail,
      }
      resp.status(400)
    }

    resp.json(result)
  }
)

router.post(
  '/set_favorite_status',
  async (
    req: {
      body: {
        id: number
        is_favorite: boolean
      }
    },
    resp
  ) => {
    if (await checkTodoExists(req.body.id)) {
      return resp.status(400).json({ detail: `cannot find todo with id ${req.body.id}` })
    }

    let result

    try {
      result = await Todo.update(req.body.id, {
        is_favorite: req.body.is_favorite,
      })
    } catch (err) {
      result = {
        detail: err.detail,
      }
      resp.status(400)
    }

    resp.json(result)
  }
)

router.post('/edit_item', async (req: { body: { id: number; content: string } }, resp) => {
  if (await checkTodoExists(req.body.id)) {
    return resp.status(400).json({ detail: `cannot find todo with id ${req.body.id}` })
  }

  let result

  try {
    result = await Todo.update(req.body.id, {
      content: req.body.content,
    })
  } catch (err) {
    result = {
      detail: err.detail,
    }
    resp.status(400)
  }

  resp.json(result)
})

router.post(
  '/create_comment',
  async (
    req: {
      body: {
        todo_id: number
        comment_content: string
      }
    },
    resp
  ) => {
    if (await checkTodoExists(req.body.todo_id)) {
      return resp.status(400).json({ detail: `cannot find todo with id ${req.body.todo_id}` })
    }

    let result

    try {
      result = await Comment.create({
        content: req.body.comment_content,
        todoId: req.body.todo_id,
      }).save()
    } catch (err) {
      result = {
        detail: err.detail,
      }
      resp.status(400)
    }

    resp.json(result)
  }
)

router.delete('/item/:itemId', async (req: { params: { itemId: number } }, resp) => {
  if (await checkTodoExists(req.params.itemId)) {
    return resp.status(400).json({ detail: `cannot find todo with id ${req.params.itemId}` })
  }

  let result

  try {
    result = await Todo.delete(req.params.itemId)
  } catch (err) {
    result = {
      detail: err.detail,
    }
    resp.status(400)
  }

  resp.json(result)
})

router.delete('/comment/:commentId', async (req: { params: { commentId: number } }, resp) => {
  if (await checkCommentExists(req.params.commentId)) {
    return resp.status(400).json({ detail: `cannot find comment with id ${req.params.commentId}` })
  }

  let result

  try {
    result = await Comment.delete(req.params.commentId)
  } catch (err) {
    result = {
      detail: err.detail,
    }
    resp.status(400)
  }

  resp.json(result)
})

export default router
