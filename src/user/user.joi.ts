import  *  as  Joi  from  'joi'





export  const   signupSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:  Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone: Joi.string(),
    gender: Joi.string().valid('male', 'female', '').default('male'),
})