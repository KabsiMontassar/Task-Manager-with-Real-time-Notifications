import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;
}



export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateTaskOrderDto {
  @IsNumber()
  @IsNotEmpty()
  order: number;
}


