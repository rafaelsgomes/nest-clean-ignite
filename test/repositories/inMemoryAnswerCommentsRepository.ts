import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/IAnswerCommentsRepository'
import { AnswerComment } from '../../src/domain/forum/enterprise/entities/answerComment'
import { PaginationParams } from '@/core/repositories/paginationParams'
import { DomainEvents } from '@/core/events/domainEvents'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/commentWithAuthor'
import { InMemoryStudentsRepository } from './inMemoryStudentsRepository'

export class InMemoryAnswerCommentsRepository
  implements IAnswerCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)

    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((author) => {
          return author.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exists.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return answerComments
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(answerCommentIndex, 1)
  }
}
