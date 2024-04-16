import { QuestionAttachment } from '../../enterprise/entities/questionAttachment'

export abstract class IQuestionAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>

  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
