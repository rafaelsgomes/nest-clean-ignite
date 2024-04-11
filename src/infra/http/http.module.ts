import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/createAccount.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/createQuestion.controller'
import { FetchRecentQuestionsController } from './controllers/fetchRecentQuestions.controller'
import { DatabaseModule } from '../database/prisma/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/useCases/createQuestion'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/useCases/fetchRecentQuestions'
import { RegisterStudentUseCase } from '@/domain/forum/application/useCases/registerStudent'
import { AuthenticateStudentStudentUseCase } from '@/domain/forum/application/useCases/authenticateStudent'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetQuestionBySlugController } from './controllers/getQuestionBySlug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/useCases/getQuestionBySlug'
import { EditQuestionController } from './controllers/editQuestion.controller'
import { EditQuestionUseCase } from '@/domain/forum/application/useCases/editQuestion'
import { DeleteQuestionController } from './controllers/deleteQuestion.controller'
import { DeleteQuestionUseCase } from '@/domain/forum/application/useCases/deleteQuestion'
import { AnswerQuestionController } from './controllers/answerQuestion.controller'
import { AnswerQuestionUseCase } from '@/domain/forum/application/useCases/answerQuestion'
import { EditAnswerController } from './controllers/editAnswer.controller'
import { EditAnswerUseCase } from '@/domain/forum/application/useCases/editAnswer'
import { DeleteAnswerController } from './controllers/deleteAnswer.controller'
import { DeleteAnswerUseCase } from '@/domain/forum/application/useCases/deleteAnswer'
import { FetchQuestionAnswersController } from './controllers/fetchQuestionAnswers.controller'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/useCases/fetchQuestionAnswers'
import { ChooseQuestionBestAnswerController } from './controllers/chooseQuestionBestAnswer.controller'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/useCases/chooseQuestionBestAnswer'
import { CommentOnQuestionController } from './controllers/commentOnQuestion.controller'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/useCases/commentOnQuestion'
import { CommentOnAnswerController } from './controllers/commentOnAnswer.controller'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/useCases/commentOnAnswer'
import { DeleteQuestionCommentController } from './controllers/deleteQuestionComment.controller'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/useCases/deleteQuestionComment'
import { DeleteAnswerCommentController } from './controllers/deleteAnswerComment.controller'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/useCases/deleteAnswerComment'
import { FetchQuestionCommentsController } from './controllers/fetchQuestionComments.controller'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/useCases/fetchQuestionComments'
import { FetchAnswerCommentsController } from './controllers/fetchAnswerComments.controller'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/useCases/fetchAnswerComments'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    CommentOnAnswerController,
    DeleteQuestionCommentController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
  ],
})
export class HttpModule {}
