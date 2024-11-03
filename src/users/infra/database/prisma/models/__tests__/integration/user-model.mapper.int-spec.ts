import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-test'

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.user.deleteMany()
    props = {
      id: '4c4360b9-8533-4c50-83fe-340fecc247b4',
      name: 'Jadir',
      email: 'a@a.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throws error when user module is invalid', async () => {
    const model: User = Object.assign(props, { name: null })

    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    })

    const sut = UserModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJson()).toStrictEqual(props)
  })
})
