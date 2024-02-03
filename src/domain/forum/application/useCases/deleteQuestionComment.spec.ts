import { InMemoryQuestionCommentsRepository } from 'test/repositories/inMemoryQuestionCommentsRepository'
import { DeleteQuestionCommentUseCase } from './deleteQuestionComment'
import { makeQuestionComment } from 'test/factories/makeQuestionComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '../../../../core/errors/errors/notAllowedError'

let repository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', async () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(repository)
  })

  it('should be able to delete a question comment', async () => {
    const comment = makeQuestionComment()

    await repository.create(comment)

    await sut.execute({
      authorId: comment.authorId.toString(),
      questionCommentId: comment.id.toString(),
    })

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete another user a question comment', async () => {
    const comment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(comment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
