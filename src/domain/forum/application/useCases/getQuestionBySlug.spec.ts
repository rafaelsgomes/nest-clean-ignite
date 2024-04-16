import { GetQuestionBySlugUseCase } from './getQuestionBySlug'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { Slug } from '../../enterprise/entities/valueObjects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { makeStudent } from 'test/factories/makeStudent'
import { makeAttachment } from 'test/factories/makeAttachment'
import { makeQuestionAttachment } from 'test/factories/makeQuestionAttachments'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let repository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', async () => {
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
    sut = new GetQuestionBySlugUseCase(repository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })

    const attachment = makeAttachment({
      title: 'Some Attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    await repository.create(newQuestion)

    const result = await sut.execute({
      slug: 'example-question',
    })

    if (result.isRight()) {
      expect(result.value.question.questionId).toBeTruthy()
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: 'Some Attachment',
            }),
          ],
        }),
      })
    }
  })
})
