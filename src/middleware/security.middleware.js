import aj from "#config/arcjet.js";
import { slidingWindow } from "@arcjet/node";
import logger from "#config/logger.js";

const securityMiddleware = async (req, res, next) => {
    // Ensure req.ip is set in test environment to avoid ArcJet fingerprinting errors
    if (process.env.NODE_ENV === 'test') {
        req.ip = req.ip || '127.0.0.1';
    }
    try{
        const role=req.user?.role || 'guest';

        let limit ;
        let message;

        switch(role){
            case 'admin':
                limit=20
                message='Admin rate limit exceeded (20 per minute) slow down please';
            break;
            case 'user':
                limit=10
                message='User rate limit exceeded (10 per minute) slow down please';
            break;
            case 'guest':
                limit=5
                message='Guest rate limit exceeded (5 per minute) slow down please';
            break;
        }

        const client=aj.withRule(slidingWindow({
            mode: "LIVE",
            interval : "1m",
            max:limit,
            name:`Rate limit for role: ${role}`,
        }));

        const decision = await client.protect(req);

        if(decision.isDenied() && decision.reason.isBot()){
            logger.warn('Request blocked as bot detected', { ip: req.ip, userAgent:req.get('User-Agent'),path:req.path,reason: decision.reason.toString() });
            return res.status(403).json({ error: 'Forbidden' , message:'Automated request are not allowed'});
        }

        if(decision.isDenied() && decision.reason.isShield()){
            logger.warn('Request blocked as shield detected', { ip: req.ip, userAgent:req.get('User-Agent'),path:req.path,method:req.method,reason: decision.reason.toString() });
            return res.status(403).json({ error: 'Forbidden' , message:'Request blocked due to security policy'});
        }

        if(decision.isDenied() && decision.reason.isRateLimit()){
            logger.warn('Request blocked as rate limit exceeded', { ip: req.ip, userAgent:req.get('User-Agent'),path:req.path,method:req.method,reason: decision.reason.toString() });
            return res.status(403).json({ error: 'Forbidden' , message:'Too many requests, please try again later'});
        }

        next();

    }catch(e){
        console.error('Arcjet middleware error', e);
        res.status(500).json({ error: 'Internal Server Error' ,message:'Something went wrong in security middleware'});
    }
}

export default securityMiddleware;