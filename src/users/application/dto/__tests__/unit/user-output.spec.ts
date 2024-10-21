import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
  it('Should convert a user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJson = jest.spyOn(entity, 'toJson')
    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJson())
  })
})
