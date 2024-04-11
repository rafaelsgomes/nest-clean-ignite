import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/makeAnswer'
import { AnswerCommentFactory } from 'test/factories/makeAnswerComment'
import { QuestionFactory } from 'test/factories/makeQuestion'
import { StudentFactory } from 'test/factories/makeStudent'

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /answers/:answerId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      title: 'Test E2E question title 01',
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all([
      await answerCommentFactory.makePrismaAnswer({
        answerId: answer.id,
        authorId: user.id,
        content: 'Comment Answer Content 01 - Test E2E',
      }),
      await answerCommentFactory.makePrismaAnswer({
        answerId: answer.id,
        authorId: user.id,
        content: 'Comment Answer Content 02 - Test E2E',
      }),
      await answerCommentFactory.makePrismaAnswer({
        answerId: answer.id,
        authorId: user.id,
        content: 'Comment Answer Content 03 - Test E2E',
      }),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      answerComments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment Answer Content 03 - Test E2E',
        }),
        expect.objectContaining({
          content: 'Comment Answer Content 02 - Test E2E',
        }),
        expect.objectContaining({
          content: 'Comment Answer Content 01 - Test E2E',
        }),
      ]),
    })
  })
})
