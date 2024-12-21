import { ComponentType } from 'react';
import { SchemaTypeDefinition } from 'sanity';

declare module 'sanity' {
  interface CustomSchemaTypeDefinition extends Omit<SchemaTypeDefinition, 'icon'> {
    icon?: ComponentType;
  }
}
