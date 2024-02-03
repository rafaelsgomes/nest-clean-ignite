import { QuestionAttachment } from '../../enterprise/entities/questionAttachment'

export interface IQuestionAttachmentsRepository {
  findyManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
