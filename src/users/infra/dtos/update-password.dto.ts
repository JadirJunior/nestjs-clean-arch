import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'

//Id não estará no corpo da requisição, logo será omitido
export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  password: string
  oldPassword: string
}
