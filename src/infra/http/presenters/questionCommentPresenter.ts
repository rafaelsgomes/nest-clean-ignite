import { QuestionComment } from '@/domain/forum/enterprise/entities/questionComment'

export class QuestionCommentPresenter {
  static toHTTP(questionComment: QuestionComment) {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
