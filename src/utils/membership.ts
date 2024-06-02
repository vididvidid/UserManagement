// src/utils/membership.ts

export const calculateMembershipEndDate = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // Set membership duration to 1 year
    return endDate;
  };
  