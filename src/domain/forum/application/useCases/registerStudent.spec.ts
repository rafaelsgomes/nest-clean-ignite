import { RegisterStudentUseCase } from './registerStudent'
import { InMemoryStudentsRepository } from 'test/repositories/inMemoryStudentsRepository'
import { FakeHasher } from 'test/cryptography/fakeHasher'

let repository: InMemoryStudentsRepository
let hasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', async () => {
  beforeEach(() => {
    repository = new InMemoryStudentsRepository()
    hasher = new FakeHasher()
    sut = new RegisterStudentUseCase(repository, hasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'Fake Name',
      email: 'fake@email.com',
      password: 'fakePassword123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: repository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'Fake Name',
      email: 'fake@email.com',
      password: 'fakePassword123',
    })

    const hashedPassword = await hasher.hash('fakePassword123')

    expect(result.isRight()).toBe(true)
    expect(repository.items[0].password).toEqual(hashedPassword)
  })
})
