import { FetchQuestionAnswersUseCase } from './fetchquestionAnswers'
import { InMemoryAnswersRepository } from 'test/repositories/inMemoryAnswersRepository'
import { makeAnswer } from 'test/factories/makeAnswer'
import { Answer } from '../../enterprise/entities/answer'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/inMemoryAnswerAttachmentRepository'

let repository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(repository)
  })

  it('should be able to fetch question answers', async () => {
    const newAnswers: Answer[] = []

    newAnswers.push(
      makeAnswer({
        createdAt: new Date(2022, 0, 20),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    newAnswers.push(
      makeAnswer({
        createdAt: new Date(2022, 0, 18),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    newAnswers.push(
      makeAnswer({
        createdAt: new Date(2022, 0, 23),
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    await repository.create(newAnswers[0])
    await repository.create(newAnswers[1])
    await repository.create(newAnswers[2])

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    if (result.isRigth()) {
      expect(result.value.answers).toHaveLength(3)
      expect(result.value.answers).toEqual([
        expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
      ])
    }
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    if (result.isRigth()) {
      expect(result.value.answers).toHaveLength(2)
    }
  })
})
