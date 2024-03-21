import { AuthenticateStudentStudentUseCase } from './authenticateStudent'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { FakeHasher } from 'test/cryptography/fakeHasher'
import { FakeEncrypter } from 'test/cryptography/fakeEncrypter'
import { makeStudent } from 'test/factories/makeStudent'

let repository: InMemoryStudentsRepository
let hasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateStudentStudentUseCase

describe('Authenticate Student', async () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateStudentStudentUseCase(repository, hasher, encrypter)
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'fake@email.com',
      password: await hasher.hash('fakePassword123'),
    })

    await repository.create(student)

    const result = await sut.execute({
      email: 'fake@email.com',
      password: 'fakePassword123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
