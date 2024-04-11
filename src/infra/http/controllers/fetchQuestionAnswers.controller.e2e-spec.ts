import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/makeAnswer'
import { QuestionFactory } from 'test/factories/makeQuestion'
import { StudentFactory } from 'test/factories/makeStudent'

describe('Fetch answers questions (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      title: 'Test E2E question title 01',
      authorId: user.id,
    })

    await Promise.all([
      await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer Content 01 - Test E2E',
      }),
      await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer Content 02 - Test E2E',
      }),
      await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
        content: 'Answer Content 03 - Test E2E',
      }),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer Content 03 - Test E2E' }),
        expect.objectContaining({ content: 'Answer Content 02 - Test E2E' }),
        expect.objectContaining({ content: 'Answer Content 01 - Test E2E' }),
      ]),
    })
  })
})
