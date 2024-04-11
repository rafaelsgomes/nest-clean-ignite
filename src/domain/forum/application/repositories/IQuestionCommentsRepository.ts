import { PaginationParams } from '@/core/repositories/paginationParams'
import { QuestionComment } from '../../enterprise/entities/questionComment'

export abstract class IQuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>

  abstract delete(questionComment: QuestionComment): Promise<void>
}
