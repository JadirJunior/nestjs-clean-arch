import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/user-in-memory.repository'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptHashProvider } from '@/users/infra/providers/hash-providers/bcrypt-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { SigninUseCase } from '../../sign-in.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error copy'

describe('SigninUseCase Unit Tests', () => {
  let sut: SigninUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new SigninUseCase.UseCase(repository, hashProvider)
  })

  it('Should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@gmail.com', password: hashPassword }),
    )

    repository.items = [entity]

    const result = await sut.execute({
      email: entity.email,
      password: '1234',
    })

    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(entity.toJson())
  })

  it('Should throws error when email not provided', async () => {
    const props = { email: null, password: '1234' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should throws error when password not provided', async () => {
    const props = { email: 'a@gmail.com', password: '' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    )
  })

  it('Should not be able to authenticate with wrong email', async () => {
    const props = { email: 'a@gmail.com', password: '1234' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@gmail.com', password: hashPassword }),
    )

    repository.items = [entity]

    const props = { email: entity.email, password: 'fake' }
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  // it('Should not be able to register with same email twice', async () => {
  //   const props = UserDataBuilder({ email: 'a@a.com' })
  //   await sut.execute(props)

  //   await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  // })
})