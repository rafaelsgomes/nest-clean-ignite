import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { IStudentsRepository } from '../repositories/IStudentsRepository'
import { HashGenerator } from '../cryptography/hashGenerator'
import { StudentAlreadyExistsError } from './errors/studentAlreadyExistsError'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: IStudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const student = Student.create({
      name,
      email,
      password: await this.hashGenerator.hash(password),
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
