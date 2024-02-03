import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Answer } from '../../enterprise/entities/answer'
import { IAnswersRepository } from '../repositories/IAnswersRepository'
import { Either, right } from '@/core/either'
import { AnswerAttachmentList } from '../../enterprise/entities/answerAttachmentList'
import { AnswerAttachment } from '../../enterprise/entities/answerAttachment'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    const attachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(attachments)

    await this.answersRepository.create(answer)

    return right({
      answer,
    })
  }
}
