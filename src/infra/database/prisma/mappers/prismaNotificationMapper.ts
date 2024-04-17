import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        recipientId: new UniqueEntityId(raw.recipientId),
        content: raw.content,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toDatabase(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
