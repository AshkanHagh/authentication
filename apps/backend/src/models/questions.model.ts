import { uuid, pgTable, text, timestamp, index, smallint } from 'drizzle-orm/pg-core';
import { userTable } from './user.model';
import { relations } from 'drizzle-orm';

export const questionsTable = pgTable('questions', {
    id : uuid('id').primaryKey().defaultRandom(),
    question : text('question').notNull(),
    answer : text('answer').notNull(),
    image : text('image'),
    createdAt : timestamp('created_at').defaultNow(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export const questionOptionsTable = pgTable('question_options', {
    id : uuid('id').primaryKey().defaultRandom(),
    questionId : uuid('question_id').references(() => questionsTable.id).notNull(),
    option : text('option').notNull()
});

export const userAnswersTable = pgTable('user_answers', {
    id : uuid('id').primaryKey().defaultRandom(),
    userId : uuid('user_id').references(() => userTable.id).notNull(),
    questionId : uuid('question_id').references(() => questionsTable.id).notNull(),
    score : smallint('score').notNull().default(0),
    createdAt : timestamp('created_at').defaultNow(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
}, table => ({
    userIdIndex : index('user_id_idx').on(table.userId), questionIdIndex : index('question_id_idx').on(table.questionId),
    userQuestionCompositeIndex : index('user_question_idx').on(table.userId, table.questionId)
}));

export const questionsTableRelations = relations(questionsTable, ({many}) => ({
    userAnswer : many(userAnswersTable),
    options : many(questionOptionsTable)
}));

export const answersTableRelations = relations(userAnswersTable, ({one}) => ({
    user : one(userTable, {
        fields : [userAnswersTable.userId],
        references : [userTable.id]
    }),
    question : one(questionsTable, {
        fields : [userAnswersTable.id],
        references : [questionsTable.id]
    })
}));

export const questionTableRelations = relations(questionOptionsTable, ({one}) => ({
    question : one(questionsTable, {
        fields : [questionOptionsTable.questionId],
        references : [questionsTable.id]
    })
}));