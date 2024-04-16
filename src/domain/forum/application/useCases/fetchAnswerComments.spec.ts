import { FetchAnswerCommentsUseCase } from './fetchAnswerComments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/inMemoryAnswerCommentsRepository'
import { makeAnswerComment } from 'test/factories/makeAnswerComment'
import { AnswerComment } from '../../enterprise/entities/answerComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { makeStudent } from 'test/factories/makeStudent'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let repository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer AnswerComments', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    repository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(repository)
  })

  it('should be able to fetch answer answerComments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const newAnswerComments: AnswerComment[] = []

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 20),
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 18),
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )

    newAnswerComments.push(
      makeAnswerComment({
        createdAt: new Date(2022, 0, 23),
        answerId: new UniqueEntityId('answer-1'),
        authorId: student.id,
      }),
    )

    await repository.create(newAnswerComments[0])
    await repository.create(newAnswerComments[1])
    await repository.create(newAnswerComments[2])

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: newAnswerComments[0].id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: newAnswerComments[1].id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: newAnswerComments[2].id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated answer answerComments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
