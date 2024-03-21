import { IStudentsRepository } from '@/domain/forum/application/repositories/IStudentsRepository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements IStudentsRepository {
  public items: Student[] = []

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }
}
