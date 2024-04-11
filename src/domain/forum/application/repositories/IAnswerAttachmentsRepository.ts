import { AnswerAttachment } from '../../enterprise/entities/answerAttachment'

export abstract class IAnswerAttachmentsRepository {
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
