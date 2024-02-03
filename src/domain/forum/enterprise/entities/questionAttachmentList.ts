import { WatchedList } from '@/core/entities/WatchedList'
import { QuestionAttachment } from './questionAttachment'

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
