import { QuestionDetails } from '@/domain/forum/enterprise/entities/valueObjects/questionDetails'
import { AttachmentPresenter } from './attachmentsPresenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      content: questionDetails.content,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.author,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
