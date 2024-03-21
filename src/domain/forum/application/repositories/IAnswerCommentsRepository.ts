import { PaginationParams } from '@/core/repositories/paginationParams'
import { AnswerComment } from '../../enterprise/entities/answerComment'

export interface IAnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  delete(answerComment: AnswerComment): Promise<void>
}
