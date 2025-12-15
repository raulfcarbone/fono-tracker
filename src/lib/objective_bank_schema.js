import { z } from 'zod';

/**
 * @typedef {Object} GASLevel
 * @property {string} level - The GAS level (e.g., '5', '4', '3', '2', '1')
 * @property {string} description - Description of the performance level
 * @property {string} criteria - Specific criteria for this level
 */

/**
 * @typedef {Object} GASScale
 * @property {string} id - Unique identifier for the GAS scale
 * @property {string} goalId - Associated goal identifier
 * @property {GASLevel} level5 - Follow-up level 5 definition
 * @property {GASLevel} level4 - Follow-up level 4 definition
 * @property {GASLevel} level3 - Follow-up level 3 definition (baseline)
 * @property {GASLevel} level2 - Follow-up level 2 definition
 * @property {GASLevel} level1 - Follow-up level 1 definition
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} AgeGroup
 * @property {string} id - Unique identifier for the age group
 * @property {string} name - Display name (e.g., 'Infants', 'Toddlers', 'Preschool')
 * @property {number} minMonths - Minimum age in months
 * @property {number} maxMonths - Maximum age in months
 * @property {string} description - Description of developmental characteristics
 * @property {string[]} milestones - Key developmental milestones for this age group
 */

/**
 * @typedef {Object} DiscourseType
 * @property {string} id - Unique identifier for the discourse type
 * @property {string} name - Display name (e.g., 'Phonology', 'Pragmatics', 'Semantics')
 * @property {string} code - Short code identifier (e.g., 'PHON', 'PRAG', 'SEM')
 * @property {string} description - Detailed description of the discourse type
 * @property {string} color - Hex color code for UI representation
 */

/**
 * @typedef {Object} Objective
 * @property {string} id - Unique identifier for the objective
 * @property {string} code - Reference code (e.g., 'OBJ-001')
 * @property {string} title - Brief title of the objective
 * @property {string} description - Detailed description of the objective
 * @property {string} discourseType - Discourse type ID this objective belongs to
 * @property {string[]} ageGroupIds - Array of age group IDs this objective is suitable for
 * @property {number} difficulty - Difficulty level (1-5, 1=easy, 5=very difficult)
 * @property {string[]} keywords - Tags for searching and filtering
 * @property {string} expectedOutcome - Description of expected outcome when objective is met
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ObjectiveBank
 * @property {string} id - Unique identifier for the objective bank
 * @property {string} name - Name of the objective bank
 * @property {string} version - Version number
 * @property {DiscourseType[]} discourseTypes - Array of available discourse types
 * @property {AgeGroup[]} ageGroups - Array of available age groups
 * @property {Objective[]} objectives - Array of objectives
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

// Zod Schemas

export const GASLevelSchema = z.object({
  level: z.string().min(1, 'Level identifier is required'),
  description: z.string().min(1, 'Description is required'),
  criteria: z.string().min(1, 'Criteria is required'),
});

export const GASScaleSchema = z.object({
  id: z.string().min(1, 'GAS scale ID is required'),
  goalId: z.string().min(1, 'Goal ID is required'),
  level5: GASLevelSchema,
  level4: GASLevelSchema,
  level3: GASLevelSchema,
  level2: GASLevelSchema,
  level1: GASLevelSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AgeGroupSchema = z.object({
  id: z.string().min(1, 'Age group ID is required'),
  name: z.string().min(1, 'Age group name is required').max(50, 'Name too long'),
  minMonths: z.number().int().min(0, 'Minimum age cannot be negative'),
  maxMonths: z.number().int().min(0, 'Maximum age cannot be negative'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  milestones: z.array(z.string().min(1, 'Milestone cannot be empty')).min(0),
});

export const DiscourseTypeSchema = z.object({
  id: z.string().min(1, 'Discourse type ID is required'),
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  code: z.string().min(1, 'Code is required').max(10, 'Code too long').regex(/^[A-Z0-9_]+$/, 'Code must be uppercase alphanumeric with underscores'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'),
});

export const ObjectiveSchema = z.object({
  id: z.string().min(1, 'Objective ID is required'),
  code: z.string().min(1, 'Code is required').regex(/^[A-Z]+-\d{3,}$/, 'Code format should be like OBJ-001'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  discourseType: z.string().min(1, 'Discourse type is required'),
  ageGroupIds: z.array(z.string().min(1)).min(1, 'At least one age group must be selected'),
  difficulty: z.number().int().min(1, 'Difficulty must be at least 1').max(5, 'Difficulty cannot exceed 5'),
  keywords: z.array(z.string().min(1).max(30)).min(0).max(10, 'Maximum 10 keywords allowed'),
  expectedOutcome: z.string().min(1, 'Expected outcome is required').max(500, 'Expected outcome too long'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ObjectiveBankSchema = z.object({
  id: z.string().min(1, 'Objective bank ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g., 1.0.0)'),
  discourseTypes: z.array(DiscourseTypeSchema).min(1, 'At least one discourse type is required'),
  ageGroups: z.array(AgeGroupSchema).min(1, 'At least one age group is required'),
  objectives: z.array(ObjectiveSchema).min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Validates a GAS scale object
 * @param {*} data - Data to validate
 * @returns {Promise<GASScale>} Validated GAS scale
 * @throws {z.ZodError} If validation fails
 */
export async function validateGASScale(data) {
  return GASScaleSchema.parseAsync(data);
}

/**
 * Validates an age group object
 * @param {*} data - Data to validate
 * @returns {Promise<AgeGroup>} Validated age group
 * @throws {z.ZodError} If validation fails
 */
export async function validateAgeGroup(data) {
  return AgeGroupSchema.parseAsync(data);
}

/**
 * Validates a discourse type object
 * @param {*} data - Data to validate
 * @returns {Promise<DiscourseType>} Validated discourse type
 * @throws {z.ZodError} If validation fails
 */
export async function validateDiscourseType(data) {
  return DiscourseTypeSchema.parseAsync(data);
}

/**
 * Validates an objective object
 * @param {*} data - Data to validate
 * @returns {Promise<Objective>} Validated objective
 * @throws {z.ZodError} If validation fails
 */
export async function validateObjective(data) {
  return ObjectiveSchema.parseAsync(data);
}

/**
 * Validates a complete objective bank
 * @param {*} data - Data to validate
 * @returns {Promise<ObjectiveBank>} Validated objective bank
 * @throws {z.ZodError} If validation fails
 */
export async function validateObjectiveBank(data) {
  return ObjectiveBankSchema.parseAsync(data);
}

/**
 * Safely validates data without throwing errors
 * @param {*} data - Data to validate
 * @returns {{success: boolean, data?: ObjectiveBank, errors?: Object}}
 */
export function safeValidateObjectiveBank(data) {
  const result = ObjectiveBankSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.flatten() };
}

/**
 * Validates multiple objectives
 * @param {*} data - Array of objectives to validate
 * @returns {Promise<Objective[]>} Validated objectives
 * @throws {z.ZodError} If validation fails
 */
export async function validateObjectives(data) {
  return z.array(ObjectiveSchema).parseAsync(data);
}

/**
 * Validates multiple age groups
 * @param {*} data - Array of age groups to validate
 * @returns {Promise<AgeGroup[]>} Validated age groups
 * @throws {z.ZodError} If validation fails
 */
export async function validateAgeGroups(data) {
  return z.array(AgeGroupSchema).parseAsync(data);
}

/**
 * Validates multiple discourse types
 * @param {*} data - Array of discourse types to validate
 * @returns {Promise<DiscourseType[]>} Validated discourse types
 * @throws {z.ZodError} If validation fails
 */
export async function validateDiscourseTypes(data) {
  return z.array(DiscourseTypeSchema).parseAsync(data);
}
