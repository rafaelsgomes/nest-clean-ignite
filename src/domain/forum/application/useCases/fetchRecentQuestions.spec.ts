import { FetchRecentQuestionsUseCase } from './fetchRecentQuestions'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { Question } from '../../enterprise/entities/question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let repository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    repository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(repository)
  })

  it('should be able to fetch recent questions', async () => {
    const newQuestions: Question[] = []

    newQuestions.push(
      makeQuestion({
        createdAt: new Date(2022, 0, 20),
      }),
    )

    newQuestions.push(
      makeQuestion({
        createdAt: new Date(2022, 0, 18),
      }),
    )

    newQuestions.push(
      makeQuestion({
        createdAt: new Date(2022, 0, 23),
      }),
    )

    await repository.create(newQuestions[0])
    await repository.create(newQuestions[1])
    await repository.create(newQuestions[2])

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await repository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
