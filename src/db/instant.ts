import { type InstaQLEntity, i, init } from "@instantdb/react";

// ID for app: Journal
const APP_ID = "9e68910e-a079-4b1e-9e52-571b0c55eebe";

// Optional: Declare your schema!
const schema = i.schema({
  entities: {
    entries: i.entity({
      text: i.string(),
      createdAt: i.string(),
      updatedAt: i.date(),
    }),
  },
});

type Entry = InstaQLEntity<typeof schema, "entries">;

const db = init({
  appId: APP_ID,
  schema,
  devtool: {
    position: "bottom-left",
  },
});

export { db };

export type { Entry };
