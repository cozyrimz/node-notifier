import Joi from 'joi'
import validateFn, { reqTargetTypes } from './validationFn'

export const getActualsDataValidation = (req, res, next) => {
  const schema = Joi.object({
    limit: Joi.number().min(0),
    skip: Joi.number().min(0),
  })

  validateFn(req, res, next, schema, reqTargetTypes.QUERY)
}
