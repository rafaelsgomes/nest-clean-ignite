import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/IQuestionAttachmentsRepository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/questionAttachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prismaQuestionAttachmentMapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements IQuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}
  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const attachmentsIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        id: questionId,
      },
    })
  }
}
