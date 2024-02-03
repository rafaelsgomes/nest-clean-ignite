import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answerComentCreatedEvent'
import { SendNotificationUseCase } from '../useCases/sendNotification'
import { IAnswersRepository } from '@/domain/forum/application/repositories/IAnswersRepository'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `New coment on ${answer.content.substring(0, 40).concat('...')}`,
        content: answerComment.content.substring(0, 20).concat('...'),
      })
    }
  }
}
