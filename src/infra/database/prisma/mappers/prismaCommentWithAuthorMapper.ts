import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/commentWithAuthor'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
