import { existsSync } from 'node:fs';
import nodemailer from 'nodemailer';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const provider=process.env.MAIL_PROVIDER || (process.env.RESEND_API_KEY?'resend':'smtp');
const required=['MAIL_FROM','NEXT_PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY',...(provider==='resend'?['RESEND_API_KEY']:['SMTP_HOST','SMTP_USER','SMTP_PASS'])];
let missing=false;
for(const name of required){const present=Boolean(process.env[name]?.trim());console.log(`${present?'SET':'MISSING'} ${name}`);if(!present)missing=true;}
if(!['smtp','resend'].includes(provider)){console.error('MAIL_PROVIDER must be smtp or resend.');missing=true;}
if(provider==='smtp'&&![465,587].includes(Number(process.env.SMTP_PORT||465))){console.error('SMTP_PORT must be 465 (TLS) or 587 (STARTTLS).');missing=true;}
if(missing){console.error('Email submission is not ready for production. Complete the missing environment settings; no secrets were printed.');process.exitCode=1;}
else if(process.argv.includes('--verify-smtp')&&provider==='smtp'){
  const port=Number(process.env.SMTP_PORT||465);
  const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port===587,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:5000,greetingTimeout:5000,socketTimeout:8000});
  try{await transport.verify();console.log('SMTP connection and authentication passed. No email was sent.');}
  catch{console.error('SMTP verification failed. Check the provider hostname, port and credentials.');process.exitCode=1;}
  finally{transport.close();}
}else{console.log('Required settings are present. Submit one real enquiry after deploying to confirm inbox delivery.');}
