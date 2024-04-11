import { Either, left, right } from '@/core/either'
import { IQuestionCommentsRepository } from '../repositories/IQuestionCommentsRepository'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { NotAllowedError } from '@/core/errors/errors/notAllowedError'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(
    private questionsCommentsRepository: IQuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionsCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionsCommentsRepository.delete(questionComment)

    return right(null)
  }
}
