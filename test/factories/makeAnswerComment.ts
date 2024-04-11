import { faker } from '@faker-js/faker'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answerComment'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prismaAnswerCommentMapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return answerComment
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answer = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toDatabase(answer),
    })

    return answer
  }
}
