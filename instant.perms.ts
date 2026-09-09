import type { InstantRules } from "@instantdb/react";

const OWNER_EMAIL = "vzhurbin@gmail.com";

const rules = {
  entries: {
    allow: {
      view: `auth.email == '${OWNER_EMAIL}'`,
      create: `auth.email == '${OWNER_EMAIL}'`,
      update: `auth.email == '${OWNER_EMAIL}'`,
      delete: `auth.email == '${OWNER_EMAIL}'`,
    },
  },
} satisfies InstantRules;

export default rules;
