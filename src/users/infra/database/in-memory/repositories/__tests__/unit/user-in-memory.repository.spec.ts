import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

describe('UserInMemoryRepository Unit Tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email a@a.com'),
    )
  })

  it('Should find an entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)

    expect(entity.toJson()).toStrictEqual(result.toJson())
  })

  it('Should throw error when found an other email in the list - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    )
  })

  it('Should not throw error when not found an entity email - emailExists method', async () => {
    expect.assertions(0)
    await sut.emailExists('email@gmail.com')
  })

  it('Should no filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result, 'filter')

    const itemsFiltered = await sut['applyFilter'](result, null)

    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it('Should filter name field using filter param', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test1' })),
      new UserEntity(UserDataBuilder({ name: 'TEST' })),
      new UserEntity(UserDataBuilder({ name: 'Test' })),
      new UserEntity(UserDataBuilder({ name: 'Arapuca' })),
    ]
    const spyFilter = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, 'TEST')

    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]])
  })

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test1', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'Test',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'Arapuca',
          createdAt: new Date(createdAt.getTime() + 3),
        }),
      ),
    ]

    const sortedItems = await sut['applySort'](items, null, null)
    expect(sortedItems).toStrictEqual([...items].reverse())
  })

  it('Should sort by name field', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test1' })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'Test',
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'Arapuca',
        }),
      ),
    ]

    let sortedItems = await sut['applySort'](items, 'name', 'asc')
    expect(sortedItems).toStrictEqual([items[3], items[1], items[2], items[0]])

    sortedItems = await sut['applySort'](items, 'name', null)
    expect(sortedItems).toStrictEqual(
      [items[3], items[1], items[2], items[0]].reverse(),
    )
  })
})
