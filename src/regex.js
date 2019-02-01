const field = /\<field>.+\<\/field>/
const aggregate = /\<columns>\s+\<aggregateTypes>.+\<\/aggregateTypes>\s+\<field>.+\<\/field>\s+\<\/columns>/g

const groupingsDown = /\<groupingsDown>\s+\<dateGranularity>.+\<\/dateGranularity>\s+\<field>.+\<\/field>\s+\<sortOrder>.+\<\/sortOrder>\s+\<\/groupingsDown>/g
const groupingsAcross = /\<groupingsAcross>\s+\<dateGranularity>.+\<\/dateGranularity>\s+\<field>.+\<\/field>\s+\<sortOrder>.+\<\/sortOrder>\s+\<\/groupingsAcross>/g

module.exports = {
  field,
  aggregate,
  groupingsDown,
  groupingsAcross
}