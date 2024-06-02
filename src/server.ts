
import app from './app';
import dotenv from 'dotenv';
import updateMembershipStatus from './jobs/membershipJobs';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Server started on port ${PORT}`);

  updateMembershipStatus();
});