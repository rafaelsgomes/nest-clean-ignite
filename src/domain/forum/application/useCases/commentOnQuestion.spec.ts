import { InMemoryQuestionCommentsRepository } from 'test/repositories/inMemoryQuestionCommentsRepository'
import { CommentOnQuestionUseCase } from './commentOnQuestion'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let repository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    repository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, repository)
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      authorId: '1',
      questionId: question.id.toString(),
      content: 'New comment content',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.questionComment.content).toEqual(
        'New comment content',
      )
    }
  })
})
