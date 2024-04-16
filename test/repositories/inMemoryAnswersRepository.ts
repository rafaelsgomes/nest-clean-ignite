import { DomainEvents } from '@/core/events/domainEvents'
import { PaginationParams } from '@/core/repositories/paginationParams'
import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/IAnswerAttachmentsRepository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/IAnswersRepository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements IAnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: IAnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[answerIndex] = answer

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    )

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(answerIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
