import { AnswerAttachment } from '../../enterprise/entities/answerAttachment'

export interface IAnswerAttachmentsRepository {
  findyManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
