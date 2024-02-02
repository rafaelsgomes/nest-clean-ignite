import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '@//prisma/prisma.servie'
import { z } from 'zod'
import { ZodValidationPipe } from '@//pipes/zodValidationPipe'
import { JwtAuthGuard } from '@//auth/jwtAuth.guard'
import { CurrentUser } from '@//auth/currentUser.decorator'
import { UserPayload } from '@//auth/jwt.strategy'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title } = body
    const { sub: userId } = user

    const slug = this.convertToStug(title)

    await this.prisma.question.create({
      data: {
        content,
        title,
        slug,
        authorId: userId,
      },
    })
  }

  private convertToStug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u836f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}
