import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/questionComment'
import { IQuestionCommentsRepository } from '../repositories/IQuestionCommentsRepository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository,
  ) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findyManyByQuestionId(questionId, {
        page,
      })

    return right({
      questionComments,
    })
  }
}
