import { toBN } from 'web3x/utils'
import { Authorization, AuthorizationType } from './types'

export function getTokenAmountToApprove(): ReturnType<typeof toBN> {
  return toBN(2)
    .pow(toBN(256))
    .sub(toBN(1))
}

export function hasAuthorization(
  authorizations: Authorization[],
  authorizationToFind: Authorization
) {
  return authorizations.some(authorization =>
    areEqual(authorization, authorizationToFind)
  )
}

export function areEqual(left: Authorization, right: Authorization) {
  return (
    left.type === right.type &&
    left.authorizedAddress.toLowerCase() ===
      right.authorizedAddress.toLowerCase() &&
    left.contractAddress.toLowerCase() ===
      right.contractAddress.toLowerCase() &&
    left.chainId === right.chainId &&
    left.address.toLowerCase() === right.address.toLowerCase()
  )
}

export function isValidType(type: string) {
  return Object.values<string>(AuthorizationType).includes(type)
}
