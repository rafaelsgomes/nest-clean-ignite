import { PaginationParams } from '@/core/repositories/paginationParams'
import { IAnswersRepository } from '@/domain/forum/application/repositories/IAnswersRepository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prismaAnswerMapper'

@Injectable()
export class PrismaAnswersRepository implements IAnswersRepository {
  constructor(private prisma: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toDatabase(answer),
    })
  }

  async save(answer: Answer): Promise<void> {
    await this.prisma.answer.update({
      where: {
        id: answer.id.toString(),
      },
      data: PrismaAnswerMapper.toDatabase(answer),
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
