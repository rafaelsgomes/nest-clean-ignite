import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answerAttachment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    })

    return answerAttachment
  }
}
