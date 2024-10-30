import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupDto } from '../../dtos/signup.dto'
import { SigninUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SigninDto } from '../../dtos/sign-in.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '4c4360b9-8533-4c50-83fe-340fecc247b4'
    props = {
      id,
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props

    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signupUseCase'] = mockSignupUseCase as any

    const input: SignupDto = {
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
    }

    const result = await sut.create(input)
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
    expect(output).toMatchObject(result)
  })

  it('should authenticate a user', async () => {
    const output: SigninUseCase.Output = props

    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signinUseCase'] = mockSigninUseCase as any

    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    }

    const result = await sut.login(input)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
    expect(output).toMatchObject(result)
  })

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUseCase as any

    const input: UpdateUserDto = {
      name: 'new Name',
    }

    const result = await sut.update(id, input)
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ ...input, id })
    expect(output).toMatchObject(result)
  })
})