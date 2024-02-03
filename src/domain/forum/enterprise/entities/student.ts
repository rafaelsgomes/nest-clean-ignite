import { UniqueEntityId } from '@/core/entities/UniqueEntityId'
import { Entity } from '@/core/entities/entity'

interface SutdentProps {
  name: string
}

export class Student extends Entity<SutdentProps> {
  static create(props: SutdentProps, id?: UniqueEntityId) {
    const student = new Student(
      {
        ...props,
      },
      id,
    )

    return student
  }
}
