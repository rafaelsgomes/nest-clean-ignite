import { UseCaseError } from '@/core/errors/useCaseError'

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
