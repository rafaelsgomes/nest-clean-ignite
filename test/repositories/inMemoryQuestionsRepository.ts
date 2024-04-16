import { DomainEvents } from '@/core/events/domainEvents'
import { PaginationParams } from '@/core/repositories/paginationParams'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/IQuestionsRepository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/valueObjects/questionDetails'
import { InMemoryStudentsRepository } from './inMemoryStudentsRepository'
import { InMemoryAttachmentsRepository } from './inMemoryAttachmentsRepository'
import { InMemoryQuestionAttachmentsRepository } from './inMemoryQuestionAttachmentRepository'

export class InMemoryQuestionsRepository implements IQuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items[questionIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((author) => {
      return author.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exists.`,
      )
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (item) => {
        return item.questionId.equals(question.id)
      },
    )

    const attachments = questionAttachments.map((item) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(item.attachmentId)
      })

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${item.attachmentId.toString()}" does not exists.`,
        )
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      title: question.title,
      slug: question.slug,
      content: question.content,
      attachments,
      bestAnswerId: question.bestAnswerId,
      author: author.name,
      authorId: author.id,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
