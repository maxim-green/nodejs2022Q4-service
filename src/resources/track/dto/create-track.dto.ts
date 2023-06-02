import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId?: string; // refers to Artist

  @IsUUID()
  @IsOptional()
  albumId?: string; // refers to Album

  @IsInt()
  duration: number; // integer number
}
