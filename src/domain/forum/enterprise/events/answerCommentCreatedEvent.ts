import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { DomainEvent } from '@/core/events/domainEvent'
import { AnswerComment } from '../entities/answerComment'

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public answerComment: AnswerComment

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id
  }
}
