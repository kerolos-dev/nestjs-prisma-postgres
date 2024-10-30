import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import  {ObjectSchema}   from 'joi';
@Injectable()
export class JoivalidationPipe implements PipeTransform {
  constructor(private  readonly  schema: ObjectSchema){}
  transform(value: any, metadata: ArgumentMetadata) {

    const  validationResuIt =  this.schema.validate(value , {abortEarly:  true})
    if(validationResuIt.error) throw  new  BadRequestException(validationResuIt.error.details)
    return value;
  }
}
