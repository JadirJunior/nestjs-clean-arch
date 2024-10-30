import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupDto } from '../../dtos/signup.dto'
import { SigninUseCase } from '@/users/application/usecases/sign-in.usecase'
import { SigninDto } from '../../dtos/sign-in.dto'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'

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

  it('should update an user password', async () => {
    const output: UpdatePasswordUseCase.Output = props

    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordDto = {
      oldPassword: '1234',
      password: '4321',
    }

    const result = await sut.updatePassword(id, input)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      ...input,
      id,
    })
    expect(output).toMatchObject(result)
  })

  it('should delete a user', async () => {
    const output = undefined

    const mockDeleteUser = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUser as any
    const result = await sut.remove(id)
    expect(mockDeleteUser.execute).toHaveBeenCalledWith({ id })
    expect(output).toStrictEqual(result)
  })

  it('should get a user', async () => {
    const output: GetUserUseCase.Output = props

    const mockGetUser = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUser as any
    const result = await sut.findOne(id)
    expect(mockGetUser.execute).toHaveBeenCalledWith({ id })
    expect(output).toStrictEqual(result)
  })

  it('should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }

    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any

    const searchParams: ListUsersDto = {
      page: 1,
      perPage: 1,
    }

    const result = await sut.search(searchParams)
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith({
      ...searchParams,
    })
    expect(output).toStrictEqual(result)
  })
})
