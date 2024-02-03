import { FetchAnswerCommentsUseCase } from './fetchAnswerComments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/inMemoryAnswerCommentsRepository'
import { makeAnswerComment } from 'test/factories/makeAnswerComment'
import { AnswerComment } from '../../enterprise/entities/answerComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'

let repository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer AnswerComments', async () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(repository)
  })

  it('should be able to fetch answer answercomments', async () => {
    const newAnswerComments: AnswerComment[] = []

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 20),
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 18),
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 23),
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    await repository.create(newAnswerComments[0])
    await repository.create(newAnswerComments[1])
    await repository.create(newAnswerComments[2])

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.value?.answerComments).toHaveLength(3)
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated answer answercomments', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
