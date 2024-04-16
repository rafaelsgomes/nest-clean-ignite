import { DeleteQuestionUseCase } from './deleteQuestion'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '@/core/errors/errors/notAllowedError'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { makeQuestionAttachment } from 'test/factories/makeQuestionAttachments'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let repository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', async () => {
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
    sut = new DeleteQuestionUseCase(repository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await repository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(repository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await repository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
