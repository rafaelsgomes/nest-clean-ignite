import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { DomainEvent } from '@/core/events/domainEvent'
import { QuestionComment } from '../entities/questionComment'

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id
  }
}
