import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@//prisma/prisma.servie'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@//pipes/zodValidationPipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const passwordHash = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })
  }
}
