export const JOB_APPLICATION_STATUS = {
    SUBMITTED: 'submitted',
    SHORTLISTED: 'shortlisted',
    INTERVIEWING: 'interviewing',
    OFFER: 'offer',
    HIRED: 'hired',
    REJECTED: 'rejected'
};

const jobApplicationStateMachine = {
    [JOB_APPLICATION_STATUS.SUBMITTED]: {
        SHORTLIST: JOB_APPLICATION_STATUS.SHORTLISTED,
        REJECT: JOB_APPLICATION_STATUS.REJECTED
    },
    [JOB_APPLICATION_STATUS.SHORTLISTED]: {
        SCHEDULE_INTERVIEW: JOB_APPLICATION_STATUS.INTERVIEWING,
        REJECT: JOB_APPLICATION_STATUS.REJECTED
    },
    [JOB_APPLICATION_STATUS.INTERVIEWING]: {
        MAKE_OFFER: JOB_APPLICATION_STATUS.OFFER,
        REJECT: JOB_APPLICATION_STATUS.REJECTED
    },
    [JOB_APPLICATION_STATUS.OFFER]: {
        ACCEPT_OFFER: JOB_APPLICATION_STATUS.HIRED,
        REJECT: JOB_APPLICATION_STATUS.REJECTED
    },
    [JOB_APPLICATION_STATUS.HIRED]: {},
    [JOB_APPLICATION_STATUS.REJECTED]: {}
};

/**
 * Changes a job application's state based on a specific action.
 * @param {string} currentState The application's current status.
 * @param {string} action The event to trigger the status change.
 * @returns {string} The new state after a successful transition.
 * @throws {Error} If the state transition is invalid.
 */
export const changeJobApplicationState = (currentState, action) => {
    const nextState = jobApplicationStateMachine[currentState]?.[action];
    if (!nextState) {
        throw new Error(`Invalid action '${action}' for current application status '${currentState}'.`);
    }
    return nextState;
}