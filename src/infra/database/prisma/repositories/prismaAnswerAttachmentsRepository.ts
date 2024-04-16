import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/IAnswerAttachmentsRepository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answerAttachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../mappers/prismaAnswerAttachmentMapper'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements IAnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    })

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        id: answerId,
      },
    })
  }
}
