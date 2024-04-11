import { AnswerComment } from '@/domain/forum/enterprise/entities/answerComment'

export class AnswerCommentPresenter {
  static toHTTP(answerComment: AnswerComment) {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
