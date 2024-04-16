import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/IQuestionAttachmentsRepository'
import { QuestionAttachment } from '../../src/domain/forum/enterprise/entities/questionAttachment'

export class InMemoryQuestionAttachmentsRepository
  implements IQuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []
  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    )

    this.items = questionAttachments
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = questionAttachments
  }
}
