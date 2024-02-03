import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/paginationParams'

export interface IQuestionsRepository {
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  findbySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  delete(question: Question): Promise<void>
}
