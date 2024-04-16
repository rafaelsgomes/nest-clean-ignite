import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { ValueObject } from '@/core/entities/valueObject'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface QuestionDetailsProps {
  questionId: UniqueEntityId
  title: string
  slug: Slug
  content: string
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  author: string
  authorId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get author() {
    return this.props.author
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(pros: QuestionDetailsProps) {
    return new QuestionDetails(pros)
  }
}
