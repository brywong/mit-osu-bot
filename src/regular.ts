/*** Bot's regular functions ***/

const ADMIN_UIDS = [401460835232382986,151462465404796929]

/** WYSI at 727 ET counter */
function detectWysi(mid: number) : boolean {
    return false;
}

/** Checks if a user is admin */
function checkIsAdmin(uid: number) : boolean {
    return ADMIN_UIDS.includes(uid);
}