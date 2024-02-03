import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/questionComentCreatedEvent'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/IQuestionsRepository'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: IQuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendNewQuestionNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `New coment on ${question.content
          .substring(0, 40)
          .concat('...')}`,
        content: questionComment.content.substring(0, 20).concat('...'),
      })
    }
  }
}
