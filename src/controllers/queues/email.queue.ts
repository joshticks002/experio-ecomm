import Bull, { Job } from "bull";
import emailProcess from "../processes/email.process";
import * as dotenv from "dotenv";
dotenv.config();

const emailQueue = new Bull("email", {
  redis: process.env.REDIS_URL,
  limiter: {
    max: 1000,
    duration: 5000,
  },
});

emailQueue.process(emailProcess);
emailQueue.on("completed", (job: Job) => {
  console.log(`Job completed`);
});

const sendEmailJob = (data: Record<any, string>) => {
  emailQueue.add(data, {
    attempts: 2,
  });
};

export default sendEmailJob;
