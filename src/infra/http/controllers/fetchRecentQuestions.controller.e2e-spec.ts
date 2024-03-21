import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test E2E',
        email: 'test.e2e@email.com',
        password: 'TestE2E123',
      },
    })

    await prisma.question.createMany({
      data: [
        {
          content: 'Test E2E question content',
          title: 'Test E2E question title 01',
          slug: 'teste2e-question-content-01',
          authorId: user.id,
        },
        {
          content: 'Test E2E question content',
          title: 'Test E2E question title 02',
          slug: 'teste2e-question-content-02',
          authorId: user.id,
        },
        {
          content: 'Test E2E question content',
          title: 'Test E2E question title 03',
          slug: 'teste2e-question-content-03',
          authorId: user.id,
        },
      ],
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Test E2E question title 01' }),
        expect.objectContaining({ title: 'Test E2E question title 02' }),
        expect.objectContaining({ title: 'Test E2E question title 03' }),
      ],
    })
  })
})
