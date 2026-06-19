import { MATCH_STATUS } from "../validations/matches.validations";

// Get the current status of a match based on its start and end times
export function getMatchStatus(
  startTime: string,
  endTime: string,
  now = new Date(),
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }

  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
}

// Interface for a match object
interface Match {
  startTime: string;
  endTime: string;
  status: string;
}

// Sync the match status based on its start and end times, and update it if necessary
export async function syncMatchStatus(
  match: Match,
  updateStatus: (newStatus: string) => Promise<void>,
) {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);
  if (!nextStatus) {
    return match.status;
  }
  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }
  return match.status;
}
