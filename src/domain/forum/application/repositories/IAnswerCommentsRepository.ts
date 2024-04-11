import { PaginationParams } from '@/core/repositories/paginationParams'
import { AnswerComment } from '../../enterprise/entities/answerComment'

export abstract class IAnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract delete(answerComment: AnswerComment): Promise<void>
}
