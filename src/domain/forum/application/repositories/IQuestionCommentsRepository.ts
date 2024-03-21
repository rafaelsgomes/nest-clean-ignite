import { PaginationParams } from '@/core/repositories/paginationParams'
import { QuestionComment } from '../../enterprise/entities/questionComment'

export interface IQuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  delete(questionComment: QuestionComment): Promise<void>
}
