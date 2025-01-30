import { type IGoFilter } from "@/types"

export function useGoRequest() {
  type TGoFilter = IGoFilter
  const prepareQuery = (goFilter: TGoFilter, prefix: string = "") => {
    let payload = ""
    payload += prefix

    if (goFilter.sort !== undefined) {
      goFilter.sort.forEach((entry) => {
        payload +=
          payload.length === 0 ? "?sort_" + entry.field + "=" + entry.order.toLowerCase() : "&sort_" + entry.field + "=" + entry.order.toLowerCase()
      })
    }

    if (goFilter.filter !== undefined) {
      goFilter.filter.forEach((entry) => {
        if (String(entry.operand).trim().length > 0) {
          switch (entry.operator) {
            case "CONTAINS":
              payload += payload.length === 0 ? `?~${entry.field}~=${entry.operand}` : `&~${entry.field}~=${entry.operand}`
              break

            case "STARTS_WITH":
              payload += payload.length === 0 ? `?${entry.field}~=${entry.operand}` : `&${entry.field}~=${entry.operand}`
              break

            case "ENDS_WITH":
              payload += payload.length === 0 ? `?~${entry.field}=${entry.operand}` : `&~${entry.field}=${entry.operand}`
              break

            case "EQUAL_TO":
              payload += payload.length === 0 ? `?${entry.field}=${entry.operand}` : `&${entry.field}=${entry.operand}`
              break

            case "NOT_EQUAL_TO":
              payload += payload.length === 0 ? `?${entry.field}_not=${entry.operand}` : `&${entry.field}_not=${entry.operand}`
              break

            case "GREATER_THAN":
              payload += payload.length === 0 ? `?${entry.field}_gt=${entry.operand}` : `&${entry.field}_gt=${entry.operand}`
              break

            case "LESS_THAN":
              payload += payload.length === 0 ? `?${entry.field}_lt=${entry.operand}` : `&${entry.field}_lt=${entry.operand}`
              break

            case "GREATER_THAN_OR_EQUAL_TO":
              payload += payload.length === 0 ? `?${entry.field}_gte=${entry.operand}` : `&${entry.field}_gte=${entry.operand}`
              break

            case "LESS_THAN_OR_EQUAL_TO":
              payload += payload.length === 0 ? `?${entry.field}_lte=${entry.operand}` : `&${entry.field}_lte=${entry.operand}`
              break

            case "IS_NULL":
              payload += payload.length === 0 ? `?${entry.field}_null=true` : `&${entry.field}_null=true`
              break

            case "IS_NOT_NULL":
              payload += payload.length === 0 ? `?${entry.field}_null=false` : `&${entry.field}_null=false`
              break
          }
        }
      })
    }

    if (goFilter.limit !== undefined) {
      payload += payload.length === 0 ? "?limit=" + goFilter.limit : "&limit=" + goFilter.limit
    }

    if (goFilter.offset !== undefined) {
      payload += payload.length === 0 ? "?offset=" + goFilter.offset : "&offset=" + goFilter.offset
    }

    if (goFilter.page !== undefined) {
      payload += payload.length === 0 ? "?page=" + goFilter.page : "&page=" + goFilter.page
    }

    return payload
  }

  return {
    prepareQuery
  }
}
