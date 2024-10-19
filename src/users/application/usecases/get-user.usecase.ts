import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput } from '../dto/user-output'

export namespace GetUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = UserOutput

  export class UseCase {
    //Injeção de dependência
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id)

      return entity.toJson()
    }
  }
}