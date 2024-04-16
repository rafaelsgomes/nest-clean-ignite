import { IAttachmentsRepository } from '@/domain/forum/application/repositories/IAttachmentsRepository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prismaAttachmentMapper'

@Injectable()
export class PrismaAttachmentsRepository implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) {}
  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toDatabase(attachment),
    })
  }
}
