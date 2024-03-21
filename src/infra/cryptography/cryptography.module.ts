import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwtEncrypter'
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator'
import { BcryptHasher } from './bcryptHasher'
import { HashComparer } from '@/domain/forum/application/cryptography/hashComparer'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
