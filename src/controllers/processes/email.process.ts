import { Job } from "bull";
import sendEmail from "../../services/email.service";

const emailProcess = async (job: Job) => {
  await sendEmail(job.data);
};

export default emailProcess;
