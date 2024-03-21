import { makeNotification } from 'test/factories/makeNotification'
import { ReadNotificationUseCase } from './readNotification'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'
import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { NotAllowedError } from '@/core/errors/errors/notAllowedError'

let repository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', async () => {
  beforeEach(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(repository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await repository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-1',
      notificationId: notification.id.toString(),
    })

    if (result.isRight()) {
      expect(result.value.notification.readAt).toEqual(expect.any(Date))
    }
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    await repository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
