import { InMemoryAnswerCommentsRepository } from 'test/repositories/inMemoryAnswerCommentsRepository'
import { DeleteAnswerCommentUseCase } from './deleteAnswerComment'
import { makeAnswerComment } from 'test/factories/makeAnswerComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '@/core/errors/errors/notAllowedError'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let repository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    repository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(repository)
  })

  it('should be able to delete a answer comment', async () => {
    const comment = makeAnswerComment()

    await repository.create(comment)

    await sut.execute({
      authorId: comment.authorId.toString(),
      answerCommentId: comment.id.toString(),
    })

    expect(repository.items).toHaveLength(0)
  })

  it('should not be able to delete another user a answer comment', async () => {
    const comment = makeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await repository.create(comment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: comment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
