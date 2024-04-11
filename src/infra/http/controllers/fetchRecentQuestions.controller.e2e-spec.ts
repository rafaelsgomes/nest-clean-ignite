import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/makeQuestion'
import { StudentFactory } from 'test/factories/makeStudent'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    await Promise.all([
      await questionFactory.makePrismaQuestion({
        title: 'Test E2E question title 01',
        authorId: user.id,
      }),
      await questionFactory.makePrismaQuestion({
        title: 'Test E2E question title 02',
        authorId: user.id,
      }),
      await questionFactory.makePrismaQuestion({
        title: 'Test E2E question title 03',
        authorId: user.id,
      }),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Test E2E question title 03' }),
        expect.objectContaining({ title: 'Test E2E question title 02' }),
        expect.objectContaining({ title: 'Test E2E question title 01' }),
      ]),
    })
  })
})
