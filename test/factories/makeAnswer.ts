import { faker } from '@faker-js/faker'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prismaAnswerMapper'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answer
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toDatabase(answer),
    })

    return answer
  }
}
