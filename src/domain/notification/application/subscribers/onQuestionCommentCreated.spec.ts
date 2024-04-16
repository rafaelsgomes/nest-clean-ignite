import { makeQuestion } from 'test/factories/makeQuestion'
import { OnQuestionCommentCreated } from './onQuestionCommentCreated'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../useCases/sendNotification'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/waitFor'
import { makeQuestionComment } from 'test/factories/makeQuestionComment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/inMemoryQuestionCommentsRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )

    repository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(repository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnQuestionCommentCreated(inMemoryQuestionsRepository, sut)
  })
  it('Should send a notification when an question comment is created', async () => {
    const question = makeQuestion()

    const questionComment = makeQuestionComment({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
