export interface CastPersonImage {
  medium: string;
  original: string;
}

export interface CastPerson {
  id: number;
  name: string;
  image?: CastPersonImage;
}

export interface CastMember {
  person: CastPerson;
}
