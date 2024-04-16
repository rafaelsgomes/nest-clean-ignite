import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/paginationParams'
import { QuestionDetails } from '../../enterprise/entities/valueObjects/questionDetails'

export abstract class IQuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findById(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract delete(question: Question): Promise<void>
}
