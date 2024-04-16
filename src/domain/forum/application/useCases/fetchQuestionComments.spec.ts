import { FetchQuestionCommentsUseCase } from './fetchQuestionComments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/inMemoryQuestionCommentsRepository'
import { makeQuestionComment } from 'test/factories/makeQuestionComment'
import { QuestionComment } from '../../enterprise/entities/questionComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { makeStudent } from 'test/factories/makeStudent'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let repository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question QuestionComments', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    repository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(repository)
  })

  it('should be able to fetch question questionComments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const newQuestionComments: QuestionComment[] = []

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 20),
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    )

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 18),
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    )

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 23),
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    )

    await repository.create(newQuestionComments[0])
    await repository.create(newQuestionComments[1])
    await repository.create(newQuestionComments[2])

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: newQuestionComments[0].id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: newQuestionComments[1].id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: newQuestionComments[2].id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question questionComments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityId('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
