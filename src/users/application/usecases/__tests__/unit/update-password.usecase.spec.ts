import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptHashProvider } from '@/users/infra/providers/hash-providers/bcrypt-hash.provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUseCase Unit Tests', () => {
  let sut: UpdatePasswordUseCase.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
  })

  it('Should throws error when entity not found', async () => {
    await expect(
      sut.execute({
        id: 'fakeId',
        password: 'fakePassword',
        oldPassword: 'FakeOldPassword',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('Should throws error when old password or new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]

    await expect(
      sut.execute({ id: entity.id, password: 'newPass', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )

    await expect(
      sut.execute({ id: entity.id, password: '', oldPassword: '' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )

    await expect(
      sut.execute({ id: entity.id, password: '', oldPassword: 'fakePass' }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('Should throws error when new and old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))
    repository.items = [entity]

    await expect(
      sut.execute({
        id: entity.id,
        password: '12345',
        oldPassword: '123456',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password is invalid'))
  })

  it('Should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]
    repository.items = items

    const result = await sut.execute({
      id: items[0].id,
      password: '12345',
      oldPassword: '1234',
    })

    const checkNewPassword = await hashProvider.compareHash(
      '12345',
      result.password,
    )

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
