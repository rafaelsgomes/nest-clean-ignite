import { IStudentsRepository } from '@/domain/forum/application/repositories/IStudentsRepository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prismaStudentMapper'

@Injectable()
export class PrismaStudentsRepository implements IStudentsRepository {
  constructor(private prisma: PrismaService) {}
  async create(student: Student): Promise<void> {
    await this.prisma.user.create({
      data: PrismaStudentMapper.toDatabase(student),
    })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return PrismaStudentMapper.toDomain(student)
  }
}
