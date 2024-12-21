import { type SchemaTypeDefinition } from 'sanity'
import { schemaTypes } from '../../schemas'

export const schema = {
  types: schemaTypes as SchemaTypeDefinition[],
}
