import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string
    password: string
    oldPassword: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    //Injeção de dependência
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)

      if (!input.oldPassword || !input.password) {
        throw new InvalidPasswordError(
          'Old password and new password is required',
        )
      }

      const checkOldPassowrd = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      )

      if (!checkOldPassowrd) {
        throw new InvalidPasswordError('Old password is invalid')
      }

      const hashPassword = await this.hashProvider.generateHash(input.password)
      entity.updatePassword(hashPassword)

      await this.userRepository.update(entity)

      return UserOutputMapper.toOutput(entity)
    }
  }
}
