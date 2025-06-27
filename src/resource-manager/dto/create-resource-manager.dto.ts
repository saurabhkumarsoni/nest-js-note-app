export class CreateResourceManagerDto {
  name: string;
  position: string;
  project: string;
  image?: string;
  reportsToId?: string;
}
