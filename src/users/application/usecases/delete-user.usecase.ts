import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace DeleteUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  export class UseCase implements DefaultUseCase<Input, Output> {
    //Injeção de dependência
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.userRepository.deleteById(input.id)
    }
  }
}
