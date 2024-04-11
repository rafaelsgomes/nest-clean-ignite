import { PaginationParams } from '@/core/repositories/paginationParams'
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/IQuestionCommentsRepository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/questionComment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prismaQuestionCommentMapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements IQuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toDatabase(questionComment),
    })
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!questionComment) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return questionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
