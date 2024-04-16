import { PaginationParams } from '@/core/repositories/paginationParams'
import { AnswerComment } from '../../enterprise/entities/answerComment'
import { CommentWithAuthor } from '../../enterprise/entities/valueObjects/commentWithAuthor'

export abstract class IAnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>

  abstract delete(answerComment: AnswerComment): Promise<void>
}
