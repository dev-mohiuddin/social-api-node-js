import os from 'os';
import { cpuUsage, env, memoryUsage } from 'process';

export default {
    getSystemHelth: () => {
        return {
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            cpuUsage: os.loadavg(),
            networkInterfaces: os.networkInterfaces()
        }
    },
    
    getApplicationHelth: () => {
        return {
            env: process.env.ENV,
            version: process.version,
            platform: process.platform,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            memoryUsage : {
                heapTotal: `${(memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed : `${(memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            }
        }
    }

}