import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { DeleteUserUseCase } from '../../delete-user.usecase'

describe('DeleteUserUseCase Unit Tests', () => {
  let sut: DeleteUserUseCase.UseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(repository)
  })

  it('Should throws error when entity not found', async () => {
    await expect(sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should delete an user', async () => {
    const spyDelete = jest.spyOn(repository, 'deleteById')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    await sut.execute({ id: items[0].id })

    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(items.length).toBe(0)
  })
})
