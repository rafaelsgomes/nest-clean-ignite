import { DomainEvents } from '@/core/events/domainEvents'
import { EventHandler } from '@/core/events/eventHandler'
import { IAnswersRepository } from '@/domain/forum/application/repositories/IAnswersRepository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/questionBestAnswerChosenEvent'
import { SendNotificationUseCase } from '../useCases/sendNotification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: IAnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Your answer was chosen!`,
        content: `The answer that you send on ${question.title
          .substring(0, 20)
          .concat('...')} was chosen for the author!`,
      })
    }
  }
}
