import { PaginationParams } from '@/core/repositories/paginationParams'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/IQuestionsRepository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prismaQuestionMapper'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/IQuestionAttachmentsRepository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/valueObjects/questionDetails'
import { PrismaQuestionDetailsMapper } from '../mappers/prismaQuestionDetailsMapper'

@Injectable()
export class PrismaQuestionsRepository implements IQuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: IQuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toDatabase(question),
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async save(question: Question): Promise<void> {
    await Promise.all([
      await this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data: PrismaQuestionMapper.toDatabase(question),
      }),

      await this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),

      await this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionDetailsMapper.toDomain(question)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }
}
