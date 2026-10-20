import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth / Local Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'), // 'super_admin' | 'admin' | 'user'
  password: text('password'),
  phone: text('phone'),
  gender: text('gender'),
  dob: text('dob'),
  tob: text('tob'),
  pob: text('pob'),
  isSuperAdmin: text('is_super_admin').default('false'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Saved Love Calculator compatibility readings
export const loveReadings = pgTable('love_readings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  partner1Name: text('partner1_name').notNull(),
  partner1Dob: text('partner1_dob'),
  partner1Sign: text('partner1_sign').notNull(),
  partner2Name: text('partner2_name').notNull(),
  partner2Dob: text('partner2_dob'),
  partner2Sign: text('partner2_sign').notNull(),
  compatibilityScore: integer('compatibility_score').notNull(),
  verdict: text('verdict').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders (e.g. ₹49 Deep Love Reading, wallet recharges)
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  itemType: text('item_type').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('INR'),
  status: text('status').default('completed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userName: text('user_name').notNull(),
  userLocation: text('user_location').notNull(),
  rating: integer('rating').notNull().default(5),
  comment: text('comment').notNull(),
  expertName: text('expert_name').notNull(),
  consultationType: text('consultation_type').notNull(),
  language: text('language').default('English'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  loveReadings: many(loveReadings),
  orders: many(orders),
}));

export const loveReadingsRelations = relations(loveReadings, ({ one }) => ({
  user: one(users, {
    fields: [loveReadings.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
