import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { AnswerQuestionUseCase } from './answerQuestion'
import { InMemoryAnswersRepository } from 'test/repositories/inMemoryAnswersRepository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/inMemoryAnswerAttachmentRepository'

let repository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    repository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(repository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'New answer content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.id.toString()).toEqual(expect.any(String))
    expect(result.value?.answer.attachments.currentItems).toHaveLength(2)
    expect(result.value?.answer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
  it('should persist attachments when creating an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'New answer content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
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
