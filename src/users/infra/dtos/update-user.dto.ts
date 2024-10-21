import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'

//Id não estará no corpo da requisição, logo será omitido
export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name: string
}
