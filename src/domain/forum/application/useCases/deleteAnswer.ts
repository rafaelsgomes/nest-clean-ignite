import { Either, left, right } from '@/core/either'
import { IAnswersRepository } from '../repositories/IAnswersRepository'
import { NotAllowedError } from '@/core/errors/errors/notAllowedError'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: IAnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right(null)
  }
}
