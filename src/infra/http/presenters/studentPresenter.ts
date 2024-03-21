import { Student } from '@/domain/forum/enterprise/entities/student'

export class StudentPresenter {
  static toHTTP(student: Student) {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
    }
  }
}
