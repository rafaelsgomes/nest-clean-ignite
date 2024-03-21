import { PaginationParams } from '@/core/repositories/paginationParams'
import { Answer } from '../../enterprise/entities/answer'

export interface IAnswersRepository {
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>
  delete(answer: Answer): Promise<void>
}
