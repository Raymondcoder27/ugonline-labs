export const Themes: readonly [
  "primary",
  "success",
  "info",
  "warning",
  "danger",
] = ["primary", "success", "info", "warning", "danger"] as const;

export const FilterOperatorTypeList: readonly [
  "CONTAINS",
  "STARTS_WITH",
  "ENDS_WITH",

  "EQUAL_TO",
  "NOT_EQUAL_TO",

  "GREATER_THAN",
  "LESS_THAN",
  "GREATER_THAN_OR_EQUAL_TO",
  "LESS_THAN_OR_EQUAL_TO",

  "IS_NULL",
  "IS_NOT_NULL"
] = [
  "CONTAINS",
  "STARTS_WITH",
  "ENDS_WITH",

  "EQUAL_TO",
  "NOT_EQUAL_TO",

  "GREATER_THAN",
  "LESS_THAN",
  "GREATER_THAN_OR_EQUAL_TO",
  "LESS_THAN_OR_EQUAL_TO",

  "IS_NULL",
  "IS_NOT_NULL"
] as const

export const FilterSortDirectionList: readonly ["ASC", "DESC"] = ["ASC", "DESC"] as const