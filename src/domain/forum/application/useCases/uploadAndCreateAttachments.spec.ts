import { UploadAndCreateAttachmentUseCase } from './uploadAndCreateAttachments'
import { InMemoryAttachmentsRepository } from 'test/repositories/inMemoryAttachmentsRepository'
import { FakeUploader } from 'test/storage/fakeUploader'
import { InvalidAttachmentTypeError } from './errors/invalidAttachmentTypeError'

let repository: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment ', async () => {
  beforeEach(() => {
    repository = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(repository, uploader)
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.jpg',
      fileType: 'image/jpg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: repository.items[0],
    })
    expect(uploader.uploads).toHaveLength(1)
    expect(uploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'sample-upload.jpg',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'sample-upload.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
