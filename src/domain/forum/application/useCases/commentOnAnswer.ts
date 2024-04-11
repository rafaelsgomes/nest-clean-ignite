import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { AnswerComment } from '../../enterprise/entities/answerComment'
import { IAnswersRepository } from '../repositories/IAnswersRepository'
import { IAnswerCommentsRepository } from '../repositories/IAnswerCommentsRepository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resourceNotFoundError'
import { Injectable } from '@nestjs/common'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: IAnswersRepository,
    private answersCommentsRepository: IAnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answersCommentsRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
