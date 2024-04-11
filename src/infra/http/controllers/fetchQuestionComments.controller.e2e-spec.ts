import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/makeQuestion'
import { QuestionCommentFactory } from 'test/factories/makeQuestionComment'
import { StudentFactory } from 'test/factories/makeStudent'

describe('Fetch question comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

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
      await questionCommentFactory.makePrismaQuestion({
        questionId: question.id,
        authorId: user.id,
        content: 'Comment Question Content 01 - Test E2E',
      }),
      await questionCommentFactory.makePrismaQuestion({
        questionId: question.id,
        authorId: user.id,
        content: 'Comment Question Content 02 - Test E2E',
      }),
      await questionCommentFactory.makePrismaQuestion({
        questionId: question.id,
        authorId: user.id,
        content: 'Comment Question Content 03 - Test E2E',
      }),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questionComments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment Question Content 03 - Test E2E',
        }),
        expect.objectContaining({
          content: 'Comment Question Content 02 - Test E2E',
        }),
        expect.objectContaining({
          content: 'Comment Question Content 01 - Test E2E',
        }),
      ]),
    })
  })
})
