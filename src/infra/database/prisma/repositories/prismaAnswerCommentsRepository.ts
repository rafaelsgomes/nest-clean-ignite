import { PaginationParams } from '@/core/repositories/paginationParams'
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/IAnswerCommentsRepository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answerComment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prismaAnswerCommentMapper'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/commentWithAuthor'
import { PrismaCommentWithAuthorMapper } from '../mappers/prismaCommentWithAuthorMapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements IAnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toDatabase(answerComment),
    })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!answerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return answerComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }
}
