import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-test'
import { DatabaseModule } from '@/shared/infra/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserModelMapper } from '../../../models/user-model.mapper'
import { UserRepository } from '@/users/domain/repositories/user.repository'

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()

  let sut: UserPrismaRepository

  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throws error when entity not found', async () => {
    expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID fakeId`),
    )
  })

  it('should finds a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const newUser = await prismaService.user.create({
      data: entity.toJson(),
    })

    const output = await sut.findById(newUser.id)

    expect(output.toJson()).toStrictEqual(entity.toJson())
  })

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await sut.insert(entity)

    const data = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(data).toStrictEqual(entity.toJson())
  })

  it('should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    const newUser = await prismaService.user.create({
      data: entity.toJson(),
    })

    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    expect(entities).toStrictEqual([UserModelMapper.toEntity(newUser)])
  })

  describe('Search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []
      const arrange = Array(16).fill(UserDataBuilder({}))

      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `test${index}@gmail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJson()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams({}))

      const items = searchOutput.items

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      expect(searchOutput.items).toHaveLength(15)

      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@gmail.com`).toBe(item.email)
      })
    })
  })
})
