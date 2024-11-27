// schemas/table.ts
import { defineField, defineType } from "sanity";
import { LuTable } from "react-icons/lu";

export const table = defineType({
  name: "customTable",
  title: "Table",
  type: "object",
  icon: LuTable,
  fields: [
    defineField({
      name: "rows",
      title: "Table Rows",
      type: "array",
      of: [{
        type: "object",
        name: "row",
        fields: [
          {
            name: "cells",
            type: "array",
            of: [{ type: "string" }]
          }
        ]
      }]
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption",
      description: "Provide an accessible description for this table",
    }),
  ],
  preview: {
    select: {
      caption: "caption",
      rows: "rows"
    },
    prepare({ caption, rows }) {
      return {
        title: caption || "Table",
        subtitle: rows?.length ? `${rows.length} rows` : "Empty table"
      };
    }
  },
});