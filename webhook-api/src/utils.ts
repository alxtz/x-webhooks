import { Todo } from './entity/Todo'
import { Comment } from './entity/Comment'

export const checkTodoExists = async (id: number) => {
  const todo = await Todo.findOne({ id })

  return todo === undefined
}

export const checkCommentExists = async (id: number) => {
  const comment = await Comment.findOne({ id })

  return comment === undefined
}
