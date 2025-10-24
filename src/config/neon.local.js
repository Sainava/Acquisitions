// Adjust Neon serverless driver settings when running against Neon Local
// These settings are applied only if NEON_LOCAL=true
import { neonConfig } from '@neondatabase/serverless';

if (process.env.NEON_LOCAL === 'true') {
  // Compose service name for Neon Local is 'neon-local'
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
