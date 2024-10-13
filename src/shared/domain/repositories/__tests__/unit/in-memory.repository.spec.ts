import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('Should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'any_name', price: 10 })
    await sut.insert(entity)
    expect(entity.toJson()).toStrictEqual(sut.items[0].toJson())
  })

  it('Should throw error when entity not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('Should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'any_name', price: 10 })
    await sut.insert(entity)
    const result = await sut.findById(entity.id)
    expect(entity.toJson()).toStrictEqual(result.toJson())
  })
})