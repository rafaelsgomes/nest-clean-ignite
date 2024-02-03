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

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

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
