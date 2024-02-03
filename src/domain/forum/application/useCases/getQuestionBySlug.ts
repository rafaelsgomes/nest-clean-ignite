import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { IQuestionsRepository } from '../repositories/IQuestionsRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findbySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
