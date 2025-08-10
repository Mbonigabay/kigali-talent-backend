// Define constants for job states.
export const JOB_STATE = {
    ACTIVE: 1,
    INACTIVE: 0
};

// Define constants for job statuses.
export const JOB_STATUS = {
    CREATED: 'created',
    PUBLISHED: 'published',
    CLOSED_FOR_APPLICATION: 'closedForApplication',
    SHORTLISTED: 'shortlisted',
    INTERVIEW: 'interview',
    OFFER_SENT: 'offerSent',
    CLOSED: 'closed'
};

// Define the job status state machine.
// This object maps a job's current status to the events that can be triggered
// and the resulting new status.
const jobStateMachine = {
    [JOB_STATUS.CREATED]: {
        PUBLISH: JOB_STATUS.PUBLISHED,
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.PUBLISHED]: {
        CLOSE_FOR_APPLICATION: JOB_STATUS.CLOSED_FOR_APPLICATION,
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.CLOSED_FOR_APPLICATION]: {
        SHORTLIST: JOB_STATUS.SHORTLISTED,
        INTERVIEW: JOB_STATUS.INTERVIEW,
        OFFER_SENT: JOB_STATUS.OFFER_SENT,
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.SHORTLISTED]: {
        INTERVIEW: JOB_STATUS.INTERVIEW,
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.INTERVIEW]: {
        OFFER_SENT: JOB_STATUS.OFFER_SENT,
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.OFFER_SENT]: {
        CLOSE: JOB_STATUS.CLOSED
    },
    [JOB_STATUS.CLOSED]: {} // No events can change the status from 'closed'
};

/**
 * Checks if a status transition is valid for a given action.
 * @param {string} currentState The job's current status.
 * @param {string} action The event to trigger the status change.
 * @returns {string|null} The next state if the transition is valid, otherwise null.
 */
const checkTransition = (currentState, action) => {
    return jobStateMachine[currentState]?.[action] || null;
};

/**
 * Changes a job's state based on a specific action.
 * @param {string} currentState The job's current status.
 * @param {string} action The event to trigger the status change.
 * @returns {string} The new state after a successful transition.
 * @throws {Error} If the state transition is invalid.
 */
export const changeState = (currentState, action) => {
    const nextState = checkTransition(currentState, action);
    if (!nextState) {
        throw new Error(`Invalid action '${action}' for current job status '${currentState}'.`);
    }
    return nextState;
};
