import { FetchQuestionCommentsUseCase } from './fetchQuestionComments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/inMemoryQuestionCommentsRepository'
import { makeQuestionComment } from 'test/factories/makeQuestionComment'
import { QuestionComment } from '../../enterprise/entities/questionComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'

let repository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question QuestionComments', async () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(repository)
  })

  it('should be able to fetch question questioncomments', async () => {
    const newQuestionComments: QuestionComment[] = []

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 20),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 18),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    newQuestionComments.push(
      makeQuestionComment({
        createdAt: new Date(2022, 0, 23),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    await repository.create(newQuestionComments[0])
    await repository.create(newQuestionComments[1])
    await repository.create(newQuestionComments[2])

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(result.value?.questionComments).toHaveLength(3)
    expect(result.value?.questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated question questioncomments', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    const reult = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(reult.value?.questionComments).toHaveLength(2)
  })
})
