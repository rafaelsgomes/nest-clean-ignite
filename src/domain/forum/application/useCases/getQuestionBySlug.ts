import { Either, left, right } from '@/core/either'
import { IQuestionsRepository } from '../repositories/IQuestionsRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/valueObjects/questionDetails'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
