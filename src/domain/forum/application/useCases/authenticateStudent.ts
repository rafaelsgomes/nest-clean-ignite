import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { IStudentsRepository } from '../repositories/IStudentsRepository'
import { HashComparer } from '../cryptography/hashComparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrongCredentialsError'

interface AuthenticateStudentStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentStudentUseCase {
  constructor(
    private studentsRepository: IStudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentStudentUseCaseRequest): Promise<AuthenticateStudentStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordMatch = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
