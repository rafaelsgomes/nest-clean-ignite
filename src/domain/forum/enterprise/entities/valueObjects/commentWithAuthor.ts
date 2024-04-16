import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { ValueObject } from '@/core/entities/valueObject'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId
  content: string
  author: string
  authorId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
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

  static create(pros: CommentWithAuthorProps) {
    return new CommentWithAuthor(pros)
  }
}
