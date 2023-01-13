import Bull, { Job } from "bull";
import emailProcess from "../processes/email.process";
import * as dotenv from "dotenv";
dotenv.config();

const emailQueue = new Bull("email", process.env.REDIS_URL as string);

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
