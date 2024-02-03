import { SendNotificationUseCase } from './sendNotification'
import { InMemoryNotificationsRepository } from 'test/repositories/inMemoryNotificationsRepository'

let repository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', async () => {
  beforeEach(() => {
    repository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(repository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: 'New notification',
      title: 'New notification title',
    })

    expect(result.isRigth()).toBe(true)
    expect(result.value?.notification.id.toString()).toEqual(expect.any(String))
  })
})
