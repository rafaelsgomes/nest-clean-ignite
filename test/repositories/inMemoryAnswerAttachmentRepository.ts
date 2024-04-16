import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/IAnswerAttachmentsRepository'
import { AnswerAttachment } from '../../src/domain/forum/enterprise/entities/answerAttachment'

export class InMemoryAnswerAttachmentsRepository
  implements IAnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    )

    this.items = answerAttachments
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    )

    this.items = answerAttachments
  }
}
