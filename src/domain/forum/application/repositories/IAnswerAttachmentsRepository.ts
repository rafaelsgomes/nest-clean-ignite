import { AnswerAttachment } from '../../enterprise/entities/answerAttachment'

export abstract class IAnswerAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
