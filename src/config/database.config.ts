import { registerAs } from "@nestjs/config";

export default registerAs('database',()=>({
  url:process.env.DATABASE_URL,
  autoLoadEntities:process.env.DATABASE_AUTOLOADENTITIES === 'true'? true : false,
  synchronize:process.env.DATABASE_SYNCHRONIZE === 'true'? true : false
})) 