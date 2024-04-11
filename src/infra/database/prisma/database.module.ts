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
import { IAnswerAttachmentsRepository } from '@/domain/forum/application/repositories/IAnswerAttachmentsRepository'
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/IAnswerCommentsRepository'
import { IAnswersRepository } from '@/domain/forum/application/repositories/IAnswersRepository'
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/IQuestionAttachmentsRepository'
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/IQuestionCommentsRepository'

@Module({
  providers: [
    PrismaService,
    {
      provide: IQuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: IStudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: IAnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: IAnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: IAnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: IQuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: IQuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    IQuestionsRepository,
    IStudentsRepository,
    IAnswersRepository,
    IAnswerCommentsRepository,
    IAnswerAttachmentsRepository,
    IQuestionCommentsRepository,
    IQuestionAttachmentsRepository,
  ],
})
export class DatabaseModule {}
