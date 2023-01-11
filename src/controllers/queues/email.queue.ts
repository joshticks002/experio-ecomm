import Bull from "bull";
import emailProcess from "../processes/email.process";
import redisClient from "../../utils/cache-loaders/redis-connect";

const emailQueue = new Bull("email", {
  redis: redisClient,
  limiter: {
    max: 1000,
    duration: 5000,
  },
});

emailQueue.process(emailProcess);

const sendEmailJob = (data: Record<any, string>) => {
  emailQueue.add(data, {
    attempts: 2,
  });
};

export default sendEmailJob;
