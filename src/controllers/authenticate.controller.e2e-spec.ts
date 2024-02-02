import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.servie'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Test E2E',
        email: 'test.e2e@email.com',
        password: await hash('TestE2E123', 8),
      },
    })
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'test.e2e@email.com',
      password: 'TestE2E123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})