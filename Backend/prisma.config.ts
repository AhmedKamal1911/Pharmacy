import type { PrismaConfig } from "@prisma/config";

const config: PrismaConfig = {
  schema: "./prisma/schema.prisma",

  datasource: {
    url: process.env.DATABASE_URL || "file:./data/pharmacy.db",
  },
};

export default config;
