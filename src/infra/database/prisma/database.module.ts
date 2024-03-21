import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaAnswersRepository } from './repositories/prismaAnswersRepository'
import { PrismaAnswerCommentsRepository } from './repositories/prismaAnswerCommentsRepository'
import { PrismaAnswerAttachmentsRepository } from './repositories/prismaAnswerAttachmentsRepository'
import { PrismaQuestionsRepository } from './repositories/prismaQuestionsRepository'
import { PrismaQuestionCommentsRepository } from './repositories/prismaQuestionCommentsRepository'
import { PrismaQuestionAttachmentsRepository } from './repositories/prismaQuestionAttachmentsRepository'
import { IQuestionsRepository } from '@/domain/forum/application/repositories/IQuestionsRepository'
import { IStudentsRepository } from '@/domain/forum/application/repositories/IStudentsRepository'
import { PrismaStudentsRepository } from './repositories/prismaStudentsRepository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    {
      provide: IQuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    {
      provide: IStudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    IQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    IStudentsRepository,
  ],
})
export class DatabaseModule {}
