import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { CreateQuestionUseCase } from './createQuestion'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let repository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', async () => {
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
    sut = new CreateQuestionUseCase(repository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'New question content',
      title: 'New question title',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question.id.toString()).toEqual(expect.any(String))
    expect(result.value?.question.attachments.currentItems).toHaveLength(2)
    expect(result.value?.question.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'New question content',
      title: 'New question title',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
