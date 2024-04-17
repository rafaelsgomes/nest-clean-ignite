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
import { IAttachmentsRepository } from '@/domain/forum/application/repositories/IAttachmentsRepository'
import { PrismaAttachmentsRepository } from './repositories/prismaAttachmentsRepository'
import { INotificationsRepository } from '@/domain/notification/application/repositories/INotificationsRepository'
import { PrismaNotificationsRepository } from './repositories/prismaNotificationsRepository'
import { CacheModule } from '@/infra/cache/cache.module'

@Module({
  imports: [CacheModule],
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
    {
      provide: IAttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: INotificationsRepository,
      useClass: PrismaNotificationsRepository,
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
    IAttachmentsRepository,
    INotificationsRepository,
  ],
})
export class DatabaseModule {}
