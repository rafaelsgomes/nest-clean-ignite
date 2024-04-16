import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/prisma/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/makeAttachment'
import { QuestionFactory } from 'test/factories/makeQuestion'
import { QuestionAttachmentFactory } from 'test/factories/makeQuestionAttachments'
import { StudentFactory } from 'test/factories/makeStudent'

describe('Edit question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      title: 'Test E2E question title 01',
      authorId: user.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Title - Test E2E',
        content: 'Test E2E question content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionOnDatabase?.title).toEqual('New Title - Test E2E')

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment1.id.toString() }),
        expect.objectContaining({ id: attachment3.id.toString() }),
      ]),
    )
  })
})
