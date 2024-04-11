import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        questionId: new UniqueEntityId(raw.questionId),
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toDatabase(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      questionId: answer.questionId.toString(),
    }
  }
}
