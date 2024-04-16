import { makeAnswer } from 'test/factories/makeAnswer'
import { OnAnswerCommentCreated } from './onAnswerCommentCreated'
import { InMemoryAnswersRepository } from 'test/repositories/inMemoryAnswersRepository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/inMemoryAnswerAttachmentRepository'
import { InMemoryQuestionsRepository } from 'test/repositories/inMemoryQuestionsRepository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../useCases/sendNotification'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/inMemoryQuestionAttachmentRepository'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/waitFor'
import { makeAnswerComment } from 'test/factories/makeAnswerComment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/inMemoryAnswerCommentsRepository'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
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

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )

    repository = new InMemoryNotificationsRepository()

    sut = new SendNotificationUseCase(repository)

    sendNotificationExecuteSpy = vi.spyOn(sut, 'execute')

    new OnAnswerCommentCreated(inMemoryAnswersRepository, sut)
  })
  it('Should send a notification when an answer comment is created', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    const answerComment = makeAnswerComment({
      answerId: answer.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)
    await inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
